const Post = require("../models/Post");
const { create } = require("../models/User");

const PostController = {
    async create(req, res) {
        try {
            const { text } = req.body;
            const post = new Post({
                text,
                userId: req.user._id,
                likes: 0,
                commentsId: [],
            });
            await post.save();
            res.json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when creating a post" });
        }
    }
};

module.exports = PostController;