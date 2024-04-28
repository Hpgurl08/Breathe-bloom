const mongoose = require('mongoose');

const mschema = mongoose.Schema;

const CommentSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    postId:{
        type: String
    },
    comment:{
        type: String
    },
    createdAt:{
        type: Date
    },
})


module.exports = mongoose.model('Comment',CommentSchema)