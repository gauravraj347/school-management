const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./config/db');
const schoolRoutes = require('./routes/schoolRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', schoolRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to School Management API',
    endpoints: {
      addSchool: '/api/addSchool',
      listSchools: '/api/listSchools'
    }
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize the database - but don't wait for it to complete
    // This allows the server to start even if there are database issues
    initDatabase().catch(err => {
      console.warn('Database initialization had an issue, but server will continue:', err.message);
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints:`);
      
      // Use the actual host for deployed environments
      const baseUrl = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${PORT}`;
      console.log(`- Add School: ${baseUrl}/api/addSchool`);
      console.log(`- List Schools: ${baseUrl}/api/listSchools`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    // Don't exit the process, just log the error
    console.log('Attempting to continue despite errors...');
  }
}

startServer();
