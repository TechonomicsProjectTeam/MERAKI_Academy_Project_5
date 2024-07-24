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
        }
    }
})
export const {setProductFromCart , addProductFromCart} = cartSlice.actions;
export default cartSlice.reducer;