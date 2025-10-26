import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

export function render(url: string) {
    return `
    <!DOCTYPE html>
    <html>
      <head><title>SSR Render</title></head>
      <body>
        <div id="root">${
        require("react-dom/server").renderToString(
            <Provider store={store}>
                <StaticRouter location={url}>
                    <App />
                </StaticRouter>
            </Provider>
        )
    }</div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  `;
}
