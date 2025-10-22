import express from 'express';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import db from './app/models/index.js';
import tutorialRoutes from './app/routes/product.routes.js';
import authRoutes from './app/routes/auth.routes.js';
import userRoutes from './app/routes/user.routes.js';

const app = express();
const Role = db.role;

// --- CORS ---
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API маршруты ---
tutorialRoutes(app);
authRoutes(app);
userRoutes(app);

// --- Синхронизация базы данных ---
db.sequelize.sync({ force: true }).then(() => {
    console.log('База данных синхронизирована.');
    initial();
});

// --- Список статических страниц (SSG) ---
const staticPages = ['/', '/about', '/contact'];

// --- Настройка SSR через Vite ---
async function setupSSR() {
    const vite = await createViteServer({
        root: path.resolve('./frontend'),
        server: { middlewareMode: 'ssr' },
        appType: 'custom',
    });

    // Dev middleware
    app.use(vite.middlewares);

    // --- Статические страницы (SSG) ---
    app.use(staticPages, (req, res) => {
        const filePath = path.join(
            __dirname,
            `frontend/dist/static${req.path === '/' ? '/index' : req.path}.html`
        );
        res.sendFile(filePath, (err) => {
            if (err) {
                res.status(404).send('Page not found');
            }
        });
    });

    // --- SSR для остальных страниц ---
    app.use(async (req, res) => {
        try {
            const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');
            const appHtml = await render(req.url);

            let template = `
        <!DOCTYPE html>
        <html lang="ru">
          <head>
            <meta charset="UTF-8" />
            <title>React SSR + SSG</title>
          </head>
          <body>
            <div id="app">${appHtml}</div>
            <script type="module" src="/src/entry-client.jsx"></script>
          </body>
        </html>
      `;

            template = await vite.transformIndexHtml(req.url, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        } catch (err) {
            vite.ssrFixStacktrace(err);
            console.error(err);
            res.status(500).send(err.stack);
        }
    });
}

setupSSR();

// --- Запуск сервера ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}.`);
});

// --- Инициализация ролей ---
function initial() {
    Role.create({ id: 1, name: 'user' });
    Role.create({ id: 2, name: 'moderator' });
    Role.create({ id: 3, name: 'admin' });
}
