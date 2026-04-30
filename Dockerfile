# Development Dockerfile
FROM node:22-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

# Set working directory
WORKDIR /app

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
CMD ["pnpm", "start"]
