const Review = require("../models/review");
const Listing = require("../models/listing");
const {reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = async (req,res)=>{             
    let result = reviewSchema.validate(req.body);
    if(result.error){
      throw new ExpressError(404,result.error);
    }
 
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review);
     
     newReview.author = req.user._id;
 
     listing.reviews.push(newReview);
 
     await newReview.save();
     await listing.save();
 
     req.flash("success","New Review Created!");
     res.redirect(`/listings/${listing._id}`);
};


module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");

    res.redirect(`/listings/${id}`);
};