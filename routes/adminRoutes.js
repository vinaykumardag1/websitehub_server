const express = require("express");
const router = express.Router(); 

const {
  addItems,
  updateItem,
  removeItems,
  getItems,
  // 
  addCategory,
  removeCategory,
  // 
  addTags,
  removeTags,
  getCategories,
  getTags,
} = require("../controllers/adminControllers");

const upload = require("../middleware/uploads");

// Routes
router.post("/add-item", upload.single("image"), addItems);
router.put("/update-item/:id", upload.single("image"), updateItem);
router.delete("/delete/:id", removeItems);
router.get("/items", getItems);
// category routes
router.post("add-category",upload.single("categoryImage"),addCategory)
router.delete("remove-category/:id",removeCategory)
router.get("categories",getCategories)
// Tags route
router.post("add-tag",addTags)
router.delete("remove-tag/:id",removeTags)
router.get("tags",getTags)
module.exports = router;
