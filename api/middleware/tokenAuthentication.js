const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const constantConfig = require("../../config/constantConfig");

module.exports.AC_auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.AC_TOKEN_SECRET);
    console.log(decoded);
    const user = await User.findOne({
      _id: decoded.user._id,
      ac_token: token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({
      status: constantConfig.ERROR,
      message: constantConfig.INVALID_TOKEN,
    });
  }
};

module.exports.REF_auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.REF_TOKEN_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      ref_token: token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({
      status: constantConfig.ERROR,
      message: constantConfig.INVALID_TOKEN,
    });
  }
};
