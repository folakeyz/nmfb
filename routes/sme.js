const express = require("express");

const { getSmeUser, getHouseholdUser } = require("../controllers/sme");

const router = express.Router();

router.route("/household").post(getHouseholdUser);
router.route("/smeSig").post(getSmeUser);

module.exports = router;
