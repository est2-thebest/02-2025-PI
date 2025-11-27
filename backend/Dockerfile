FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copy pom first for better caching
COPY pom.xml .
COPY .mvn .mvn
RUN mvn -B -DskipTests dependency:go-offline

# Copy source and build
COPY src src
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app

# Create a non-root user for security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring

COPY --from=build /workspace/target/*.jar /app/app.jar
EXPOSE 8080
ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]