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
# Pasamos la URL del backend al build (Next la usa en rewrites y cliente)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build optimizado para producción
RUN npm run build

# Etapa de runtime: imagen final liviana
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Puerto del servidor Next.js (coincide con package.json: 3001)
ENV PORT=3001

# Solo deps de producción para un runtime mínimo
COPY package*.json ./
RUN npm ci --omit=dev

# Copiamos artefactos necesarios del build
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# next.config.js no es estrictamente necesario en runtime, pero lo incluimos
COPY --from=builder /app/next.config.js ./next.config.js

# Exponer el puerto del servidor Next
EXPOSE 3001

# Opcional: ejecutar como usuario no root
USER node

# Arranque del frontend (usa PORT=3001)
CMD ["npm", "run", "start"]