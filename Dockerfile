# FROM imbios/bun-node:latest-iron-alpine

# Install dependencies only when needed
# Stage 0
FROM imbios/bun-node:latest-iron-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN bun install
#############################################


# Rebuild the source code only when needed
# Stage 1
FROM imbios/bun-node:latest-iron-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

ARG DATABASE_URL
ARG AUTH_SECRET
ARG AUTH_TRUST_HOST
ARG DISCORD_CLIENT_ID
ARG DISCORD_CLIENT_SECRET
ARG VITE_HOST_URL
ARG VITE_BOT_URL
ARG VITE_GUILD_ID
ARG VITE_AUTH_PATH

ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
ENV AUTH_URL=$VITE_HOST_URL
ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET
ENV VITE_HOST_URL=$VITE_HOST_URL
ENV VITE_BOT_URL=$VITE_BOT_URL
ENV VITE_GUILD_ID=$VITE_GUILD_ID
ENV VITE_AUTH_PATH=$VITE_AUTH_PATH


RUN bun run build
#############################################


# Production image, copy only production files
# Stage 2
FROM imbios/bun-node:latest-iron-alpine AS prod

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
ARG VITE_HOST_URL
ARG VITE_BOT_URL
ARG VITE_GUILD_ID
ARG VITE_AUTH_PATH

ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV AUTH_TRUST_HOST=$AUTH_TRUST_HOST
ENV AUTH_URL=$VITE_HOST_URL
ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET
ENV VITE_HOST_URL=$VITE_HOST_URL
ENV VITE_BOT_URL=$VITE_BOT_URL
ENV VITE_GUILD_ID=$VITE_GUILD_ID
ENV VITE_AUTH_PATH=$VITE_AUTH_PATH


CMD bun start
#############################################
