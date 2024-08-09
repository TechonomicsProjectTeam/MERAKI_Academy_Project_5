import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { setLogout } from '../redux/reducers/Auth/Auth';
import { useDispatch } from "react-redux";
import "./AdminLayout.css";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <i className="fas fa-bars hamburger-icon d-md-none" onClick={toggleSidebar}></i>
        <nav className={`col-md-2 sidebar ${isSidebarOpen ? 'open' : 'd-none d-md-block'}`}>
          <div className="sidebar-sticky">
            <ul className="nav flex-column">
              <li className="nav-item">
                <NavLink to="/admin-dashboard" className="nav-link" activeClassName="active">
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/categories" className="nav-link" activeClassName="active">
                  <i className="fas fa-th-list"></i> Categories
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/drivers" className="nav-link" activeClassName="active">
                  <i className="fas fa-car"></i> Drivers
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/order_admin" className="nav-link" activeClassName="active">
                  <i className="fas fa-shopping-cart"></i> Orders
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/reviews_admin" className="nav-link" activeClassName="active">
                  <i className="fas fa-comments"></i> Reviews
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/role-permissions" className="nav-link" activeClassName="active">
                  <i className="fas fa-user-shield"></i> Roles
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/shops-admin" className="nav-link" activeClassName="active">
                  <i className="fas fa-store"></i> Shops
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/admin-dashboard/users-admin" className="nav-link" activeClassName="active">
                  <i className="fas fa-users"></i> Users
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/login" onClick={handleLogout} className="nav-link">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
