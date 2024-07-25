import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUsers } from "../../redux/reducers/Users/Users";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState("");
  const [roleId, setRoleId] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  const createNewUser = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:5000/users/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        username: userName,
        password,
        phone_number: phoneNumber,
        images: image,
        role_id: roleId,
      });

      if (result.data.success) {
        dispatch(addUsers(result.data.user));
        setMessage(result.data.message);
        setFirstName("");
        setLastName("");
        setImage("");
        setEmail("");
        setPassword("");
        setUserName("");
        setPhoneNumber("");
        setStatus(true);
        
        setTimeout(() => navigate("/login"), 2000); 
      } else {
        setMessage(result.data.message);
        setStatus(true);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      setStatus(false);
    }
  };

  return (
    <div className="Register">
      <form onSubmit={createNewUser}>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <div>
          <label>
            <input
              type="checkbox"
              checked={roleId === 2}
              onChange={(e) => setRoleId(e.target.checked ? 2 : 1)}
            />
            Register as Driver
          </label>
        </div>
        <button type="submit">Register</button>
        <div className="login-link">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
      </form>
      {status ? (
        <div className="SuccessMessage">{message}</div>
      ) : (
        message && <div className="ErrorMessage">{message}</div>
      )}
    </div>
  );
};

export default Register;
