import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

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
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ element, role }) => {
  const { isLoggedIn, roleId } = useSelector((state) => state.auth);
  console.log(roleId);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (role && role !== roleId) {
    return <Navigate to="/" />;
  }

  return element;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children :[
{      path:'user-dashboard', element: <ProtectedRoute element={<UserDashboard />} role={1} />,
}    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children:[
      { path: '/driver-dashboard',
        element: <ProtectedRoute element={<DriverDashboard />} role={2} />,}
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'carts', element: <ProtectedRoute element={<Carts />} /> },
      { path: 'orders', element: <ProtectedRoute element={<Orders />} /> },
      { path: 'reviews', element: <ProtectedRoute element={<Reviews />} /> },
      { path: 'user-settings', element: <ProtectedRoute element={<UserSettings />} /> },
      { path: 'admin-dashboard', element: <ProtectedRoute element={<AdminDashboard />} /> },
      { path: 'driver-dashboard', element: <ProtectedRoute element={<DriverDashboard />} /> },
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
