const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");

const Review = require("../models/Review");

// means that we are able to merge route, for example: /bootcamps/reviews...
const router = express.Router({ mergeParams: true });

// middleware for advanced Results
const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);

// the syntax :id, it is a express syntax.
// it will route /anything, and then
// req.params.id will be set to "anything"
router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);
// .put(updateReview);
// .put(protect, authorize("publisher", "admin"), updateCourse);
// .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
