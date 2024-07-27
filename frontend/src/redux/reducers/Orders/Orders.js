import { createSlice } from "@reduxjs/toolkit";

export const ordersSlice= createSlice({
    name:"orders ",
    initialState:{
        orders:[],
        userOrders:[]
    },
    reducers:{
        getOrders: (state,action) =>{
            state.orders = action.payload
        },
        getOrderProductsByUserId: (state,action)=>{
            state.userOrders = action.payload
        }
        ,
        addOrders: (state, action)=>{
            state.orders.push(action.payload);
        },
        deleteOrderByid: (state,action) =>{
            state.orders.splice(action.payload.order_id,1);
        },
        
    }
})

export const {getOrders,addOrders,deleteOrderByid,getOrderProductsByUserId} = ordersSlice.actions;

export default ordersSlice.reducer;