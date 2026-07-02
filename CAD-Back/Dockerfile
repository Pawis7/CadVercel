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

# Crear usuario no-root para el proceso Node
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
# Dar propiedad de node_modules al usuario no-root
RUN chown -R appuser:appgroup /app

# ---------------------------------------------------------------------------
# STAGE 2: Development (con hot-reload vía --watch)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat

# Reusar el mismo usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dar propiedad del directorio al usuario no-root
RUN chown -R appuser:appgroup /app

# Genera el Prisma Client dentro del contenedor
RUN npx prisma generate

# Cambiar al usuario no-root antes de ejecutar la app
USER appuser

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
