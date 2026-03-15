# Етап 1: Збірка (Builder)
FROM node:20-alpine AS builder

# Встановлюємо залежності для Prisma (потрібні для генерації клієнта)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копіюємо файли залежностей
COPY package*.json ./
COPY prisma ./prisma/

# Встановлюємо всі залежності (включаючи devDependencies)
RUN npm install

# Копіюємо решту коду
COPY . .

# Генеруємо Prisma Client та компілюємо TypeScript
RUN npx prisma generate
RUN npm run build

# Етап 2: Фінальний образ (Runner)
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Експонуємо порт (який ви використовуєте в app.ts)
EXPOSE 5001

# Команда для запуску (перед запуском бажано виконати prisma migrate deploy)
CMD ["node", "dist/server.js"]