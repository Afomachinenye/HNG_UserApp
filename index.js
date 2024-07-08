const express = require("express");
const Pool = require("pg").Pool;
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");

const app = express();

const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  dialect: process.env.DB_DIALECT,
  port: process.env.PORT_NUMBER,
});

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

const User = {
  createUser: async ({ firstName, lastName, email, password, phone }) => {
    console.log(pool);
    const query = `
      INSERT INTO users (firstName, lastName, email, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [firstName, lastName, email, password, phone];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  findUserByEmail: async (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];
    const res = await pool.query(query, values);
    return res.rows[0];
  },

  findUserById: async (userId) => {
    const query = `SELECT * FROM users WHERE userId = $1;`;
    const values = [userId];
    const res = await pool.query(query, values);
    return res.rows[0];
  },
};

module.exports = User;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json("Welcome, Postgres");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(pool);
  console.log(`Server is listening at port ${PORT}`);
});

module.exports = { pool };
