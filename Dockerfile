# Stage 1: Build the React app with Vite
FROM node:24.12.0-alpine AS build

WORKDIR /app

# Build-time arguments (Vite reads these at build time)
ARG VITE_API_URL
ARG VITE_S3_PUBLIC_BASE_URL
ARG VITE_SITE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_S3_PUBLIC_BASE_URL=$VITE_S3_PUBLIC_BASE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files from stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# SPA: serve index.html for client-side routes
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
