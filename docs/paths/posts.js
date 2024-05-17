module.exports = {
    "/posts": {
        get: {
            tags: {
                Posts: "Get Posts",
            },
            description: "Get posts",
            operationId: "getPosts",
            parameters: [],
            responses: {
                200: {
                    description: "Post were obtained",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/task",
                            },
                        },
                    },
                },
            },
        },
        post: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Create a post",
            },
            description: "Create Post",
            operationId: "createPost",
            parameters: [],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/PostInput",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Post created successfully",
                },
                500: {
                    description: "Server error",
                },
            },
        },
    },
    "/posts/like/{_id}": {
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Like a post",
            },
            description: "Like a Post",
            operationId: "likePost",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Id of Post to be update",
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/PostInput" },
                    },
                },
            },
            responses: {
                200: { description: "Like succesfully" },
                404: { description: "Not found" },
                500: { description: "Server error" },
            },
        },
    },
    "/posts/dislike/{_id}": {
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Dislike a post",
            },
            description: "Dislike a Post",
            operationId: "dislikePost",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Id of Post to be update",
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/PostInput" },
                    },
                },
            },
            responses: {
                200: { description: "Dislike succesfully" },
                404: { description: "Not found" },
                500: { description: "Server error" },
            },
        },
    },
    "/posts/{_id}": {
        delete: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Delete a post",
            },
            description: "Deleting a Post",
            operationId: "deletePost",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Deleting a done Post",
                },
            ],
            responses: {
                200: { description: "Post deleted successfully" },
                404: { description: "Post not found" },
                500: { description: "Server error" },
            },
        },
    }
}