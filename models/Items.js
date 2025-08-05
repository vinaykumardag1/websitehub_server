const mongoose=require("mongoose")
const ItemSchema = new mongoose.Schema({
  websitename: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  description: String,
  image: String, // URL to logo or thumbnail
  category: { type: String, required: true }, // e.g., "Productivity", "Design", "AI Tools"
  mobileApp: String, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  ai: Boolean, 
  pricingType: {
    type: String,
    enum: ['free', 'freemium', 'paid'],
    default: 'free',
  },
  pricingDetails: String, 
  tags: [String], 
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  features: [String], // e.g., ["API access", "No login required", "Dark mode"]
  language: String, // e.g., "English", "Multilingual"
  country: String, // e.g., "USA", "Germany", or region of focus
});
const Item=mongoose.model("items",ItemSchema)
module.exports=Item;

