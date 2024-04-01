const Campground = require("../models/campground");
const GeoData = require("../models/geoData");
const ExpressError = require("../utils/ExpressError");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
const geoData = require("../models/geoData");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  const geodatas = await GeoData.find({});
  // console.log(geodatas);
  if (!campgrounds) {
    console.log("404");
    return next(new ExpressError("Campground Not Found", 404));
  }
  res.render("campgrounds/index", { campgrounds, geodatas });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  if (!req.body.campground)
    throw new ExpressError("Invalid Campground Data, 400");

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const geolongla = geoData.body.features[0].geometry.coordinates;

  if (
    parseFloat(geolongla[1]) >= -28 ||
    parseFloat(geolongla[1]) <= -37 ||
    parseFloat(geolongla[0]) >= 153 ||
    parseFloat(geolongla[0]) <= 141
  ) {
    req.flash("error", "The location is not in NSW");
    res.redirect(`/campgrounds/new`);
    return;
  }

  const campground = new Campground(req.body.campground);
  campground.longitude = geolongla[0];
  campground.latitude = geolongla[1];
  campground.images = req.files.map((multer) => ({
    url: multer.path,
    filename: multer.filename,
  }));
  campground.author = req.user._id;
  await campground.save();

  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    res.redirect("/campgrounds");
    return;
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  if (!req.body.campground) throw new ExpressError("Campground Not Found", 400);

  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const geolongla = geoData.body.features[0].geometry.coordinates;
  const { id } = req.params;

  if (
    parseFloat(geolongla[1]) >= -28 ||
    parseFloat(geolongla[1]) <= -37 ||
    parseFloat(geolongla[0]) >= 153 ||
    parseFloat(geolongla[0]) <= 141
  ) {
    req.flash("error", "The location is not in NSW");
    res.redirect(`/campgrounds/${id}/edit`);
    return;
  }

  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  campground.longitude = geolongla[0];
  campground.latitude = geolongla[1];
  await campground.save();

  //console.log(campground);
  const imgs = req.files.map((multer) => ({
    url: multer.path,
    filename: multer.filename,
  }));
  campground.images.push(...imgs);

  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect(`/campgrounds`);
};
