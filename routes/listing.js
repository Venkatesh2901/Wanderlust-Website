const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
  .route("/")                                // '/' : /listings,
   //Index Route
  .get(listingController.index)              //listingController.index: fnc callback
   //Create Route
   .post(isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListings));
 
   
//New Route
router.get("/new",isLoggedIn,listingController.renderNewform );

//Search 
router.get("/search",wrapAsync(listingController.search));  // write it before id 

router
    .route("/:id")                         // '/:id': /listings/:id
    //Show Route
   .get(isLoggedIn,wrapAsync(listingController.showListings))
   // Update Route
   .put(isLoggedIn, isOwner, upload.single("listing[image]"),wrapAsync(listingController.updatedListings))
   // Delete Route
   .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
 

//filter 
router.get("/filter/:q", wrapAsync(listingController.filterListings));



module.exports = router;