const Post = require("../models/Post");

const PostController = {
    async create(req, res, next) {
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
           next(error)
        }
    },
    async getAllWithUsersAndComments(req, res) {
        try {
            const posts = await Post.find()
                .populate('users.name')
                .populate({
                    path: 'commentsId',
                    populate: {
                        path: 'userId',
                        select: 'name'
                    }
                });
            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting all posts with users and comments" });
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            res.json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting one post" });
        }
    },
    async update(req, res) {
        try {
            const post = await Post.findByIdAndUpdate
                (req.params.id, req.body
                    , { new: true });
            res.json(post);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when updating a post" });
        }
    },
    async postLike(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            post.likes++;
            await post.save();
            res.json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when liking a post" });
        }
    },
    async deleteLike(req, res) {
        try {
            const post = await Post.findById(req.params.id);
            post.likes--;
            await post.save();
            res.json(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when deleting a like" });
        }
    }
};

module.exports = PostController;