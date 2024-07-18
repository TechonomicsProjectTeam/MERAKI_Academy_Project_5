const express = require("express");

const {
  createRole,
  createPermission,
  createRole_Permissions,
  deleteRole_PermissionsById,
  getRole_Permissions,
} = require("../controllers/Role");

const rolesRouter = express.Router();

rolesRouter.post("/role", createRole);
rolesRouter.post("/permission", createPermission);
rolesRouter.post("/role-permissions", createRole_Permissions);
rolesRouter.delete("/role-permissions/:id", deleteRole_PermissionsById);
rolesRouter.get("/role-permissions", getRole_Permissions);

module.exports = rolesRouter;
