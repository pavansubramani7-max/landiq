# LandIQ - Complete Project Explanation
# Subject: Agile & DevOps | CSE AIML | 2nd Year 4th Sem
# Student: Pavan Subramani

==============================================================
PART 1: WHAT IS THIS PROJECT?
==============================================================

PROJECT NAME: LandIQ
FULL FORM: Land Intelligence Quotient

WHAT IT DOES:
- You enter land/property details in Bangalore
- 6 AI models analyze it instantly
- You get: Price estimate, Risk score, Fraud detection,
  5-year forecast, Buy/Hold/Avoid recommendation
- Download PDF or CSV report

WHY WE BUILT IT:
- Land buyers in India don't know fair price
- Fraud in real estate is very common
- No tool existed for AI-based land analysis
- LandIQ solves all 3 problems

==============================================================
PART 2: TECH STACK (What tools we used)
==============================================================

FRONTEND:
- React.js 18 - builds the website UI
- React Router - navigation between pages
- Recharts - charts and graphs
- Leaflet - interactive map
- Axios - sends requests to backend
- Lucide - icons

BACKEND:
- Python Flask 3.0 - REST API server
- Flask-JWT-Extended - login/auth tokens
- Flask-Limiter - rate limiting (30 req/hr)
- SQLAlchemy - database ORM
- Alembic - database migrations
- Prometheus Flask Exporter - monitoring metrics

MACHINE LEARNING:
- Scikit-learn - Random Forest, GBM, IsolationForest, ANN
- XGBoost - gradient boosting model
- NumPy + Pandas - data processing
- Joblib - save/load models

DATABASE:
- SQLite (development)
- PostgreSQL (production)

REPORTS:
- ReportLab - generate PDF reports
- CSV export - built in Python

DEVOPS:
- Git - version control
- GitHub - remote repository
- GitHub Actions - CI/CD pipeline
- Docker - containerization
- Docker Compose - multi-container setup
- Kubernetes - cloud orchestration
- Prometheus - metrics collection
- Grafana - monitoring dashboard

==============================================================
PART 3: PROJECT FOLDER STRUCTURE
==============================================================

