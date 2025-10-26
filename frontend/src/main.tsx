import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { store } from "./store.ts";
import { Provider } from "react-redux";

// ✅ Ленивый импорт interceptors, чтобы SSR не трогал TokenService
if (typeof window !== "undefined") {
    import("./services/setupInterceptors").then(({ default: setupInterceptors }) => {
        setupInterceptors(store);
    });
}

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

createRoot(container).render(
    <StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </StrictMode>
);
