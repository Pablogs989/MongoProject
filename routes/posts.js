const express = require('express')
const PostController = require('../controllers/PostController')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')

router.post('/',authentication, PostController.create)
router.get('/', PostController.getAllWithUsersAndComments)
router.put('/addLike/:id', PostController.postLike)
router.put('/deleteLike/:id', PostController.deleteLike)
router.get('/id/:id',PostController.getById)

module.exports = router

