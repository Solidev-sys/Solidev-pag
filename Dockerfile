# Etapa 1: Final con TODO el repositorio
FROM node:18-alpine AS final
WORKDIR /app

# Instalar git (si necesitas hacer pull updates)
RUN apk add --no-cache bash git

# Copiar TODO el repositorio
COPY . .

# Instalar dependencias de la RAÍZ (incluye concurrently)
RUN npm install

# Instalar dependencias del backend
WORKDIR /app/backend
RUN npm ci --prefer-offline --no-audit

# Instalar dependencias del frontend
WORKDIR /app/frontend
RUN npm ci --prefer-offline --no-audit

# Volver a la raíz
WORKDIR /app

# Crear usuario sin privilegios
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=development
ENV PORT=3000

# Exponer puertos de backend y frontend
EXPOSE 3000 3001 3002

# Ejecutar npm run dev desde la raíz
CMD ["npm", "run", "dev"]