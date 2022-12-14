const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./configs/swagger');

import Logger from './utils/logger';
const { configs } = require('./configs');
const boxen = require('boxen');
const { handleErrors } = require('./helpers/error');

import router from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});
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
