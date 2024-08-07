import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews, deleteReview } from '../../../redux/reducers/Reviews/Reviews';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './ReviewsAdmin.css';
const ReviewsAdmin = () => {
  const dispatch = useDispatch();
  const reviewsFromStore = useSelector((state) => state.reviews.allReviews);
  const [reviews, setLocalReviews] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/review')
      .then((response) => {
        dispatch(setReviews(response.data.reviews));
        setLocalReviews(response.data.reviews); 
      })
      .catch((error) => {
        console.error("There was an error fetching the reviews!", error);
      });
  }, [dispatch]);

  useEffect(() => {
    setLocalReviews(reviewsFromStore);
  }, [reviewsFromStore]);

  const handleDelete = (product_id, review_id) => {
    axios.delete(`http://localhost:5000/review/${review_id}`)
      .then(() => {
        setLocalReviews(reviews.filter(review => review.review_id !== review_id)); 
        dispatch(deleteReview({ product_id, review_id }));
      })
      .catch((error) => {
        console.error("There was an error deleting the review!", error);
      });
  };

  return (
    <div className='ReviewsAdmin'>
      <h1>All Reviews</h1>
      <table>
        <thead>
          <tr>
            <th>Review ID</th>
            <th>Product ID</th>
            <th>User</th>
            <th>Rating</th>
            <th>Review Text</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.review_id}>
              <td>{review.review_id}</td>
              <td>{review.product_id}</td>
              <td>{review.username}</td>
              <td>{review.rating}</td>
              <td>{review.review_text}</td>
              <td>
                <FontAwesomeIcon 
                  icon={faTrash} 
                  onClick={() => handleDelete(review.product_id, review.review_id)} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewsAdmin;
