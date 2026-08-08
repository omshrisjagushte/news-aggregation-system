import express from 'express';
import { AppError } from '../middleware/errorHandler.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      throw new AppError('Email, username, and password are required', 400);
    }
    
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400);
    }
    
    // Check if user exists
    const userExists = await global.pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (userExists.rows.length > 0) {
      throw new AppError('Email or username already exists', 409);
    }
    
    // Create user
    const result = await global.pool.query(
      'INSERT INTO users (email, username, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, email, username',
      [email, username, password]
    );
    
    const token = Buffer.from(`${result.rows[0].id}:${email}`).toString('base64');
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: result.rows[0],
      token
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    
    const result = await global.pool.query(
      'SELECT id, email, username FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );
    
    if (result.rows.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }
    
    const token = Buffer.from(`${result.rows[0].id}:${email}`).toString('base64');
    
    res.json({
      success: true,
      message: 'Login successful',
      user: result.rows[0],
      token
    });
  } catch (error) {
    next(error);
  }
});

export default router;