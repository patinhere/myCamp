//const MongoStore = require("connect-mongo");
//const session = require("express-session");

// schema
const Campground = require("../models/campground");
const GeoData = require("../models/geoData");
// JSON
const campSite = require("./campSite");
const imageSample = require("./images");
const park = require("./park");

// connect mongo
const mongoose = require("mongoose");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl || "mongodb://127.0.0.1/campground");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

//
const seedDB = async () => {
  // reset
  await Campground.deleteMany({});
  await GeoData.deleteMany({});
  const parkName = [];
  const parkDescription = [];

  // there is no park name and desc in campground json but park id
  // take name and desc from park json keep in array
  // 93 park
  for (let i = 1; i < 93; i++) {
    parkName[i] = park[i - 1].longName;
    parkDescription[i] = park[i - 1].description;
  }

  // 248 campgrounds
  for (let i = 0; i < 247; i++) {
    // park id
    const numPark = campSite[i].park;

    // 29 images to random to each campground
    // 2 images for each campground
    const random29 = Math.floor(Math.random() * 29);
    const random29_2 = Math.floor(Math.random() * 29);

    // new data campground schema
    const camp = new Campground({
      name: `${campSite[i].longName}`,
      shortName: `${campSite[i].shortName}`,

      // image from cloudinary
      images: [
        {
          url: imageSample[random29].images,
          filename: "MyCamp/xeugixiq0ef3yreqf0b6",
        },
        {
          url: imageSample[random29_2].images,
          filename: "MyCamp/zheoixsktehvwtfig2pu",
        },
      ],
      description: `${campSite[i].description}`,
      parkDescription: parkDescription[numPark],
      location: parkName[numPark],
      latitude: `${campSite[i].latitude}`,
      longitude: `${campSite[i].longitude}`,
      toilets: `${campSite[i].toilets}`,
      showers: `${campSite[i].showers}`,
      picnicTables: `${campSite[i].picnicTables}`,
      barbecues: `${campSite[i].barbecues}`,
      drinkingWater: `${campSite[i].drinkingWater}`,
      caravans: `${campSite[i].caravans}`,
      trailers: `${campSite[i].trailers}`,
      car: `${campSite[i].car}`,
      author: "66097fdc128fea44ca6f2152",
      id: i + 1,
    });

    await camp.save();

    let long = campSite[i].longitude;
    let la = campSite[i].latitude;

    // default undefine geoData
    if (long == undefined || la == undefined) {
      long = 151.038;
      la = -34.1086;
    }
    // new data GeoData Schemea
    const geo = new GeoData({
      geometry: { coordinates: [long, la], type: "Point" },
      properties: {
        title: `${campSite[i].longName}`,
        location: parkName[numPark],
        id: camp._id,
      },
    });

    await geo.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
