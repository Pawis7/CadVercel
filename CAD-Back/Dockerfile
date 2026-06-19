# =============================================================================
# DOCKERFILE - CDJ BACKEND (Entorno Local Prod-Like)
# =============================================================================
# Multi-stage build para optimizar tamaño y seguridad
# =============================================================================

# ---------------------------------------------------------------------------
# STAGE 1: Dependencies
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Instalar dependencias de sistema necesarias (openssl para Prisma, libc6 para Next.js)
RUN apk update && \
    apk add --no-cache \
    python3 \
    make \
    g++ \
    build-base \
    openssl \
    openssl-dev \
    libc6-compat

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar todas las dependencias
RUN npm install --ignore-scripts

# ---------------------------------------------------------------------------
# STAGE 2: Development
# ---------------------------------------------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

# Instalar dependencias de runtime
RUN apk update && \
    apk add --no-cache \
    openssl \
    libc6-compat

# Copiar node_modules desde stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente y configuraciones
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Puerto de la API (Next.js usa 4180 según tu config)
EXPOSE 4180

# Comando por defecto (sobrescrito por docker-compose en local)
CMD ["npm", "run", "dev"]
