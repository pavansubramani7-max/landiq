"""
Risk Analysis Module
Primary: GradientBoosting Classifier (ML model)
Fallback: Rule-based weighted scoring
"""
import os
import joblib
import numpy as np

TRAINED_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'trained')

ZONES = ['residential', 'commercial', 'agricultural', 'industrial']
INFRA = ['excellent', 'good', 'average', 'poor']
RISK_LABELS = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH', 3: 'CRITICAL'}

LOCALITY_MARKET_RISK = {
    'MG Road': 15, 'Brigade Road': 15, 'Lavelle Road': 18, 'Koramangala': 20,
    'Indiranagar': 20, 'Sadashivanagar': 18, 'Jayanagar': 18, 'Malleshwaram': 18,
    'Basavanagudi': 18, 'HSR Layout': 22, 'JP Nagar': 22, 'BTM Layout': 22,
    'Rajajinagar': 22, 'Whitefield': 25, 'Marathahalli': 25, 'ITPL': 22,
    'Hebbal': 25, 'Yeshwanthpur': 25, 'Banashankari': 22, 'Nagawara': 25,
    'Sarjapur Road': 28, 'Bellandur': 30, 'KR Puram': 28, 'Thanisandra': 28,
    'Electronic City': 28, 'Yelahanka': 30, 'Hoodi': 28, 'Varthur': 35,
    'Peenya': 32, 'Kanakapura Road': 30, 'Bannerghatta Road': 28,
    'Devanahalli': 35, 'Hoskote': 38, 'Anekal': 40, 'Attibele': 42,
    'Doddaballapur': 42, 'Chandapura': 38,
}

HIGH_FLOOD_LOCALITIES = {
    'Bellandur', 'Varthur', 'Marathahalli', 'KR Puram', 'Hebbal',
    'Nagawara', 'Thanisandra', 'Hoodi', 'Mahadevapura'
}

_risk_clf = None


def _load_classifier():
    global _risk_clf
    path = os.path.join(TRAINED_DIR, 'risk_classifier.pkl')
    if os.path.exists(path):
        _risk_clf = joblib.load(path)


def _encode(val, options):
    arr = [0] * len(options)
    if val in options:
        arr[options.index(val)] = 1
    return arr


def _build_features(data):
    near_metro     = int(float(data.get('distance_metro_km', 2.0)) < 1.5)
    near_tech_park = int(bool(data.get('near_tech_park', False)) or
                         data.get('zone', '') == 'commercial')
    feats = [
        float(data.get('area_sqft', 0)),
        float(data.get('distance_highway_km', data.get('dist_highway_km', 5))),
        float(data.get('distance_city_center_km', 10)),
        float(data.get('distance_water_km', 3)),
        float(data.get('ownership_changes', data.get('num_ownership_changes', 0))),
        float(data.get('years_held', 1)),
        float(int(data.get('legal_disputes', False))),
        float(int(data.get('flood_zone', False))),
        float(near_metro),
        float(near_tech_park),
    ]
    feats += _encode(data.get('zone', data.get('land_type', 'residential')), ZONES)
    feats += _encode(data.get('infrastructure', 'good'), INFRA)
    return feats


def _rule_based_breakdown(data, valuation):
    """Detailed 6-category breakdown for explainability."""
    scores = {}
    asking    = float(data.get('asking_price', 0))
    estimated = valuation['estimated_value']
    if estimated > 0:
        diff = abs(asking - estimated) / estimated * 100
        scores['price_anomaly'] = min(100, diff * 2)
    else:
        scores['price_anomaly'] = 50

    oc = int(data.get('ownership_changes', data.get('num_ownership_changes', 0)))
    yh = int(data.get('years_held', 1))
    scores['ownership'] = min(100, (oc / max(yh, 1)) * 28)

    scores['legal'] = 85 if data.get('legal_disputes') else 0

    env = 0
    locality = data.get('locality', data.get('city', ''))
    if data.get('flood_zone'):
        env += 55
    if locality in HIGH_FLOOD_LOCALITIES:
        env += 20
    if float(data.get('distance_water_km', 3)) < 0.5:
        env += 15
    scores['environmental'] = min(100, env)

    infra_map = {'excellent': 0, 'good': 18, 'average': 48, 'poor': 78}
    scores['infrastructure'] = infra_map.get(data.get('infrastructure', 'average'), 48)

    scores['market'] = LOCALITY_MARKET_RISK.get(locality, 30)
    return scores


def analyze_risk(data, valuation):
    if _risk_clf is None:
        _load_classifier()

    breakdown = _rule_based_breakdown(data, valuation)

    # ML Classifier prediction
    ml_level = None
    ml_proba = None
    if _risk_clf is not None:
        try:
            X = [_build_features(data)]
            pred_class = int(_risk_clf.predict(X)[0])
            proba      = _risk_clf.predict_proba(X)[0]
            ml_level   = RISK_LABELS[pred_class]
            ml_proba   = {RISK_LABELS[i]: round(float(p), 3) for i, p in enumerate(proba)}
        except Exception:
            ml_level = None

    # Weighted rule-based score for 0-100 scale
    weights = {
        'price_anomaly': 0.25, 'ownership': 0.20, 'legal': 0.20,
        'environmental': 0.15, 'infrastructure': 0.10, 'market': 0.10
    }
    rule_score = sum(breakdown[k] * weights[k] for k in weights)

    # Use ML classifier for level, rule score for numeric value
    if ml_level:
        level = ml_level
    elif rule_score < 25:
        level = 'LOW'
    elif rule_score < 50:
        level = 'MEDIUM'
    elif rule_score < 75:
        level = 'HIGH'
    else:
        level = 'CRITICAL'

    result = {
        'risk_score':  float(round(rule_score, 1)),
        'risk_level':  level,
        'breakdown':   {k: float(round(v, 1)) for k, v in breakdown.items()},
        'ml_model':    'GradientBoostingClassifier' if ml_level else 'rule_based',
    }
    if ml_proba:
        result['risk_probabilities'] = {k: float(v) for k, v in ml_proba.items()}

    return result
