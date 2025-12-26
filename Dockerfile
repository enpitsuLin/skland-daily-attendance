# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate

WORKDIR /app

# Copy package files and workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/.output /app/.output

# Create directory for local file storage (if needed)
RUN mkdir -p /app/.data/kv

# Expose port (optional, Nitro defaults to 3000)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", ".output/server/index.mjs"]
