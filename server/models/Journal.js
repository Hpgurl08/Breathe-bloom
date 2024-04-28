const mongoose = require('mongoose');

const mschema = mongoose.Schema;

const JournalSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    entry:{
        type: String
    },
    public:{
        type: String
    },
})


module.exports = mongoose.model('Journal',JournalSchema)