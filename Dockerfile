# Install dependencies only when needed
# Stage 0
FROM oven/bun:latest AS deps
WORKDIR /app

COPY package.json ./
RUN bun install
#############################################


# Rebuild the source code only when needed
# Stage 1
FROM oven/bun:latest AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN bun build
#############################################


# Production image, copy only production files
# Stage 2
FROM oven/bun:latest AS prod
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.vinxi ./.vinxi
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "start"]
#############################################
