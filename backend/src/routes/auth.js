import { authenticate } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { authValidation, validate } from '../utils/validation.js';
import { AppError } from '../middleware/errorHandler.js';
import express from 'express';

const router = express.Router();

// Register
router.post('/register', async (req, res, next) => {
  try {
    const data = validate(authValidation.register, req.body);
    
    const existingUser = await User.findByEmail(data.email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await User.create(data);
    const token = User.generateToken(user.id);
    const refreshToken = User.generateRefreshToken(user.id);

    res.status(201).json({
      user,
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const data = validate(authValidation.login, req.body);
    
    const user = await User.findByEmail(data.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await User.validatePassword(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = User.generateToken(user.id);
    const refreshToken = User.generateRefreshToken(user.id);

    const { password, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
});

// Refresh Token
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    // Token verification would go here
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', authenticate, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
