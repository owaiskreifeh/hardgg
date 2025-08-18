#!/bin/bash

# Development script for starting the application with Turbopack
echo "🚀 Starting development environment with Turbopack..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start the development environment
echo "📦 Building and starting containers..."
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Development environment started!"
echo "🌐 Application will be available at: http://localhost:3000"
echo "🔄 Hot reloading is enabled with Turbopack"
