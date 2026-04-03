FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY ../pom.xml ../pom.xml
# Simple maven build just for the service (we assume running from aggregator)
# actually safer to just build from pre-compiled jar
# We'll use a standard layered approach, assuming jar is built by CI or local first
ARG JAR_FILE=target/*.jar
COPY target/eureka-server-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
