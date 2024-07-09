const express = require("express");
const { authenticate } = require("../middlewares/authMiddleware");
const organisationController = require("../controllers/organisationController");

const router = express.Router();

router.get(
  "/organisations",
  authenticate,
  organisationController.getOrganisations
);
router.get(
  "/organisations/:orgId",
  authenticate,
  organisationController.getOrganisation
);
router.post(
  "/organisations",
  authenticate,
  organisationController.createOrganisation
);

router.post(
  "/api/organisations/:orgId/users",
  organisationController.addUserToOrganisation
);

module.exports = router;
