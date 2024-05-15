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
      await Post.findByIdAndUpdate(req.params.id, { $push: { commentsId: comment._id } })
      await User.findByIdAndUpdate(req.user._id, { $push: { commentsId: comment._id } })
      res.status(201).send(comment);
    } catch (error) {
      console.error(error);
    }
  },
  async delete(req, res) {
    try {
      const comment = await Comment.findOneAndDelete({ _id: req.params.id });
      res.status(201).send(comment);
    } catch (error) {
      console.error(error);
    }
  },
  async update(req, res) {
    try {
      const comment = await Comment.findOneAndUpdate({ _id: req.params.id }, { $set: { text: req.body.text } });
      res.status(201).send(comment);

    } catch (error) {
      console.error(error);
    }
  },
  async like(req, res) {
    try {
      const revise = await Comment.findOne(
        { likes: req.user._id }
      )
      if (!revise) {
        const comment = await Comment.findByIdAndUpdate(
          req.params.id,
          { $push: { likes: req.user._id } },
          { new: true }
        );
        res.send(comment);
      } else {
        return res.status(500).send({ message: "You already liked this comment" })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your like" });
    }
  },
  async dislike(req, res) {
    try {
      const revise = await Comment.findOne(
        { likes: req.user._id }
      )
      if (revise) {
        const comment = await Comment.findByIdAndUpdate(
          req.params.id,
          { $pull: { likes: req.user._id } },
          { new: true }
        );
        res.send(comment);
      } else {
        return res.status(500).send({ message: "You alrady disliked this comment" })
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "There was a problem with your dislike" });
    }
  },
};

module.exports = CommentsController;