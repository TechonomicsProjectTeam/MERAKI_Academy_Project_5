import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getOrders } from '../../../redux/reducers/Orders/Orders';
import "./OrdersAdmin.css"
const OrdersAdmin = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
 
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/orders"); 
        console.log(response.data);
        
        dispatch(getOrders(response.data.result));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div className='Orders'>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Driver</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{`${order.user.username}`}</td>
              <td>{order.status}</td>
              <td>{order.driver ? `${order.driver.username}` : 'Not Accepted'}</td>
              <td>
                {order.products.map((product) => (
                  <div key={product.product_id}>
                    {product.name} - {product.quantity}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAdmin;
