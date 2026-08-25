const { pool } = require('../config/db');
const { faker } = require('@faker-js/faker');

const seedDB = async () => {
  try {
    console.log('🌱 Memulai proses seeding database...');

    // 1. Membersihkan data lama
    await pool.query('DELETE FROM flights');
    await pool.query('DELETE FROM airports');
    await pool.query('DELETE FROM airlines');
    console.log('🗑️  Data lama berhasil dihapus.');

    // 2. Seeding Airlines (10 Maskapai)
    const airlines = [];
    for (let i = 0; i < 10; i++) {
      const code = faker.airline.airline().iataCode;
      const res = await pool.query(
        'INSERT INTO airlines (iata_code, name, callsign) VALUES ($1, $2, $3) ON CONFLICT (iata_code) DO NOTHING RETURNING id',
        [code, faker.company.name() + ' Airlines', faker.word.noun().toUpperCase()]
      );
      if (res.rows.length > 0) airlines.push(res.rows[0].id);
    }
    console.log(`✈️  Berhasil memasukkan ${airlines.length} maskapai.`);

    // 3. Seeding Airports (20 Bandara)
    const airports = [];
    for (let i = 0; i < 20; i++) {
      const code = faker.airline.airport().iataCode;
      const res = await pool.query(
        'INSERT INTO airports (iata_code, name, city, country) VALUES ($1, $2, $3, $4) ON CONFLICT (iata_code) DO NOTHING RETURNING id',
        [code, faker.airline.airport().name, faker.location.city(), faker.location.country()]
      );
      if (res.rows.length > 0) airports.push(res.rows[0].id);
    }
    console.log(`🏢 Berhasil memasukkan ${airports.length} bandara.`);

    // 4. Seeding Flights (60 Penerbangan)
    // Syarat tugas: Minimal 50 baris data kompleks
    let flightsCount = 0;
    for (let i = 0; i < 60; i++) {
      // Pilih maskapai, asal, dan tujuan secara acak
      const airlineId = faker.helpers.arrayElement(airlines);
      const originId = faker.helpers.arrayElement(airports);
      let destId = faker.helpers.arrayElement(airports);
      
      // Pastikan tujuan tidak sama dengan asal
      while (destId === originId) {
        destId = faker.helpers.arrayElement(airports);
      }

      const flightNumber = faker.airline.flightNumber();
      const departureTime = faker.date.soon({ days: 5 });
      const arrivalTime = new Date(departureTime.getTime() + faker.number.int({ min: 60, max: 720 }) * 60000); // 1-12 jam kemudian
      const status = faker.helpers.arrayElement(['Scheduled', 'Active', 'Landed', 'Delayed']);

      await pool.query(
        'INSERT INTO flights (airline_id, flight_number, origin_airport_id, destination_airport_id, departure_time, arrival_time, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [airlineId, flightNumber, originId, destId, departureTime, arrivalTime, status]
      );
      flightsCount++;
    }
    console.log(`🛫 Berhasil memasukkan ${flightsCount} jadwal penerbangan.`);
    console.log('✅ Seeding database selesai!');
    
  } catch (error) {
    console.error('❌ Gagal melakukan seeding:', error);
  } finally {
    pool.end();
  }
};

seedDB();
