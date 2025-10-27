# Etapa de build: instala dependencias en modo producción
FROM node:20-slim AS builder
WORKDIR /app

# Evita prompts durante instalaciones
ENV DEBIAN_FRONTEND=noninteractive

# Copia manifiestos y usa npm ci para reproducibilidad
COPY package*.json ./
RUN npm ci --omit=dev

# Copia el código fuente necesario
COPY controllers/ ./controllers/
COPY js/ ./js/

# Etapa de runtime: imagen final optimizada
FROM node:20-slim AS runtime
WORKDIR /app

# Variables por defecto para producción
ENV NODE_ENV=production
ENV BIND=0.0.0.0
ENV HTTP_PORT=3002

# Copia dependencias y código desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/controllers ./controllers
COPY --from=builder /app/js ./js
COPY package*.json ./

# No copiamos .env ni certificados (se inyectan/montan en runtime)
EXPOSE 3002

# Arranque del backend
CMD ["node", "controllers/api.js"]