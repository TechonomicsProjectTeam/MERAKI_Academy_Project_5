import { createSlice } from "@reduxjs/toolkit";

export const shopsSlice = createSlice({
    name: "shops",
    initialState: {
        shops: [],
        images: localStorage.getItem("ShopImage") || null,
        name: localStorage.getItem("name") || null,
    },
    reducers: {
        getShops: (state, action) => {
            state.shops = action.payload;
        },
        addShops: (state, action) => {
            state.shops.push(action.payload);
        },
        deleteShopById: (state, action) => {
            state.shops = state.shops.filter(shop => shop.shop_id !== action.payload.shop_id);
        },
        updateShopById: (state, action) => {
            state.shops = state.shops.map((shop) =>
                shop.shop_id === action.payload.shop_id ? action.payload : shop
            );
        },
        setShopInfo: (state, action) => {
            const { name, images } = action.payload;
            state.name = name;
            state.images = images;
            localStorage.setItem("ShopImage", images);
            localStorage.setItem("name", name);
        },
        setShopsByCategory: (state, action) => {
            state.shops = action.payload;
        },
    },
});

export const { getShops, updateShopById, addShops, deleteShopById, setShopInfo, setShopsByCategory } = shopsSlice.actions;

export default shopsSlice.reducer;
