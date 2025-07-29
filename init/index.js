const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then((res) =>{
    console.log("Connected to MongoDB");
}).catch((err) =>{
    console.log("Error connecting to MongoDB");
});

async function main(){                     // use for taking data in database
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "688510721488dddc6a05360c" })); // Set a default owner ID
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
  };
  
  initDB();