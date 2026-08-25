const express = require('express');
const { register, login, generateApiKey } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/generate-key', verifyToken, generateApiKey);

module.exports = router;
