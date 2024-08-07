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
  getBestRatedShops,
  getAllShopCities,
  banShopById,
  unBanShopById,
  hardDeleteShopById,
} = require("../controllers/Shop");

const shopRouter = express.Router();
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

shopRouter.post("/", createShops);
shopRouter.get("/", getAllShops);
shopRouter.put("/:id", updateShopById);
shopRouter.delete("/:id", authentication, deleteShopsById);
shopRouter.post("/shop_login", loginShop);
shopRouter.get("/:id", getShopById);
shopRouter.get("/category/:id", getShopsByCategoryId);
shopRouter.post("/shops/rating", authentication, updateShopRating);
shopRouter.get("/shops/best-rated", getBestRatedShops);
shopRouter.get("/rated/shops", getAllShopCities);
shopRouter.put("/ban/:id", banShopById);
shopRouter.put("/unBan/:id",unBanShopById);
shopRouter.delete("/hard-delete/:id", hardDeleteShopById);
module.exports = shopRouter;
