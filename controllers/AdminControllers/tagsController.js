const Tags = require("../../models/Tags");

const addTags = async (req, res) => {
  const { tags, description } = req.body;
  try {
    const existingTag = await Tags.findOne({ tags });
    if (existingTag) {
      return res.status(400).json({ message: "Tag already exists" });
    }

    const newTag = new Tags({ tags, description });
    await newTag.save();

    return res.status(201).json({ message: "Tag added successfully", tag: newTag });
  } catch (error) {
    return res.status(500).json({ message: "Error occurred", error: error.message });
  }
};

const removeTags = async (req, res) => {
  const { tag } = req.body;
  try {
    if (!tag) return res.status(400).json({ message: "Tag is required" });

    const deletedTag = await Tags.findOneAndDelete({ name: tag });
    if (!deletedTag) return res.status(404).json({ message: "Tag not found" });

    return res.status(200).json({ message: "Tag deleted successfully", tag: deletedTag });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTags = async (req, res) => {
  try {
    const tagsData = await Tags.find();
    if (!tagsData.length) return res.status(404).json({ message: "No tags found" });

    res.status(200).json({ tags: tagsData });
  } catch (error) {
    res.status(500).json({ message: "Error occurred", error: error.message });
  }
};

module.exports = {
  addTags,
  removeTags,
  getTags
};
