import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { updateShopById, setShopInfo } from '../../../redux/reducers/Shops/Shops';
import { Button, Form } from 'react-bootstrap';
import './UpdateShopAdmin.css';

const cities = ["Amman", "Balqa", "Zarqa", "Madaba", "Irbid", "Ajloun", "Jarash", "Mafraq", "Karak", "Tafilah", "Ma'an", "Aqaba"];

const UpdateShopAdmin = () => {
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shop = useSelector((state) =>
    state.shops.shops.find((shop) => shop.shop_id === parseInt(shopId))
  );
  console.log(shop);
  

  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    image: null,
    email: '',
    password: '',
    phone_number: '',
    city: '',
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        category_id: shop.category_id,
        name: shop.name,
        description: shop.description,
        image: shop.images,
        email: shop.email,
        password: shop.password,
        phone_number: shop.phone_number,
        city: shop.city,
      });
    }
  }, [shop]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const uploadImageToCloudinary = async (image) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = formData.image;

    if (formData.image instanceof File) {
      imageUrl = await uploadImageToCloudinary(formData.image);
      if (!imageUrl) {
        console.error("Image upload failed");
        return;
      }
    }

    const updatedData = {
      ...formData,
      image: imageUrl,
    };

    try {
      const result = await axios.put(`http://localhost:5000/shop/${shopId}`, updatedData);
      if (result.data.success) {
        dispatch(updateShopById(result.data.shop));
        dispatch(setShopInfo({ name: result.data.shop.name, images: result.data.shop.images }));
        navigate('/admin-dashboard/shops-admin');
      } else {
        console.error(result.data.message);
      }
    } catch (error) {
      console.error("Failed to update shop:", error);
    }
  };

  return (
    <div className="updateShopAdmin">
      <h1>Update Shop</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="category_id">
          <Form.Label>Category ID</Form.Label>
          <Form.Control
            type="text"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="phone_number">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            as="select"
            name="city"
            value={formData.city}
            onChange={handleChange}
          >
            <option value="" disabled>Select a city</option>
            {cities.map((cityName) => (
              <option key={cityName} value={cityName}>{cityName}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="image">
          <Form.Label>Upload an Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update Shop
        </Button>
      </Form>
    </div>
  );
};

export default UpdateShopAdmin;
