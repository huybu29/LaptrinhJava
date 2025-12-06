# --- Stage 1: Build (Dùng Node để build code) ---
FROM node:18-alpine AS build
WORKDIR /app

# 1. Copy package.json và cài đặt dependencies
COPY package.json package-lock.json ./
RUN npm install

# 2. Copy source code
COPY . .

# 3. Build project
# Lưu ý: Vite sẽ tạo ra thư mục 'dist'
RUN npm run build

# --- Stage 2: Serve (Dùng Nginx để chạy web) ---
FROM nginx:alpine

# Xóa cấu hình mặc định của Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy cấu hình Nginx custom của chúng ta vào
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy folder 'dist' từ Stage 1 vào thư mục web của Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 (Cổng mặc định của Nginx)
EXPOSE 80

# Lệnh chạy Nginx
CMD ["nginx", "-g", "daemon off;"]