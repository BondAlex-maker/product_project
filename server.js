import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'

// если у тебя есть существующие роуты:
import db from './app/models/index.js'
import productRoutes from './app/routes/product.routes.js'
import authRoutes from './app/routes/auth.routes.js'
import userRoutes from './app/routes/user.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT || 5174

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// статика (клиентский бандл)
app.use(express.static(path.join(__dirname, 'frontend', 'dist')))
// отдать загруженные файлы
app.use('/uploads', express.static(path.join(process.cwd(), 'app', 'storage', 'uploads')))

// твои API
productRoutes(app)
authRoutes(app)
userRoutes(app)

// SSR обработчик всех НЕ-API запросов
app.get(['/', '/about', '/products', '/products/*'], async (req, res, next) => {
  try {
    const { render } = await import(path.join(__dirname, 'frontend', 'dist-ssr', 'entry-server.js'))
    const fs = await import('fs/promises')
    const template = await fs.readFile(path.join(__dirname, 'frontend', 'dist', 'index.html'), 'utf-8')

    const { html, head, status } = await render(req.originalUrl)

    const doc = template
      .replace('<!--app-head-->', head || '')
      .replace('<!--app-html-->', html)

    res.status(status || 200).type('html').send(doc)
  } catch (e) {
    next(e)
  }
})

app.listen(port, () => {
  console.log(`SSR server listening at http://localhost:${port}`)
})
