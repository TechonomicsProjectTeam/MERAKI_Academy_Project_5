import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrderStatus, getOrders, setStatus } from "../../redux/reducers/Orders/Orders";
import axios from "axios";

const DriverDashboard = () => {
  const orders = useSelector((state) => state.orders.orders);
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
  }, [dispatch]);

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

  const changeOrderStatus = async (order_id, status, driver) => {
    try {
      const response = await axios.put(`http://localhost:5000/orders/${order_id}/status`, { status, driver });
      if (response.data.success) {
        dispatch(updateOrderStatus({ order_id, status, driver }));
        dispatch(setStatus(status));
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleAccept = (order_id) => {
    const driver = localStorage.getItem("username");
    changeOrderStatus(order_id, "ACCEPTED", driver);
  };

  const handleReject = (order_id) => {
    const driver = localStorage.getItem("username");
    changeOrderStatus(order_id, "REJECTED", driver);
  };
  useEffect(() => {
    console.log("Orders updated:", orders);
  }, [orders]);
  


  return (
    <div className="Orders">
      {orders.map((order) => (
        <div key={order.order_id}>
          <h3>Order {order.order_id}</h3>
          <p>Status: {order.status}</p>
          {order.status === "ACCEPTED" && order.driver ? (
            <p>Accepted by: {order.driver}</p>
          ) : order.status === "REJECTED" && order.driver ? (
            <p>Rejected by: {order.driver}</p>
          ) : (
            <>
              <button onClick={() => handleAccept(order.order_id)}>Accept</button>
              <button onClick={() => handleReject(order.order_id)}>Reject</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default DriverDashboard;
