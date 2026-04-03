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

## 🚀 Quick Start

### Prerequisites
- **Java 21** (JDK) - for running backend services
- **Node.js 20+** - for frontend development
- **Maven 3.6+** - for building backend services
- **Optional**: Docker Desktop (for containerized deployment)

### Option 1: Manual Startup (Recommended for Development)

#### Step 1: Setup Infrastructure Services
You need to manually install and start:
- **PostgreSQL** (2 instances: auth_db, task_db)
- **MongoDB** (for notifications)
- **Redis** (for caching)
- **Apache Kafka** (for event streaming)

#### Step 2: Build Backend Services
```bash
cd taskflow-pro/backend
mvn clean package -DskipTests
```

#### Step 3: Start Services in Order
```bash
# 1. Start Eureka Server (Service Discovery)
java -jar eureka-server/target/eureka-server-1.0.0-SNAPSHOT.jar

# 2. Start Auth Service (Port 8081)
java -jar auth-service/target/auth-service-1.0.0-SNAPSHOT.jar

# 3. Start Task Service (Port 8082)
java -jar task-service/target/task-service-1.0.0-SNAPSHOT.jar

# 4. Start Notification Service (Port 8083)
java -jar notification-service/target/notification-service-1.0.0-SNAPSHOT.jar

# 5. Start API Gateway (Port 8080)
java -jar api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar
```

#### Step 4: Start Frontend
```bash
cd taskflow-pro/frontend/taskflow-frontend
npm install
npm run dev
```

### Option 2: Docker Compose (Requires Virtualization)
```bash
cd taskflow-pro
docker-compose up --build
```

### Step 5: Access Services

| Service | URL | Description |
|---|---|---|
| **Frontend** | http://localhost:5173 | React web application |
| **API Gateway** | http://localhost:8080 | Main API entry point |
| **Eureka Dashboard** | http://localhost:8761 | Service discovery UI |
| **Auth Service** | http://localhost:8081 | User authentication |
| **Task Service** | http://localhost:8082 | Task management |
| **Notification Service** | http://localhost:8083 | Notification system |
| **Auth Swagger** | http://localhost:8081/swagger-ui.html | Auth API docs |
| **Task Swagger** | http://localhost:8082/swagger-ui.html | Task API docs |
| **Notification Swagger** | http://localhost:8083/swagger-ui.html | Notification API docs |

---

## 📋 Detailed Service Breakdown

### 🔐 Auth Service (Port 8081)
**Responsibility**: User authentication and authorization
- **Database**: PostgreSQL (auth_db)
- **Features**:
  - User registration/login
  - JWT token generation
  - Password encryption with BCrypt
  - Role-based access control (USER/ADMIN)
- **Key Endpoints**:
  - `POST /auth/register` - Register new user
  - `POST /auth/login` - User login
  - `GET /auth/profile` - Get user profile
- **Security**: Spring Security + JWT

### 📋 Task Service (Port 8082)
**Responsibility**: Task management and business logic
- **Database**: PostgreSQL (task_db)
- **Cache**: Redis (10-minute TTL)
- **Message Broker**: Kafka (event producer)
- **Features**:
  - CRUD operations for tasks
  - Redis caching for performance
  - Kafka event publishing
  - Resilience4j circuit breaker
  - Task assignment and status tracking
- **Key Endpoints**:
  - `GET /tasks` - List tasks with pagination
  - `POST /tasks` - Create new task
  - `PATCH /tasks/{id}/status` - Update task status
- **Events**: Publishes TASK_CREATED, TASK_ASSIGNED, TASK_COMPLETED

### 🔔 Notification Service (Port 8083)
**Responsibility**: Real-time notifications
- **Database**: MongoDB
- **Message Broker**: Kafka (event consumer)
- **Features**:
  - Kafka event consumption
  - MongoDB document storage
  - Real-time notification delivery
- **Events**: Consumes task events from Kafka
- **Storage**: Document-based notifications in MongoDB

