const router = require("express").Router();

const {
  getAllTeacher,
  createTeacher,
  deleteTeacher,
  mostFavourite,
} = require("../controllers/teacher");

router.route("/").get(getAllTeacher).post(createTeacher);
router.route("/:id").delete(deleteTeacher);
router.route("/most-favourite").get(mostFavourite);

module.exports = router;
