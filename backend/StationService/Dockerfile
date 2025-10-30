# Sử dụng image JDK 17 nhẹ
FROM eclipse-temurin:17-jdk-alpine

# Cài đặt công cụ cần thiết (chỉ 1 layer để cache tốt hơn)
RUN apk add --no-cache curl wget tar

# Thư mục làm việc
WORKDIR /app

# Sao chép file jar vào container
COPY target/station-service-0.0.1-SNAPSHOT.jar app.jar

# Cài dockerize để chờ các service phụ thuộc (MySQL, Config, Eureka)
RUN wget -q https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzf dockerize-alpine-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-alpine-linux-amd64-v0.6.1.tar.gz

# Mở cổng service
EXPOSE 8084

# Lệnh khởi chạy container
ENTRYPOINT ["sh", "-c", "dockerize -wait tcp://mysql-db:3306 -wait http://config-server:8888/actuator/health -wait http://eureka-server:8761/eureka/apps -timeout 120s java -jar /app/app.jar"]
