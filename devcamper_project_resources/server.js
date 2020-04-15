//Entry point of our application

const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// router files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

const app = express();

// Body parser: to be used in console! We send json, then to be correctly displayed should be parser.
app.use(express.json());
// Cookie parser
app.use(cookieParser());

// app.use(logger);
// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// Sanitize data: security to avoid NoSQL injections
app.use(mongoSanitize());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers with the address! So in the bootcamp.js we only need to write "/"
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
// important: the errorHandler should be post after the bootcamps because It is executed in a linear order
app.use(errorHandler);

// app.get("/", (req, res) => {
//   // res.send("<h1>Hello from express</h1>");
//   // res.json({ name: "Brad" });
//   res.status(200).json({ success: true, data: { id: 1 } });
// });

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close Server & Exit process
  server.close(() => {
    process.exit(1);
  });
});
