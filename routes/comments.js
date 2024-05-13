const express = require('express')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')
const CommentsController = require('../controllers/CommentController.js')

router.post('/',authentication,CommentsController.create)
router.delete('/',authentication,CommentsController.delete)

module.exports = router