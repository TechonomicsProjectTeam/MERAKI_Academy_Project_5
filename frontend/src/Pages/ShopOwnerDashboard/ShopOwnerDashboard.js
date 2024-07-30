import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setProducts, deleteProductsById, updateProductsById } from '../../redux/reducers/Products/Products';
import {jwtDecode} from "jwt-decode"; 

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

  return (
    <div className='Products'>
      <h1>Products Component</h1>
      <div>
        {products?.map((product) => (
          console.log(product),
          product && product.product_id ? (
            <div key={product.product_id}>
              {selectedProductId === product.product_id ? (
                <form>
                  <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <input type="file" onChange={handleFileChange} />
                  <button type="button" onClick={() => handleUpdateProduct(product.product_id)}>Save</button>
                  <button type="button" onClick={() => setSelectedProductId(null)}>Cancel</button>
                </form>
              ) : (
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>{product.price}</p>
                  {product.images && <img src={product.images} alt={product.name} style={{ width: '100px' }} />}
                  <button onClick={() => deleteProductById(product.product_id)}>Delete</button>
                  <button onClick={() => {
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
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ShopOwnerDashboard;


