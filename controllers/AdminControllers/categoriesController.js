const Categories = require("../../models/category");
const { generateSlug } = require("../../config/utils");

const addCategory = async (req, res) => {
  try {
    const { categoryname, description, image } = req.body;
    if (!categoryname) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const slug = generateSlug(categoryname);
    const existingCategory = await Categories.findOne({ slug });

    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const newCategory = new Categories({ categoryname, description, image, slug });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeCategory = async (req, res) => {
  const { slug } = req.body;
  if (!slug) return res.status(400).json({ message: "Slug is required" });

  try {
    const deletedCategory = await Categories.findOneAndDelete({ slug });
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categoriesData = await Categories.find();
    if (!categoriesData.length) return res.status(404).json({ message: "No categories found" });

    res.status(200).json({ categoriesData });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
};

module.exports = {
  addCategory,
  removeCategory,
  getCategories
};
