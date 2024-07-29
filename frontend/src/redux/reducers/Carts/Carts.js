import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "carts",
  initialState: {
    carts: [],
    cartId: null,
  },
  reducers: {
    SetCartId : (state,action)=>{
      state.cartId = action.payload.cartId;
    },
    setProductFromCart: (state, action) => {
      state.carts = action.payload.products;
    },
    addProductFromCart: (state, action) => {
      const { product_id, name, images, price, quantity } = action.payload;
      const existingProduct = state.carts.find(
        (product) => product.product_id === product_id
      );
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        state.carts.push({ product_id, name, images, price, quantity });
      }
    },
    decreaseProductQuantityById: (state, action) => {
      const { product_id } = action.payload;
      const existingProduct = state.carts.find(
        (product) => product.product_id === product_id
      );
      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;
        } else {
          state.carts = state.carts.filter((product) => product.product_id !== product_id);
        }
      }
    },
    deleteProductCartById: (state, action) => {
      const { product_id } = action.payload;
      state.carts = state.carts.filter((product) => product.product_id !== product_id);
    },
    deleteAllProductFromCart: (state) => {
      state.carts = [];
    },
  },
});

export const {
  SetCartId,
  setProductFromCart,
  addProductFromCart,
  decreaseProductQuantityById,
  deleteAllProductFromCart,
  deleteProductCartById,
} = cartSlice.actions;
export default cartSlice.reducer;
