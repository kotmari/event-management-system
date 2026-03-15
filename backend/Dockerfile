
FROM node:20-alpine AS builder


RUN apk add --no-cache libc6-compat

WORKDIR /app


COPY package*.json ./
COPY prisma ./prisma/


RUN npm install


COPY . .


RUN DATABASE_URL=postgresql://fake:fake@localhost:5432/fake npx prisma generate
RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts


EXPOSE 5001


CMD ["node", "dist/server.js"]