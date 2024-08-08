import { createSlice } from "@reduxjs/toolkit";

export const shopsSlice = createSlice({
  name: "shops",
  initialState: {
    shops: [],
    images: null,
    name: null,
    bestRatedShops: [],
    selectedShopId: null, 
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
      const shopIndex = state.shops.findIndex(shop => shop.shop_id === action.payload.shop_id);
      if (shopIndex !== -1) {
        state.shops[shopIndex].is_deleted = true;
      }
    },
    unBanShopById: (state, action) => {
      const shopIndex = state.shops.findIndex(shop => shop.shop_id === action.payload.shop_id);
      if (shopIndex !== -1) {
        state.shops[shopIndex].is_deleted = false;
      }
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
    setSelectedShopId: (state, action) => { 
      state.selectedShopId = action.payload;
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
  setBestRatedShops, 
  setSelectedShopId 
} = shopsSlice.actions;



export default shopsSlice.reducer;
