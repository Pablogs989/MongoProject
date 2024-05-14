const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const PostSchema = new mongoose.Schema({
    text: {
        type:String,
        required:[true, "Por favor ingresa algo para postear"]
    },
    userId: 
        {
            type : ObjectId,
            ref : 'User'
        }
    ,
    likes: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    commentsId:[
        {
            type: ObjectId,
            ref : 'Comment'
        }
    ]
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;