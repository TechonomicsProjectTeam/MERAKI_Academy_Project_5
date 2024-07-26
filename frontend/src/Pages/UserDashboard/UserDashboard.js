import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCategories } from '../../redux/reducers/Categories/Categories';


const UserDashboard = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.category.categories);

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

  return (
    <div className='UserDashboard'>
      <h1>User Dashboard</h1>
      <h2>Categories</h2>
      <ul>
        {categories.map(category => (
          <li key={category.category_id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;
