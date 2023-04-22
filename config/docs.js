const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Exqure Documentation",
      description:
        "These documented endpoints describes the API (REST API) for Exqure. The endpoints in the various sections are protected using Json Web Token except the User section. Thus, for the protected endpoints, a token is needed for authorization(signin).",
      contact: {
        name: "Exqure's Backend Team",
        email: "exqure16@gmail.com",
      },
    },
    // servers: ["http://localhost:5000", "https://exqure.herokuapp.com"],
    servers: [
      {
        url: "http://localhost:5000",
        description: "Test server running on locally.",
      },
      {
        url: "https://exqure.herokuapp.com",
        description: "Hosted server on heroku",
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*/*.js"],
};

module.exports = swaggerOptions;
