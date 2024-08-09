import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, getOrders, setStatus, setHiddenButtons } from "../../redux/reducers/Orders/Orders";
import axios from "axios";
import "../DriverDashboard/StyleOrder.css";

const DriverDashboard = () => {
  const orders = useSelector((state) => state.orders.orders);
  const hiddenButtons = useSelector((state) => state.orders.hiddenButtons);
  const dispatch = useDispatch();

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders");
      if (response.data.success) {
        dispatch(getOrders(response.data.result));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [orders]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "ORDER_STATUS_UPDATED") {
        const updatedOrder = message.payload;
        dispatch(
          updateOrderStatus({
            order_id: updatedOrder.order_id,
            status: updatedOrder.status,
            driver: updatedOrder.driver,
          })
        );
      }
    };

    return () => ws.close();
  }, [dispatch]);
  console.log(orders);
  const changeOrderStatus = async (order_id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/orders/${order_id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
        }
      );
      if (response.data.success) {
        console.log(response.data.result);
        dispatch(updateOrderStatus({ order_id, status, driver: response.data.result.driver }));
        dispatch(setStatus(status));
        dispatch(setHiddenButtons({ order_id, hidden: true }));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleAccept = (order_id) => {
    changeOrderStatus(order_id, "ACCEPTED");
  };

  const handleReject = (order_id) => {
    changeOrderStatus(order_id, "REJECTED");
  };

  return (
    <>
    <div className="Orderrs">
    {orders.map((order) => (
      <div key={order.order_id}>
        <p className="payment-method">
          <span className="label">Payment Method:</span> {order.payment_method}
        </p>
        <p className="from">
          <span className="label">From:</span> {order?.user?.username}
        </p>
        <p className="order-id">
          <span className="label">Order:</span> {order.order_id}
        </p>
        <p className="status">
          <span className="label">Status:</span> {order.status}
        </p>
        {order.products && order.products.length > 0 && (
          <div className="product">
            {/* <h4 >Products:</h4> */}
            <ul>
              {order.products.map((product) => (
                <li key={product.product_id}>
                   <h4 >Products:</h4>
                  <p className="product-info">
                    <span className="product-label">Name:</span> {product.name}
                  </p>
                  <p className="product-info">
                    <span className="product-label">Description:</span> {product.description}
                  </p>
                  <p className="product-info">
                    <span className="product-label">Price:</span> ${product.price}
                  </p>
                  <p className="product-info">
                    <span className="product-label">Quantity:</span> {product.quantity}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {order.status === "ACCEPTED" && order.driver && (
          <p>
            Accepted by: {order.driver.username}
          </p>
        )}
        {order.status === "REJECTED" && order.driver && (
          <p>
            Rejected by: {order.driver.username}
          </p>
        )}
        {!hiddenButtons[order.order_id] && (
          <>
            <button className="accept" onClick={() => handleAccept(order.order_id)}>Accept</button>
          </>
        )}
      </div>
    ))}
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

export default DriverDashboard;
