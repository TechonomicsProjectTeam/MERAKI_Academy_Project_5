import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('resetToken'); 

    try {
      await axios.post("http://localhost:5000/users/reset-password", {
        token,
        newPassword
      });
      setMessage("Password has been reset successfully.");
      localStorage.removeItem('resetToken');
      localStorage.removeItem('resetEmail'); // Clear email from local storage
      navigate("/login");
    } catch (error) {
      setMessage("Error occurred while resetting password.");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
