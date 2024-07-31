const pool = require("../models/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const saltRounds = parseInt(process.env.SALT);
//! We don't need to create multi accounts for admin just to make it professional we create a script for it!
//To create admin type in the terminal for backend (CREATE_ADMIN =TRUE node index.js)
//Make sure the user name is unique and the email as well 
const createAdmin = async () => {
  const first_name = "Admin";
  const last_name = "User";
  const username = "Admin";
  const phone_number = "1234567890";
  const email = "Admin@yahoo.com";
  const password = "123456";
  const role_id = 4; 

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE username = $1 OR email = $2`,
      [username, email]
    );

    if (userResult.rowCount > 0) {
      console.log("Admin user already exists.");
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, saltRounds);

    const query = `INSERT INTO users (first_name, last_name, username, phone_number, email, password, role_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
    const data = [
      first_name,
      last_name,
      username.toLowerCase(),
      phone_number,
      email.toLowerCase(),
      encryptedPassword,
      role_id,
    ];

    const result = await pool.query(query, data);

    if (result.rowCount > 0) {
      console.log("Admin user created successfully:", result.rows[0]);
    }
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

module.exports = createAdmin; 
