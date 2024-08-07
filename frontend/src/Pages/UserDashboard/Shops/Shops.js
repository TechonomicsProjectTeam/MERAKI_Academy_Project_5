import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { setProducts } from "../../../redux/reducers/Products/Products";
import LoginPrompt from "../../LoginPrompt/LoginPrompt";
import Category from "../Category/Category";
import "../Shops/Shops.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-free/css/all.min.css';
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

      try {
        const response = await axios.get(
          `http://localhost:5000/api/get-api-key`
        );
        const apiKey = response.data.apiKey;

        const geoResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const addressComponents =
          geoResponse.data.results[0]?.address_components;
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
  console.log(filteredShops);

  return (
    <>
    <div className="Shops">

    {/* <h1>Shops</h1> */}
    {city && <p>You are in: {city}</p>}
    <button className="navigate-back" onClick={() => navigate(-1)}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
    <button className="navigate-front" onClick={() => navigate(+1)}>
      <FontAwesomeIcon icon={faArrowRight} />
    </button>
    {filteredShops?.length > 0 && (
      <div>
        <h3>All Shops in {city}</h3>
        <ul>
          {filteredShops.map((shop) => (
            <li key={shop.shop_id} onClick={() => handleShopClick(shop.shop_id, shop.name)}>
              <img src={shop.images} alt={`${shop.name}`} />
              <div className="separator"/>
              <h3>{shop.name}</h3>
              <p>{shop.description}</p>
            </li>
          ))}
        </ul>
      </div>
    )}
    {showLoginPrompt && <LoginPrompt />}

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
    <p>©2024 Talabat.com</p>
    <p>For any support or help you can contact us via our Live Chat</p>
  </div>
</footer>
  </>
  );
};

export default Shops;
