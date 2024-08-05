const pool = require("../models/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRounds = parseInt(process.env.SALT);

const getAllShopCities = (req, res) => {
  const query = `SELECT DISTINCT city FROM shops WHERE is_deleted = 0`;

  pool
    .query(query)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "All shop cities",
        cities: response.rows,
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

const getBestRatedShops = (req, res) => {
  const query = `
    SELECT 
    shops.*,
      AVG(user_ratings.rating) as average_rating
    FROM 
      shops
    LEFT JOIN 
      user_ratings ON shops.shop_id = user_ratings.shop_id
    WHERE 
      shops.is_deleted = 0 
    GROUP BY 
      shops.shop_id
    HAVING 
      AVG(user_ratings.rating) > 0
    ORDER BY 
      average_rating DESC
    LIMIT 5;
  `;

  pool
    .query(query)
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "Best rated shops",
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

const updateShopRating = async (req, res) => {
  const user_id = req.token.userId;
  const { name, rating } = req.body;

  console.log("Request body:", req.body);

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Invalid shop name",
    });
  }

  if (!user_id || typeof user_id !== "number") {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }

  if (
    rating === undefined ||
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid rating value. It should be a number between 1 and 5.",
    });
  }

  try {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Check if the shop exists
      const shopCheckQuery = "SELECT shop_id FROM shops WHERE name = $1";
      const shopCheckResult = await client.query(shopCheckQuery, [name]);

      if (shopCheckResult.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: "Shop not found",
        });
      }

      const shop_id = shopCheckResult.rows[0].shop_id;

      // Insert new rating into user_ratings table
      const insertRatingQuery = `
        INSERT INTO user_ratings (shop_id, user_id, rating)
        VALUES ($1, $2, $3)
        RETURNING *`;
      const insertRatingResult = await client.query(insertRatingQuery, [
        shop_id,
        user_id,
        rating,
      ]);

      await client.query("COMMIT");

      res.status(200).json({
        success: true,
        message: "Shop rating added successfully",
        rating: insertRatingResult.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      res.status(500).json({
        success: false,
        message: "Transaction error",
        error: error.message,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

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
    city,
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
      city,
    ];

    // The query
    const query = `INSERT INTO shops (name,description,images,email,password,phone_number,category_id,role_id,city) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
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
    city,
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
    city,
    shop_id,
  ];

  const query = `
    UPDATE shops 
    SET category_id = COALESCE($1, category_id), 
        name = COALESCE($2, name), 
        description = COALESCE($3, description), 
        images = COALESCE($4, images), 
        email = COALESCE($5, email), 
        password = COALESCE($6, password), 
        phone_number = COALESCE($7, phone_number), 
        city = COALESCE($8, city) 
    WHERE shop_id = $9 
    RETURNING *`;

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

const getShopById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM shops WHERE is_deleted=0 AND shop_id = $1`;
  pool
    .query(query, [id])
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
};

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
  getShopsByCategoryId,
  getBestRatedShops,
  updateShopRating,
  getAllShopCities,
};
