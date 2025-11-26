#!/bin/bash

# Build script for AWS deployment
set -e

echo "🚀 Building Katrina for AWS deployment..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t katrina:latest -f dockerfile .

# Tag for AWS ECR (replace with your actual ECR repository)
# AWS_ACCOUNT_ID=your-account-id
# AWS_REGION=us-east-1
# ECR_REPO=katrina

# docker tag katrina:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest

echo "✅ Build complete!"

# Optional: Run the container locally to test
echo "🧪 Testing container locally..."
docker run -d --name katrina-test -p 3000:3000 katrina:latest

echo "⏳ Waiting for container to start..."
sleep 10

# Test the application
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Container is running successfully!"
else
    echo "❌ Container failed to start properly"
    docker logs katrina-test
    exit 1
fi

# Clean up test container
docker stop katrina-test
docker rm katrina-test

echo "🎉 Ready for AWS deployment!"