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
    estimated   = float(valuation['estimated_value'])
    area        = float(data.get('area_sqft', 1))
    asking      = float(data.get('asking_price', 0))
    asking_sqft = asking / max(area, 1)
    est_sqft    = estimated / max(area, 1)
    price_ratio = asking_sqft / max(est_sqft, 1)
    return [[
        est_sqft, area,
        float(data.get('ownership_changes', data.get('num_ownership_changes', 0))),
        float(data.get('years_held', 1)),
        price_ratio,
        float(int(bool(data.get('legal_disputes', False)))),
        float(int(bool(data.get('flood_zone', False)))),
    ]]


def detect_fraud(data, valuation):
    if _iso_forest is None:
        _load_model()

    signals   = []
    estimated = float(valuation['estimated_value'])
    asking    = float(data.get('asking_price', 0))
    area      = float(data.get('area_sqft', 1))
    oc        = int(data.get('ownership_changes', data.get('num_ownership_changes', 0)))
    yh        = int(data.get('years_held', 1))

    if estimated > 0 and asking < estimated * 0.5:
        signals.append({
            'type': 'extreme_underpricing',
            'detail': 'Asking price is %d%% below AI estimated value' % round((1 - asking/estimated)*100),
            'severity': 'HIGH'
        })

    if oc >= 3 and yh <= 3:
        signals.append({
            'type': 'rapid_ownership_churn',
            'detail': '%d ownership changes in %d years' % (oc, yh),
            'severity': 'HIGH'
        })

    if bool(data.get('legal_disputes')) and asking < estimated * 0.85:
        signals.append({
            'type': 'sale_during_dispute',
            'detail': 'Property listed below market while under legal dispute',
            'severity': 'CRITICAL'
        })

    zone_floors = {'commercial': 3000, 'industrial': 2000, 'residential': 2500, 'agricultural': 500}
    floor       = zone_floors.get(str(data.get('zone', data.get('land_type', 'residential'))), 2500)
    price_sqft  = asking / area if area > 0 else 0
    if 0 < price_sqft < floor:
        signals.append({
            'type': 'below_market_floor',
            'detail': 'Price/sqft Rs.%d is below zone floor Rs.%d' % (round(price_sqft), floor),
            'severity': 'MEDIUM'
        })

    if oc >= 2 and yh <= 2 and asking > estimated * 1.3:
        signals.append({
            'type': 'quick_flip_inflation',
            'detail': 'Multiple transfers in %d years with %d%% price inflation' % (yh, round((asking/estimated-1)*100)),
            'severity': 'HIGH'
        })

    anomaly_score = None
    is_anomaly    = False
    if _iso_forest is not None:
        try:
            X         = _anomaly_features(data, valuation)
            pred      = _iso_forest.predict(X)[0]
            raw_score = float(_iso_forest.decision_function(X)[0])
            anomaly_score = float(round(max(0.0, min(100.0, (0.3 - raw_score) / 0.6 * 100)), 1))
            is_anomaly    = bool(pred == -1)
            if is_anomaly and anomaly_score > 60:
                signals.append({
                    'type': 'ml_anomaly_detected',
                    'detail': 'IsolationForest anomaly score: %.1f/100' % anomaly_score,
                    'severity': 'HIGH' if anomaly_score > 75 else 'MEDIUM'
                })
        except Exception:
            pass

    rule_prob      = min(1.0, len(signals) / 5.0)
    fraud_prob     = float(round(0.6 * rule_prob + 0.4 * (anomaly_score / 100.0), 3)) if anomaly_score is not None else float(round(rule_prob, 3))
    critical       = any(s['severity'] == 'CRITICAL' for s in signals)
    fraud_detected = bool(len(signals) > 0 or is_anomaly)

    return {
        'fraud_detected':    fraud_detected,
        'signal_count':      int(len(signals)),
        'signals':           signals,
        'fraud_risk':        'CRITICAL' if critical else ('HIGH' if len(signals) >= 2 else ('MEDIUM' if len(signals) == 1 else 'LOW')),
        'fraud_probability': fraud_prob,
        'anomaly_score':     anomaly_score,
        'ml_model':          'IsolationForest' if _iso_forest else 'rule_based',
    }
