import { AppError } from './errorHandler.js';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }
    
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId, email] = decoded.split(':');
      
      if (!userId || !email) {
        throw new AppError('Invalid token format', 401);
      }
      
      req.user = { id: parseInt(userId), email };
      next();
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error, value } = schema.validate(req.body);
      
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }
      
      req.validatedData = value;
      next();
    } catch (err) {
      next(err);
    }
  };
};