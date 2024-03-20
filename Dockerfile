# Install dependencies only when needed
# Stage 0
FROM oven/bun:alpine AS deps
WORKDIR /app

COPY package.json ./
RUN bun install
#############################################


# Rebuild the source code only when needed
# Stage 1
FROM oven/bun:alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN bun run build
RUN rm -rf node_modules
RUN bun install --production
#############################################


# Production image, copy only production files
# Stage 2
FROM oven/bun:alpine AS prod

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.vinxi ./.vinxi
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ARG DATABASE_URL
ARG VITE_HOST_URL
ENV DATABASE_URL=$DATABASE_URL
ENV VITE_HOST_URL=$VITE_HOST_URL

CMD ["bun", "start"]
#############################################
