const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
    async create(req, res, next) {
        try {
            let { text, image } = req.body;
            if (req.file) {
                image = req.file.filename;
            }
            const post = new Post({
                text,
                image,
                userId: req.user._id,
            });
            await post.save();
            await User.findByIdAndUpdate(req.user._id, { $push: { postsId: post._id } })

            res.status(201).json({ message: "Post created", post });

        } catch (error) {
            next(error)
        }
    },
    async getAllPostWithUsersAndComments(req, res) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const posts = await Post.find()
                .limit(limit)
                .skip((page - 1) * limit)
                .populate('userId', 'name')
                .populate('commentsId', 'userId text')
            res.send(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting all posts with users and comments" });
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findOne({ _id: req.params.id, })
            if (!post) {
                return res.status(400).send("Post not found")
            }
            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting one post" });
        }
    },
    async getByText(req, res) {
        try {
            const post = await Post.findOne({ text: req.params.text, })
            if (!post) {
                return res.status(400).send("Post not found")
            }
            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting one post" });
        }
    },
    async delete(req, res) {
        try {
            const post = await Post.findOneAndDelete({ _id: req.params.id });
            if (!post) {
                return res.status(400).send("Post not found")
            }
            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when deleting a post" });
        }
    },
    async like(req, res) {
        try {
            const revise = await Post.findOne(
                { likes: req.user._id }
            )
            if (!revise) {
                const post = await Post.findByIdAndUpdate(
                    req.params.id,
                    { $push: { likes: req.user._id } },
                    { new: true }
                );
                res.send(post);
            } else {
                return res.status(400).send({ message: "You already like this post" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There are a problem with your like" });
        }
    },
    async dislike(req, res) {
        try {
            const revise = await Post.findOne(
                { likes: req.user._id }
            )
            if (revise) {
                const post = await Post.findByIdAndUpdate(
                    req.params.id,
                    { $pull: { likes: req.user._id } },
                    { new: true }
                );
                res.send(post);
            } else {
                return res.status(400).send({ message: "You already dislike thit post" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "There are a problem with your dislike" });
        }
    },
};

module.exports = PostController;