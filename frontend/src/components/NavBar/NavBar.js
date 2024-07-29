import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setLogout } from "../../redux/reducers/Auth/Auth";
import {
  setProductFromCart,
  addProductFromCart,
  decreaseProductQuantityById,
  SetCartId
} from "../../redux/reducers/Carts/Carts";
import "../NavBar/Style.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const shopName = useSelector((state) => state.shops.name);
  const shopImages = useSelector((state) => state.shops.images);
  const username = useSelector((state) => state.auth.username);
  const imageUrl = useSelector((state) => state.auth.images);
  const isLoggedIn = useSelector((state) => state.auth.token);
  const roleId = useSelector((state) => state.auth.roleId);
  const userId = useSelector((state) => state.auth.userId);
  const cart = useSelector((state) => state.cart.carts);
  const cartId = useSelector((state) => state.cart.cartId);

  console.log(cartId);

  const getCartIdByUserId = async () => {
    const result = await axios.get(`http://localhost:5000/carts/cart/userId`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(result.data);
    dispatch(SetCartId({
      cartId: result.data.cart[0].cart_id
    }));
  }

  const getCartProductByCartId = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/carts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result.data);
      dispatch(
        setProductFromCart({
          products: result.data.products,
        })
      );
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      getCartProductByCartId();
      getCartIdByUserId();
    }
  }, [userId, token, isLoggedIn]);

  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  const increaseProductQuantity = async (productId, quantity) => {
    try {
      await axios.post(
        `http://localhost:5000/carts/${productId}`,
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
      console.log(cartId);
      dispatch(addProductFromCart({ product_id: productId, quantity }));
    } catch (error) {
      console.error("Error increasing product quantity:", error);
    }
  };

  const decreaseProductQuantity = async (productId) => {
    try {
      await axios.post(
        `http://localhost:5000/carts/decrease/${cartId}/products/${productId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(decreaseProductQuantityById({ product_id: productId }));
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
    }
  };

  const increaseQuantity = (productId) => {
    increaseProductQuantity(productId, 1);
  };

  const decreaseQuantity = (productId) => {
    decreaseProductQuantity(productId);
  };

  return (
    <div className="NavBar">
      <div className="user-info">
        {imageUrl && <img src={imageUrl} alt="User" className="user-image" />}
        {username && <span className="user-name">Welcome {username} !!</span>}
      </div>
      {isLoggedIn && parseInt(roleId) === 3 && (
        <div className="user-info">
          {shopImages && (
            <img src={shopImages} alt="Shop" className="user-image" />
          )}
          {shopName && <span className="shop-name">{shopName}</span>}
        </div>
      )}
      <nav>
        {isLoggedIn && parseInt(roleId) === 2 ? (
          <>
            <NavLink
              to="/driver-dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Driver Dashboard
            </NavLink>
            <NavLink to="/login" onClick={handleLogout}>
              Logout
            </NavLink>
          </>
        ) : isLoggedIn ? (
          <>
            <NavLink
              to="/products"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Products
            </NavLink>
            <NavLink
              to="/user-dashboard"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              User Dashboard
            </NavLink>
            <NavLink
              to="/carts"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Carts
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Orders
            </NavLink>
            <NavLink
              to="/reviews"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Reviews
            </NavLink>
            <NavLink
              to="/user-settings"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              User Settings
            </NavLink>
            <NavLink to="/login" onClick={handleLogout}>
              Logout
            </NavLink>
            <div className="cart-icon">
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="cart-count">{cart?.length}</span>
              <div className="cart-dropdown">
                {cart?.length > 0 ? (
                  <ul>
                    {cart.map((item, index) => (
                      <li key={index}>
                        <img
                          src={item.images}
                          alt={item.name}
                          className="cart-item-image"
                        />
                        <p>
                          {item.name} - {item.quantity} x ${item.price}
                        </p>
                        <div className="icon-container">
                          <FontAwesomeIcon
                            icon={faPlus}
                            onClick={() => increaseQuantity(item.product_id)}
                            className="icon"
                          />
                          <FontAwesomeIcon
                            icon={faMinus}
                            onClick={() => decreaseQuantity(item.product_id)}
                            className="icon"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No items in cart</span>
                )}
              </div>
            </div>
          </>
        ) : (
          <NavLink to="/login" onClick={handleLogout}>
            Logout
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
