const db = require('../db');
const Post = require('../models/Post');

class PostService {
  async createProperty(propertyData) {
    return await Post.create(propertyData);
  }
  
  async getAllProperties(filters) {
    return await Post.findAll(filters);
  }
  
  async getPropertyById(id) {
    return await Post.findById(id);
  }
  
  async updateProperty(id, propertyData) {
    return await Post.update(id, propertyData);
  }
  
  async deleteProperty(id) {
    return await Post.delete(id);
  }
  
  async searchProperties(searchParams) {
    return await Post.search(searchParams);
  }
  
  async addReview(reviewData) {
    return await Post.addReview(reviewData);
  }
  
  async getPropertyReviews(propertyId) {
    return await Post.getReviews(propertyId);
  }
  
  async createBooking(bookingData) {
    return await Post.createBooking(bookingData);
  }
  
  async checkAvailability(propertyId, checkIn, checkOut) {
    return await Post.checkAvailability(propertyId, checkIn, checkOut);
  }
  
  async checkUserBooking(userId, propertyId) {
    const query = `
      SELECT COUNT(*) FROM bookings
      WHERE user_id = $1 AND property_id = $2 AND status = 'completed'
    `;
    
    const result = await db.query(query, [userId, propertyId]);
    return parseInt(result.rows[0].count) > 0;
  }
  
  async createEvent(eventData) {
    const {
      title,
      description,
      region,
      city,
      start_date,
      end_date,
      image_url,
      event_type
    } = eventData;
    
    const query = `
      INSERT INTO events (
        title,
        description,
        region,
        city,
        start_date,
        end_date,
        image_url,
        event_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const values = [
      title,
      description,
      region,
      city,
      start_date,
      end_date,
      image_url,
      event_type || 'other'
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  async getAllEvents() {
    const query = `
      SELECT *
      FROM events
      ORDER BY start_date ASC
      `;
      const result = await db.query(query);
    return result.rows;
  }
  async getEventsByRegion(region) {
    const query = `
      SELECT *
      FROM events
      WHERE LOWER(region) = LOWER($1)
      ORDER BY start_date ASC
    `;
    
    const result = await db.query(query, [region]);
    return result.rows;
  }
  
  async getEventById(id) {
    const query = `
      SELECT *
      FROM events
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  async updateEvent(id, eventData) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    for (const [key, value] of Object.entries(eventData)) {
      if (key !== 'id' && key !== 'created_at') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
    
    values.push(id);
    
    const query = `
      UPDATE events
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  async deleteEvent(id) {
    const query = 'DELETE FROM events WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  async getUpcomingEvents(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT *
      FROM events
      WHERE end_date >= $1
      ORDER BY start_date ASC
      LIMIT $2
    `;
    
    const result = await db.query(query, [today, limit]);
    return result.rows;
  }
}

module.exports = new PostService();