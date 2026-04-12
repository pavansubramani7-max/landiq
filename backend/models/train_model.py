"""
LandIQ - Complete Model Training Pipeline
Models trained:
  1. Random Forest Regressor     - land valuation
  2. XGBoost Regressor           - land valuation (ensemble)
  3. ANN (MLPRegressor)          - land valuation (ensemble)
  4. Risk Classifier (GBM)       - LOW/MEDIUM/HIGH/CRITICAL classification
  5. Anomaly Detector (IsoForest)- fraud/anomaly detection
  6. Forecasting (LinearRegression per locality) - price trend
"""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import (
    RandomForestRegressor, GradientBoostingClassifier, IsolationForest
)
from sklearn.neural_network import MLPRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error, r2_score,
    classification_report, accuracy_score
)
from sklearn.preprocessing import StandardScaler, LabelEncoder
from xgboost import XGBRegressor

TRAINED_DIR = os.path.join(os.path.dirname(__file__), 'trained')
DATA_DIR    = os.path.join(os.path.dirname(__file__), 'data')
os.makedirs(TRAINED_DIR, exist_ok=True)
os.makedirs(DATA_DIR,    exist_ok=True)

# ── Bangalore Localities ──────────────────────────────────────────────────────
BANGALORE_LOCALITIES = [
    ('Indiranagar',        'residential',  12000, 'excellent', 6,  8,  0.03),
    ('Koramangala',        'commercial',   18000, 'excellent', 7,  9,  0.04),
    ('MG Road',            'commercial',   22000, 'excellent', 2,  5,  0.02),
    ('Brigade Road',       'commercial',   20000, 'excellent', 2,  5,  0.02),
    ('Lavelle Road',       'residential',  19000, 'excellent', 3,  6,  0.02),
    ('Sadashivanagar',     'residential',  16000, 'excellent', 5,  7,  0.03),
    ('Vasanth Nagar',      'residential',  15000, 'excellent', 4,  6,  0.03),
    ('Richmond Town',      'residential',  14000, 'excellent', 4,  6,  0.03),
    ('Frazer Town',        'residential',  11000, 'excellent', 5,  7,  0.05),
    ('Shivajinagar',       'commercial',   13000, 'excellent', 3,  5,  0.04),
    ('Hebbal',             'residential',   9500, 'excellent', 10, 3,  0.08),
    ('Yelahanka',          'residential',   6500, 'good',      18, 4,  0.05),
    ('Devanahalli',        'agricultural',  3200, 'average',   35, 2,  0.04),
    ('Thanisandra',        'residential',   7200, 'good',      12, 5,  0.06),
    ('Kogilu',             'residential',   5800, 'good',      15, 6,  0.05),
    ('Jakkur',             'residential',   6800, 'good',      14, 4,  0.06),
    ('Bellary Road',       'commercial',    8500, 'excellent', 10, 2,  0.04),
    ('Nagawara',           'residential',   8000, 'good',       9, 6,  0.07),
    ('HBR Layout',         'residential',   7500, 'good',      10, 7,  0.05),
    ('Kalyan Nagar',       'residential',   7800, 'good',       9, 7,  0.05),
    ('Whitefield',         'commercial',    8500, 'excellent', 18, 6,  0.05),
    ('Marathahalli',       'commercial',    9000, 'excellent', 15, 4,  0.06),
    ('Brookefield',        'residential',   8200, 'excellent', 16, 5,  0.04),
    ('ITPL',               'commercial',   10000, 'excellent', 17, 5,  0.04),
    ('Varthur',            'residential',   5500, 'average',   20, 8,  0.12),
    ('Kadugodi',           'residential',   5200, 'average',   22, 7,  0.08),
    ('Hoodi',              'residential',   6800, 'good',      16, 5,  0.06),
    ('KR Puram',           'residential',   6200, 'good',      14, 3,  0.09),
    ('Mahadevapura',       'residential',   7000, 'good',      15, 5,  0.07),
    ('Doddanekundi',       'commercial',    8000, 'good',      16, 5,  0.05),
    ('JP Nagar',           'residential',   9500, 'excellent', 10, 9,  0.04),
    ('Jayanagar',          'residential',  11000, 'excellent',  8, 10, 0.03),
    ('BTM Layout',         'residential',   9000, 'excellent',  9, 9,  0.05),
    ('Banashankari',       'residential',   8500, 'excellent', 11, 10, 0.04),
    ('Basavanagudi',       'residential',  10000, 'excellent',  7, 9,  0.03),
    ('Kanakapura Road',    'residential',   6000, 'good',      16, 8,  0.06),
    ('Bannerghatta Road',  'residential',   7000, 'good',      14, 7,  0.05),
    ('Electronic City',    'industrial',    5500, 'good',      22, 5,  0.06),
    ('Bommanahalli',       'residential',   6500, 'good',      13, 8,  0.06),
    ('HSR Layout',         'residential',  10500, 'excellent', 11, 8,  0.04),
    ('Rajajinagar',        'residential',   9000, 'excellent',  7, 5,  0.05),
    ('Malleshwaram',       'residential',  11500, 'excellent',  5, 6,  0.04),
    ('Yeshwanthpur',       'commercial',    8000, 'good',       8, 3,  0.06),
    ('Peenya',             'industrial',    4500, 'average',   12, 2,  0.07),
    ('Tumkur Road',        'industrial',    4000, 'average',   14, 1,  0.06),
    ('Nagarbhavi',         'residential',   6500, 'good',      12, 8,  0.05),
    ('Vijayanagar',        'residential',   8000, 'good',       9, 7,  0.05),
    ('Basaveshwara Nagar', 'residential',   7500, 'good',      10, 6,  0.05),
    ('Mahalakshmi Layout', 'residential',   8500, 'good',       8, 6,  0.04),
    ('RR Nagar',           'residential',   6800, 'good',      13, 7,  0.06),
    ('Sarjapur Road',      'residential',   7500, 'good',      18, 9,  0.07),
    ('Bellandur',          'residential',   8000, 'good',      16, 7,  0.10),
    ('Carmelaram',         'residential',   6000, 'average',   20, 8,  0.08),
    ('Harlur',             'residential',   7200, 'good',      17, 8,  0.07),
    ('Begur',              'residential',   5500, 'average',   18, 9,  0.08),
    ('Attibele',           'industrial',    3000, 'poor',      30, 5,  0.06),
    ('Anekal',             'agricultural',  2500, 'poor',      35, 6,  0.05),
    ('Chandapura',         'residential',   4500, 'average',   25, 7,  0.07),
    ('Hoskote',            'agricultural',  2800, 'poor',      32, 4,  0.05),
    ('Doddaballapur',      'agricultural',  2200, 'poor',      38, 3,  0.04),
]

