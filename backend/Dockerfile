# Stage 1: install production dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: lean runtime image
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs src/ ./src/
COPY --chown=nodejs:nodejs package.json ./

USER nodejs
EXPOSE 8080
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
