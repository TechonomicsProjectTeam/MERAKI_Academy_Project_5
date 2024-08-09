import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getOrderProductsByUserId, getOrders, setStatus, updateOrderStatus } from '../../redux/reducers/Orders/Orders';
import {jwtDecode} from 'jwt-decode'; 
import "../Orders/Style.css";

const Orders = () => {
  const dispatch = useDispatch();
  const userOrders = useSelector(state => state.orders.userOrders);
  const status = useSelector(state => state.orders.status);
  console.log(status);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.userId;
  console.log(userOrders);
  
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(`https://quickserv.onrender.com/orders/order-products/${user_id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          dispatch(getOrders(response.data.result));
          dispatch(getOrderProductsByUserId(response.data.result));
        }
      } catch (error) {
        console.log("Fetching error ", error);
      }
    };

    fetchUserOrders();

    // Set up WebSocket connection
    const ws = new WebSocket('ws://quickserv.onrender.com');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_STATUS_UPDATED') {
        const updatedOrder = data.payload;
        dispatch(updateOrderStatus({
          order_id: updatedOrder.order_id,
          status: updatedOrder.status,
          driver: updatedOrder.driver,
        }));
        dispatch(setStatus(updatedOrder.status));
      }
    };

    return () => {
      ws.close();
    };
  }, [dispatch, user_id, token , userOrders]);

  const ordersGroupedByOrderId = userOrders.reduce((acc, order) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = {
        order_id: order.order_id,
        status: order.status,
        paymentMethod: order.payment_method, 
        products: []
      };
    }
    acc[order.order_id].products.push(order);
    return acc;
  }, {});

  const ordersArray = Object.values(ordersGroupedByOrderId);

  return (
    <>
    <div className='Order'>
      <table className='Orders-table'>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {ordersArray.map((order) => (
            
            <tr key={order.order_id}>
              {console.log(order)}
              <td>{order.order_id}</td>
              <td>{order.status}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <ul>
                  {order.products.map(product => (
                    <li key={product.product_id}>
                      <div><strong>Name:</strong> {product.name}</div>
                      <div><strong>Quantity:</strong> {product.quantity}</div>
                      <div><strong>Description:</strong> {product.description}</div>
                      <div>
                        <img src={product.images} alt={product.name} style={{ width: '50px', height: '50px' }} />
                      </div>
                      <div><strong>Price:</strong> ${product.price}</div>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

export default Orders;
