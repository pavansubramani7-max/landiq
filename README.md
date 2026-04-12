# 🏡 LandIQ — AI-Powered Land Intelligence Platform

> AI-driven land valuation, risk analytics, fraud detection, and investment recommendations for Indian real estate.

---

## Features

| Module | Description |
|---|---|
| AI Valuation | XGBoost (60%) + Random Forest (40%) ensemble on 14 features |
| Risk Analysis | 6-category weighted scoring (0–100): price anomaly, ownership, legal, environmental, infrastructure, market |
| Fraud Detection | 5 signal detectors: extreme underpricing, rapid churn, sale during dispute, below floor, quick flip |
| 5-Year Forecast | City growth rates × zone modifier × infra modifier |
| Legal Intel | Regex OCR extraction of area, price, owner, survey number with mismatch detection |
| PDF Reports | Branded ReportLab PDF with full analysis breakdown |
| Geo Map | Interactive Leaflet map with city-wise growth markers |
| Auth | JWT-based login/register with role-based access (user / analyst / admin) |
| Admin Panel | User management, system stats, analysis logs |

---

## Tech Stack

- **Frontend**: React 18, React Router 6, Recharts, Leaflet, Axios, Lucide
- **Backend**: Python Flask 3.0, Flask-JWT-Extended, Flask-Limiter, SQLAlchemy 2.0
- **ML**: XGBoost 2.0, Scikit-learn 1.5 (Random Forest), Pandas, NumPy
- **DB**: SQLite (dev) / PostgreSQL (prod via DATABASE_URL)
- **Reports**: ReportLab 4.2
- **Deploy**: Docker + Docker Compose

---

## Quick Start (Local)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python models/train_model.py   # Train ML models (one-time)
python app.py                  # Starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm start                      # Starts on http://localhost:3000
```

---

## Docker (Full Stack)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health: http://localhost:5000/api/health

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and set:

```
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///./landiq.db
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/me | Get current user (JWT) |

### Parcels (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/parcels/ | List all parcels |
| POST | /api/parcels/ | Create parcel |
| GET | /api/parcels/:id | Get parcel |
| PUT | /api/parcels/:id | Update parcel |
| DELETE | /api/parcels/:id | Delete parcel |

### Analysis (JWT required)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/analysis/parcel/:id | Run AI analysis on parcel |
| GET | /api/analysis/parcel/:id/history | Analysis history |
| GET | /api/analysis/report/:prediction_id | Download PDF report |

### Legacy (no auth)
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/analyze | Quick analysis (rate limited: 30/hr) |
| POST | /api/upload-doc | Upload document |
| GET | /api/report/:id | Download report |

### Admin (analyst/admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/stats | System statistics |
| GET | /api/admin/users | List all users |
| PATCH | /api/admin/users/:id | Update user role/status |
| GET | /api/admin/analyses | Recent analyses log |

---

## Default Roles

| Role | Access |
|---|---|
| user | Dashboard, Parcels, Analysis |
| analyst | + Admin panel (read) |
| admin | + User management |

---

## Project Structure

```
LandIQ/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── routes/          # Flask blueprints
│   │   ├── config.py
│   │   └── database.py
│   ├── modules/             # AI/ML modules
│   │   ├── valuation.py
│   │   ├── risk_analysis.py
│   │   ├── fraud_detection.py
│   │   ├── forecasting.py
│   │   ├── legal_intel.py
│   │   └── report_gen.py
│   ├── models/trained/      # Saved ML models
│   ├── migrations/          # Alembic migrations
│   └── app.py
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # AuthContext
│       ├── hooks/           # useAnalysis
│       ├── pages/           # All page components
│       └── utils/api.js     # Axios API client
└── docker-compose.yml
```
