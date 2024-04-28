const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, homeController.getHomePage);

router.post('/mood', authenticateToken, homeController.postMood);

router.get('/graph', authenticateToken, homeController.getMoodDataForGraph);

module.exports = router;
