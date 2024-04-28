const express = require('express');
const router = express.Router()
const journalControler = require('../controllers/JournalController')
const authenticateToken = require('../middleware/auth');

router.get('/journal/create', journalControler.getCreatePage);
router.get('/journals', journalControler.getJournalsPage);
router.post('/journals',authenticateToken, journalControler.postJournal);

module.exports = router