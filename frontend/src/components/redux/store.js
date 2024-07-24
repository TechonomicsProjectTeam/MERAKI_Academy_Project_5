import { configureStore } from "@reduxjs/toolkit";
import shopsReducer from "./reducers/Shops/Shops";
export default configureStore({
    reducer: {
        shops:shopsReducer,
    }
})