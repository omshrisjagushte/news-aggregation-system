import { query } from '../config/database.js';

export class Bookmark {
  static async create(userId, articleId) {
    const result = await query(
      `INSERT INTO bookmarks (user_id, article_id, bookmarked_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (user_id, article_id) DO NOTHING
       RETURNING *`,
      [userId, articleId]
    );
    
    return result.rows[0];
  }

  static async getByUserId(userId, limit = 20, offset = 0) {
    const result = await query(
      `SELECT a.* FROM bookmarks b
       JOIN articles a ON b.article_id = a.id
       WHERE b.user_id = $1
       ORDER BY b.bookmarked_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async delete(userId, articleId) {
    await query(
      'DELETE FROM bookmarks WHERE user_id = $1 AND article_id = $2',
      [userId, articleId]
    );
  }

  static async markAsRead(userId, articleId) {
    const result = await query(
      `UPDATE bookmarks SET read = true, read_at = NOW()
       WHERE user_id = $1 AND article_id = $2
       RETURNING *`,
      [userId, articleId]
    );
    
    return result.rows[0];
  }
}
