const express = require("express");

const {
  createShops,
  deleteShopsById,
  getAllShops,
  updateShopById,
  loginShop,
  getShopById,
  getShopsByCategoryId,
  updateShopRating,
  getBestRatedShops
} = require("../controllers/Shop");

const shopRouter = express.Router();
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

shopRouter.post("/",  createShops);
shopRouter.get("/", authentication, getAllShops);
shopRouter.put("/:id", authentication, updateShopById);
shopRouter.delete("/:id", authentication, deleteShopsById);
shopRouter.post("/shop_login", loginShop);
shopRouter.get("/:id",getShopById);
shopRouter.get("/category/:id",getShopsByCategoryId);
shopRouter.post("/shops/rating", updateShopRating)
shopRouter.get("/shops/best-rated", getBestRatedShops);

module.exports = shopRouter;