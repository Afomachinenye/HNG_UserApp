const Pool = require("pg").Pool;
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
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
