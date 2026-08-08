import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { Article } from '../models/Article.js';
import { Bookmark } from '../models/Bookmark.js';

const router = express.Router();

// Get articles (paginated)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    res.json({ message: 'Get articles', page, limit });
  } catch (error) {
    next(error);
  }
});

// Search articles
router.get('/search', authenticate, async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const offset = (page - 1) * limit;
    const results = await Article.search(req.user.id, q, limit, offset);

    res.json({
      query: q,
      results,
      page,
      limit,
    });
  } catch (error) {
    next(error);
  }
});

// Get article by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const article = await Article.getById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    next(error);
  }
});

// Bookmark article
router.post('/:id/bookmark', authenticate, async (req, res, next) => {
  try {
    const bookmark = await Bookmark.create(req.user.id, req.params.id);
    res.status(201).json({ message: 'Article bookmarked', bookmark });
  } catch (error) {
    next(error);
  }
});

// Remove bookmark
router.delete('/:id/bookmark', authenticate, async (req, res, next) => {
  try {
    await Bookmark.delete(req.user.id, req.params.id);
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
