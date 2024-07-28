import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name: "carts",
    initialState: {
      carts: [],
      cartId: null,
    },
    reducers: {
      setProductFromCart: (state, action) => {
        state.carts = action.payload.products;
        state.cartId = action.payload.cartId;
      },
        addProductFromCart:(state , action)=>{
            state.carts.push(action.payload);
        },
        deleteProductCartById:(state , action)=>{
            const {product_id}= action.payload;
            state.carts = state.carts.filter((product)=>{
               return product.product_id !== product_id
            })
        },
        deleteAllProductFromCart:(state , action)=>{
            state.carts = [];
        },
    }
})
export const {setProductFromCart , addProductFromCart,deleteAllProductFromCart,deleteProductCartById} = cartSlice.actions;
export default cartSlice.reducer;