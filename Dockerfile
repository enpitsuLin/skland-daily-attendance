# Build stage
FROM node:24-alpine AS builder

# Install pnpm
RUN corepack enable

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies (only production if possible, but Nitro needs dev deps for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:24-alpine

# Set non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output /app/.output

# Create data directories and set permissions
RUN mkdir -p /app/.data/kv && chown -R appuser:appgroup /app

# Expose port (Nitro defaults to 3000)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Switch to non-root user
USER appuser

# Start the application
CMD ["node", ".output/server/index.mjs"]
