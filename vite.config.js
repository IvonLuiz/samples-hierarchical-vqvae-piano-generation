import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readdirSync, existsSync, watch } from 'fs'
import { join, extname } from 'path'

const AUDIO_EXTS = new Set(['.mp3', '.mpeg', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.weba', '.opus'])
const VIRTUAL_ID = 'virtual:audio-manifest'
const RESOLVED_ID = '\0virtual:audio-manifest'

function readManifest(baseDir) {
  const manifest = {}
  if (!existsSync(baseDir)) return manifest

  function walk(dir, rel) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      const relPath = rel ? `${rel}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        walk(fullPath, relPath)
      } else if (AUDIO_EXTS.has(extname(entry.name).toLowerCase())) {
        const folder = rel ?? ''
        if (!manifest[folder]) manifest[folder] = []
        manifest[folder].push({ name: entry.name, url: `/audios/${relPath}` })
      }
    }
  }

  walk(baseDir, '')
  return manifest
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'vite-plugin-audio-manifest',
      resolveId(id) {
        if (id === VIRTUAL_ID) return RESOLVED_ID
      },
      load(id) {
        if (id === RESOLVED_ID) {
          const manifest = readManifest(join(process.cwd(), 'public/audios'))
          return `export default ${JSON.stringify(manifest)}`
        }
      },
      configureServer(server) {
        const audiosDir = join(process.cwd(), 'public/audios')
        if (existsSync(audiosDir)) {
          watch(audiosDir, { recursive: true }, () => {
            const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
            if (mod) server.moduleGraph.invalidateModule(mod)
            server.ws.send({ type: 'full-reload' })
          })
        }
      },
    },
  ],
})
