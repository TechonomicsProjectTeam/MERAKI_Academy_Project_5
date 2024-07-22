const pool = require("../models/db");

const createCategory = (req, res) => {
  const { name, description, images } = req.body;
  const query = `INSERT INTO categories (name,description,images) VALUES ($1,$2,$3) RETURNING *`;
  const values = [name, description, images];

  pool
    .query(query, values)
    .then((result) => {
      res.status(201).json({
        success: true,
        message: "Category created",
        category: result.rows[0],
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: error.message,
      });
    });
};
const updateCategoryById = (req, res) => {
  const { name, description, images } = req.body;
  const category_id = req.params.id;

  const query = `UPDATE categories SET name = COALESCE($1,name), description = COALESCE($2,description), images = COALESCE($3,images) WHERE category_id = $4`;
  const values = [name, description, images,category_id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Category Updated",
        category: result.rows[0],
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

const deleteCategoryById = (req, res) => {
  const category_id = req.params.id;
  const query = `DELETE FROM categories WHERE category_id = $1`;
  const values = [category_id];

  pool
    .query(query, values)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Category deleted",
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

const getAllCategory = (req, res) => {
    const query = `SELECT * FROM categories WHERE is_deleted=0`

    pool.query(query)
    .then((result)=>{
        res.status(200).json({
            success:true,
            message:"All the categories",
            category:result.rows
        })
    })
    .catch((error)=>{
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message
        })
    })
};

module.exports = {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getAllCategory,
};
