FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /workspace

# Copiar pom e .mvn primeiro (cache)
COPY pom.xml .
COPY .mvn .mvn
RUN mvn -B -DskipTests dependency:go-offline

# Copiar o código-fonte real
COPY src src

# Build da aplicação
RUN mvn -B -DskipTests clean package

# Imagem final
FROM eclipse-temurin:21-jre
WORKDIR /app

RUN groupadd -r spring && useradd -r -g spring spring
USER spring

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8081
ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
