# ============================================
# DOCKERFILE SEGURO - SOLIDEV BACKEND
# Hardened para producción
# ============================================

# Etapa de build
FROM node:20-slim AS builder
WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive

# Copiar manifiestos e instalar dependencias
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# Copiar código fuente
COPY controllers/ ./controllers/
COPY js/ ./js/

# Etapa de runtime (SEGURA)
FROM node:20-slim AS runtime
WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV BIND=0.0.0.0
ENV HTTP_PORT=3002

# Crear usuario sin privilegios
RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs backend && \
    # Limpiar cache y archivos innecesarios
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm

# Copiar desde builder
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/controllers ./controllers
COPY --from=builder --chown=backend:nodejs /app/js ./js
COPY --chown=backend:nodejs package*.json ./

# Permisos restrictivos
RUN chmod -R 550 /app

# Exponer puerto solo internamente
EXPOSE 3002

# Usuario sin privilegios
USER backend

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3002/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

# Comando de inicio
CMD ["node", "controllers/api.js"]
