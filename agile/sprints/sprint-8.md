# Sprint 8 — DevOps, Docker & Kubernetes Deployment
**Duration:** Week 15–16  
**Sprint Goal:** Full containerization, CI/CD pipeline, K8s deployment  
**Team Velocity:** 34 story points  

---

## Sprint Backlog

| Task ID | User Story | Task | Status | Hours Est | Hours Actual |
|---------|-----------|------|--------|-----------|--------------|
| T-111 | US-51 | Backend Dockerfile (python:3.11-slim, gunicorn) | DONE | 2 | 2 |
| T-112 | US-51 | Frontend Dockerfile (node:18-alpine + nginx:alpine) | DONE | 2 | 2 |
| T-113 | US-52 | Docker Compose with backend + frontend + postgres + prometheus + grafana | DONE | 3 | 4 |
| T-114 | US-49 | prometheus-flask-exporter /metrics endpoint | DONE | 2 | 2 |
| T-115 | US-50 | Prometheus config scraping backend every 10s | DONE | 1 | 1 |
| T-116 | US-50 | Grafana datasource + dashboard JSON provisioning | DONE | 2 | 2 |
| T-117 | US-53 | K8s namespace.yaml | DONE | 1 | 1 |
| T-118 | US-53 | K8s secrets.yaml + configmap.yaml | DONE | 1 | 1 |
| T-119 | US-53 | K8s postgres StatefulSet + PVC + Service | DONE | 2 | 2 |
| T-120 | US-53 | K8s backend Deployment + ClusterIP Service | DONE | 2 | 2 |
| T-121 | US-55 | HPA for backend (2-10 pods, CPU 70%) | DONE | 2 | 2 |
| T-122 | US-53 | K8s frontend Deployment + HPA (2-6 pods) | DONE | 2 | 2 |
| T-123 | US-53 | K8s Ingress with HTTPS/TLS (cert-manager) | DONE | 2 | 2 |
| T-124 | US-53 | NetworkPolicy for service isolation | DONE | 1 | 1 |
| T-125 | US-54 | GitHub Actions ci-cd.yml (test → build → push → deploy) | DONE | 3 | 3 |
| T-126 | US-54 | GitHub Actions pr-check.yml (lint + security + dockerfile) | DONE | 2 | 2 |
| T-127 | - | Git init + first commit (90 files) | DONE | 1 | 1 |
| T-128 | - | .gitignore (Python, Node, Docker, secrets) | DONE | 1 | 1 |

---

## Infrastructure Summary

| Service | Technology | Port |
|---------|-----------|------|
| Frontend | React + Nginx | 3000 |
| Backend | Flask + Gunicorn | 5000 |
| Database | PostgreSQL 15 | 5432 |
| Monitoring | Prometheus | 9090 |
| Dashboard | Grafana | 3001 |

---

## Kubernetes Resources

| Resource | Count |
|----------|-------|
| Deployments | 2 (backend, frontend) |
| StatefulSets | 1 (postgres) |
| Services | 3 |
| HPAs | 2 |
| ConfigMaps | 1 |
| Secrets | 1 |
| Ingress | 1 |
| NetworkPolicies | 1 |
| PVCs | 1 |

---

## Acceptance Criteria

- [x] docker-compose up --build starts all 5 services
- [x] Backend health check passes at /api/health
- [x] Frontend serves React app via Nginx
- [x] Prometheus scrapes /metrics every 10s
- [x] Grafana dashboard auto-provisioned
- [x] K8s HPA scales backend 2-10 pods on CPU load
- [x] GitHub Actions runs on push to main
- [x] CI pipeline: pytest → npm build → docker push → kubectl deploy
