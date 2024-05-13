const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: String,
    likes: Number,
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;