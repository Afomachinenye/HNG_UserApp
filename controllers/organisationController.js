const Organisation = require("../models/Organisation");

const getOrganisations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const organisations = await Organisation.findOrganisationsByUserId(userId);
    res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organisations },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const getOrganisation = async (req, res) => {
  const { orgId } = req.params;
  try {
    const organisation = await Organisation.findOrganisationById(orgId);
    if (!organisation) {
      return res.status(404).json({
        status: "error",
        message: "Organisation not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const createOrganisation = async (req, res) => {
  const userId = req.user.userId;
  const { name, description } = req.body;
  try {
    if (!name) {
      return res.status(422).json({
        errors: [{ field: "name", message: "Name is required" }],
      });
    }

    const organisation = await Organisation.createOrganisation({
      name,
      description,
      // creatorId: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: organisation,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the organization exists
    const orgQuery = `SELECT * FROM organisations WHERE orgId = $1;`;
    const orgRes = await dbPool.query(orgQuery, [orgId]);
    if (orgRes.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Organisation not found",
      });
    }

    // Check if the user exists
    const userQuery = `SELECT * FROM users WHERE userId = $1;`;
    const userRes = await dbPool.query(userQuery, [userId]);
    if (userRes.rowCount === 0) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Check if the user is already part of the organization
    const checkUserOrgQuery = `SELECT * FROM user_organisations WHERE userId = $1 AND orgId = $2;`;
    const checkUserOrgRes = await dbPool.query(checkUserOrgQuery, [
      userId,
      orgId,
    ]);
    if (checkUserOrgRes.rowCount > 0) {
      return res.status(400).json({
        status: "fail",
        message: "User is already part of the organisation",
      });
    }

    // Add the user to the organisation
    const insertQuery = `
        INSERT INTO user_organisations (userId, orgId)
        VALUES ($1, $2)
        RETURNING *;
      `;
    await dbPool.query(insertQuery, [userId, orgId]);

    res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  } catch (err) {
    console.error("Error adding user to organisation:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  getOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
};
