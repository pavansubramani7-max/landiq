# Changelog

All notable changes to LandIQ are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [2.0.0] - Sprint 8 Complete — 2024

### Added (DevOps & Deployment)
- GitHub Actions CI/CD pipeline (build → test → push → deploy)
- PR quality check workflow (lint, security scan, Dockerfile lint)
- Kubernetes manifests: namespace, secrets, configmap, postgres StatefulSet
- Backend + frontend Deployments with HorizontalPodAutoscaler (2–10 replicas)
- Kubernetes Ingress with HTTPS/TLS via cert-manager + Let's Encrypt
- NetworkPolicy for service isolation
- Prometheus metrics endpoint (`/metrics`) via prometheus-flask-exporter
- Grafana dashboard with API request rate, response time, error rate panels
- Docker Compose with PostgreSQL + Prometheus + Grafana services
- psycopg2-binary for PostgreSQL production support

### Changed
- docker-compose.yml upgraded to include full monitoring stack
- requirements.txt: added prometheus-flask-exporter, psycopg2-binary

---

## [1.5.0] - Sprint 7 — Reporting & XAI

### Added
- ShapChart component: horizontal bar chart for risk factor breakdown (XAI)
- CSV export on ResultDashboard and ParcelDetail pages
- RF estimate vs XGB estimate side-by-side in valuation card
- Ensemble confidence index display

---

## [1.4.0] - Sprint 6 — Recommendation Engine & Admin

### Added
- Admin panel with tabbed UI: overview stats, user management, analyses log
- Role-based access: user / analyst / admin
- User activate/deactivate toggle
- Role change dropdown in admin
- Investment score (0–100) and fraud probability on analysis results

---

## [1.3.0] - Sprint 5 — Geo-Spatial Intelligence

### Added
- Bangalore-specific GeoPage with 25 real localities
- Real coordinates, growth rates, avg prices per locality
- Risk zone circles (color-coded) on Leaflet map
- Zone filter buttons (residential / commercial / agricultural / industrial)
- Locality detail card on click

---

## [1.2.0] - Sprint 4 — Risk & Fraud Detection

### Added
- 6-category risk scoring: price anomaly, ownership, legal, environmental, infrastructure, market
- Bangalore locality-specific market risk scores
- Flood zone awareness (Bellandur, Varthur lake areas)
- 5 fraud signal detectors: extreme underpricing, rapid churn, sale during dispute, below floor, quick flip
- Fraud probability score (0–1)

---

## [1.1.0] - Sprint 3 — ML Valuation Model

### Added
- 8,000-record Bangalore land dataset (60 real localities, 2024 market prices)
- Random Forest (150 trees) + XGBoost (300 estimators) ensemble
- Ensemble R² = 0.8959, MAE = Rs.965/sqft
- New features: metro proximity, tech park proximity, flood zone
- Locality-specific growth rates for 5-year forecasting
- Model accuracy metrics printed on training

---

## [1.0.0] - Sprint 1 & 2 — Foundation

### Added
- JWT authentication (register, login, /me)
- Role-based access control (user / analyst / admin)
- Land parcel CRUD API
- SQLAlchemy models: User, LandParcel, PredictionResult, OwnershipHistory, Document
- Alembic migrations
- React frontend: Login, Register, Dashboard, Parcels, ParcelDetail, Analysis, GeoPage, Admin, About
- AuthContext with JWT interceptor and auto-logout on 401
- Professional CSS with Inter font, CSS variables, smooth transitions
- Cursor-jump fix: all text/number inputs use useRef + defaultValue
- Full pytest test suite: 40+ tests across 7 test classes
