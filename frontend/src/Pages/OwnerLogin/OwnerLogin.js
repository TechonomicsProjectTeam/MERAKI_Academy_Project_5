import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { setLogin} from "../../redux/reducers/Auth/Auth";
import {setShopInfo} from "../../redux/reducers/Shops/Shops"
import "../OwnerLogin/Style.css";

const OwnerLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("https://quickserv.onrender.com/shop/shop_login", {
        email,
        password,
      });

      const token = result.data.token;
      const decodedToken = jwtDecode(token);
      const roleId = decodedToken.role; 

      dispatch(setLogin({
        token,
        userId: result.data.shopsId,
        roleId,
      }));

      getUserInfo(result.data.shopId);
      navigate("/shop-owner-dashboard")
    } catch (error) {
      setMessage("Error occurred during login.");
    }
  };
  const getUserInfo = async (shopId) => {
    try {
      const response = await axios.get(`https://quickserv.onrender.com/shop/${shopId}`);
      const userInfo = response.data.shops;
      console.log(response.data);
      console.log(userInfo[0].name);
      console.log(userInfo[0].images);
      dispatch(setShopInfo({
        name: userInfo[0].name,
        images: userInfo[0].images
      }));
      
    } catch (error) {
      console.error("Error fetching user information", error);
    }
  };
  return (
    <div className="body">
      <div className="form-container">
       <div className="image-container">
        <img src="https://img.freepik.com/premium-vector/free-vector-login-concept-illustration_713576-106.jpg?w=740" alt="Background Image" />
       </div>
       <div className="form-content">
      <p className="title">Owner Login:</p>
      <form className="forms"  onSubmit={login}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="button" type="submit">Login</button>
       
      </form>
      <br/>
      <div className="owner_register-links">
          <p>Register as an owner? <a href="owner-register">Register here</a></p>
        </div>
        
      {message && <div className="error-message">{message}</div>}
      </div>
    </div>
    </div>
  );
};

export default OwnerLogin
