const express = require("express");

const {
  createOrder,
  createOrderProducts,
  getOrderProducts,
  deleteOrderProducts,
  getOrderProductsByUserId,
  updateOrderStatus,
  getAllOrders
} = require("../controllers/orders");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

const orderRouter = express.Router();

orderRouter.post("/", authentication, createOrder);
orderRouter.post("/order-products", createOrderProducts);
orderRouter.get("/order-products", authentication, getOrderProducts);
orderRouter.delete("/order-products/:id", authentication, deleteOrderProducts);
orderRouter.get("/order-products/:id",getOrderProductsByUserId)
orderRouter.put("/:order_id/status",updateOrderStatus)
orderRouter.get("/", getAllOrders); 
module.exports = orderRouter;
