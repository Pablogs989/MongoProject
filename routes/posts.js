const express = require('express')
const PostController = require('../controllers/PostController')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')

router.post('/',authentication, PostController.create)
router.get('/', PostController.getAllWithUsersAndComments)
router.post('/id/:id', PostController.postLike)
router.get('/:id', PostController.getById)

module.exports = router

