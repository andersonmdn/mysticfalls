import { useState, useCallback } from 'react'
import { buildings } from './data/upgrades'
import BuildingLevelSelector from './components/BuildingLevelSelector'
import ItemsToKeep from './components/ItemsToKeep'

const ALL_RARITIES = ['Common', 'Rare', 'Excellent', 'Epic', 'Holy', 'Legendary']
const RARITY_COLORS = {
  Common:    '#8a8a8a',
  Rare:      '#4c9bc9',
  Excellent: '#9b59b6',
  Epic:      '#e67e22',
  Holy:      '#f0d060',
  Legendary: '#c94c4c',
}

const STORAGE_KEY = 'mysticfalls_levels'
const NOTICE_KEY = 'mf_notice_dismissed'

function loadLevels() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { data: JSON.parse(stored), corrupt: false }
  } catch {}
  const data = Object.fromEntries(buildings.map(b => [b.id, 1]))
  return { data, corrupt: !!localStorage.getItem(STORAGE_KEY) }
}

function saveLevels(levels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(levels))
}

const _initial = loadLevels()

export default function App() {
  const [levels, setLevels] = useState(_initial.data)
  const [storageError, setStorageError] = useState(_initial.corrupt)
  const [noticeDismissed, setNoticeDismissed] = useState(
    () => localStorage.getItem(NOTICE_KEY) === '1'
  )
  const [search, setSearch] = useState('')
  const [onlyNext, setOnlyNext] = useState(false)
  const [activeBuildingIds, setActiveBuildingIds] = useState(buildings.map(b => b.id))
  const [activeRarities, setActiveRarities] = useState(ALL_RARITIES)

  const handleLevelChange = useCallback((buildingId, level) => {
    setLevels(prev => {
      const next = { ...prev, [buildingId]: level }
      saveLevels(next)
      return next
    })
  }, [])

  const toggleBuilding = useCallback((id) => {
    setActiveBuildingIds(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }, [])

  const toggleRarity = useCallback((r) => {
    setActiveRarities(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setActiveBuildingIds(buildings.map(b => b.id))
    setActiveRarities(ALL_RARITIES)
    setSearch('')
  }, [])

  const resetAll = () => {
    if (!window.confirm('Resetar todos os níveis para 1? Esta ação não pode ser desfeita.')) return
    const defaults = Object.fromEntries(buildings.map(b => [b.id, 1]))
    setLevels(defaults)
    saveLevels(defaults)
  }

  const dismissNotice = () => {
    localStorage.setItem(NOTICE_KEY, '1')
    setNoticeDismissed(true)
  }

  const allMaxed = buildings.every(b => (levels[b.id] ?? 1) >= b.maxLevel)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title-group">
            <h1 className="app-title">⚔️ MysticFalls</h1>
            <p className="app-subtitle">Mistfall Hunter — Camp Upgrade Tracker</p>
          </div>
          <a
            href="https://gamerant.com/mistfall-hunter-what-to-upgrade-first-camp-workstations/"
            target="_blank"
            rel="noopener noreferrer"
            className="source-link"
          >
            📖 Ver guia completo
          </a>
        </div>
        {storageError && (
          <div className="error-banner">
            ⚠️ Dados corrompidos no armazenamento local — os níveis foram reiniciados.
            <button className="notice-dismiss" onClick={() => setStorageError(false)} aria-label="Fechar">✕</button>
          </div>
        )}
        {!noticeDismissed && (
          <div className="notice-banner">
            ⚠️ Guia em progresso — alguns níveis ainda não foram publicados no site original e aparecem como <strong>Em Breve</strong>.
            <button className="notice-dismiss" onClick={dismissNotice} aria-label="Fechar aviso">✕</button>
          </div>
        )}
      </header>

      <main className="app-main">
        <BuildingLevelSelector levels={levels} onChange={handleLevelChange} />

        <div className="filters-bar">
          <div className="filters-left">
            <h3 className="filters-label">Filtrar por estrutura:</h3>
            <div className="building-filters">
              {buildings.map(b => (
                <button
                  key={b.id}
                  className={`filter-btn ${activeBuildingIds.includes(b.id) ? 'active' : ''}`}
                  onClick={() => toggleBuilding(b.id)}
                  title={b.name}
                >
                  {b.icon} {b.name}
                </button>
              ))}
            </div>
            <h3 className="filters-label">Filtrar por raridade:</h3>
            <div className="building-filters">
              {ALL_RARITIES.map(r => (
                <button
                  key={r}
                  className={`filter-btn rarity-filter-btn ${activeRarities.includes(r) ? 'active' : ''}`}
                  onClick={() => toggleRarity(r)}
                  aria-pressed={activeRarities.includes(r)}
                  style={activeRarities.includes(r) ? { borderColor: RARITY_COLORS[r], color: RARITY_COLORS[r] } : {}}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="filters-right">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar item..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>

            <label className="toggle-label">
              <input
                type="checkbox"
                checked={onlyNext}
                onChange={e => setOnlyNext(e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
              Só próximo nível
            </label>

            <button className="reset-btn" onClick={resetAll} title="Resetar todos os níveis para 1">
              ↺ Resetar
            </button>
          </div>
        </div>

        <ItemsToKeep
          levels={levels}
          filters={{ activeBuildingIds, search, onlyNext, activeRarities }}
          clearFilters={clearFilters}
          totalBuildings={buildings.length}
        />
      </main>

      <footer className="app-footer">
        <p>Dados extraídos de <a href="https://gamerant.com/mistfall-hunter-what-to-upgrade-first-camp-workstations/" target="_blank" rel="noopener noreferrer">Game Rant</a>. Imagens via Fandom Wiki quando disponíveis.</p>
      </footer>
    </div>
  )
}
