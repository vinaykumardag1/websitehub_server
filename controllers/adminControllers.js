const itemsController = require("./AdminControllers/itemsController");
const categoriesController = require("./AdminControllers/categoriesController");
const tagsController = require("./AdminControllers/tagsController");
const adminAuthControllers=require("./AdminControllers/adminLogin")
module.exports = {
  ...itemsController,
  ...categoriesController,
  ...tagsController,
  ...adminAuthControllers
};
