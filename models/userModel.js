const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    ac_token: {
      type: String,
    },
    ref_token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
// tokens: [
//   {
//     token: {
//       type: String,
//       required: true,
//     },
//   },
// ],

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

let AC_TOKEN_SECRET = process.env.AC_TOKEN_SECRET;
userSchema.methods.generateACToken = async function () {
  const user = this;
  const token = jwt.sign({ user }, AC_TOKEN_SECRET, {
    expiresIn: "10m",
  });

  user.ac_token = token;
  await user.save();

  return token;
};

let REF_TOKEN_SECRET = process.env.REF_TOKEN_SECRET;

userSchema.methods.generateREFToken = async function () {
  const user = this;
  const token = jwt.sign(
    { user },
    // "*^FEYGF#RG*&EF%#RR@YT#r8UDAHGFEB(#@*#^*YBYB*&#@*@&",
    REF_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  user.ref_token = token;
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (mobile, password) => {
  const user = await User.findOne({ mobile });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
