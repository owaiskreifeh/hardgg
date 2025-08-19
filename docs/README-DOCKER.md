# FitGirl Repacks - Docker Setup

This document explains how to run the FitGirl Repacks application using Docker containers with Redis for data storage.

## 🏗️ Architecture

The application consists of:
- **Next.js App**: Frontend and API server
- **Redis**: Data storage for game information
- **Data Loader**: Script to import JSON data into Redis

## 📋 Prerequisites

- Docker and Docker Compose installed
- Results directory with JSON files (results_page_*.json)

## 🚀 Quick Start

### Development Environment

1. **Start the development environment:**
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up --build
   ```

2. **Load data into Redis:**
   ```bash
   # In a new terminal, run the data loader
   docker-compose -f docker-compose.dev.yml run --rm data-loader
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Redis: localhost:6379

### Production Environment

1. **Start the production environment:**
   ```bash
   docker-compose up --build
   ```

2. **Load data into Redis:**
   ```bash
   # The data loader will run automatically
   # You can also run it manually:
   docker-compose run --rm data-loader
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Redis: localhost:6379

## 📁 Project Structure

```
├── docker/
│   ├── Dockerfile                 # Production Docker image
│   ├── Dockerfile.dev            # Development Docker image
│   ├── docker-compose.yml        # Production services
│   └── docker-compose.dev.yml    # Development services
├── scripts/
│   ├── load-data.js          # Data loader script (CommonJS)
│   └── load-data.mjs         # Data loader script (ES Modules)
├── src/
│   ├── app/
│   │   └── api/              # API routes
│   ├── lib/
│   │   └── redis.ts          # Redis client and operations
│   └── components/           # React components
└── results/                  # JSON data files
```

## 🔧 Configuration

### Environment Variables

- `REDIS_URL`: Redis connection string (default: redis://localhost:6379)
- `NODE_ENV`: Environment mode (development/production)

### Docker Compose Services

#### Production (`docker-compose.yml`)
- **app**: Next.js application (production build)
- **redis**: Redis database
- **data-loader**: One-time data import service

#### Development (`docker-compose.dev.yml`)
- **app**: Next.js application (development mode with hot reload)
- **redis**: Redis database
- **data-loader**: Data import service

## 📊 Data Loading

The application loads game data from JSON files in the `results/` directory into Redis.

### Data Format

Each JSON file should contain an array of game objects with the following structure:

```json
[
  {
    "title": "Game Title",
    "image": "image_url",
    "tags": ["Action", "RPG"],
    "description": "Game description",
    "url": "game_url",
    "metadata": {
      "companies": "Developer, Publisher",
      "languages": "ENG/MULTI",
      "originalSize": "50 GB",
      "repackSize": "25 GB"
    },
    "repackFeatures": ["Feature 1", "Feature 2"]
  }
]
```

### Loading Process

1. **Automatic Loading**: The data loader runs automatically when starting the containers
2. **Manual Loading**: Run the data loader manually:
   ```bash
   # Development
   docker-compose -f docker/docker-compose.dev.yml run --rm data-loader
   
   # Production
   docker-compose run --rm data-loader
   ```

## 🔌 API Endpoints

### Games API

- `GET /api/games` - Get all games with filtering and pagination
- `GET /api/games/[id]` - Get a specific game by ID
- `GET /api/games/stats` - Get game statistics

### Query Parameters

- `q`: Search query
- `genre`: Filter by genre (comma-separated)
- `size`: Filter by maximum size
- `language`: Filter by language (comma-separated)
- `sortBy`: Sort field (title, releaseDate, size)
- `sortOrder`: Sort order (asc, desc)
- `page`: Page number for pagination
- `limit`: Number of items per page

## 🛠️ Development

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Redis:**
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up redis -d
   ```

3. **Load data:**
   ```bash
   node scripts/load-data.js
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

### Building Images

```bash
# Production image
docker build -t fitgirl-repacks:latest .

# Development image
docker build -f docker/Dockerfile.dev -t fitgirl-repacks:dev .
```

## 📦 Deployment

### Production Deployment

1. **Build and start services:**
   ```bash
   docker-compose up --build -d
   ```

2. **Verify services are running:**
   ```bash
   docker-compose ps
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f app
   ```

### Scaling

To scale the application:

```bash
# Scale the app service
docker-compose up --scale app=3 -d

# Use a load balancer (nginx, traefik, etc.)
```

## 🔍 Monitoring

### Health Checks

- **Application**: http://localhost:3000/api/health
- **Redis**: `docker-compose exec redis redis-cli ping`

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs redis

# Follow logs in real-time
docker-compose logs -f
```

## 🧹 Maintenance

### Data Management

```bash
# Clear Redis data
docker-compose exec redis redis-cli FLUSHALL

# Reload data
docker-compose run --rm data-loader

# Backup Redis data
docker-compose exec redis redis-cli BGSAVE
```

### Container Management

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and restart
docker-compose up --build --force-recreate

# Clean up unused resources
docker system prune -a
```

## 🐛 Troubleshooting

### Common Issues

1. **Redis Connection Error**
   - Check if Redis container is running: `docker-compose ps`
   - Verify Redis URL in environment variables
   - Check Redis logs: `docker-compose logs redis`

2. **Data Loading Issues**
   - Ensure JSON files are in the `results/` directory
   - Check file permissions
   - Verify JSON format is correct

3. **Application Not Starting**
   - Check application logs: `docker-compose logs app`
   - Verify port 3000 is not in use
   - Check environment variables

4. **Performance Issues**
   - Monitor Redis memory usage
   - Consider Redis persistence configuration
   - Check application resource usage

### Debug Commands

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Access application container
docker-compose exec app sh

# Check Redis data
docker-compose exec redis redis-cli KEYS "*"

# Monitor Redis operations
docker-compose exec redis redis-cli MONITOR
```

## 📈 Performance Optimization

### Redis Configuration

For production, consider:
- Redis persistence (RDB/AOF)
- Memory limits
- Connection pooling
- Redis clustering for high availability

### Application Optimization

- Enable Next.js caching
- Use Redis for session storage
- Implement API response caching
- Optimize database queries

## 🔒 Security

### Production Security

- Use Redis authentication
- Configure firewall rules
- Use HTTPS in production
- Implement rate limiting
- Regular security updates

### Environment Variables

Store sensitive data in environment variables:
```bash
# .env file
REDIS_URL=redis://:password@redis:6379
NODE_ENV=production
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Redis Documentation](https://redis.io/documentation)
- [Next.js Documentation](https://nextjs.org/docs)
