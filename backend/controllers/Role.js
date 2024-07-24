const pool = require("../models/db");

const createRole = (req, res) => {
  const { role_name } = req.body;
  const query = `INSERT INTO roles (role_name) VALUES ($1) RETURNING *`;
  pool
    .query(query, [role_name])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Role created successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err,
      });
    });
};

const createPermission = (req, res) => {
  const { permission_name } = req.body;
  const query = `INSERT INTO permissions (permission_name) VALUES ($1) RETURNING *`;
  pool
    .query(query, [permission_name])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: `Permission created successfully`,
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err,
      });
    });
};

const createRole_Permissions = (req, res) => {
  const { role_id, permission_id } = req.body;
  const query = `INSERT INTO role_permissions(role_id,
    permission_id) VALUES ($1,$2) RETURNING *`;
  const data = [role_id, permission_id];

  pool
    .query(query, data)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: ` Role Permission created successfully`,
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err,
      });
    });
};

const deleteRole_PermissionsById = (req, res) => {
  const { id } = req.params;
  const query = `Update role_permissions SET is_deleted=1 WHERE id = $1 RETURNING *`;
  pool
    .query(query, [id])
    .then((result) => {
      if (result.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Role Permission not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Role Permission deleted successfully",
          result: result.rows,
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err,
      });
    });
};

const getRole_Permissions = (req, res) => {
  const query = ` SELECT role_permissions.id, roles.role_name, permissions.permission_name 
    FROM role_permissions 
    JOIN roles  ON role_permissions.role_id = roles.role_id
    JOIN permissions  ON role_permissions.permission_id = permissions.permission_id WHERE role_permissions.is_deleted = 0`;
  pool
    .query(query)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Role Permissions retrieved successfully",
        result: result.rows,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: `Server error`,
        err: err.message,
      });
    });
};

module.exports = {
  createRole,
  createPermission,
  createRole_Permissions,
  deleteRole_PermissionsById,
  getRole_Permissions,
};
