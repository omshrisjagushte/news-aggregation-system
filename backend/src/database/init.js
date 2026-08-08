import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    console.log('📊 Initializing database...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await client.query(schema);
    
    console.log('✅ Database tables created successfully');
    
    // Check if we have any users, if not create a demo user
    const usersResult = await client.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(usersResult.rows[0].count);
    
    if (userCount === 0) {
      console.log('🌱 Creating demo user...');
      const demoUser = await client.query(
        `INSERT INTO users (email, username, password, theme) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        ['demo@example.com', 'demo', 'hashed_password_demo', 'light']
      );
      console.log('✅ Demo user created with ID:', demoUser.rows[0].id);
    }
    
    return true;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Tables already exist');
      return true;
    }
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};
