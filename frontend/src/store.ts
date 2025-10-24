import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import productReducer from "./slices/productSlice";

const reducer = {
    auth: authReducer,
    message: messageReducer,
    products: productReducer
};

export const store = configureStore({
    reducer,
    devTools: true,
});

// ✅ Типы должны определяться ПОСЛЕ создания store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
