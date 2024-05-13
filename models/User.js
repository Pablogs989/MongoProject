const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    followers: [
        {
            type : ObjectId,
            ref : 'User'
        }
    ],
    postsId:[
        {
            type: ObjectId,
            ref : 'Post'
        }
    ],
    commentsId:[
        {
            type: ObjectId,
            ref : 'Comment'
        }
    ],
    tokens:[]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;