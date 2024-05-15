const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Por favor rellena tu nombre"],
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Este correo no es válido"],
        required: [true, "Por favor rellena tu correo"],
    },
    password: {
        type: String,
        required: [true, "Por favor rellena tu contraseña"],
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