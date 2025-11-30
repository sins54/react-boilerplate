# Deployment Guide

This document explains how to build, run, and deploy the containerized React application.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) (optional, for local development)

## Building the Docker Image

To build the production Docker image, run:

```bash
docker build -t my-app .
```

This command:
1. Uses a multi-stage build process
2. Installs dependencies and builds the React app in the first stage
3. Creates a minimal Nginx image with only the static assets in the second stage

## Running the Container

### Using Docker directly

```bash
docker run -p 8080:80 my-app
```

The application will be available at `http://localhost:8080`.

### Using Docker Compose

For local development, you can use Docker Compose:

```bash
docker compose up
```

Or to run in detached mode:

```bash
docker compose up -d
```

To stop the container:

```bash
docker compose down
```

## Why Nginx Instead of `npm run preview`?

We use Nginx to serve static files in production instead of `npm run preview` (Vite's preview server) for several important reasons:

### 1. Performance
- **Nginx** is a high-performance, battle-tested web server optimized for serving static files
- **Vite preview** is designed for local testing, not production workloads
- Nginx can handle thousands of concurrent connections efficiently

### 2. Security
- **Nginx** has extensive security features and is regularly audited
- **Vite preview** explicitly states it should not be used in production
- Nginx provides built-in protection against common web attacks

### 3. Features
- **Gzip compression** - Nginx compresses files on-the-fly, reducing bandwidth
- **Proper caching headers** - Long cache for hashed assets, no-cache for index.html
- **SPA routing** - Handles client-side routing by redirecting 404s to index.html

### 4. Resource Efficiency
- **Nginx** is lightweight and uses minimal memory
- **Node.js runtime** is not needed in production for serving static files
- Final Docker image is much smaller (~25MB vs ~200MB+)

### 5. Industry Standard
- Nginx is the industry standard for serving static web applications
- Well-documented and widely supported
- Easy to configure for load balancing, SSL termination, and reverse proxying

## Deploying to Cloud Providers

### AWS (ECS/Fargate)

1. Push the image to Amazon ECR:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker tag my-app:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
   ```

2. Create an ECS task definition and service

### DigitalOcean (App Platform)

1. Push the image to DigitalOcean Container Registry or connect your GitHub repository
2. Create a new App in the App Platform
3. Select the Docker image or repository
4. Configure the HTTP port as 80

### Local/Self-Hosted

Simply run the Docker container on any server:

```bash
docker run -d -p 80:80 --restart always my-app
```

## Environment Variables

The Docker build uses `NODE_ENV=production` by default. Additional environment variables can be configured at build time by modifying the Dockerfile or at runtime through docker-compose.yml.

## Troubleshooting

### Container won't start
- Check Docker logs: `docker logs <container-id>`
- Verify the build completed successfully

### 404 errors on page refresh
- Ensure the nginx.conf is properly copied
- Check that the `try_files` directive is configured for SPA routing

### Assets not loading
- Verify the build output is in the correct location
- Check browser console for specific errors
