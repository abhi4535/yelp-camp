const mongoose = require("mongoose");
const campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (arry) => arry[Math.floor(Math.random() * arry.length)];

const seedDb = async () => {
  await campground.deleteMany();
  for (let i = 0; i < 50; i++) {
    const randAct = `${sample(descriptors)} ${sample(places)}`;
    const rand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const newCamp = new campground({
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${randAct}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quis? Porro repudiandae perspiciatis soluta necessitatibus quo autem modi fugit quas accusantium molestias magni dolorum ad eligendi, cupiditate adipisci voluptatum totam!",
      image: `https://picsum.photos/400?random=${Math.random()}`,
      price,
    });
    await newCamp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
