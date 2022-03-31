const { body } = require("express-validator");
const User = require("../../models/userModel");

// PRODUCT VALIDATION
module.exports.signupValidate = () => {
  return [
    body("name")
      .exists()
      .withMessage("Name is required.")
      .notEmpty()
      .withMessage("Name is required.")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Full Name length can't be more than 50."),

    body("mobile")
      .exists()
      .withMessage("Mobile is required.")
      .notEmpty()
      .withMessage("Mobile is required.")
      .trim()
      .isLength({ max: 15 })
      .withMessage("Mobile number cannot exceed more than 15 characters.")
      .custom((value) => {
        return User.findOne({ mobile: value }).then((user) => {
          if (user) {
            throw new Error("Mobile Number already Exist.");
          }
        });
      }),
  ];
};
