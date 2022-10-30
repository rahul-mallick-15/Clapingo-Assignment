const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const asyncWrapper = require("../middleware/async");
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors");

const getAllTeacher = asyncWrapper(async (req, res) => {
  let teachers = await Teacher.find({});
  teachers = teachers.map((teacher) => {
    return { _id: teacher._id, username: teacher.username };
  });
  res.status(StatusCodes.OK).json(teachers);
});

const createTeacher = asyncWrapper(async (req, res) => {
  // Request body must contain username and password as per schema
  const teacher = await Teacher.create(req.body);
  res.status(StatusCodes.CREATED).json({ teacher });
});

const deleteTeacher = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const teacher = await Teacher.findByIdAndDelete(id);
  if (!teacher) {
    throw new CustomAPIError(
      `No teacher with id : ${id}`,
      StatusCodes.NOT_FOUND
    );
  }
  res.status(StatusCodes.OK).json({ teacher });
});

const mostFavourite = asyncWrapper(async (req, res) => {
  const result = await Student.aggregate([
    { $unwind: "$favourite" },
    {
      $group: {
        _id: "$favourite",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $limit: 1,
    },
  ]);
  const teacher = await Teacher.findById(result[0]._id);
  res.status(StatusCodes.OK).json({ username: teacher.username });
});

module.exports = { getAllTeacher, createTeacher, deleteTeacher, mostFavourite };
