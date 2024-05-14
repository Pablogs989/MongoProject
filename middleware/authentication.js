const User = require('../models/User');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys.js')

const authentication = async(req, res, next) => {
    try {
        const token = req.headers.authorization;
        const payload = jwt.verify(token, jwt_secret);
        const user = await User.findOne({ _id: payload._id, tokens: token });
        if (!user) {
            return res.status(401).send({ message: 'No estas autorizado' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Ha habido un problema con el token' })
    }
}
const isAdmin = async(req, res, next) => {
    const admins = ['admin','superadmin'];
    if (!admins.includes(req.user.role)) {
        return res.status(403).send({
            message: 'No tienes permisos'
        });
    }
    next();
}
const isAuthorPost = async(req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        console.log('====================================');
        console.log(req.user._id.toString());
        console.log('====================================');
        if (post.userId.toString() !== req.user._id.toString()) { 
            return res.status(403).send({ message: "You don't have permits" });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Ha habido un problema al comprobar la autoría' })
    }
}
const isAuthorComment = async(req, res, next) => {
    try {
        const comment = await Comment.findById(req.params._id);
        if (comment.userId.toString() !== req.user._id.toString()) { 
            return res.status(403).send({ message: "You don't have permits"  });
        }
        next();
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error, message: 'Ha habido un problema al comprobar la autoría' })
    }
}

module.exports = { authentication, isAdmin, isAuthorComment, isAuthorPost };