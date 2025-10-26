import React from "react";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { makeStore } from "./store";
import App from "./App";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// читаем manifest из клиентского билда
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../dist/.vite/manifest.json"), "utf-8")
);

const cssFile = manifest["index.html"]?.css?.[0] ?? "";

export async function render(url: string) {
  const store = makeStore();

  const app = (
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </Provider>
  );

  const html = renderToString(app);

  return {
    html,
    head: cssFile ? `<link rel="stylesheet" href="/${cssFile}">` : "",
    status: 200,
  };
}
