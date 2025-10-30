# Dùng image chính thức, nhẹ (~220MB)
FROM eclipse-temurin:17-jdk-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép file JAR (đặt tên cố định để dễ reuse cache)
COPY target/eureka-server-1.0.0.jar app.jar

# Mở port Eureka
EXPOSE 8761

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
