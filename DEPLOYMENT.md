# Deployment Guide

## Frontend Deployment (Vercel)

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Set build command: `npm run build`
5. Set output directory: `dist`

### Step 2: Environment Variables
Add in Vercel project settings:
```
VITE_API_URL=https://your-backend-api.com/api
VITE_APP_NAME=News Aggregation System
```

### Step 3: Deploy
Vercel will automatically deploy on every push to main

**Your frontend will be at:** `https://your-project.vercel.app`

---

## Backend Deployment (Railway)

### Step 1: Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your repository

### Step 2: Add PostgreSQL
1. Click "Add a Service"
2. Select "PostgreSQL"
3. Railway will create the database automatically

### Step 3: Configure Environment Variables
Add these in Railway project settings:
```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
JWT_SECRET=generate-a-secure-random-key
CORS_ORIGIN=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app
RSS_UPDATE_INTERVAL=3600000
```

### Step 4: Deploy
1. Railway detects `package.json` and `Dockerfile`
2. Runs `npm install` automatically
3. Executes `node src/server.js`

**Your backend will be at:** `https://your-project.up.railway.app`

---

## Database Migration

After backend deployment:

1. SSH into your Railway instance
2. Run:
```bash
psql $DATABASE_URL -f src/database/schema.sql
```

Or use a migration script:
```bash
node src/database/migrate.js
```

---

## Alternative: Deploy Both with Docker

```bash
# Using Railway
railway link
railway up
```

---

## Domain Setup

### Vercel Frontend
1. Settings → Domains
2. Add your domain
3. Add CNAME records as instructed

### Railway Backend
1. Settings → Environment
2. Add domain
3. Point DNS to Railway

---

## Monitoring

- **Vercel**: Deployment logs in project dashboard
- **Railway**: Real-time logs in Railway dashboard
- **Database**: Access PostgreSQL through Railway dashboard

---

## Cost Breakdown

- **Vercel Frontend**: Free tier available (pay as you scale)
- **Railway Backend**: $5/month base + usage
- **PostgreSQL**: Included with Railway
- **Total Monthly**: ~$5+ (for hobby projects)
