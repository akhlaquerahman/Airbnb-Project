const mongoose = require("mongoose");   // Require mongoose for use database
const Schema = mongoose.Schema;
const Review = require("./review.js"); // Require review model

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
        },
    description: String,
    image: {
        url: String,
        filename: String,// filename is used for file upload
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
    },
],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
    type: {
        type: String,
        enum: ['Point'],
        required: true,
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
    },
},

});

listingSchema.post("findOneAndDelete", async (listing) => { 
    if(listing){
        await Review.deleteMany({
            _id: {
                $in: listing.reviews,
            },
        });
    }
});

const Listing = mongoose.model("listing", listingSchema);
module.exports = Listing;