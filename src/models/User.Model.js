const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = mongoose.Schema(
  {
    user_name: {
      type: String,
      require: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    full_name: {
      type: String,
      require: true,
    },
    email_address: {
      type: String,
      require: true,
      unique: true,
      index: true,
    },
    user_password: {
      type: String,
      require: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

User.pre("save", async function (next) {
  if (this.isModified("user_password")) {
    this.user_password = await bcrypt.hash(this.user_password, 10);
  }
  next();
});

User.methods.isPasswordCorrect = async (user_password) => {
  return await bcrypt.compare(user_password, this.user_password);
};

User.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      user_name: this.user_name,
      full_name: this.full_name,
      email_address: this.email_address,
    },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "1h" }
  );
};

User.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "10d" }
  );
};

module.exports = mongoose.model("User", User);