LandIQ/
│
├── .github/
│   └── workflows/
│       ├── ci-cd.yml        ← Main CI/CD pipeline
│       └── pr-check.yml     ← PR quality checks
│
├── agile/                   ← ALL AGILE DOCUMENTS
│   ├── PRODUCT_BACKLOG.md   ← 55 user stories
│   ├── KANBAN_BOARD.md      ← Task tracking
│   ├── BURNDOWN_VELOCITY.md ← Sprint charts
│   ├── STUDENT_EXPLANATION_GUIDE.md ← This guide
│   ├── sprints/
│   │   ├── sprint-1.md      ← Auth sprint
│   │   ├── sprint-3.md      ← ML sprint
│   │   ├── sprint-4.md      ← Risk/Fraud sprint
│   │   └── sprint-8.md      ← DevOps sprint
│   └── user-stories/
│       └── USER_STORIES.md  ← Acceptance criteria
│
├── backend/
│   ├── app/
│   │   ├── models/          ← Database models
│   │   │   ├── user.py      ← User table
│   │   │   ├── land_parcel.py ← Land parcel table
│   │   │   ├── prediction_result.py ← Analysis results
│   │   │   ├── document.py  ← Uploaded documents
│   │   │   └── ownership_history.py ← Owner history
│   │   ├── routes/          ← API endpoints
│   │   │   ├── auth.py      ← /api/auth/*
│   │   │   ├── parcels.py   ← /api/parcels/*
│   │   │   ├── analysis.py  ← /api/analysis/*
│   │   │   ├── documents.py ← /api/documents/*
│   │   │   └── admin.py     ← /api/admin/*
│   │   ├── config.py        ← App configuration
│   │   └── database.py      ← DB connection
│   │
│   ├── modules/             ← AI/ML modules
│   │   ├── valuation.py     ← RF+XGB+ANN ensemble
│   │   ├── risk_analysis.py ← GBM risk classifier
│   │   ├── fraud_detection.py ← IsolationForest
│   │   ├── forecasting.py   ← 5-year forecast
│   │   ├── legal_intel.py   ← OCR document parsing
│   │   └── report_gen.py    ← PDF generation
│   │
│   ├── models/
│   │   ├── trained/         ← Saved ML models
│   │   │   ├── rf.pkl       ← Random Forest
│   │   │   ├── xgboost.pkl  ← XGBoost
│   │   │   ├── ann.pkl      ← Neural Network
│   │   │   ├── scaler.pkl   ← StandardScaler
│   │   │   ├── risk_classifier.pkl ← GBM
│   │   │   └── anomaly_detector.pkl ← IsolationForest
│   │   ├── data/
│   │   │   └── bangalore_land_data.csv ← 8000 records
│   │   └── train_model.py   ← Training script
│   │
│   ├── tests/
│   │   ├── conftest.py      ← Test fixtures
│   │   └── test_all.py      ← 40+ tests
│   │
│   ├── app.py               ← Main Flask app
│   ├── wsgi.py              ← Gunicorn entry point
│   ├── requirements.txt     ← Python packages
│   ├── Dockerfile           ← Backend container
│   └── .env                 ← Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── pages/           ← 10 website pages
│   │   │   ├── Home.jsx     ← Landing page
│   │   │   ├── Login.jsx    ← Login page
│   │   │   ├── Register.jsx ← Register page
│   │   │   ├── Dashboard.jsx ← Analytics dashboard
│   │   │   ├── Parcels.jsx  ← Parcel list/create
│   │   │   ├── ParcelDetail.jsx ← Single parcel
│   │   │   ├── Analysis.jsx ← Quick analysis
│   │   │   ├── GeoPage.jsx  ← Bangalore map
│   │   │   ├── Admin.jsx    ← Admin panel
│   │   │   └── About.jsx    ← About page
│   │   │
│   │   ├── components/      ← Reusable UI parts
│   │   │   ├── Navbar.jsx   ← Top navigation
│   │   │   ├── InputForm.jsx ← Property input form
│   │   │   ├── ResultDashboard.jsx ← Analysis results
│   │   │   ├── RiskMeter.jsx ← Risk gauge
│   │   │   ├── ForecastChart.jsx ← Price chart
│   │   │   ├── ShapChart.jsx ← XAI chart
│   │   │   └── MapView.jsx  ← Leaflet map
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← JWT auth state
│   │   │
│   │   ├── utils/
│   │   │   └── api.js       ← All API calls
│   │   │
│   │   ├── App.jsx          ← Main app + routes
│   │   └── index.css        ← Global styles
│   │
│   ├── public/
│   │   └── index.html       ← HTML template
│   ├── Dockerfile           ← Frontend container
│   └── package.json         ← Node packages
│
├── k8s/                     ← Kubernetes configs
│   ├── namespace.yaml       ← K8s namespace
│   ├── secrets.yaml         ← Passwords/keys
│   ├── configmap.yaml       ← Environment vars
│   ├── postgres.yaml        ← Database pod
│   ├── backend-deployment.yaml ← Backend pods
│   ├── frontend-deployment.yaml ← Frontend pods
│   ├── ingress.yaml         ← HTTPS routing
│   └── network-policy.yaml  ← Security rules
│
├── monitoring/
│   ├── prometheus/
│   │   └── prometheus.yml   ← Scrape config
│   └── grafana/
│       ├── datasources.yml  ← Prometheus source
│       └── dashboards/
│           └── landiq-dashboard.json ← Dashboard
│
├── docs/
│   └── DEPLOYMENT.md        ← How to deploy
│
├── docker-compose.yml       ← All 5 services
├── .gitignore               ← Files to ignore
├── README.md                ← Project overview
├── CONTRIBUTING.md          ← Agile workflow
└── CHANGELOG.md             ← Sprint history

==============================================================
PART 4: DATABASE MODELS (5 tables)
==============================================================

1. users table:
   - id, email, password_hash, full_name
   - role (user/analyst/admin)
   - is_active, created_at, updated_at

2. land_parcels table:
   - id, survey_number, city, state, district
   - land_type (residential/commercial/agricultural/industrial)
   - area_sqft, quoted_price, owner_name
   - flood_zone_risk, pending_litigations
   - dist_highway_km, dist_metro_km, near_tech_park

3. prediction_results table:
   - id, parcel_id, user_id
   - estimated_value, confidence_interval
   - risk_score, risk_level, fraud_probability
   - investment_score, recommendation
   - shap_values (JSON), forecast_1yr, forecast_3yr

4. documents table:
   - id, parcel_id, doc_type
   - filename, file_path, ocr_text
   - extracted_owner, extracted_area
   - integrity_score, status

5. ownership_history table:
   - id, parcel_id, owner_name
   - transfer_date, transfer_price

==============================================================
PART 5: API ENDPOINTS (20+ routes)
==============================================================

AUTH:
POST /api/auth/register  ← Create account
POST /api/auth/login     ← Login, get JWT token
GET  /api/auth/me        ← Get current user

PARCELS (needs JWT):
GET    /api/parcels/         ← List all parcels
POST   /api/parcels/         ← Create parcel
GET    /api/parcels/:id      ← Get one parcel
PUT    /api/parcels/:id      ← Update parcel
DELETE /api/parcels/:id      ← Delete parcel

ANALYSIS (needs JWT):
POST /api/analysis/parcel/:id        ← Run AI analysis
GET  /api/analysis/parcel/:id/history ← Analysis history
GET  /api/analysis/report/:id        ← Download PDF

DOCUMENTS (needs JWT):
POST /api/documents/upload/:parcel_id ← Upload document
GET  /api/documents/parcel/:id        ← List documents

ADMIN (analyst/admin only):
GET   /api/admin/stats        ← System statistics
GET   /api/admin/users        ← All users
PATCH /api/admin/users/:id    ← Update user role
GET   /api/admin/analyses     ← Recent analyses

LEGACY (no auth needed):
POST /api/analyze    ← Quick analysis (30/hr limit)
POST /api/upload-doc ← Upload document
GET  /api/report/:id ← Download report

MONITORING:
GET /api/health  ← Health check
GET /metrics     ← Prometheus metrics

==============================================================
PART 6: THE 6 AI MODELS
==============================================================

MODEL 1: Random Forest (valuation.py)
- Type: Regressor
- Trees: 150
- Weight in ensemble: 35%
- R² score: 0.8947
- How it works: 150 decision trees vote, take average
- Saved as: rf.pkl

MODEL 2: XGBoost (valuation.py)
- Type: Regressor
- Estimators: 300, Learning rate: 0.04
- Weight in ensemble: 45%
- R² score: 0.8921
- How it works: Each tree learns from previous tree's errors
- Saved as: xgboost.pkl

MODEL 3: ANN - Artificial Neural Network (valuation.py)
- Type: MLPRegressor
- Layers: 128 → 64 → 32 neurons
- Activation: ReLU, Optimizer: Adam
- Weight in ensemble: 20%
- R² score: 0.8985
- Saved as: ann.pkl + scaler.pkl

ENSEMBLE RESULT:
Final = 35% RF + 45% XGB + 20% ANN
R² = 0.8990 (best accuracy!)
MAE = Rs.1,016/sqft

MODEL 4: GradientBoosting Classifier (risk_analysis.py)
- Type: Classifier
- Estimators: 200
- Predicts: LOW / MEDIUM / HIGH / CRITICAL
- Accuracy: 73.6%
- Also gives probability for each class
- Saved as: risk_classifier.pkl

MODEL 5: IsolationForest (fraud_detection.py)
- Type: Anomaly Detector
- Trees: 200, Contamination: 8%
- Detects: Fraudulent/suspicious properties
- Gives anomaly score 0-100
- Score > 70 = suspicious
- Saved as: anomaly_detector.pkl

MODEL 6: SHAP (valuation.py)
- Type: Explainable AI
- Shows which features drove the prediction
- Top 8 features returned
- Example: "area_sqft contributed 35%"

DATASET:
- 8,000 Bangalore land records
- 60 real localities
- 18 features per record
- Price range: Rs.583 - Rs.35,073/sqft
- Saved as: bangalore_land_data.csv

==============================================================
PART 7: AGILE METHODOLOGY
==============================================================

WHAT IS AGILE?
Building software in small cycles (sprints) instead of all at once.

3 AGILE MODELS WE USED:

1. SCRUM (Primary):
   - 8 sprints × 2 weeks each
   - Sprint Planning → Daily Standup → Sprint Review → Retrospective
   - Product Backlog: 55 user stories, 228 story points
   - Average velocity: 28.5 story points per sprint

2. KANBAN (Workflow):
   - 4 columns: To Do | In Progress | Done | Blocked
   - File: agile/KANBAN_BOARD.md
   - Tracks all 55 user stories

3. XP - Extreme Programming:
   - Modular coding (each module separate)
   - Continuous testing (40+ pytest tests)
   - Refactoring (improved code quality)
   - Simple design (one function = one job)

8 SPRINTS:
Sprint 1: Login, Register, JWT Auth (28 SP)
Sprint 2: Backend API, Database, Parcel CRUD (30 SP)
Sprint 3: RF + XGBoost + ANN models (32 SP)
Sprint 4: GBM Risk + IsolationForest Fraud (34 SP)
Sprint 5: Bangalore Map, 60 localities (26 SP)
Sprint 6: SHAP/XAI + Recommendation Engine (24 SP)
Sprint 7: PDF Reports, Admin Panel (28 SP)
Sprint 8: Docker, Kubernetes, CI/CD (26 SP)

AGILE ARTIFACTS (files in agile/ folder):
- PRODUCT_BACKLOG.md    ← 55 user stories with story points
- KANBAN_BOARD.md       ← Task tracking board
- BURNDOWN_VELOCITY.md  ← Sprint velocity charts
- sprints/sprint-1.md   ← Sprint 1 backlog + standup log
- sprints/sprint-3.md   ← ML sprint details
- sprints/sprint-4.md   ← Risk/Fraud sprint details
- sprints/sprint-8.md   ← DevOps sprint details
- user-stories/USER_STORIES.md ← Acceptance criteria

USER STORY FORMAT:
"As a [user], I want [feature] so that [benefit]"
Example: "As a user, I want AI to estimate land value
          so that I know the fair market price"

STORY POINTS:
1 = Very easy (1 hour)
3 = Easy (half day)
5 = Medium (1 day)
8 = Hard (2-3 days)

==============================================================
PART 8: DEVOPS
==============================================================

WHAT IS DEVOPS?
DevOps = Development + Operations
Automate everything: testing, building, deploying, monitoring

OUR DEVOPS PIPELINE:

STEP 1: GIT (Version Control)
- Tracks every change in code
- Commands used:
  git init              ← Start tracking
  git add .             ← Stage all files
  git commit -m "msg"   ← Save snapshot
  git push origin main  ← Upload to GitHub
- 92 files committed, 3 commits total

STEP 2: GITHUB (Remote Repository)
- URL: github.com/pavansubramani7-max/landiq
- Stores all code online
- Team can collaborate
- Triggers CI/CD automatically

STEP 3: GITHUB ACTIONS (CI/CD)
- File: .github/workflows/ci-cd.yml
- Triggers: Every push to main branch
- Pipeline steps:
  1. Run pytest (backend tests)
  2. Run npm build (frontend tests)
  3. Build Docker images
  4. Push to GitHub Container Registry
  5. Deploy to Kubernetes cluster
- File: .github/workflows/pr-check.yml
  - Runs on Pull Requests
  - Checks: flake8 lint, bandit security, dockerfile lint

STEP 4: DOCKER (Containerization)
- Packages app + dependencies into container
- Like a lunchbox - works same everywhere
- Files:
  backend/Dockerfile   ← Backend container
  frontend/Dockerfile  ← Frontend container
  docker-compose.yml   ← All 5 services together

5 DOCKER SERVICES:
  landiq-backend    → port 5000 (Flask API)
  landiq-frontend   → port 3000 (React + Nginx)
  landiq-postgres   → port 5432 (Database)
  landiq-prometheus → port 9090 (Monitoring)
  landiq-grafana    → port 3001 (Dashboard)

STEP 5: KUBERNETES (Orchestration)
- Manages multiple containers in cloud
- Auto-scales when traffic increases
- Files in k8s/ folder:
  namespace.yaml          ← Isolated environment
  secrets.yaml            ← Passwords/keys
  configmap.yaml          ← Environment variables
  postgres.yaml           ← Database StatefulSet
  backend-deployment.yaml ← 2-10 pods (auto-scale)
  frontend-deployment.yaml ← 2-6 pods (auto-scale)
  ingress.yaml            ← HTTPS routing
  network-policy.yaml     ← Security rules

HPA (Horizontal Pod Autoscaler):
- Backend: min 2 pods, max 10 pods
- Scales up when CPU > 70%
- Scales down when CPU < 70%

STEP 6: PROMETHEUS + GRAFANA (Monitoring)
- Prometheus: Collects metrics from /metrics endpoint
- Grafana: Shows beautiful dashboards
- Metrics tracked:
  - API requests per minute
  - Average response time
  - Error rate %
  - Active users

==============================================================
PART 9: HOW TO RUN THE PROJECT
==============================================================

METHOD 1: LOCAL (Simple - for development)

Terminal 1 - Backend:
  cd c:\LandIQ\backend
  python app.py
  → Opens at http://localhost:5000

Terminal 2 - Frontend:
  cd c:\LandIQ\frontend
  npm start
  → Opens at http://localhost:3000

Train ML Models (one time only):
  cd c:\LandIQ\backend
  python models/train_model.py
  → Trains all 6 models, saves .pkl files

METHOD 2: DOCKER (Professional - for demo)

Start all 5 services:
  cd c:\LandIQ
  docker-compose up --build

Stop all services:
  docker-compose down

Check running containers:
  docker ps

View backend logs:
  docker logs landiq-backend

URLs after Docker starts:
  http://localhost:3000  ← Website
  http://localhost:5000/api/health ← API health
  http://localhost:9090  ← Prometheus
  http://localhost:3001  ← Grafana (admin/landiq_grafana)

==============================================================
PART 10: GIT COMMANDS EXPLAINED
==============================================================

git init
→ Creates a new Git repository in current folder
→ Creates hidden .git folder to track changes

git add .
→ Stages ALL files for commit
→ "." means all files
→ git add filename.py ← add specific file

git commit -m "message"
→ Saves a snapshot of staged files
→ Message describes what changed
→ Example: git commit -m "feat: add login page"

git status
→ Shows which files are changed/staged

git log
→ Shows all commits with messages

git branch -M main
→ Renames current branch to "main"

git remote add origin URL
→ Links local repo to GitHub repo
→ "origin" is nickname for GitHub URL

git push -u origin main
→ Uploads commits to GitHub
→ "-u" sets upstream (remembers where to push)
→ After first time, just use: git push

git pull
→ Downloads latest changes from GitHub

git clone URL
→ Downloads entire project from GitHub

COMMIT MESSAGE CONVENTION:
feat:     new feature added
fix:      bug fixed
docs:     documentation updated
test:     tests added
chore:    build/config changes
refactor: code improved without changing behavior

==============================================================
PART 11: GITHUB ACTIONS EXPLAINED
==============================================================

FILE: .github/workflows/ci-cd.yml

WHAT IT DOES:
Every time you push code to GitHub main branch,
GitHub automatically runs this pipeline:

TRIGGER:
  on:
    push:
      branches: [main]    ← runs on push to main
    pull_request:
      branches: [main]    ← runs on PR to main

JOB 1: test-backend
  - Sets up Python 3.11
  - Installs requirements.txt
  - Trains ML models
  - Runs: pytest tests/ -v
  - If any test fails → pipeline stops

JOB 2: test-frontend
  - Sets up Node 18
  - Runs: npm install
  - Runs: npm run build
  - If build fails → pipeline stops

JOB 3: build-and-push (only on main branch)
  - Logs into GitHub Container Registry
  - Builds backend Docker image
  - Builds frontend Docker image
  - Pushes both images to registry

JOB 4: deploy (only on main branch)
  - Connects to Kubernetes cluster
  - Updates image tags
  - Runs: kubectl apply -f k8s/
  - Waits for rollout to complete

FILE: .github/workflows/pr-check.yml
  - Runs on every Pull Request
  - Checks Python code style (flake8)
  - Checks security issues (bandit)
  - Checks Dockerfile best practices (hadolint)

==============================================================
PART 12: COMMON EXAM QUESTIONS & ANSWERS
==============================================================

Q: What is Agile?
A: Agile is iterative software development. We build in
   2-week sprints, deliver working software each sprint,
   and improve based on feedback. We used Scrum + Kanban + XP.

Q: What is a Sprint?
A: A 2-week development cycle. We had 8 sprints.
   Each sprint: Planning → Daily Standup → Review → Retrospective.
   We completed 228 story points total.

Q: What is a User Story?
A: Requirement from user's perspective:
   "As a user, I want X so that Y"
   We have 55 user stories with acceptance criteria.

Q: What is DevOps?
A: Combining development and operations with automation.
   Our pipeline: code → GitHub → Actions → Docker → Kubernetes.

Q: What is Docker?
A: Containerization tool. Packages app + dependencies.
   Works same on any machine. We have 5 containers.
   Command: docker-compose up --build

Q: What is Kubernetes?
A: Container orchestration. Auto-scales, load balances,
   restarts crashed containers. We configured HPA:
   backend scales 2-10 pods based on CPU usage.

Q: What is CI/CD?
A: CI = Continuous Integration (auto test on every push)
   CD = Continuous Deployment (auto deploy after tests pass)
   Our tool: GitHub Actions (.github/workflows/ci-cd.yml)

Q: How many AI models?
A: 6 models:
   - Random Forest (35%) R²=0.8947
   - XGBoost (45%) R²=0.8921
   - ANN (20%) R²=0.8985
   - Ensemble R²=0.8990
   - GBM Risk Classifier (73.6% accuracy)
   - IsolationForest Anomaly Detector

Q: What is SHAP?
A: SHapley Additive exPlanations - Explainable AI.
   Shows which features contributed most to prediction.
   Example: "area_sqft contributed 35% to valuation"

Q: What dataset?
A: 8,000 Bangalore land records, 60 localities,
   18 features, price Rs.583-35,073/sqft (2024 data)

Q: What is Kanban?
A: Visual workflow board with columns:
   To Do | In Progress | Done | Blocked
   File: agile/KANBAN_BOARD.md

Q: What is Burndown chart?
A: Shows remaining story points over sprint days.
   X-axis = days, Y-axis = story points remaining.
   Ideal line goes from total to zero.
   File: agile/BURNDOWN_VELOCITY.md

Q: What is HPA?
A: Horizontal Pod Autoscaler in Kubernetes.
   Automatically adds more pods when CPU > 70%.
   Backend: min 2 pods, max 10 pods.

Q: What is Prometheus?
A: Monitoring tool that collects metrics from /metrics endpoint.
   Tracks: request rate, response time, error rate.

Q: What is Grafana?
A: Dashboard tool that visualizes Prometheus metrics.
   URL: http://localhost:3001
   Login: admin / landiq_grafana

==============================================================
PART 13: DEMO STEPS (Show teacher)
==============================================================

STEP 1: Show Docker running
  Command: docker ps
  Shows: 5 containers all running

STEP 2: Open website
  URL: http://localhost:3000
  Shows: Professional home page with hero section

STEP 3: Register account
  Click "Get Started Free"
  Fill: name, email, password
  Shows: Dashboard with charts

STEP 4: Add a parcel
  Click "Add Parcel"
  Fill: Whitefield, residential, 2400 sqft, Rs.18,000,000
  Click "Create Parcel"

STEP 5: Run AI Analysis
  Click on parcel → "Run AI Analysis"
  Shows:
  - Estimated value (3 model estimates)
  - Risk score with gauge meter
  - Risk probabilities (ML classifier)
  - Fraud detection + anomaly score
  - 5-year forecast chart
  - SHAP feature importance
  - Buy/Hold/Avoid recommendation

STEP 6: Download PDF Report
  Click "PDF Report"
  Shows: Professional PDF with all 6 model outputs

STEP 7: Show Map
  Click "Map" in navbar
  Shows: 60 Bangalore localities with risk zones

STEP 8: Show Admin Panel
  Click "Admin" (need admin role)
  Shows: System stats, user management, analysis logs

STEP 9: Show Grafana
  URL: http://localhost:3001
  Shows: API monitoring dashboard

STEP 10: Show GitHub
  URL: github.com/pavansubramani7-max/landiq
  Shows: All code, 92 files, CI/CD pipeline

STEP 11: Show Agile docs
  Open: agile/PRODUCT_BACKLOG.md
  Shows: 55 user stories, 228 story points

STEP 12: Show CI/CD
  Open: .github/workflows/ci-cd.yml
  Explain: Automated test → build → deploy pipeline

==============================================================
PART 14: KEY NUMBERS TO REMEMBER
==============================================================

PROJECT:
- 8 Sprints
- 55 User Stories
- 228 Story Points
- 28.5 Average Velocity per Sprint
- 92 Files committed to Git
- 3 Git commits

AI/ML:
- 6 AI Models
- 8,000 Training Records
- 60 Bangalore Localities
- 18 Features per record
- R² = 0.8990 (Ensemble accuracy)
- MAE = Rs.1,016/sqft
- 73.6% Risk Classifier accuracy

BACKEND:
- 20+ API Endpoints
- 5 Database Tables
- 40+ Automated Tests
- 30 requests/hour rate limit

FRONTEND:
- 10 Pages
- 7 Components
- 1 AuthContext
- 1 API utility file

DEVOPS:
- 5 Docker containers
- 9 Kubernetes manifest files
- 2 GitHub Actions workflows
- 2 Monitoring tools (Prometheus + Grafana)

PORTS:
- 3000 → Frontend (React)
- 5000 → Backend (Flask)
- 5432 → PostgreSQL
- 9090 → Prometheus
- 3001 → Grafana

==============================================================
END OF GUIDE
==============================================================
Created by: Amazon Q Developer
Project: LandIQ v2.0.0
GitHub: github.com/pavansubramani7-max/landiq
Subject: Agile & DevOps | CSE AIML | 2nd Year 4th Sem
