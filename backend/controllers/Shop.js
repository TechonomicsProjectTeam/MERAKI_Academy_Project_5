const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const createShops = async (req, res) => {
  const role_id = 3;
  // Collecting the shop data from the body
  const {
    category_id,
    name,
    description,
    images,
    email,
    password,
    phone_number,
  } = req.body;

  try {
    // Check if email or name already exists
    const checkQuery = `SELECT * FROM shops WHERE email = $1 OR name = $2`;
    const checkValues = [email.toLowerCase(), name.toLowerCase()];
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Email or shop name already exists",
      });
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Values of the query
    const values = [
      name.toLowerCase(),
      description,
      images,
      email.toLowerCase(),
      hashedPassword,
      phone_number,
      category_id,
      role_id,
    ];

    // The query
    const query = `INSERT INTO shops (name,description,images,email,password,phone_number,category_id,role_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const response = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Shop created successfully",
      result: response.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteShopsById = (req, res) => {
  const shop_id = req.params.id;
  const query = `Update shops SET is_deleted=1 WHERE shop_id = $1 returning *`;

  pool
    .query(query, [shop_id])
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Shop deleted",
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

const getAllShops = (req, res) => {
  const query = `SELECT * FROM shops WHERE is_deleted = 0`;

  pool
    .query(query)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "All the shops",
        shops: response.rows,
      });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    });
};

const updateShopById = (req, res) => {
  const {
    category_id,
    name,
    description,
    images,
    email,
    password,
    phone_number,
  } = req.body;
  const shop_id = req.params.id;
  const values = [
    category_id,
    name,
    description,
    images,
    email,
    password,
    phone_number,
    shop_id,
  ];
  const query = `UPDATE shops SET category_id = COALESCE($1,category_id), name = COALESCE($2,name),description = COALESCE($3,description),images = COALESCE($4,images), email = COALESCE($5,email),password = COALESCE($6,password),phone_number = COALESCE($7,phone_number) WHERE shop_id = $8 RETURNING *`;

  pool
    .query(query, values)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: `Shop with id: ${shop_id} updated successfully`,
        shop: response.rows[0],
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    });
};

const loginShop = (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT shops.*,roles.role_name
  FROM shops
  JOIN roles ON shops.role_id=roles.role_id
  WHERE email = $1`;
  const data = [email.toLowerCase()];

  pool
    .query(query, data)
    .then((result) => {
      if (result.rows.length) {
        bcrypt.compare(password, result.rows[0].password, (err, response) => {
          if (err) res.json(err);
          if (response) {
            const payload = {
              shopId: result.rows[0].shop_id,
              role: result.rows[0].role_id,
              shopName: result.rows[0].name,
              roleName: result.rows[0].role_name,
            };
            const options = { expiresIn: "1d" };
            const secret = process.env.SECRET;
            const token = jwt.sign(payload, secret, options);
            if (token) {
              return res.status(200).json({
                token,
                success: true,
                message: "Valid login credentials",
                shopId: result.rows[0].shop_id,
              });
            } else {
              throw new Error();
            }
          } else {
            res.status(403).json({
              success: false,
              message:
                "The email doesn’t exist or the password you’ve entered is incorrect",
            });
          }
        });
      } else {
        throw new Error();
      }
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

const getShopById= (req,res)=>{
const {id}=req.params
const query=`SELECT * FROM shops WHERE is_deleted=0 AND shop_id = $1`
pool.query(query,[id])
.then((result) => {
  res.status(200).json({
    success: true,
    message: `Shops info for id ${id}`,
    shops: result.rows,
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

const getShopsByCategoryId = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM shops WHERE category_id = $1 AND is_deleted = 0`;

  pool
    .query(query, [id])
    .then((response) => {
      res.status(200).json({
        success: true,
        message: `Shops in category ${id}`,
        shops: response.rows,
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
  createShops,
  deleteShopsById,
  getAllShops,
  updateShopById,
  loginShop,
  getShopById,
  getShopsByCategoryId
};
