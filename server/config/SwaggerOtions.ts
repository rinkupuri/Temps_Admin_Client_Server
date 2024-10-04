const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Temps API",
      version: "1.0.0",
      description: "Temps API documentation for the Product management system",
      contact: {
        name: "Rinku Puri",
        email: "rinkupuri124@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.HOST_URL,
      },
    ],
  },
  apis: ["./routes/*.ts", "./controllers/*.ts"], // Path to TypeScript files for API docs
};

export default swaggerOptions;
