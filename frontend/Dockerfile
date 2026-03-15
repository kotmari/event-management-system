# Етап 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Копіюємо package.json та package-lock.json для встановлення залежностей
COPY package*.json ./
RUN npm install

# Копіюємо весь код проекту та збираємо його
COPY . .
RUN npm run build

# Етап 2: Роздача файлів (Production)
FROM nginx:alpine

# Копіюємо зібрані файли з першого етапу в директорію Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Якщо у вас React Router (SPA), нам потрібен конфіг для Nginx, 
# щоб перенаправляти всі запити на index.html.
# Створіть файл nginx.conf у корені проекту, якщо потрібно.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]