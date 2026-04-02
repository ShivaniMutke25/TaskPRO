# TaskFlow Pro 🚀

> A **production-style microservices task management system** built to demonstrate modern backend engineering practices — perfect for learning, portfolio showcasing, and job interviews.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square)
![Kafka](https://img.shields.io/badge/Kafka-Event%20Driven-black?style=flat-square)
![Redis](https://img.shields.io/badge/Redis-Caching-red?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square)

---

## 🎯 Project Purpose

This is **NOT** a business product. It is an **engineering learning project** designed to:

1. Practice **modern microservices architecture**
2. Demonstrate **production-ready engineering tools**
3. Provide strong **interview talking points**
4. Show real-world patterns: caching, events, resilience, observability

> Business logic is **intentionally simple**. Engineering depth is **intentionally high**.

---

## 🏗️ Architecture Overview

```
                          ┌─────────────────────────────┐
                          │         React Frontend        │
                          │  (Vite + TypeScript + TailwindCSS) │
                          └──────────────┬──────────────┘
                                         │ HTTP
                          ┌──────────────▼──────────────┐
                          │         API Gateway           │
                          │   (Spring Cloud Gateway)      │
                          │   JWT Validation Filter       │
                          └──┬─────────┬──────────┬─────┘
                             │         │          │
              ┌──────────────▼─┐  ┌────▼──────┐  └──┐
              │  Auth Service  │  │Task Service│     │
              │  PostgreSQL    │  │PostgreSQL  │     │
              │  JWT + BCrypt  │  │Redis Cache │     │
              └────────────────┘  │Kafka Produce│    │
                                  │Resilience4j│    │
                                  └─────┬──────┘    │
                                        │ Kafka      │
                                  ┌─────▼──────────┐ │
                                  │Notification Svc│ │
                                  │   MongoDB      │ │
                                  │ Kafka Consumer │ │
                                  └────────────────┘ │
                                                      │
                          ┌───────────────────────────▼───┐
                          │          Eureka Server         │
                          │       Service Discovery        │
                          └───────────────────────────────┘
```

---

## 📦 Project Structure

```
taskflow-pro/
├── backend/
│   ├── pom.xml                        # Parent Maven POM
│   ├── eureka-server/                 # Service discovery
│   ├── api-gateway/                   # Central entry point + JWT filter
│   ├── auth-service/                  # Register, Login, JWT, BCrypt
│   ├── task-service/                  # CRUD, Redis cache, Kafka producer
│   └── notification-service/          # Kafka consumer, MongoDB
├── frontend/
│   └── taskflow-frontend/             # React 18 + TypeScript + Tailwind
├── docker/
│   └── prometheus/
│       └── prometheus.yml
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI/CD
├── docker-compose.yml                 # Full local stack
└── README.md
```

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.x |
| Service Mesh | Spring Cloud (Gateway, Eureka, OpenFeign) |
| Auth | Spring Security + JWT + BCrypt |
| Message Broker | Apache Kafka |
| Cache | Redis |
| Resilience | Resilience4j (Circuit Breaker, Retry, Timeout) |
| Databases | PostgreSQL (Auth + Task), MongoDB (Notifications) |
| Observability | Actuator + Micrometer + Prometheus + Grafana |
| Testing | JUnit 5 + Mockito + Testcontainers |
| API Docs | SpringDoc OpenAPI (Swagger UI) |
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| HTTP Client | Axios + TanStack Query |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |

---

## 🚀 Quick Start (Local — Docker Compose)

### Prerequisites
- Docker Desktop installed and running
- Java 21 (to build backend services)
- Node.js 20+ (to build frontend)

### Step 1: Build all backend services

```bash
cd taskflow-pro/backend
mvn clean package -DskipTests
```

### Step 2: Build frontend

```bash
cd taskflow-pro/frontend/taskflow-frontend
npm install
npm run build
```

### Step 3: Start everything with Docker Compose

```bash
cd taskflow-pro
docker-compose up --build
```

### Step 4: Access services

| Service | URL |
|---|---|
| **Frontend** | http://localhost:5173 |
| **API Gateway** | http://localhost:8080 |
| **Eureka Dashboard** | http://localhost:8761 |
| **Auth Swagger** | http://localhost:8081/swagger-ui.html |
| **Task Swagger** | http://localhost:8082/swagger-ui.html |
| **Notification Swagger** | http://localhost:8083/swagger-ui.html |
| **Prometheus** | http://localhost:9090 |
| **Grafana** | http://localhost:3000 |

---

## 🔐 API Usage Examples

### Register a User
```bash
POST http://localhost:8080/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

### Login
```bash
POST http://localhost:8080/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "<JWT_TOKEN>",
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com", "role": "USER" }
}
```

### Create a Task (authenticated)
```bash
POST http://localhost:8080/tasks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "title": "Implement login page",
  "description": "Build the frontend login page with form validation",
  "priority": "HIGH",
  "dueDate": "2024-12-31",
  "assignedTo": "jane@example.com"
}
```

### List Tasks with Filtering + Pagination
```bash
GET http://localhost:8080/tasks?status=IN_PROGRESS&page=0&size=10
Authorization: Bearer <JWT_TOKEN>
```

### Update Task Status
```bash
PATCH http://localhost:8080/tasks/1/status
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{ "status": "DONE" }
```

### Get Notifications
```bash
GET http://localhost:8080/notifications/user/john@example.com
Authorization: Bearer <JWT_TOKEN>
```

---

## 📨 Kafka Event Design

| Event | Trigger | Topic |
|---|---|---|
| `TASK_CREATED` | Task is created | `task-events` |
| `TASK_ASSIGNED` | Task assigned to user | `task-events` |
| `TASK_COMPLETED` | Task status set to DONE | `task-events` |

### Event Payload Structure
```json
{
  "eventType": "TASK_ASSIGNED",
  "taskId": 42,
  "title": "Implement login page",
  "assignedTo": "jane@example.com",
  "createdBy": "john@example.com",
  "timestamp": "2024-09-15T10:30:00"
}
```

---

## ⚡ Redis Caching Strategy

| Cache Key | Triggered By | Evicted On |
|---|---|---|
| `tasks` | GET /tasks | POST, PUT, PATCH, DELETE /tasks |
| `task::{id}` | GET /tasks/{id} | PUT, PATCH /tasks/{id}, DELETE |

Cache TTL: **10 minutes**

---

## 🛡️ Resilience4j (Task Service → Auth Service)

| Pattern | Configuration |
|---|---|
| Circuit Breaker | Opens after 50% failures over sliding window of 5 calls |
| Retry | Max 3 attempts, 1s wait between retries |
| Timeout | 2 seconds per Auth Service call |

---

## 🔑 Role-Based Authorization

| Role | Permissions |
|---|---|
| `USER` | Create, view, and update own tasks |
| `ADMIN` | Assign tasks to any user, view all tasks |

JWT payload includes the `role` claim which is validated by the API Gateway filter and used by the frontend for conditional rendering.

---

## 📊 Observability

Each Spring Boot service exposes:
- `/actuator/health` — Health check
- `/actuator/prometheus` — Prometheus metrics

Grafana connects to Prometheus at `http://prometheus:9090`.

