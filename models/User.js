const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please fill in the name field"],
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Invalid email"],
        required: [true, "Please fill in the email field"],
    },
    password: {
        type: String,
        required: [true, "Please fill in the password field"],
    },
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/dx3oz5wop/image/upload/v1622139112/Instagram/ProfilePic/defaultProfilePic.jpg"
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    postsId: [
        {
            type: ObjectId,
            ref: 'Post'
        }
    ],
    commentsId: [
        {
            type: ObjectId,
            ref: 'Comment'
        }
    ],
    tokens: [],
    role: { type: String, default: "user" },
    confirmed: { type: Boolean }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;