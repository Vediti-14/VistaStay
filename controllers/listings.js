const Listing = require("../models/listing");
const axios = require("axios");
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY; // ✅ Your OpenCage key

module.exports.index = async (req, res) => {
    const { category } = req.query; // ✅ Get category from URL query
    let allListings;
    if (category) {
        allListings = await Listing.find({ category }); // filter by category if provided
    } else {
        allListings = await Listing.find({}); // else get all
    }
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = async (req, res) => {
    const categories = ["Trending","Rooms","Castles","Iconic cities","Amazing pools","Camping","Farms","Arctic","Domes","Boat"];
    res.render("listings/new.ejs", {
        openCageKey: process.env.OPENCAGE_API_KEY,
        categories,
        listing: {} // ✅ empty object so template won't break
    });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // ✅ Pass categories here as well
    const categories = ["Trending","Rooms","Castles","Iconic cities","Amazing pools","Camping","Farms","Arctic","Domes","Boat"];

    res.render("listings/show.ejs", { listing, categories });
};

module.exports.createListing = async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);

    if (req.body.listing.geometry && Array.isArray(req.body.listing.geometry.coordinates)) {
      const rawCoords = req.body.listing.geometry.coordinates;
      const coords = rawCoords.map((c, i) => {
        const num = parseFloat(c);
        if (isNaN(num)) throw new Error(`Invalid coordinate value: ${c}`);
        return num;
      });
      newListing.geometry = {
        type: req.body.listing.geometry.type || "Point",
        coordinates: coords,
      };
    } else {
      req.flash("error", "Missing or invalid coordinates from form.");
      return res.redirect("/listings/new");
    }

    const geoResponse = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      { params: { q: req.body.listing.location, key: OPENCAGE_API_KEY } }
    );

    const geometry = geoResponse.data.results[0]?.geometry;
    if (!geometry) {
      req.flash("error", "Invalid location (Geocoding failed).");
      return res.redirect("/listings/new");
    }

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (err) {
    console.error("❌ Error creating listing:", err.message);
    req.flash("error", "Something went wrong while creating the listing.");
    res.redirect("/listings/new");
  }
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    if (req.body.listing?.geometry?.coordinates) {
        req.body.listing.geometry.coordinates = req.body.listing.geometry.coordinates.map(Number);
    }

    try {
        const listing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { new: true, runValidators: true }
        );

        if (req.file) {
            listing.image = { url: req.file.path, filename: req.file.filename };
            await listing.save();
        }

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Invalid data or category!");
        res.redirect(`/listings/${id}/edit`);
    }
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listings`);
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }

    const categories = ["Trending","Rooms","Castles","Iconic cities","Amazing pools","Camping","Farms","Arctic","Domes","Boat"];

    res.render("listings/edit.ejs", {
        listing,
        categories,
        originalImageUrl: listing.image?.url || '/placeholder.jpg'
    });
};
