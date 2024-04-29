const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");

const {isLoggedIn} = require("../middleware.js");
const {isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//Post Route
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));   // '/': /listings/:id/reviews
                                                       
// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));    
 
module.exports = router;