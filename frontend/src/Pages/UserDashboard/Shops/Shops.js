import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { setProducts } from "../../../redux/reducers/Products/Products";
import LoginPrompt from "../../LoginPrompt/LoginPrompt";
import Category from "../Category/Category";

const Shops = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const shops = useSelector((state) => state.shops.shops);

  const [selectedShop, setSelectedShop] = useState(null);
  const [city, setCity] = useState("");
  const [filteredShops, setFilteredShops] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log("Geolocation is not supported by this browser.");
        setError("Geolocation is not supported by this browser.");
      }
    };

    const success = async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = "AIzaSyBulbig3i8qybGh32tKMETGZxd9GZM7DhE";

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const addressComponents = response.data.results[0]?.address_components;
        const cityComponent = addressComponents?.find((component) =>
          component.types.includes("locality")
        );
        if (cityComponent) {
          setCity(cityComponent.long_name);
          filterShopsByCity(cityComponent.long_name);
        } else {
          setError("City name not found in geocoding results.");
        }
      } catch (error) {
        console.error("Error fetching city name:", error);
        setError("Error fetching city name: " + error.message);
      }
    };

    const error = (err) => {
      console.log("Unable to retrieve your location:", err);
      setError("Unable to retrieve your location: " + err.message);
    };

    const filterShopsByCity = (city) => {
      const filtered = shops.filter((shop) => shop.city === city);
      setFilteredShops(filtered);
    };

    getLocation();
  }, [shops]);

  const handleShopClick = (shopId, shopName) => {
    setSelectedShop(shopId);
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
    <div className="Shops">
      <h1>Shops</h1>
      {city && <p>You are in: {city}</p>}
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        {" "}
        Back{" "}
      </button>
      <button
        onClick={() => {
          navigate(+1);
        }}
      >
        Front
      </button>
      {filteredShops?.length > 0 && (
        <div>
          <h2>Shops in {city}:</h2>
          <ul>
            {filteredShops.map((shop) => (
              <li
                key={shop.shop_id}
                onClick={() => handleShopClick(shop.shop_id, shop.name)}
              >
                {shop.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showLoginPrompt && <LoginPrompt />}
    </div>
  );
};

export default Shops;
