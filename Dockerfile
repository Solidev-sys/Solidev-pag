# Etapa 1: Build de frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ .
RUN npm run build


# Etapa 2: Backend con dependencias y frontend estático
FROM node:18-alpine as backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY backend/ .


# Copia los archivos estáticos generados por Next.js
COPY --from=frontend-build /app/frontend/.next/static ./public/_next/static
COPY --from=frontend-build /app/frontend/public ./public


# Crear usuario sin privilegios root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app/backend
USER appuser


ENV NODE_ENV=production
ENV PORT=3000


EXPOSE 3000


CMD ["node", "controllers/api.js"]
