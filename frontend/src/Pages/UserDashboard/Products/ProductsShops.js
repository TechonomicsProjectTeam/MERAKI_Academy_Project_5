import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { addProductFromCart, SetCartId } from '../../../redux/reducers/Carts/Carts';
import { setProducts } from '../../../redux/reducers/Products/Products';
import LoginPrompt from '../../LoginPrompt/LoginPrompt';
import Rating from 'react-rating-stars-component';
import ReviewsComponent from "../Reviews/Reviews";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons'; 
import './ProductsShops.css';

const ProductsShops = ({ showProducts, setShowProducts, showShops, setShowShops }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.cartId);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const { categoryName, shopName } = useParams();
  const products = useSelector((state) => state.product.products);
  const shopId = localStorage.getItem('selectedShopId'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [quantities, setQuantities] = useState({});
  const [to, setTo] = useState(5);
  const [from, setFrom] = useState(0);
  const productsPerPage = 5;
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (shopId) {
      axios
        .get(`http://localhost:5000/product/${shopId}`)
        .then((response) => {
          if (response.data.success) {
            dispatch(setProducts(response.data.products));
          }
        })
        .catch((error) => {
          console.error("Error fetching products by shop:", error);
        });
    }
  }, [shopId, dispatch]);

  useEffect(() => {
    if (!cartId && token) {
      const fetchCartId = async () => {
        try {
          const result = await axios.get(
            `http://localhost:5000/carts/cart/userId`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (result.data.cart.length > 0) {
            dispatch(SetCartId({ cartId: result.data.cart[0].cart_id }));
          }
        } catch (error) {
          console.error("Error fetching cart ID:", error);
        }
      };

      fetchCartId();
    }
  }, [cartId, token, dispatch]);

  const addProductToCart = async (product) => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    const quantity = quantities[product.product_id] || 1;
    try {
      const result = await axios.post(
        `http://localhost:5000/carts/${product.product_id}`,
        {
          cart_id: cartId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.success) {
        dispatch(
          addProductFromCart({
            product_id: product.product_id,
            name: product.name,
            images: product.images,
            price: product.price,
            quantity,
          })
        );
        setMessage(result.data.message);
      } else {
        setMessage("Failed to add product to cart. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Error adding product to cart:", error);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/user-dashboard/${categoryName}/${shopName}/${product.product_id}`);
  };

  const handleShowMore = () => {
    setTo((prevTo) => Math.min(prevTo + productsPerPage, filteredProducts.length));
  };

  const handleShowLess = () => {
    setFrom((prevFrom) => Math.max(prevFrom - productsPerPage, 0));
    setTo((prevTo) => Math.max(prevTo - productsPerPage, productsPerPage));
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleRatingSubmit = async () => {
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    if (!shopName) {
      setRatingMessage("Shop name is not provided.");
      return;
    }

    try {
      const result = await axios.post(
        `http://localhost:5000/shop/shops/rating`,
        {
          name: shopName,
          user_id: userId,
          rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (result.data.success) {
        setRatingMessage("Rating submitted successfully!");
      } else {
        setRatingMessage("Failed to submit rating. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      if (error.response && error.response.data) {
        setRatingMessage(error.response.data.message);
      } else {
        setRatingMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {selectedProduct ? (
        <>
          <div className="product-details-container">
            <div className="product-Image">
              <h3>{selectedProduct.name}</h3>
              <div className="product-image-container">
                <img src={selectedProduct.images} alt={selectedProduct.name} />
              </div>
            </div>
            <div className="Product-details">
              <p>{selectedProduct.description}</p>
              <p>Price: ${selectedProduct.price}</p>
              <div>
                <input
                  type="number"
                  value={quantities[selectedProduct.product_id] || 1}
                  min="1"
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [selectedProduct.product_id]: parseInt(e.target.value),
                    })
                  }
                />
                <button onClick={() => addProductToCart(selectedProduct)}>
                  Add to Cart
                </button>
                {message && <p>{message}</p>}
              </div>
            </div>
          </div>
          <div className="product-reviews">
            <ReviewsComponent productId={selectedProduct.product_id} />
          </div>
        </>
      ) : (
        <>
          <div className='rating-section'>
            <h3>Rate this Shop</h3>
            <Rating
              count={5}
              value={rating}
              onChange={handleRatingChange}
              size={24}
              activeColor="#ffd700"
            />
            <button onClick={handleRatingSubmit}>Submit Rating</button>
            {ratingMessage && <p>{ratingMessage}</p>}
          </div>

          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <h2>Products</h2>
          <ul className="product-list">
            {filteredProducts.slice(from, to).map((product) => (
              <li key={product.product_id} onClick={() => handleProductClick(product)}>
                <h3>{product.name}</h3>
                <div className="product-image-container">
                  <img src={product.images} alt={product.name} />
                </div>
                <p>Price: ${product.price}</p>
              </li>
            ))}
          </ul>
          {to < filteredProducts.length && (
            <button onClick={handleShowMore}>Show More</button>
          )}
          {from > 0 && <button onClick={handleShowLess}>Show Less</button>}
          
          {showLoginPrompt && <LoginPrompt />}
        </>
      )}
    </div>
  );
};

export default ProductsShops;
