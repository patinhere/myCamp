const mongoose = require("mongoose");
const Campground = require("../models/campground");
const campSite = require("./campSite");
const GeoData = require("../models/geoData");
const imageSample = require("./images");
const park = require("./park");
const campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1/campground");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error:"));
db.once("open", () => {
  console.log("database connected");
});

const seedDB = async () => {
  await Campground.deleteMany({});
  await GeoData.deleteMany({});
  const parkName = [];
  const parkDescription = [];

  for (let i = 1; i < 93; i++) {
    parkName[i] = park[i - 1].longName;
  }

  for (let i = 1; i < 93; i++) {
    parkDescription[i] = park[i - 1].description;
  }

  for (let i = 0; i < 247; i++) {
    const numPark = campSite[i].park;
    const random29 = Math.floor(Math.random() * 29);
    const random29_2 = Math.floor(Math.random() * 29);
    const camp = new Campground({
      name: `${campSite[i].longName}`,
      shortName: `${campSite[i].shortName}`,
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
      author: "65fb78b7ab0a00d5ddff0ffa",
      id: i + 1,
    });

    await camp.save();

    let long = campSite[i].longitude;
    let la = campSite[i].latitude;
    if (long == undefined || la == undefined) {
      long = 151.038;
      la = -34.1086;
    }
    const geo = new GeoData({
      geometry: { coordinates: [long, la], type: "Point" },
      properties: {
        title: `${campSite[i].longName}`,
        location: parkName[numPark],
        id: camp._id,
      },
    });

    console.log(geo);
    await geo.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
