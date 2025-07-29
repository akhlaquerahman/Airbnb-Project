const express = require('express');
const router = express.Router({mergeParams: true}); // Allow nested routes to access params
const wrapAsync = require("../Utils/wrapAsync.js");
const ExpressError = require("../Utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

// Middleware to validate review data

const validateReview = (req, res, next) =>{
    let {error} = reviewSchema.validate(req.body)
        if(error){
            let errMsg = err.details.map((el)=>el.message).join(",");
            throw new ExpressError(401, errMsg);
        }else{
            next();
        }
}

//Review Route
//Post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

// Export the router
module.exports = router;