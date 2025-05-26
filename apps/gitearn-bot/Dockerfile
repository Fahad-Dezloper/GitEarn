FROM node:20-slim

# Enable corepack and install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --production

# Clean cache (optional)
RUN pnpm store prune

# Set environment
ENV NODE_ENV="production"

# Copy the rest of the app
COPY . .

# Start the app
CMD [ "pnpm", "start" ]
