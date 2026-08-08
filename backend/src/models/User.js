import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export class User {
  static async create(userData) {
    const { email, username, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    try {
      const result = await query(
        `INSERT INTO users (email, username, password, created_at) 
         VALUES ($1, $2, $3, NOW()) 
         RETURNING id, email, username, created_at`,
        [email, username, hashedPassword]
      );
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email or username already exists');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, email, username, avatar_url, bio, theme, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async validatePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  static generateRefreshToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
  }
}
