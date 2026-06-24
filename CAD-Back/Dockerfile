# =============================================================================
# DOCKERFILE - CAD BACKEND (NESTJS)
# Multi-stage: deps → development
# =============================================================================

# ---------------------------------------------------------------------------
# STAGE 1: Dependencies
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# ---------------------------------------------------------------------------
# STAGE 2: Development (con hot-reload vía --watch)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Genera el Prisma Client dentro del contenedor
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
