const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new Schema({
     title:{
        type:String,
        require:true,
     },
     description:String,
     image:{
        url:String,
        filename:String,
     },
     price:Number,
     location:String,
     country:String,
     reviews:[
        {
         type:Schema.Types.ObjectId,
         ref:"Review",
        }
     ],
     owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
     },
     category: {
      type: String,
      enum: ["Iconic cities", "Mountains", "Castles", "Amazing pools","Rooms", "Camping", "Farms", "Arctic","Boats"],
      required: true
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{    // Post Middlewares : If listing delete then all reviews od=f listings will be delete 
    if(listing){
      await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;