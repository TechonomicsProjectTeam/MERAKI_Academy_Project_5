import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { setLogout } from '../../redux/reducers/Auth/Auth';
import "../NavBar/Style.css";

const NavBar = () => {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.auth.username);
  const imageUrl = useSelector((state) => state.auth.imageUrl);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const roleId = useSelector((state) => state.auth.roleId);

  const handleLogout = () => {
    dispatch(setLogout());
  };

  return (
    <div className="NavBar">
      <div className="user-info">
        {imageUrl && <img src={imageUrl} alt="User" className="user-image" />}
        {username && <span className="user-name">Welcome {username} !!</span>}
      </div>
      <nav>
        {isLoggedIn && roleId === 2 ? (
          <>
            <NavLink to="/driver-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Driver Dashboard
            </NavLink>
            <NavLink to="/login" onClick={handleLogout}>
              Logout
            </NavLink>
          </>
        ) : isLoggedIn ? (
          <>
            <NavLink to="/user-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              User Dashboard
            </NavLink>
            <NavLink to="/carts" className={({ isActive }) => (isActive ? 'active' : '')}>
              Carts
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
              Orders
            </NavLink>
            <NavLink to="/reviews" className={({ isActive }) => (isActive ? 'active' : '')}>
              Reviews
            </NavLink>
            <NavLink to="/user-settings" className={({ isActive }) => (isActive ? 'active' : '')}>
              User Settings
            </NavLink>
            <NavLink to="/login" onClick={handleLogout}>
              Logout
            </NavLink>
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
