const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

/**
 * MySQL connection pool for AWS RDS / local MySQL.
 * Using a pool is production-friendly and efficient.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promisified pool for async/await usage.
const db = pool.promise();

module.exports = db;

