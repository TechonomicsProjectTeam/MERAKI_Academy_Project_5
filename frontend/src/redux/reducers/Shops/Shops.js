import { createSlice } from "@reduxjs/toolkit";

export const shopsSlice = createSlice({
  name: "shops",
  initialState: {
    shops: [],
    images: null,
    name: null,
    bestRatedShops: [],
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
    banShopById: (state, action) => {
      state.shops = state.shops.map((shop) => 
        shop.shop_id === action.payload.shop_id ? { ...shop, isBanned: true } : shop
      );
    },
    unBanShopById: (state, action) => {
      state.shops = state.shops.map((shop) => 
        shop.shop_id === action.payload.shop_id ? { ...shop, isBanned: false } : shop
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
    setBestRatedShops: (state, action) => {
      state.bestRatedShops = action.payload;
    },
  }
});

export const { 
  getShops, 
  addShops, 
  deleteShopById, 
  updateShopById, 
  banShopById, 
  unBanShopById, 
  setShopInfo, 
  setShopsByCategory, 
  setBestRatedShops 
} = shopsSlice.actions;

export default shopsSlice.reducer;
