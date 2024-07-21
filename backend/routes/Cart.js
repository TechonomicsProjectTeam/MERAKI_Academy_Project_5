const express = require("express");

const {
  addProductToCart,
  getAllCart,
  deleteAllProductFromCart,
  deleteProductCartById,
} = require("../controllers/Cart");

const authentication =require("../middlewares/authentication");
const authorization = require("../middlewares/authorization");

const cartRouter = express.Router();

cartRouter.post("/:product_id",authentication,addProductToCart );
cartRouter.get("/:cart_id",authentication, getAllCart);
cartRouter.delete("/:cart_id/products",authentication, deleteAllProductFromCart);
cartRouter.delete("/cart/:cart_id/product/:product_id",authentication, deleteProductCartById);

module.exports=cartRouter