const express = require('express');
const { addSchool, listSchools } = require('../controllers/schoolController');

const router = express.Router();

// Route to add a new school
router.post('/addSchool', addSchool);

// Route to list schools sorted by proximity
router.get('/listSchools', listSchools);

module.exports = router;
