import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { addProductFromCart, SetCartId } from '../../../redux/reducers/Carts/Carts';
import LoginPrompt from '../../LoginPrompt/LoginPrompt';
import ReviewsComponent from '../Reviews/Reviews';
import './ProductsShops.css';

const ProductsShops = ({ showProducts, setShowProducts, showShops, setShowShops }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.cartId);
  const token = useSelector((state) => state.auth.token);
  const { categoryName, shopName, productId } = useParams();
  const products = useSelector((state) => state.product.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [quantities, setQuantities] = useState({});
  const [to, setTo] = useState(5);
  const [from, setFrom] = useState(0);
  const productsPerPage = 5;
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  const handleBackClick = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else if (showProducts) {
      setShowProducts(false);
      setShowShops(true);
    } else if (showShops) {
      setShowShops(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    navigate(`/user-dashboard/${categoryName}/${shopName}/${product.product_id}`);
  };

  const handleShowMore = () => {
    setFrom(from + productsPerPage);
    setTo(to + productsPerPage);
  };

  const handleShowLess = () => {
    setFrom(from - productsPerPage);
    setTo(to - productsPerPage);
  };

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
          <h2>Products</h2>
          <ul className="product-list">
            {products?.slice(from, to)?.map((product) => (
              <li key={product.product_id} onClick={() => handleProductClick(product)}>
                <h3>{product.name}</h3>
                <div className="product-image-container">
                  <img src={product.images} alt={product.name} />
                </div>
                <p>Price: ${product.price}</p>
              </li>
            ))}
          </ul>
          {to < products.length && (
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
