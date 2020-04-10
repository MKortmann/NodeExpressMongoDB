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

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      // Math.ceil remove the decimals and convert the result to an integer
      averageCost: Math.ceil(obj[0].averageCost),
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
/*Yeah, with these Mongoose methods, you must use the function() {} syntax, 
as opposed to arrow functions. It deals with the issue of this and what Mongoose
 expects the scoping to be.*/
CourseSchema.post("save", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.post("remove", function () {
  this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);
