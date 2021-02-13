const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'BS-Blockchain API',
      version: '1.0.0',
      description: 'BeanSwap Blockchain API for BeanSwap project',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'local server',
      },
    ],
  },
  apis: ['../routes/index.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
