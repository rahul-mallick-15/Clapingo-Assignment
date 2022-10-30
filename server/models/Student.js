const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const StudentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "must provide username"],
    trim: true,
    maxlength: [20, "username can not be more than 20 characters"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "must provide password"],
    trim: true,
    minlength: [8, "password can not be less than 8 characters"],
    maxlength: [20, "password can not be more than 20 characters"],
  },
  favourite: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});

StudentSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      username: this.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

StudentSchema.methods.comparePassword = function (password) {
  return password === this.password;
};

module.exports = mongoose.model("Student", StudentSchema);
