# Etapa 1: Final con TODO el repositorio
FROM node:18-alpine AS final
WORKDIR /app

# Instalar bash y git
RUN apk add --no-cache bash git

# Copiar TODO el repositorio
COPY . .

# 1. Primero instalar el frontend
WORKDIR /app/frontend
RUN npm ci --prefer-offline --no-audit

# 2. Luego instalar el backend
WORKDIR /app/backend
RUN npm ci --prefer-offline --no-audit

# 3. Por último instalar la raíz
WORKDIR /app
RUN npm install --ignore-scripts

# Crear usuario sin privilegios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# CAMBIAR ESTO:
# ENV NODE_ENV=development  ← ELIMINAR O CAMBIAR A production
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puertos
EXPOSE 3000 3002

# Este CMD será sobrescrito por el 'command' del docker-compose
#CMD ["npm", "run", "dev"]