const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  }
  
  main()
  .then(()=>{
    console.log("Connected to DB");
  })
  .catch((err)=>{
     console.log(err);
  });

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj,owner:"662e18c720e630b7cd6f64c2"})); //map function create new array store in prev 
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
} 

initDB();

