import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addProductFromCart,
  decreaseProductQuantityById,
  deleteProductCartById,
  deleteAllProductFromCart,
  SetCartId,
  setProductFromCart,
} from "../../redux/reducers/Carts/Carts";
import { addOrders } from "../../redux/reducers/Orders/Orders";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalButton from "../PayPalButton/PayPalButton";
import { useNavigate } from "react-router-dom";
import "./Style.css";

const Carts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart.carts);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoggedIn = useSelector((state) => state.auth.token);
  const roleId = useSelector((state) => state.auth.roleId);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const paypalClientId = "Acx6jkPzP5soGbN5lxmevYjygrkc1N5im54PyeXwlZgB8uhRyrMG2fVx6EEAKyluRxCBGrEFX1U29nyC";

  const getCartIdByUserId = async () => {
    try {
      const result = await axios.get(`https://quickserv.onrender.com/carts/cart/userId`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(SetCartId({ cartId: result.data.cart[0].cart_id }));
    } catch (error) {
      console.error("Error fetching cart ID:", error);
    }
  };

  const getCartProductByCartId = async () => {
    try {
      const result = await axios.get(`https://quickserv.onrender.com/carts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setProductFromCart({ products: result.data.products }));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && parseInt(roleId) === 1) {
      getCartProductByCartId();
      getCartIdByUserId();
    }
  }, [isLoggedIn, roleId]);

  useEffect(() => {
    console.log('Cart updated:', cart);
  }, [cart]);

  const increaseProductQuantity = async (productId, quantity) => {
    try {
      await axios.post(
        `https://quickserv.onrender.com/carts/${productId}`,
        { cart_id: cartId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addProductFromCart({ product_id: productId, quantity }));
    } catch (error) {
      console.error("Error increasing product quantity:", error);
    }
  };

  const decreaseProductQuantity = async (productId) => {
    try {
      await axios.post(
        `https://quickserv.onrender.com/carts/decrease/${cartId}/products/${productId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(decreaseProductQuantityById({ product_id: productId }));
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
    }
  };

  const deleteProductFromCart = async (productId) => {
    try {
      await axios.delete(
        `https://quickserv.onrender.com/carts/cart/${cartId}/product/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(deleteProductCartById({ product_id: productId }));
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  const deleteAllProductsFromCart = async () => {
    try {
      await axios.delete(`https://quickserv.onrender.com/carts/${cartId}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(deleteAllProductFromCart());
    } catch (error) {
      console.error("Error deleting all products from cart:", error);
    }
  };

  const createOrder = async (paymentMethod) => {
    try {
      const result = await axios.post("https://quickserv.onrender.com/orders/", {
        cartId: cartId,
        paymentMethod: paymentMethod,
      },
        { headers: { Authorization: `Bearer ${token}` }, }
      )
      if (result.data.success) {
        console.log("Order result: ", result);
        dispatch(addOrders(result.data.order));
        dispatch(deleteAllProductFromCart());
        navigate("/orders");
      }
    } catch (error) {
      console.log("Error creating an order: ", error);
    }
  }

  const handlePaymentSuccess = (data) => {
    console.log('Payment successful:', data);
    createOrder("PayPal");
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };

  const handleTotalAmount = () => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return total.toFixed(2);
  };

  const handlePaymentCashSuccess = async (data) => {
    try {
      console.log('Payment cash successful:', data);
      createOrder("CashOnDelivery");
      navigate("/orders");
    } catch (error) {
      console.log("error handling payment cash success:", error);
    }
  };

  const calculateTotalPrice = (price, quantity) => {
    return (price * quantity).toFixed(2);
  }

  const totalItemPrices = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  // has to be fixed so when we update the some real data
  const calculateDeliveryFee = (totalItemPrices) => {
    if (totalItemPrices > 50) {
      return 2.00; 
    } else {
      return 5.00; 
    }
  };

  const deliveryFee = calculateDeliveryFee(totalItemPrices);
  const totalPriceIncludingDelivery = (parseFloat(totalItemPrices) + deliveryFee).toFixed(2);

  return (
    <>
    <div className="Cartss">
      <div className="Cart">
        <h2 className="h2">Shopping Cart</h2>
        {cart?.length > 0 ? (
          <ul>
            {cart.map((item) => (
              <li className="li" key={item.product_id}>
                <img src={item.images} alt={item.name} className="cart-item-image" />
                <p className="p">{item.name}
                  <br />
                  price: JD {calculateTotalPrice(item.price, item.quantity)}
                </p>
                <div className="icon-container">
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => increaseProductQuantity(item.product_id, 1)}
                    className="icon"
                  />
                  <FontAwesomeIcon
                    icon={faMinus}
                    onClick={() => decreaseProductQuantity(item.product_id)}
                    className="icon"
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => deleteProductFromCart(item.product_id)}
                    className="icon"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p">No items in cart</p>
        )}
        <div className="price-details-container">
        <h3>Total Price of Items: JD {totalItemPrices}</h3>
        <h3>Delivery Fee: JD {deliveryFee.toFixed(2)}</h3>
        <h3>Total Price (including delivery): JD {totalPriceIncludingDelivery}</h3>
        </div>
        <button className="clear-cart-button" onClick={deleteAllProductsFromCart}>
          Remove All Products
        </button>
        <div className="payment-buttons">
          <button onClick={() => handlePaymentCashSuccess()}>Pay on Delivery</button>
        </div>
        <div className="paypal-button-container">
          <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
            <PayPalButton
              amount={totalPriceIncludingDelivery}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
   
    <footer class="footer">
  <div class="footer-top">
    <div class="footer-column">
      <h3>Restaurants</h3>
      <ul>
        <li>Cozy Pizza</li>
        <li>Sizzle Grill</li>
        <li>MindHub</li>
        <li>WOK U LIKE</li>
        <li>McDonald's</li>
        <li>More Restaurants...</li>
      </ul>
    </div>
    {/* <div class="footer-column">
      <h3>Popular Cuisines</h3>
      <ul>
        <li>American</li>
        <li>Arabic</li>
        <li>Asian</li>
        <li>Beverages</li>
        <li>Breakfast</li>
        <li>More Cuisines...</li>
      </ul>
    </div> */}
    <div class="footer-column">
      <h3>Popular Areas</h3>
      <ul>
        <li>Al Mala'ab</li>
        <li>Al Huson</li>
        <li>Al Sareeh</li>
        <li>Al Mohammadiyeh Amman</li>
        <li>Bait Ras</li>
        <li>More Areas...</li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Cities</h3>
      <ul>
        <li>Ajloun</li>
        <li>Amman</li>
        <li>Aqaba</li>
        <li>Irbid</li>
        <li>Jerash</li>
        <li>More Cities...</li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Follow us on</h3>
      <ul class="social-media">
        <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
        <li><a href="#"><i class="fab fa-twitter"></i></a></li>
        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
        <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
        <li><a href="#"><i class="fab fa-youtube"></i></a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <ul>
      <li><a href="#">Careers</a></li>
      <li><a href="#">Terms and Conditions</a></li>
      <li><a href="#">FAQ</a></li>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Contact Us</a></li>
      <li><a href="#">Sitemap</a></li>
    </ul>
    <p>©2024 QuickServ.com</p>
    <p>For any support or help you can contact us via our Live Chat</p>
  </div>
</footer>
    </>
  );
};

export default Carts;