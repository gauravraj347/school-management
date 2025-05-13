const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 60000, // Longer timeout for remote connections
  ssl: process.env.DB_SSL === 'true' ? true : undefined
});

// Function to initialize the database and create tables if they don't exist
async function initDatabase() {
  let connection;
  try {
    console.log('Attempting to connect to database...');
    // For db4free.net, we should connect directly to the database
    // instead of trying to create it (which requires additional privileges)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 60000, // Longer timeout for remote connections
      ssl: process.env.DB_SSL === 'true' ? true : undefined
    });
    
    console.log('Successfully connected to database');
    
    // Create the schools table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createTableQuery);
    await connection.end();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    if (connection) await connection.end().catch(err => console.error('Error closing connection:', err));
    
    // Don't throw the error, just log it and continue
    // This allows the app to start even if DB connection fails initially
    console.log('Will retry database connection when needed');
  }
}

module.exports = { pool, initDatabase };
