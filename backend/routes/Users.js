const express = require("express");

const {
  register,
  login,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
  googleLogin,
  getUsersByRoleId,
  banUserById,
  unBanUserById
} = require("../controllers/Users");

const usersRouter = express.Router();

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.put("/:user_id", updateUserById);
usersRouter.delete("/:user_id", deleteUserById);
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUserById);
usersRouter.post('/google-login', googleLogin);
usersRouter.get("/role/:role_id", getUsersByRoleId);
usersRouter.delete("/ban/:user_id", banUserById);
usersRouter.patch("/unBan/:user_id", unBanUserById);

module.exports = usersRouter;
