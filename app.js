if(process.env.NODE_ENV!="production"){
   require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

const port = process.env.PORT || 8080;

const dbUrl = process.env.ATLASTDB_URL;

async function main(){
  await mongoose.connect(dbUrl);
};
main().then(()=>{
  console.log("Connected to DB");
}).catch((err)=>{
   console.log(err);
});

const store = MongoStore.create({
   mongoUrl : dbUrl,
   crypto:{
     secret:process.env.SECRET,
   },
   touchAfter: 24 * 3600, // 24 hours
});

store.on("error",(err)=>{
    console.log("Error in mongodb session store",err);
});

const sessionOptions ={ 
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
});

// listings 
app.use("/listings",listingRouter);

// Reviews 
app.use("/listings/:id/reviews",reviewRouter);

// User Signup
app.use("/",userRouter);

//Error Handling
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"Page Not Found!"));
});

//Error Handling Middleware
app.use((err,req,res,next)=>{
   let {statusCode=505,message="Something went wrong"} = err;
   res.status(statusCode).render("listings/error.ejs",{message});
});

app.listen(port,()=>{
    console.log(`server is listening to port : ${port}`);
});
