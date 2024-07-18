const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const registerStorUser = (req, res) => {};

const loginStoreUser = (req, res) => {};

const updateStoreUserById = (req, res) => {};

const deleteStorUserById = (req, res) => {};

module.exports = {
  registerStorUser,
  loginStoreUser,
  updateStoreUserById,
  deleteStorUserById,
};
