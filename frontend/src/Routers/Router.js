import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import AdminLayout from "../Layouts/AdminLayout"; 
import Carts from "../Pages/Carts/Carts";
import Orders from "../Pages/Orders/Orders";
import UserDashboard from "../Pages/UserDashboard/UserDashboard";
import UserSettings from "../Pages/UserSettings/UserSettings";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import DriverDashboard from "../Pages/DriverDashboard/DriverDashboard";
import Login from "../Pages/Login/Login";
import OwnerLogin from "../Pages/OwnerLogin/OwnerLogin";
import OwnerRegister from "../Pages/OwnerRegister/OwnerRegister";
import Products from "../Pages/AddProducts/AddProducts";
import Register from "../Pages/Register/Register";
import ShopOwnerDashboard from "../Pages/ShopOwnerDashboard/ShopOwnerDashboard";
import ShopOwnerSettings from "../Pages/ShopOwnerSettings/ShopOwnerSettings";
import Shops from "../Pages/UserDashboard/Shops/Shops";
import ProductsShops from "../Pages/UserDashboard/Products/ProductsShops";
import Category from "../Pages/UserDashboard/Category/Category";
import CategoriesForAdmin from "../Pages/AdminDashboard/CategoriesForAdmin/CategoriesForAdmin";
import UpdateCategoriesForAdmin from "../Pages/AdminDashboard/CategoriesForAdmin/UpdateCategoriesForAdmin";
import Drivers from "../Pages/AdminDashboard/Drivers/Drivers";
import UpdateDriver from "../Pages/AdminDashboard/Drivers/UpdateDriver";
import OrdersAdmin from "../Pages/AdminDashboard/Orders/OrdersAdmin";
import ReviewsAdmin from "../Pages/AdminDashboard/Reviews/ReviewsAdmin";
import Role_Permissions from "../Pages/AdminDashboard/Role_Permissions/Role_Permissions";
import ShopsAdmin from "../Pages/AdminDashboard/Shops/ShopsAdmin";
import UpdateShopAdmin from "../Pages/AdminDashboard/Shops/UpdateShopAdmin";
import ChatDriver from "../Pages/Chat/ChatDriver";
import ChatUser from "../Pages/Chat/ChatUser";
import UsersAdmin from "../Pages/AdminDashboard/Users/UsersAdmin";
import UpdateUsersAdmin from "../Pages/AdminDashboard/Users/UpdateUsersAdmin";
import ForgotPassword from "../Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword/ResetPassword";
import VerifyOtp from "../Pages/VerifyOTP/VerifyOTP";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/owner-register",
    element: <OwnerRegister />,
  },
  {
    path: "/owner-login",
    element: <OwnerLogin />,
  },
  {
    path: "/forgot-password" ,
    element: <ForgotPassword/>
  },
  {
    path: "/reset-password",
    element: <ResetPassword/>
  },
  {
    path:"/verify-otp",
    element: <VerifyOtp/>
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "carts", element: <Carts /> },
      { path: "orders", element: <Orders /> },
      { path: "ChatUser" , element: <ChatUser /> },
      {
        path: "user-dashboard",
        element: <UserDashboard />,
        children: [
          { path: "", element: <Category /> },
          { path: ":categoryName", element: <Shops /> },
          { path: ":categoryName/:shopName", element: <ProductsShops /> },
          { path: ":categoryName/:shopName/:productId", element: <ProductsShops /> },
        ],
      },
      { path: "user-settings", element: <UserSettings /> },
      { path: "driver-dashboard", element: <DriverDashboard /> },
      { path: "products", element: <Products /> },
      { path: "shop-owner-dashboard", element: <ShopOwnerDashboard /> },
      { path: "shop-owner-settings", element: <ShopOwnerSettings /> },
      { path: "ChatDriver" , element: <ChatDriver /> },
    ],
  },
  {
    path: "/admin-dashboard",
    element: <AdminLayout />,
    children: [
      { path: "", element: <AdminDashboard /> },
      { path: "categories", element: <CategoriesForAdmin /> },
      { path: "update-category/:categoryId", element: <UpdateCategoriesForAdmin /> },
      { path: "drivers", element: <Drivers /> },
      { path: "update-driver/:user_id", element: <UpdateDriver /> },
      { path: "order_admin", element: <OrdersAdmin /> },
      { path: "reviews_admin", element: <ReviewsAdmin /> },
      { path: "role-permissions", element: <Role_Permissions /> },
      { path: "shops-admin", element: <ShopsAdmin /> },
      { path: "update-shop/:shopId", element: <UpdateShopAdmin /> },
      { path: "users-admin", element: <UsersAdmin /> },
      { path: "update-users-admin/:user_id", element: <UpdateUsersAdmin /> },
    ],
  },
]);
