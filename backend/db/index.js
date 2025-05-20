const { Pool } = require('pg');
const { dbConfig } = require('../config/dbSettings');
require('dotenv').config();

const pool = new Pool(dbConfig);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: async () => {
    const client = await pool.connect();
    return {
      client,
      release: () => client.release()
    };
  }
};