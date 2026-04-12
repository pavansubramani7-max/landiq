# Sprint 4 — Risk Classification & Fraud Detection
**Duration:** Week 7–8  
**Sprint Goal:** ML-based risk classifier and anomaly fraud detector  
**Team Velocity:** 34 story points  

---

## Sprint Backlog

| Task ID | User Story | Task | Status | Hours Est | Hours Actual |
|---------|-----------|------|--------|-----------|--------------|
| T-051 | US-20 | Generate risk labels (LOW/MEDIUM/HIGH/CRITICAL) from rule scoring | DONE | 3 | 3 |
| T-052 | US-20 | Train GradientBoosting Classifier (200 estimators) | DONE | 2 | 2 |
| T-053 | US-21 | predict_proba() for risk probability per class | DONE | 2 | 2 |
| T-054 | US-19 | 6-category rule-based breakdown (price_anomaly, ownership, legal, environmental, infrastructure, market) | DONE | 3 | 3 |
| T-055 | US-22 | RiskMeter SVG gauge component | DONE | 3 | 3 |
| T-056 | US-21 | Risk probability bars in ResultDashboard | DONE | 2 | 2 |
| T-057 | US-23 | IsolationForest (200 trees, 8% contamination) | DONE | 3 | 3 |
| T-058 | US-24 | Anomaly score normalization (0-100) | DONE | 2 | 2 |
| T-059 | US-25 | 5 rule-based fraud signals (underpricing, churn, dispute, floor, flip) | DONE | 3 | 3 |
| T-060 | US-26 | Combined fraud_probability (60% rules + 40% ML) | DONE | 2 | 2 |
| T-061 | US-24 | Anomaly score progress bar in frontend | DONE | 2 | 2 |
| T-062 | US-23 | Fraud signals display with severity badges | DONE | 2 | 2 |
| T-063 | - | Save risk_classifier.pkl, anomaly_detector.pkl | DONE | 1 | 1 |
| T-064 | - | Bangalore locality flood zone awareness | DONE | 2 | 2 |

---

## Model Performance

| Model | Metric | Value |
|-------|--------|-------|
| GBM Risk Classifier | Accuracy | 73.6% |
| GBM Risk Classifier | Classes | LOW=4051, MEDIUM=3259, HIGH=640, CRITICAL=50 |
| IsolationForest | Contamination | 8% |
| IsolationForest | Anomalies detected | 640 (8.0%) |

---

## Acceptance Criteria

- [x] GBM classifier predicts LOW/MEDIUM/HIGH/CRITICAL
- [x] Risk probabilities returned for all 4 classes
- [x] IsolationForest anomaly score 0-100
- [x] 5 fraud signal types detected
- [x] Combined fraud_probability calculated
- [x] Bangalore flood zones (Bellandur, Varthur, etc.) flagged

---

## XP Practices Applied

- **Test-First:** test_risk_high_on_disputes() and test_fraud_signals() written before module
- **Modular Coding:** risk_analysis.py and fraud_detection.py completely separate
- **Simple Design:** ML classifier with rule-based fallback if model not loaded
