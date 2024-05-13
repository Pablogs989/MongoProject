const Comments = require("../models/Comment");

const CommentsController = {
    async create(req, res) {
        try {
          const comment = await Comments.create({
            ...req.body,
            userId: req.user._id,
            postId: req.params.id,
            likes : 0
          });
          res.status(201).send(comment);
        } catch (error) {
          console.error(error);
        }
      },
    async delete(req, res) {
        try {
            const comment = await Comments.findOneAndDelete({_id : req.params.id});
            res.status(201).send(comment);
        } catch (error) {
            console.error(error);
        }
    },
    async update(req, res) {
        try {
            const comment = await Comments.findOneAndUpdate({_id : req.params.id},{ $set:{text:req.body.text}});
            res.status(201).send(comment);

        } catch (error) {
            console.error(error);
        }
    },
    async postLike(req, res) {
        try {
            const comment = await Comments.findOne({_id : req.params.id})
            let more = comment.likes + 1
            await Comments.findOneAndUpdate({_id : req.params.id},{$set:{likes:more}});
            res.status(201).send(comment);

        } catch (error) {
            console.error(error);
        }
    },
    async deleteLike(req, res) {
        try {
            const comment = await Comments.findOne({_id : req.params.id})
            let more = comment.likes - 1
            await Comments.findOneAndUpdate({_id : req.params.id},{$set:{likes:more}});
            res.status(201).send(comment);

        } catch (error) {
            console.error(error);
        }
    },
};

module.exports = CommentsController;