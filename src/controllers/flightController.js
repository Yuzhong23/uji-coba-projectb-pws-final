const { Flight, Airline, Airport } = require('../models');

const getAllFlights = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  try {
    const flights = await Flight.findAndCountAll({
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      order: [['departure_time', 'DESC']],
      include: [
        { model: Airline, as: 'airline', attributes: ['name'] },
        { model: Airport, as: 'origin', attributes: ['iata_code'] },
        { model: Airport, as: 'destination', attributes: ['iata_code'] }
      ]
    });

    const data = flights.rows.map(f => ({
      flight_number: f.flight_number,
      departure_time: f.departure_time,
      arrival_time: f.arrival_time,
      status: f.status,
      airline: f.airline ? f.airline.name : null,
      origin: f.origin ? f.origin.iata_code : null,
      destination: f.destination ? f.destination.iata_code : null
    }));

    res.json({
      message: 'Berhasil mengambil data penerbangan',
      count: flights.count,
      data: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

const getFlightByNumber = async (req, res) => {
  const { flightNumber } = req.params;

  try {
    const flight = await Flight.findOne({
      where: { flight_number: flightNumber.toUpperCase() },
      include: [
        { model: Airline, as: 'airline', attributes: ['name'] },
        { model: Airport, as: 'origin', attributes: ['name', 'city'] },
        { model: Airport, as: 'destination', attributes: ['name', 'city'] }
      ]
    });
    
    if (!flight) {
      return res.status(404).json({ error: 'Penerbangan tidak ditemukan' });
    }

    const data = {
      flight_number: flight.flight_number,
      departure_time: flight.departure_time,
      arrival_time: flight.arrival_time,
      status: flight.status,
      airline: flight.airline ? flight.airline.name : null,
      origin_airport: flight.origin ? flight.origin.name : null,
      origin_city: flight.origin ? flight.origin.city : null,
      destination_airport: flight.destination ? flight.destination.name : null,
      destination_city: flight.destination ? flight.destination.city : null
    };

    res.json({
      message: 'Berhasil mengambil detail penerbangan',
      data: data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { getAllFlights, getFlightByNumber };
