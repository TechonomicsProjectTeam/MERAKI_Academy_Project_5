import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
    name:"carts",
    initialState :{
       carts:[],//المنتجات الموجوده في ال cart
    },

    reducers :{
        setProductFromCart:(state , action)=>{
            state.carts = action.payload;
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