ZONES = ['residential', 'commercial', 'agricultural', 'industrial']
INFRA = ['excellent', 'good', 'average', 'poor']
INFRA_MULT = {'excellent': 1.25, 'good': 1.05, 'average': 0.90, 'poor': 0.72}
ZONE_MULT  = {'commercial': 1.45, 'industrial': 1.10, 'residential': 1.0, 'agricultural': 0.48}


def encode(val, options):
    arr = [0] * len(options)
    if val in options:
        arr[options.index(val)] = 1
    return arr


def build_features(row):
    feats = [
        row['area_sqft'],
        row['distance_highway_km'],
        row['distance_city_center_km'],
        row['distance_water_km'],
        row['ownership_changes'],
        row['years_held'],
        int(row['legal_disputes']),
        int(row['flood_zone']),
        int(row['near_metro']),
        int(row['near_tech_park']),
    ]
    feats += encode(row['zone'], ZONES)
    feats += encode(row['infrastructure'], INFRA)
    return feats


def price_to_risk_label(row, estimated_price):
    """Generate risk label for classifier training."""
    score = 0
    asking = row.get('asking_price', estimated_price)
    if estimated_price > 0:
        diff = abs(asking - estimated_price) / estimated_price * 100
        score += min(25, diff * 0.5)
    oc = row['ownership_changes']
    yh = max(row['years_held'], 1)
    score += min(20, (oc / yh) * 5)
    if row['legal_disputes']:
        score += 20
    if row['flood_zone']:
        score += 12
    infra_s = {'excellent': 0, 'good': 4, 'average': 10, 'poor': 18}
    score += infra_s.get(row['infrastructure'], 10)
    if row['distance_city_center_km'] > 25:
        score += 8
    if score < 15:
        return 0   # LOW
    elif score < 35:
        return 1   # MEDIUM
    elif score < 55:
        return 2   # HIGH
    else:
        return 3   # CRITICAL


