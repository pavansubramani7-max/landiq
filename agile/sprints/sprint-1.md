# Sprint 1 — Foundation & Authentication
**Duration:** Week 1–2  
**Sprint Goal:** Working authentication system with basic UI  
**Team Velocity:** 28 story points  

---

## Sprint Backlog

| Task ID | User Story | Task | Assignee | Status | Hours Est | Hours Actual |
|---------|-----------|------|----------|--------|-----------|--------------|
| T-001 | US-01 | Create User SQLAlchemy model with UUID PK | Dev | DONE | 2 | 2 |
| T-002 | US-01 | Implement set_password() / check_password() | Dev | DONE | 1 | 1 |
| T-003 | US-01 | POST /api/auth/register endpoint | Dev | DONE | 2 | 2 |
| T-004 | US-02 | POST /api/auth/login with JWT token | Dev | DONE | 2 | 2 |
| T-005 | US-02 | GET /api/auth/me protected endpoint | Dev | DONE | 1 | 1 |
| T-006 | US-03 | UserRole enum (user/analyst/admin) | Dev | DONE | 1 | 1 |
| T-007 | US-03 | JWT interceptor in React axios | Dev | DONE | 2 | 2 |
| T-008 | US-03 | ProtectedRoute component in React | Dev | DONE | 2 | 2 |
| T-009 | US-01 | Login page with uncontrolled inputs | Dev | DONE | 3 | 3 |
| T-010 | US-01 | Register page with validation | Dev | DONE | 3 | 3 |
| T-011 | US-04 | AuthContext with localStorage JWT | Dev | DONE | 2 | 2 |
| T-012 | US-03 | Navbar with auth-aware links | Dev | DONE | 2 | 2 |
| T-013 | - | Flask app setup with CORS, JWT, Limiter | Dev | DONE | 2 | 2 |
| T-014 | - | SQLite database with init_db() | Dev | DONE | 1 | 1 |
| T-015 | - | React project structure setup | Dev | DONE | 1 | 1 |

---

## Acceptance Criteria

- [x] User can register with email/password
- [x] User receives JWT token on login
- [x] Protected routes redirect to login if no token
- [x] Token stored in localStorage
- [x] Auto-logout on 401 response
- [x] Role (user/analyst/admin) stored in token

---

## Daily Standup Log

**Day 1:** Setup Flask app, CORS, JWT config. Created User model.  
**Day 2:** Implemented register/login endpoints. Tested with Postman.  
**Day 3:** Created React project. Setup AuthContext and axios interceptor.  
**Day 4:** Built Login and Register pages. Fixed cursor-jump bug with useRef.  
**Day 5:** Built Navbar with auth-aware links. ProtectedRoute working.  
**Day 6:** Integration testing. Fixed JWT expiry handling.  
**Day 7:** Sprint review — all 15 tasks DONE. Velocity: 28 SP.  

---

## Sprint Review

**Demo:** Login → Dashboard redirect working. Register creates user in DB.  
**Retrospective:**  
- What went well: JWT setup was smooth, React AuthContext clean  
- What to improve: Need better error messages on failed login  
- Action item: Add show/hide password toggle (done in Sprint 1 polish)  
