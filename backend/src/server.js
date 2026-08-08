import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';
import dotenv from 'dotenv';
import pkg from 'pg';
import { initializeDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import articlesRoutes from './routes/articles.js';
import feedsRoutes from './routes/feeds.js';
import categoriesRoutes from './routes/categories.js';
import userRoutes from './routes/user.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 5000;

// Database Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
});

// Make pool available globally
global.pool = pool;

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(','),
  credentials: true 
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      error: error.message,
      database: 'Disconnected'
    });
  }
});

// API base
app.get('/api', (req, res) => {
  res.json({ 
    message: 'News Aggregation System API',
    version: '1.0.0',
    status: 'Online',
    endpoints: {
      auth: '/api/auth',
      articles: '/api/articles',
      feeds: '/api/feeds',
      categories: '/api/categories',
      user: '/api/user'
    }
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/feeds', feedsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}\n`);
  
  try {
    await initializeDatabase();
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  }
});

export default app;