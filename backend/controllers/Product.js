const pool = require("../models/db");

const createProducts = (req, res) => {
  const { shopId } = req.token;
  const { name, description, price, images } = req.body;
  const query = `INSERT INTO products (name,description,price,images,shop_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`;
  pool
    .query(query, [name, description, price, images, shopId])
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Product created successfully",
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

const updateProductsById = (req, res) => {
  const { name, description, price, images } = req.body;
  const { id } = req.params;
  const query = `UPDATE products SET name= COALESCE($1,name) , description= COALESCE($2,description), price= COALESCE($3,price), images=COALESCE($4,images) WHERE product_id=$5 RETURNING * `;
  pool
    .query(query, [name, description, price, images, id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Product Updated",
        products: result.rows[0],
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    });
};

const deleteProductsById = (req, res) => {
  const { id } = req.params;
  pool
    .query(`UPDATE products SET is_deleted=1 WHERE product_id=$1`, [id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Product deleted",
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

const getAllProducts = (req, res) => {
  pool
    .query(`SELECT * FROM products WHERE is_deleted=0`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All the Products",
        products: result.rows,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        Error: error.message,
      });
    });
};

const getProductByShopOwner = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM products WHERE shop_id = $1 AND is_deleted = 0`;
  pool
    .query(query, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: `No products found for shop owner with shop_id: ${id}`,
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Products for shop owner with shop_id: ${id}`,
          products: result.rows,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    });
};

module.exports = {
  createProducts,
  updateProductsById,
  deleteProductsById,
  getAllProducts,
  getProductByShopOwner,
};
