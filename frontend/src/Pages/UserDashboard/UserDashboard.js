import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { getCategories } from "../../redux/reducers/Categories/Categories";
import {
    setShopsByCategory,
    setBestRatedShops,
    updateShopById,
} from "../../redux/reducers/Shops/Shops";
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
    const [editReviewData, setEditReviewData] = useState({rating: 0,review_text: ""});
    const [to, setTo] = useState(5);
    const [from, setFrom] = useState(0);
    const productsPerPage = 5;
    // const [shopDetails, setShopDetails] = useState({});
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [showSelectedShopProducts, setShowSelectedShopProducts] =useState(false);
    const [filteredShops, setFilteredShops] = useState([]);
    const [city, setCity] = useState("");
    
    const [error, setError] = useState("");

    useEffect(() => {
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                console.log("Geolocation is not supported by this browser.");
                setError("Geolocation is not supported by this browser.");
            }
        };

        const success = async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = "AIzaSyBulbig3i8qybGh32tKMETGZxd9GZM7DhE";

            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
                );
                console.log("Geocoding API response:", response.data);
                if (response.data.status == "REQUEST_DENIED") {
                    console.error(
                        "Geocoding API request denied:",
                        response.data.error_message
                    );
                    setError(
                        "Geocoding API request denied: " + response.data.error_message
                    );
                    return;
                }
                const addressComponents = response.data.results[0]?.address_components;
                const cityComponent = addressComponents?.find((component) =>
                    component.types.includes("locality")
                );
                if (cityComponent) {
                    setCity(cityComponent.long_name);
                    filterShopsByCity(cityComponent.long_name);
                } else {
                    setError("City name not found in geocoding results.");
                }
            } catch (error) {
                console.error("Error fetching city name:", error);
                setError("Error fetching city name: " + error.message);
            }
        };

        const error = (err) => {
            console.log("Unable to retrieve your location:", err);
            setError("Unable to retrieve your location: " + err.message);
        };

        const filterShopsByCity = (city) => {
            const filtered = shops.filter((shop) => shop.city == city);
            setFilteredShops(filtered);
        };

        getLocation();
    }, [shops]);

    useEffect(() => {
        if (!cartId && token) {
            const fetchCartId = async () => {
                try {
                    const result = await axios.get(
                        `http://localhost:5000/carts/cart/userId`,
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
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

    const handleEditReview = (review) => {
        setEditingReview(review.review_id);
        setEditReviewData({ review_text: review.review_text, rating: review.rating });
    };
    const handleEditInputChange = (e) => {
        setEditReviewData({ ...editReviewData, review_text: e.target.value });
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
                    //   setShowBestRatedShops(false); // Hide best-rated shops
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
                                setFilteredShops((prevState) => ({
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
    if (selectedProduct) {
        setSelectedProduct(null);
    } else if (showProducts) {
        setShowProducts(false);
        setShowShops(true);
    } else if (showShops) {
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
    
    useEffect(() => {
        console.log("showShops:", showShops);
        console.log("filteredShops:", filteredShops);
    }, [showShops, filteredShops]);
    
    return (
        <div className="UserDashboard">
            {city && <p>You are in: {city}</p>}
            <h1>User Dashboard</h1>
            
            {showCategories && !showProducts && (
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
    
            {showShops && filteredShops.length > 0 ? (
                <div>
                    <button className="back-button" onClick={handleBackClick}>
                        Back to Categories
                    </button>
                    <h2>Shops in {city}:</h2>
                    <ul>
                        {filteredShops.map((shop) => (
                            <li key={shop.id} onClick={() => handleShopClick(shop.shop_id)}>
                                {shop.name}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : showShops && filteredShops.length === 0 ? (
                <div>
                    <button className="back-button" onClick={handleBackClick}>
                        Back to Categories
                    </button>
                    <p>No shops found in your city.</p>
                </div>
            ) : null}
    
            {showProducts && !selectedProduct && (
                <div>
                    <button className="back-button" onClick={handleBackClick}>
                        Back to Shops
                    </button>
                    <h2>Products</h2>
                    {filteredShops[selectedShop] && (
                        <div className="shop-description">
                            <h3>Shop Description</h3>
                            <p>{filteredShops[selectedShop].description}</p>
                        </div>
                    )}
                    <ul className="product-list">
                        {displayedProducts.map((product) => (
                            <li
                                key={product.product_id}
                                onClick={() => handleProductClick(product)}
                            >
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
                <>
                <div>
                 <button className="back-button" onClick={handleBackClick}>
                 Back to Products
             </button>
             </div>
               <div className="clearfix">
                  
                   
                    <div className="product_image">
                    <img
                        src={selectedProduct.images}
                        alt={selectedProduct.name}
                        className="product-image"
                    />
                   
                    <button onClick={() => addProductToCart(selectedProduct)}>
                        Add to Cart
                    </button>
                    </div>
                    <div className="product-info">
                    <h2>{selectedProduct.name}</h2>
                    <h3>JD{selectedProduct.price}</h3>
                    <p>{selectedProduct.description}</p>
                    <input
                        type="number"
                        value={quantities[selectedProduct.product_id] || 1}
                        onChange={(e) =>
                            handleQuantityChange(selectedProduct.product_id, e.target.value)
                        }
                        min="1"
                    />
                    </div>
                    {showLoginPrompt && <LoginPrompt />}
                    <div className="review-info">
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
                                    <p>{formatDistanceToNow(new Date(review.created_at))} ago</p>
                                    {review.user_id == userId && (
                                        <div>
                                            {editingReview == review.review_id ? (
                                                <div>
                                                    <div>
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <span
                                                                key={star}
                                                                onClick={() => handleEditStarClick(star)}
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: star <= editReviewData.rating ? "#ffc107" : "#e4e5e9",
                                                                }}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={editReviewData.review_text}
                                                        onChange={handleEditInputChange}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateReview(
                                                                review.review_id,
                                                                selectedProduct.product_id
                                                            )
                                                        }
                                                    >
                                                        Submit Update
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <button onClick={() => handleEditReview(review)}>Update</button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteReview(review.review_id, selectedProduct.product_id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
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
                                        onClick={() => handleStarClick(selectedProduct.product_id, star)}
                                        style={{
                                            cursor: "pointer",
                                            color: star <= (newReviews[selectedProduct.product_id]?.rating || 1) ? "#ffc107" : "#e4e5e9",
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
                        </div>
                    </div>
                </div>
                </>
            )}
            
        </div>
        
    );
    
    
    
    
};

export default UserDashboard;
