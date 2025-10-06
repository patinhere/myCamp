const express = require("express");
const router = express.Router();

const { isLoggedIn, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage: storage,
  limits: { fieldSize: 10 * 1024 * 1024 },
});

router
  .route("/")
  // show all camp
  .get(catchAsync(campgrounds.index))
  // create camp
  .post(
    isLoggedIn,
    upload.array("image"),
    catchAsync(campgrounds.createCampground)
  );
// show create form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
  .route("/:id")
  // show one camp
  .get(catchAsync(campgrounds.showCampground))
  // edit camp
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    catchAsync(campgrounds.updateCampground)
  )
  // delete camp
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// show edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
