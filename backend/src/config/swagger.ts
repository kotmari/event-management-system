import swaggerUi from "swagger-ui-express";
import { Request, Response } from "express";


const swaggerDocument = {
   openapi: "3.0.0",
  info: {
    title: "Event Management System",
    version: "1.0.0",
    description: "API documentation for Event Management System",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  paths: {
    "/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
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
        responses: {
          "201": {
            description: "User registered successfully",
          },
          "400": {
            description: "Validation error or email already exists",
          },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Login user",
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
          "201": {
            description: "User logout",
          },
          "400": {
            description: "Validation error or email already exists",
          },
        },
      },
    },
  },
};

export { swaggerUi, swaggerDocument };
