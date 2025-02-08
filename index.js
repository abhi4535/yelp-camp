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
const { campgroundSchema } = require("./Schemas");
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

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await campground.find();
    res.render("campground/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  wrapAsync(async (req, res, next) => {
    // if (!req.bogy.campground) throw new ExpressError("invalid input", 400);
    const newCamp = new campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findById(id);
    res.render("campground/show", { camp });
  })
);

app.get(
  "/campgrounds/:id/edit",
  wrapAsync(async (req, res, next) => {
    const camp = await campground.findById(req.params.id);
    res.render("campground/edit", { camp });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("error");
});

app.listen(3000, () => {
  console.log("serving port 3000");
});
