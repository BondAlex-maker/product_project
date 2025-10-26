import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const distDir = path.resolve(__dirname, '../frontend/dist')
const ssrEntry = path.resolve(__dirname, '../frontend/dist-ssr/entry-server.js')
const template = await readFile(path.join(distDir, 'index.html'), 'utf-8')
const { render } = await import(pathToFileURL(ssrEntry).href)

// Добавь сюда нужные статические маршруты:
const routes = ['/', '/home']

for (const url of routes) {
  const { html, head } = await render(url)
  const doc = template
    .replace('<!--app-head-->', head || '')
    .replace('<!--app-html-->', html)

  const filePath = path.join(distDir, url === '/' ? 'index.html' : `${url.replace(/\/$/, '')}.html`)
  const dir = path.dirname(filePath)
  await mkdir(dir, { recursive: true })
  await writeFile(filePath, doc, 'utf-8')
  console.log('SSG ->', filePath)
}
