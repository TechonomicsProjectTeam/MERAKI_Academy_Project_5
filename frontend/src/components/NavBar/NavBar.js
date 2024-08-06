import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setLogout } from "../../redux/reducers/Auth/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../NavBar/Style.css";
import { clearCartState } from "../../redux/reducers/Carts/Carts";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const username = useSelector((state) => state.auth.username);
  const imageUrl = useSelector((state) => state.auth.images);
  const isLoggedIn = useSelector((state) => state.auth.token);
  const roleId = useSelector((state) => state.auth.roleId);
  const shopName = useSelector((state) => state.shops.name);
  const shopImage = useSelector((state) => state.shops.images);

  const handleLogout = () => {
    dispatch(setLogout());
    dispatch(clearCartState());
    navigate("/user-dashboard");
  };

  return (
    <div className="NavBar">
      <div className="user-info">
        {imageUrl && <img src={imageUrl} alt="User" className="user-image" />}
        {username && <span className="user-name">Welcome {username} !!</span>}
      </div>
      <div className="cart-icon">
        {/* <NavLink to="/cart">
            <FontAwesomeIcon icon={faShoppingCart} />
          </NavLink> */}
      </div>
      <nav>
        {isLoggedIn ? (
          parseInt(roleId) === 3 ? (
            <>
              <div className="user-info">
                {shopImage && <img src={shopImage} alt="Shop" className="user-image" />}
                {shopName && <span className="user-name">Welcome {shopName} !!</span>}
              </div>
              <NavLink
                to="/shop-owner-dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Shop Owner Dashboard
              </NavLink>
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Add Products
              </NavLink>
              <NavLink
                to="/shop-owner-settings"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Shop Owner Settings
              </NavLink>
              <NavLink to="/owner-login" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          ) : parseInt(roleId) === 2 ? (
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
          ) : parseInt(roleId) === 4 ? (
            <>
              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Admin Dashboard
              </NavLink>
              <NavLink
                to="/admin-dashboard/categories"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Categories
              </NavLink>
              <NavLink
                to="/admin-dashboard/drivers"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Drivers
              </NavLink>
              <NavLink
              to="/admin-dashboard/order_admin"
              className={({ isActive }) => (isActive ? "active" : "")}
              >
              Orders
              </NavLink>
              <NavLink 
              to="/admin-dashboard/reviews_admin"
              className={({ isActive }) => (isActive ? "active" : "")}
              >
              Reviews
              </NavLink>
              <NavLink to="/admin-dashboard/role-permissions"
              className={({ isActive }) => (isActive ? "active" : "")}
              >
              Roles
              </NavLink>
              <NavLink
              to="/admin-dashboard/shops-admin"
              className={({ isActive }) => (isActive ? "active" : "")}
              >
              Shops
              </NavLink>
              <NavLink to="/login" onClick={handleLogout}>
                Logout
              </NavLink>
            </>
          ) : parseInt(roleId) === 1 ? (
            <>
              <NavLink
                to="/user-dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                User Dashboard
              </NavLink>
              <NavLink
                to="/orders"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Orders
              </NavLink>
              <NavLink
                to="/carts"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Cart
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
            </>
          ) : null
        ) : (
          <>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default NavBar;
