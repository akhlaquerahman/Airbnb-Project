const axios = require("axios");
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",},}).populate("owner",); // Populate owner field with username
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // return added ✅
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res) => {
    const { location } = req.body.listing;

    // 1. Call OpenCage API for geocoding
    const geoResponse = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
        params: {
            key: process.env.OPENCAGE_API_KEY,
            q: location,
            limit: 1,
        },
    });

    const coordinates = geoResponse.data.results[0]?.geometry;

    if (!coordinates) {
        req.flash("error", "Invalid location. Please try again.");
        return res.redirect("/listings/new");
    }

    // 2. Handle image from multer/cloudinary
    let url = req.file.path;
    let filename = req.file.filename;

    // 3. Create and save the listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = {
        type: "Point",
        coordinates: [coordinates.lng, coordinates.lat],
    };

    await newListing.save();
    req.flash("success", "New Listing Created ✅");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings"); // return added ✅
    }

    let originalImageUrl = listing.image.url; // Store the original image URL
    originalImageUrl = originalImageUrl.replace(/\/upload\//, "/upload/w_250/"); // Adjust the URL to show a smaller version
    res.render("listings/edit.ejs", { listing, originalImageUrl }); // Pass the original image URL to the template
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
    let url = req.file.path; // Cloudinary image URL
    let filename = req.file.filename;

    listing.image.url = url;        // ✅ Store only string in url
    listing.image.filename = filename;  // ✅ Store filename separately
    await listing.save();
}


    req.flash("success", "Listing Updated Successfully ✨");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted 🗑️");
    res.redirect("/listings");
}