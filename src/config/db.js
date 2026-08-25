const { Pool } = require('pg');
require('dotenv').config({ override: true });
 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
 
pool.on('connect', () => {
  console.log('✅ Terhubung ke database PostgreSQL');
});
 
pool.on('error', (err) => {
  console.error('❌ Terjadi kesalahan pada koneksi database:', err);
});
 
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
 