const express = require("express");
const router = express.Router();
const userValidator = require("../middleware/inputValidation");
const { AC_auth } = require("../middleware/tokenAuthentication");
const { validate } = require("../middleware/validationResultHandler");
const userController = require("../../api/controllers/userController");

router.post(
  "/signup",
  userValidator.signupValidate(),
  validate,
  userController.signUp
);
router.post("/login", userController.login);
router.post("/logout", AC_auth, userController.logout);
router.get("/getAll", AC_auth, userController.getAllUsers);
module.exports = router;
