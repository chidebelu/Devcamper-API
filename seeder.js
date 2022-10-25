const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();

//Load models
const Bootcamp = require("./models/Bootcamp");
const Courses = require("./models/Course");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/Bootcamp.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/Courses.json`, "utf-8")
);

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Courses.create(courses);
    console.log(`Data Imported`.green.inverse);
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Courses.deleteMany();
    console.log(`Data Destroyed`.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
