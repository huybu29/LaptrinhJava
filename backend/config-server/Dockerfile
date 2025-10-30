# Sử dụng image JDK 17 nhẹ
FROM eclipse-temurin:17-jdk-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file JAR vào container
COPY target/repo-0.0.1-SNAPSHOT.jar app.jar

# Mở cổng service
EXPOSE 8889

# Dùng ENTRYPOINT để chạy ứng dụng
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
