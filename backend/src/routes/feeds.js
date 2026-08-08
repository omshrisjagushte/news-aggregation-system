import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get feeds' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Add new feed' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete feed' });
});

export default router;
