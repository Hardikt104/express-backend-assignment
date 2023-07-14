import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  info: {
    title: "express-backend-assignment",
    version: "1.0.0",
    description: "express-backend-assignment API Collection",
  },
  host: `${process.env.API_HOST}:${process.env.PORT || 8001}`,
  schemes: ["http", "https"],
  basePath: "/",
};

const options = {
  swaggerDefinition,
  apis: [
    "./source/routes/auth.route.ts",
    "./source/routes/user.route.ts",
    "./source/utils/swagger.yml",
  ],
};

export default swaggerJSDoc(options);
