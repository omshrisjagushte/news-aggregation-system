import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'express-async-errors';
import dotenv from 'dotenv';
import pkg from 'pg';

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
  console.error('Unexpected error on idle client', err);
});

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: ['https://news-aggregation-system-seven.vercel.app', 'http://localhost:3000'],
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

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, username, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, username',
      [email, username, password]
    );

    const token = Buffer.from(`${result.rows[0].id}:${email}`).toString('base64');

    res.status(201).json({
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const result = await pool.query(
      'SELECT id, email, username FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = Buffer.from(`${result.rows[0].id}:${email}`).toString('base64');

    res.json({
      message: 'Login successful',
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Articles Routes
app.get('/api/articles', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM articles ORDER BY published_at DESC LIMIT 50'
    );
    res.json({ articles: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/articles/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const result = await pool.query(
      `SELECT * FROM articles WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 50`,
      [`%${q}%`]
    );
    res.json({ results: result.rows, query: q });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Feeds Routes
app.get('/api/feeds', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rss_feeds LIMIT 100');
    res.json({ feeds: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feeds', async (req, res) => {
  try {
    const { title, url, description } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL required' });
    }

    const result = await pool.query(
      'INSERT INTO rss_feeds (user_id, title, url, description, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [1, title, url, description || '']
    );

    res.status(201).json({ feed: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories Routes
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories LIMIT 100');
    res.json({ categories: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Routes
app.get('/api/user/profile', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, username, created_at FROM users LIMIT 1');
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/bookmarks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookmarks LIMIT 50');
    res.json({ bookmarks: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error'
  });
});

// Initialize database on startup
async function initializeDatabase() {
  try {
    console.log('📊 Initializing database...');
    
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        bio TEXT,
        theme VARCHAR(20) DEFAULT 'light',
        notifications_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS rss_feeds (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        category_id INTEGER,
        active BOOLEAN DEFAULT true,
        last_fetched TIMESTAMP,
        fetch_interval INTEGER DEFAULT 3600,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(7),
        icon VARCHAR(50),
        display_order INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name)
      );

      CREATE TABLE IF NOT EXISTS articles (
        id SERIAL PRIMARY KEY,
        feed_id INTEGER REFERENCES rss_feeds(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content TEXT,
        author VARCHAR(255),
        image_url VARCHAR(500),
        source_url VARCHAR(500) UNIQUE,
        published_at TIMESTAMP,
        fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS bookmarks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
        article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
        read BOOLEAN DEFAULT false,
        read_at TIMESTAMP,
        bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, article_id)
      );

      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, name)
      );

      CREATE TABLE IF NOT EXISTS article_tags (
        id SERIAL PRIMARY KEY,
        article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
        tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        UNIQUE(article_id, tag_id)
      );

      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
        query VARCHAR(500) NOT NULL,
        results_count INTEGER,
        searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE DEFAULT 1 REFERENCES users(id) ON DELETE CASCADE,
        items_per_page INTEGER DEFAULT 20,
        sort_by VARCHAR(50) DEFAULT 'date_desc',
        auto_fetch_enabled BOOLEAN DEFAULT true,
        digest_frequency VARCHAR(50) DEFAULT 'daily',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_articles_feed_id ON articles(feed_id);
      CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
      CREATE INDEX IF NOT EXISTS idx_feeds_user_id ON rss_feeds(user_id);
      CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
    `;

    // Split and execute each statement
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      try {
        await pool.query(statement);
      } catch (error) {
        if (!error.message.includes('already exists')) {
          console.error('Schema error:', error.message);
        }
      }
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Start server
app.listen(PORT, async () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}\n`);
  
  await initializeDatabase();
});

export default app;
