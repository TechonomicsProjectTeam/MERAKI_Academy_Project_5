import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { useGoogleLogin } from '@react-oauth/google';
import { setLogin, setUserInfo } from "../../redux/reducers/Auth/Auth";
import "../Login/Style.css";

const clientId = "660993533575-63pem1ln7g5e6s4cgreboadaajuio88g.apps.googleusercontent.com";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("https://quickserv.onrender.com/users/login", {
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
      } else if (roleId === 4) { 
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setMessage("Error occurred during login.");
    }
  };

  const getUserInfo = async (userId) => {
    try {
      const response = await axios.get(`https://quickserv.onrender.com/users/${userId}`);
      const userInfo = response.data.users;
      dispatch(setUserInfo({
        username: userInfo[0].username,
        images: userInfo[0].images,
      }));
    } catch (error) {
      console.error("Error fetching user information", error);
    }
  };

  const handleGoogleLoginSuccess = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log(response);
        const googleToken = response.code;

        const result = await axios.post("https://quickserv.onrender.com/users/google-login", { token: googleToken });
        const token = result.data.token;
        const decodedToken = jwtDecode(token);

        dispatch(setLogin({
          token,
          userId: decodedToken.userId,
          roleId: decodedToken.role,
          isLoggedInWithGoogle: true,
        }));

        getUserInfo(decodedToken.userId);

        if (decodedToken.role === 1) {
          navigate("/user-dashboard");
        } else if (decodedToken.role === 2) {
          navigate("/driver-dashboard");
        } else if (decodedToken.role === 4) { 
          navigate("/admin-dashboard");
        }
      } catch (error) {
        setMessage("Google login failed.");
      }
    },
    onError: () => {
      setMessage("Google login failed.");
    },
    flow: 'auth-code',
    scope: 'email profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
  });
   const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
<div className="body">
  <div className="form-container">
    <div className="image-container">
      <img src="https://img.freepik.com/premium-vector/free-vector-login-concept-illustration_713576-106.jpg?w=740" alt="Background Image" />
    </div>
    <div className="form-content">
      <p className="title">Login:</p>
      <form className="forms" onSubmit={login}>
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
      <div className="forgot-password">
        <p>
          <a href="#" onClick={navigateToForgotPassword}>Forgot Password?</a>
        </p>
      </div>
      <div className="owner_register-links">
        <p>Register as a user? <a href="/register">Register here</a></p>
      </div>
      <div className="google-login">
        <button onClick={() => handleGoogleLoginSuccess()} className="google-login-button">
          Login with Google
        </button>
      </div>
      {message && <div className="error-message">{message}</div>}
    </div>
  </div>
</div>
  );
};

export default Login;
