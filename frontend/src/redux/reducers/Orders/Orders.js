import { createSlice } from "@reduxjs/toolkit";

export const ordersSlice= createSlice({
    name:"orders ",
    initialState:{
        orders:[]
    },
    reducers:{
        getOrders: (state,action) =>{
            state.orders = action.payload
        },
        addOrders: (state, action)=>{
            state.orders.push(action.payload);
        },
        deleteOrderByid: (state,action) =>{
            state.orders.splice(action.payload.order_id,1);
        },
        
    }
})