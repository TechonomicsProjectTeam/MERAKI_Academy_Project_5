const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const createShops = async(req, res) => {
   const role_id = 3
  //collecting the shop data from the body
  const {
    category_id,
    name,
    description,
    images,
    email,
    password,
    phone_number,
  } = req.body;
  try {
    //Hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //Values of the query
    const values = [
      name,
      description,
      images,
      email.toLowerCase(),
      hashedPassword,
      phone_number,
      category_id,
      role_id
    ];
    //the query
    const query = `INSERT INTO shops (name,description,images,email,password,phone_number,category_id,role_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    pool
      .query(query, values)
      .then((response) => {
        res.status(201).json({
          success: true,
          message: "Shop created successfully",
          result: response.rows[0],
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteShopsById = (req, res) => {
  const shop_id = req.params.id;
  const query = `DELETE FROM shops WHERE shop_id = $1 returning *`;

  pool
    .query(query, [shop_id])
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Shop deleted",
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "server error",
        error: error.message,
      });
    });
};

const getAllShops = (req, res) => {
  const query = `SELECT * FROM shops WHERE is_deleted = 0`;

  pool
    .query(query)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "All the shops",
        shops: response.rows,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    });
};

const updateShopById = (req, res) => {
  const {
    category_id,
    name,
    description,
    images,
    email,
    password,
    phone_number,
  } = req.body;
  const shop_id = req.params.id;
  const values = [
    category_id,
    name,
    description,
    images,
    email,
    password,
    phone_number,
    shop_id
  ];
  const query = `UPDATE shops SET category_id = COALESCE($1,category_id), name = COALESCE($2,name),description = COALESCE($3,description),images = COALESCE($4,images), email = COALESCE($5,email),password = COALESCE($6,password),phone_number = COALESCE($7,phone_number) WHERE shop_id = $8 RETURNING *`;

  pool
    .query(query, values)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: `Shop with id: ${shop_id} updated successfully`,
        shop: response.rows[0],
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    });
};

module.exports = {
  createShops,
  deleteShopsById,
  getAllShops,
  updateShopById,
};
