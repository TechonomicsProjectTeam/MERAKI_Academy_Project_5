import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateUserById } from "../../../redux/reducers/Users/Users";
import { setUserInfo } from "../../../redux/reducers/Auth/Auth";
import "./UpdateUsersAdmin.css"

const UpdateUsersAdmin = () => {
  const { user_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await axios.get(`https://quickserv.onrender.com/users/${user_id}`);
        if (result.data.success) {
          const user = result.data.users[0];
          setFirst_name(user.first_name || "");
          setLast_name(user.last_name || "");
          setEmail(user.email || "");
          setUsername(user.username || "");
          setPhone_number(user.phone_number || "");
          setImage(user.images || null);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [user_id]);

  const editUser = async (e) => {
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

    const updatedData = {
      first_name,
      last_name,
      email,
      username,
      password,
      phone_number,
      images: imageUrl || image,
    };

    try {
      const result = await axios.put(`https://quickserv.onrender.com/users/${user_id}`, updatedData);
      if (result.data.success) {
        dispatch(updateUserById(result.data.updateUser));
        dispatch(setUserInfo({ username: result.data.updateUser.username, images: result.data.updateUser.images }));
        setMessage(result.data.message);
        setStatus(true);
        navigate('/admin-dashboard/users-admin');  
      } else {
        setMessage(result.data.message);
        setStatus(false);
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
        body: data,
      });
      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  return (
    <div className="editUser">
      <form onSubmit={editUser}>
        <input
          placeholder="FirstName"
          value={first_name}
          onChange={(e) => setFirst_name(e.target.value)}
        />
        <input
          placeholder="LastName"
          value={last_name}
          onChange={(e) => setLast_name(e.target.value)}
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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          value={phone_number}
          onChange={(e) => setPhone_number(e.target.value)}
        />
        <div className="file-input-container">
          <label htmlFor="image">Upload an Image:</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Update User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateUsersAdmin;
