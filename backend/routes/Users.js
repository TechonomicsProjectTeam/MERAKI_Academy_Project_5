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
usersRouter.put("/:id", updateUserById);
usersRouter.delete("/:id", deleteUserById);

module.exports = usersRouter;
