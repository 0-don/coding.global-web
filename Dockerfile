FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json ./

RUN bun install

# 
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN bun run build

# 
FROM oven/bun:1-alpine AS prod

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["bun", "start"]
