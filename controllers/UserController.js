const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { jwt_secret } = require('../config/keys.js')


const UserController = {
  async register(req, res) {''
    try {
      const password = await bcrypt.hash(req.body.password,10)
      const user = await User.create({...req.body ,  password, role : "user"});
      res.status(201).send({ message: "Usuario registrado con exito", user });
      
    } catch (error) {
      console.error(error);
      res.status(500).send(error)
    }
  },
  async login(req, res) {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        if(!user){
          return res.status(400).send("correo o constraseña incorrecto")
        }
        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if(!isMatch){
          return res.status(400).send("correo o constraseña incorrecto")
        }
        const token = jwt.sign({ _id: user._id }, jwt_secret);
        if (user.tokens.length > 4) user.tokens.shift();
        user.tokens.push(token);
        await user.save();
        res.send({ message: 'Bienvenid@ ' + user.email, token });
    } catch (error) {
        console.error(error);
        res.status(500).send(error)
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
};

module.exports = UserController;