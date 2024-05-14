const User = require("../models/User.js");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys.js')
const transporter = require("../config/nodemailer");

const UserController = {
  async register(req, res, next) {
    try {
      const newUser = await User.findOne({
        email : req.body.email
      })
      if(!newUser){
        if(!req.body.password){
          return res.status(400).send("Rellena la contraseña")
        }
          const password = await bcrypt.hash(req.body.password, 10)
          const user = await User.create({ ...req.body, password, role: "user", confirmed: false });
          res.status(201).send({ message: "Usuario registrado con exito", user });
      }else{
        return res.status(400).send("El usuario ya existe")
      }
      const emailToken = jwt.sign({email:req.body.email},jwt_secret,{expiresIn:'48h'})
      const url = 'http://localhost:8080/users/confirm/'+ emailToken
      await transporter.sendMail({
        to: req.body.email,
        subject: "Confirme su registro",
        html: `<h3>Bienvenido, estás a un paso de registrarte </h3>
        <a href="${url}"> Click para confirmar tu registro</a>
        `,
      });
      res.status(201).send({
        message: "Te hemos enviado un correo para confirmar el registro",
        user,
      });

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
      if(!user.confirmed){
        return res.status(400).send({message:"Debes confirmar tu correo"})
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
  },
  async getUsers(req, res) {
    try {
      const user = await User.findById(req.user._id)
        .populate('postsId', 'text')
        console.log(req.user.followers.length);
        const userWithFollowers = {
          ...user._doc,
          followersNumber: req.user.followers.length
        };
        res.send(userWithFollowers);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Hubo un problema al recojer los usuarios",
      });
    }
  },async confirm(req,res){
    try {
      const token = req.params.emailToken
      const payload = jwt.verify(token,jwt_secret)
      const email = await User.findOne({email: payload.email})
      console.warn(await User.findByIdAndUpdate(email._id,{confirmed:true}));
      await User.findByIdAndUpdate(email._id,{confirmed:true})
      res.status(201).send( "Usuario confirmado con éxito" );
    } catch (error) {
      console.error(error)
    }
  },
};

module.exports = UserController;