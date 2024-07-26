import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { setLogin,setUserInfo } from "../../redux/reducers/Auth/Auth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      const token = result.data.token;
      const decodedToken = jwtDecode(token);
      const roleId = decodedToken.role; 

      dispatch(setLogin({
        token,
        userId: result.data.userId,
        roleId,
      }));

      getUserInfo(result.data.userId);

      if (roleId === 1) {
        navigate("/user-dashboard");
      } else if (roleId === 2) {
        navigate("/driver-dashboard");
      }
    } catch (error) {
      setMessage("Error occurred during login.");
    }
  };
  const getUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
      const userInfo = response.data.users;
      console.log(userInfo[0].images);
      console.log(userInfo[0].username);
      dispatch(setUserInfo({
        username: userInfo[0].username,
        images: userInfo[0].images
      }));
      
    } catch (error) {
      console.error("Error fetching user information", error);
    }
  };
  

  return (
    <div className="Form">
      <p className="Title">Login:</p>
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
        <button type="submit">Login</button>
        <div className="register-link">
          <p>Create new account? <a href="/register">Register here</a></p>
        </div>
      </form>
      {message && <div className="ErrorMessage">{message}</div>}
    </div>
  );
};

export default Login;
