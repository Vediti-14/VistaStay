const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// ---- Nested booking routes for a specific listing ----
router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("bookings/new", { listing });
}));

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24));
    const totalPrice = days * listing.price;

    const booking = new Booking({
        listing: listing._id,
        user: req.user._id,
        checkIn,
        checkOut,
        totalPrice
    });

    await booking.save();
    req.flash("success", "Booking confirmed!");
    res.redirect("/bookings/my"); // redirect to user's bookings
}));

// ---- NEW: Separate router for "my bookings" ----
const myBookingRouter = express.Router(); // no mergeParams needed
myBookingRouter.get("/bookings/my", isLoggedIn, wrapAsync(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate({
            path: "listing",
            populate: {
                path: "reviews",
                populate: { path: "author" } // populate review author
            }
        })
        .populate("user"); // populate the user who booked

    res.render("bookings/index", { bookings });
}));

module.exports = { bookingRouter: router, myBookingRouter };
