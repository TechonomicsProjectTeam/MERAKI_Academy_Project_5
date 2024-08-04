// ReviewsComponent.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setReviewsByProduct,
  addReview,
  updateReview,
  deleteReview,
} from "../../../redux/reducers/Reviews/Reviews";
import { formatDistanceToNow } from "date-fns";

const ReviewsComponent = ({ productId }) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const [newReviews, setNewReviews] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 0,
    review_text: "",
  });

  useEffect(() => {
    if (productId) {
      axios
        .get(`http://localhost:5000/review/${productId}`)
        .then((response) => {
          if (response.data.success) {
            dispatch(
              setReviewsByProduct({
                product_id: productId,
                reviews: response.data.reviews,
              })
            );
          }
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
        });
    }
  }, [productId, dispatch]);

  const handleAddReview = async () => {
    if (!token) return;
    const newReview = newReviews[productId];
    if (!newReview) return;

    try {
      const result = await axios.post(
        `http://localhost:5000/review/${productId}`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.success) {
        dispatch(
          addReview({
            product_id: productId,
            review: result.data.result,
          })
        );
        setNewReviews({
          ...newReviews,
          [productId]: { rating: 0, review_text: "" },
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review.review_id);
    setEditReviewData({
      review_text: review.review_text,
      rating: review.rating,
    });
  };

  const handleUpdateReview = async (review_id) => {
    try {
      const result = await axios.put(
        `http://localhost:5000/review/${review_id}`,
        editReviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.success) {
        dispatch(
          updateReview({
            review_id,
            product_id: productId,
            ...editReviewData,
          })
        );
        setEditingReview(null);
        setEditReviewData({ rating: 0, review_text: "" });
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (review_id) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/review/${review_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.success) {
        dispatch(
          deleteReview({
            review_id,
            product_id: productId,
          })
        );
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleStarClick = (rating) => {
    setNewReviews({
      ...newReviews,
      [productId]: { ...newReviews[productId], rating },
    });
  };
  const handleEditStarClick = (rating) => {
    setEditReviewData({
      ...editReviewData,
      rating,
    });
  };

  return (
    <div className="review-info">
      <h4>Reviews</h4>
      {reviews[productId] &&
        reviews[productId].map((review) => (
          <div key={review.review_id} className="review-container">
            <div className="reviewer-info">
              <img
                src={review.images}
                alt={`${review.username}'s avatar`}
                className="reviewer-image"
              />
              <p className="reviewer-name">{review.user_name}</p>
            </div>
            <p>
              {review.review_text} - {review.rating} stars
            </p>
            <p>{formatDistanceToNow(new Date(review.created_at))} ago</p>
            {review.user_id === userId && (
              <div>
                {editingReview === review.review_id ? (
                  <div>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => handleEditStarClick(star)}
                          style={{
                            cursor: "pointer",
                            color:
                              star <= editReviewData.rating
                                ? "#ffc107"
                                : "#e4e5e9",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={editReviewData.review_text}
                      onChange={(e) =>
                        setEditReviewData({
                          ...editReviewData,
                          review_text: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handleUpdateReview(review.review_id)}
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEditReview(review)}>Edit</button>
                )}
                <button onClick={() => handleDeleteReview(review.review_id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      {token && (
        <div>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                style={{
                  cursor: "pointer",
                  color:
                    star <= (newReviews[productId]?.rating || 0)
                      ? "#ffc107"
                      : "#e4e5e9",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={newReviews[productId]?.review_text || ""}
            onChange={(e) =>
              setNewReviews({
                ...newReviews,
                [productId]: {
                  ...newReviews[productId],
                  review_text: e.target.value,
                },
              })
            }
          />
          <button onClick={handleAddReview}>Add Review</button>
        </div>
      )}
    </div>
  );
};

export default ReviewsComponent;
