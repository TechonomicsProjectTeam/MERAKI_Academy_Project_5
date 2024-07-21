const pool = require("../models/db");

const authorization = (string) => {
  return function (req, res, next) {
    const role_id = req.token.role;
    
    const data = [role_id, string];
    const query = `SELECT * FROM role_permissions RP INNER JOIN permissions P ON RP.permission_id = P.permission_id WHERE RP.role_id = ($1) AND P.permission_name = ($2)`;
    pool
      .query(query, data)
      .then((result) => {
        console.log(result.rows);
        if (result.rows.length) {
          next();
        } else {
          throw Error;
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "unauthorized" ,err:err.message});
      });
  };
};

module.exports = authorization;
