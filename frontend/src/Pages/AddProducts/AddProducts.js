import axios from "axios";
import { useState ,useContext, useEffect } from "react";
import { setProducts} from '../../redux/reducers/Products/Products';
import {jwtDecode} from "jwt-decode"; 
import { useDispatch, useSelector } from 'react-redux';
import "./StyleAdd.css";

const Product = ()=>{
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const token = useSelector((state) => state.auth.token);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
 
//========================================================= Add Product ===================================================================    
 const handelOnClicAddProduct =async ()=>{
  let imageUrl = "";
  if (image) {
    imageUrl = await uploadImageToCloudinary();
    if (!imageUrl) {
      setMessage("Image upload failed");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
  }

  const newProduct = {
    name,
    description,
    price,
    images: imageUrl || image, 
  };
  

  axios.post("http://localhost:5000/product/",newProduct,{headers:{
    Authorization:`Bearer ${token}` 
  }})
  .then((result)=>{
    console.log(result);
    dispatch(setProducts())
    setMessage(result.data.message)
  })
  .catch((error)=>{
    setMessage(error.response.data.message)
    
  })
 }

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

return(
    <>
<div className="product-form-container">
  <div className="product-form-box">
    <h2 className="product-form-title">Add a new product</h2>
    {message && <div className="alert">{message}</div>}
    <form>
      <div className="form-group">
        <label htmlFor="productName" className="form-label">
          Product name
        </label>
        <input
          type="text"
          className="form-control"
          id="productName"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="productDescription" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="productDescription"
          rows="3"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="productPrice" className="form-label">
          Price
        </label>
        <input
          type="number"
          className="form-control"
          id="productPrice"
          placeholder="Enter the price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="productImage" className="form-label">
          Product image
        </label>
        <input
          type="file"
          className="form-control"
          id="productImage"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="button"
        className="btn-submit"
        onClick={handelOnClicAddProduct}
      >
        Add product
      </button>
    </form>
  </div>
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
)
}

export default Product;
 