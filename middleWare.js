module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be singed in!");
    return res.redirect("/login");
  }
  next();
};
