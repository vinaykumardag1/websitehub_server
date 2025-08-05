const fs = require("fs");
const path = require("path");
const Items = require("../models/Items");
const Categories=require("../models/category")
const Tags=require("../models/Tags")
const {generateSlug}=require("../config/utils")

// ✅ Add new item
const addItems = async (req, res) => {
  const { websitename, websiteUrl, description } = req.body;
  const image = req.file ? req.file.filename : null;
  
  try {
    const exists = await Items.findOne({ websitename });
    if (exists) {
      return res.status(400).json({ message: "Website already exists" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image file not read" }); 
    }

    const newItem = new Items({
      websitename,
      websiteUrl,
      description,
      image,
    });

    await newItem.save();
    return res.status(201).json({ message: "Item added successfully", item: newItem }); // ✅ Add 'return'
  } catch (err) {
    console.error("❌ Error adding item:", err);
    return res.status(500).json({ message: "Server error while adding item" }); // ✅ Add 'return'
  }
};


// ✅ Remove item
const removeItems = async (req, res) => {
  const { id } = req.params; // from /delete/:id

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing item ID in route" });
    }

    const item = await Items.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete image from uploads folder
    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("⚠️ Error deleting image:", err.message);
      });
    }

    res.status(200).json({ message: "Item removed successfully", item });
  } catch (err) {
    console.error("❌ Error removing item:", err);
    res.status(500).json({ message: "Server error while removing item" });
  }
};



const updateItem = async (req, res) => {
  try {
    const { id } = req.params; // from /update-item/:id
    const { websitename, websiteUrl, description } = req.body;
    const newImage = req.file ? req.file : null;

    if (!id) {
      return res.status(400).json({ message: "Missing item ID in route" });
    }

    const item = await Items.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete old image if a new one is uploaded
    if (newImage && item.image) {
      const oldImagePath = path.join(__dirname, "../uploads", item.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.warn("⚠️ Could not delete old image:", err.message);
        }
      });
    }

    // Update fields
    item.websitename = websitename || item.websitename;
    item.websiteUrl = websiteUrl || item.websiteUrl;
    item.description = description || item.description;
    if (newImage) item.image = newImage;

    const updatedItem = await item.save();

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem
    });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ message: "Server error while updating item" });
  }
};



// ✅ Get all items
const getItems = async (req, res) => {
  try {
    const items = await Items.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Items retrieved successfully", items });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};



const addCategory = async (req, res) => {
  try {
    const { categoryname, description, image } = req.body;

    if (!categoryname) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = generateSlug(categoryname);

    // Check if slug already exists
    const existingCategory = await Categories.findOne({ slug });
    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      categoryname,
      description,
      image,
      slug
    });

    await newCategories.save();

    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const removeCategory = async (req, res) => {
  const { slug } = req.body;

  if (!slug) {
    return res.status(400).json({ message: "Slug is required" });
  }

  try {
    const deletedCategory = await Categories.findOneAndDelete({ slug });

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const addTags=async(req,res)=>{
   const {tags,description}=req.body;
   try{
    const tag=await Tags.findOne({tags:tags})
    if(tag){
      return res.status(400).json({message:'tag is already exitsed'})
    }
   }catch(error){
    return res.json({message:"error occured",error})
   }
}
const removeTags = async (req, res) => {
  const { tag } = req.body;

  try {
    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    const deletedTag = await Tags.findOneAndDelete({ name: tag }); 

    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    return res.status(200).json({ message: "Tag deleted successfully", tag: deletedTag });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addItems,
  removeItems,
  updateItem,
  getItems,
  //catgories 
  addCategory,
  removeCategory,
};
