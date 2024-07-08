const { pool } = require("../index");

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
