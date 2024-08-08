const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectUri,
});

const sendSms = require("./twilioService");

const otpStore = {};
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const forgotPassword = async (req, res) => {
  const email = req.body.email.toLowerCase();

  try {
    const userQuery = `SELECT * FROM users WHERE email = $1 AND is_deleted = 0`;
    const userResult = await pool.query(userQuery, [email]);

    if (userResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    otpStore[email] = otp;

    await sendSms("+962795294786", `Your OTP for password reset is ${otp}`);

    res
      .status(200)
      .json({ success: true, message: "OTP sent to your phone number" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const email = decoded.email;

    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updateQuery = `UPDATE users SET password = $1 WHERE email = $2 AND is_deleted = 0 RETURNING *`;
    const updateResult = await pool.query(updateQuery, [
      encryptedPassword,
      email,
    ]);

    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found or already deleted" });
    }

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res
      .status(400)
      .json({
        success: false,
        message: "Invalid or expired token",
        error: err.message,
      });
  }
};

const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    delete otpStore[email];
    const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "15m" });

    res.status(200).json({ success: true, message: "OTP verified", token });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const { tokens } = await client.getToken({
      code: token,
      clientId: client._clientId,
      clientSecret: client._clientSecret,
      redirectUri: client.redirectUri,
    });

    const idToken = tokens.id_token;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google login failed. No id_token found.",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: client._clientId,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, picture } = payload;

    let user = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email.toLowerCase(),
    ]);

    if (user.rowCount === 0) {
      const defaultPassword = await bcrypt.hash("default_password", saltRounds);

      let baseUsername = `${given_name}${family_name}`;
      let username = baseUsername;
      let count = 1;

      while (true) {
        const existingUser = await pool.query(
          `SELECT * FROM users WHERE username = $1`,
          [username]
        );
        if (existingUser.rowCount === 0) {
          break;
        }
        username = `${baseUsername}${count}`;
        count++;
      }

      const query = `INSERT INTO users (first_name, last_name, email, images, role_id, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
      const data = [
        given_name,
        family_name,
        email.toLowerCase(),
        picture,
        1,
        username,
        defaultPassword,
      ];

      const result = await pool.query(query, data);
      user = result;

      const user_id = user.rows[0].user_id;
      const newCartQuery = `INSERT INTO cart (user_id, price) VALUES ($1, $2) RETURNING *`;
      await pool.query(newCartQuery, [user_id, 0]);
    }

    const userData = user.rows[0];
    const payloadJwt = {
      userId: userData.user_id,
      username: userData.username,
      role: userData.role_id,
    };
    const tokenJwt = jwt.sign(payloadJwt, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: tokenJwt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
// Register User
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
    const userResult = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [lowerCaseUserName]
    );
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

// Login User
const login = (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT users.*, roles.role_name
    FROM users 
    JOIN roles ON users.role_id = roles.role_id 
    WHERE users.email = $1`;
  const data = [email.toLowerCase()];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        const user = result.rows[0];

        // Check if the user is banned
        if (user.is_deleted) {
          return res.status(403).json({
            success: false,
            message: "You are banned",
          });
        }

        bcrypt.compare(password, user.password, (err, response) => {
          if (err) {
            return res.json(err);
          }

          if (response) {
            const payload = {
              userId: user.user_id,
              username: user.username,
              role: user.role_id,
              role_name: user.role_name,
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);

            return res.status(200).json({
              token,
              success: true,
              message: `Valid login credentials`,
              userId: user.user_id,
            });
          } else {
            return res.status(403).json({
              success: false,
              message: `The email doesn’t exist or the password you’ve entered is incorrect`,
            });
          }
        });
      } else {
        throw new Error();
      }
    })
    .catch((err) => {
      return res.status(403).json({
        success: false,
        message:
          "The email doesn’t exist or the password you’ve entered is incorrect",
        err,
      });
    });
};

// Update User By ID
const updateUserById = async (req, res) => {
  const user_id = req.params.user_id;
  const {
    first_name,
    last_name,
    username,
    phone_number,
    email,
    password,
    images,
  } = req.body;

  try {
    // Ensure email and username are unique
    if (email) {
      const emailCheck = await pool.query(
        `SELECT * FROM users WHERE email = $1 AND user_id != $2`,
        [email.toLowerCase(), user_id]
      );
      if (emailCheck.rowCount > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }
    }
    if (username) {
      const usernameCheck = await pool.query(
        `SELECT * FROM users WHERE username = $1 AND user_id != $2`,
        [username.toLowerCase(), user_id]
      );
      if (usernameCheck.rowCount > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Username already exists" });
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
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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

// Delete User By ID
const deleteUserById = (req, res) => {
  const user_id = req.params.user_id;
  pool
    .query(`DELETE FROM users WHERE user_id = $1 RETURNING *`, [user_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        deletedUser: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

// Get All Users
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

const getUserById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE is_deleted =0 AND user_id=$1`;
  pool
    .query(query, [id])
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
};

const getUsersByRoleId = async (req, res) => {
  const { role_id } = req.params;

  // Validate role_id is a number
  if (isNaN(role_id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role ID",
    });
  }

  try {
    const query = `SELECT * FROM users WHERE role_id = $1`;
    const data = [role_id];

    const result = await pool.query(query, data);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found with the given role ID",
      });
    }

    res.status(200).json({
      success: true,
      message: `Users with role_id ${role_id}`,
      users: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Ban User By ID (soft delete)
const banUserById = (req, res) => {
  const user_id = req.params.user_id;
  pool
    .query(`UPDATE users SET is_deleted = 1 WHERE user_id = $1 RETURNING *`, [
      user_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "User banned successfully",
        bannedUser: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const unBanUserById = (req, res) => {
  const user_id = req.params.user_id;
  pool
    .query(`UPDATE users SET is_deleted = 0 WHERE user_id = $1 RETURNING *`, [
      user_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "User unbanned successfully",
        unbannedUser: result.rows[0],
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Server error",
        err: err.message,
      });
    });
};

const getAllDrivers = (req, res) => {
  pool
    .query(`SELECT * FROM users WHERE role_id = 2 AND is_deleted = 0`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All Drivers",
        drivers: result.rows,
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

const getUser = (req, res) => {
  pool
    .query(`SELECT * FROM users WHERE role_id = 1 AND is_deleted = 0`)
    .then((result) => {
      res.status(200).json({
        success: true,
        message: "All user",
        drivers: result.rows,
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

module.exports = {
  register,
  login,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getUserById,
  googleLogin,
  getUsersByRoleId,
  banUserById,
  unBanUserById,
  getAllDrivers,
  getUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
};
