# ============================================
# DOCKERFILE SEGURO - SOLIDEV FRONTEND
# Hardened para producción
# ============================================

# Etapa de dependencias
FROM node:20-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=https://solidevtech.cloud

ARG NEXT_PUBLIC_MP_PUBLIC_KEY
ENV NEXT_PUBLIC_MP_PUBLIC_KEY=${NEXT_PUBLIC_MP_PUBLIC_KEY}

# Copiar dependencias y código
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Crear directorio public si no existe
RUN mkdir -p public

# Build de producción
RUN npm run build && \
    rm -rf node_modules

# Etapa de runtime (SEGURA)
FROM node:20-alpine AS runner
WORKDIR /app

# Variables de entorno de seguridad
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

# Instalar solo lo necesario para runtime
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force && \
    # Eliminar archivos innecesarios
    rm -rf /root/.npm /tmp/* /var/cache/apk/*

# Copiar artefactos de build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Crear usuario sin privilegios específico
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs && \
    chown -R nextjs:nodejs /app

# Configurar permisos restrictivos
RUN chmod -R 550 /app && \
    chmod -R 770 /app/.next/cache 2>/dev/null || true

# NO exponer puerto públicamente (solo interno)
EXPOSE 3001

# Ejecutar como usuario sin privilegios
USER nextjs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/ || exit 1

# Comando de inicio
CMD ["npm", "run", "start"]
