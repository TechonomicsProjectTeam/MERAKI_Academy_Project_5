const express = require("express");

const {
  createShops,
  deleteShopsById,
  getAllShops,
  updateShopById,
} = require("../controllers/Shop");


const shopRouter=express.Router()
const authorization = require("../middlewares/authorization")
const authentication = require("../middlewares/authentication")

shopRouter.post("/",authentication,createShops)
shopRouter.get("/",authentication,getAllShops)
shopRouter.put("/:id",authentication,updateShopById)
shopRouter.delete("/:id",authentication,deleteShopsById)

module.exports=shopRouter