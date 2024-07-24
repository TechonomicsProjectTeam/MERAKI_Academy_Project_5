import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth/Auth";
import cartsReducer from "./reducers/Carts/Carts"
export default configureStore({
    reducer: {
        ath: authReducer,
        cart: cartsReducer,
    }
})