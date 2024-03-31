const express = require("express");
const catchAsync = require("../utils/catchAsync");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(users.login)
  );

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router.get("/logout", users.logout);

module.exports = router;
