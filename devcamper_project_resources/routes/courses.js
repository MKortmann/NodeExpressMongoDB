const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");

// middleware for advanced Results
const advancedResults = require("../middleware/advancedResults");

const router = express.Router({ mergeParams: true });

const { protect } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, addCourse);
// the syntax :id, it is a express syntax.
// it will route /anything, and then
// req.params.id will be set to "anything"
router
  .route("/:id")
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

module.exports = router;
