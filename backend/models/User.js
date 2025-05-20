const db = require('../db');
const bcrypt = require('bcrypt');

class User {
  static async create(userData) {
    const { email, phone, first_name, last_name, password, role } = userData;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const query = `
      INSERT INTO users (email, phone, first_name, last_name, password, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, phone, first_name, last_name, role, created_at
    `;
    
    const values = [email, phone, first_name, last_name, hashedPassword, role || 'guest'];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint.includes('email')) {
          throw new Error('Email already registered');
        } else if (error.constraint.includes('phone')) {
          throw new Error('Phone number already registered');
        }
      }
      throw error;
    }
  }
  
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }
  
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await db.query(query, [phone]);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = 'SELECT id, email, phone, first_name, last_name, role, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  static async comparePasswords(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;