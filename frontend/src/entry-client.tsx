import React, { useEffect } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { Provider, useStore } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { makeStore } from "./store";
import App from "./App";

import setupInterceptors from "./services/setupInterceptors";
import { hydrateAuthFromStorage } from "./slices/auth";

import "./index.css";

const store = makeStore();

function Bootstrap() {
  const s = useStore();
  useEffect(() => {
    setupInterceptors(s as any);
    (s as any).dispatch(hydrateAuthFromStorage());
  }, [s]);
  return null;
}

const app = (
  <Provider store={store}>
    <Bootstrap />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

const container = document.getElementById("root")!;
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
