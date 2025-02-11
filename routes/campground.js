const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { campgroundSchema } = require("../Schemas");
const campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const campgrounds = await campground.find();
    res.render("campground/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campground/new");
});

router.post(
  "/",
  validateCampground,
  wrapAsync(async (req, res, next) => {
    // if (!req.bogy.campground) throw new ExpressError("invalid input", 400);
    const newCamp = new campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findById(id).populate("reviews");
    res.render("campground/show", { camp });
  })
);

router.get(
  "/:id/edit",
  wrapAsync(async (req, res, next) => {
    const camp = await campground.findById(req.params.id);
    res.render("campground/edit", { camp });
  })
);

router.put(
  "/:id",
  validateCampground,
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
