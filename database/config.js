const fs = require('fs');
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE + '_test',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      bigNumberStrings: true,
    },
  },
};