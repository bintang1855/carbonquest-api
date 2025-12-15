#!/bin/bash

# CarbonQuest API - Deployment Script for Ubuntu Server
# Usage: ./deploy.sh [build|start|stop|restart|logs|migrate]

set -e

echo "🚀 CarbonQuest API Deployment Script"
echo "======================================"

case "$1" in
  build)
    echo "📦 Building Docker images..."
    docker compose build --no-cache
    echo "✅ Build complete!"
    ;;
    
  start)
    echo "🔵 Starting containers..."
    docker compose up -d
    echo "✅ Containers started!"
    echo "📊 Container status:"
    docker compose ps
    ;;
    
  stop)
    echo "🔴 Stopping containers..."
    docker compose down
    echo "✅ Containers stopped!"
    ;;
    
  restart)
    echo "🔄 Restarting containers..."
    docker compose restart
    echo "✅ Containers restarted!"
    docker compose ps
    ;;
    
  logs)
    echo "📋 Showing logs (Ctrl+C to exit)..."
    docker compose logs -f app
    ;;
    
  migrate)
    echo "🗃️  Running database migrations..."
    docker compose exec app npx prisma migrate deploy
    echo "✅ Migrations complete!"
    ;;
    
  rebuild)
    echo "🔄 Full rebuild (stop -> build -> start -> migrate)..."
    docker compose down
    docker compose build --no-cache
    docker compose up -d
    sleep 5
    docker compose exec app npx prisma migrate deploy
    echo "✅ Rebuild complete!"
    docker compose ps
    ;;
    
  status)
    echo "📊 Container status:"
    docker compose ps
    echo ""
    echo "💾 Volume status:"
    docker volume ls | grep carbonquest
    ;;
    
  clean)
    echo "⚠️  WARNING: This will delete all data!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
      echo "🧹 Cleaning up..."
      docker compose down -v
      echo "✅ Cleanup complete!"
    else
      echo "❌ Cancelled"
    fi
    ;;
    
  *)
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  build    - Build Docker images"
    echo "  start    - Start containers"
    echo "  stop     - Stop containers"
    echo "  restart  - Restart containers"
    echo "  logs     - Show container logs"
    echo "  migrate  - Run database migrations"
    echo "  rebuild  - Full rebuild (stop -> build -> start -> migrate)"
    echo "  status   - Show container and volume status"
    echo "  clean    - Remove all containers and volumes (CAUTION!)"
    echo ""
    echo "Example: ./deploy.sh rebuild"
    exit 1
    ;;
esac
