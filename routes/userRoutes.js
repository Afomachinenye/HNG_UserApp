const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/users/:id", authenticate, getUser);

module.exports = router;
