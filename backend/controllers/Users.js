const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

//========================================================REGISTER=========================================================
const register = async (req, res) => {
  const {
    first_name,
    last_name,
    username,
    phone_number,
    email,
    password,
    images,
    role_id,
  } = req.body;

  if (![1, 2].includes(role_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role ID",
    });
  }

  const lowerCaseUserName = username.toLowerCase();

  try {
    const userResult = await pool.query(`SELECT * FROM users WHERE username = $1`, [lowerCaseUserName]);
    if (userResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const query = `INSERT INTO users (first_name, last_name, username, phone_number, email, password, role_id, images) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const data = [
      first_name,
      last_name,
      lowerCaseUserName,
      phone_number,
      email.toLowerCase(),
      encryptedPassword,
      role_id,
      images,
    ];

    const result = await pool.query(query, data);

    if (result.rowCount > 0) {
      const user_id = result.rows[0].user_id;

      if (role_id === 1) {
        const newCartQuery = `INSERT INTO cart (user_id, price) VALUES ($1, $2) RETURNING *`;
        const cartResult = await pool.query(newCartQuery, [user_id, 0]); // total price = 0
        return res.status(200).json({
          success: true,
          message: "Account and cart created successfully",
          user: result.rows[0],
          cart: cartResult.rows[0],
        });
      }

      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: result.rows[0],
      });
    }

  } catch (error) {
    res.status(409).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
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
                userId: result.rows[0].user_id,
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
const updateUserById = async (req, res) => {
  const user_id = req.params.user_id;
  const { first_name, last_name, username, phone_number, email, password, images } = req.body;

  try {
    // Ensure email and username are unique
    if (email) {
      const emailCheck = await pool.query(`SELECT * FROM users WHERE email = $1 AND user_id != $2`, [email.toLowerCase(), user_id]);
      if (emailCheck.rowCount > 0) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
    }
    if (username) {
      const usernameCheck = await pool.query(`SELECT * FROM users WHERE username = $1 AND user_id != $2`, [username.toLowerCase(), user_id]);
      if (usernameCheck.rowCount > 0) {
        return res.status(400).json({ success: false, message: "Username already exists" });
      }
    }

    // Hash password if it is being updated
    let encryptedPassword = null;
    if (password) {
      encryptedPassword = await bcrypt.hash(password, saltRounds);
    }

    const query = `
      UPDATE users SET 
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        username = COALESCE($3, username),
        phone_number = COALESCE($4, phone_number),
        email = COALESCE($5, email),
        password = COALESCE($6, password),
        images = COALESCE($7, images)
        WHERE user_id = $8
        RETURNING *
    `;
    const data = [
      first_name,
      last_name,
      username ? username.toLowerCase() : null,
      phone_number,
      email ? email.toLowerCase() : null,
      encryptedPassword,
      images,
      user_id,
    ];

    const result = await pool.query(query, data);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
      updateUser: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      err: err.message,
    });
  }
};

//=============================================================DELETE USER BY ID========================================================
const deleteUserById = (req, res) => {
  const user_id = req.params.user_id;
  pool
    .query(`UPDATE users SET is_deleted=1 WHERE user_id = $1 RETURNING *`, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(403).json("user not found");
      }
      res.status(200).json({
        success: true,
        message: "Account deleted successfully",
        updateUser: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "server error",
        err,
      });
    });
};

//=============================================================GET ALL USERS========================================================
const getAllUsers = (req, res) => {
  pool
    .query(`SELECT * FROM  users WHERE is_deleted = 0`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: `All Users`,
        users: result.rows,
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

const getUserById= (req,res)=>{
  const {id}=req.params
  const query =`SELECT * FROM users WHERE is_deleted =0 AND user_id=$1`
  pool.query(query,[id])
  .then((result) => {
    res.status(200).json({
      success: true,
      message: `Users info for id ${id}`,
      users: result.rows,
    });
  })
  .catch((error) => {
    res.status(500).json({
      success: false,
      message: "Server error",
      Error: error.message,
    });
  });
}

module.exports = {
  register,
  login,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById
};
