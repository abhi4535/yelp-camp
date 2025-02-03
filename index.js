const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const campground = require("./models/campground");
const ejsMate = require("ejs-mate");
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await campground.find();
  res.render("campground/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campground/new");
});

app.post("/campgrounds", async (req, res) => {
  const newCamp = new campground(req.body.campground);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  res.render("campground/show", { camp });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const camp = await campground.findById(req.params.id);
  res.render("campground/edit", { camp });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${camp._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("serving port 3000");
});
