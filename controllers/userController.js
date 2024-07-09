const User = require("../models/User");
const Organisation = require("../models/Organisation");

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.getUserWithOrganizations(id);

    if (!result.user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "User record retrieved successfully",
      data: {
        userId: result.user.userid,
        firstName: result.user.firstname,
        lastName: result.user.lastname,
        email: result.user.email,
        phone: result.user.phone,
        // organisations: result.organisations,
      },
    });
  } catch (error) {
    console.error("Error retrieving user record:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUser,
};
