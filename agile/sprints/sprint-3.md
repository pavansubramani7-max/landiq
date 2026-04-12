# Sprint 3 — ML Valuation Models
**Duration:** Week 5–6  
**Sprint Goal:** 3-model ensemble valuation with Bangalore dataset  
**Team Velocity:** 32 story points  

---

## Sprint Backlog

| Task ID | User Story | Task | Status | Hours Est | Hours Actual |
|---------|-----------|------|--------|-----------|--------------|
| T-031 | US-13 | Generate 8,000 Bangalore land records | DONE | 4 | 5 |
| T-032 | US-13 | Build 18-feature matrix (area, distances, zone, infra) | DONE | 3 | 3 |
| T-033 | US-13 | Train Random Forest (150 trees, max_depth=18) | DONE | 2 | 2 |
| T-034 | US-13 | Train XGBoost (300 estimators, lr=0.04) | DONE | 2 | 2 |
| T-035 | US-14 | Train ANN MLPRegressor (128→64→32, ReLU, Adam) | DONE | 3 | 4 |
| T-036 | US-14 | StandardScaler for ANN preprocessing | DONE | 1 | 1 |
| T-037 | US-15 | Ensemble: RF(35%) + XGB(45%) + ANN(20%) | DONE | 2 | 2 |
| T-038 | US-15 | Confidence score from RF tree variance | DONE | 2 | 2 |
| T-039 | US-34 | SHAP approximation using RF feature importances | DONE | 3 | 3 |
| T-040 | US-16 | predict_value() returning all 3 estimates | DONE | 2 | 2 |
| T-041 | US-17 | Locality defaults auto-fill from LOCALITY_DATA | DONE | 2 | 2 |
| T-042 | US-13 | Save rf.pkl, xgboost.pkl, ann.pkl, scaler.pkl | DONE | 1 | 1 |
| T-043 | US-14 | Display RF/XGB/ANN estimates in frontend | DONE | 2 | 2 |
| T-044 | US-15 | Confidence % display in valuation card | DONE | 1 | 1 |

---

## Model Performance

| Model | MAE (Rs/sqft) | R² Score |
|-------|--------------|----------|
| Random Forest | 1,046 | 0.8947 |
| XGBoost | 1,040 | 0.8921 |
| ANN (MLP) | 1,067 | 0.8985 |
| **Ensemble** | **1,016** | **0.8990** |

---

## Acceptance Criteria

- [x] 3 models trained and saved as .pkl files
- [x] Ensemble R² > 0.88
- [x] All 3 individual estimates returned in API response
- [x] SHAP values returned for top 8 features
- [x] Confidence score between 0-100
- [x] Locality defaults auto-populated from known Bangalore areas

---

## XP Practices Applied

- **Simple Design:** Single predict_value() function handles all 3 models
- **Refactoring:** Extracted _build_features() and _encode() as reusable helpers
- **Continuous Testing:** test_valuation_direct() in test_all.py
- **Modular Coding:** valuation.py completely independent module
