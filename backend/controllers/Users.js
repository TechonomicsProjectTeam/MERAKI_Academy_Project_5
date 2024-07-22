const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

//========================================================REGISTER=========================================================
const register = async (req, res) => {
  const { first_name, last_name, username, phone_number, email, password, images,role_id } =
    req.body;
    if(![1,2].includes(role_id)){
      return res.status(400).json({
        success:false,
        message:"Invalid role ID"
      })
    }

  pool.query(`SELECT * FROM users WHERE username = $1`,[username])
  .then((result)=>{
    if(result.rowCount>0){
      return res.status(400).json({
        success:false,
        message:"Username already axists"
      })
    }
  })

  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  const query = `INSERT INTO users (first_name, last_name, username, phone_number, email, password, role_id , images) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning *`;
  const data = [
    first_name,
    last_name,
    username,
    phone_number,
    email.toLowerCase(),
    encryptedPassword,
    role_id,
    images,
  ];
  pool
    .query(query, data)
    .then((result) => {
      console.log("fisrt result is ok", result);
      if(result.rowCount){
      const users_id = result.rows[0].user_id;
      const newCart = `INSERT INTO cart (user_id,price) VALUES ($1,$2) RETURNING *`
      pool.query(newCart, [users_id,0])//total price = 0
        .then((result) => {
          console.log("second result is ok");
          res.status(200).json({
            success: true,
            message: "Account Cart created successfully",
            cart: result.rows
          });
        })
        .catch((error) => {
          res.status(409).json({
            success: false,
            message: "error in creating cart",
            error: error.message
          })
        })

      res.status(201).json({
        success: true,
        message: "Account Created Successfully",
        user: result.rows[0]
      })
    }
    })
    .catch((err) => {
      res.status(409).json({
        success: false,
        message: "The email already exists",
        err: err.message,
      });
    });
};

//===========================================================LOGIN========================================================
const login = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const query = ` SELECT users.*, roles.role_name
    FROM users 
    JOIN roles ON users.role_id = roles.role_id 
    WHERE users.email = $1 `;
  const data = [email.toLowerCase()];
  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              userId: result.rows[0].user_id,
              username: result.rows[0].username,
              role: result.rows[0].role_id,
              role_name: result.rows[0].role_name,
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: `Valid login credentials`,
                userId: result.rows[0].user_id
              });
            } else {
              throw Error;
            }
          } else {
            res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else throw Error;
    })
    .catch((err) => {
      res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};

//=======================================================UPDATE USER BY ID=====================================================
const updateUserById = (req, res) => {
  const user_id = req.params.user_id;
  const { first_name, last_name, username, phone_number, email, password, images } =
    req.body;

  pool.query(`UPDATE users SET  first_name = $1, last_name= $2, username = $3, phone_number =$4, email =$5, password =$6 , images =$7 WHERE user_id =$8 RETURNING * `,
    [first_name, last_name, username, phone_number, email, password, images, user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json("user not found")
      }
      res.status(200).json({
        success: true,
        message: "Account updated successfully",
        updateUser: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message:
          "server error",
        err,
      });
    });
};

//=============================================================DELETE USER BY ID========================================================
const deleteUserById = (req, res) => {
  const user_id = req.params.user_id;
  pool.query(`DELETE FROM users WHERE user_id = $1 RETURNING *`, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json("user not found")
      }
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
        updateUser: result.rows[0]
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message:
          "server error",
        err,
      });
    });
};

//=============================================================GET ALL USERS========================================================
const getAllUsers= (req,res)=>{
  pool.query(`SELECT * FROM  users WHERE is_deleted = 0`)
  .then((result)=>{
    res.status(200).json({
        success:true,
        message:`All Users`,
        users:result.rows
    })
})
.catch((error)=>{
    res.status(500).json({
        success:false,
        message:"Server error",
        Error:error.message
    })
})
}

module.exports = {
  register,
  login,
  updateUserById,
  deleteUserById,
  getAllUsers
};
