import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { setProducts } from "../../../redux/reducers/Products/Products";
import { setBestRatedShops } from "../../../redux/reducers/Shops/Shops";
import "../Shops/Shops.css";

const BestRatedShops = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const bestRatedShops = useSelector((state) => state.shops.bestRatedShops);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBestRatedShops = async () => {
      try {
        const response = await axios.get("http://localhost:5000/shop/shops/best-rated");
        if (response.data.success) {
          dispatch(setBestRatedShops(response.data.shops));
        }
      } catch (error) {
        console.error("Error fetching best-rated shops:", error);
      }
    };

    fetchBestRatedShops();
  }, [dispatch]);

  const handleShopClick = (shopId, shopName) => {
    axios
      .get(`http://localhost:5000/product/${shopId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(setProducts(response.data.products));
          navigate(`/user-dashboard/${categoryName}/${shopName}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching products by shop:", error);
      });
  };

  return (
    <div className="BestRatedShops">
      <h2>Best Rated Shops</h2>
      <ul className="best-rated-shop-list">
        {bestRatedShops.map((shop) => (
          <li
            key={shop.shop_id}
            onClick={() => handleShopClick(shop.shop_id, shop.name)}
          >
            <h3>{shop.name}</h3>
            <p>Average Rating: {shop.average_rating}</p>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BestRatedShops;
