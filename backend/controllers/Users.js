const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const register = (req, res) => {};

const login = (req, res) => {};

const updateUserById = (req, res) => {};

const deleteUserById = (req, res) => {};

module.exports = {
  register,
  login,
  updateUserById,
  deleteUserById,
};
