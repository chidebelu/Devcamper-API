const express = require("express");
require("dotenv").config();
const connectDb = require("./db");
const Bootcamp = require("./models/Bootcamp");
const geocoder = require("./utils/geocoder");

connectDb();
const app = express();
app.use(express.json());
app.post("/api/v1/bootcamp", async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      msg: "Bootcamp Created",
      bootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

app.get("/api/v1/bootcamp", async (req, res, next) => {
  try {
    const fetchbootcamps = await Bootcamp.find();
    res.status(200).json({
      success: true,
      count: fetchbootcamps.length, // For the client to know excatly how many results are remaining in the database.
      data: fetchbootcamps,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

app.get("/api/v1/bootcamp/:id", async (req, res) => {
  try {
    const fetchbootcamp = await Bootcamp.findById(req.params.id);

    res.status(200).json({
      success: true,
      fetchbootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

app.put("/api/v1/bootcamp/:id", async (req, res) => {
  try {
    const updatebootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      success: true,
      msg: "Bootcamp Updated",
      updatebootcamp,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.message,
    });
  }
});

app.delete("/api/v1/bootcamp/:id", async (req, res) => {
  try {
    await Bootcamp.findByIdAndDelete(req.params.id, req.body);
    res.status(200).json({
      success: true,
      msg: "Bootcamp Deleted",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.msg,
    });
  }
});

app.get("/api/v1/bootcamp/radius/:zipcode/:distance", async (req, res) => {
  const { zipcode, distance } = req.params;
  //Get latitude/longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //calc radius using radians
  //Divide distance by radius of Earth
  //Earth radius = 3,963 miles || 6,378 km

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

app.get("/", async (req, res) => {
  //Querying the Database with greater than(gte) or equal to, less than or equal to (lte) and adding money sign to the result
  // Check https://www.mongodb.com/docs/manual/reference/operator/query/ for more comparism operators.
  let query;
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr));
  const bootcamps = await query;
  res.status(200).json({
    succes: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

app.get("/que", async (req, res) => {
  let query;

  //Copy req.query
  const reqQuery = { ...req.query };
  console.log(reqQuery);
  //Fields to exclude
  const removeFields = ["select"]; // We are doing this so the compiler will understand that we don't want to match a document in the model. we just want to make use of the mongoose method "select"

  //Loop over removefields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  //Create query string
  let queryStr = JSON.stringify(reqQuery);

  //Create operators
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }
  //Sort by descending order by adding a minus sign to createdAt "-createdAt"
  else {
    query = query.sort("-createdAt");
  }

  //Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 1; //you can set the maximum limit from 100 to 1 and get single pages
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Executing query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
  }
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server is up and running in ${process.env.mode} mode, Port ${PORT}`
  )
);
