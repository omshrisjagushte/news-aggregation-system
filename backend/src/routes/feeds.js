import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await global.pool.query(
      'SELECT * FROM rss_feeds LIMIT 100'
    );
    
    res.json({ 
      success: true,
      feeds: result.rows 
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title, url, description } = req.body;
    const userId = req.user.id;
    
    if (!title || !url) {
      throw new AppError('Title and URL are required', 400);
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new AppError('URL must start with http:// or https://', 400);
    }
    
    // Check if feed URL already exists
    const existing = await global.pool.query(
      'SELECT id FROM rss_feeds WHERE url = $1',
      [url]
    );
    
    if (existing.rows.length > 0) {
      throw new AppError('Feed URL already exists', 409);
    }
    
    const result = await global.pool.query(
      'INSERT INTO rss_feeds (user_id, title, url, description, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, title, url, description || '']
    );
    
    res.status(201).json({ 
      success: true,
      feed: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!id || isNaN(id)) {
      throw new AppError('Invalid feed ID', 400);
    }
    
    // Verify ownership
    const feed = await global.pool.query(
      'SELECT id FROM rss_feeds WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (feed.rows.length === 0) {
      throw new AppError('Feed not found or unauthorized', 404);
    }
    
    await global.pool.query('DELETE FROM rss_feeds WHERE id = $1', [id]);
    
    res.json({ 
      success: true,
      message: 'Feed deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
});

export default router;