"""
Valuation Module — RF (35%) + XGBoost (45%) + ANN (20%) Ensemble
"""
import os
import joblib
import numpy as np

TRAINED_DIR = os.path.join(os.path.dirname(__file__), '..', 'models', 'trained')

ZONES = ['residential', 'commercial', 'agricultural', 'industrial']
INFRA = ['excellent', 'good', 'average', 'poor']

LOCALITY_DATA = {
    'Indiranagar':        ('excellent', 6,  8),
    'Koramangala':        ('excellent', 7,  9),
    'MG Road':            ('excellent', 2,  5),
    'Brigade Road':       ('excellent', 2,  5),
    'Lavelle Road':       ('excellent', 3,  6),
    'Sadashivanagar':     ('excellent', 5,  7),
    'Vasanth Nagar':      ('excellent', 4,  6),
    'Richmond Town':      ('excellent', 4,  6),
    'Frazer Town':        ('excellent', 5,  7),
    'Shivajinagar':       ('excellent', 3,  5),
    'Hebbal':             ('excellent', 10, 3),
    'Yelahanka':          ('good',      18, 4),
    'Devanahalli':        ('average',   35, 2),
    'Thanisandra':        ('good',      12, 5),
    'Kogilu':             ('good',      15, 6),
    'Jakkur':             ('good',      14, 4),
    'Bellary Road':       ('excellent', 10, 2),
    'Nagawara':           ('good',       9, 6),
    'HBR Layout':         ('good',      10, 7),
    'Kalyan Nagar':       ('good',       9, 7),
    'Whitefield':         ('excellent', 18, 6),
    'Marathahalli':       ('excellent', 15, 4),
    'Brookefield':        ('excellent', 16, 5),
    'ITPL':               ('excellent', 17, 5),
    'Varthur':            ('average',   20, 8),
    'Kadugodi':           ('average',   22, 7),
    'Hoodi':              ('good',      16, 5),
    'KR Puram':           ('good',      14, 3),
    'Mahadevapura':       ('good',      15, 5),
    'Doddanekundi':       ('good',      16, 5),
    'JP Nagar':           ('excellent', 10, 9),
    'Jayanagar':          ('excellent',  8, 10),
    'BTM Layout':         ('excellent',  9, 9),
    'Banashankari':       ('excellent', 11, 10),
    'Basavanagudi':       ('excellent',  7, 9),
    'Kanakapura Road':    ('good',      16, 8),
    'Bannerghatta Road':  ('good',      14, 7),
    'Electronic City':    ('good',      22, 5),
    'Bommanahalli':       ('good',      13, 8),
    'HSR Layout':         ('excellent', 11, 8),
    'Rajajinagar':        ('excellent',  7, 5),
    'Malleshwaram':       ('excellent',  5, 6),
    'Yeshwanthpur':       ('good',       8, 3),
    'Peenya':             ('average',   12, 2),
    'Tumkur Road':        ('average',   14, 1),
    'Nagarbhavi':         ('good',      12, 8),
    'Vijayanagar':        ('good',       9, 7),
    'Basaveshwara Nagar': ('good',      10, 6),
    'Mahalakshmi Layout': ('good',       8, 6),
    'RR Nagar':           ('good',      13, 7),
    'Sarjapur Road':      ('good',      18, 9),
    'Bellandur':          ('good',      16, 7),
    'Carmelaram':         ('average',   20, 8),
    'Harlur':             ('good',      17, 8),
    'Begur':              ('average',   18, 9),
    'Attibele':           ('poor',      30, 5),
    'Anekal':             ('poor',      35, 6),
    'Chandapura':         ('average',   25, 7),
    'Hoskote':            ('poor',      32, 4),
    'Doddaballapur':      ('poor',      38, 3),
}

# Feature names for SHAP explanation
FEATURE_NAMES = [
    'area_sqft', 'dist_highway', 'dist_city_center', 'dist_water',
    'ownership_changes', 'years_held', 'legal_disputes', 'flood_zone',
    'near_metro', 'near_tech_park',
    'zone_residential', 'zone_commercial', 'zone_agricultural', 'zone_industrial',
    'infra_excellent', 'infra_good', 'infra_average', 'infra_poor',
]

_rf     = None
_xgb    = None
_ann    = None
_scaler = None


def _load_models():
    global _rf, _xgb, _ann, _scaler
    paths = {
        'rf':     os.path.join(TRAINED_DIR, 'rf.pkl'),
        'xgb':    os.path.join(TRAINED_DIR, 'xgboost.pkl'),
        'ann':    os.path.join(TRAINED_DIR, 'ann.pkl'),
        'scaler': os.path.join(TRAINED_DIR, 'scaler.pkl'),
    }
    missing = [k for k, p in paths.items() if not os.path.exists(p)]
    if missing:
        raise FileNotFoundError(f'Missing models: {missing}. Run: python models/train_model.py')
    _rf     = joblib.load(paths['rf'])
    _xgb    = joblib.load(paths['xgb'])
    _ann    = joblib.load(paths['ann'])
    _scaler = joblib.load(paths['scaler'])


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


def _compute_shap_approximation(X_vec, rf_pred):
    """
    Approximate SHAP values using RF feature importances × feature values.
    Returns top contributing features as a dict.
    """
    importances = _rf.feature_importances_
    x = np.array(X_vec[0])
    # Weighted contribution per feature
    contributions = importances * np.abs(x)
    total = contributions.sum() or 1
    shap_dict = {}
    for i, name in enumerate(FEATURE_NAMES):
        if i < len(contributions):
            shap_dict[name] = round(float(contributions[i] / total * 100), 2)
    # Return top 8 features sorted by contribution
    top = dict(sorted(shap_dict.items(), key=lambda x: x[1], reverse=True)[:8])
    return top


def get_locality_defaults(locality):
    if locality in LOCALITY_DATA:
        infra, d_cc, d_hw = LOCALITY_DATA[locality]
        return {'infrastructure': infra, 'distance_city_center_km': d_cc,
                'distance_highway_km': d_hw}
    return {}


def predict_value(data):
    if _rf is None:
        _load_models()

    locality = data.get('locality', data.get('city', ''))
    merged   = {**get_locality_defaults(locality), **data}

    X_vec    = [_build_features(merged)]
    X_scaled = _scaler.transform(X_vec)

    rf_pred  = float(_rf.predict(X_vec)[0])
    xgb_pred = float(_xgb.predict(X_vec)[0])
    ann_pred = float(_ann.predict(X_scaled)[0])

    # Ensemble: RF 35% + XGB 45% + ANN 20%
    price_sqft = 0.35 * rf_pred + 0.45 * xgb_pred + 0.20 * ann_pred
    area       = float(merged.get('area_sqft', 1))
    estimated  = price_sqft * area

    # Confidence from RF tree variance
    rf_preds   = [float(t.predict(X_vec)[0]) for t in _rf.estimators_[:30]]
    confidence = max(0, min(100, 100 - (np.std(rf_preds) / max(price_sqft, 1) * 100)))

    # SHAP approximation
    shap_values = _compute_shap_approximation(X_vec, rf_pred)

    return {
        'estimated_value': round(estimated, 2),
        'price_per_sqft':  round(price_sqft, 2),
        'confidence_pct':  round(float(confidence), 1),
        'rf_estimate':     round(rf_pred * area, 2),
        'xgb_estimate':    round(xgb_pred * area, 2),
        'ann_estimate':    round(ann_pred * area, 2),
        'shap_values':     shap_values,
        'model_weights':   {'rf': 0.35, 'xgb': 0.45, 'ann': 0.20},
    }
