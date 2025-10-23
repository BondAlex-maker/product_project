import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import productReducer from "./slices/productSlice.js";

const reducer = {
    auth: authReducer,
    message: messageReducer,
    products: productReducer
}

export const store = configureStore({
    reducer: reducer,
    devTools: true,
});