const { pool } = require('../config/db');
const { calculateDistance } = require('../utils/distance');

/**
 * Add a new school to the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;
    
    // Validate input
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required: name, address, latitude, longitude' 
      });
    }
    
    // Validate data types
    if (typeof name !== 'string' || typeof address !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and address must be strings' 
      });
    }
    
    // Validate coordinates
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180' 
      });
    }
    
    // Insert into database
    const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(query, [name, address, lat, lng]);
    
    res.status(201).json({
      success: true,
      message: 'School added successfully',
      data: {
        id: result.insertId,
        name,
        address,
        latitude: lat,
        longitude: lng
      }
    });
  } catch (error) {
    console.error('Error adding school:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

/**
 * List all schools sorted by proximity to user location
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function listSchools(req, res) {
  try {
    const { latitude, longitude } = req.query;
    
    // Validate input
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Latitude and longitude parameters are required' 
      });
    }
    
    // Validate coordinates
    const userLat = parseFloat(latitude);
    const userLng = parseFloat(longitude);
    
    if (isNaN(userLat) || isNaN(userLng) || userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180' 
      });
    }
    
    // Get all schools from database
    const query = 'SELECT id, name, address, latitude, longitude FROM schools';
    const [schools] = await pool.query(query);
    
    // Calculate distance for each school and add it to the school object
    const schoolsWithDistance = schools.map(school => {
      const distance = calculateDistance(
        userLat, 
        userLng, 
        school.latitude, 
        school.longitude
      );
      
      return {
        ...school,
        distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
      };
    });
    
    // Sort schools by distance (closest first)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);
    
    res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      data: schoolsWithDistance
    });
  } catch (error) {
    console.error('Error listing schools:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}

module.exports = {
  addSchool,
  listSchools
};
