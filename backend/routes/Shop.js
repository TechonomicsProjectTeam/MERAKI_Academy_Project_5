const express = require("express");

const {
  createShops,
  deleteShopsById,
  getAllShops,
  updateShopById,
} = require("../controllers/Shop");


const shopRouter=express.Router()

shopRouter.post("/",createShops)
shopRouter.get("/",getAllShops)
shopRouter.put("/:id",updateShopById)
shopRouter.delete("/:id",deleteShopsById)

module.exports=shopRouter