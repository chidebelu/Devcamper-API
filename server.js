const express = require("express");
require("dotenv").config();
const connectDb = require("./db");
const BootcampRoute = require("./routes/BootcampRoute");
const CoursesRoute = require("./routes/CoursesRoutes");

connectDb();
const app = express();
app.use(express.json());
app.use("/api/v1/bootcamps", BootcampRoute);
app.use("/api/v1/courses", CoursesRoute);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is up and running in ${process.env.mode} mode, Port ${PORT}`
  )
);
