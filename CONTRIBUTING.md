# Contributing to LandIQ

## Agile Development Methodology

LandIQ follows **Scrum** as the primary framework with **Kanban** for workflow management and **XP** practices for code quality.

---

## Sprint Structure

| Sprint | Duration | Focus |
|--------|----------|-------|
| Sprint 1 | Week 1–2  | Auth system, project setup, basic UI |
| Sprint 2 | Week 3–4  | Backend API, database, land input module |
| Sprint 3 | Week 5–6  | ML valuation model (RF + XGBoost) |
| Sprint 4 | Week 7–8  | Risk prediction + fraud detection |
| Sprint 5 | Week 9–10 | Geo-spatial integration + maps |
| Sprint 6 | Week 11–12| Recommendation engine + XAI/SHAP |
| Sprint 7 | Week 13–14| PDF/Excel reporting module |
| Sprint 8 | Week 15–16| Docker + K8s + CI/CD deployment |

---

## Git Branching Strategy (GitFlow)

```
main          ← production-ready code only
develop       ← integration branch
feature/*     ← new features (e.g. feature/fraud-detection)
bugfix/*      ← bug fixes
hotfix/*      ← urgent production fixes
release/*     ← release preparation
```

### Branch Naming
```bash
git checkout -b feature/valuation-model
git checkout -b bugfix/cursor-jump-fix
git checkout -b hotfix/jwt-expiry-fix
```

---

## Commit Message Convention (Conventional Commits)

```
feat:     new feature
fix:      bug fix
docs:     documentation only
style:    formatting, no logic change
refactor: code restructure, no feature change
test:     adding/updating tests
chore:    build, CI, dependencies
perf:     performance improvement
```

**Examples:**
```
feat(ml): add XGBoost ensemble with 60/40 weighting
fix(auth): resolve JWT token expiry on refresh
test(api): add admin route coverage tests
chore(docker): add PostgreSQL service to compose
```

---

## Pull Request Process

1. Create feature branch from `develop`
2. Write code + tests (XP: test-first where possible)
3. Ensure `pytest tests/ -v` passes locally
4. Ensure `npm run build` passes for frontend changes
5. Open PR against `develop`
6. PR requires 1 reviewer approval
7. CI/CD pipeline must pass (lint + tests + build)
8. Squash merge into `develop`

---

## Code Standards

### Backend (Python)
- PEP 8 style, max line length 120
- All routes must have docstrings
- All new modules must have unit tests in `tests/`
- Use type hints where possible

### Frontend (React)
- Use `useRef` for text/number inputs (prevents cursor jumping)
- Use `useState` only for selects, checkboxes, and UI state
- Components must be functional (no class components)
- CSS via `index.css` classes, avoid inline styles for layout

---

## Local Development Setup

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python models/train_model.py
python app.py

# Frontend
cd frontend
npm install
npm start
```

---

## Running Tests

```bash
# Backend unit + integration tests
cd backend
pytest tests/ -v --tb=short

# Live API integration test (requires running backend)
python test_api.py
```

---

## Kanban Board Labels

| Label | Meaning |
|-------|---------|
| `sprint-N` | Belongs to sprint N |
| `priority-high` | Must complete this sprint |
| `priority-low` | Nice to have |
| `blocked` | Waiting on dependency |
| `in-review` | PR open, awaiting review |
| `bug` | Something broken |
| `enhancement` | Improvement to existing feature |
