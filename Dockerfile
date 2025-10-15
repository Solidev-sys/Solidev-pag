# Etapa 1: Build de frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ .
RUN npm run build


# Etapa 2: Setup backend
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY backend/ .


# Etapa 3: Final
FROM node:18-alpine AS final
WORKDIR /app

# Copiar backend completo
COPY --from=backend-build /app/backend ./backend

# Copiar estáticos del frontend al backend
COPY --from=frontend-build /app/frontend/.next/static ./backend/public/_next/static
COPY --from=frontend-build /app/frontend/public ./backend/public

# Copiar docker-compose si lo necesitas
COPY docker-compose.yml ./

# NO copies README.md si no existe

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "/app/backend/controllers/api.js"]
