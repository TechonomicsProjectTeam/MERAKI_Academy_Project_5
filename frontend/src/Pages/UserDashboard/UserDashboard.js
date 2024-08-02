import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { getCategories } from "../../redux/reducers/Categories/Categories";
import { setShopsByCategory,setBestRatedShops,updateShopById } from "../../redux/reducers/Shops/Shops";
import { setProducts } from "../../redux/reducers/Products/Products";
import {
  setReviewsByProduct,
  addReview,
  updateReview,
  deleteReview,
} from "../../redux/reducers/Reviews/Reviews";
import "../UserDashboard/UserDashboard.css";
import { addProductFromCart } from "../../redux/reducers/Carts/Carts";
import { SetCartId } from "../../redux/reducers/Carts/Carts";
import LoginPrompt from "../LoginPrompt/LoginPrompt";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);
  const shops = useSelector((state) => state.shops.shops);
  const products = useSelector((state) => state.product.products);
  const reviews = useSelector((state) => state.reviews.reviews);
  const cartId = useSelector((state) => state.cart.cartId);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const [selectedShop, setSelectedShop] = useState(null);
  const [newRating, setNewRating] = useState(1); 
  const [showCategories, setShowCategories] = useState(true);
  const [showShops, setShowShops] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showSelectedShopProducts, setShowSelectedShopProducts] = useState(false);
  const [showBestRatedShops, setShowBestRatedShops] = useState(true);
  const bestRatedShops = useSelector((state) => state.shops.bestRatedShops);
  const fetchBestRatedShops = () => async (dispatch) => {
    try {
      const response = await axios.get("http://localhost:5000/shop/shops/best-rated");
      if (response.data.success) {
        dispatch(setBestRatedShops(response.data.shops));
      }
    } catch (error) {
      console.error("Error fetching best-rated shops:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchBestRatedShops());
  }, [dispatch]);
  useEffect(() => {
    if (!cartId && token) {
      const fetchCartId = async () => {
        try {
          const result = await axios.get(`http://localhost:5000/carts/cart/userId`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (result.data.cart.length > 0) {
            dispatch(SetCartId({ cartId: result.data.cart[0].cart_id }));
          }
        } catch (error) {
          console.error("Error fetching cart ID:", error);
        }
      };

      fetchCartId();
    }
  }, [cartId, token, dispatch]);

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
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
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
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
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
          setShowBestRatedShops(false); // Hide best-rated shops
        }
      })
      .catch((error) => {
        console.error("There was an error fetching the shops by category!", error);
      });
  };
  

  const handleShopClick = (shopId) => {
    setSelectedShop(shopId);
    setShowProducts(true);
    setShowCategories(false);
    setShowShops(false);
    setShowSelectedShopProducts(true);
    axios
      .get(`http://localhost:5000/product/${shopId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(setProducts(response.data.products));
          setShowShops(false);
          setShowProducts(true);
          setFrom(0);
          setTo(productsPerPage);
          setShowSelectedShopProducts(true);

          axios
            .get(`http://localhost:5000/shop/${shopId}`)
            .then((response) => {
              if (response.data.success) {
                setShowSelectedShopProducts(true);
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
    if (showProducts && selectedProduct) {
      setSelectedProduct(null);
    } else if (showProducts) {
      setShowSelectedShopProducts(false);
      setShowProducts(false);
      setShowShops(true);
    } else if (showShops) {
      setShowSelectedShopProducts(false);
      setShowShops(false);
      setShowCategories(true);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    fetchReviews(product.product_id);
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
  const handleUpdateShopRating = async (shopId, newRating) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/shop/shops/rating`,
        { shop_id: shopId, rating: newRating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        dispatch(updateShopById(response.data.shop));
      } else {
        console.error("Failed to update shop rating");
      }
    } catch (error) {
      console.error("Error updating shop rating:", error);
    }
  };
  const handleRatingSubmit = async () => {
    if (selectedShop) {
      try {
        const response = await axios.post(
          `http://localhost:5000/shop/shops/rating`,
          { shop_id: selectedShop, rating: newRating },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        if (response.data.success) {
          dispatch(updateShopById(response.data.shop));
          setMessage("Rating submitted successfully!");
        } else {
          setMessage("Failed to submit rating. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting rating:", error);
        setMessage("An unexpected error occurred. Please try again.");
      }
      setSelectedShop(null);
      setNewRating(1);
    }
  };
  
  
  
  return (
    <div className="UserDashboard">
      <h1>User Dashboard</h1>
      {message && <p>{message}</p>}
      {showCategories && !showSelectedShopProducts && (
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
      {showShops && !showSelectedShopProducts && (
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
      {bestRatedShops.length > 0 && showBestRatedShops && !showSelectedShopProducts && (
  <div>
    <h2>Best Rated Shops</h2>
    <ul className="best-rated-shop-list">
      {bestRatedShops.map((shop) => (
        <li
          key={shop.shop_id}
          onClick={() => handleShopClick(shop.shop_id)}
        >
          <h3>{shop.name}</h3>
          <p>Rating: {shop.rating}</p>
        </li>
      ))}
    </ul>
  </div>
)}

      {showProducts && !selectedProduct && (
        <div>
          <button className="back-button" onClick={handleBackClick}>
            Back to Shops
          </button>
          <h2>Products</h2>
          {shopDetails[products[0]?.shop_id] && (
            <div className="shop-description">
              <h3>Shop Description</h3>
              <p>{shopDetails[products[0].shop_id].description}</p>
            </div>
          )}
          {selectedShop && (
            <div>
              <h3>Rate this Shop</h3>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setNewRating(star)}
                    style={{
                      cursor: "pointer",
                      color: star <= newRating ? "#ffc107" : "#e4e5e9",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <button onClick={handleRatingSubmit}>Submit Rating</button>
            </div>
          )}
          <ul className="product-list">
            {displayedProducts.map((product) => (
              <li key={product.product_id} onClick={() => handleProductClick(product)}>
                <h3>{product.name}</h3>
                <h3>JD{product.price}</h3>
                <p>{product.description}</p>
                <img
                  src={product.images}
                  alt={product.name}
                  className="product-image"
                />
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
      {selectedProduct && (
        <div>
          <button className="back-button" onClick={handleBackClick}>
            Back to Products
          </button>
          <h2>{selectedProduct.name}</h2>
          <h3>JD{selectedProduct.price}</h3>
          <p>{selectedProduct.description}</p>
          <img
            src={selectedProduct.images}
            alt={selectedProduct.name}
            className="product-image"
          />
          <input
            type="number"
            value={quantities[selectedProduct.product_id] || 1}
            onChange={(e) =>
              handleQuantityChange(selectedProduct.product_id, e.target.value)
            }
            min="1"
          />
          <button onClick={() => addProductToCart(selectedProduct)}>
            Add to Cart
          </button>
          {showLoginPrompt && <LoginPrompt />}
          <div>
            <h4>Reviews</h4>
            {reviews[selectedProduct.product_id] &&
              reviews[selectedProduct.product_id].map((review) => (
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
                  <p>
                    {formatDistanceToNow(new Date(review.created_at))} ago
                  </p>
                  {review.user_id === userId ? (
                    editingReview === review.review_id ? (
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
                            handleEditReviewChange("review_text", e.target.value)
                          }
                        />
                        <button
                          onClick={() =>
                            handleUpdateReview(review.review_id, selectedProduct.product_id)
                          }
                        >
                          Submit Update
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button onClick={() => setEditingReview(review.review_id)}>
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.review_id, selectedProduct.product_id)}
                        >
                          Delete
                        </button>
                      </div>
                    )
                  ) : null}
                </div>
              ))}
            <div>
              <h4>Add a Review</h4>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(selectedProduct.product_id, star)}
                    style={{
                      cursor: "pointer",
                      color: star <= (newReviews[selectedProduct.product_id]?.rating || 0)
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
                value={newReviews[selectedProduct.product_id]?.review_text || ""}
                onChange={(e) =>
                  setNewReviews({
                    ...newReviews,
                    [selectedProduct.product_id]: {
                      ...newReviews[selectedProduct.product_id],
                      review_text: e.target.value,
                    },
                  })
                }
              />
              <button onClick={() => handleAddReview(selectedProduct.product_id)}>
                Submit Review
              </button>
              {showLoginPrompt && <LoginPrompt />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  
  
};

export default UserDashboard;
