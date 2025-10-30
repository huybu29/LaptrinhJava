# ---------- 1️⃣ Dùng base image nhỏ gọn và có sẵn JDK ----------
FROM eclipse-temurin:17-jdk-alpine AS builder

# ---------- 2️⃣ Tạo user non-root để tăng bảo mật ----------
RUN addgroup -S spring && adduser -S spring -G spring

# ---------- 3️⃣ Cài công cụ cần thiết (curl, wget) ----------
RUN apk add --no-cache curl wget

# ---------- 4️⃣ Copy file jar (nên dùng build stage riêng để tận dụng cache) ----------
WORKDIR /app
COPY target/repo-0.0.1-SNAPSHOT.jar app.jar

# ---------- 5️⃣ Cài dockerize để chờ các service phụ thuộc ----------
RUN wget -qO- https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    | tar -xz -C /usr/local/bin

# ---------- 6️⃣ Chạy dưới user non-root ----------
USER spring

# ---------- 7️⃣ Expose port ----------
EXPOSE 8084

# ---------- 8️⃣ CMD: chỉ chạy sau khi các service phụ thuộc đã sẵn sàng ----------
CMD ["sh", "-c", "dockerize \
    -wait tcp://mysql-db:3306 \
    -wait http://config-server:8888/actuator/health \
    -wait http://eureka-server:8761/eureka/apps \
    -timeout 90s \
    java -jar app.jar"]
