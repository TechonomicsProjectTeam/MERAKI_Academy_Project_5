import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setProducts, deleteProductsById, updateProductsById } from '../../redux/reducers/Products/Products';
import {jwtDecode} from "jwt-decode"; 
import "./StyleOwner.css";
import socketInit from '../../socket.server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import Message from '../OwnerAdminMessage/message';

const ShopOwnerDashboard = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const token = useSelector((state) => state.auth.token);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  const decodedToken = jwtDecode(token);
  const shopId = decodedToken.shopId;
  const userName = decodedToken.shopName; 
  console.log(decodedToken);

  const getAllProductByShopId = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/product/${shopId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      dispatch(setProducts(response.data.products));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProductByShopId();
  }, []);

  const deleteProductById = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(deleteProductsById({ product_id: id }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async (id) => {
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
      name,
      description,
      price,
      images: imageUrl || image, 
    };

    try {
      const response = await axios.put(`http://localhost:5000/product/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      dispatch(updateProductsById(response.data.products));
      setMessage("Product updated successfully");
      setStatus(true);
      setSelectedProductId(null);
      setTimeout(() => setMessage(" "), 3000);
    } catch (error) {
      console.log(error);
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


  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    } else {
      console.log("Notification permission already granted");
    }
  }, []);
  
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
      });
  
      socket.on("connect_error", (error) => {
        setIsConnected(false);
      });
  
      socket.on("message", (data) => {
        console.log("Received message:", data);
        if (Notification.permission === "granted") {
          new Notification("New Message", {
            body: `${data.name}: ${data.message}`,
            icon: "/icons/envelope.svg"
          });
        } else {
          console.log("Notification permission not granted");
        }
      });
  
      return () => {
        socket.close();
        socket.removeAllListeners();
        setIsConnected(false);
      };
    }
  }, [socket]);
  
  // For testing
  useEffect(() => {
    if (Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification",
        icon: "/icons/envelope.svg"
      });
    }
  }, []);
  

  // Toggle modal visibility and manage socket connection
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSocket(socketInit(shopId, token));
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }
  
  return (
    <>
<div className='bodyShop'>
  <FontAwesomeIcon
    icon={faMessage}
    size='2x'
    onClick={toggleModal}
    className="contact-icon"
  />
  <Modal
    isOpen={isOpen}
    onRequestClose={toggleModal}
    contentLabel="Contact Modal"
    ariaHideApp={false}
    className="Modal"
    overlayClassName="Overlay"
  >
    <h3>Contact Admin</h3>
    <div className='message-container'>
      {isConnected && (
        <Message socket={socket} shop_id={shopId} to={20} senderName={userName} />
      )}
    </div>
  </Modal>

  <div className='Productss'>
    <h1 className='component'>Products Component</h1>
    <div className='products-grid'>
      {products?.map((product) => (
        product && product.product_id ? (
          <div className='products-item' key={product.product_id}>
            {selectedProductId === product.product_id ? (
              <form className='formss'>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="file" onChange={handleFileChange} />
                <button className='btn-save' type="button" onClick={() => handleUpdateProduct(product.product_id)}>Save</button>
                <br/>
                <br/>
                <button className='btn-cancel' type="button" onClick={() => setSelectedProductId(null)}>Cancel</button>
              </form>
            ) : (
              <div className='product-details'>
                <img src={product.images} alt={product.name} />
                <div className='text-container'>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>{product.price}</p>
                </div>
                <button className='btn-delete' onClick={() => deleteProductById(product.product_id)}>Delete</button>
                <br/>
                <br/>
                <button className='btn-update' onClick={() => {
                  setSelectedProductId(product.product_id);
                  setName(product.name);
                  setDescription(product.description);
                  setPrice(product.price);
                }}>Update</button>
              </div>
            )}
          </div>
        ) : null
      ))}
    </div>
    <div className={`message ${status ? "success" : "error"}`}>
      {message && <p>{message}</p>}
    </div>
  </div>
</div>

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

export default ShopOwnerDashboard;
