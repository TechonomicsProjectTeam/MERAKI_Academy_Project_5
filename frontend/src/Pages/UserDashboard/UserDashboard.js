import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCategories } from '../../redux/reducers/Categories/Categories';
import { setShopsByCategory } from '../../redux/reducers/Shops/Shops';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.category.categories);
  const shops = useSelector(state => state.shops.shops);
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/categories/')
      .then(response => {
        if (response.data.success) {
          console.log(response.data);
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
        console.log(response.data);
        if (response.data.success) {
          dispatch(setShopsByCategory(response.data.shops));
          setShowCategories(false);
        }
      })
      .catch(error => {
        console.error('There was an error fetching the shops by category!', error);
      });
  };

  const handleBackClick = () => {
    setShowCategories(true);
  };

  return (
    <div className='UserDashboard'>
      <h1>User Dashboard</h1>
      {showCategories ? (
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
      ) : (
        <div>
          <button className='back-button' onClick={handleBackClick}>Back to Categories</button>
          <h2>Shops</h2>
          <ul className='shop-list'>
            {shops.map(shop => (
              <li key={shop.shop_id}>{shop.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
