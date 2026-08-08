import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get categories' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create category' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update category' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete category' });
});

export default router;
