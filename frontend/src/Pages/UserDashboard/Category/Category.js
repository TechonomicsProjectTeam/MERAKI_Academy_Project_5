import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../../redux/reducers/Categories/Categories';
import { setShopsByCategory } from '../../../redux/reducers/Shops/Shops';
import BestRatedShops from '../BestRatedShops/BestRatedShops';
import "../Category/Category.css";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    axios
      .get('http://localhost:5000/categories/')
      .then((response) => {
        if (response.data.success) {
          dispatch(getCategories(response.data.category));
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [dispatch]);

  const handleCategoryClick = (categoryId, categoryName) => {
    axios
      .get(`http://localhost:5000/shop/category/${categoryId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(setShopsByCategory(response.data.shops));
          navigate(`/user-dashboard/${categoryName}`);
        }
      })
      .catch((error) => {
        console.error('Error fetching shops by category:', error);
      });
  };

  return (
    <div className="Category">
      <h2>Categories</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.category_id} onClick={() => handleCategoryClick(category.category_id, category.name)}>
            {category.name}
            <img src={category.images} alt={category.name} className="category-image" />
          </li>
        ))}
      </ul>
      <BestRatedShops />
    </div>
  );
};

export default Category;
