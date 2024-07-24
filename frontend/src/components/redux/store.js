import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/Auth/Auth";
export default configureStore({
    reducer: {
        ath: authReducer,
    }
})