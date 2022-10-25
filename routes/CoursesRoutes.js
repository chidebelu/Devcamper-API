const express = require("express");
const { GetAllCourses } = require("../controllers/CoursesController");
const router = express.Router({ mergeParams: true });

router.route("/").get(GetAllCourses);

module.exports = router;
