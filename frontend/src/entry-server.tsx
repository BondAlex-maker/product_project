import { StaticRouter } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render(url: string) {
    const appHtml = renderToString(
        <Provider store={store}>
            <StaticRouter location={url}>
                <App />
            </StaticRouter>
        </Provider>
    );

    return `
    <!DOCTYPE html>
    <html>
      <head><title>SSR Render</title></head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  `;
}
