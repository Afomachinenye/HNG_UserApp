// models/organisationModel.js
const dbPool = require("../db");

const createOrganisation = async (organisation) => {
  const { name, description, creatorId } = organisation;
  const result = await dbPool.query(
    `INSERT INTO organisations (name, description, creatorId) VALUES ($1, $2, $3) RETURNING *`,
    [name, description, creatorId]
  );
  return result.rows[0];
};

const findOrganisationsByUserId = async (userId) => {
  const result = await dbPool.query(
    `SELECT o.* FROM organisations o
         JOIN user_organisations uo ON o.orgId = uo.orgId
         WHERE uo.userId = $1`,
    [userId]
  );
  return result.rows;
};

const findOrganisationById = async (orgId) => {
  const res = await dbPool.query(
    `SELECT * FROM organisations WHERE orgId = $1;`,
    [orgId]
  );
  return result.rows;
};

addUserToOrganisation = async (userId, orgId) => {
  // if (!userId || !orgId) {
  //   throw new Error("userId and orgId are required");
  // }

  const result = await dbPool.query(
    `INSERT INTO user_organisations (userId, orgId) VALUES ($1, $2) RETURNING *;`,
    [userId, orgId]
  );
  return result.rows[0];
};

module.exports = {
  createOrganisation,
  findOrganisationsByUserId,
  addUserToOrganisation,
  findOrganisationById,
};
