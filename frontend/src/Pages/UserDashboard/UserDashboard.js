import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCategories } from "../../redux/reducers/Categories/Categories";
import { setShopsByCategory } from "../../redux/reducers/Shops/Shops";
import { setProducts } from "../../redux/reducers/Products/Products";
import {
  setReviewsByProduct,
  addReview,
  updateReview,
  deleteReview,
} from "../../redux/reducers/Reviews/Reviews";
import "../UserDashboard/UserDashboard.css";
import { addProductFromCart } from "../../redux/reducers/Carts/Carts";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const shops = useSelector((state) => state.shops.shops);
  const products = useSelector((state) => state.product.products);
  const reviews = useSelector((state) => state.reviews.reviews);
  const cartId = useSelector((state) => state.cart.cartId);
  const token = useSelector((state) => state.auth.token);

  const [showCategories, setShowCategories] = useState(true);
  const [showShops, setShowShops] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [message, setMessage] = useState("");
  const [quantities, setQuantities] = useState({});
  const [newReviews, setNewReviews] = useState({});
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 0,
    review_text: "",
  });
  const [to, setTo] = useState(5);
  const [from, setFrom] = useState(0);
  const productsPerPage = 5;
  const [shopDetails, setShopDetails] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories/")
      .then((response) => {
        if (response.data.success) {
          dispatch(getCategories(response.data.category));
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, [dispatch]);

  const addProductToCart = async (product) => {
    const quantity = quantities[product.product_id] || 1;
    try {
      const result = await axios.post(
        `http://localhost:5000/carts/${product.product_id}`,
        {
          cart_id: cartId,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.data.success) {
        dispatch(
          addProductFromCart({
            product_id: product.product_id,
            name: product.name,
            images: product.images,
            price: product.price,
            quantity,
          })
        );
        setMessage(result.data.message);
      } else {
        setMessage("Failed to add product to cart. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      console.error("Error adding product to cart:", error);
    }
  };

  const fetchReviews = async (product_id) => {
    try {
      const result = await axios.get(
        `http://localhost:5000/review/${product_id}`
      );
      if (result.data.success) {
        dispatch(
          setReviewsByProduct({
            product_id,
            reviews: result.data.reviews,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddReview = async (product_id) => {
    const newReview = newReviews[product_id];
    if (!newReview) return;

    try {
      const result = await axios.post(
        `http://localhost:5000/review/${product_id}`,
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
            product_id,
            review: result.data.result,
          })
        );
        setNewReviews({
          ...newReviews,
          [product_id]: { rating: 0, review_text: "" },
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleUpdateReview = async (review_id, product_id) => {
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
            product_id,
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

  const handleDeleteReview = async (review_id, product_id) => {
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
            product_id,
          })
        );
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    axios
      .get(`http://localhost:5000/shop/category/${categoryId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(setShopsByCategory(response.data.shops));
          setShowCategories(false);
          setShowShops(true);
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the shops by category!",
          error
        );
      });
  };

  const handleShopClick = (shopId) => {
    axios
      .get(`http://localhost:5000/product/${shopId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(setProducts(response.data.products));
          setShowShops(false);
          setShowProducts(true);
          setFrom(0);
          setTo(productsPerPage);

          axios
            .get(`http://localhost:5000/shop/${shopId}`)
            .then((response) => {
              if (response.data.success) {
                console.log(response.data.shops[0]);
                setShopDetails((prevState) => ({
                  ...prevState,
                  [shopId]: response.data.shops[0],
                }));
              }
            })
            .catch((error) => {
              console.error(
                "There was an error fetching the shop details!",
                error
              );
            });
        }
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the products by shop!",
          error
        );
      });
  };

  const handleBackClick = () => {
    if (showProducts) {
      setShowProducts(false);
      setShowShops(true);
    } else if (showShops) {
      setShowShops(false);
      setShowCategories(true);
    }
  };

  const handleShowMoreProducts = () => {
    setTo(to + productsPerPage);
  };

  const handleQuantityChange = (product_id, value) => {
    setQuantities({
      ...quantities,
      [product_id]: parseInt(value, 10),
    });
  };

  const handleEditReviewChange = (field, value) => {
    setEditReviewData({
      ...editReviewData,
      [field]: value,
    });
  };

  const handleStarClick = (product_id, rating) => {
    setNewReviews({
      ...newReviews,
      [product_id]: { ...newReviews[product_id], rating },
    });
  };

  const handleEditStarClick = (rating) => {
    setEditReviewData({
      ...editReviewData,
      rating,
    });
  };

  const displayedProducts = products.slice(from, to);

  return (
    <div className="UserDashboard">
      <h1>User Dashboard</h1>
      {message && <p>{message}</p>}
      {showCategories && (
        <div>
          <h2>Categories</h2>
          <ul className="category-list">
            {categories.map((category) => (
              <li
                key={category.category_id}
                onClick={() => handleCategoryClick(category.category_id)}
              >
                {category.name}
                <img
                  src={category.images}
                  alt={category.name}
                  className="category-image"
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {showShops && (
        <div>
          <button className="back-button" onClick={handleBackClick}>
            Back to Categories
          </button>
          <h2>Shops</h2>
          <ul className="shop-list">
            {shops.map((shop) => (
              <li
                key={shop.shop_id}
                onClick={() => handleShopClick(shop.shop_id)}
              >
                {shop.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showProducts && (
        <div>
          <button className="back-button" onClick={handleBackClick}>
            Back to Shops
          </button>
          <h2>Products</h2>
          {console.log(shopDetails)}
          {shopDetails[products[0]?.shop_id] && (
            <div className="shop-description">
              <h3>Shop Description</h3>

              <p>{shopDetails[products[0].shop_id].description}</p>
            </div>
          )}
          <ul className="product-list">
            {displayedProducts.map((product) => (
              <li key={product.product_id}>
                <h3>{product.name}</h3>
                <h3>JD{product.price}</h3>
                <p>{product.description}</p>
                <img
                  src={product.images}
                  alt={product.name}
                  className="product-image"
                />
                <input
                  type="number"
                  value={quantities[product.product_id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(product.product_id, e.target.value)
                  }
                  min="1"
                />
                <button onClick={() => addProductToCart(product)}>
                  Add to Cart
                </button>
                <button onClick={() => fetchReviews(product.product_id)}>
                  Show Reviews
                </button>
                <div>
                  {reviews[product.product_id] &&
                    reviews[product.product_id].map((review) => (
                      <div key={review.review_id}>
                        <p>
                          {review.review_text} - {review.rating} stars
                        </p>
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
                                handleEditReviewChange(
                                  "review_text",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              onClick={() =>
                                handleUpdateReview(
                                  review.review_id,
                                  product.product_id
                                )
                              }
                            >
                              Submit Update
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() => setEditingReview(review.review_id)}
                            >
                              Update
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteReview(
                                  review.review_id,
                                  product.product_id
                                )
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  <div>
                    <h4>Add a Review</h4>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() =>
                            handleStarClick(product.product_id, star)
                          }
                          style={{
                            cursor: "pointer",
                            color:
                              star <=
                              (newReviews[product.product_id]?.rating || 0)
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
                      value={newReviews[product.product_id]?.review_text || ""}
                      onChange={(e) =>
                        setNewReviews({
                          ...newReviews,
                          [product.product_id]: {
                            ...newReviews[product.product_id],
                            review_text: e.target.value,
                          },
                        })
                      }
                    />
                    <button onClick={() => handleAddReview(product.product_id)}>
                      Submit Review
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {to < products.length && (
            <button
              className="show-more-button"
              onClick={handleShowMoreProducts}
            >
              Show More Products
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
