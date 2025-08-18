# Development script for starting the application with Turbopack (PowerShell)
Write-Host "🚀 Starting development environment with Turbopack..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Build and start the development environment
Write-Host "📦 Building and starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up --build

Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "🌐 Application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔄 Hot reloading is enabled with Turbopack" -ForegroundColor Cyan
