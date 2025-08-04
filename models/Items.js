const mongoose = require("mongoose");

const Item = new mongoose.Schema({
  websitename: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  description: String,
  image: String,
  category: { type: String, required: true },
  mobileApp: String, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Items", Item);

