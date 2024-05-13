const express = require("express");
const app = express();
const PORT = 8080;
const { dbConnection } = require("./config/config")

dbConnection()

app.use(express.json())

app.use('/users', require('./routes/users'))
app.use('/comments', require('./routes/comments'))

app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));