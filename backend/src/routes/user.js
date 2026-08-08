import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Bookmark } from '../models/Bookmark.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Get bookmarks
router.get('/bookmarks', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const bookmarks = await Bookmark.getByUserId(req.user.id, limit, offset);
    res.json({ bookmarks, page, limit });
  } catch (error) {
    next(error);
  }
});

// Get reading statistics
router.get('/statistics', authenticate, async (req, res, next) => {
  try {
    res.json({
      totalBookmarks: 0,
      totalRead: 0,
      averageReadTime: 0,
      readingStreak: 0,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
