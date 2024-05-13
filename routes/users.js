const express = require('express')
const UserController = require('../controllers/UserController')
const routes = express.Router()

routes.post('/',UserController.register)
routes.post('/login',UserController.login)
routes.delete('/logout',UserController.logout)

