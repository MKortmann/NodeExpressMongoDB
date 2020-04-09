const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    require: [true, "Please add a course title"],
  },
  description: {
    type: String,
    required: [true, "Please addd a description"],
  },
  weeks: {
    type: String,
    required: [true, "Please addd number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please addd a tuition cose"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please addd a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    require: true,
  },
});

module.exports = mongoose.model("Course", CourseSchema);
