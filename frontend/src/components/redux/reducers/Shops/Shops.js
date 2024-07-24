import { createSlice } from "@reduxjs/toolkit";

export const shopsSlice = createSlice({
    name:"shops",
    initialState:{
        shops:[]
    },
    reducers:{
        getShops: (state,action) =>{
            state.shops = action.payload
        },
        addShops: (state, action)=>{
            state.shops.push(action.payload);
        },
        deleteShopByid: (state,action) =>{
            //the id is sent from the payload
            state.shops.splice(action.payload.shop_id,1);
        },
        updateShopById: (state,action)=>{
            state.shops= state.shops.map((shop,index)=>{
                if (shop.shop_id === action.payload.shop_id){
                    shop = action.payload
                }
                return shop
            })
        }
    }
})

export const {getShops,updateShopById,addShops,deleteShopByid} = shopsSlice.actions;

export default shopsSlice.reducer;