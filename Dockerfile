<<<<<<< HEAD
# Multi-stage build for production
=======
# Multi-stage build for React/Vite application

# Stage 1: Build the application
>>>>>>> dev
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
<<<<<<< HEAD
COPY package.json package-lock.json ./
=======
COPY package*.json ./
>>>>>>> dev

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

<<<<<<< HEAD
# Production stage
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
=======
# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
>>>>>>> dev
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
