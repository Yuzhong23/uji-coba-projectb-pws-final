const { query } = require('../config/db');

const createApiKey = async (userId, apiKey) => {
  const result = await query(
    'INSERT INTO api_keys (user_id, api_key) VALUES ($1, $2) RETURNING api_key, created_at',
    [userId, apiKey]
  );
  return result.rows[0];
};

const getApiKeyDetails = async (apiKey) => {
  const result = await query(
    'SELECT user_id, is_active FROM api_keys WHERE api_key = $1',
    [apiKey]
  );
  return result.rows[0];
};

module.exports = { createApiKey, getApiKeyDetails };
