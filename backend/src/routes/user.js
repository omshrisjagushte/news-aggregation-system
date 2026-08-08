import express from 'express';

const router = express.Router();

router.get('/profile', (req, res) => {
  res.json({ message: 'Get user profile' });
});

router.put('/profile', (req, res) => {
  res.json({ message: 'Update user profile' });
});

router.get('/statistics', (req, res) => {
  res.json({ message: 'Get reading statistics' });
});

export default router;
