const express = require('express')
const UserController = require('../controllers/UserController.js')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')

router.post('/', UserController.register)
router.post('/login', UserController.login)
router.delete('/logout', authentication, UserController.logout)
router.get('/users', authentication, UserController.loged)
router.get('/name/:name', UserController.getByName)
router.get('/id/:id', UserController.getById)
router.put('/follow/:id', authentication, UserController.follow)
router.put('/unfollow/:id', authentication, UserController.unfollow)
router.get('/', authentication, UserController.getUsers)
router.get('/confirm/:emailToken',UserController.confirm)

module.exports = router