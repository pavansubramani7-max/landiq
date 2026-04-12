"""
Fraud Detection Module
Primary: IsolationForest anomaly detector (ML)
Secondary: 5 rule-based signal detectors
Combined score for final fraud probability
"""
import os
import joblib
import numpy as np

TRAINED_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'trained')

_iso_forest = None


def _load_model():
    global _iso_forest
    path = os.path.join(TRAINED_DIR, 'anomaly_detector.pkl')
    if os.path.exists(path):
        _iso_forest = joblib.load(path)


def _anomaly_features(data, valuation):
    """Build feature vector for IsolationForest."""
    estimated  = valuation['estimated_value']
    area       = float(data.get('area_sqft', 1))
    asking     = float(data.get('asking_price', 0))
    asking_sqft = asking / max(area, 1)
    est_sqft    = estimated / max(area, 1)
    price_ratio = asking_sqft / max(est_sqft, 1)
    return [[
        est_sqft,
        area,
        float(data.get('ownership_changes', data.get('num_ownership_changes', 0))),
        float(data.get('years_held', 1)),
        price_ratio,
        float(int(data.get('legal_disputes', False))),
        float(int(data.get('flood_zone', False))),
    ]]


def detect_fraud(data, valuation):
    if _iso_forest is None:
        _load_model()

    signals   = []
    estimated = valuation['estimated_value']
    asking    = float(data.get('asking_price', 0))
    area      = float(data.get('area_sqft', 1))
    oc        = int(data.get('ownership_changes', data.get('num_ownership_changes', 0)))
    yh        = int(data.get('years_held', 1))

    # ── Rule-based signals ────────────────────────────────────────────────────
    # 1. Extreme underpricing
    if estimated > 0 and asking < estimated * 0.5:
        signals.append({
            'type': 'extreme_underpricing',
            'detail': f'Asking price is {round((1 - asking/estimated)*100)}% below AI estimated value',
            'severity': 'HIGH'
        })

    # 2. Rapid ownership churn
    if oc >= 3 and yh <= 3:
        signals.append({
            'type': 'rapid_ownership_churn',
            'detail': f'{oc} ownership changes in {yh} years — suspicious transfer pattern',
            'severity': 'HIGH'
        })

    # 3. Sale during legal dispute
    if data.get('legal_disputes') and asking < estimated * 0.85:
        signals.append({
            'type': 'sale_during_dispute',
            'detail': 'Property listed below market value while under active legal dispute',
            'severity': 'CRITICAL'
        })

    # 4. Below Bangalore market floor
    zone_floors = {'commercial': 3000, 'industrial': 2000, 'residential': 2500, 'agricultural': 500}
    floor       = zone_floors.get(data.get('zone', data.get('land_type', 'residential')), 2500)
    price_sqft  = asking / area if area > 0 else 0
    if 0 < price_sqft < floor:
        signals.append({
            'type': 'below_market_floor',
            'detail': f'Price/sqft Rs.{round(price_sqft):,} is below Bangalore zone floor Rs.{floor:,}',
            'severity': 'MEDIUM'
        })

    # 5. Quick flip inflation
    if oc >= 2 and yh <= 2 and asking > estimated * 1.3:
        signals.append({
            'type': 'quick_flip_inflation',
            'detail': f'Multiple transfers in {yh} years with {round((asking/estimated-1)*100)}% price inflation',
            'severity': 'HIGH'
        })

    # ── ML Anomaly Detection ──────────────────────────────────────────────────
    anomaly_score = None
    is_anomaly    = False
    if _iso_forest is not None:
        try:
            X = _anomaly_features(data, valuation)
            pred          = _iso_forest.predict(X)[0]
            raw_score     = float(_iso_forest.decision_function(X)[0])
            # Normalize: more negative = more anomalous
            anomaly_score = round(max(0, min(100, (0.3 - raw_score) / 0.6 * 100)), 1)
            is_anomaly    = pred == -1
            if is_anomaly and anomaly_score > 60:
                signals.append({
                    'type': 'ml_anomaly_detected',
                    'detail': f'IsolationForest anomaly score: {anomaly_score}/100 — statistical outlier in price/ownership pattern',
                    'severity': 'HIGH' if anomaly_score > 75 else 'MEDIUM'
                })
        except Exception:
            pass

    # ── Final fraud probability ───────────────────────────────────────────────
    rule_prob = min(1.0, len(signals) / 5)
    if anomaly_score is not None:
        fraud_prob = round(0.6 * rule_prob + 0.4 * (anomaly_score / 100), 3)
    else:
        fraud_prob = round(rule_prob, 3)

    critical = any(s['severity'] == 'CRITICAL' for s in signals)
    fraud_detected = len(signals) > 0 or is_anomaly

    return {
        'fraud_detected':    fraud_detected,
        'signal_count':      len(signals),
        'signals':           signals,
        'fraud_risk':        'CRITICAL' if critical else ('HIGH' if len(signals) >= 2 else ('MEDIUM' if len(signals) == 1 else 'LOW')),
        'fraud_probability': fraud_prob,
        'anomaly_score':     anomaly_score,
        'ml_model':          'IsolationForest' if _iso_forest else 'rule_based',
    }