def generate_bangalore_data(n=8000):
    rng  = np.random.default_rng(42)
    rows = []
    for _ in range(n):
        loc = BANGALORE_LOCALITIES[rng.integers(0, len(BANGALORE_LOCALITIES))]
        locality, zone, base_price, infra, d_cc_base, d_hw_base, flood_prob = loc
        d_cc    = max(0.5, d_cc_base + rng.normal(0, 1.5))
        d_hw    = max(0.3, d_hw_base + rng.normal(0, 1.2))
        d_wt    = rng.uniform(0.2, 8.0)
        d_metro = rng.uniform(0.3, 5.0)
        area_type = rng.choice(['small', 'medium', 'large', 'plot'], p=[0.30, 0.40, 0.20, 0.10])
        if area_type == 'small':   area = rng.uniform(600, 1500)
        elif area_type == 'medium':area = rng.uniform(1500, 5000)
        elif area_type == 'large': area = rng.uniform(5000, 20000)
        else:                      area = rng.uniform(1200, 4000)
        oc = int(rng.choice([0,1,2,3,4,5,6], p=[0.30,0.28,0.20,0.10,0.06,0.04,0.02]))
        yh = int(rng.integers(1, 25))
        ld = int(rng.random() < 0.12)
        fz = int(rng.random() < flood_prob)
        near_metro     = int(d_metro < 1.5)
        near_tech_park = int(zone in ('commercial','industrial') or
                             locality in ('Whitefield','Marathahalli','Electronic City',
                                          'ITPL','Hebbal','Sarjapur Road','HSR Layout'))
        price_sqft = (base_price * INFRA_MULT[infra]
                      * max(0.55, 1 - d_cc * 0.012)
                      * max(0.80, 1 - d_hw * 0.008)
                      * (1.12 if near_metro     else 1.0)
                      * (1.08 if near_tech_park else 1.0)
                      * (0.88 if ld             else 1.0)
                      * (0.92 if fz             else 1.0)
                      * max(0.75, 1 - oc * 0.04)
                      * rng.uniform(0.88, 1.14))
        asking_price = price_sqft * area * rng.uniform(0.75, 1.35)
        rows.append({
            'locality': locality, 'zone': zone, 'infrastructure': infra,
            'area_sqft': round(area, 1),
            'distance_highway_km': round(d_hw, 2),
            'distance_city_center_km': round(d_cc, 2),
            'distance_water_km': round(d_wt, 2),
            'distance_metro_km': round(d_metro, 2),
            'ownership_changes': oc, 'years_held': yh,
            'legal_disputes': ld, 'flood_zone': fz,
            'near_metro': near_metro, 'near_tech_park': near_tech_park,
            'price_sqft': round(price_sqft, 2),
            'total_price': round(price_sqft * area, 2),
            'asking_price': round(asking_price, 2),
        })
    return pd.DataFrame(rows)


