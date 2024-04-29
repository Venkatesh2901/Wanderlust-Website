const Listing = require("../models/listing");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError");

//Index
module.exports.index = async(req,res)=>{                   
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};


//New 
module.exports.renderNewform = (req,res)=>{
    res.render("listings/new.ejs");
};


//Show Listings
module.exports.showListings = async (req,res)=>{       // '/:id':/listings/:id
    let {id} = req.params;
     const listing = await Listing.findById(id)
     .populate({
       path:"reviews",
       populate:{
         path:"author",
       },
     })
     .populate("owner");
 
     if(!listing){                                                 //if access deleted listings
       req.flash("error", "Listing you requested does not exits!");
       res.redirect("/listings");
     }
 
    res.render("listings/show.ejs",{listing});
};


//Create Listings
module.exports.createListings = async (req,res)=>{

  let result = listingSchema.validate(req.body);
  if(result.error){
    throw new ExpressError(404,result.error);
  }
  
  let url = req.file.url;
  let filename = req.file.original_filename;
  
  const newListings = new Listing(req.body.listing);

  newListings.owner = req.user._id;
  newListings.image = {url,filename};

  await newListings.save();

  req.flash("success","New Listing Created!");
  res.redirect("/listings");
};


//Edit
module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    
    if(!listing){                                                 //if access deleted listings
     req.flash("error", "Listing you requested does not exits!");
     res.redirect("/listings");
    } 
     
    res.render("listings/edit.ejs",{listing});
};


// Update
module.exports.updatedListings = async (req, res) => { 
    let result = listingSchema.validate(req.body);
     if(result.error){
       throw new ExpressError(404,result.error);
     }
    let { id } = req.params;
 
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if( typeof req.file !== "undefined"){               // new image 
      let url = req.file.url;
      let filename = req.file.original_filename;
      listing.image ={url,filename};
      await listing.save();
    }
   

    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};


// Delete
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

// filter listings 
module.exports.filterListings = async (req, res, next) => {
    const { q } = req.params;
    const filteredListings = await Listing.find({category: q }).exec();
   
    if (!filteredListings.length) {
       req.flash("error", "No Listings exists for this filter!");
        res.redirect("/listings");
        return;
    }
   
    res.locals.success = `Listings Filtered by ${q}`;
     
    res.render("listings/index.ejs", { allListings: filteredListings });
}


//search Listings
module.exports.search = async (req, res) => {
  const input = req.query.q.trim().replace(/\s+/g, ' '); // Get and sanitize search query
   
  if (!input) {
      req.flash('error', 'Search value empty!!!');  // Handle empty search query
      return res.redirect('/listings');
  }

  // Format search query
  const formattedQuery = input.split(' ').map(word =>    
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
   

  // Search listings by title
    let allListings = await Listing.find({ title: { $regex: formattedQuery, $options: 'i' } });
    if (allListings.length !== 0) {
        res.locals.success = 'Listings searched by title';
        res.render('listings/index', { allListings });
        return;
    }

  // Search listings by category
  allListings = await Listing.find({ category: { $regex: formattedQuery, $options: 'i' } });
     if (allListings.length !== 0) {
           res.locals.success = 'Listings searched by category';
         res.render('listings/index', { allListings });
         return;
   }
     
   // Search listings by country
    allListings = await Listing.find({ country: { $regex: formattedQuery, $options: 'i' } });
     if (allListings.length !== 0) {
           res.locals.success = 'Listings searched by country';
         res.render('listings/index', { allListings });
         return;
     }

  // Search listings by location
  allListings = await Listing.find({ location: { $regex: formattedQuery, $options: 'i' } });
  if (allListings.length !== 0) {
    res.locals.success = 'Listings searched by location';
    res.render('listings/index', { allListings });
    return;
  }


  // Search by price if no listings found and search query can be converted to a number
  if (allListings.length === 0 && !isNaN(parseInt(input, 10))) {
      allListings = await Listing.find({ price: { $lte: parseInt(input, 10) } }).sort({ price: 1 });
  }

  // Render listings or handle redirection
  if (allListings.length > 0) {
      res.locals.success = `Listings searched by price less than and equal to ${parseInt(input, 10)}`;
      res.render('listings/index', { allListings });
  } else {
      req.flash('error', 'Listings not found !!!');
      res.redirect('/listings');
  }
};
