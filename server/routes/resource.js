const express = require('express');
const router = express.Router()
const resourceController = require('../controllers/ResourceController')
const authenticateToken = require('../middleware/auth');

// Route to display the search form
router.get('/resources', resourceController.getSearchPage);

// Route to handle the form submission and display therapists
router.get('/search', resourceController.searchTherapists);

module.exports = router;