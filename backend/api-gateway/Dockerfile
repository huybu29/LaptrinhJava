# Dùng base image nhẹ và có cache tốt
FROM eclipse-temurin:17-jdk-alpine AS builder

# Cài dockerize (dành cho Alpine)
RUN apk add --no-cache wget tar

WORKDIR /app

# Copy file jar vào container (tận dụng cache nếu không thay đổi)
COPY target/repo-0.0.1-SNAPSHOT.jar app.jar

# Cài dockerize (để chờ các service phụ thuộc)
RUN wget -q https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

EXPOSE 8067

# Dùng ENTRYPOINT để khởi chạy lệnh chính (an toàn hơn CMD)
ENTRYPOINT ["sh", "-c", "dockerize -wait tcp://mysql-db:3306 -wait http://config-server:8888/actuator/health -wait http://eureka-server:8761/eureka/apps -timeout 120s java -jar app.jar"]