**JVM metrics tracked:** `jvm_memory_used_bytes`, `jvm_gc_pause_seconds`, `http_server_requests_seconds`

---

## 🧪 Testing

### Run unit tests
```bash
cd backend/auth-service
mvn test
```

### Run integration tests (requires Docker for Testcontainers)
```bash
mvn test -Dtest=AuthServiceIntegrationTest
```

Testcontainers automatically spins up:
- PostgreSQL 15 for Auth & Task integration tests
- Kafka (embedded) for Task Service event tests
- MongoDB for Notification Service tests

---

## 🔄 CI/CD Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR to `main`:

**Backend:**
1. Start PostgreSQL, Redis, MongoDB as service containers
2. Build all Maven modules
3. Run unit + integration tests

**Frontend:**
1. Install npm dependencies
2. Build production bundle (`npm run build`)

---

## 🏭 Key Engineering Concepts (Interview-Ready)

| Concept | Where Used | Key Talking Point |
|---|---|---|
| **Service Discovery** | Eureka Server | All services register; Gateway routes to `lb://service-name` |
| **JWT Auth** | Auth Service + Gateway | Token issued on login, validated at Gateway filter level |
| **RBAC** | Security config | `ROLE_ADMIN` vs `ROLE_USER` via Spring `@PreAuthorize` |
| **Event Streaming** | Kafka | Task Service produces; Notification Service consumes asynchronously |
| **Caching** | Redis in Task Service | `@Cacheable`, `@CacheEvict` with JSON serialization and 10min TTL |
| **Circuit Breaker** | Resilience4j | Protects Task Service from Auth Service failures with fallback |
| **API Gateway** | Spring Cloud Gateway | Single entry, JWT filter, load-balanced routing |
| **Testcontainers** | Integration tests | Real DB/Kafka in tests, no mocking infra |
| **Observability** | Prometheus + Grafana | Micrometer instruments JVM + HTTP metrics |
| **Dockerized** | Docker Compose | Full stack: 14 containers, one command |

---

## 📝 License

MIT License. Free to use for learning and portfolio purposes.

---

> Built as a **learning-focused production architecture showcase**. Simple business logic. Strong engineering foundation.
