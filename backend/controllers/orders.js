const pool = require("../models/db");

//======================================================Create Order=====================================================
const createOrder = (req, res) => {
  const user_id = req.token.userId;

  const query = `INSERT INTO orders (user_id) VALUES ($1) RETURNING *`;
  pool
    .query(query, [user_id])
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: response.rows[0],
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

//======================================================Create Order Products=====================================================
const createOrderProducts = (req, res) => {
  const { order_id, product_id } = req.body;
  const values = [order_id, product_id];
  const query = `INSERT INTO order_products(order_id,
    product_id) VALUES ($1,$2) RETURNING *`;

  pool
    .query(query, values)
    .then((response) => {
      res.status(201).json({
        success: true,
        message: "Order Product created successfully",
        orderProduct: response.rows[0],
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

//======================================================Delete Order Products=====================================================
const deleteOrderProducts = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM order_products WHERE id = $1 RETURNING *`;
  pool
    .query(query, [id])
    .then((response) => {
      console.log(id);
      if (response.rowCount === 0) {
        res.status(404).json({
          success: false,
          message: "Order products not found",
        });
      } else {
        res.status(200).json({
          success: true,
          message: `Order Products with the id ${id} deleted successfully`,
          result: response.rows,
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

//======================================================Get All Order Products=====================================================
const getOrderProducts = (req, res) => {
  const query = `SELECT *
    FROM order_products
    JOIN orders ON order_products.order_id = orders.order_id
    JOIN products ON order_products.product_id = products.product_id
    WHERE order_products.is_deleted = 0
    `;

  pool
    .query(query)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Order Products retrieved successfully",
        result: response.rows,
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

module.exports = {
  createOrder,
  createOrderProducts,
  getOrderProducts,
  deleteOrderProducts,
};
