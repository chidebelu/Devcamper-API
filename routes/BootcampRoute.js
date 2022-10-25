const express = require("express");
const {
  UpdateBootcamp,
  CreateBootcamp,
  AdvancedBootcampQuery,
  QueryBootcamps,
  DeleteBootcamp,
  GetAllBootcamps,
  GetBootcampRadius,
  GetSingleBootcamp,
} = require("../controllers/BootcampController");

//Include other resource routers
const courseRouter = require("./CoursesRoutes");

const router = express.Router();
//Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.post("/", CreateBootcamp);
router.delete("/:id", DeleteBootcamp);
router.put("/:id", UpdateBootcamp);
router.get("/:id", GetSingleBootcamp);
router.get("/radius/:zipcode/:distance", GetBootcampRadius);
router.get("/", GetAllBootcamps);
router.get("/query", AdvancedBootcampQuery);
router.get("/querybootcamp", QueryBootcamps);

module.exports = router;
