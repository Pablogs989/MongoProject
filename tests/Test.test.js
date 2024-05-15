const request = require("supertest");
const app = require("../index.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js")
require("dotenv").config();
const { JWT_SECRET } = process.env
let token
let postId
let userId

describe("testing", () => {
    afterAll(async () => {
        await User.deleteMany({});
    });
    const user = {
        name: "memeo",
        email: "mpiernash@gmail.com",
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
        postId = res.body._id
    });
    console.warn(postId);
    test("Comment create", async () => {
        const res = await request(app)
            .post("/comments/id/" + postId)
            .send(comment)
            .expect(201)
            .set({ Authorization: token })
        expect(res.body.message).toBe("Comment created")
    });
})
