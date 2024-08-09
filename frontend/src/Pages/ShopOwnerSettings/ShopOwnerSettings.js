import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode"; 
import { updateShopById, setShopInfo } from "../../redux/reducers/Shops/Shops";
import "./StyleSetting.css"
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
        const result = await axios.get(`https://quickserv.onrender.com/shop/${shop_id}`);
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
      const result = await axios.put(`https://quickserv.onrender.com/shop/${shop_id}`, updatedData);
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
    <>
    <div className="ShopOwnerSettings">
      <h2 className="oowner">Shop Owner Settings</h2>
      <form className="formOwner" onSubmit={editShop}>
        <label>
          Name:
          <br/>
          {console.log(name)}
          <input className="settingInput"  type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description:
          <br/>
         
          <input className="settingInput"  type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Email:
          <br/>
          <input className="settingInput"  type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password:
          <br/>
          <input className="settingInput"  type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Phone Number:
          <br/>
          <input className="settingInput" type="text" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} />
        </label>
        <label>
          City:
          <br/>
          <select className="settingInput"  value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="" disabled>Select a city</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>{cityName}</option>
            ))}
          </select>
        </label>
        <div className="file-input-container">
          <label htmlFor="image">Upload an Image:</label>
          <input className="settingInput"  type="file" id="image" name="image" accept="image/*" onChange={handleFileChange} />
        </div>
        <button className="button-setting" type="submit">Update Shop</button>
      </form>
      {message && <p className={status ? "success" : "error"}>{message}</p>}
    </div>
    <br/>
    <br/>
<footer class="footer">
<div class="footer-top">
  <div class="footer-column">
    <h3>Restaurants</h3>
    <ul>
      <li>Cozy Pizza</li>
      <li>Sizzle Grill</li>
      <li>MindHub</li>
      <li>WOK U LIKE</li>
      <li>McDonald's</li>
      <li>More Restaurants...</li>
    </ul>
  </div>
  {/* <div class="footer-column">
    <h3>Popular Cuisines</h3>
    <ul>
      <li>American</li>
      <li>Arabic</li>
      <li>Asian</li>
      <li>Beverages</li>
      <li>Breakfast</li>
      <li>More Cuisines...</li>
    </ul>
  </div> */}
  <div class="footer-column">
    <h3>Popular Areas</h3>
    <ul>
      <li>Al Mala'ab</li>
      <li>Al Huson</li>
      <li>Al Sareeh</li>
      <li>Al Mohammadiyeh Amman</li>
      <li>Bait Ras</li>
      <li>More Areas...</li>
    </ul>
  </div>
  <div class="footer-column">
    <h3>Cities</h3>
    <ul>
      <li>Ajloun</li>
      <li>Amman</li>
      <li>Aqaba</li>
      <li>Irbid</li>
      <li>Jerash</li>
      <li>More Cities...</li>
    </ul>
  </div>
  <div class="footer-column">
    <h3>Follow us on</h3>
    <ul class="social-media">
      <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
      <li><a href="#"><i class="fab fa-twitter"></i></a></li>
      <li><a href="#"><i class="fab fa-instagram"></i></a></li>
      <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
      <li><a href="#"><i class="fab fa-youtube"></i></a></li>
    </ul>
  </div>
</div>
<div class="footer-bottom">
  <ul>
    <li><a href="#">Careers</a></li>
    <li><a href="#">Terms and Conditions</a></li>
    <li><a href="#">FAQ</a></li>
    <li><a href="#">Privacy Policy</a></li>
    <li><a href="#">Contact Us</a></li>
    <li><a href="#">Sitemap</a></li>
  </ul>
  <p>©2024 QuickServ.com</p>
  <p>For any support or help you can contact us via our Live Chat</p>
</div>
</footer>
  </>
  );
};

export default ShopOwnerSettings;
