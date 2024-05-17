module.exports = {
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header"
        }
    },
    schemas: {
        post: {
          type: "object",
          properties: {
            _id: {
              type: "objectId",
              description: "post identification number",
              example: "6201064b0028de7866e2b2c4",
            },
            text: {
              type: "string",
              description: "text",
              example: "Example text",
            },
            image: {
                type: "string",
                description: "image",
                example: "image.jpg",
            },
          },
        },
        postInput: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "text",
              example: "Example text",
            },
            image: {
                type: "string",
                description: "image",
                example: "image.jpg",
            },
          },
        },
        _id: {
          type: "objectId",
          description: "An id of a post",
          example: "6201064b0028de7866e2b2c4",
        },
        user: {
          type: 'object',
          properties: {
              name: {
                  type: 'string',
                  description: "name",
                  example: "Euralio"
              },
              email: {
                  type: 'string',
                  description: "email",
                  example: "euralio@gmail.com"
              },
              password: {
                  type: 'string',
                  description: "password",
                  example: "mimamamemima123"
              },
          }
        },
        comment: {
          type: "object",
          properties: {
            _id: {
              type: "objectId",
              description: "comment identification number",
              example: "6201064b0028de7866e2b2c4",
            },
            text: {
              type: "string",
              description: "text",
              example: "Example text",
            },
          },
        },
        commentInput: {
          type: "object",
          properties: {
            text: {
              type: "string",
              description: "text",
              example: "Example text",
            },
          },
        },
        _id: {
          type: "objectId",
          description: "An id of a comment",
          example: "6201064b0028de7866e2b2c4",
        },
      },
    },
  };