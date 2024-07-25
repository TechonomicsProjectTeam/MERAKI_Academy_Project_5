const express = require("express");

const {
  register,
  login,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById
} = require("../controllers/Users");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.put("/:user_id", updateUserById);
usersRouter.delete("/:user_id", deleteUserById);
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id",getUserById)

module.exports = usersRouter;
