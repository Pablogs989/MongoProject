module.exports = {
    "/comments/id/{_id}": {
        post: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Comments: "Create a comment",
            },
            description: "Create Comment",
            operationId: "createComment",
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
                        schema: {
                            $ref: "#/components/schemas/CommentInput",
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: "Comment created successfully",
                },
                500: {
                    description: "Server error",
                },
            },
        },
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Update a comment",
            },
            description: "Update a Comment",
            operationId: "updateComment",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Id of Comment to be update",
                },
            ],
            requestBody: {
                content: {
                    "application/json": {
                        schema: { $ref: "#/components/schemas/CommentInput" },
                    },
                },
            },
            responses: {
                200: { description: "Update Comment succesfully" },
                404: { description: "Not found" },
                500: { description: "Server error" },
            },
        },
        delete: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Comments: "Delete a comment",
            },
            description: "Deleting a Comment",
            operationId: "deleteComment",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Deleting a done Comment",
                },
            ],
            responses: {
                201: { description: "Comment deleted successfully" },
                404: { description: "Comment not found" },
                500: { description: "Server error" },
            },
        },
    },
    "/comments/like/{_id}": {
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Like a comment",
            },
            description: "Like a Comment",
            operationId: "likeComment",
            parameters: [
                {
                    name: "_id",
                    in: "path",
                    schema: {
                        $ref: "#/components/schemas/_id",
                    },
                    description: "Id of Comment to be update",
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
    "/comments/dislike/{_id}": {
        put: {
            security: [{
                ApiKeyAuth: []
            }],
            tags: {
                Posts: "Dislike a comment",
            },
            description: "Dislike a comment",
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
}