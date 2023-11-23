/* global process */

const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  // host: process.env.DB_HOST,
  // // port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
});

module.exports = pool;
