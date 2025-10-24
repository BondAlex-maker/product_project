import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth.js";
import messageReducer from "./slices/message.js";
import productReducer from "./slices/productSlice.ts";

const reducer = {
    auth: authReducer,
    message: messageReducer,
    products: productReducer
}

export const store = configureStore({
    reducer: reducer,
    devTools: true,
});