const mongoose = require('mongoose');

const mschema = mongoose.Schema;

const MoodSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    mood:{
        type: Number
    },
    createdAt:{
        type: Date
    },
})


module.exports = mongoose.model('Mood',MoodSchema)