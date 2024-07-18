const express = require("express");

const {
  registerStorUser,
  loginStoreUser,
  updateStoreUserById,
  deleteStorUserById,
} = require("../controllers/StoreUser");

const storeUserRouter = express.Router();

storeUserRouter.post("/register", registerStorUser);
storeUserRouter.post("/login", loginStoreUser);
storeUserRouter.put("/:id", updateStoreUserById);
storeUserRouter.delete("/:id", deleteStorUserById);

module.exports=storeUserRouter