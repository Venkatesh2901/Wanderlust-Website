const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be loggen in to Create Listings");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
       req.flash("error","You are not the owner of listings")
       return res.redirect(`/listings/${id}`);
    }
    next()
};


module.exports.isReviewAuthor = async(req,res,next)=>{
    let { id } = req.params;
    let { reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
       req.flash("error","You are not the author of review")
       return res.redirect(`/listings/${id}`);
    }
    next()
};