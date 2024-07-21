const express = require("express");

const {
  register,
  login,
  updateUserById,
  deleteUserById,
} = require("../controllers/Users");


const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.put("/:user_id", updateUserById);
usersRouter.delete("/:user_id", deleteUserById);

module.exports = usersRouter;
