const express = require('express')
const UserController = require('../controllers/UserController')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')

router.post('/',UserController.register)
router.post('/login',UserController.login)
router.delete('/logout',authentication,UserController.logout)
router.get('/',authentication,UserController.loged)

module.exports = router