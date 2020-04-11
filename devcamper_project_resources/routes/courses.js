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

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(addCourse);
// the syntax :id, it is a express syntax.
// it will route /anything, and then
// req.params.id will be set to "anything"
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
