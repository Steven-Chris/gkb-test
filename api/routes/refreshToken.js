const express = require("express");
const router = express.Router();
const { REF_auth } = require("../middleware/tokenAuthentication");
const {
  refreshTokenController,
} = require("../controllers/refreshTokenController");

router.post("/refresh", REF_auth, refreshTokenController);
module.exports = router;
