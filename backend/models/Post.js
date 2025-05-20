const db = require('../db');

class Post {
  static async create(propertyData) {
    const {
      owner_id,
      title,
      description,
      address,
      city,
      region,
      price_per_night,
      bedrooms,
      bathrooms,
      max_guests,
      pets_allowed
    } = propertyData;
    
    const query = `
      INSERT INTO properties (
        owner_id,
        title,
        description,
        address,
        city,
        region,
        price_per_night,
        bedrooms,
        bathrooms,
        max_guests,
        pets_allowed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    
    const values = [
      owner_id,
      title,
      description,
      address,
      city,
      region,
      price_per_night,
      bedrooms,
      bathrooms,
      max_guests,
      pets_allowed || false
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  static async findById(id) {
    const query = `
      SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  static async findAll(filters = {}) {
    let query = `
      SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;
    
    // Применяем фильтры
    if (filters.city) {
      query += ` AND LOWER(p.city) = LOWER($${paramCount})`;
      values.push(filters.city);
      paramCount++;
    }
    
    if (filters.region) {
      query += ` AND LOWER(p.region) = LOWER($${paramCount})`;
      values.push(filters.region);
      paramCount++;
    }
    
    if (filters.min_price) {
      query += ` AND p.price_per_night >= $${paramCount}`;
      values.push(filters.min_price);
      paramCount++;
    }
    
    if (filters.max_price) {
      query += ` AND p.price_per_night <= $${paramCount}`;
      values.push(filters.max_price);
      paramCount++;
    }
    
    if (filters.bedrooms) {
      query += ` AND p.bedrooms >= $${paramCount}`;
      values.push(filters.bedrooms);
      paramCount++;
    }
    
    if (filters.max_guests) {
      query += ` AND p.max_guests >= $${paramCount}`;
      values.push(filters.max_guests);
      paramCount++;
    }
    
    if (filters.pets_allowed === 'true') {
      query += ` AND p.pets_allowed = true`;
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    const result = await db.query(query, values);
    return result.rows;
  }
  
  static async update(id, propertyData) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    // Динамически формируем SET-часть запроса на основе предоставленных полей
    for (const [key, value] of Object.entries(propertyData)) {
      if (key !== 'id' && key !== 'owner_id' && key !== 'created_at') {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    }
    
    // Добавляем метку времени обновления
    updateFields.push(`updated_at = NOW()`);
    
    // Добавляем ID объявления как последний параметр
    values.push(id);
    
    const query = `
      UPDATE properties
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  static async delete(id) {
    const query = 'DELETE FROM properties WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
  
  static async search(params) {
    const {
      location,
      check_in,
      check_out,
      guests,
      rooms,
      adults,
      children,
      pets
    } = params;
    
    let query = `
      SELECT p.*, u.first_name as owner_first_name, u.last_name as owner_last_name
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 1;
    
    // Поиск по местоположению
    if (location) {
      query += ` AND (
        LOWER(p.city) LIKE LOWER($${paramCount}) OR
        LOWER(p.region) LIKE LOWER($${paramCount}) OR
        LOWER(p.address) LIKE LOWER($${paramCount})
      )`;
      values.push(`%${location}%`);
      paramCount++;
    }
    
    // Проверка доступности на даты
    if (check_in && check_out) {
      query += ` AND p.id NOT IN (
        SELECT property_id FROM bookings
        WHERE (check_in_date <= $${paramCount} AND check_out_date >= $${paramCount+1})
        OR (check_in_date >= $${paramCount} AND check_in_date <= $${paramCount+1})
      )`;
      values.push(check_out, check_in);
      paramCount += 2;
    }
    
    // Фильтр по вместимости
    if (guests) {
      query += ` AND p.max_guests >= $${paramCount}`;
      values.push(parseInt(guests));
      paramCount++;
    }
    
    // Фильтр по количеству комнат
    if (rooms) {
      query += ` AND p.bedrooms >= $${paramCount}`;
      values.push(parseInt(rooms));
      paramCount++;
    }
    
    // Фильтр по возможности с питомцами
    if (pets === 'true') {
      query += ` AND p.pets_allowed = true`;
    }
    
    query += ` ORDER BY p.created_at DESC`;
    
    const result = await db.query(query, values);
    return result.rows;
  }
  
  static async addReview(reviewData) {
    const {
      property_id,
      user_id,
      booking_id,
      rating,
      comment,
      improvement_suggestions
    } = reviewData;
    
    const query = `
      INSERT INTO reviews (
        property_id,
        user_id,
        booking_id,
        rating,
        comment,
        improvement_suggestions
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      property_id,
      user_id,
      booking_id || null,
      rating,
      comment,
      improvement_suggestions || null
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  static async getReviews(propertyId) {
    const query = `
      SELECT r.*, u.first_name, u.last_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.property_id = $1
      ORDER BY r.created_at DESC
    `;
    
    const result = await db.query(query, [propertyId]);
    return result.rows;
  }
  
  static async createBooking(bookingData) {
    const {
      property_id,
      user_id,
      check_in_date,
      check_out_date,
      number_of_guests,
      adults,
      children,
      with_pets,
      total_price
    } = bookingData;
    
    const query = `
      INSERT INTO bookings (
        property_id,
        user_id,
        check_in_date,
        check_out_date,
        number_of_guests,
        adults,
        children,
        with_pets,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    
    const values = [
      property_id,
      user_id,
      check_in_date,
      check_out_date,
      number_of_guests,
      adults || 1,
      children || 0,
      with_pets || false,
      total_price,
      'pending' // Начальный статус
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }
  
  static async checkAvailability(propertyId, checkIn, checkOut) {
    const query = `
      SELECT COUNT(*) FROM bookings
      WHERE property_id = $1
      AND status NOT IN ('canceled')
      AND (
        (check_in_date <= $2 AND check_out_date >= $3)
        OR (check_in_date >= $3 AND check_in_date <= $2)
      )
    `;
    
    const result = await db.query(query, [propertyId, checkOut, checkIn]);
    return parseInt(result.rows[0].count) === 0;
  }
}

module.exports = Post;