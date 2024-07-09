const dbPool = require("../db");

const User = {
  createUser: async ({ firstName, lastName, email, password, phone }) => {
    try {
      console.log("create user start");

      const query = `
      INSERT INTO users (firstName, lastName, email, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
      const values = [firstName, lastName, email, password, phone];
      const res = await dbPool.query(query, values);
      return res.rows[0];
    } catch (err) {
      console.error("Error creating user", err);
    }
  },

  findUserByEmail: async (email) => {
    try {
      const query = `SELECT * FROM users WHERE email = $1;`;
      const values = [email];
      const res = await dbPool.query(query, values);
      console.log(res.rows[0]);
      return res.rows[0];
    } catch (err) {
      console.error("Error finding user by email:", err);
      res.json;
    }
  },

  findUserById: async (userId) => {
    const query = `SELECT * FROM users WHERE userId = $1;`;
    const values = [userId];
    const res = await dbPool.query(query, values);
    return res.rows[0];
  },

  getUserWithOrganizations: async (userId) => {
    try {
      const userQuery = `SELECT * FROM users WHERE userId = $1;`;
      const userRes = await dbPool.query(userQuery, [userId]);
      const user = userRes.rows[0];

      const orgQuery = `
      SELECT o.* FROM organisations o
      JOIN user_organisations uo ON o.orgId = uo.orgId
      WHERE uo.userId = $1
      UNION
      SELECT * FROM organisations WHERE creatorId = $1;
    `;
      const orgRes = await dbPool.query(orgQuery, [userId]);
      const organisations = orgRes.rows;

      return { user, organisations };
    } catch (err) {
      console.error("Error fetching user with organizations:", err);
    }
  },
};

module.exports = User;
