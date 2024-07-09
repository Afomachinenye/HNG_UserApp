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
    console.log({ organisation });
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
  console.log(req.user);
  console.log(name);
  try {
    if (!name) {
      return res.status(422).json({
        errors: [{ field: "name", message: "Name is required" }],
      });
    }

    const organisation = await Organisation.createOrganisation({
      name,
      description,
      creatorId: userId,
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

module.exports = {
  getOrganisations,
  getOrganisation,
  createOrganisation,
};
