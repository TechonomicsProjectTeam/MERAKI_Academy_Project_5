import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth/Auth";
import cartsReducer from "./reducers/Carts/Carts";
import ProductsReducer from "./reducers/Products/Products";
export default configureStore({
    reducer: {
        ath: authReducer,
        cart: cartsReducer,
        product: ProductsReducer,
    }
})