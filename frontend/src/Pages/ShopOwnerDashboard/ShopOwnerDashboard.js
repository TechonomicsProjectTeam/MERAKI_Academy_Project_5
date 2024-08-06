import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setProducts, deleteProductsById, updateProductsById } from '../../redux/reducers/Products/Products';
import {jwtDecode} from "jwt-decode"; 
import "./Style.css";
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
    if (socket) {
      socket.on("connect", () => {
        setIsConnected(true);
      });

      socket.on("connect_error", (error) => {
        console.log(error);
        setIsConnected(false);
      });

      return () => {
        socket.close();
        socket.removeAllListeners();
        setIsConnected(false);
      };
    }
  }, [socket]);

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
            <Message socket={socket} shop_id={shopId} to={20} />
          )}
        </div>
      </Modal>
    <div className='Products'>
      <h1 className='h11'>Products Component</h1>
      <div className='divv' >
        {products?.map((product) => (
          console.log(product),
          product && product.product_id ? (
            <div className='product-item' key={product.product_id}>
              {selectedProductId === product.product_id ? (
                <form className='forms'>
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <input type="file" onChange={handleFileChange} />
                  <button className='btn-save' type="button" onClick={() => handleUpdateProduct(product.product_id)}>Save</button>
                  <button className='btn-cancel' type="button" onClick={() => setSelectedProductId(null)}>Cancel</button>
                </form>
              ) : (
                <div className='divv' >
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>{product.price}</p>
                  {product.images && <img src={product.images} alt={product.name}  />}
                  <button className='btn-delete' onClick={() => deleteProductById(product.product_id)}>Delete</button>
                  <button className='btn-update' onClick={() => {
                    setSelectedProductId(product.product_id);
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price);
                    setImage(product.images);
                  }}>Update</button>
                </div>
              )}
            </div>
          ) : null
        ))}
      </div >
      {message && <p>{message}</p>}
    </div>
    </div>
  );
};

export default ShopOwnerDashboard;


