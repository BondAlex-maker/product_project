import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import { AppRoutes } from "./routes";

export async function render(url: string) {
  const store = makeStore(); // новый store на каждый SSR-запрос

  const app = (
    <Provider store={store}>
      <AppRoutes isServer url={url} />
    </Provider>
  );

  const html = renderToString(app);
  const head = "";
  const status = 200;
  return { html, head, status };
}
