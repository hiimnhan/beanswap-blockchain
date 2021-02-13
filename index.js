const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./src/configs/swagger');

const Logger = require('./src/utils/logger');
const { configs } = require('./src/configs');
const boxen = require('boxen');
const { handleErrors } = require('./src/helpers/error');

import router from './src/routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(configs.api.prefix, router);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(handleErrors);

const PORT = configs.port;

app
  .listen(PORT, () => {
    console.log(
      boxen(`Server is running on PORT ${PORT}`, configs.boxenOptions)
    );
  })
  .on('error', (err) => {
    Logger.error(err);
    process.exit(1);
  });
