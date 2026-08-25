const { getApiKeyDetails } = require('../models/apiKeyModel');

const requireApiKey = async (req, res, next) => {
  // Cek API Key di Header
  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({ error: 'Akses ditolak. API Key tidak disertakan di header x-api-key' });
  }

  try {
    // Validasi API Key ke database menggunakan Model
    const keyData = await getApiKeyDetails(apiKey);

    if (!keyData) {
      return res.status(401).json({ error: 'API Key tidak valid' });
    }

    if (!keyData.is_active) {
      return res.status(403).json({ error: 'API Key sudah dinonaktifkan' });
    }

    // Jika valid, lanjutkan ke controller
    req.apiUserId = keyData.user_id;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan saat memvalidasi API Key' });
  }
};

module.exports = requireApiKey;
