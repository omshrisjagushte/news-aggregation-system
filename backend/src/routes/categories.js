import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { Category } from '../models/Category.js';
import { categoryValidation, validate } from '../utils/validation.js';

const router = express.Router();

// Get all categories
router.get('/', authenticate, async (req, res, next) => {
  try {
    const categories = await Category.getByUserId(req.user.id);
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Create category
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = validate(categoryValidation.create, req.body);
    const category = await Category.create({
      user_id: req.user.id,
      ...data,
    });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// Update category
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const data = validate(categoryValidation.create, req.body);
    const category = await Category.update(req.params.id, data);
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// Delete category
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await Category.delete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
