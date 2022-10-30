const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getAllStudents,
  createStudent,
  login,
  addTeacher,
  removeTeacher,
} = require("../controllers/students");

router.route("/login").post(login);
router.route("/").get(getAllStudents).post(createStudent);
router.route("/favourite").patch(auth, addTeacher).delete(auth, removeTeacher);

module.exports = router;
