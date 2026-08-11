import { buildings } from '../data/upgrades'

const ALL_RARITIES = ['Common', 'Rare', 'Excellent', 'Epic', 'Legendary', 'Holy']
const RARITY_COLORS = {
  Common:    '#8a8a8a',
  Rare:      '#65cb70',
  Excellent: '#4c9bc9',
  Epic:      '#9b59b6',
  Holy:      '#c94c4c',
  Legendary: '#f0d060',
}

export default function FilterBar({
  activeBuildingIds,
  toggleBuilding,
  activeRarities,
  toggleRarity,
  search,
  setSearch,
  onlyNext,
  setOnlyNext,
  clearFilters,
}) {
  const hasActiveFilter =
    activeBuildingIds.length < buildings.length ||
    activeRarities.length < ALL_RARITIES.length ||
    search.length > 0

  return (
    <div className="filter-bar">
      {/* Row 1: search + toggle */}
      <div className="filter-bar-row">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="Buscar item..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
            aria-label="Buscar item por nome"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')} aria-label="Limpar busca">✕</button>
          )}
        </div>

        <label className="toggle-label">
          <input
            type="checkbox"
            checked={onlyNext}
            onChange={e => setOnlyNext(e.target.checked)}
            className="toggle-input"
          />
          <span className="toggle-track" aria-hidden="true">
            <span className="toggle-thumb" />
          </span>
          <span>Só próximo nível</span>
        </label>

        {hasActiveFilter && (
          <button className="filter-clear-link" onClick={clearFilters}>
            Limpar filtros
          </button>
        )}
      </div>

      {/* Row 2: building filter */}
      <div className="filter-bar-row">
        <span className="filter-bar-label">Estrutura:</span>
        <div className="filter-pills-scroll" role="group" aria-label="Filtrar por estrutura">
          {buildings.map(b => (
            <button
              key={b.id}
              className={`filter-pill${activeBuildingIds.includes(b.id) ? ' active' : ''}`}
              onClick={() => toggleBuilding(b.id)}
              aria-pressed={activeBuildingIds.includes(b.id)}
            >
              {b.icon} {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Row 3: rarity filter */}
      <div className="filter-bar-row">
        <span className="filter-bar-label">Raridade:</span>
        <div className="filter-pills-scroll" role="group" aria-label="Filtrar por raridade">
          {ALL_RARITIES.map(r => {
            const active = activeRarities.includes(r)
            return (
              <button
                key={r}
                className={`filter-pill rarity-pill${active ? ' active' : ''}`}
                onClick={() => toggleRarity(r)}
                aria-pressed={active}
                style={active ? { borderColor: RARITY_COLORS[r], color: RARITY_COLORS[r] } : {}}
              >
                {r}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
