// creating Major Project
if(process.env.NODE_ENV != "production") { // check if environment is not production
    require("dotenv").config();
}

const express = require("express");     // Require express for use
const app = express();
const mongoose = require("mongoose");   // Require mongoose for use database
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");       // use for boilerplate
const ExpressError = require("./Utils/ExpressError.js");
const session = require("express-session"); // use for session
const MongoStore = require("connect-mongo"); // use for store session in mongoDB
const flash = require("connect-flash"); // use for flash message
const passport = require("passport"); // use for passport
const User = require("./models/user.js"); // use for user model
const LocalStrategy = require("passport-local"); // use for local strategy


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const dbUrl = process.env.ATLASDB_URL;


main().then((res) =>{
    console.log("Connected to MongoDB");
}).catch((err) =>{
    console.log("Error connecting to MongoDB");
});

async function main(){                     // use for taking data in database
    await mongoose.connect(dbUrl);
}

// For use find ejs file
app.set("view engine", "ejs");                      // use ejs file
app.set("views", path.join(__dirname, "views"));    // use ejs file
app.use(express.urlencoded({extended: true}));      // use for accept parameter
app.use(methodOverride("_method"));                 // use for use method-override
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// use for store session in mongoDB
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET, // secret key for encrypting session
    },
    touchAfter: 24 * 3600 // 1 day
});

store.on("error", function(e) {
    console.log("Session Store Error", e); // log error if session store error
});

 const sessionOptions = {
    store, // use store for session
    secret: process.env.SECRET, // secret key for session
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // save uninitialized session
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // cookie expires in 7 days
        maxAge: 7 * 24 * 60 * 60 * 100, // cookie max age in milliseconds
        httpOnly: true, // prevent client-side access to cookie
    }
 };

// First Root path
// app.get("/", (req, res) =>{
//     res.send("Hi I am Route");
// });

app.use(session(sessionOptions)); // use session
app.use(flash()); // use flash message

app.use(passport.initialize()); // initialize passport
app.use(passport.session()); // use session for passport
passport.use(new LocalStrategy(User.authenticate())); // use local strategy for authentication

passport.serializeUser(User.serializeUser()); // serialize user
passport.deserializeUser(User.deserializeUser()); // deserialize user


app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // use flash message
    res.locals.error = req.flash("error"); // use flash message
    res.locals.currentUser = req.user; // use current user
    next(); // next middleware
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    });
    let registeredUser = await User.register(fakeUser, "helloworld"); // register a fake user
    res.send(registeredUser); // send registered user
});    

app.use("/listings", listingRouter); // use listing route
app.use("/listings/:id/reviews", reviewRouter); // use review route
app.use("/", userRouter); // use user route


//for all invalid route 
app.all("*", (req, res,next) =>{ // use for all method
    next(new ExpressError("Page Not Found", 404)); // 404 error
});

app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error.ejs", { err });
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});