### 🚪 API Gateway (Port 8080)
**Responsibility**: Single entry point and request routing
- **Features**:
  - Request routing to microservices
  - JWT token validation filter
  - Load balancing with Eureka
  - Cross-origin resource sharing (CORS)
- **Routes**:
  - `/auth/**` → Auth Service
  - `/tasks/**` → Task Service
  - `/notifications/**` → Notification Service

### 🔍 Eureka Server (Port 8761)
**Responsibility**: Service discovery and registration
- **Features**:
  - Service registration
  - Health monitoring
  - Load balancing support
  - Dashboard UI for service status

### 🎨 Frontend (Port 5173)
**Technology**: React 18 + TypeScript + Vite + TailwindCSS
- **Features**:
  - Modern responsive UI
  - JWT token management
  - Real-time updates
  - Task management interface
  - Role-based UI rendering
- **HTTP Client**: Axios with TanStack Query for caching

---

## 🔄 Data Flow Architecture

### User Registration Flow
1. Frontend sends registration request to API Gateway
2. Gateway routes to Auth Service
3. Auth Service validates data, encrypts password, stores in PostgreSQL
4. Auth Service returns JWT token
5. Frontend stores token for subsequent requests

### Task Creation Flow
1. Frontend sends task creation request with JWT token
2. Gateway validates JWT and routes to Task Service
3. Task Service stores task in PostgreSQL and caches in Redis
4. Task Service publishes TASK_CREATED event to Kafka
5. Notification Service consumes event and creates notification
6. Frontend receives real-time update (if connected)

### Authentication Flow
1. All requests go through API Gateway
2. Gateway validates JWT token in request header
3. Invalid tokens are rejected with 401 status
4. Valid requests are routed to appropriate service
5. Services can validate token internally if needed

---

## ⚙️ Configuration Details

### Database Schemas
**Auth Service (PostgreSQL)**:
```sql
users (id, name, email, password, role, created_at, updated_at)
```

**Task Service (PostgreSQL)**:
```sql
tasks (id, title, description, priority, status, due_date, assigned_to, created_by, created_at, updated_at)
```

**Notification Service (MongoDB)**:
```json
{
  "_id": ObjectId,
  "userId": String,
  "message": String,
  "taskId": String,
  "eventType": String,
  "timestamp": Date,
  "read": Boolean
}
```

### Kafka Topics
- **task-events**: Task lifecycle events
- **Event Types**: TASK_CREATED, TASK_ASSIGNED, TASK_COMPLETED

### Redis Cache Keys
- `tasks` - List of all tasks
- `task::{id}` - Individual task details
- **TTL**: 10 minutes

---

## 🛠 Development Setup

### Environment Variables
Create `.env` file in project root:
```env
# Database Configuration
POSTGRES_AUTH_HOST=localhost
POSTGRES_AUTH_PORT=5432
POSTGRES_AUTH_DB=auth_db
POSTGRES_AUTH_USER=auth_user
POSTGRES_AUTH_PASSWORD=auth_password

POSTGRES_TASK_HOST=localhost
POSTGRES_TASK_PORT=5433
POSTGRES_TASK_DB=task_db
POSTGRES_TASK_USER=task_user
POSTGRES_TASK_PASSWORD=task_password

MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DB=notification_db

REDIS_HOST=localhost
REDIS_PORT=6379

KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Service Ports
EUREKA_PORT=8761
AUTH_SERVICE_PORT=8081
TASK_SERVICE_PORT=8082
NOTIFICATION_SERVICE_PORT=8083
API_GATEWAY_PORT=8080
```

### Running Tests
```bash
# Unit tests for all services
cd backend
mvn test

# Integration tests (requires Testcontainers)
mvn test -Dtest=*IntegrationTest

# Frontend tests
cd frontend/taskflow-frontend
npm test
```

---

## � Swagger API Documentation

All microservices include **SpringDoc OpenAPI 3.0** with interactive Swagger UI for API exploration and testing.

### Accessing Swagger UI

Once services are running, access the API documentation at:

