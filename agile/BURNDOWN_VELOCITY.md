# LandIQ — Sprint Burndown & Velocity Report

## Project Summary
- **Total Story Points:** 228
- **Total Sprints:** 8
- **Average Velocity:** 28.5 SP/sprint
- **Total User Stories:** 55
- **Completion Rate:** 100%

---

## Sprint Velocity Chart

```
Sprint Velocity (Story Points Completed)
|
35 |          ████
34 |     ████ ████ ████ ████
32 | ████ ████ ████ ████ ████
30 | ████ ████ ████ ████ ████ ████
28 | ████ ████ ████ ████ ████ ████ ████
26 | ████ ████ ████ ████ ████ ████ ████ ████
   |------------------------------------------
     S1   S2   S3   S4   S5   S6   S7   S8
```

| Sprint | Goal | Committed SP | Completed SP | Velocity |
|--------|------|-------------|--------------|----------|
| Sprint 1 | Auth & Setup | 28 | 28 | 28 |
| Sprint 2 | Backend & DB | 30 | 30 | 30 |
| Sprint 3 | ML Valuation | 32 | 32 | 32 |
| Sprint 4 | Risk & Fraud | 34 | 34 | 34 |
| Sprint 5 | Geo-Spatial | 26 | 26 | 26 |
| Sprint 6 | XAI & Recommend | 24 | 24 | 24 |
| Sprint 7 | Reporting & Admin | 28 | 28 | 28 |
| Sprint 8 | DevOps & Deploy | 26 | 26 | 26 |
| **Total** | | **228** | **228** | **28.5 avg** |

---

## Sprint 8 Burndown Chart

```
Remaining Story Points
26 |*
24 |  *
22 |    *
20 |      *
18 |        *
16 |          *
14 |            *
12 |              *
10 |                *
 8 |                  *
 6 |                    *
 4 |                      *
 2 |                        *
 0 |                          *
   |--------------------------------
   D1 D2 D3 D4 D5 D6 D7 D8 D9 D10
   (Ideal burndown — linear completion)
```

---

## Cumulative Flow Diagram

| Sprint End | Backlog | In Progress | Done |
|------------|---------|-------------|------|
| Sprint 1   | 200     | 0           | 28   |
| Sprint 2   | 170     | 0           | 58   |
| Sprint 3   | 138     | 0           | 90   |
| Sprint 4   | 104     | 0           | 124  |
| Sprint 5   | 78      | 0           | 150  |
| Sprint 6   | 54      | 0           | 174  |
| Sprint 7   | 26      | 0           | 202  |
| Sprint 8   | 0       | 2           | 226  |

---

## Definition of Done (DoD)

A user story is DONE when:
- [x] Code written and reviewed
- [x] Unit tests passing (pytest / npm build)
- [x] Feature works end-to-end (backend + frontend)
- [x] No critical bugs
- [x] Committed to Git
- [x] Documented in CHANGELOG.md

---

## XP Practices Tracker

| Practice | Applied In | Evidence |
|----------|-----------|---------|
| Modular Coding | All sprints | Separate modules: valuation.py, risk_analysis.py, fraud_detection.py, forecasting.py |
| Continuous Testing | Sprint 1-8 | 40+ pytest tests in tests/test_all.py |
| Refactoring | Sprint 3,4 | _build_features(), _encode() extracted as helpers |
| Simple Design | All sprints | Each module has single responsibility |
| Collective Ownership | All sprints | All code in single Git repo |
| Continuous Integration | Sprint 8 | GitHub Actions runs on every push |

---

## Scrum Ceremonies Log

| Sprint | Planning | Daily Standups | Review | Retrospective |
|--------|----------|----------------|--------|---------------|
| Sprint 1 | ✅ | 7 days | ✅ | ✅ |
| Sprint 2 | ✅ | 7 days | ✅ | ✅ |
| Sprint 3 | ✅ | 7 days | ✅ | ✅ |
| Sprint 4 | ✅ | 7 days | ✅ | ✅ |
| Sprint 5 | ✅ | 7 days | ✅ | ✅ |
| Sprint 6 | ✅ | 7 days | ✅ | ✅ |
| Sprint 7 | ✅ | 7 days | ✅ | ✅ |
| Sprint 8 | ✅ | 7 days | ✅ | ✅ |
