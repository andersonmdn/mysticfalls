import { buildings } from '../data/upgrades'

export default function BuildingLevelSelector({ levels, onChange }) {
  return (
    <div className="building-selector">
      <div className="sidebar-section-label">Estruturas</div>

      {buildings.map(b => {
        const currentLevel = levels[b.id] ?? 1
        const isMaxed = currentLevel >= b.maxLevel
        const knownMaxLevel = Object.entries(b.levels).filter(([, v]) => v !== null).length > 0
          ? Math.max(...Object.entries(b.levels).filter(([, v]) => v !== null).map(([k]) => parseInt(k)))
          : 1
        const hasData = knownMaxLevel > 1
        const pct = Math.round((currentLevel / b.maxLevel) * 100)

        return (
          <div key={b.id} className={`building-row${isMaxed ? ' maxed' : ''}${!hasData ? ' no-data' : ''}`}>
            <div className="building-row-header">
              <span className="building-row-icon" aria-hidden="true">{b.icon}</span>
              <span className="building-row-name">{b.name}</span>
              {isMaxed
                ? <span className="building-row-badge badge-maxed">MAX</span>
                : !hasData
                ? <span className="building-row-badge badge-soon">Em Breve</span>
                : <span className="building-row-level">Lv <span>{currentLevel}</span>/{b.maxLevel}</span>
              }
            </div>

            <div className="building-row-progress" aria-hidden="true">
              <div className="building-row-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            {/* <input
              type="range"
              min={1}
              max={b.maxLevel}
              value={currentLevel}
              onChange={e => onChange(b.id, parseInt(e.target.value))}
              className="level-slider"
              disabled={!hasData}
              aria-label={`Nível de ${b.name}`}
              aria-valuetext={`Nível ${currentLevel} de ${b.maxLevel}`}
            /> */}

            <div className="level-ticks">
              {Array.from({ length: b.maxLevel }, (_, i) => i + 1).map(l => (
                <button
                  key={l}
                  type="button"
                  className={`tick${l <= currentLevel ? ' tick-filled' : ''}${l === currentLevel ? ' tick-current' : ''}`}
                  aria-label={`Nível ${l}`}
                  aria-pressed={l === currentLevel}
                  disabled={!hasData}
                  onClick={() => onChange(b.id, l)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
