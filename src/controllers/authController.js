const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { getUserByEmail, createUser } = require('../models/userModel');
const { createApiKey } = require('../models/apiKeyModel');

// Registrasi User
const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createUser(email, passwordHash);

    res.status(201).json({ message: 'Registrasi berhasil', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Email tidak ditemukan' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Password salah' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login berhasil', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// Generate API Key
const generateApiKey = async (req, res) => {
  const userId = req.user.id;
  const randomHex = crypto.randomBytes(16).toString('hex');
  const apiKey = `sk_live_${randomHex}`;

  try {
    const newKey = await createApiKey(userId, apiKey);
    res.status(201).json({ message: 'API Key berhasil dibuat', data: newKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = { register, login, generateApiKey };
