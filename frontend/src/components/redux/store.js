import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth/Auth";
import shopsReducer from "./reducers/Shops/Shops";
import usersReducer from "./reducers/Users/Users";
import cartsReducer from "./reducers/Carts/Carts";
import ProductsReducer from "./reducers/Products/Products";
export default configureStore({
    reducer: {
        auth: authReducer,
        shops: shopsReducer,
        user: usersReducer,
        cart: cartsReducer,
        product: ProductsReducer,
    }
});