def main():
    print('=' * 60)
    print('  LandIQ - Full Model Training Pipeline')
    print('  Models: RF + XGBoost + ANN + Risk Classifier + Anomaly')
    print('=' * 60)

    # ── Step 1: Generate Dataset ──────────────────────────────────────────────
    print('\n[1/7] Generating 8,000 Bangalore land records...')
    df = generate_bangalore_data(8000)
    csv_path = os.path.join(DATA_DIR, 'bangalore_land_data.csv')
    df.to_csv(csv_path, index=False)
    print(f'      Records   : {len(df)}')
    print(f'      Localities: {df["locality"].nunique()} unique')
    print(f'      Price range: Rs.{df["price_sqft"].min():.0f} - Rs.{df["price_sqft"].max():.0f}/sqft')
    print(f'      Avg price  : Rs.{df["price_sqft"].mean():.0f}/sqft')

    # ── Step 2: Feature Matrix ────────────────────────────────────────────────
    print('\n[2/7] Building feature matrix...')
    X_raw = [build_features(r) for _, r in df.iterrows()]
    y_reg = df['price_sqft'].values
    X_train, X_test, y_train, y_test = train_test_split(
        X_raw, y_reg, test_size=0.15, random_state=42)
    print(f'      Train: {len(X_train)} | Test: {len(X_test)} | Features: {len(X_raw[0])}')

    # ── Step 3: Random Forest ─────────────────────────────────────────────────
    print('\n[3/7] Training Random Forest Regressor...')
    rf = RandomForestRegressor(
        n_estimators=150, max_depth=18,
        min_samples_leaf=3, random_state=42, n_jobs=-1)
    rf.fit(X_train, y_train)
    rf_pred = rf.predict(X_test)
    print(f'      MAE: Rs.{mean_absolute_error(y_test, rf_pred):.1f}/sqft  |  R2: {r2_score(y_test, rf_pred):.4f}')
    joblib.dump(rf, os.path.join(TRAINED_DIR, 'rf.pkl'))

    # ── Step 4: XGBoost ───────────────────────────────────────────────────────
    print('\n[4/7] Training XGBoost Regressor...')
    xgb = XGBRegressor(
        n_estimators=300, learning_rate=0.04, max_depth=7,
        subsample=0.85, colsample_bytree=0.85,
        random_state=42, verbosity=0, n_jobs=-1)
    xgb.fit(X_train, y_train)
    xgb_pred = xgb.predict(X_test)
    print(f'      MAE: Rs.{mean_absolute_error(y_test, xgb_pred):.1f}/sqft  |  R2: {r2_score(y_test, xgb_pred):.4f}')
    joblib.dump(xgb, os.path.join(TRAINED_DIR, 'xgboost.pkl'))

    # ── Step 5: ANN (MLPRegressor) ────────────────────────────────────────────
    print('\n[5/7] Training ANN (MLPRegressor) ...')
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)
    ann = MLPRegressor(
        hidden_layer_sizes=(128, 64, 32),
        activation='relu',
        solver='adam',
        learning_rate_init=0.001,
        max_iter=300,
        early_stopping=True,
        validation_fraction=0.1,
        random_state=42,
        verbose=False)
    ann.fit(X_train_s, y_train)
    ann_pred = ann.predict(X_test_s)
    print(f'      MAE: Rs.{mean_absolute_error(y_test, ann_pred):.1f}/sqft  |  R2: {r2_score(y_test, ann_pred):.4f}')
    joblib.dump(ann,    os.path.join(TRAINED_DIR, 'ann.pkl'))
    joblib.dump(scaler, os.path.join(TRAINED_DIR, 'scaler.pkl'))

    # Ensemble test: RF 35% + XGB 45% + ANN 20%
    ens_pred = 0.35 * rf_pred + 0.45 * xgb_pred + 0.20 * ann_pred
    print(f'\n      Ensemble (35% RF + 45% XGB + 20% ANN):')
    print(f'      MAE: Rs.{mean_absolute_error(y_test, ens_pred):.1f}/sqft  |  R2: {r2_score(y_test, ens_pred):.4f}')

    # ── Step 6: Risk Classifier (GBM) ─────────────────────────────────────────
    print('\n[6/7] Training Risk Classifier (GradientBoosting)...')
    # Generate risk labels using estimated prices
    rf_all_pred = rf.predict(X_raw)
    risk_labels = []
    for i, (_, row) in enumerate(df.iterrows()):
        row_dict = row.to_dict()
        row_dict['asking_price'] = row_dict.get('asking_price', rf_all_pred[i] * row_dict['area_sqft'])
        risk_labels.append(price_to_risk_label(row_dict, rf_all_pred[i] * row_dict['area_sqft']))

    y_risk = np.array(risk_labels)
    X_tr_r, X_te_r, y_tr_r, y_te_r = train_test_split(
        X_raw, y_risk, test_size=0.15, random_state=42, stratify=y_risk)

    risk_clf = GradientBoostingClassifier(
        n_estimators=200, learning_rate=0.05,
        max_depth=5, random_state=42)
    risk_clf.fit(X_tr_r, y_tr_r)
    y_pred_r = risk_clf.predict(X_te_r)
    acc = accuracy_score(y_te_r, y_pred_r)
    print(f'      Accuracy: {acc:.4f}')
    print(f'      Classes : LOW={sum(y_risk==0)} | MEDIUM={sum(y_risk==1)} | HIGH={sum(y_risk==2)} | CRITICAL={sum(y_risk==3)}')
    joblib.dump(risk_clf, os.path.join(TRAINED_DIR, 'risk_classifier.pkl'))

    # ── Step 7: Anomaly Detector (IsolationForest) ────────────────────────────
    print('\n[7/7] Training Anomaly Detector (IsolationForest)...')
    # Features for anomaly: price_sqft, area, ownership_changes, years_held, asking vs estimated
    anomaly_features = []
    for i, (_, row) in enumerate(df.iterrows()):
        est_price = rf_all_pred[i]
        asking_sqft = row['asking_price'] / max(row['area_sqft'], 1)
        price_ratio = asking_sqft / max(est_price, 1)
        anomaly_features.append([
            row['price_sqft'],
            row['area_sqft'],
            row['ownership_changes'],
            row['years_held'],
            price_ratio,
            int(row['legal_disputes']),
            int(row['flood_zone']),
        ])
    X_anomaly = np.array(anomaly_features)
    iso_forest = IsolationForest(
        n_estimators=200,
        contamination=0.08,   # ~8% anomalies expected
        random_state=42,
        n_jobs=-1)
    iso_forest.fit(X_anomaly)
    scores = iso_forest.decision_function(X_anomaly)
    anomaly_count = sum(iso_forest.predict(X_anomaly) == -1)
    print(f'      Anomalies detected in training data: {anomaly_count} ({anomaly_count/len(df)*100:.1f}%)')
    print(f'      Score range: {scores.min():.3f} to {scores.max():.3f}')
    joblib.dump(iso_forest, os.path.join(TRAINED_DIR, 'anomaly_detector.pkl'))

    # ── Summary ───────────────────────────────────────────────────────────────
    print('\n' + '=' * 60)
    print('  All models saved to models/trained/:')
    print('    rf.pkl               - Random Forest Regressor')
    print('    xgboost.pkl          - XGBoost Regressor')
    print('    ann.pkl              - ANN (MLPRegressor)')
    print('    scaler.pkl           - StandardScaler for ANN')
    print('    risk_classifier.pkl  - GBM Risk Classifier')
    print('    anomaly_detector.pkl - IsolationForest Fraud Detector')
    print('  Dataset -> models/data/bangalore_land_data.csv')
    print('  Ready! Run: python app.py')
    print('=' * 60)


if __name__ == '__main__':
    main()
