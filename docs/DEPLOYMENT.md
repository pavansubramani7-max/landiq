# LandIQ Deployment Guide

## 1. Local Development

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python models/train_model.py  # one-time
python app.py                 # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm start                     # http://localhost:3000
```

---

## 2. Docker Compose (Full Stack + Monitoring)

```bash
# Copy and configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your secrets

# Start all services
docker-compose up --build

# Services:
# Frontend:   http://localhost:3000
# Backend:    http://localhost:5000
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001  (admin / landiq_grafana)
```

---

## 3. Kubernetes (Production)

### Prerequisites
- kubectl configured for your cluster
- Docker images pushed to registry
- cert-manager installed for TLS

### Deploy

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Apply secrets (edit k8s/secrets.yaml first with real values)
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/configmap.yaml

# 3. Deploy database
kubectl apply -f k8s/postgres.yaml
kubectl wait --for=condition=ready pod -l app=postgres -n landiq --timeout=60s

# 4. Deploy application
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# 5. Configure ingress + TLS
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/network-policy.yaml

# 6. Verify
kubectl get pods -n landiq
kubectl get hpa   -n landiq
kubectl get ingress -n landiq
```

### Scaling

```bash
# Manual scale
kubectl scale deployment landiq-backend --replicas=5 -n landiq

# HPA auto-scales between 2–10 replicas based on CPU/memory
kubectl describe hpa landiq-backend-hpa -n landiq
```

### Rolling Update (Zero Downtime)

```bash
# Update image tag
kubectl set image deployment/landiq-backend \
  backend=ghcr.io/YOUR_ORG/landiq-backend:sha-abc1234 \
  -n landiq

# Monitor rollout
kubectl rollout status deployment/landiq-backend -n landiq

# Rollback if needed
kubectl rollout undo deployment/landiq-backend -n landiq
```

---

## 4. CI/CD Pipeline (GitHub Actions)

The pipeline triggers automatically on push to `main`:

```
Push to main
    │
    ├── test-backend   (pytest)
    ├── test-frontend  (npm build)
    │
    └── build-and-push (Docker images → ghcr.io)
            │
            └── deploy (kubectl apply → K8s cluster)
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `KUBECONFIG` | Base64-encoded kubeconfig for cluster access |
| `SECRET_KEY` | Flask secret key |
| `JWT_SECRET_KEY` | JWT signing key |

---

## 5. Monitoring

### Prometheus
- URL: http://localhost:9090
- Scrapes `/metrics` from backend every 10s
- Tracks: request rate, response time, error rate

### Grafana
- URL: http://localhost:3001
- Login: admin / landiq_grafana
- Dashboard: "LandIQ Platform Dashboard" (auto-provisioned)
- Panels: API requests/min, avg response time, error rate %, active users

---

## 6. Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SECRET_KEY` | dev-secret | Flask secret key |
| `JWT_SECRET_KEY` | same as SECRET_KEY | JWT signing key |
| `DATABASE_URL` | sqlite:///./landiq.db | DB connection string |
| `POSTGRES_PASSWORD` | landiq_dev_pass | PostgreSQL password |
| `JWT_ACCESS_TOKEN_EXPIRES` | 3600 | Token TTL in seconds |
| `UPLOAD_FOLDER` | uploads/ | File upload directory |
| `REPORTS_FOLDER` | reports/ | PDF report directory |
