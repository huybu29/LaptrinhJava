
FROM eclipse-temurin:17-jdk-alpine


RUN apk add --no-cache curl wget && \
    wget -qO- https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    | tar -xz -C /usr/local/bin

WORKDIR /app


COPY target/station-service-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 8088


CMD ["sh", "-c", "dockerize \
    -wait tcp://mysql-db:3306 \
    -wait http://config-server:8888/actuator/health \
    -wait http://eureka-server:8761/eureka/apps \
    -timeout 90s \
    java -jar app.jar"]
