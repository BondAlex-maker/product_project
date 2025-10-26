// server.js
import 'dotenv/config'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import fs from 'fs'

// Бэкенд
import db from './app/models/index.js'
import productRoutes from './app/routes/product.routes.js'
import authRoutes from './app/routes/auth.routes.js'
import userRoutes from './app/routes/user.routes.js'
import bcrypt from 'bcryptjs'

// ──────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = Number(process.env.PORT) || 5174

// В DEV разрешаем фронту на 5173 ходить к API (в PROD same-origin — CORS не нужен)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: 'http://localhost:5173, http://localhost:5174, http://localhost:5175', credentials: true }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Статика (клиентский бандл) и /uploads
const clientDistDir = path.join(__dirname, 'frontend', 'dist')
const ssrBundlePath = path.join(__dirname, 'frontend', 'dist-ssr', 'entry-server.js')

app.use(express.static(clientDistDir))
app.use('/uploads', express.static(path.join(process.cwd(), 'app', 'storage', 'uploads')))

// API
productRoutes(app)
authRoutes(app)
userRoutes(app)

// Swagger (опционально)
try {
  const openapiPath = path.join(process.cwd(), 'openapi.yaml')
  if (fs.existsSync(openapiPath)) {
    const swaggerUi = (await import('swagger-ui-express')).default
    const YAML = (await import('yamljs')).default ?? (await import('yamljs'))
    const swaggerDoc = YAML.load(openapiPath)
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    console.log('Swagger docs: /api/docs')
  } else {
    console.warn('Swagger disabled: openapi.yaml not found')
  }
} catch (e) {
  console.warn('Swagger not mounted:', e?.message)
}

// SSR: catch-all для НЕ /api, /uploads, /assets, /favicon.ico
app.get(/^(?!\/api\/|\/uploads\/|\/assets\/|\/favicon\.ico|\/robots\.txt|\/manifest\.json).*/, async (req, res, next) => {
  try {
    const { render } = await import(ssrBundlePath)
    const fsp = await import('fs/promises')
    const template = await fsp.readFile(path.join(clientDistDir, 'index.html'), 'utf-8')
    const { html, head, status } = await render(req.originalUrl)
    const doc = template.replace('<!--app-head-->', head || '').replace('<!--app-html-->', html)
    res.status(status || 200).type('html').send(doc)
  } catch (err) {
    next(err)
  }
})

// ──────────────────────────────────────────────────────────
// ИНИЦИАЛИЗАЦИЯ БД: sync → сиды ролей с фиксированными id → админ
async function seedRolesWithFixedIds() {
  // ожидаемая матрица: id 1=user, 2=moderator, 3=admin
  const roles = [
    { id: 1, name: 'user' },
    { id: 2, name: 'moderator' },
    { id: 3, name: 'admin' },
  ]

  for (const r of roles) {
    const existing = await db.role.findByPk(r.id)
    if (!existing) {
      // если модели у роли autoIncrement id — это всё равно ок в Postgres, можно задавать вручную
      await db.role.create({ id: r.id, name: r.name })
    } else if (existing.name !== r.name) {
      // на всякий случай выровняем name по id
      await existing.update({ name: r.name })
    }
  }

  // Выровнять sequence, чтобы новые insert не конфликтовали с ручными id
  if (db.sequelize.getDialect() === 'postgres') {
    await db.sequelize.query(
      `SELECT setval(pg_get_serial_sequence('roles','id'), (SELECT MAX(id) FROM roles));`
    )
  }
}

async function seedAdminUser() {
  // Создаём админа, если нет
  const username = process.env.ADMIN_USERNAME || 'admin'
  const email = process.env.ADMIN_EMAIL || 'admin@example.com'
  const passwordPlain = process.env.ADMIN_PASSWORD || 'admin123'

  const [admin] = await db.user.findOrCreate({
    where: { username },
    defaults: {
      username,
      email,
      password: bcrypt.hashSync(passwordPlain, 8),
    },
  })

  // Привязать роль admin (id 3)
  const adminRole = await db.role.findByPk(3)
  if (adminRole) {
    // belongsToMany → addRole доступен
    const rolesOfAdmin = await admin.getRoles?.()
    const hasAdmin = Array.isArray(rolesOfAdmin) && rolesOfAdmin.some(r => r.id === 3)
    if (!hasAdmin) await admin.addRole(adminRole)
  }
}

async function init() {
  try {
    await db.sequelize.authenticate()
    console.log(`DB connected: ${db.sequelize.getDialect()} @ ${db.sequelize.config.host}:${db.sequelize.config.port}`)

    // По умолчанию — мягкая миграция, чтобы создать недостающие таблицы/колонки
    // Экспортируй SYNC_FORCE=true в env, если хочешь "чисто с нуля" (Только на локали!)
    if (process.env.SYNC_FORCE === 'true') {
      await db.sequelize.sync({ force: true })
      console.log('sequelize.sync({ force: true }) done')
    } else {
      await db.sequelize.sync({ alter: true })
      console.log('sequelize.sync({ alter: true }) done')
    }

    // Сиды ролей строго с фиксированными id (1,2,3)
    await seedRolesWithFixedIds()
    // Админ с ролью admin (id 3)
    await seedAdminUser()

    app.listen(port, () => {
      console.log(`SSR server listening at http://localhost:${port}`)
    })
  } catch (e) {
    console.error('DB init error:', e)
    process.exit(1)
  }
}

init()

// Глобальный обработчик ошибок Express (чтобы SSR-ошибки не падали пустым экраном)
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).send('Internal Server Error')
})
