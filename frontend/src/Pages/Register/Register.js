import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUsers } from "../../redux/reducers/Users/Users";
import { useNavigate } from "react-router-dom";
import "../Register/Style.css"
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState(null);
  const [roleId, setRoleId] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  const createNewUser = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    if (image) {
      imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) {
        setMessage("Image upload failed");
        setTimeout(() => setMessage(""), 3000);
        return;
      }
    }

    try {
      const result = await axios.post("http://localhost:5000/users/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        username: userName,
        password,
        phone_number: phoneNumber,
        images: imageUrl,
        role_id: roleId,
      });

      if (result.data.success) {
        dispatch(addUsers(result.data.user));
        setMessage(result.data.message);
        setFirstName("");
        setLastName("");
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

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImageToCloudinary = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "rgtsukxl");
    data.append("cloud_name", "dqefjpmuo");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dqefjpmuo/image/upload", {
        method: "post",
        body: data
      });
      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  return (
    <div className="bodyRegister">
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
        <div className="file-input-container">
          <label htmlFor="image">Upload an Image:</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>
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
        <button className="regButton" type="submit">Register</button>
        <div className="login-link">
          <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
        <div className="owner_register-link">
          <p>Register as an owner? <a href="/owner-register">Register here</a></p>
        </div>
      </form>
      {status ? (
        <div className="SuccessMessage">{message}</div>
      ) : (
        message && <div className="ErrorMessage">{message}</div>
      )}
    </div>
    </div>
  );
};

export default Register;
