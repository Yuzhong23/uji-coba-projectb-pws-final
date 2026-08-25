require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
 
const app = express();
const PORT = process.env.PORT || 3000;
 
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
 
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
 
// Test route
app.get('/', (req, res) => {
  res.json({ message: '🚀 Welcome to Flight & Aviation Tracking API' });
});
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 