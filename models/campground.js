const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtual: true } };

const CampgroundSchema = new Schema(
  {
    name: String,
    shortName: String,
    location: String,
    images: [ImageSchema],
    description: String,
    parkDescription: String,
    latitude: String,
    longitude: String,
    toilets: String,
    showers: String,
    picnicTables: Boolean,
    barbecues: String,
    drinkingWater: Boolean,
    caravans: Boolean,
    trailers: Boolean,
    car: Boolean,
    id: Number,
    geoData: {
      type: Schema.Types.ObjectId,
      ref: "geoData",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.virtual("properties.UrlId").get(function () {
  return this._id;
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
