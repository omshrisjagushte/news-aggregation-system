import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { RSSFeed } from '../models/RSSFeed.js';
import { Article } from '../models/Article.js';
import { feedValidation, validate } from '../utils/validation.js';
import { updateFeedArticles } from '../services/rssService.js';

const router = express.Router();

// Get all feeds for user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const feeds = await RSSFeed.getByUserId(req.user.id);
    res.json(feeds);
  } catch (error) {
    next(error);
  }
});

// Add new feed
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = validate(feedValidation.create, req.body);
    
    const feed = await RSSFeed.create({
      user_id: req.user.id,
      ...data,
    });

    // Try to fetch articles immediately
    try {
      await updateFeedArticles(feed.id);
    } catch (error) {
      console.error('Error fetching feed articles:', error);
    }

    res.status(201).json(feed);
  } catch (error) {
    next(error);
  }
});

// Update feed
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = validate(feedValidation.update, req.body);
    const feed = await RSSFeed.update(req.params.id, data);
    res.json(feed);
  } catch (error) {
    next(error);
  }
});

// Delete feed
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await RSSFeed.delete(req.params.id);
    res.json({ message: 'Feed deleted' });
  } catch (error) {
    next(error);
  }
});

// Get feed articles
router.get('/:id/articles', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const articles = await Article.getByFeedId(req.params.id, limit, offset);
    res.json({ articles, page, limit });
  } catch (error) {
    next(error);
  }
});

export default router;
