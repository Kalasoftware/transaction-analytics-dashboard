#!/bin/bash

# Deployment script for Transaction Analytics Dashboard
set -e

echo "Starting deployment..."

# Install dependencies
npm ci

# Stop existing PM2 process
pm2 stop transaction-analytics || true
pm2 delete transaction-analytics || true

# Start the application
pm2 start ecosystem.config.js

echo "Deployment completed successfully!"
echo "Application is running on http://localhost:3000"
