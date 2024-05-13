const express = require('express')
const PostController = require('../controllers/PostController')
const router = express.Router()
const { authentication } = require('../middleware/authentication.js')

router.post('/',authentication, PostController.create)


module.exports = router

