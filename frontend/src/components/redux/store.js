import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth/Auth";
import shopsReducer from "./reducers/Shops/Shops";
import cartsReducer from "./reducers/Carts/Carts";

export default configureStore({
    reducer: {
        auth: authReducer,
        shops: shopsReducer,
        cart: cartsReducer,
    }
});
