const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const geoData = new Schema({
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  properties: {
    title: { type: String, required: true },
    location: { type: String, required: true },
    id: { type: String, required: true },
  },
});

module.exports = mongoose.model("GeoData", geoData);
