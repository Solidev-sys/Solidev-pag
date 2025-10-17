# Etapa 1: Final con TODO el repositorio
FROM node:18-alpine AS final
WORKDIR /app

# Instalar bash y git
RUN apk add --no-cache bash git

# Copiar TODO el repositorio
COPY . .

# IMPORTANTE: Instalar dependencias en el ORDEN correcto

# 1. Primero instalar el frontend (para que exista 'next')
WORKDIR /app/frontend
RUN npm ci --prefer-offline --no-audit

# 2. Luego instalar el backend (SIN ejecutar postinstall)
WORKDIR /app/backend
RUN npm ci --prefer-offline --no-audit --ignore-scripts

# 3. Por último instalar la raíz (SIN ejecutar postinstall)
WORKDIR /app
RUN npm install --ignore-scripts

# Crear usuario sin privilegios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
ENV PORT=3000

# Exponer puertos
EXPOSE 3000 3001 3002

CMD ["tail", "-f", "/dev/null"]
