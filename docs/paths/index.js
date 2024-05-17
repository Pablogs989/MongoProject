const posts = require("./posts")
const users = require("./users")
const comments = require("./comments")

module.exports = {
    paths: {
        ...posts,   
        ...users,
        ...comments
    }
}