const db = require('../models');
const { faker } = require('@faker-js/faker');

const seedDB = async () => {
  try {
    console.log('🌱 Memulai proses seeding database dengan Sequelize...');

    // Pastikan database sinkron dan bersih
    await db.sequelize.sync({ force: true });
    console.log('🗑️  Database berhasil di-reset.');

    // 2. Seeding Airlines (10 Maskapai)
    const airlinesData = [];
    for (let i = 0; i < 10; i++) {
      airlinesData.push({
        iata_code: faker.airline.airline().iataCode,
        name: faker.company.name() + ' Airlines',
        callsign: faker.word.noun().toUpperCase()
      });
    }
    const airlines = await db.Airline.bulkCreate(airlinesData, { ignoreDuplicates: true, returning: true });
    console.log(`✈️  Berhasil memasukkan ${airlines.length} maskapai.`);

    // 3. Seeding Airports (20 Bandara)
    const airportsData = [];
    for (let i = 0; i < 20; i++) {
      airportsData.push({
        iata_code: faker.airline.airport().iataCode,
        name: faker.airline.airport().name,
        city: faker.location.city(),
        country: faker.location.country()
      });
    }
    const airports = await db.Airport.bulkCreate(airportsData, { ignoreDuplicates: true, returning: true });
    console.log(`🏢 Berhasil memasukkan ${airports.length} bandara.`);

    // 4. Seeding Flights (60 Penerbangan)
    const flightsData = [];
    for (let i = 0; i < 60; i++) {
      const airline = faker.helpers.arrayElement(airlines);
      const origin = faker.helpers.arrayElement(airports);
      let dest = faker.helpers.arrayElement(airports);
      
      while (dest.id === origin.id) {
        dest = faker.helpers.arrayElement(airports);
      }

      const departureTime = faker.date.soon({ days: 5 });
      const arrivalTime = new Date(departureTime.getTime() + faker.number.int({ min: 60, max: 720 }) * 60000);

      flightsData.push({
        airline_id: airline.id,
        flight_number: faker.airline.flightNumber(),
        origin_airport_id: origin.id,
        destination_airport_id: dest.id,
        departure_time: departureTime,
        arrival_time: arrivalTime,
        status: faker.helpers.arrayElement(['Scheduled', 'Active', 'Landed', 'Delayed'])
      });
    }
    await db.Flight.bulkCreate(flightsData);
    console.log(`🛫 Berhasil memasukkan ${flightsData.length} jadwal penerbangan.`);
    console.log('✅ Seeding database selesai!');
    
  } catch (error) {
    console.error('❌ Gagal melakukan seeding:', error);
  } finally {
    await db.sequelize.close();
  }
};

seedDB();
