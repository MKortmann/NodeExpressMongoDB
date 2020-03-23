//Entry point of our application

const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// router files
const bootcamps = require("./routes/bootcamps");

const app = express();

// app.use(logger);
// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers with the address! So in the bootcamp.js we only need to write "/"
app.use("/api/v1/bootcamps", bootcamps);

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
  // Close Server
  server.close(() => {
    process.exit(1);
  });
});
