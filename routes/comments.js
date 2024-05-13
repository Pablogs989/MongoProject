const express = require('express')
const router = express.Router()
const { authentication, isAuthor } = require('../middleware/authentication.js')
const CommentsController = require('../controllers/CommentController.js')

router.post('/',authentication,CommentsController.create)
router.delete('/id/:id',authentication,CommentsController.delete)
router.put('/id/:id',authentication,CommentsController.update)
router.put('/like/:id',authentication,CommentsController.postLike)
router.put('/like/:id',authentication,CommentsController.deleteLike)

module.exports = router