const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);
//======================================================ADD PRODUCT TO CART =====================================================
const addProductToCart = (req, res) => {
  const {cart_id , quantity} = req.body;
  const user_id = req.token.userId;
  const {product_id} = req.params;

  //make sure that the cart_id is for the same user_id
  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`,
    [cart_id,user_id])
    .then((result)=>{
      if(result.rows.length === 0){
        res.status(403).json({
          success: false,
          message: `unauthorized access to this cart`,
        })
      }
      
      pool.query(`SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2`, [cart_id, product_id])
      .then((result) => {
        if (result.rows.length > 0) {
          // IF the product is available ,i will not add it again
          return res.status(200).json({
            success: false,
            message: "Product already exists in the cart",
          });
        } else {
        //add the product to cart
        return pool.query(`INSERT INTO cart_products
           (cart_id,product_id,quantity) VALUES ($1,$2,$3) RETURNING *`
          ,[cart_id,product_id,quantity])
          .then((result)=>{
            res.status(201).json({
              success: true,
              message: `add to cart successfully`,
              result:result.rows[0]
            })
          })
         }
        })
        .catch((error) => {
            res.status(409).json({
              success: false,
              message: "error in add creating cart",
              error: error.message
            })
          })
      })
       .catch((err) => {
        res.status(409).json({
          success: false,
          message: "error in add to creating cart",
          err: err.message,
        });
      });
};
//===============================================================GET ALL PRODUCT FROM CART ==============================================
const getAllCart = (req, res) => {
  const {cart_id} = req.params;
  const user_id = req.token.userId;

  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`,[cart_id,user_id])
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
  const {cart_id}=req.params;
  const user_id = req.token.userId;

  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`, [cart_id, user_id])
  .then((result) => {
    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this cart",
      });
    }

    pool.query(`DELETE FROM cart_products WHERE cart_id = $1 RETURNING *`, [cart_id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All products removed from the cart",
        deletedProducts: result.rows
      });
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
  const {cart_id , product_id} = req.params;
  const user_id = req.token.userId;

  pool.query(`SELECT * FROM cart WHERE cart_id = $1 AND user_id = $2`, [cart_id, user_id])
  .then((result) => {
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:"unauthorized access to this cart",
      });
    }
  })
  .catch((err) => {
    res.status(500).json({
      success: false,
      message: "cart not available",
      err: err.message,
    });
  });

  pool.query(`SELECT * FROM cart_products WHERE cart_id = $1 AND product_id = $2`, [cart_id, product_id])
  .then((result) => {
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:"product not found in the cart" ,
      });
    }
  })
  .catch((error) => {
    res.status(500).json({
      success: false,
      message: "the product is not in the cart",
      error: error.message
    });
  });

  pool.query(`DELETE FROM cart_products WHERE cart_id = $1 AND product_id = $2 RETURNING *`, 
    [cart_id, product_id])
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "deleted product",
        deletedProduct: result.rows[0]
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "server error",
        error: error.message
      });
    });
};

module.exports = {
  addProductToCart,
  getAllCart,
  deleteAllProductFromCart,
  deleteProductCartById,
};
 