require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const flightRoutes = require('./src/routes/flightRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static frontend files

// Vercel Serverless Database Connection Logic (seperti di referensi Anda)
let databaseReady = false;
let databasePromise = null;

app.use(async (req, res, next) => {
  try {
    if (!databaseReady) {
      if (!databasePromise) {
        databasePromise = db.sequelize.authenticate();
      }
      await databasePromise;
      databaseReady = true;
      console.log('✅ Sequelize: Terkoneksi ke Database (Serverless)');
    }
    next();
  } catch (error) {
    console.error('❌ Gagal terkoneksi ke database:', error);
    res.status(500).json({ error: 'Database Connection Error' });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);

// Ekspor app untuk Vercel Serverless
module.exports = app;

// Jalankan server lokal jika tidak berjalan di Vercel
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  // Sync database saat jalan lokal
  db.sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running locally on http://localhost:${PORT}`);
    });
  });
}
