const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema({
    text: String,
    userId: 
        {
            type : ObjectId,
            ref : 'User'
        }
    ,
    likes:
        {
            type: Integer,
            ref : 'Post'
        }
    ,
    commentsId:[
        {
            type: ObjectId,
            ref : 'Comment'
        }
    ]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;