const config = require('dotenv').config;
config();

const constants = {
  baseUrl: process.env.APP_BASE_URL,
  env: process.env.NODE_ENV,
  db:  process.env.DATABASE_URL
};

export default constants;
