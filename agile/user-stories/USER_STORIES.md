# LandIQ — User Stories with Acceptance Criteria

## Format: As a [role], I want [feature] so that [benefit]

---

## EPIC 1: Authentication

### US-01: User Registration
**As a** new user  
**I want to** register with my email and password  
**So that** I can access the LandIQ platform  

**Acceptance Criteria:**
- Given valid email/password/name, when I POST /api/auth/register, then I receive JWT token + user object
- Given duplicate email, when I register, then I get 409 Conflict error
- Given missing fields, when I register, then I get 400 Bad Request with field names
- Password is hashed using werkzeug before storing

---

### US-02: User Login
**As a** registered user  
**I want to** login with email and password  
**So that** I receive a JWT token to access protected features  

**Acceptance Criteria:**
- Given correct credentials, when I POST /api/auth/login, then I receive JWT token
- Given wrong password, when I login, then I get 401 Unauthorized
- Given inactive account, when I login, then I get 403 Forbidden
- Token expires after 3600 seconds

---

### US-03: Role-Based Access
**As an** admin  
**I want** role-based access control  
**So that** users only see what they're authorized for  

**Acceptance Criteria:**
- user role: can access Dashboard, Parcels, Analysis
- analyst role: can access + Admin panel (read only)
- admin role: can access + User management (write)
- Unauthorized access returns 403 Forbidden

---

## EPIC 3: AI Valuation

### US-13: AI Land Valuation
**As a** user  
**I want** AI to estimate my land's value  
**So that** I know the fair market price before buying/selling  

**Acceptance Criteria:**
- Given property details, when I run analysis, then I get estimated_value in Rs
- Ensemble uses RF(35%) + XGBoost(45%) + ANN(20%)
- Estimated value is within ±15% of actual market price (R² > 0.88)
- Response includes price_per_sqft and confidence_pct

---

### US-14: Model Transparency
**As a** user  
**I want to** see individual model estimates (RF, XGB, ANN)  
**So that** I understand how the ensemble works  

**Acceptance Criteria:**
- API response includes rf_estimate, xgb_estimate, ann_estimate
- Frontend shows all 3 estimates side by side
- Model weights (35/45/20) displayed

---

## EPIC 4: Risk Analysis

### US-20: ML Risk Classification
**As a** user  
**I want** ML-based risk classification  
**So that** I get accurate LOW/MEDIUM/HIGH/CRITICAL risk levels  

**Acceptance Criteria:**
- GradientBoosting Classifier predicts risk level
- Risk probabilities returned for all 4 classes
- Accuracy > 70% on test set
- Falls back to rule-based if model unavailable

---

## EPIC 5: Fraud Detection

### US-23: Fraud Signal Detection
**As a** user  
**I want** fraud signals detected automatically  
**So that** I avoid fraudulent land transactions  

**Acceptance Criteria:**
- 5 signal types detected: extreme_underpricing, rapid_ownership_churn, sale_during_dispute, below_market_floor, quick_flip_inflation
- Each signal has type, detail, severity (MEDIUM/HIGH/CRITICAL)
- IsolationForest anomaly score 0-100 returned
- Combined fraud_probability calculated

---

## EPIC 8: DevOps

### US-51: Docker Containerization
**As a** developer  
**I want** Docker containerization  
**So that** the app runs consistently in any environment  

**Acceptance Criteria:**
- Backend Dockerfile builds successfully
- Frontend Dockerfile builds React + serves via Nginx
- docker-compose up starts all 5 services
- Backend health check passes at /api/health
- Frontend accessible at localhost:3000

### US-54: CI/CD Pipeline
**As a** developer  
**I want** automated CI/CD via GitHub Actions  
**So that** every push is automatically tested and deployed  

**Acceptance Criteria:**
- On push to main: pytest runs → npm build → Docker images built → pushed to registry → deployed to K8s
- On PR: flake8 lint + bandit security scan + Dockerfile lint
- Pipeline fails if any test fails
- Deployment uses rolling update (zero downtime)
