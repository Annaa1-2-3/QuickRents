const { Pool } = require('pg');
const { dbConfig } = require('../config/dbSettings');

const createTables = async (pool) => {
  // Create users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE,
      phone VARCHAR(20) UNIQUE,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) CHECK (role IN ('owner', 'tenant', 'admin', 'guest')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create properties table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id SERIAL PRIMARY KEY,
      owner_id INTEGER REFERENCES users(id),
      title VARCHAR(200) NOT NULL,
      description TEXT,
      address VARCHAR(255) NOT NULL,
      city VARCHAR(100) NOT NULL,
      region VARCHAR(100) NOT NULL,
      price_per_night DECIMAL(10, 2) NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      max_guests INTEGER NOT NULL,
      pets_allowed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create property_images table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS property_images (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      image_url VARCHAR(255) NOT NULL,
      is_primary BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create bookings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      check_in_date DATE NOT NULL,
      check_out_date DATE NOT NULL,
      number_of_guests INTEGER NOT NULL,
      adults INTEGER NOT NULL,
      children INTEGER NOT NULL,
      with_pets BOOLEAN DEFAULT FALSE,
      total_price DECIMAL(10, 2) NOT NULL,
      status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'canceled', 'completed')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create reviews table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
      rating INTEGER CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      improvement_suggestions TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create events table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      region VARCHAR(100) NOT NULL,
      city VARCHAR(100) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      image_url VARCHAR(255),
      event_type VARCHAR(50) CHECK (event_type IN ('festival', 'fair', 'concert', 'other')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('All tables created successfully');
};

const setup = async () => {
  const pool = new Pool(dbConfig);
  
  try {
    await createTables(pool);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
  
  return pool;
};

module.exports = { setup };