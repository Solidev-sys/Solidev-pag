# ============================================
# DOCKERFILE SEGURO - SOLIDEV BACKEND
# Hardened para producción
# ============================================

# Etapa de build
FROM node:20-slim AS builder
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY controllers/ ./controllers/
COPY js/ ./js/

# Etapa de runtime (SEGURA)
FROM node:20-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV BIND=0.0.0.0
ENV HTTP_PORT=3002

# Crear usuario sin privilegios
RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs backend && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /root/.npm

# Copiar todo desde builder CON el usuario correcto
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=backend:nodejs /app/controllers ./controllers
COPY --from=builder --chown=backend:nodejs /app/js ./js
COPY --chown=backend:nodejs package*.json ./

# Permisos: owner puede leer y ejecutar
RUN chmod -R 750 /app && \
    chown -R backend:nodejs /app

EXPOSE 3002

USER backend

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD node -e "const http = require('http'); http.get('http://localhost:3002/', (r) => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))" || exit 1

CMD ["node", "controllers/api.js"]
