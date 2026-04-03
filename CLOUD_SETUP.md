# 🌩️ TaskPRO - Cloud Infrastructure Setup Guide

## 🎯 Option 2: Cloud Services Setup (Recommended)

We'll use free tiers of cloud services to run your complete microservices application!

---

## 📋 Step-by-Step Cloud Setup

### **Step 1: PostgreSQL Setup (Supabase - Free)**
1. **Go to**: https://supabase.com/
2. **Click**: "Start your project" → "Sign up with GitHub"
3. **Create Organization**: Enter your organization name
4. **Create Project**:
   - Project name: `TaskPRO`
   - Database password: Create a strong password
   - Region: Choose closest to you
5. **Wait for setup** (2-3 minutes)
6. **Get Connection Details**:
   - Go to Settings → Database
   - Copy **Connection string**
   - Note: `postgresql://[user]:[password]@[host]:[port]/postgres`

### **Step 2: Create Two Databases**
```sql
-- In Supabase SQL Editor (Project → SQL Editor)
-- Create Auth Database
CREATE DATABASE auth_db;

-- Create Task Database  
CREATE DATABASE task_db;

-- Create Users Table in auth_db
CREATE TABLE auth_db.public.users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Tasks Table in task_db
CREATE TABLE task_db.public.tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(10) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'TODO',
    due_date DATE,
    assigned_to VARCHAR(100),
    created_by VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

### **Step 3: MongoDB Setup (MongoDB Atlas - Free)**
1. **Go to**: https://www.mongodb.com/atlas/database
2. **Click**: "Try Free" → "Sign up"
3. **Create Cluster**:
   - Cloud Provider: AWS
   - Region: Choose closest to you
   - Cluster Tier: M0 Sandbox (Free)
4. **Create Database User**:
   - Username: `taskpro_user`
   - Password: Create strong password
5. **Whitelist IP**: Click "Add My Current IP Address"
6. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

### **Step 4: Create MongoDB Collection**
```javascript
// In MongoDB Atlas (Collections tab)
// Database: notification_db
// Collection: notifications

// Or create via MongoDB Compass or Shell:
use notification_db
db.createCollection("notifications")
```

---

### **Step 5: Redis Setup (Redis Cloud - Free)**
1. **Go to**: https://redis.com/try-free/
2. **Click**: "Try Free" → "Sign up"
3. **Create Database**:
   - Subscription: Free
   - Cloud Provider: AWS
   - Region: Choose closest
   - Database name: `taskpro-redis`
4. **Get Connection Details**:
   - Go to your database
   - Copy **Public Endpoint** and **Password**

---

### **Step 6: Kafka Setup (Confluent Cloud - Free)**
1. **Go to**: https://www.confluent.cloud/
2. **Click**: "Try Free" → "Sign up"
3. **Create Cluster**:
   - Cluster type: Basic
   - Cloud provider: AWS
   - Region: Choose closest
4. **Create Topic**:
   - Topic name: `task-events`
   - Partitions: 3
5. **Create API Key**:
   - Go to "API Keys" → "Create key"
   - Select "Cloud" cluster
   - Save the API key and secret
6. **Get Bootstrap Server**: From cluster details

---

## ⚙️ Update Your Environment Configuration

Create `.env` file in your project root with cloud details:

```env
# PostgreSQL (Supabase)
POSTGRES_AUTH_HOST=your-host.supabase.co
POSTGRES_AUTH_PORT=5432
POSTGRES_AUTH_DB=auth_db
POSTGRES_AUTH_USER=postgres
POSTGRES_AUTH_PASSWORD=your-supabase-password

POSTGRES_TASK_HOST=your-host.supabase.co
POSTGRES_TASK_PORT=5432
POSTGRES_TASK_DB=task_db
POSTGRES_TASK_USER=postgres
POSTGRES_TASK_PASSWORD=your-supabase-password

# MongoDB Atlas
MONGODB_HOST=your-cluster.mongodb.net
MONGODB_PORT=27017
MONGODB_DB=notification_db
MONGODB_USER=taskpro_user
MONGODB_PASSWORD=your-mongodb-password

# Redis Cloud
REDIS_HOST=your-redis-cloud-endpoint
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password

# Kafka (Confluent Cloud)
KAFKA_BOOTSTRAP_SERVERS=your-bootstrap-server:9092
KAFKA_SECURITY_PROTOCOL=SASL_SSL
KAFKA_SASL_MECHANISM=PLAIN
KAFKA_SASL_JAAS_CONFIG=org.apache.kafka.common.security.plain.PlainLoginModule required username='your-api-key' password='your-api-secret';

# Service Ports
EUREKA_PORT=8761
AUTH_SERVICE_PORT=8081
TASK_SERVICE_PORT=8082
NOTIFICATION_SERVICE_PORT=8083
API_GATEWAY_PORT=8080
```

---

## 🚀 Start Your Complete Application

### **Step 7: Update Application Properties**

Your services need to be configured to use cloud services. The `.env` file above will work, but you may need to update the `application.yml` files in each service to read from environment variables.

### **Step 8: Start All Services**

```bash
# Terminal 1: Eureka Server (already running)
java -jar backend/eureka-server/target/eureka-server-1.0.0-SNAPSHOT.jar

# Terminal 2: Auth Service
java -jar backend/auth-service/target/auth-service-1.0.0-SNAPSHOT.jar

# Terminal 3: Task Service  
java -jar backend/task-service/target/task-service-1.0.0-SNAPSHOT.jar

# Terminal 4: Notification Service
java -jar backend/notification-service/target/notification-service-1.0.0-SNAPSHOT.jar

# Terminal 5: API Gateway (already running)
java -jar backend/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar

# Terminal 6: Frontend (already running)
cd frontend/taskflow-frontend
npm run dev
```

---

## ✅ Verification

Once all services are running:

1. **Eureka Dashboard**: http://localhost:8761 (should show all 5 services)
2. **Frontend App**: http://localhost:5173 (should work without errors)
3. **Test Registration**: Create a user in the frontend
4. **Test Task Creation**: Create and manage tasks

---

## 🔧 Troubleshooting Cloud Services

### **Connection Issues**
- Double-check connection strings
- Verify IP whitelisting (MongoDB)
- Check firewall settings

### **Service Won't Start**
- Check service logs for database connection errors
- Verify environment variables are loaded correctly
- Ensure all cloud services are active

### **Common Fixes**
```bash
# Clear Maven cache if needed
.\apache-maven-3.9.6\bin\mvn.cmd clean

# Rebuild services
.\apache-maven-3.9.6\bin\mvn.cmd clean package -DskipTests

# Restart services in correct order
```

---

## 💰 Cost Summary

All services use **FREE tiers**:
- **Supabase PostgreSQL**: Free tier (500MB)
- **MongoDB Atlas**: M0 Sandbox (512MB)
- **Redis Cloud**: 30MB free tier
- **Confluent Cloud**: Basic cluster (limited messages)

**Total Cost: $0/month!** 🎉

---

## 🎉 Success!

You now have a **production-grade microservices application** running with:
- ✅ Real cloud databases
- ✅ Professional architecture
- ✅ All services communicating
- ✅ Full functionality

This is exactly how real-world applications are built! 🚀
