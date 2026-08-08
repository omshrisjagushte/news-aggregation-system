import { query } from '../config/database.js';

export class RSSFeed {
  static async create(feedData) {
    const { user_id, title, url, description, image_url, category_id } = feedData;
    
    const result = await query(
      `INSERT INTO rss_feeds (user_id, title, url, description, image_url, category_id, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [user_id, title, url, description, image_url, category_id]
    );
    
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const result = await query(
      `SELECT * FROM rss_feeds WHERE user_id = $1 AND active = true ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await query('SELECT * FROM rss_feeds WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { title, description, image_url, category_id, active } = updateData;
    
    const result = await query(
      `UPDATE rss_feeds SET title = $1, description = $2, image_url = $3, category_id = $4, active = $5, updated_at = NOW()
       WHERE id = $6 RETURNING *`,
      [title, description, image_url, category_id, active, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    await query('DELETE FROM rss_feeds WHERE id = $1', [id]);
  }

  static async updateLastFetched(id) {
    await query('UPDATE rss_feeds SET last_fetched = NOW() WHERE id = $1', [id]);
  }

  static async getStaleFeeds() {
    const result = await query(
      `SELECT * FROM rss_feeds WHERE active = true AND (last_fetched IS NULL OR last_fetched < NOW() - INTERVAL '1 hour')`
    );
    return result.rows;
  }
}
