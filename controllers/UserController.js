const User = require("../models/User.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { JWT_SECRET, EMAILURL } = process.env
const transporter = require("../config/nodemailer");

const UserController = {
  async register(req, res, next) {
    try {
      const newUser = await User.findOne({
        email: req.body.email
      })
      if (!newUser) {
        if (!req.body.password) {
          return res.status(400).send("Complete the password field")
        }
        const password = await bcrypt.hash(req.body.password, 10)
        if (req.file) req.body.profilePic = req.file.filename;
        await User.create({ ...req.body, password, role: "user", confirmed: false });
      } else {
        return res.status(400).send("User already exists")
      }
      const emailToken = jwt.sign({ email: req.body.email }, JWT_SECRET, { expiresIn: '48h' })
      const url = EMAILURL + '/users/confirm/' + emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirm your email",
        html: `<h3>Welcome, you are one step away from registering </h3>
        <a href="${url}"> Click your email to confirm your registration</a>
        `,
      });
      res.status(201).send({
        message: "Welcome, you are one step away from registering, check your email to confirm your registration"
      });

    } catch (error) {
      next(error)
    }
  },
  async profilePicture(req, res) {
    try {
      if (req.file) req.body.profilePic = req.file.filename;
      await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
      res.send({ message: 'User profile picture successfully updated' });
    } catch (error) {
      console.error(error);
    }
  },
  async login(req, res, next) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      })
      if (!user) {
        return res.status(400).send("Invalid email or password")
      }
      if (!req.body.password || !bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send("Invalid email or password")
      }
      if (!user.confirmed) {
        return res.status(400).send({ message: "You should confirm your email" })
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.status(200).send({ message: 'Welcome ' + user.email, token });
    } catch (error) {
      next(error)
    }
  },
  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Logged out" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem logging out the user",
      });
    }
  },
  async loged(req, res) {
    try {
      const users = await User.findOne({ email: req.user.email, })
        .populate('commentsId', 'text')
        .populate('postsId', 'text')
      res.send(users)
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem getting the user",
      });
    }
  },
  async getByName(req, res) {
    try {
      const users = await User.findOne({ name: req.params.name, })
      if (!users) {
        return res.status(400).send("User not found")
      }
      res.send(users)
    }
    catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem getting the user",
      });
    }
  },
  async getById(req, res) {
    try {
      const users = await User.findOne({ _id: req.params.id, })
      res.send(users)
    }
    catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem getting the user",
      });
    }
  },
  async follow(req, res) {
    try {
      if (req.user._id.toString() === req.params.id) {
        return res.status(400).send("You can't follow yourself")
      }
      if (req.user.following.includes(req.params.id)) {
        return res.status(400).send("You already follow this user")
      }
      if (!await User.findById(req.params.id)) {
        return res.status(400).send("User not found")
      }
      const user = await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } })
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } })
      res.send({message:"User followed", user})
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem following the user",
      });
    }
  },
  async unfollow(req, res) {
    try {
      if (!req.user.following.includes(req.params.id)) {
        return res.status(400).send("You don't follow this user")
      }
      if (!await User.findById(req.params.id)) {
        return res.status(400).send("User not found")
      }
      const user = await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } })
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } })
      res.send({message:"User unfollowed", user})
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem unfollowing the user",
      });
    }
  },
  async getUsers(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate('postsId', 'text')
      const userWithFollowers = {
        ...user._doc,
        followersNumber: req.user.followers.length
      };
      res.send(userWithFollowers);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "There was a problem getting the users",
      });
    }
  },
  async confirm(req, res) {
    try {
      const token = req.params.emailToken
      const payload = jwt.verify(token, JWT_SECRET)
      const email = await User.findOne({ email: payload.email })
      await User.findByIdAndUpdate(email._id, { confirmed: true })
      res.status(201).send({ message: "User confirmed" });
    } catch (error) {
      console.error(error)
    }
  },
  async recoverPassword(req, res) {
    try {
      const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, {
        expiresIn: "48h",
      });
      const url = EMAILURL + "/users/resetPassword/" + recoverToken;
      await transporter.sendMail({
        to: req.params.email,
        subject: "Recover password",
        html: `<h3> Recover password </h3>
        <a href="${url}">Recover password</a>
        The link will expire in 48 hours
        `,
      });
      res.send({
        message: "Mail for recuperate is sending you in your email",
      });
    } catch (error) {
      console.error(error);
    }
  },
  async resetPassword(req, res) {
    try {
      const recoverToken = req.params.recoverToken;
      const payload = jwt.verify(recoverToken, JWT_SECRET);
      const password = bcrypt.hashSync(req.body.password, 10)
      await User.findOneAndUpdate(
        { email: payload.email },
        { password }
      );
      res.send({ message: "password change succes" });
    } catch (error) {
      console.error(error);
    }
  },

};

module.exports = UserController;