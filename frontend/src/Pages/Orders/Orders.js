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
        const response = await axios.get(`http://localhost:5000/orders/order-products/${user_id}`, {
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
    const ws = new WebSocket('ws://localhost:5000');

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
  }, [dispatch, user_id, token]);

  const ordersGroupedByOrderId = userOrders.reduce((acc, order) => {
    if (!acc[order.order_id]) {
      acc[order.order_id] = {
        order_id: order.order_id,
        status: order.status,
        paymentMethod: order.payment_method, // Assuming this field is included in the response
        products: []
      };
    }
    acc[order.order_id].products.push(order);
    return acc;
  }, {});

  const ordersArray = Object.values(ordersGroupedByOrderId);

  return (
    <div className='Orders'>
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
  );
};

export default Orders;
