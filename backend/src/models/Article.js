import { query } from '../config/database.js';

export class Article {
  static async create(articleData) {
    const { feed_id, title, description, content, author, image_url, source_url, published_at } = articleData;
    
    try {
      const result = await query(
        `INSERT INTO articles (feed_id, title, description, content, author, image_url, source_url, published_at, fetched_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         ON CONFLICT (source_url) DO UPDATE SET updated_at = NOW()
         RETURNING *`,
        [feed_id, title, description, content, author, image_url, source_url, published_at]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  }

  static async getByFeedId(feedId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM articles WHERE feed_id = $1 ORDER BY published_at DESC LIMIT $2 OFFSET $3`,
      [feedId, limit, offset]
    );
    return result.rows;
  }

  static async search(userId, searchTerm, limit = 20, offset = 0) {
    const result = await query(
      `SELECT DISTINCT a.* FROM articles a
       JOIN rss_feeds f ON a.feed_id = f.id
       WHERE f.user_id = $1 AND (a.title ILIKE $2 OR a.description ILIKE $2 OR a.content ILIKE $2)
       ORDER BY a.published_at DESC LIMIT $3 OFFSET $4`,
      [userId, `%${searchTerm}%`, limit, offset]
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM articles WHERE id = $1', [id]);
    return result.rows[0];
  }
}
