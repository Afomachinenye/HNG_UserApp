// models/organisationModel.js
const pool = require("../index").pool;

const createOrganisation = async (organisation) => {
  const { name, description, creatorId } = organisation;
  const result = await pool.query(
    `INSERT INTO organisations (name, description, creatorId) VALUES ($1, $2, $3) RETURNING *`,
    [name, description, creatorId]
  );
  return result.rows[0];
};

const findOrganisationsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT o.* FROM organisations o
         JOIN user_organisations uo ON o.orgId = uo.orgId
         WHERE uo.userId = $1`,
    [userId]
  );
  return result.rows;
};

module.exports = { createOrganisation, findOrganisationsByUserId };
