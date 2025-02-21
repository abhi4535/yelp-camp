const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const joi = require("joi");
const campRoute = require("./routes/campground");
const reviewRoute = require("./routes/reviews");
const session = require("express-session");
const flash = require("connect-flash");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user");
const userRoute = require("./routes/usersRoute");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisisasecret",
  resave: false,
  saveUninitialized: true,
  Cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/fakeUser", async (req, res) => {
//   const newUser = new user({
//     email: "georgeanhi4535@gmail.com",
//     username: "abhi4535",
//   });
//   const u = await user.register(newUser, "45353626");
//   res.send(u);
// });

app.use("/", userRoute);
app.use("/campgrounds", campRoute);
app.use("/", reviewRoute);

app.get("/", (req, res) => {
  res.render("home");
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("serving port 3000");
});
