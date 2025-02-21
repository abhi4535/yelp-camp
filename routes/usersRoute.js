const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("userAuth/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const newUser = new user({ email, username });
      const registeredUser = await user.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "welcome to Yelp-Camp");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", "username already exits!");
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("userAuth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back!");
    res.redirect("/campgrounds");
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
