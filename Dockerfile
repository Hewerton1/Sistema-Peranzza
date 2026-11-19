# Compila o projeto Java usando Maven.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /codigo
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -B -q -DskipTests package

# Executa sem Maven, com uma imagem menor do Java.
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /codigo/target/peranzza-cardapio-1.0.0.jar /app/site.jar
EXPOSE 8080
CMD ["java","-jar","/app/site.jar"]
