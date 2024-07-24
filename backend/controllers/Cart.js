const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);
//======================================================ADD PRODUCT TO CART =====================================================
const addProductToCart = (req, res) => {
  const { cart_id, quantity } = req.body;
  const user_id = req.token.userId;
  const { product_id } = req.params;

  // Verify cart ownership
  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`, [cart_id, user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized access to this cart',
        });
      }

      // Check if the product exists
      return pool.query(`SELECT * FROM products WHERE product_id = $1`, [product_id])
        .then((productResult) => {
          if (productResult.rows.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'Product not found',
            });
          }

          // Check if the product is already in the cart
          return pool.query(`SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2`, [cart_id, product_id])
            .then((cartProductResult) => {
              if (cartProductResult.rows.length > 0) {
                // Update quantity instead of adding the product again
                return pool.query(`UPDATE cart_products SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`, [quantity, cart_id, product_id])
                  .then((updateResult) => {
                    res.status(200).json({
                      success: true,
                      message: 'Product quantity updated in the cart',
                      result: updateResult.rows[0],
                    });
                  });
              } else {
                // Add the product to the cart
                return pool.query(`INSERT INTO cart_products (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`, [cart_id, product_id, quantity])
                  .then((insertResult) => {
                    res.status(201).json({
                      success: true,
                      message: 'Added to cart successfully',
                      result: insertResult.rows[0],
                    });
                  });
              }
            });
        });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    });
};

//===============================================================GET ALL PRODUCT FROM CART==============================================
const getAllCart = (req, res) => {
  const {cart_id} = req.params;
  const user_id = req.token.userId;

  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2 AND is_deleted = 0`,[cart_id,user_id])
  .then((result)=>{
    if(result.rows.length === 0){
      res.status(403).json({
        success: false,
        message: `unauthorized access to this cart`,
      })
    }
    
    pool.query(`SELECT cart_products.* ,products.name , products.price ,products.images
      FROM cart_products JOIN products ON cart_products.product_id = products.product_id WHERE cart_products.cart_id = $1`,
    [cart_id])
    .then((result)=>{
      res.status(201).json({
        success:true,
        message:"All product in the cart have been successfully",
        product:result.rows
      })
  })
  })
  .catch((error)=>{
    res.status(409).json({
      success: false,
      message:"server error",
      err: error.message,
    });
  })
};

//===========================================================DELETE ALL PRODUCT FROM CART ============================================
const deleteAllProductFromCart = (req, res) => {
  const { cart_id } = req.params;
  const user_id = req.token.userId;

  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`, [cart_id, user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to this cart",
        });
      }

      return pool.query(`DELETE FROM cart_products WHERE cart_id = $1 RETURNING *`, [cart_id]);
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All products removed from the cart",
        deletedProducts: result.rows
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    });
};


//=======================================================DELETE PRODUCT CART BY ID=================================================
const deleteProductCartById = (req, res) => {
  const { cart_id, product_id } = req.params;
  const user_id = req.token.userId;

  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`, [cart_id, user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Unauthorized access to this cart",
        });
      }

      return pool.query(`SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2`, [cart_id, product_id]);
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found in the cart",
        });
      }

      return pool.query(`DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2 RETURNING *`, [cart_id, product_id]);
    })
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "Deleted product",
        deletedProduct: result.rows[0]
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    });
};

//===========================================================DECREASE PRODUCT QUANTITY==================================================
const decreaseProductQuantity = (req, res) => {
  const { cart_id, product_id } = req.params;
  const user_id = req.token.userId;
 // Verify cart ownership
  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`, [cart_id, user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to this cart",
        });
      }
// Check if the product exists
      return pool.query(`SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2`, [cart_id, product_id]);
    })
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found in the cart",
        });
      }

      const currentQuantity = result.rows[0].quantity;
//Decrease Quantity
      if (currentQuantity > 1) {
        return pool.query(`UPDATE cart_products SET quantity = quantity - 1 WHERE cart_id = $1 AND product_id = $2 RETURNING *`, [cart_id, product_id])
          .then((updateResult) => {
            res.status(200).json({
              success: true,
              message: "Product quantity decreased by 1",
              result: updateResult.rows[0],
            });
          });
      } else {
        //Remove Product once the quantity reach 0
        return pool.query(`DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2 RETURNING *`, [cart_id, product_id])
          .then((deleteResult) => {
            res.status(200).json({
              success: true,
              message: "Product removed from the cart as quantity reached 0",
              
            });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    });
};



module.exports = {
  addProductToCart,
  getAllCart,
  deleteAllProductFromCart,
  deleteProductCartById,
  decreaseProductQuantity
};
 