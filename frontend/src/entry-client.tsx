import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { AppRoutes } from "./routes";

const store = makeStore();

const app = (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

const container = document.getElementById("root")!;
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
