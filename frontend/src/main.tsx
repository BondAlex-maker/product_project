import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store.ts";
import { Provider } from "react-redux";
import setupInterceptors from "./services/setupInterceptors";

// Настраиваем axios interceptors с типизированным store
setupInterceptors(store);

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

createRoot(container).render(
    <StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </StrictMode>
);
