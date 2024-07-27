import { createSlice } from "@reduxjs/toolkit";

export const shopsSlice = createSlice({
    name:"shops",
    initialState:{
        shops:[],
        images: localStorage.getItem("ShopImage") || null,
        name: localStorage.getItem("name")|| null,
    },
    reducers:{
        getShops: (state,action) =>{
            state.shops = action.payload
        },
        addShops: (state, action)=>{
            state.shops.push(action.payload);
        },
        deleteShopById: (state,action) =>{
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
        },
        setShopInfo: (state,action)=>{
            const {name,images}=action.payload
            state.name = name;
            state.images = images;
            localStorage.setItem("ShopImage",images)
            localStorage.setItem("name",name)
        }
    }
})

export const {getShops,updateShopById,addShops,deleteShopById,setShopInfo} = shopsSlice.actions;

export default shopsSlice.reducer;