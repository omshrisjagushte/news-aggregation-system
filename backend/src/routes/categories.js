import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await global.pool.query(
      'SELECT * FROM categories LIMIT 100'
    );
    
    res.json({ 
      success: true,
      categories: result.rows 
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user.id;
    
    if (!name) {
      throw new AppError('Category name is required', 400);
    }
    
    const result = await global.pool.query(
      'INSERT INTO categories (user_id, name, description, color, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [userId, name, description || '', color || '#000000']
    );
    
    res.status(201).json({ 
      success: true,
      category: result.rows[0] 
    });
  } catch (error) {
    if (error.message.includes('duplicate key')) {
      return next(new AppError('Category name already exists', 409));
    }
    next(error);
  }
});

export default router;