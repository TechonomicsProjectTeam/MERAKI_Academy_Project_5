import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCategories } from '../../redux/reducers/Categories/Categories';
import { setShopsByCategory } from '../../redux/reducers/Shops/Shops';
import { setProducts } from '../../redux/reducers/Products/Products';
import "../UserDashboard/UserDashboard.css";
import { addProductFromCart } from '../../redux/reducers/Carts/Carts';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.category.categories);
  const shops = useSelector(state => state.shops.shops);
  const products = useSelector(state => state.product.products);
  const cartId = useSelector(state => state.cart.cartId);
  const token = useSelector(state => state.auth.token);
console.log(cartId);
  const [showCategories, setShowCategories] = useState(true);
  const [showShops, setShowShops] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [message, setMessage] = useState("");
  const [quantities, setQuantities] = useState({}); 
  const [to, setTo] = useState(5);
  const [from, setFrom] = useState(0);
  const productsPerPage = 5;

  const addProductToCart = async (product) => {
    const quantity = quantities[product.product_id] || 1;
    try {
      const result = await axios.post(`http://localhost:5000/carts/${product.product_id}`, {
        cart_id: cartId,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(result.data);
      if (result.data.success) {
        dispatch(addProductFromCart({
          product_id: product.product_id,
          name: product.name,
          images: product.images,
          price: product.price,
          quantity,
        })); 
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

  useEffect(() => {
    axios.get('http://localhost:5000/categories/')
      .then(response => {
        if (response.data.success) {
          dispatch(getCategories(response.data.category));
        }
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    axios.get(`http://localhost:5000/shop/category/${categoryId}`)
      .then(response => {
        if (response.data.success) {
          dispatch(setShopsByCategory(response.data.shops));
          setShowCategories(false);
          setShowShops(true);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the shops by category!', error);
      });
  };

  const handleShopClick = (shopId) => {
    axios.get(`http://localhost:5000/product/${shopId}`)
      .then(response => {
        if (response.data.success) {
          dispatch(setProducts(response.data.products));
          setShowShops(false);
          setShowProducts(true);
          setFrom(0);
          setTo(productsPerPage);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the products by shop!', error);
      });
  };

  const handleBackClick = () => {
    if (showProducts) {
      setShowProducts(false);
      setShowShops(true);
    } else if (showShops) {
      setShowShops(false);
      setShowCategories(true);
    }
  };

  const handleShowMoreProducts = () => {
    setTo(to + productsPerPage);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value, 10)
    });
  };

  const displayedProducts = products.slice(from, to);

  return (
    <div className='UserDashboard'>
      <h1>User Dashboard</h1>
      {message && <p>{message}</p>}
      {showCategories && (
        <div>
          <h2>Categories</h2>
          <ul className='category-list'>
            {categories.map(category => (
              <li key={category.category_id} onClick={() => handleCategoryClick(category.category_id)}>
                {category.name}
                <img src={category.images} alt={category.name} className="category-image" />
              </li>
            ))}
          </ul>
        </div>
      )}
      {showShops && (
        <div>
          <button className='back-button' onClick={handleBackClick}>Back to Categories</button>
          <h2>Shops</h2>
          <ul className='shop-list'>
            {shops.map(shop => (
              <li key={shop.shop_id} onClick={() => handleShopClick(shop.shop_id)}>{shop.name}</li>
            ))}
          </ul>
        </div>
      )}
      {showProducts && (
        <div>
          <button className='back-button' onClick={handleBackClick}>Back to Shops</button>
          <h2>Products</h2>
          <ul className='product-list'>
            {displayedProducts.map(product => (
              <li key={product.product_id}>
                <h3>{product.name}</h3>
                <h3>${product.price}</h3>
                <p>{product.description}</p>
                <img src={product.images} alt={product.name} className="product-image" />
                <input 
                  type="number" 
                  value={quantities[product.product_id] || 1} 
                  onChange={(e) => handleQuantityChange(product.product_id, e.target.value)} 
                  min="1"
                />
                <button onClick={() => addProductToCart(product)}>Add to Cart</button>
              </li>
            ))}
          </ul>
          {to < products.length && (
            <button className='show-more-button' onClick={handleShowMoreProducts}>
              Show More Products
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
  