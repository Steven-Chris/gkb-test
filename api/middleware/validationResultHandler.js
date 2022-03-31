const { validationResult } = require("express-validator");
const constantConfig = require("../../config/constantConfig");
module.exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));

  return res.status(constantConfig.SUCCESS_CODE).json({
    status: constantConfig.ERROR,
    message: extractedErrors[0],
  });
};
