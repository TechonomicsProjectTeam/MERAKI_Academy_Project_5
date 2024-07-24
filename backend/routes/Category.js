const express = require("express");

const {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCategory,
} = require("../controllers/Category");

const categoryRouter = express.Router();
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");
/* 
  authorization:
  
  authorization("CREATE_CATEGORY"),
*/
categoryRouter.post("/", authentication, createCategory);
categoryRouter.get("/", authentication, getAllCategory);
categoryRouter.put("/:id", authentication, updateCategoryById);
categoryRouter.delete("/:id", authentication, deleteCategoryById);

module.exports = categoryRouter;
