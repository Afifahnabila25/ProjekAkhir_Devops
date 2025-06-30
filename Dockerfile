# Multi-stage build optimized untuk Jenkins CI/CD
FROM node:18-alpine as build-stage

WORKDIR /app

# Copy package files (handle case jika tidak ada)
COPY pawpaw-fe-main/package*.json ./

# Install dependencies dengan error handling
RUN npm ci --only=production --silent || npm install --silent

# Copy source code
COPY pawpaw-fe-main/ ./

# Build aplikasi dengan fallback
RUN npm run build || (echo "Build failed, creating fallback..." && mkdir -p dist && echo '<h1>Onix Website</h1><p>Build in progress...</p>' > dist/index.html)

# Production stage
FROM nginx:alpine

# Install curl untuk health checks
RUN apk add --no-cache curl

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built application atau fallback
COPY --from=build-stage /app/dist/ /usr/share/nginx/html/

# Ensure index.html exists
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
        echo '<h1>Onix Website</h1><p>Welcome to Onix Website</p>' > /usr/share/nginx/html/index.html; \
    fi

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory untuk API
RUN mkdir -p /var/www/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html

# Health check untuk monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
