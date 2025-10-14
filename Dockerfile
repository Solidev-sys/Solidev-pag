# Etapa 1: Build de frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ .
RUN npm run build

# Etapa 2: Backend con dependencias y frontend estático
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY backend/ .

# Copia los estáticos generados (Next.js) al backend
COPY --from=frontend-build /app/frontend/.next/static ./public/
COPY --from=frontend-build /app/frontend/public ./public
COPY --from=frontend-build /app/frontend/out ./public

# Crear usuario sin privilegios root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "controllers/api.js"]
