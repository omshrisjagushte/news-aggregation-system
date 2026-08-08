import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const offset = parseInt(req.query.offset) || 0;
    
    const result = await global.pool.query(
      'SELECT * FROM articles ORDER BY published_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    res.json({ 
      success: true,
      articles: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      throw new AppError('Search query is required', 400);
    }
    
    if (q.length > 200) {
      throw new AppError('Search query is too long (max 200 characters)', 400);
    }
    
    const result = await global.pool.query(
      `SELECT * FROM articles WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY published_at DESC LIMIT 50`,
      [`%${q}%`]
    );
    
    res.json({ 
      success: true,
      results: result.rows, 
      query: q 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      throw new AppError('Invalid article ID', 400);
    }
    
    const result = await global.pool.query(
      'SELECT * FROM articles WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      throw new AppError('Article not found', 404);
    }
    
    res.json({ 
      success: true,
      article: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
});

export default router;