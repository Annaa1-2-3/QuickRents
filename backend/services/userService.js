const db = require('../db');
const bcrypt = require('bcrypt');

class UserService {
  async getAllUsers() {
    const query = `
      SELECT id, email, phone, first_name, last_name, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `;
    
    const result = await db.query(query);
    return result.rows;
  }
  
  async getUserById(id) {
    const query = `
      SELECT id, email, phone, first_name, last_name, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  async updateUser(id, userData) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    for (const [key, value] of Object.entries(userData)) {
      if (key !== 'id' && key !== 'created_at') {
        if (key === 'password') {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(value, salt);
          updateFields.push(`password = $${paramCount}`);
          values.push(hashedPassword);
        } else {
          updateFields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    }
    
    updateFields.push(`updated_at = NOW()`);
    
    values.push(id);
    
    const query = `
      UPDATE users
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, phone, first_name, last_name, role, created_at, updated_at
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  async deleteUser(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  async getUserBookings(userId) {
    const query = `
      SELECT b.*, p.title, p.address, p.city, p.region, p.price_per_night,
             u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON p.owner_id = u.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }
  
  async getUserReviews(userId) {
    const query = `
      SELECT r.*, p.title, p.address, p.city
      FROM reviews r
      JOIN properties p ON r.property_id = p.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `;
    
    const result = await db.query(query, [userId]);
    return result.rows;
  }
  
  async getOwnerProperties(ownerId) {
    const query = `
      SELECT p.*
      FROM properties p
      WHERE p.owner_id = $1
      ORDER BY p.created_at DESC
    `;
    
    const result = await db.query(query, [ownerId]);
    return result.rows;
  }
  
  async getOwnerBookings(ownerId) {
    const query = `
      SELECT b.*, p.title, p.address, p.city,
             u.first_name as tenant_first_name, u.last_name as tenant_last_name,
             u.phone as tenant_phone, u.email as tenant_email
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE p.owner_id = $1
      ORDER BY b.check_in_date ASC
    `;
    
    const result = await db.query(query, [ownerId]);
    return result.rows;
  }
  
  async updateBookingStatus(bookingId, status, userId) {
    const checkQuery = `
      SELECT b.id, p.owner_id
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.id = $1
    `;
    
    const checkResult = await db.query(checkQuery, [bookingId]);
    
    if (checkResult.rows.length === 0) {
      throw new Error('Бронирование не найдено');
    }
    
    const booking = checkResult.rows[0];
    
    if (booking.owner_id !== userId) {
      throw new Error('Нет прав на изменение статуса этого бронирования');
    }
    
    const updateQuery = `
      UPDATE bookings
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await db.query(updateQuery, [status, bookingId]);
    return result.rows[0];
  }
}

module.exports = new UserService();