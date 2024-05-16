const request = require("supertest");
const app = require("../index.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js")
const Post = require("../models/Post.js")
const Comment = require("../models/Comment.js")
require("dotenv").config();
const { JWT_SECRET } = process.env
let token
let postId
let userId
let userId2
let commentId

describe("testing", () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
        await Comment.deleteMany({});
    });
    const user = {
        name: "memeo",
        email: "mpiernash@gmail.com",
        password: "123456",
    };
    const user2 = {
        name: "memeo2",
        email: "mpiernash2@gmail.com",
        password: "123456",
    };
    const post = {
        text: "DIOOOOOOOS",
        userId: userId
    };
    const comment = {
        text: "DIOOOOOOOS",
    };
    test("Create a user", async () => {
        const res = await request(app)
            .post("/users")
            .send(user)
            .expect(201);
        expect(res.body.message).toBeDefined();
    })
    test("Confirm a user", async () => {
        const emailToken = jwt.sign({ email: user.email }, JWT_SECRET, {
            expiresIn: "48h",
        });
        const res = await request(app)
            .get("/users/confirm/" + emailToken)
            .expect(201);
        expect(res.body.message).toBe("User confirmed");
    });
    test("Login a user", async () => {
        const res = await request(app)
            .post("/users/login")
            .send(user)
            .expect(200);
        token = res.body.token;
        userId = res.body._id
    });
    test("Post create", async () => {
        const res = await request(app)
            .post("/posts")
            .send(post)
            .expect(201)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Post created")
        postId = res.body.post._id
    });
    test("Comment create", async () => {
        const res = await request(app)
            .post("/comments/id/" + postId)
            .send(comment)
            .expect(201)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Comment created")
        commentId = res.body.comment._id
    });
    test("Post like", async () => {
        const res = await request(app)
            .put("/posts/like/" + postId)
            .expect(200)
            .send(post,user)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Like succesfully added")
    });
    test("Post dislike", async () => {
        const res = await request(app)
            .put("/posts/dislike/" + postId)
            .expect(200)
            .send(post,user)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Dislike succesfully added")
    });
    test("Comment like", async () => {
        const res = await request(app)
            .put("/comments/like/" + commentId)
            .expect(200)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Like succesfully added")
    });
    test("Comment dislike", async () => {
        const res = await request(app)
            .put("/comments/dislike/" + commentId)
            .expect(200)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Dislike succesfully added")
    });
    test("Create a user2", async () => {
        const res = await request(app)
            .post("/users")
            .send(user2)
            .expect(201);
        expect(res.body.message).toBeDefined();
        userId2 = res.body.user._id
    })
    test("Follow", async () => {
        const res = await request(app)
            .put("/users/follow/" + userId2)
            .expect(200)
            .set({ Authorization: token })
        expect(res.body.message).toBe("User followed")
    });
    test("Unfollow", async () => {
        const res = await request(app)
            .put("/users/unfollow/" + userId2)
            .expect(200)
            .set({ Authorization: token })
        expect(res.body.message).toBe("User unfollowed")
    });
})
