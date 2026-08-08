# Installation & Setup Guide

## Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn
- Docker (optional)

## Quick Start with Docker Compose

```bash
# Clone the repository
git clone https://github.com/omshrisjagushte/news-aggregation-system.git
cd news-aggregation-system

# Start all services
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Database: localhost:5432

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Manual Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/news_db
# JWT_SECRET=your-secure-key

# Create database and tables
psql -U postgres -h localhost -c "CREATE DATABASE news_db;"
psql -U postgres -h localhost -d news_db -f ../src/database/schema.sql

# Start server
npm run dev

# Server runs on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Update .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

## PostgreSQL Setup

### Using Docker
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=news_db \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine
```

### Using Local PostgreSQL
```bash
# Create database
psql -U postgres -h localhost
# In psql:
CREATE DATABASE news_db;
\c news_db
\i src/database/schema.sql
```

## Verify Installation

### Test Backend API
```bash
curl http://localhost:5000/api
# Should return: {"message":"News Aggregation System API","version":"1.0.0","status":"Online"}
```

### Test Database Connection
```bash
psql postgresql://postgres:postgres@localhost:5432/news_db
\dt  # List tables
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
lsof -i :5432  # Database
```

### Database Connection Error
- Check PostgreSQL is running
- Verify credentials in .env
- Ensure database exists

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Development Commands

```bash
# Backend
cd backend
npm run dev      # Start with hot reload
npm run start    # Start production
npm run lint     # Lint code
npm run format   # Format code

# Frontend
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   ├── config/       # Configuration
│   │   └── server.js     # Entry point
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

## Next Steps

1. **Add RSS Feeds**: Use the frontend to add RSS feed URLs
2. **Configure Categories**: Create custom categories for feeds
3. **Search Articles**: Use search functionality
4. **Bookmark Articles**: Save articles for later reading
5. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Need Help?

- Check logs: `docker-compose logs [service-name]`
- API docs: Access Swagger UI at `/api/docs` (if implemented)
- GitHub Issues: Open an issue on GitHub
