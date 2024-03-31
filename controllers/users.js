const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Logged out!");
    res.redirect("/campgrounds");
  });
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to MyCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;
  req.flash("success", "Welcome Back!  ");
  req.flash("success", username);
  const redirectURL = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectURL);
};
