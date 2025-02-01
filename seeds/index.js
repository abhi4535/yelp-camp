const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (arry) => arry[math.floor(math.random() * arry.length)];

const seedDb = async () => {
  await campground.deleteMany();
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const newCamp = new campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${sample[descriptors]} ${sample[places]}`,
    });
    await newCamp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
