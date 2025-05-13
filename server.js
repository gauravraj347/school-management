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
    // Initialize the database
    await initDatabase();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints:`);
      console.log(`- Add School: http://localhost:${PORT}/api/addSchool`);
      console.log(`- List Schools: http://localhost:${PORT}/api/listSchools`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
