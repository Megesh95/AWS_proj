const db = require('../config/db');

/**
 * User model encapsulates database operations for the users table.
 */

const createUser = async ({ name, email, passwordHash, role = 'customer' }) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return { id: result.insertId, name, email, role };
};

const findUserByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const findUserById = async (id) => {
  const [rows] = await db.execute(
    'SELECT id, name, email, role, created_at FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};

