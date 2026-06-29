import data from './data.json'
import manifest from 'virtual:audio-manifest'
import './App.css'

function getAudios(path) {
  return manifest[path] ?? []
}

function AudioGrid({ path }) {
  const audios = getAudios(path)
  return (
    <div className="audio-grid">
      {audios.length === 0 ? (
        <p className="empty-notice">
          Nenhum áudio encontrado em <code>{path}</code>.
        </p>
      ) : (
        audios.map(audio => (
          <div key={audio.name} className="audio-card">
            <audio controls src={audio.url} preload="none" />
          </div>
        ))
      )}
    </div>
  )
}

function BaselineSection({ section }) {
  return (
    <section id={`section-${section.id}`} className="audio-section audio-section--baseline">
      <div className="section-header">
        <span className="section-badge">Referência</span>
        <h2 className="section-title">{section.titulo}</h2>
      </div>
      <p className="section-desc">{section.descrição}</p>
      <div className="baseline-grid">
        {section.models.map(model => (
          <div key={model.id} className="baseline-model">
            <h3 className="baseline-model-title">{model.titulo}</h3>
            <p className="section-desc">{model.descrição}</p>
            {model.referencia && (
              <p className="baseline-reference">
                <a href={model.referencia.url} target="_blank" rel="noopener noreferrer">
                  {model.referencia.texto}
                </a>
              </p>
            )}
            <AudioGrid path={model.path} />
          </div>
        ))}
      </div>
    </section>
  )
}

function StandardSection({ section }) {
  return (
    <section key={section.id} id={`section-${section.id}`} className="audio-section">
      <h2 className="section-title">{section.titulo}</h2>
      <p className="section-desc">{section.descrição}</p>
      <AudioGrid path={section.path} />
    </section>
  )
}

function FeaturedSection({ section }) {
  return (
    <section id={`section-${section.id}`} className="audio-section audio-section--featured">
      <div className="section-header">
        <span className="section-badge section-badge--main">Principal</span>
        <h2 className="section-title">{section.titulo}</h2>
        {section.subtitulo && (
          <span className="section-subtitle">{section.subtitulo}</span>
        )}
      </div>
      <p className="section-desc">{section.descrição}</p>
      <div className="featured-subsections">
        {section.subsections.map(sub => (
          <div key={sub.id} id={`section-${sub.id}`} className="subsection">
            <h3 className="subsection-title">{sub.titulo}</h3>
            <p className="section-desc">{sub.descrição}</p>
            <AudioGrid path={sub.path} />
          </div>
        ))}
      </div>
    </section>
  )
}

function renderSection(section) {
  if (section.type === 'baseline') return <BaselineSection key={section.id} section={section} />
  if (section.type === 'featured') return <FeaturedSection key={section.id} section={section} />
  return <StandardSection key={section.id} section={section} />
}

function tocEntries(data) {
  return data.flatMap(s => {
    if (s.type === 'featured') {
      return [
        { id: s.id, label: s.titulo, indent: false },
        ...s.subsections.map(sub => ({ id: sub.id, label: sub.titulo, indent: true })),
      ]
    }
    return [{ id: s.id, label: s.titulo, indent: false }]
  })
}

export default function App() {
  const entries = tocEntries(data)
  return (
    <div className="app">
      <header className="site-header">
        <h1>Arquiteturas Generativas para Músicas de Piano</h1>
        <p className="site-subtitle">
          Representações Latentes Discretas e Espectrogramas Mel — amostras de áudio
        </p>
      </header>

      <nav className="toc">
        <h2 className="toc-heading">Conteúdo</h2>
        <ul className="toc-list">
          {entries.map(e => (
            <li key={e.id} className={e.indent ? 'toc-indent' : ''}>
              <a href={`#section-${e.id}`}>{e.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {data.map(renderSection)}
      </main>
    </div>
  )
}
