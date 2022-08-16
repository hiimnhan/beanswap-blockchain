const dotenv = require('dotenv').config();

export const configs = {
  port: process.env.PORT || 5001,
  api: {
    prefix: '/api',
  },
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  boxenOptions: {
    borderColor: 'cyan',
    borderStyle: 'classic',
    padding: 1,
    margin: 1,
  },
};
