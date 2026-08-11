import { useState, useCallback, useEffect, useRef } from 'react'
import { buildings } from './data/upgrades'
import BuildingLevelSelector from './components/BuildingLevelSelector'
import ItemsToKeep from './components/ItemsToKeep'
import CampOverview from './components/CampOverview'
import FilterBar from './components/FilterBar'

const ALL_RARITIES = ['Common', 'Rare', 'Excellent', 'Epic', 'Legendary', 'Holy']

const STORAGE_KEY = 'mysticfalls_levels'
const NOTICE_KEY = 'mf_notice_dismissed'
const FILTERS_KEY = 'mf_filters'

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

function loadFilters() {
  try {
    const stored = localStorage.getItem(FILTERS_KEY)
    if (stored) {
      const f = JSON.parse(stored)
      return {
        activeBuildingIds: f.activeBuildingIds ?? buildings.map(b => b.id),
        activeRarities: f.activeRarities ?? ALL_RARITIES,
        search: f.search ?? '',
        onlyNext: f.onlyNext ?? false,
      }
    }
  } catch {}
  return {
    activeBuildingIds: buildings.map(b => b.id),
    activeRarities: ALL_RARITIES,
    search: '',
    onlyNext: false,
  }
}

const _initial = loadLevels()
const _initialFilters = loadFilters()

function ConfirmModal({ onConfirm, onCancel }) {
  const cancelRef = useRef(null)
  useEffect(() => {
    cancelRef.current?.focus()
    const onKey = e => { if (e.key === 'Escape') onCancel() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onCancel])
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <h3 className="modal-title" id="modal-title">Reiniciar todos os níveis?</h3>
        <p className="modal-body">Os níveis de todas as estruturas voltarão para 1. Esta ação não pode ser desfeita.</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" ref={cancelRef} onClick={onCancel}>Cancelar</button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>Reiniciar</button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [levels, setLevels] = useState(_initial.data)
  const [storageError, setStorageError] = useState(_initial.corrupt)
  const [noticeDismissed, setNoticeDismissed] = useState(
    () => localStorage.getItem(NOTICE_KEY) === '1'
  )
  const [search, setSearch] = useState(_initialFilters.search)
  const [onlyNext, setOnlyNext] = useState(_initialFilters.onlyNext)
  const [activeBuildingIds, setActiveBuildingIds] = useState(_initialFilters.activeBuildingIds)
  const [activeRarities, setActiveRarities] = useState(_initialFilters.activeRarities)
  const [showResetModal, setShowResetModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const resetAll = () => setShowResetModal(true)

  const confirmReset = () => {
    const defaults = Object.fromEntries(buildings.map(b => [b.id, 1]))
    setLevels(defaults)
    saveLevels(defaults)
    setShowResetModal(false)
  }

  const dismissNotice = () => {
    localStorage.setItem(NOTICE_KEY, '1')
    setNoticeDismissed(true)
  }

  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify({ activeBuildingIds, activeRarities, search, onlyNext }))
  }, [activeBuildingIds, activeRarities, search, onlyNext])

  // Header progress stats
  const maxedCount = buildings.filter(b => (levels[b.id] ?? 1) >= b.maxLevel).length
  const pendingCount = buildings.reduce((acc, b) => {
    const cur = levels[b.id] ?? 1
    return acc + Math.max(0, b.maxLevel - cur)
  }, 0)

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-bar">
          <button
            className="header-sidebar-toggle"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? 'Fechar estruturas' : 'Ver estruturas'}
            aria-expanded={sidebarOpen}
          >
            ☰
          </button>

          <div className="header-brand">
            <span className="header-logo">⚔ MysticFalls</span>
            <span className="header-divider" aria-hidden="true">·</span>
            <span className="header-subtitle">Camp Upgrade Tracker</span>
          </div>

          <div className="header-stats" aria-label="Progresso do acampamento">
            <span className="header-stat header-stat-maxed">{maxedCount}/{buildings.length} no máx.</span>
            <span className="header-stat header-stat-pending">{pendingCount} níveis pendentes</span>
          </div>
        </div>

        {storageError && (
          <div className="error-banner">
            ⚠️ Dados corrompidos no armazenamento local — os níveis foram reiniciados.
            <button className="notice-dismiss" onClick={() => setStorageError(false)} aria-label="Fechar">✕</button>
          </div>
        )}
        {!noticeDismissed && (
          <div className="notice-banner">
            ⚠️ Guia em progresso — alguns níveis ainda não foram publicados e aparecem como <strong>Em Breve</strong>.
            <button className="notice-dismiss" onClick={dismissNotice} aria-label="Fechar aviso">✕</button>
          </div>
        )}
      </header>

      <aside className={`app-sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Estruturas do acampamento">
        <CampOverview levels={levels} onReset={resetAll} />
        <BuildingLevelSelector levels={levels} onChange={handleLevelChange} />
      </aside>

      {sidebarOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="app-main">
        <FilterBar
          activeBuildingIds={activeBuildingIds}
          toggleBuilding={toggleBuilding}
          activeRarities={activeRarities}
          toggleRarity={toggleRarity}
          search={search}
          setSearch={setSearch}
          onlyNext={onlyNext}
          setOnlyNext={setOnlyNext}
          clearFilters={clearFilters}
        />

        <ItemsToKeep
          levels={levels}
          filters={{ activeBuildingIds, search, onlyNext, activeRarities }}
          clearFilters={clearFilters}
          totalBuildings={buildings.length}
        />

        <footer className="app-footer">
          <p>Imagens via Fandom Wiki.</p>
        </footer>
      </main>

      {showResetModal && (
        <ConfirmModal onConfirm={confirmReset} onCancel={() => setShowResetModal(false)} />
      )}
    </div>
  )
}
