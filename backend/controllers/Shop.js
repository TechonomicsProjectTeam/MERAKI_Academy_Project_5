const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const createShops = (req, res) => {
  
};

const deleteShopsById = (req, res) => {};

const getAllShops = (req, res) => {};

const updateShopById = (req, res) => {};

module.exports = {
  createShops,
  deleteShopsById,
  getAllShops,
  updateShopById,
};
