# 🚀 TaskPRO - Quick Start Guide (No Docker Required)

## Your Situation
- ❌ Docker not available (virtualization disabled by admin)
- ✅ We'll run everything locally using manual installation

## 📋 What You Need to Install

### **Option 1: Package Managers (Easiest)**
```bash
# Windows (using Chocolatey - run as Administrator)
choco install postgresql mongodb redis kafka nodejs java21

# macOS (using Homebrew)
brew install postgresql mongodb redis kafka node java21

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql mongodb-server redis-server kafka-server nodejs openjdk-21-jdk maven
```

### **Option 2: Manual Downloads**
1. **Java 21**: https://adoptium.net/
2. **Node.js 20+**: https://nodejs.org/
3. **PostgreSQL 15**: https://www.postgresql.org/download/windows/
4. **MongoDB**: https://www.mongodb.com/try/download/community
5. **Redis**: https://redis.io/download
6. **Apache Kafka**: https://kafka.apache.org/downloads
7. **Maven**: https://maven.apache.org/download.cgi

---

## 🛠️ Step-by-Step Setup

### **Step 1: Install Java & Node.js**
```bash
# Verify Java 21
java -version

# Verify Node.js 20+
node --version
npm --version

# Install Maven (if not installed)
# Download and add to PATH or use package manager
mvn --version
```

### **Step 2: Setup PostgreSQL (Need 2 instances)**

#### **Install PostgreSQL first, then:**
```bash
# Start PostgreSQL service
# Windows: Services -> PostgreSQL -> Start
# macOS/Linux: brew services start postgresql or sudo systemctl start postgresql

# Create databases and users
psql -U postgres

# Create first database (for Auth Service)
CREATE DATABASE auth_db;
CREATE USER auth_user WITH PASSWORD 'auth_password';
GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;

# Create second database (for Task Service)
CREATE DATABASE task_db;
CREATE USER task_user WITH PASSWORD 'task_password';
GRANT ALL PRIVILEGES ON DATABASE task_db TO task_user;

\q  # Exit psql
```

### **Step 3: Setup MongoDB**
```bash
# Start MongoDB service
# Windows: Services -> MongoDB -> Start
# macOS/Linux: brew services start mongodb-community or sudo systemctl start mongod

# Create database and collection
mongosh
use notification_db
db.createCollection("notifications")
exit
```

### **Step 4: Setup Redis**
```bash
# Start Redis server
redis-server

# Test connection (in new terminal)
redis-cli ping
# Should return: PONG
```

### **Step 5: Setup Kafka**
```bash
# Navigate to Kafka installation directory
cd /path/to/kafka

# Start Zookeeper (required for Kafka)
bin/windows/zookeeper-server-start.bat config/zookeeper.properties

# Start Kafka (in new terminal)
bin/windows/kafka-server-start.bat config/server.properties

# Create required topic (in new terminal)
bin/windows/kafka-topics.bat --create --topic task-events --bootstrap-server localhost:9092
```

---

## 🏃‍♂️ Run Your Application

### **Step 6: Build Backend Services**
```bash
# Navigate to your project
cd TaskPRO/backend

# Build all services
mvn clean package -DskipTests
```

### **Step 7: Start All Services**

Open **5 separate terminals** and run these commands:

#### **Terminal 1: Eureka Server**
```bash
cd TaskPRO/backend
java -jar eureka-server/target/eureka-server-1.0.0-SNAPSHOT.jar
```

#### **Terminal 2: Auth Service**
```bash
cd TaskPRO/backend
java -jar auth-service/target/auth-service-1.0.0-SNAPSHOT.jar
```

#### **Terminal 3: Task Service**
```bash
cd TaskPRO/backend
java -jar task-service/target/task-service-1.0.0-SNAPSHOT.jar
```

#### **Terminal 4: Notification Service**
```bash
cd TaskPRO/backend
java -jar notification-service/target/notification-service-1.0.0-SNAPSHOT.jar
```

#### **Terminal 5: API Gateway**
```bash
cd TaskPRO/backend
java -jar api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar
```

### **Step 8: Start Frontend**
```bash
# In new terminal
cd TaskPRO/frontend/taskflow-frontend
npm install
npm run dev
```

---

## ✅ Verify Everything Works

### **Check Services**
```bash
# Eureka Dashboard (should show registered services)
http://localhost:8761

# Frontend Application
http://localhost:5173

# API Gateway Health
http://localhost:8080/actuator/health
```

### **Test API Endpoints**
```bash
# Test Auth Service
curl http://localhost:8081/actuator/health

# Test Task Service
curl http://localhost:8082/actuator/health

# Test Notification Service
curl http://localhost:8083/actuator/health
```

---

## 🔧 Common Issues & Solutions

### **PostgreSQL Connection Issues**
```bash
# Can't connect? Check if service is running:
# Windows: Check Services app
# Linux: sudo systemctl status postgresql
# macOS: brew services list

# Reset PostgreSQL password (Windows)
psql -U postgres
ALTER USER postgres PASSWORD 'newpassword';
```

### **Port Already in Use**
```bash
# Windows: Check what's using port
netstat -ano | findstr :5432

# Kill process if needed
taskkill /PID <PID_NUMBER> /F
```

### **Java Version Issues**
```bash
# Check Java version
java -version

# Should show Java 21. If not:
# 1. Install Java 21
# 2. Set JAVA_HOME environment variable
# 3. Update PATH to point to Java 21
```

### **Maven Build Issues**
```bash
# Clean build
mvn clean
mvn package -DskipTests

# If still failing, check Java version and Maven version
java -version
mvn -version
```

---

## 🎯 Success Checklist

- [ ] Java 21 installed and working
- [ ] Node.js 20+ installed and working
- [ ] PostgreSQL running with 2 databases created
- [ ] MongoDB running with notification_db created
- [ ] Redis server running and responding
- [ ] Kafka running with task-events topic created
- [ ] All 5 microservices started successfully
- [ ] Eureka dashboard shows all services registered
- [ ] Frontend loads at http://localhost:5173

---

## 🚨 If Something Goes Wrong

1. **Check logs** - Each service shows startup logs in its terminal
2. **Verify ports** - Make sure no port conflicts (5432, 5433, 27017, 6379, 9092, 8761, 8080-8083, 5173)
3. **Service dependencies** - Start services in the exact order shown
4. **Environment variables** - Make sure JAVA_HOME and PATH are set correctly

---

## 🎉 You're Done!

Once all services are running:
1. Open http://localhost:5173 for the frontend
2. Register a new user
3. Login and start creating tasks!
4. Check http://localhost:8761 to see services in Eureka

**You now have a fully functional microservices application running without Docker!** 🚀
