const express = require("express");

const {
  createProducts,
  updateProductsById,
  deleteProductsById,
  getAllProducts,
} = require("../controllers/Product");

const productRouter = express.Router();

productRouter.post("/", createProducts);
productRouter.get("/", getAllProducts);
productRouter.put("/:id", updateProductsById);
productRouter.delete("/:id", deleteProductsById);

module.exports = productRouter;
