import swaggerUi from "swagger-ui-express";

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Event Management System",
    version: "1.0.0",
    description: "API documentation",
  },
  servers: [{ url: "http://localhost:5001/api" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        summary: "Register",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Success" } },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login",
        tags: ["Auth"],
        requestBody: {
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
        responses: { "200": { description: "Success" } },
      },
    },
    "/events": {
      get: {
        summary: "Get public events",
        tags: ["Events"],
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "List of events" } },
      },
      post: {
        summary: "Create event",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  location: { type: "string" },
                  capacity: { type: "integer" },
                  isPublic: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/events/{id}": {
      get: {
        summary: "Get event details",
        tags: ["Events"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Event details" },
          "404": { description: "Event not found" },
        },
      },
      patch: {
        summary: "Update event",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        summary: "Delete event",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: { "200": { description: "Deleted successfully" } },
      },
    },
    "/events/{id}/join": {
      post: {
        summary: "Join event",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Joined successfully" },
          "400": { description: "Already joined or Event is full" },
          "404": { description: "Event not found" },
        },
      },
    },
    "/events/{id}/leave": {
      post: {
        summary: "Leave event",
        tags: ["Events"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          "200": { description: "Successfully left the event" },
          "400": { description: "Not a participant" },
          "404": { description: "Event not found" },
        },
      },
    },
   "/user/me/events": {
      get: {
        summary: "Get my events (calendar)",
        tags: ["Profile"],
        security: [{ bearerAuth: [] }],
        responses: { 
          "200": { 
            description: "List of user's events",
            content: {
              "application/json": {
                schema: { type: "array", items: { type: "object" } }
              }
            }
          },
          "401": { description: "Unauthorized" }
        },
      },
    },
    "/tags": {
      get: {
        summary: "Get all available tags",
        tags: ["Tags"],
        responses: { "200": 
          { description: "List of tags retrieved successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {"type": "integer", "example": 1},
                      "name": {"type": "string", "example": "Technology"},
                    }
                  }
                }
              }
            }
           } },
      },
    },
  },
};

export { swaggerUi, swaggerDocument };
