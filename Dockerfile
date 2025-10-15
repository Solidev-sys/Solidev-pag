# Etapa 1: Build de frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ .
RUN npm run build


# Etapa 2: Backend
FROM node:18-alpine as final
WORKDIR /app

# Copiar TODO el repositorio EXCEPTO lo que está en .dockerignore
COPY . .

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm ci --prefer-offline --no-audit

# Copiar archivos estáticos del frontend build
COPY --from=frontend-build /app/frontend/.next/static ./public/_next/static
COPY --from=frontend-build /app/frontend/public ./public

# Volver a la raíz
WORKDIR /app

# Crear usuario sin privilegios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "/app/backend/controllers/api.js"]
