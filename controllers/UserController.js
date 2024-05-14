const User = require("../models/User.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys.js')


const UserController = {
  async register(req, res, next) {
    try {
      if(!req.body.password){
        return res.status(400).send("Rellena la contraseña")
      }
        const password = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({ ...req.body, password, role: "user" });
        res.status(201).send({ message: "Usuario registrado con exito", user });
    } catch (error) {
      next(error)
    }
  },
  async login(req, res, next) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      })
      if (!user) {
        return res.status(400).send("correo o constraseña incorrecto")
      }
      if (!req.body.password || !bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).send("correo o constraseña incorrecto")
      }
      const token = jwt.sign({ _id: user._id }, jwt_secret);
      if (user.tokens.length > 4) user.tokens.shift();
      user.tokens.push(token);
      await user.save();
      res.send({ message: 'Bienvenid@ ' + user.email, token });
    } catch (error) {
      next(error)
    }
  },
  async logout(req, res) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { tokens: req.headers.authorization },
      });
      res.send({ message: "Desconectado con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al intentar desconectar al usuario",
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
        message: "Hubo un problema al recojer los usuarios",
      });
    }
  },
  async getByName(req, res) {
    try {
      const users = await User.findOne({ name: req.params.name, })
      res.send(users)
    }
    catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al recojer los usuarios",
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
        message: "Hubo un problema al recojer los usuarios",
      });
    }
  },
  async follow(req, res) {
    try {
      if (req.user._id.toString() === req.params.id) {
        return res.status(400).send("No puedes seguirte a ti mismo")
      }
      if (req.user.following.includes(req.params.id)) {
        return res.status(400).send("Ya sigues a este usuario")
      }
      if (!await User.findById(req.params.id)) {
        return res.status(400).send("Usuario no encontrado")
      }
      const user = await User.findByIdAndUpdate(req.user._id, { $push: { following: req.params.id } })
      await User.findByIdAndUpdate(req.params.id, { $push: { followers: req.user._id } })
      res.send(user)
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al seguir al usuario",
      });
    }
  },
  async unfollow(req, res) {
    try {
      if (!req.user.following.includes(req.params.id)) {
        return res.status(400).send("No sigues a este usuario")
      }
      if (!await User.findById(req.params.id)) {
        return res.status(400).send("Usuario no encontrado")
      }
      const user = await User.findByIdAndUpdate(req.user._id, { $pull: { following: req.params.id } })
      await User.findByIdAndUpdate(req.params.id, { $pull: { followers: req.user._id } })
      res.send(user)
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al dejar de seguir al usuario",
      });
    }
  }
};

module.exports = UserController;