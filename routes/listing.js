const express = require('express');
const router = express.Router({ mergeParams: true }); // Allow nested routes to access params
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js"); // Import storage from cloudConfig.js
const upload = multer({ storage }); // Set up multer for file uploads

// ✅ Middleware for validation
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(401, errMsg);
    } else {
        next();
    }
};

// ✅ Search Route (must be BEFORE /:id)
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const listings = await Listing.find({
            $or: [
                { location: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ]
        });
        res.render('listings/index', { allListings: listings });
    } catch (err) {
        console.error("Search Error:", err);
        res.redirect('/listings');
    }
});

router.route('/')
    .get(wrapAsync(listingController.index)) // ✅ Index Route - Show All Listings
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// ✅ New Form Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// ✅ Edit Form Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // ✅ Show Route
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    ) // ✅ Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing)); // ✅ Delete Route

module.exports = router;
