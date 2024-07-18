const express = require("express");

const {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCategory,
} = require("../controllers/Category");


const categoryRouter=express.Router()

categoryRouter.post("/",createCategory)
categoryRouter.get("/",getAllCategory)
categoryRouter.put("/:id",updateCategoryById)
categoryRouter.delete("/:id",deleteCategoryById)

module.exports=categoryRouter