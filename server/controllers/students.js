const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  CustomAPIError,
} = require("../errors");

const getAllStudents = asyncWrapper(async (req, res) => {
  let students = await Student.find({});
  students = students.map((student) => {
    return {
      _id: student._id,
      username: student.username,
      favourite: student.favourite,
    };
  });
  res.status(StatusCodes.OK).json(students);
});

const createStudent = asyncWrapper(async (req, res) => {
  // Request body must contain username and password as per schema
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json({ student });
});

const login = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const student = await Student.findOne({ username });
  if (!student) {
    throw new UnauthenticatedError("Invalid Username");
  }
  const isPasswordCorrect = await student.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }

  const token = student.createJWT();
  res.status(StatusCodes.OK).json({
    student: { username },
    token,
  });
});

const addTeacher = asyncWrapper(async (req, res) => {
  // For authorization needs token in request header

  const { userId: id } = req.user;
  const { teacherId } = req.body;
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new CustomAPIError("Teacher does not exist", StatusCodes.NOT_FOUND);
  }
  const student = await Student.findByIdAndUpdate(
    id,
    { $addToSet: { favourite: teacherId } },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).send("Added teacher");
});

const removeTeacher = asyncWrapper(async (req, res) => {
  const { userId: id } = req.user;
  const { teacherId } = req.body;
  await Student.updateOne(
    { _id: id },
    {
      $pullAll: {
        favourite: [teacherId],
      },
    }
  );
  res
    .status(StatusCodes.OK)
    .send(`Successfully removed teacher from favourites.`);
});

module.exports = {
  getAllStudents,
  createStudent,
  login,
  addTeacher,
  removeTeacher,
};
