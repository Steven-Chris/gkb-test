const constantConfig = require("../../config/constantConfig");
const { handleError } = require("../lib/errorHandling");
const User = require("../../models/userModel");

module.exports.refreshTokenController = async (req, res) => {
  const user_id = req.body.user_id;
  try {
    const user = await User.findById(user_id).exec();
    console.log("generate access token", user);

    const ac_token = await user.generateACToken();
    const { name, ref_token } = user;
    res.status(201).json({ user_id, ac_token, ref_token, name });
  } catch (err) {
    handleError("error", err, "");
    return res.status(constantConfig.INTERNAL_SERVER_ERROR).json({
      status: constantConfig.ERROR,
      message: constantConfig.SOMETHING_WENT_WRONG,
    });
  }
};
