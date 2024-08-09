import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/users/forgot-password", { email });
      localStorage.setItem('resetEmail', email); // Save email to local storage
      setMessage("An OTP has been sent to your email.");
      navigate("/verify-otp");
    } catch (error) {
      setMessage("Error occurred while requesting password reset.");
    }
  };

  return (
    <div className="body">
      <div className="Form">
        <p className="title">Forgot Password:</p>
        <form className="forms" onSubmit={handleForgotPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="button" type="submit">Send OTP</button>
        </form>
        {message && <div className="ErrorMessage">{message}</div>}
      </div>
    </div>
  );
};

export default ForgotPassword;
