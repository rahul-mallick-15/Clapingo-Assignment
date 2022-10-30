const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Teacher", TeacherSchema);
