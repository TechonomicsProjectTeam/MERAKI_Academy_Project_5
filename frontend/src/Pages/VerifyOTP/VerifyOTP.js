import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem('resetEmail'); // Get email from local storage

    try {
      const response = await axios.post("http://localhost:5000/users/verify-otp", { 
        email, 
        otp 
      });

      const { token } = response.data;
      localStorage.setItem('resetToken', token); // Store reset token

      setMessage("OTP verified successfully.");
      navigate("/reset-password"); 
    } catch (error) {
      setMessage("Invalid OTP.");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerifyOtp}>
        <input 
          type="text" 
          placeholder="Enter OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} 
        />
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VerifyOtp;
