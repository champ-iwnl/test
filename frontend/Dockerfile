# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Build-time arguments for Next.js (NEXT_PUBLIC_* must be available at build time)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci

# Copy source code
COPY . .

# Build the application (env vars are inlined into JS bundle)
RUN npm run build

# Production stage
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built application and necessary files
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start production server
ENV PORT=3000
CMD ["node", "server.js"]