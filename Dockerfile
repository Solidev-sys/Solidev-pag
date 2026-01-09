# Etapa de dependencias: instala todo (incluye dev deps para poder compilar)
FROM node:20-alpine AS deps
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci

# Etapa de build: compila la app con las variables públicas necesarias
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar .env.local ANTES del build
COPY .env.local .env.local

# Los ARG son opcionales pero útiles para override
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MP_PUBLIC_KEY

# Si no vienen por ARG, se usan del .env.local
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_MP_PUBLIC_KEY=${NEXT_PUBLIC_MP_PUBLIC_KEY}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
RUN npm run build

# Etapa de runtime: imagen final liviana
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

# Solo deps de producción para un runtime mínimo
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos artefactos necesarios del build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Exponer el puerto del servidor Next
EXPOSE 3001

# Ejecutar como usuario no root
USER node

# Arranque del frontend (usa PORT=3001)
CMD ["npm", "run", "start"]
