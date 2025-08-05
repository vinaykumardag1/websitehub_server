const mongoose=require("mongoose")

const TagSchema = new mongoose.Schema({
  tagname: { type: String, unique: true, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});
const tagsModel=mongoose.model("tags",TagSchema)
module.exports=tagsModel;