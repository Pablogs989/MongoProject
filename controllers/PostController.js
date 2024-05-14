const Post = require("../models/Post");
const User = require("../models/User");

const PostController = {
    async create(req, res, next) {
        try {
            const { text } = req.body;
            const post = new Post({
                text,
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
            .populate('commentsId', 'text')
            res.send(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting all posts with users and comments" });
        }
    },
    async getById(req, res) {
        try {
            const post = await Post.findOne({ _id: req.params.id, })
            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting one post" });
        }
    },
    async getByText(req, res) {
        try {
            const post = await Post.findOne({ text: req.params.text, })
            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when getting one post" });
        }
    },
    async delete(req, res) {
        try {
            const post = await Post.findOneAndDelete({ _id: req.params.id });
            res.send(post);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error when deleting a post" });
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
    },async like(req, res) {
        try {
          const revise = await Post.findOne(
            {likes: req.user._id}
          )  
          if(!revise){
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $push: { likes: req.user._id } },
                { new: true }
              );
              res.send(post);
          }else{
            return res.status(400).send({ message: "Ya has dado like al post"})
          }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Hay un problema con tu like" });
        }
    },async dislike(req, res) {
        try {
            const revise = await Post.findOne(
                {likes: req.user._id}
            )
            if(revise){ 
                const post = await Post.findByIdAndUpdate(
                    req.params.id,
                    { $pull: { likes: req.user._id } },
                    { new: true }
                  );
                  res.send(post);
            }else{
                return res.status(400).send({ message: "Ya has dado dislike al post"})
            }
        } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Hay un problema con tu dislike" });
        }
    },  
};

module.exports = PostController;