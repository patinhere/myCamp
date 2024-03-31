const express = require("express");
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn, isAuthor, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");
const review = require("../models/review");

router.post("/", isLoggedIn, catchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isReviewAuthor,
  isLoggedIn,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
