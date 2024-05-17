module.exports = {
    "/users": {
        post: {
            tags: {
                Users: "Create User",
            },
            description: "Create User",
            operationId: "createUser",
            parameters: [],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/user",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "User Created",
                },
            },
        },
        get: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                User: "Get User",
            },
            description: "Get user",
            operationId: "getUser",
            parameters: [],
            responses: {
                200: {
                    description: "User were obtained",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/user",
                            },
                        },
                    },
                },
            },
        },
    },
    "/users/login": {
        post: {
            tags: {
                Users: "Log User",
            },
            description: "Log User",
            operationId: "logUser",
            parameters: [],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/user",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "User Loged",
                },
            },
        },
    },
    "/users/follow/{_id}": {
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Users: "follow a user",
            },
            description: "follow a user",
            operationId: "follorUser",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "follow of User to be update",
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
                200: { description: "Follow succesfully" },
                404: { description: "Not found" },
                500: { description: "Server error" },
            },
        },
    },
    "/users/unfollow/{_id}": {
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Users: "unfollow a user",
            },
            description: "unfollow a user",
            operationId: "unfollowUser",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "follow of User to be update",
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
                200: { description: "unfollow succesfully" },
                404: { description: "Not found" },
                500: { description: "Server error" },
            },
        },
    },
    "/users/logout": {
        delete: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Logout",
            },
            description: "Logout",
            operationId: "Logout",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Logout a user",
                },
            ],
            responses: {
                200: { description: "Logout successfully" },
                404: { description: "Post not found" },
                500: { description: "Server error" },
            },
        },
    }
};