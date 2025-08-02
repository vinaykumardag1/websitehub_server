const fs = require("fs");
const path = require("path");
const userFav = require("../models/userFav");

// ✅ Add new item
const addItems = async (req, res) => {
  const { websitename, websiteUrl, description } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const exists = await userFav.findOne({ websitename });
    if (exists) {
      return res.status(400).json({ message: "Website already exists" });
    }

    const newItem = new userFav({
      websitename,
      websiteUrl,
      description,
      image,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Server error while adding item" });
  }
};


// ✅ Remove item
const removeItems = async (req, res) => {
  const { itemId } = req.query;

  try {
    if (!itemId) {
      return res.status(400).json({ message: "Missing itemId in query" });
    }

    const item = await userFav.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Optional: delete image from server
    if (item.image) {
      const imagePath = path.join(__dirname, "../uploads", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("⚠️ Error deleting image:", err.message);
      });
    }

    res.status(200).json({ message: "Item removed successfully", item });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Server error while removing item" });
  }
};

// ✅ Update item
const updateItem = async (req, res) => {
  const { itemId } = req.query;
  const { websitename, websiteUrl, description } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    if (!itemId) {
      return res.status(400).json({ message: "Missing itemId in query" });
    }

    const item = await userFav.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Optional: delete old image if new one uploaded
    if (newImage && item.image) {
      const oldImagePath = path.join(__dirname, "../uploads", item.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.warn("⚠️ Could not delete old image:", err.message);
      });
    }

    // Update fields
    item.websitename = websitename || item.websitename;
    item.websiteUrl = websiteUrl || item.websiteUrl;
    item.description = description || item.description;
    if (newImage) item.image = newImage;

    const updatedItem = await item.save();

    res.status(200).json({ message: "Item updated successfully", item: updatedItem });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Server error while updating item" });
  }
};

// ✅ Get all items
const getItems = async (req, res) => {
  try {
    const items = await userFav.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Items retrieved successfully", items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

module.exports = {
  addItems,
  removeItems,
  updateItem,
  getItems,
};
