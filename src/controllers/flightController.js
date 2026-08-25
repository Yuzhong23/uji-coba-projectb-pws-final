const { getFlights, getFlightDetails } = require('../models/flightModel');

// Mengambil semua data penerbangan (dengan opsi pagination)
const getAllFlights = async (req, res) => {
  const { limit = 10, offset = 0 } = req.query;

  try {
    const { rows, count } = await getFlights(limit, offset);
    res.json({
      message: 'Berhasil mengambil data penerbangan',
      count: count,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// Mengambil detail penerbangan berdasarkan nomor penerbangan
const getFlightByNumber = async (req, res) => {
  const { flightNumber } = req.params;

  try {
    const flight = await getFlightDetails(flightNumber);
    
    if (!flight) {
      return res.status(404).json({ error: 'Penerbangan tidak ditemukan' });
    }

    res.json({
      message: 'Berhasil mengambil detail penerbangan',
      data: flight
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { getAllFlights, getFlightByNumber };
