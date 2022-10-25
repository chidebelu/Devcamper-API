const Courses = require("../models/Course");
const asyncHandler = require("express-async-handler");

const GetAllCourses = asyncHandler(async (req, res) => {
  let query;

  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find();
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

module.exports = { GetAllCourses };
