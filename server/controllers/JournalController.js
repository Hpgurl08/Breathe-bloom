const Journal = require('../models/Journal');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./storage');

const token = localStorage.getItem('AUTH_TOKEN')

exports.getCreatePage = async (req, res) => {
    const info = {
        title: 'CreateJournalEntry',
        description: 'CreateJournalEntrypage content',
        token: token
    }
    res.render('newjournal', info);
}

exports.getJournalsPage = async (req, res) => {
    const journalEntries = await Journal.find();
    const info = {
        title: 'Journal Entries',
        description: 'Journal Entries content',
        token: token,
        alljournals:journalEntries
    }
    res.render('journals', info);
}

exports.postJournal = async (req, res) => {
    console.log(req.body)
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { entry, public } = req.body;
    const newJournal = new Journal({
        userId:userId,
        entry: entry,
        public: public||'off',
    })
    try {
        await Journal.create(newJournal)
        const journalEntries = await Journal.find().limit(3);
        const info = {
            title: 'Home',
            description: 'Home content',
            token: decodedToken,
            journals:journalEntries
        }
        res.render('home',info)
    } catch (error) {
        console.log(error)
    }
}