const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryname: { type: String, required: true, unique: true },
  description: { type: String },
  slug: { type: String, unique: true },
  image: { type: String },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});
const Categories=mongoose.model("categories",categorySchema)
modules.exports=Categories;