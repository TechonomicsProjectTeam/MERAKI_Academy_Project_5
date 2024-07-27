import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../redux/reducers/Categories/Categories"; 
import { addShops } from "../../redux/reducers/Shops/Shops";
import { useNavigate } from "react-router-dom";
import "../OwnerRegister/Style.css";

const OwnerRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  const createNewShop = async (e) => {
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
      const result = await axios.post("http://localhost:5000/shop/", {
        name,
        description,
        email,
        password,
        phone_number: phoneNumber,
        images: imageUrl,
        category_id,
      });

      if (result.data.success) {
        dispatch(addShops(result.data.result));
        setMessage(result.data.message)
        setStatus(true);
        setTimeout(() => navigate("/owner-login"), 2000); 
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
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dqefjpmuo/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return null;
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories/")
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.category);
          dispatch(getCategories(response.data.category));
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, [dispatch]);

  // const handleCategoryClick = (id) => {
  //   setCategory_id(id);
  //   console.log(id);
  // };

  return (
    <div className="onerRegisters">
    <div className="OwnerRegister">
          {status ? (
        <div className="SuccessMessage">{message}</div>
      ) : (
        message && <div className="ErrorMessage">{message}</div>
      )}
      <h1>Owner Register</h1>
      <div className="test">
      <form onSubmit={createNewShop}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input type="file" onChange={handleFileChange} />
        <div className="categories">
            <h2>Select Category</h2>
            <select
              value={category_id}
              onChange={(e) => setCategory_id(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        <button type="submit">Create Shop</button>
      </form>
      <div className="login-link">
          <p>Already have an account? <a href="/owner-login">Login here</a></p>
        </div>
      <div className="register-link">
          <p>Register as an user? <a href="/">Register here</a></p>
        </div>
        </div>
    </div>
    </div>
  );
};

export default OwnerRegister;
