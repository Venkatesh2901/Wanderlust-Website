const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const dbUrl = process.env.ATLASTDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
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
    initData.data = initData.data.map((obj)=>({ ...obj,owner:"662fb96942ceccac7a6dcbdb"})); //map function create new array store in prev 
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
} 

initDB();

