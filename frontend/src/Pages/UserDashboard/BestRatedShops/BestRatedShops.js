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
  const [city, setCity] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);

  useEffect(() => {
    const fetchBestRatedShops = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/shop/shops/best-rated"
        );
        if (response.data.success) {
          console.log("Best Rated Shops fetched:", response.data.shops);
          dispatch(setBestRatedShops(response.data.shops));
        }
      } catch (error) {
        console.error("Error fetching best-rated shops:", error);
      }
    };

    fetchBestRatedShops();
  }, [dispatch]);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation is not supported by this browser.");
        setMessage("Geolocation is not supported by this browser.");
      }
    };

    const success = async (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Geolocation success:", { latitude, longitude });

      try {
        const response = await axios.get(
          `http://localhost:5000/api/get-api-key`
        );
        const apiKey = response.data.apiKey;

        const geoResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        console.log("Geocode API response:", geoResponse.data);

        const addressComponents =
          geoResponse.data.results[0]?.address_components;
        const cityComponent = addressComponents?.find((component) =>
          component.types.includes("locality")
        );
        if (cityComponent) {
          setCity(cityComponent.long_name);
          console.log("City found:", cityComponent.long_name);
          filterShopsByCity(cityComponent.long_name);
        } else {
          setMessage("City name not found in geocoding results.");
        }
      } catch (error) {
        console.error("Error fetching city name:", error);
        setMessage("Error fetching city name: " + error.message);
      }
    };

    const error = (err) => {
      console.log("Unable to retrieve your location:", err);
      setMessage("Unable to retrieve your location: " + err.message);
    };
    console.log(bestRatedShops);

    const filterShopsByCity = (city) => {
      console.log("Filtering shops by city:", city);
      const filtered = bestRatedShops.filter((shop) => {
        console.log(`Shop ${shop.name} city:`, shop.city);
        return shop.city === city;
      });
      console.log("Filtered shops:", filtered);
      setFilteredShops(filtered);
    };

    getLocation();
  }, [bestRatedShops]);

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
      <h2 className="best">Best Rated Shops</h2>
      {city && <p>Best rated shops in: {city}</p>}
      <ul className="best-rated-shop-list">
        {filteredShops.map((shop) => (
          <li
            key={shop.shop_id}
            onClick={() => handleShopClick(shop.shop_id, shop.name)}
          >
            <img src={shop.images} alt={`${shop.name}`} />
            <div className="separator"/>
            <h3>{shop.name}</h3>
            <p>Average Rating: {shop.average_rating}</p>
            <p>{shop.description}</p>
          </li>
        ))}
      </ul>
      {message && <p>{message}</p>}
    </div>
  );
};

export default BestRatedShops;
