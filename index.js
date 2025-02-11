const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const campground = require("./models/campground");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./Schemas");
const Review = require("./models/review");
const campRoute = require("./routes/campground");
const reviewRoute = require("./routes/reviews");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

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
