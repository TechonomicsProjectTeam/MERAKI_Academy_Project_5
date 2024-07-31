import { createSlice } from "@reduxjs/toolkit";

export const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    userOrders: [],
    status: null,
  },
  reducers: {
    getOrders: (state, action) => {
      state.orders = action.payload;
    },
    getOrderProductsByUserId: (state, action) => {
      state.userOrders = action.payload;
    },
    addOrders: (state, action) => {
      state.orders.push(action.payload);
    },
    deleteOrderById: (state, action) => {
      state.orders = state.orders.filter((order) => order.order_id !== action.payload.order_id);
    },
    updateOrderStatus: (state, action) => {
      const { order_id, status, driver } = action.payload;
      const order = state.orders.find((o) => o.order_id === order_id);
      if (order) {
        order.status = status;
        if (status === "ACCEPTED" || status === "REJECTED") {
          order.driver = driver;
        }
      }
      const userOrder = state.userOrders.find((o) => o.order_id === order_id);
      if (userOrder) {
        userOrder.status = status;
        if (status === "ACCEPTED" || status === "REJECTED") {
          userOrder.driver = driver;
        }
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { getOrders, addOrders, deleteOrderById, getOrderProductsByUserId, updateOrderStatus, setStatus } = ordersSlice.actions;

export default ordersSlice.reducer;
