import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./slices/auth.ts";
import messageReducer from "./slices/message.ts";
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