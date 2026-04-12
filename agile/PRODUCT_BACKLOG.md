# LandIQ — Product Backlog

## Project: AI-Powered Land Intelligence Platform
## Product Owner: LandIQ Team
## Last Updated: Sprint 8

---

## EPIC 1: User Authentication & Access Control

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-01 | As a user, I want to register with email/password so I can access the platform | HIGH | 3 | DONE |
| US-02 | As a user, I want to login and receive a JWT token so I stay authenticated | HIGH | 3 | DONE |
| US-03 | As an admin, I want role-based access (user/analyst/admin) so I can control permissions | HIGH | 5 | DONE |
| US-04 | As a user, I want to see my profile info so I know my account details | MEDIUM | 2 | DONE |
| US-05 | As an admin, I want to activate/deactivate users so I can manage access | MEDIUM | 3 | DONE |
| US-06 | As an admin, I want to change user roles so I can promote analysts | MEDIUM | 2 | DONE |

---

## EPIC 2: Land Parcel Management

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-07 | As a user, I want to add a land parcel with all details so I can track my properties | HIGH | 5 | DONE |
| US-08 | As a user, I want to list all my parcels so I can see my portfolio | HIGH | 3 | DONE |
| US-09 | As a user, I want to edit parcel details so I can keep data accurate | MEDIUM | 3 | DONE |
| US-10 | As a user, I want to delete a parcel so I can remove unwanted records | LOW | 2 | DONE |
| US-11 | As a user, I want to search parcels by locality/owner so I can find quickly | MEDIUM | 3 | DONE |
| US-12 | As a user, I want to upload legal documents for a parcel so I can store evidence | HIGH | 5 | DONE |

---

## EPIC 3: AI Valuation Engine

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-13 | As a user, I want AI to estimate land value so I know fair market price | HIGH | 8 | DONE |
| US-14 | As a user, I want to see RF, XGBoost, and ANN estimates separately so I understand the ensemble | MEDIUM | 5 | DONE |
| US-15 | As a user, I want a confidence score so I know how reliable the estimate is | MEDIUM | 3 | DONE |
| US-16 | As a user, I want price per sqft so I can compare with market | HIGH | 2 | DONE |
| US-17 | As a user, I want to see asking vs estimated % difference so I know if it's overpriced | HIGH | 3 | DONE |

---

## EPIC 4: Risk Analysis

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-18 | As a user, I want a risk score (0-100) so I understand investment risk | HIGH | 5 | DONE |
| US-19 | As a user, I want risk broken into 6 categories so I know what drives risk | HIGH | 5 | DONE |
| US-20 | As a user, I want ML-based risk classification (LOW/MEDIUM/HIGH/CRITICAL) so I get accurate levels | HIGH | 8 | DONE |
| US-21 | As a user, I want risk probability percentages so I see confidence of each level | MEDIUM | 5 | DONE |
| US-22 | As a user, I want a visual risk meter so I can quickly assess risk | MEDIUM | 3 | DONE |

---

## EPIC 5: Fraud Detection

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-23 | As a user, I want fraud signals detected so I avoid bad investments | HIGH | 8 | DONE |
| US-24 | As a user, I want IsolationForest anomaly score so I get ML-based fraud detection | HIGH | 8 | DONE |
| US-25 | As a user, I want specific fraud signal types (underpricing, churn, dispute) so I know what's wrong | HIGH | 5 | DONE |
| US-26 | As a user, I want fraud probability (0-1) so I quantify the risk | MEDIUM | 3 | DONE |

---

## EPIC 6: Price Forecasting

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-27 | As a user, I want 5-year price forecast so I plan long-term investment | HIGH | 5 | DONE |
| US-28 | As a user, I want locality-specific growth rates so forecast is accurate for Bangalore | HIGH | 5 | DONE |
| US-29 | As a user, I want a forecast chart so I visualize price trends | MEDIUM | 3 | DONE |
| US-30 | As a user, I want 5-year gain % so I know total return | MEDIUM | 2 | DONE |

---

## EPIC 7: Legal Intelligence

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-31 | As a user, I want OCR document parsing so I extract data automatically | HIGH | 8 | DONE |
| US-32 | As a user, I want owner/area/survey mismatch detection so I catch fraud in documents | HIGH | 5 | DONE |
| US-33 | As a user, I want document integrity score so I know document quality | MEDIUM | 3 | DONE |

---

## EPIC 8: Explainable AI (XAI)

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-34 | As a user, I want SHAP feature importance so I understand what drives valuation | HIGH | 8 | DONE |
| US-35 | As a user, I want risk factor breakdown chart so I see XAI visually | HIGH | 5 | DONE |
| US-36 | As a user, I want top contributing features listed so I get plain-English explanation | MEDIUM | 3 | DONE |

---

## EPIC 9: Geo-Spatial Intelligence

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-37 | As a user, I want an interactive Bangalore map so I explore localities | HIGH | 5 | DONE |
| US-38 | As a user, I want risk zone circles on map so I see flood/risk areas visually | HIGH | 5 | DONE |
| US-39 | As a user, I want locality growth rates on map so I compare investment potential | HIGH | 3 | DONE |
| US-40 | As a user, I want zone filter (residential/commercial/etc) so I narrow my search | MEDIUM | 2 | DONE |

---

## EPIC 10: Recommendation Engine

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-41 | As a user, I want Buy/Hold/Avoid recommendation so I get clear investment decision | HIGH | 5 | DONE |
| US-42 | As a user, I want investment score (0-100) so I compare properties | HIGH | 3 | DONE |
| US-43 | As a user, I want recommendation color-coded so I see it at a glance | MEDIUM | 2 | DONE |

---

## EPIC 11: Reporting

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-44 | As a user, I want PDF report download so I share analysis offline | HIGH | 5 | DONE |
| US-45 | As a user, I want CSV export so I analyze data in Excel | MEDIUM | 3 | DONE |
| US-46 | As a user, I want report to include all 6 model outputs so it's comprehensive | HIGH | 5 | DONE |

---

## EPIC 12: Admin & Monitoring

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-47 | As an admin, I want system stats (users, parcels, analyses) so I monitor usage | HIGH | 3 | DONE |
| US-48 | As an admin, I want analysis logs so I audit AI decisions | MEDIUM | 3 | DONE |
| US-49 | As an admin, I want Prometheus metrics so I monitor API performance | HIGH | 5 | DONE |
| US-50 | As an admin, I want Grafana dashboard so I visualize system health | HIGH | 5 | DONE |

---

## EPIC 13: DevOps & Deployment

| ID   | User Story | Priority | Story Points | Status |
|------|-----------|----------|--------------|--------|
| US-51 | As a developer, I want Docker containerization so I deploy consistently | HIGH | 5 | DONE |
| US-52 | As a developer, I want Docker Compose so I run full stack locally | HIGH | 3 | DONE |
| US-53 | As a developer, I want Kubernetes manifests so I deploy to cloud | HIGH | 8 | DONE |
| US-54 | As a developer, I want GitHub Actions CI/CD so builds are automated | HIGH | 8 | DONE |
| US-55 | As a developer, I want HPA auto-scaling so app handles load | MEDIUM | 5 | DONE |

---

## Summary

| Metric | Value |
|--------|-------|
| Total User Stories | 55 |
| Total Story Points | 228 |
| Completed | 55 (100%) |
| Epics | 13 |
| Sprints | 8 |
