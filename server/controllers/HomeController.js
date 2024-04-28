const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./storage');

const token = localStorage.getItem('AUTH_TOKEN')


exports.getHomePage = async(req,res) =>{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const journalEntries = await Journal.find({ userId: userId }).limit(3);
    const info = {
        title: 'Home',
        description: 'Homepage content',
        token: token,
        journals:journalEntries
    }
    res.render('home', info);
}

exports.postMood = async(req,res)=>{
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    const { mood } = req.body;
    const newMood = new Mood({
        userId:userId,
        mood: mood,
        createdAt:new Date()
    })
    try {
        await Mood.create(newMood)
        const journalEntries = await Journal.find({ userId: userId }).limit(3);
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


exports.getMoodDataForGraph = async (req, res) => {
  let startDate;
  let ress = req.query.duration;
  switch (ress) {
    case 'PastWeek':
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'TwoWeeks':
      startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      break;
    case 'OneMonth':
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }
 
  try {
    const moods = await Mood.find({ createdAt: { $gte: startDate } })
                        .select('mood -_id')
                        .exec();
    const moodValues = moods.map(mood => mood.mood);
    res.json(moodValues);
  } catch (error) {
    console.error('Error fetching moods:', error);
    throw error;
  }
};
