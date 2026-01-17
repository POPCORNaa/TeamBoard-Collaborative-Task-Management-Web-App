# DevOps Pipeline - Task Manager Application

## Overview

This document describes the CI/CD pipeline, infrastructure, and deployment process.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         GitHub                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   Code      │───▶│   CI/CD     │───▶│   Container         │ │
│  │   Push      │    │   Actions   │    │   Registry (GHCR)   │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ VPN + SSH
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Staging Server (VM)                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │  Frontend   │    │   Backend   │    │     MongoDB         │ │
│  │  (Nginx)    │◀──▶│  (Node.js)  │◀──▶│    (Atlas)          │ │
│  │  Port 80    │    │  Port 3000  │    │                     │ │
│  └─────────────┘    └─────────────┘    └─────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                 LGTM Monitoring Stack                        ││
│  │  Grafana (3001) │ Loki │ Tempo │ Mimir │ OpenTelemetry      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## CI/CD Pipeline Stages

### Pipeline Flow
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│   Push   │────▶│   Test   │────▶│  Build   │────▶│  Deploy  │
│   Code   │     │  Stage   │     │  Stage   │     │  Stage   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

---

### Stage 1: Test
**Trigger:** Every push and PR to `main`

```yaml
Steps:
├── Checkout code
├── Setup Node.js 22
├── Frontend
│   ├── npm install
│   ├── npm run lint
│   ├── npm run build
│   └── npm run test
└── Backend
    ├── npm install
    ├── npm run lint
    └── npm run test
```

---

### Stage 2: Build & Push Images
**Trigger:** Push to `main` only (after tests pass)

```yaml
Steps:
├── Setup Docker Buildx
├── Login to GitHub Container Registry (GHCR)
├── Build frontend image
│   └── Push to ghcr.io/5g00dm04-3007/course-project-tried-asking-gpt-frontend
└── Build backend image
    └── Push to ghcr.io/5g00dm04-3007/course-project-tried-asking-gpt-backend
```

---

### Stage 3: Deploy to Staging
**Trigger:** After successful build

```yaml
Steps:
├── Install OpenVPN
├── Setup VPN config from secrets
├── Connect to school VPN
├── Wait for VPN connection
├── Setup SSH keys
├── Create stage_stack configuration
│   ├── docker-compose.yml
│   └── .env (with secrets)
├── Rsync files to server
├── SSH to server
│   ├── Docker login to GHCR
│   ├── docker compose pull
│   └── docker compose up -d
└── Kill VPN connection
```

---

## Docker Configuration

### Frontend Dockerfile
```dockerfile
# Build Stage
FROM node:22-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# Production Stage
FROM nginx:alpine3.20-slim
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Docker Compose

### Production (docker-compose.yml)
```yaml
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - NODE_ENV=production
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://lgtm:4318
    networks:
      - default
      - observability

networks:
  observability:
    external: true
```

---

## Monitoring & Observability

### LGTM Stack
| Component | Purpose | Port |
|-----------|---------|------|
| Grafana | Dashboard & Visualization | 3001 |
| Loki | Log Aggregation | - |
| Tempo | Distributed Tracing | - |
| Mimir | Metrics Storage | - |

### OpenTelemetry Integration
Backend sends telemetry via OTLP:
- **Traces:** Request flow tracking
- **Metrics:** Performance data
- **Logs:** Application logs

### Grafana Dashboards

**Panel 1: Requests per Second**
```promql
rate(http_server_duration_milliseconds_count[1m])
```

**Panel 2: P95 Latency**
```promql
histogram_quantile(0.95, rate(http_server_duration_milliseconds_bucket[5m]))
```

### Alert Examples
1. **High Error Rate:** HTTP 5xx > 2% for 5 minutes
2. **High Latency:** P95 > 500ms for 3 minutes

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | JWT signing secret |
| NODE_ENV | Environment mode |
| OTEL_EXPORTER_OTLP_ENDPOINT | Telemetry endpoint |
| OTEL_SERVICE_NAME | Service identifier |

### CI/CD Secrets (GitHub)
| Secret | Purpose |
|--------|---------|
| VPN_CONFIG | OpenVPN configuration |
| VPN_PASSWORD | VPN credentials |
| DEPLOY_KEY_PRIVATE | SSH private key |
| REMOTE_SERVER | Server IP address |
| REMOTE_USER | SSH username |
| MONGO_URI | Database connection |
| GITHUB_TOKEN | Container registry auth |

---

## Manual Deployment

If CI/CD fails, deploy manually:

```bash
# 1. Connect to VPN

# 2. SSH to server
ssh username@server-ip

# 3. Navigate to project
cd ~/course-project-tried-asking-gpt

# 4. Pull latest code
git pull origin main

# 5. Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d

# 6. Check status
docker ps
docker logs backend --tail 50
```

---

## Useful Commands

```bash
# View running containers
docker ps

# View logs
docker logs <container> --tail 100 -f

# Restart all services
docker compose restart

# Rebuild single service
docker compose build backend --no-cache
docker compose up -d backend

# Check container health
docker inspect --format='{{.State.Health.Status}}' <container>

# Access container shell
docker exec -it <container> sh
```

---

## Security Measures

1. **Secrets Management:** GitHub Secrets for sensitive data
2. **VPN Required:** Deployment only via school VPN
3. **SSH Keys:** No password authentication
4. **Private Registry:** GHCR with authentication
5. **JWT Auth:** Secure API endpoints
6. **HTTPS:** Nginx handles SSL (if configured)

---

## Troubleshooting

### Build Fails
- Check GitHub Actions logs
- Verify Dockerfile syntax
- Check npm dependencies

### Deploy Fails
- Verify VPN connection
- Check SSH key permissions
- Verify server disk space

### Container Issues
```bash
# Check logs
docker logs <container> --tail 100

# Check resource usage
docker stats

# Restart containers
docker compose restart
```