| Service | Swagger UI URL | Direct API Docs |
|---|---|---|
| **Auth Service** | http://localhost:8081/swagger-ui.html | http://localhost:8081/v3/api-docs |
| **Task Service** | http://localhost:8082/swagger-ui.html | http://localhost:8082/v3/api-docs |
| **Notification Service** | http://localhost:8083/swagger-ui.html | http://localhost:8083/v3/api-docs |
| **API Gateway** | http://localhost:8080/swagger-ui.html | http://localhost:8080/v3/api-docs |

### Using Swagger UI

1. **Interactive Testing**: Try API endpoints directly from your browser
2. **Authentication**: Use the "Authorize" button to add JWT tokens
3. **Request/Response Examples**: View expected request formats and responses
4. **Schema Documentation**: Understand data models and validation rules

### Key API Endpoints by Service

#### 🔐 Auth Service (Port 8081)
```yaml
# Authentication Endpoints
POST /auth/register          # Register new user
POST /auth/login             # User login (returns JWT)
GET /auth/profile           # Get current user profile
GET /auth/validate          # Validate JWT token

# User Management (Admin only)
GET /auth/users             # List all users
GET /auth/users/{id}        # Get user by ID
DELETE /auth/users/{id}     # Delete user
```

#### 📋 Task Service (Port 8082)
```yaml
# Task CRUD Operations
GET /tasks                  # List tasks with pagination/filtering
POST /tasks                 # Create new task
GET /tasks/{id}            # Get task by ID
PUT /tasks/{id}            # Update task completely
PATCH /tasks/{id}          # Partial task update
DELETE /tasks/{id}         # Delete task

# Task Management
PATCH /tasks/{id}/status   # Update task status
PATCH /tasks/{id}/assign   # Assign task to user
GET /tasks/search          # Search tasks

# Statistics
GET /tasks/stats           # Task statistics by status
GET /tasks/stats/priority  # Task statistics by priority
```

#### 🔔 Notification Service (Port 8083)
```yaml
# Notification Management
GET /notifications/user/{userId}    # Get user notifications
GET /notifications/{id}             # Get notification by ID
PATCH /notifications/{id}/read     # Mark notification as read
DELETE /notifications/{id}          # Delete notification

# Notification Stats
GET /notifications/stats/{userId}   # User notification statistics
GET /notifications/stats           # Global notification statistics
```

#### 🚪 API Gateway (Port 8080)
```yaml
# Routes to all services
# All requests are proxied to appropriate microservice
# JWT validation is performed at gateway level

# Health Check
GET /actuator/health          # Gateway health status
GET /actuator/health/**      # Service-specific health checks
```

### Authentication in Swagger

1. **Get JWT Token**: Use `/auth/login` endpoint
2. **Authorize**: Click "Authorize" button in Swagger UI
3. **Add Token**: Enter `Bearer <your-jwt-token>`
4. **Test Authenticated Endpoints**: All protected endpoints will now work

### Example API Usage in Swagger

#### 1. Register a User
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "role": "USER"
}
```

#### 2. Login and Get Token
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
// Response: {"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

#### 3. Create Task (with JWT)
```json
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
{
  "title": "Implement login page",
  "description": "Build the frontend login page with form validation",
  "priority": "HIGH",
  "dueDate": "2024-12-31",
  "assignedTo": "jane@example.com"
}
```

### Advanced Swagger Features

#### 📥 Import API Collection
- Export OpenAPI spec: `GET /v3/api-docs`
- Import to Postman, Insomnia, or other API clients
- Use for automated testing

#### 🔍 API Exploration
- **Try it out**: Test endpoints with different parameters
- **Model Schemas**: View data structures and validation
- **Response Examples**: See expected response formats
- **Error Codes**: Understand HTTP status codes and error messages

#### 📊 Monitoring Integration
- **Actuator Endpoints**: Health checks and metrics
- **Prometheus Metrics**: `GET /actuator/prometheus`
- **Service Health**: `GET /actuator/health`

---

## �🔐 API Usage Examples

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
