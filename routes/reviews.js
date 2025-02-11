const express = require("express");
const router = express.Router();
const { reviewSchema } = require("../Schemas");
const Review = require("../models/review");
const wrapAsync = require("../utils/wrapAsync");
const campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((err) => err.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/campgrounds/:id/reviews",
  validateReview,
  wrapAsync(async (req, res, next) => {
    const camp = await campground.findById(req.params.id);
    const review = new Review({ ...req.body.Review });
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/campgrounds/:id/review/:reviewId",
  wrapAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
