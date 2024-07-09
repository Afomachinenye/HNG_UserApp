const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT,
  port: process.env.PORT_NUMBER,
});

// console.log("pool 2", pool);

pool.connect((err, client, release) => {
  if (err) {
    console.error("Error acquiring client", err.stack);
    return console.error("Error in connection");
  }
  client.query("SELECT now()", (err, result) => {
    release();
    if (err) {
      console.error("Error executing query", err.stack);
      return;
    }
    console.log("Connected to database");
  });
});

module.exports = pool;
