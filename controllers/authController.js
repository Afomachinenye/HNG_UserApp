const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Organisation = require("../models/Organisation");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({
      errors: [
        { field: "firstName", message: "First name is required" },
        { field: "lastName", message: "Last name is required" },
        { field: "email", message: "Email is required" },
        { field: "password", message: "Password is required" },
      ],
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.createOrganisation({
      name: `${firstName}'s Organisation`,
      description: `${firstName}'s default organisation`,
      creatorId: user.userId,
    });

    const token = generateToken(user.userId, user.email);
    console.log(token);
    console.log(user.userId);
    console.log(organisation.orgId);
    await Organisation.addUserToOrganisation(user.userId, organisation.orgId);

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const login = async (req, res) => {
  console.log("Login in progress");
  const { email, password } = req.body;

  try {
    const user = await User.findUserByEmail(email);
    // console.log(user);
    // console.log(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication fbnailed",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Authentication failed",
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: token,
        user: {
          userId: user.userid,
          firstName: user.firstname,
          lastName: user.lastname,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  register,
  login,
};
