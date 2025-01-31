import swaggerJSDoc, { OAS3Definition, OAS3Options } from "swagger-jsdoc";

const swaggerDefinition: OAS3Definition = {
  openapi: "3.0.3",
  info: {
    title: "FNL api",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:3000",
    },
    {
      url:"https://fnlapi.com"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      login:{
        type:"object",
        properties:{
          username:{
            type:"string",
            example:"paul"
          },
          password:{
            type:"string",
            example:"contrasena"
          }
        }
      },
      user: {
        type: "object",
        properties: {
          username:{
            type:"string",
            example:"paul"
          },
          password:{
            type:"string",
            example:"contrasena"
          },
          email:{
            type:"string",
            example:"example@gmail.com"
          }
        },
      },
      userProfile:{
        type:"object",
        properties:{
          username:{
            type:"string",
            example:"paul"
          },
          email:{
            type:"string",
            example:"example@gmail.com"
          },
          profileImage:{
            type:"string",
            format: "binary"
          }
        }
      },
      userResponse:{
        type: "object",
        properties:{
          user_id:{
            type: "int64",
            example: 2
          },
          age_range_id:{
            type: "int64",
            example: 2
          },
          hierarchical_level_id:{
            type: "int64",
            example: 2
          },
          responsability_level_id:{
            type: "int64",
            example: 2
          },
          gender_id:{
            type: "int64",
            example: 2
          },
          created_at:{
            type: "string",
            format: "date-time"
          }
        }
      },
      userPrograma:{
        user_id:{
          type: "int64",
          example: 2
        },
        dia:{
          type: "string",
          format: "date-time"
        }
      }
    },
  },
};

const swaggerOptions: OAS3Options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};
export default swaggerJSDoc(swaggerOptions);
