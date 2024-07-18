const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const register = async (req, res) => {
    const {   first_name, last_name, username , phone_number, email, password } =
      req.body;
  const role_id='1'// edit the value of role_id depend on role id in role table .
    const encryptedPassword = await bcrypt.hash(password, saltRounds);
    const query = `INSERT INTO users (first_name, last_name, username, phone_number, email, password, role_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const data = [
      first_name,
      last_name,
      username,
      phone_number,
      email.toLowerCase(),
      encryptedPassword,
      role_id
    ];
    pool
      .query(query, data)
      .then((result) => {
        const users_id = result.rows[0].user_id;
        const newCart = `INSERT INTO cart (user_id , price) VALUES ($1,$2) RETURNING *`
        
        pool.query(newCart,[users_id,0])//total price=0
        .then((result)=>{
            res.status(200).json({
                success: true,
                message: "Account Cart created successfully",
                cart: result.rows[0]
              });
        })
        .catch((error)=>{
            res.status(409).json({
                success: false,
                message: "The email already exists",
                error: error
            })
        })
      })
      .catch((err) => {
        res.status(409).json({
          success: false,
          message: "The email already exists",
          err,
        });
      });
  };

  const login = (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const query = `SELECT * FROM users WHERE email = $1`;
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
                first_name: result.rows[0].first_name,
              };
              const options = { expiresIn: "1d" };
              const secret = process.env.SECRET;
              const token = jwt.sign(payload, secret, options);
              if (token) {
                return res.status(200).json({
                  token,
                  success: true,
                  message: `Valid login credentials`,
                  userId:result.rows[0].user_id
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

  module.exports = {
    register,
    login,
  };
