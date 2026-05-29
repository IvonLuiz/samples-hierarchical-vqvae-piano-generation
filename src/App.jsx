import data from './data.json'
import manifest from 'virtual:audio-manifest'
import './App.css'

function getAudios(path) {
  return manifest[path] ?? []
}

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <h1>Áudios — Amostras</h1>
      </header>

      <nav className="toc">
        <h2 className="toc-heading">Conteúdo</h2>
        <ul className="toc-list">
          {data.map(s => (
            <li key={s.id}>
              <a href={`#section-${s.id}`}>{s.titulo}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {data.map(s => {
          const audios = getAudios(s.path)
          return (
            <section key={s.id} id={`section-${s.id}`} className="audio-section">
              <h2 className="section-title">{s.titulo}</h2>
              <p className="section-desc">{s.descrição}</p>
              <div className="audio-grid">
                {audios.length === 0 ? (
                  <p className="empty-notice">
                    Nenhum áudio encontrado em <code>{s.path}</code>.
                  </p>
                ) : (
                  audios.map(audio => (
                    <div key={audio.name} className="audio-card">
                      <audio controls src={audio.url} preload="none" />
                    </div>
                  ))
                )}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
