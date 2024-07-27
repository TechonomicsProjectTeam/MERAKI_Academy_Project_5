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
      const result = await axios.post("http://localhost:5000/shop/shop_login", {
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
      const response = await axios.get(`http://localhost:5000/shop/${shopId}`);
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
    <div className="Oner">
    <div className="Form">
      <p className="Title">Owner Login:</p>
      <form onSubmit={login}>
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
        <button className="buttonLogin" type="submit">Login</button>
       
      </form>
      <div className="owner_register-link">
          <p>Register as an owner? <a href="owner-register">Register here</a></p>
        </div>
      {message && <div className="ErrorMessage">{message}</div>}
    </div>
    </div>
  );
};

export default OwnerLogin
