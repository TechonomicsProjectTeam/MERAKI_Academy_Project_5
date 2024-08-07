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
      } else if (roleId === 4) { 
        navigate("/admin-dashboard");
      }
    } catch (error) {
      setMessage("Error occurred during login.");
    }
  };

  const getUserInfo = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${userId}`);
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

        const result = await axios.post("http://localhost:5000/users/google-login", { token: googleToken });
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

  return (
    <div className="body">
    <div className="form-container">
      <div className="image-container">
        <img src="https://png.pngtree.com/png-vector/20230429/ourlarge/pngtree-free-vector-login-concept-illustration-png-image_6743219.png" alt="Login Illustration" />
      </div>
      <div className="form-content">
        <p className="title">Welcome!
          <br/> Sign in to your Account</p>
        <form onSubmit={login}>
          <input
          className="inputs"
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
           className="inputs"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">Sign In</button>
        </form>
        {/* <p className="forgot-password">Forgot Password?</p> */}
        <div className="google-login">
          <button onClick={() => handleGoogleLoginSuccess()} className="google-login-button">
            Login with Google
          </button>
        </div>
        <div className="register-link">
          <p>Register as a user? <a href="/register">Sign Up</a></p>
        </div>
        {message && <div className="error-message">{message}</div>}
      </div>
    </div>
  </div>
  );
};

export default Login;
