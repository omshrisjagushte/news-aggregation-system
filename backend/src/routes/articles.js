import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get articles' });
});

router.get('/search', (req, res) => {
  res.json({ message: 'Search articles' });
});

router.post('/:id/bookmark', (req, res) => {
  res.json({ message: 'Bookmark article' });
});

export default router;
