FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies if needed
RUN apk add --no-cache libc6-compat

# Copy package config
COPY package.json package-lock.json* ./

# Install npm dependencies
RUN npm ci

# Copy application source code
COPY . .

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js production bundle
RUN npm run build

# Expose production port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]
