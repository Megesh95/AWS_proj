const db = require('../config/db');

const getAllProducts = async () => {
  const [rows] = await db.execute('SELECT * FROM products');
  return rows;
};

const getProductById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

module.exports = {
  getAllProducts,
  getProductById
};

