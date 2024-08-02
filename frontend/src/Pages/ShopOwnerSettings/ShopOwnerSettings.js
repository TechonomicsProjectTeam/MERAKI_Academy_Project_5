import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode"; 
import { updateShopById, setShopInfo } from "../../redux/reducers/Shops/Shops";

const cities = ["Amman", "Balqa", "Zarqa", "Madaba", "Irbid", "Ajloun", "Jarash", "Mafraq", "Karak", "Tafilah", "Ma'an", "Aqaba"];

const ShopOwnerSettings = () => {
  const dispatch = useDispatch();
  const shopName = useSelector((state) => state.shops.name);

  const [name, setName] = useState(shopName);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const shop_id = decodedToken.shopId;

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const result = await axios.get(`http://localhost:5000/shop/${shop_id}`);
        console.log(result.data.shops);
        if (result.data.success) {
          const shop = result.data.shops[0];
          setName(shop.name || "");
          setDescription(shop.description || "");
          setEmail(shop.email || "");
          setPhone_number(shop.phone_number || "");
          setCity(shop.city || "");
        }
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      }
    };
    fetchShopData();
  }, [shop_id]);

  const editShop = async (e) => {
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
      category_id: category_id || null,
      name: name || null,
      description: description || null,
      images: imageUrl || image || null,
      email: email || null,
      password: password || null,
      phone_number: phone_number || null,
      city: city || null,
    };
  
    console.log("Updated Data:", updatedData);
  
    try {
      const result = await axios.put(`http://localhost:5000/shop/${shop_id}`, updatedData);
      if (result.data.success) {
        console.log(result.data.shop);
        dispatch(updateShopById(result.data.shop));
        dispatch(setShopInfo({ name: result.data.shop.name, images: result.data.shop.images }));
        setMessage(result.data.message);
        setStatus(true);
      } else {
        setMessage(result.data.message);
        setStatus(false);
      }
    } catch (error) {
      console.error("Failed to update shop:", error);
      setMessage("Server error");
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
    <div className="ShopOwnerSettings">
      <h2>Shop Owner Settings</h2>
      <form onSubmit={editShop}>
        <label>
          Name:
          {console.log(name)}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Phone Number:
          <input type="text" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />
        </label>
        <label>
          City:
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="" disabled>Select a city</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>{cityName}</option>
            ))}
          </select>
        </label>
        <div className="file-input-container">
          <label htmlFor="image">Upload an Image:</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Update Shop</button>
      </form>
      {message && <p className={status ? "success" : "error"}>{message}</p>}
    </div>
  );
};

export default ShopOwnerSettings;
