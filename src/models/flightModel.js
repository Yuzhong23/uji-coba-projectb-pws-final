const { query } = require('../config/db');

const getFlights = async (limit, offset) => {
  const flightsQuery = `
    SELECT 
      f.flight_number,
      f.departure_time,
      f.arrival_time,
      f.status,
      a.name AS airline,
      orig.iata_code AS origin,
      dest.iata_code AS destination
    FROM flights f
    JOIN airlines a ON f.airline_id = a.id
    JOIN airports orig ON f.origin_airport_id = orig.id
    JOIN airports dest ON f.destination_airport_id = dest.id
    ORDER BY f.departure_time DESC
    LIMIT $1 OFFSET $2
  `;
  const result = await query(flightsQuery, [limit, offset]);
  return { rows: result.rows, count: result.rows.length };
};

const getFlightDetails = async (flightNumber) => {
  const flightQuery = `
    SELECT 
      f.flight_number,
      f.departure_time,
      f.arrival_time,
      f.status,
      a.name AS airline,
      orig.name AS origin_airport,
      orig.city AS origin_city,
      dest.name AS destination_airport,
      dest.city AS destination_city
    FROM flights f
    JOIN airlines a ON f.airline_id = a.id
    JOIN airports orig ON f.origin_airport_id = orig.id
    JOIN airports dest ON f.destination_airport_id = dest.id
    WHERE f.flight_number = $1
  `;
  const result = await query(flightQuery, [flightNumber.toUpperCase()]);
  return result.rows[0];
};

module.exports = { getFlights, getFlightDetails };
