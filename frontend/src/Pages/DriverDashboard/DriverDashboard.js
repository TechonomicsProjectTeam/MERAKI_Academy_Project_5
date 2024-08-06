import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, getOrders, setStatus, setHiddenButtons } from "../../redux/reducers/Orders/Orders";
import axios from "axios";
import "../DriverDashboard/Style.css";

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
    <div className="Orders">
    {orders.map((order) => (
      <div key={order.order_id}>
        <p className="payment-method">
          <span className="label">Payment Method:</span> {order.payment_method}
        </p>
        <p className="from">
          <span className="label">From:</span> {order.user.username}
        </p>
        <p className="order-id">
          <span className="label">Order:</span> {order.order_id}
        </p>
        <p className="status">
          <span className="label">Status:</span> {order.status}
        </p>
        {order.products && order.products.length > 0 && (
          <div className="products">
            <h4>Products:</h4>
            <ul>
              {order.products.map((product) => (
                <li key={product.product_id}>
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
            <button onClick={() => handleAccept(order.order_id)}>Accept</button>
          </>
        )}
      </div>
    ))}
  </div>
  );
};

export default DriverDashboard;
