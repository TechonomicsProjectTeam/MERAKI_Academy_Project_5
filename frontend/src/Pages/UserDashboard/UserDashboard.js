import React from 'react';
import { useParams } from 'react-router-dom';
import Category from './Category/Category';
import Shops from './Shops/Shops';
import ProductsShops from './Products/ProductsShops';
import ReviewsComponent from './Reviews/Reviews';

const UserDashboard = () => {
  const { categoryName, shopName, productId } = useParams();

  return (
    <>
    <div className="dashboard">
      <header className="header">
        <div className="hero">
          <div className="hero-text">
            <h1>Enjoy quick delivery
              <br/> with  QuickServ ..
              <br/>
              All you have to do is
              <br/> fill the basket.</h1>
            {/* <p>
              It is a long established fact that a reader will be distracted by the
              readable content of a page when looking at its layout.
            </p> */}
          </div>
          <div className="hero-image">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKDgE91KdQnSJLwgbcixbOAvDByz5QwxKKE9IslDTa7csOu-71JDny7PJCJq5mGd9g-1o&usqp=CAU" alt="Delivery" />
          </div>
        </div>
      </header>
    </div>
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

      
      <footer className="footer">
        <div className="footer-content">
          <h3>FOLLOW ALONG</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
            <a href="#"><i className="fas fa-envelope"></i></a>
          </div>
          <div className="footer-info">
            <p>
              The Halia Restaurant © 2018. 1 Cluny Road, Ginger Garden, Singapore Botanic Gardens, Singapore 259569. Tel: (65) 8444 1148. All Rights Reserved.
            </p>
            <div className="footer-links">
              <a href="#">ARTICLES</a> | 
              <a href="#">COPYRIGHT POLICY</a> | 
              <a href="#">CAREERS</a>
            </div>
            <p>Designed & Developed by inPixelHaus</p>
          </div>
        </div>
      </footer> 
    
      </div>
    
    </>

      {!categoryName && <Category />}
      {categoryName && !shopName && <Shops />}
      {categoryName && shopName && <ProductsShops />}
    </div>

  );
};


export default UserDashboard;

