const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const CommentsController = {
    async create(req, res) {
        try {
            const comment = await Comment.create({
                ...req.body,
                userId: req.user._id,
                postId: req.params.id,
            });

            // Populate postId field with post object and then populate commentsId field in post object
            await comment.populate({
                path: "postId",
            });

            // Update post with comment ID
            await Post.findByIdAndUpdate(
                req.params.id,
                { $push: { commentsId: comment._id } },
                { new: true },
            );

            // Populate post with commentsId
            const populatedPost = await Post.findById(req.params.id).populate(
                "commentsId",
            );

            res.status(201).send({
                message: "Comment created",
                post: populatedPost,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Internal Server Error" });
        }
    },
    async delete(req, res) {
        try {
            const comment = await Comment.findOneAndDelete({
                _id: req.params.id,
            }).populate({
                path: "postId",
                populate: {
                    path: "commentsId",
                },
            });
            res.status(201).send(comment);
        } catch (error) {
            console.error(error);
        }
    },
    async update(req, res) {
        try {
            const comment = await Comment.findOneAndUpdate(
                { _id: req.params.id },
                { $set: { text: req.body.text } },
                { new: true }, // Asegurarnos de que este parámetro esté en el lugar correcto
            ).populate({
                path: "postId",
                populate: {
                    path: "commentsId",
                },
            });
            res.status(201).send(comment);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error updating comment" });
        }
    },

    async like(req, res) {
        try {
            const revise = await Comment.findOne(
                {
                    likes: req.user._id,
                },
                { new: true },
            ).populate({
                path: "postId",
                populate: {
                    path: "commentsId",
                },
            });
            if (revise) {
                const comment = await Comment.findByIdAndUpdate(
                    req.params.id,
                    { $push: { likes: req.user._id } },
                    { new: true },
                ).populate({
                    path: "postId",
                    populate: {
                        path: "commentsId",
                    },
                });
                res.status(200).send({
                    message: "like succesfully added",
                    comment,
                });
            } else {
                return res
                    .status(400)
                    .send({ message: "You alrady liked this comment" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "There was a problem with your dislike",
            });
        }
    },
    async dislike(req, res) {
        try {
            const revise = await Comment.findOne({
                likes: req.user._id,
            }).populate({
                path: "postId",
                populate: {
                    path: "commentsId",
                },
            });
            if (revise) {
                const comment = await Comment.findByIdAndUpdate(
                    req.params.id,
                    { $pull: { likes: req.user._id } },
                    { new: true },
                ).populate({
                    path: "postId",
                    populate: {
                        path: "commentsId",
                    },
                });
                res.status(200).send({
                    message: "Dislike succesfully added",
                    comment,
                });
            } else {
                return res
                    .status(400)
                    .send({ message: "You alrady disliked this comment" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send({
                message: "There was a problem with your dislike",
            });
        }
    },
};

module.exports = CommentsController;