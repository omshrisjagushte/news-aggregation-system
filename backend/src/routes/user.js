import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const result = await global.pool.query(
      'SELECT id, email, username, avatar_url, bio, theme, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    
    res.json({ 
      success: true,
      user: result.rows[0] 
    });
  } catch (error) {
    next(error);
  }
});

router.get('/bookmarks', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    
    const result = await global.pool.query(
      `SELECT b.*, a.* FROM bookmarks b 
       JOIN articles a ON b.article_id = a.id 
       WHERE b.user_id = $1 
       ORDER BY b.bookmarked_at DESC 
       LIMIT $2`,
      [userId, limit]
    );
    
    res.json({ 
      success: true,
      bookmarks: result.rows 
    });
  } catch (error) {
    next(error);
  }
});

router.post('/bookmarks', authMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.body;
    const userId = req.user.id;
    
    if (!articleId || isNaN(articleId)) {
      throw new AppError('Valid article ID is required', 400);
    }
    
    // Check if article exists
    const article = await global.pool.query(
      'SELECT id FROM articles WHERE id = $1',
      [articleId]
    );
    
    if (article.rows.length === 0) {
      throw new AppError('Article not found', 404);
    }
    
    const result = await global.pool.query(
      `INSERT INTO bookmarks (user_id, article_id, bookmarked_at) 
       VALUES ($1, $2, NOW()) 
       ON CONFLICT (user_id, article_id) DO NOTHING 
       RETURNING *`,
      [userId, articleId]
    );
    
    res.status(201).json({ 
      success: true,
      bookmark: result.rows[0] || { user_id: userId, article_id: articleId } 
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/bookmarks/:articleId', authMiddleware, async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;
    
    if (!articleId || isNaN(articleId)) {
      throw new AppError('Valid article ID is required', 400);
    }
    
    await global.pool.query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND article_id = $2',
      [userId, articleId]
    );
    
    res.json({ 
      success: true,
      message: 'Bookmark removed' 
    });
  } catch (error) {
    next(error);
  }
});

export default router;