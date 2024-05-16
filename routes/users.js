const express = require('express')
const UserController = require('../controllers/UserController.js')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')
const { uploadUserProfile } = require('../middleware/multer.js')

router.post('/', uploadUserProfile.single("profilePic"), UserController.register)
router.post('/login', UserController.login)
router.delete('/logout', authentication, UserController.logout)
router.get('/users', authentication, UserController.loged)
router.get('/name/:name', UserController.getByName)
router.get('/id/:id', UserController.getById)
router.put('/follow/:id', authentication, UserController.follow)
router.put('/unfollow/:id', authentication, UserController.unfollow)
router.get('/', authentication, UserController.getUsers)
router.get('/confirm/:emailToken',UserController.confirm)
router.get('/recoverPassword/:email', UserController.recoverPassword)
router.put('/resetPassword/:recoverToken', UserController.resetPassword)
router.put('/profilePic',authentication, uploadUserProfile.single("profilePic"), UserController.profilePicture)

module.exports = router