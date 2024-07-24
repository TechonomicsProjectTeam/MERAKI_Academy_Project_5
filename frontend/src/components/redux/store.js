import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth/Auth";
import cartsReducer from "./reducers/Carts/Carts";
import ProductsReducer from "./reducers/Products/Products";
import usersReducer from "./reducers/Users/Users";
export default configureStore({
    reducer: {
        ath: authReducer,
        cart: cartsReducer,
        product: ProductsReducer,
        user: usersReducer,
    }
})