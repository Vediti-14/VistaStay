const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url:String,
    filename:String,
  },

  price: {
    type: Number,
    
    min: 0,
  },

  location: {
    type: String,
    
  },

  country: {
    type: String,
  
  },
  category: {
    type: String,
    enum: ["Trending","Rooms","Castles","Iconic cities","Amazing pools","Camping","Farms","Arctic","Domes","Boat"],
    required: true
}, 
  reviews: [
    {
    type: Schema.Types.ObjectId,
    ref: "Review",

 },
 ],
 owner:{
  type:Schema.Types.ObjectId,
  ref:"User",
 },

 geometry: {
    type: {
        type: String, // "Point"
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
    }
}

 


 

});
listingSchema.post("findOneAndDelete",async(listing)=>{

  if(listing){
    await Review.deleteMany({_id:{$in: listing.reviews}});
  }


})



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
