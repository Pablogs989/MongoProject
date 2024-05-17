const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express();
require("dotenv").config();
const {PORT} = process.env
const { dbConnection } = require("./config/config")
const { handleTypeError }= require('./middleware/errors');
const swaggerUI = require('swagger-ui-express')
const docs = require('./docs/index')

dbConnection()

app.use(express.json())
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/users', require('./routes/users'))
app.use('/comments', require('./routes/comments'))
app.use('/posts', require('./routes/posts'))

app.use(handleTypeError)

app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(docs))

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));

module.exports = app;