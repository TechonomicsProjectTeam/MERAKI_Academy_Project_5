import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUserById } from "../../redux/reducers/Users/Users";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

/* 
  When submitted the user get changed BUT when an input is left empty it changes it to an empty string
  AND
*/

const UserSettings = () => {
  const dispatch = useDispatch();
  const users=useSelector((state)=>console.log(state.user.users))
  const [first_name, setFirst_name] = useState(null);
  const [last_name, setLast_name] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [images, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.userId;

  const editUser = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.put(`http://localhost:5000/users/${user_id}`, {
        first_name,
        last_name,
        email,
        username,
        password,
        phone_number,
        images,
      });
      if (result.data.success) {
        console.log(result.data);
        dispatch(updateUserById(result.data.updateUser));
        setMessage(result.data.message);
        setStatus(true);
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

  return (
    <div className="editUser">
    </div>
  );
};

export default UserSettings;
