# Install dependencies only when needed
# Stage 0
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json ./
RUN yarn install
#############################################


# Rebuild the source code only when needed
# Stage 1
FROM node:18-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN yarn build 
#############################################


# Production image, copy only production files
# Stage 2
FROM node:18-alpine AS prod
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.solid ./.solid
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["yarn", "start"]
#############################################
