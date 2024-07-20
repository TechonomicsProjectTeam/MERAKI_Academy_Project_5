const pool = require("../models/db");

const addCart = (req , res) =>{
    const {price , quantity} = req.body;
    const user_id = req.token.userId;
    const {product_id} = req.params;
    
}