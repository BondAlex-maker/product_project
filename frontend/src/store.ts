import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import messageReducer from "./slices/message";
import productReducer from "./slices/productSlice";

const reducer = {
  auth: authReducer,
  message: messageReducer,
  products: productReducer,
};

export function makeStore(preloadedState?: any) {
  return configureStore({
    reducer,
    preloadedState,
    devTools: true,
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
