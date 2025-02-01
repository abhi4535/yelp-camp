const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("campground", campgroundSchema);
