const express = require('express');
const { getAllFlights, getFlightByNumber } = require('../controllers/flightController');
const requireApiKey = require('../middlewares/apiKeyMiddleware');

const router = express.Router();

// Terapkan middleware requireApiKey ke semua rute di file ini
router.use(requireApiKey);

// Endpoint penyedia data
router.get('/', getAllFlights);
router.get('/:flightNumber', getFlightByNumber);

module.exports = router;
