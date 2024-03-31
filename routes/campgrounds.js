const express = require("express");
const router = express.Router();

const { isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const campground = require("../models/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    catchAsync(campgrounds.createCampground)
  );
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
