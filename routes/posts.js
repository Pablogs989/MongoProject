const express = require('express')
const PostController = require('../controllers/PostController')
const router = express.Router()
const { authentication, isAuthorPost } = require('../middleware/authentication.js')

router.post('/',authentication, PostController.create)
router.get('/', PostController.getAllPostWithUsersAndComments)
router.get('/id/:id',PostController.getById)
router.get('/text/:text',PostController.getByText)
router.delete('/:id',authentication, isAuthorPost, PostController.delete)
router.put('/like/:id',authentication,PostController.like)
router.put('/dislike/:id',authentication,PostController.dislike)

module.exports = router

