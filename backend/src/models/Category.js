import { query } from '../config/database.js';

export class Category {
  static async create(categoryData) {
    const { user_id, name, description, color, icon } = categoryData;
    
    const result = await query(
      `INSERT INTO categories (user_id, name, description, color, icon, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [user_id, name, description, color, icon]
    );
    
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const result = await query(
      `SELECT * FROM categories WHERE user_id = $1 ORDER BY display_order, name`,
      [userId]
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { name, description, color, icon } = updateData;
    
    const result = await query(
      `UPDATE categories SET name = $1, description = $2, color = $3, icon = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [name, description, color, icon, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    await query('DELETE FROM categories WHERE id = $1', [id]);
  }
}
