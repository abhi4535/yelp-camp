const express = require("express");
const app = express();
const path = require("path");
const campground = require("./models/campground");
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makeCampground", async (req, res) => {
  const camp = new campground({
    title: "my backyard",
    description: "this is very cheap",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("serving port 3000");
});
