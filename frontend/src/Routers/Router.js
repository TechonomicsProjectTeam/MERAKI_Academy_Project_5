import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '../Layouts/MainLayout';
import Carts from '../Pages/Carts/Carts';
import Orders from '../Pages/Orders/Orders';
import Reviews from '../Pages/Reviews/Reviews';
import UserSettings from '../Pages/UserSettings/UserSettings';
import AdminDashboard from '../Pages/AdminDashboard/AdminDashboard';
import DriverDashboard from '../Pages/DriverDashboard/DriverDashboard';
import Login from '../Pages/Login/Login';
import OwnerLogin from '../Pages/OwnerLogin/OwnerLogin';
import OwnerRegister from '../Pages/OwnerRegister/OwnerRegister';
import Products from '../Pages/Products/Products';
import Register from '../Pages/Register/Register';
import ShopOwnerDashboard from '../Pages/ShopOwnerDashboard/ShopOwnerDashboard';
import UserDashboard from '../Pages/UserDashboard/UserDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'carts', element: <Carts /> },
      { path: 'orders', element: <Orders /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'user-settings', element: <UserSettings /> },
      { path: 'admin-dashboard', element: <AdminDashboard /> },
      { path: 'driver-dashboard', element: <DriverDashboard /> },
      { path: 'login', element: <Login /> },
      { path: 'owner-login', element: <OwnerLogin /> },
      { path: 'owner-register', element: <OwnerRegister /> },
      { path: 'products', element: <Products /> },
      { path: 'register', element: <Register /> },
      { path: 'shop-owner-dashboard', element: <ShopOwnerDashboard /> },
      { path: 'user-dashboard', element: <UserDashboard /> },
    ],
  },
]);
