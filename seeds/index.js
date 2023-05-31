const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedHelpers");
const cities = require("./cities");

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "CONNECTION ERROR:"));
db.once("open", () => {
  console.log("CONNECTED TO MONGO DATABASE");
});
const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "647092ff0b7e9feaad180599",
      location: `${cities[random1000].city},${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202]
      },
      images: [
        {
          url: "https://res.cloudinary.com/dpgftl7gz/image/upload/v1685280132/YelCamp/k6c2osglchdoijfxsdoy.jpg",
          filename: "YelCamp/k6c2osglchdoijfxsdoy",
        },
        {
          url: "https://res.cloudinary.com/dpgftl7gz/image/upload/v1685280137/YelCamp/qqwr7ne0jy0k2dnw39wb.jpg",
          filename: "YelCamp/qqwr7ne0jy0k2dnw39wb",
        },
        {
          url: "https://res.cloudinary.com/dpgftl7gz/image/upload/v1685280135/YelCamp/wshxoldf9ymiici2sdrh.jpg",
          filename: "YelCamp/wshxoldf9ymiici2sdrh",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci reiciendis vitae vero sit. Labore qui enim non numquam, ipsum provident mollitia dolorum, quia iusto repellendus et earum exercitationem officiis ad!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
