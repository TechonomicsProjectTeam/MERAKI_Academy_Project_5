const express = require("express");

const {
  createProducts,
  updateProductsById,
  deleteProductsById,
  getAllProducts,
  getProductByShopOwner
} = require("../controllers/Product");

const authorization = require("../middlewares/authorization")
const authentication = require("../middlewares/authentication")

const productRouter = express.Router();

productRouter.post("/",authentication,authorization("CREATE_PRODUCTS"), createProducts);
productRouter.get("/", getAllProducts);
productRouter.put("/:id",authentication,authorization("CREATE_PRODUCTS"), updateProductsById);
productRouter.delete("/:id", deleteProductsById);
productRouter.get("/:id",getProductByShopOwner)

module.exports = productRouter;
