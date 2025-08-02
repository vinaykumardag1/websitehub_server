const express=require("express")
const router=express().Router()
const {addItems,updateItem,removeItems,getItems}=require("../controllers/adminControllers")
const upload=require("../middleware/uploads")


router.post("/add-item", upload.single("image"), addItems);
router.put("/update-item/:id", upload.single("image"), updateItem);
router.delete("/delete/:id", removeItems);
router.get("/items", getItems);

module.exports=router

