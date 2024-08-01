import React from "react";
import { NavLink } from "react-router-dom";
import "./Style.css";

const LoginPrompt = () => {
  return (
    <div className="login-prompt-overlay">
      <div className="login-prompt-box">
        <h2>Welcome!</h2>
        <p>You need to log in to perform this action.</p>
        <div className="button-group">
          <NavLink to="/register" className="button">
            Register as User
          </NavLink>
          <NavLink to="/owner-register" className="button">
            Register as Owner
          </NavLink>
          <div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;