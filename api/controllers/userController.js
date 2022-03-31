const User = require("../../models/userModel");
const { handleError } = require("../lib/errorHandling");
const constantConfig = require("../../config/constantConfig");

// const auth = require("../middleware/auth");

module.exports.signUp = async (req, res) => {
  if (req.body.role) {
    return res.status(constantConfig.FORBIDDEN_CODE).json({
      status: constantConfig.ERROR,
      message: constantConfig.FORBIDDEN_REQUEST,
    });
  }
  const user = new User(req.body);
  try {
    await user.save();
    const { name, _id } = user;
    const ac_token = await user.generateACToken();
    const ref_token = await user.generateREFToken();
    res.status(201).json({ name, _id, ac_token, ref_token });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.INTERNAL_SERVER_ERROR).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.mobile,
      req.body.password
    );
    console.log(req.body);
    const { name, _id } = user;
    const ac_token = await user.generateACToken();
    const ref_token = await user.generateREFToken();
    res.status(201).json({ name, _id, ac_token, ref_token });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.ERROR_CODE).json({
      status: constantConfig.ERROR,
      message: constantConfig.INVALID_CRED,
    });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select([
      "name",
      "mobile",
      "latitude",
      "longitude",
      "role",
      "createdAt",
    ]);
    res.status(200).json({
      status: constantConfig.SUCCESS,
      message: "Here are all the users",
      users,
    });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.ERROR_CODE).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    req.user.ac_token = null;
    req.user.ref_token = null;
    await req.user.save();
    return res.json({ message: "Logged out " });
  } catch (e) {
    res.status(500).send(e);
  }
};

module.exports.currentUser = async (req, res) => {
  res
    .status(constantConfig.SUCCESS_CODE)
    .json({ status: constantConfig.SUCCESS, user: req.user });
};
