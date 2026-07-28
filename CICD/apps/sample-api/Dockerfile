# ─── Docker Multi-Stage Build ──────────────────────────────────────────────────
# Stage 1: Builder — install dependencies and generate Prisma client
# Stage 2: Runner — lean production image with non-root user
# ───────────────────────────────────────────────────────────────────────────────

FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application source
COPY . .

# ─── Production Stage ──────────────────────────────────────────────────────────

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install git
RUN apk add --no-cache git

# Copy built artifacts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

# Health check for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
