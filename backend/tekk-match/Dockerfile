# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app

# Copy only pom.xml first to leverage Docker cache for dependencies
COPY pom.xml .

# Copy the source code
COPY src ./src

# Build the project
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/tekk-match-0.0.1-SNAPSHOT.jar ./tekk-match.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the JAR
CMD ["java", "-jar", "tekk-match.jar"]
