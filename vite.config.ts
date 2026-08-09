import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'

const sitesWorker = () => ({
  name: 'sites-static-worker',
  buildStart() {
    rmSync('dist', { recursive: true, force: true })
  },
  closeBundle() {
    mkdirSync('dist/server', { recursive: true })
    mkdirSync('dist/.openai', { recursive: true })
    writeFileSync(
      'dist/server/index.js',
      "export default { async fetch(request, env) { return env.ASSETS.fetch(request) } }\n",
    )
    copyFileSync('.openai/hosting.json', 'dist/.openai/hosting.json')
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/peppermint-and-i/',
  plugins: [react(), sitesWorker()],
  build: {
    outDir: 'dist/client',
  },
})
