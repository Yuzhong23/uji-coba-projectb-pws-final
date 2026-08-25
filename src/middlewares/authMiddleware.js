const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Akses ditolak, token tidak ditemukan di header' });

  try {
    // Menghapus kata "Bearer " jika disertakan
    const cleanToken = token.replace('Bearer ', '');
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    
    // Menyimpan payload JWT ke request object
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token tidak valid atau sudah kedaluwarsa' });
  }
};

module.exports = verifyToken;
