export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "QuickPost API",
    version: "1.0.0",
    description: "API documentation for QuickPost backend",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Sign up a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created and token returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          409: {
            description: "User already exists",
          },
        },
      },
    },
    "/api/auth/signin": {
      post: {
        tags: ["Auth"],
        summary: "Login a user and receive a JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "JWT token and user info returned",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    token: { type: "string" },
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        firstName: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Invalid credentials",
          },
        },
      },
    },
    "/api/post": {
      get: {
        tags: ["Post"],
        summary: "Get paginated posts",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            required: false,
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
            required: false,
            description: "Number of posts per page",
          },
        ],
        responses: {
          200: {
            description: "List of posts",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { type: "object" } },
                    meta: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        totalPages: { type: "integer" },
                        limit: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Post"],
        summary: "Create a new post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
    "/api/post/{id}": {
      delete: {
        tags: ["Post"],
        summary: "Delete a post by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Post deleted successfully",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - not post owner",
          },
          404: {
            description: "Post not found",
          },
        },
      },
      put: {
        tags: ["Post"],
        summary: "Update a post by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  tags: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Post updated successfully",
          },
          400: {
            description: "Bad Request",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - not post owner",
          },
          404: {
            description: "Post not found",
          },
        },
      },
    },
    "/api/post/{id}/like": {
      post: {
        tags: ["Post"],
        summary: "Like or unlike a post by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the post to like or unlike",
          },
        ],
        responses: {
          200: {
            description: "Post unliked successfully",
          },
          201: {
            description: "Post liked successfully",
          },
          400: {
            description: "Post already liked or bad request",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Post not found",
          },
        },
      },
    },
    "/api/post/{id}/comment": {
      post: {
        tags: ["Comment"],
        summary: "Add a comment to a post",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the post to comment on",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string" },
                  parentId: { type: "string", nullable: true },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment added successfully",
          },
          400: {
            description: "Content is required",
          },
          401: {
            description: "Unauthorized",
          },
          404: {
            description: "Post not found",
          },
        },
      },
    },
    "/api/comment/{id}": {
      delete: {
        tags: ["Comment"],
        summary: "Delete a comment by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID of the comment to delete",
          },
        ],
        responses: {
          200: {
            description: "Comment deleted successfully",
          },
          401: {
            description: "Unauthorized",
          },
          403: {
            description: "Forbidden - not comment owner",
          },
          404: {
            description: "Comment not found",
          },
        },
      },
    },
  },
};
