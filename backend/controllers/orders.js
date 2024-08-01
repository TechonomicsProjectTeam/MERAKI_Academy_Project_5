const pool = require("../models/db");
const { getWebSocketServer } = require("../webSocket");
const WebSocket = require("ws");

//======================================================Create Order=====================================================
const createOrder = (req, res) => {
  const user_id = req.token.userId;
  const { paymentMethod } = req.body; 

  // Ensure user has items in the cart
  pool
    .query(
      `SELECT * FROM cart_products JOIN cart ON cart_products.cart_id = cart.cart_id WHERE cart.user_id = $1`,
      [user_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No items in the cart to create an order",
        });
      }

      // Create the order
      return pool
        .query(`INSERT INTO orders (user_id, payment_method) VALUES ($1, $2) RETURNING *`, [
          user_id,
          paymentMethod, // Insert payment method
        ])
        .then((orderResult) => {
          const order_id = orderResult.rows[0].order_id;

          // Transfer cart items to order_products
          return pool
            .query(
              `
            INSERT INTO order_products (order_id, product_id, quantity)
            SELECT $1, product_id, quantity FROM cart_products
            JOIN cart ON cart_products.cart_id = cart.cart_id
            WHERE cart.user_id = $2
            RETURNING *`,
              [order_id, user_id]
            )
            .then((transferResult) => {
              // Clear the cart
              return pool
                .query(
                  `DELETE FROM cart_products WHERE cart_id IN (SELECT cart_id FROM cart WHERE user_id = $1)`,
                  [user_id]
                )
                .then(() => {
                  return pool
                    .query(
                      `
                  SELECT products.* FROM products 
                  JOIN order_products  ON products.product_id = order_products.product_id
                  WHERE order_products.order_id = $1`,
                      [order_id]
                    )
                    .then((productDetails) => {
                      res.status(201).json({
                        success: true,
                        message: "Order created successfully",
                        order: orderResult.rows[0],
                        orderProducts: transferResult.rows,
                        productDetails: productDetails.rows,
                      });
                    });
                });
            });
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

//======================================================Update Order Status=====================================================
const updateOrderStatus = (req, res) => {
  const { order_id } = req.params;
  const { status, paymentMethod } = req.body;
  const { userId } = req.token;

  console.log("Order ID:", order_id);
  console.log("Status:", status);
  console.log("User ID (Driver):", userId);
  console.log("Payment Method:", paymentMethod);

  const validStatuses = ["In progress", "ACCEPTED", "REJECTED"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  pool
    .query(
      "UPDATE orders SET status = $1, driver_id = $2, payment_method = $3 WHERE order_id = $4 RETURNING *",
      [status, userId, paymentMethod, order_id]
    )
    .then((response) => {
      if (response.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      const updatedOrder = response.rows[0];
      console.log("Updated Order:", updatedOrder);

      // Fetch the driver details
      return pool
        .query("SELECT * FROM users WHERE user_id = $1", [userId])
        .then((driverResult) => {
          const driver = driverResult.rows[0];
          console.log("Driver Details:", driver);

          const wss = getWebSocketServer();

          // Broadcast the updated order status to all connected clients
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "ORDER_STATUS_UPDATED",
                  payload: { ...updatedOrder, driver },
                })
              );
            }
          });

          res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            result: { ...updatedOrder, driver },
          });
        });
    })
    .catch((error) => {
      console.error("Database error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    });
};

//======================================================Other Order Functions=====================================================
const createOrderProducts = (req, res) => {
  const { order_id, product_id } = req.body;
  const values = [order_id, product_id];
  const query = `INSERT INTO order_products(order_id, product_id) VALUES ($1,$2) RETURNING *`;

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

const getOrderProductsByUserId = (req, res) => {
  const user_id = req.params.id;
  const query = `SELECT *
    FROM order_products
    JOIN orders ON order_products.order_id = orders.order_id
    JOIN products ON order_products.product_id = products.product_id
    WHERE order_products.is_deleted = 0 AND user_id = $1
    `;

  pool
    .query(query, [user_id])
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Order Products By UserId retrieved successfully",
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

const getAllOrders = (req, res) => {
  const query = `
    SELECT 
      o.order_id,
      o.payment_method,
      o.user_id,
      o.status,
      o.is_deleted,
      o.driver_id,
      u.first_name,
      u.last_name,
      u.email,
      u.username,
      u.phone_number,
      u.images,
      u.role_id,
      p.product_id,
      p.name AS product_name,
      p.description,
      p.price,
      p.shop_id,
      op.quantity,
      du.first_name AS driver_first_name,
      du.last_name AS driver_last_name,
      du.email AS driver_email,
      du.username AS driver_username,
      du.phone_number AS driver_phone_number,
      du.images AS driver_images,
      du.role_id AS driver_role_id
    FROM orders o
    JOIN users u ON o.user_id = u.user_id
    JOIN order_products op ON o.order_id = op.order_id
    JOIN products p ON op.product_id = p.product_id
    LEFT JOIN users du ON o.driver_id = du.user_id
  `;

  pool
    .query(query)
    .then((response) => {
      const orders = {};

      response.rows.forEach((row) => {
        if (!orders[row.order_id]) {
          orders[row.order_id] = {
            order_id: row.order_id,
            user_id: row.user_id,
            status: row.status,
            is_deleted: row.is_deleted,
            payment_method: row.payment_method,
            driver: row.driver_id
              ? {
                  driver_id: row.driver_id,
                  first_name: row.driver_first_name,
                  last_name: row.driver_last_name,
                  email: row.driver_email,
                  username: row.driver_username,
                  phone_number: row.driver_phone_number,
                  images: row.driver_images,
                  role_id: row.driver_role_id,
                }
              : null,
            user: {
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              username: row.username,
              phone_number: row.phone_number,
              images: row.images,
              role_id: row.role_id,
            },
            products: [],
          };
        }

        orders[row.order_id].products.push({
          product_id: row.product_id,
          name: row.product_name,
          description: row.description,
          price: row.price,
          shop_id: row.shop_id,
          quantity: row.quantity,
        });
      });

      res.status(200).json({
        success: true,
        message: "All orders retrieved successfully",
        result: Object.values(orders),
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
  getOrderProductsByUserId,
  updateOrderStatus,
  getAllOrders,
};
