const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const CommentSchema = new mongoose.Schema({
    text: String,
    likes: Number,
    userId: {
        type: ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;