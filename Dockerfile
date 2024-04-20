# Install dependencies only when needed
# Stage 0
FROM oven/bun:1.0.36-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN bun install
#############################################


# Rebuild the source code only when needed
# Stage 1
FROM oven/bun:1.0.36-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lockb ./bun.lockb

ARG VITE_HOST_URL
ENV VITE_HOST_URL=$VITE_HOST_URL

RUN bun run build
#############################################


# Production image, copy only production files
# Stage 2
FROM oven/bun:1.0.36-alpine AS prod

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.vinxi ./.vinxi
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/db.migrations ./db.migrations


ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_TRUST_HOST
ARG DISCORD_CLIENT_ID
ARG DISCORD_CLIENT_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET
ENV BUN=true

EXPOSE 3000

CMD ["bun", "start"]
#############################################
