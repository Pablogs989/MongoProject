const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
require("dotenv").config();
const {PORT} = process.env
const { dbConnection } = require("./config/config")
const { handleTypeError }= require('./middleware/errors');


dbConnection()

app.use(express.json())
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/public/images/user/profile', express.static('/public/images/user/profile'));
app.use('/public/images/post', express.static('/public/images/post'));

app.use('/users', require('./routes/users'))
app.use('/comments', require('./routes/comments'))
app.use('/posts', require('./routes/posts'))

app.use(handleTypeError)

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));