const { pool } = require('../config/db');

const initFlightDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS airports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        iata_code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(255),
        country VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS airlines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        iata_code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        callsign VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS flights (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        airline_id UUID REFERENCES airlines(id) ON DELETE CASCADE,
        flight_number VARCHAR(50) NOT NULL,
        origin_airport_id UUID REFERENCES airports(id) ON DELETE CASCADE,
        destination_airport_id UUID REFERENCES airports(id) ON DELETE CASCADE,
        departure_time TIMESTAMP NOT NULL,
        arrival_time TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'Scheduled'
      );
    `);
    console.log('✅ Tabel airports, airlines, dan flights berhasil dibuat!');
  } catch (error) {
    console.error('❌ Gagal membuat tabel:', error);
  } finally {
    pool.end();
  }
};

initFlightDB();
