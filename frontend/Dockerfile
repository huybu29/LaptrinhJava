# ---------- 1️⃣ Stage build ----------
FROM node:22-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file khai báo dependencies trước (để tận dụng cache)
COPY package*.json ./

# Cài dependencies (dùng --frozen-lockfile nếu có package-lock.json)
RUN npm ci --legacy-peer-deps

# Sao chép toàn bộ source code
COPY . .

# Build production
RUN npm run build

# ---------- 2️⃣ Stage chạy Nginx ----------
FROM nginx:alpine

# Xóa file mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy file build từ stage trước sang
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Chạy Nginx ở foreground
CMD ["nginx", "-g", "daemon off;"]
