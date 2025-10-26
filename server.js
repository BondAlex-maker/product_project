// server.js
import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// Бэкенд (Sequelize модели/роуты)
import db from './app/models/index.js'
import productRoutes from './app/routes/product.routes.js'
import authRoutes from './app/routes/auth.routes.js'
import userRoutes from './app/routes/user.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = Number(process.env.PORT) || 5174

// --- Middlewares
// В DEV разрешаем фронту на 5173 ходить к API (в PROD same-origin — CORS не нужен)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
}
// Боди-парсеры
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- Статика (клиентский бандл Vite) и загруженные файлы
const clientDistDir = path.join(__dirname, 'frontend', 'dist')
const ssrBundlePath = path.join(__dirname, 'frontend', 'dist-ssr', 'entry-server.js')

app.use(express.static(clientDistDir)) // /assets/* и index.html
app.use('/uploads', express.static(path.join(process.cwd(), 'app', 'storage', 'uploads')))

// --- API (same-origin: фронт ходит на /api/*)
productRoutes(app)
authRoutes(app)
userRoutes(app)

// --- SSR handler: отдаём SSR для всех НЕ-API и НЕ-статических путей
// Исключаем: /api/*, /uploads/*, /assets/*, /favicon.ico (и подобное)
app.get(/^(?!\/api\/|\/uploads\/|\/assets\/|\/favicon\.ico|\/robots\.txt|\/manifest\.json).*/, async (req, res, next) => {
  try {
    // Импортируем SSR-рендерер и HTML-шаблон клиента
    const { render } = await import(ssrBundlePath)
    const fs = await import('fs/promises')
    const template = await fs.readFile(path.join(clientDistDir, 'index.html'), 'utf-8')

    // Рендерим строго по текущему URL
    const { html, head, status } = await render(req.originalUrl)

    // Вклеиваем head и html (зарезервированные плейсхолдеры в index.html)
    const doc = template
      .replace('<!--app-head-->', head || '')
      .replace('<!--app-html-->', html)

    res.status(status || 200).type('html').send(doc)
  } catch (err) {
    next(err)
  }
})

// --- (Необязательно) Проверка подключения к БД при старте
;(async () => {
  try {
    await db.sequelize.authenticate()
    console.log(`DB connected: ${db.sequelize.getDialect()} @ ${db.sequelize.config.host}:${db.sequelize.config.port}`)
    // при необходимости:
    // await db.sequelize.sync()
  } catch (e) {
    console.error('DB connection error:', e.message)
  }
})()

// --- Ошибки
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

// --- Старт
app.listen(port, () => {
  console.log(`SSR server listening at http://localhost:${port}`)
})
