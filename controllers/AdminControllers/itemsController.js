const fs = require("fs");
const path = require("path");
const Items = require("../../models/Items");

// ✅ Add new item
const addItems = async (req, res) => {
  try {
    const {
      websitename,
      websiteUrl,
      description,
      category,
      mobileApp,
      ai,
      pricingType,
      pricingDetails,
      tags,
      rating,
      features,
      country
    } = req.body;

    const image = req.file ? req.file.image : null;

    if (!websitename || !websiteUrl || !category) {
      return res.status(400).json({ message: "Required fields are missing (websitename, websiteUrl, category)" });
    }

    if (!image) {
      return res.status(400).json({ message: "Image file not provided or invalid format" });
    }

    const exists = await Items.findOne({ websitename });
    if (exists) {
      return res.status(400).json({ message: "Website already exists" });
    }

    const newItem = new Items({
      websitename,
      websiteUrl,
      description,
      image,
      category,
      mobileApp,
      ai: false,
      pricingType,
      pricingDetails,
      tags: Array.isArray(tags) ? tags : tags?.split(","),
      rating: rating ? parseFloat(rating) : undefined,
      features: Array.isArray(features) ? features : features?.split(","),
      country,
    });

    await newItem.save();

    return res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (err) {
    console.error("❌ Error adding item:", err);
    return res.status(500).json({ message: "Server error while adding item" });
  }
};

// ✅ Remove item
const removeItems = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Missing item ID in route" });
    }

    const item = await Items.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

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
    const { id } = req.params;
    const { websitename, websiteUrl, description } = req.body;
    const newImage = req.file ? req.file : null;

    if (!id) {
      return res.status(400).json({ message: "Missing item ID in route" });
    }

    const item = await Items.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (newImage && item.image) {
      const oldImagePath = path.join(__dirname, "../uploads", item.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.warn("⚠️ Could not delete old image:", err.message);
        }
      });
    }

    item.websitename = websitename || item.websitename;
    item.websiteUrl = websiteUrl || item.websiteUrl;
    item.description = description || item.description;
    if (newImage) item.image = newImage;

    const updatedItem = await item.save();

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("❌ Error updating item:", error);
    res.status(500).json({ message: "Server error while updating item" });
  }
};

const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      Items.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Items.countDocuments()
    ]);

    res.status(200).json({
      message: "Items retrieved successfully",
      items,
      pagination: {
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        limit
      }
    });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

module.exports = {
  addItems,
  removeItems,
  updateItem,
  getItems
};
