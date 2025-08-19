# Development script for starting the application with Turbopack (PowerShell)
Write-Host "🚀 Starting development environment with Turbopack..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker and try again." -ForegroundColor Red
    exit 1
}

# Clean up any existing containers and volumes
Write-Host "🧹 Cleaning up existing containers..." -ForegroundColor Yellow
docker-compose -f docker/docker-compose.dev.yml down --volumes --remove-orphans 2>$null

# Remove any existing .next and .turbo directories
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "🗑️  Removed .next directory" -ForegroundColor Yellow
}
if (Test-Path ".turbo") {
    Remove-Item -Recurse -Force ".turbo"
    Write-Host "🗑️  Removed .turbo directory" -ForegroundColor Yellow
}

# Build and start the development environment
Write-Host "📦 Building and starting containers..." -ForegroundColor Yellow
Write-Host "🔄 Hot reloading will be enabled with improved file watching" -ForegroundColor Cyan
Write-Host "⏱️  Initial build may take a few minutes..." -ForegroundColor Yellow

docker-compose -f docker/docker-compose.dev.yml up --build

Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "🌐 Application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔄 Hot reloading is enabled with Turbopack" -ForegroundColor Cyan
Write-Host "💡 Make changes to your files and they will automatically reload!" -ForegroundColor Cyan
