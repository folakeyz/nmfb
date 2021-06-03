const express = require("express");
const { getNyifUser } = require("../controllers/nyif");

const router = express.Router();

router.route("/nyif").post(getNyifUser);

module.exports = router;
