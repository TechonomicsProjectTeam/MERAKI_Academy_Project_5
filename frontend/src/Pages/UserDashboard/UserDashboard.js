import React from 'react';
import { useParams } from 'react-router-dom';
import Category from './Category/Category';
import Shops from './Shops/Shops';
import ProductsShops from './Products/ProductsShops';
import ReviewsComponent from './Reviews/Reviews';

const UserDashboard = () => {
  const { categoryName, shopName, productId } = useParams();

  return (
    <div className="UserDashboard">
      {!categoryName && <Category />}
      {categoryName && !shopName && <Shops />}
      {categoryName && shopName && <ProductsShops />}
    </div>
  );
};


export default UserDashboard;
