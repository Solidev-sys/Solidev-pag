# Etapa 1: Build de frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
# Copiar TODO el repositorio primero
COPY . .
# Ahora trabajar con frontend
WORKDIR /app/frontend
RUN npm ci --prefer-offline --no-audit
RUN npm run build


# Etapa 2: Backend con TODO el repositorio
FROM node:18-alpine as final
WORKDIR /app
# Copiar TODO el repositorio completo
COPY . .

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm ci --prefer-offline --no-audit

# Copiar archivos estáticos del frontend build
COPY --from=frontend-build /app/frontend/.next/static /app/backend/public/_next/static
COPY --from=frontend-build /app/frontend/public /app/backend/public

# Volver a la raíz donde está toda la estructura
WORKDIR /app

# Crear usuario sin privilegios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Ejecutar desde la ruta completa
CMD ["node", "/app/backend/controllers/api.js"]

