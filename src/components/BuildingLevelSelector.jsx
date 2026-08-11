import { buildings } from '../data/upgrades'

const PRIORITY_LABEL = ['', '⭐ Prioridade 1', '⭐ Prioridade 2', '⭐ Prioridade 3', 'Prioridade 4', 'Prioridade 5', 'Prioridade 6']

export default function BuildingLevelSelector({ levels, onChange }) {
  return (
    <div className="building-selector">
      <h2 className="section-title">Nível Atual das Estruturas</h2>
      <p className="section-subtitle">Defina o nível atual de cada estrutura para ver quais itens você ainda precisa guardar.</p>
      <div className="building-grid">
        {buildings.map(b => {
          const currentLevel = levels[b.id] ?? 1
          const isMaxed = currentLevel >= b.maxLevel
          const knownMaxLevel = Object.entries(b.levels).filter(([, v]) => v !== null).length > 0
            ? Math.max(...Object.entries(b.levels).filter(([, v]) => v !== null).map(([k]) => parseInt(k)))
            : 1
          const hasData = knownMaxLevel > 1

          return (
            <div key={b.id} className={`building-card ${isMaxed ? 'maxed' : ''} ${!hasData ? 'no-data' : ''}`}>
              <div className="building-header">
                <span className="building-icon">{b.icon}</span>
                <div>
                  <div className="building-name">{b.name}</div>
                  <div className="building-priority">{PRIORITY_LABEL[b.priority]}</div>
                </div>
                {isMaxed && <span className="badge badge-maxed">MAX</span>}
                {!hasData && <span className="badge badge-soon">Em Breve</span>}
              </div>
              <p className="building-desc">{b.description}</p>
              <div className="level-control">
                <label className="level-label">
                  Nível atual: <strong>{currentLevel}</strong>
                  {currentLevel < b.maxLevel && (
                    <span className="next-hint"> → próximo: {currentLevel + 1}</span>
                  )}
                </label>
                <input
                  type="range"
                  min={1}
                  max={b.maxLevel}
                  value={currentLevel}
                  onChange={e => onChange(b.id, parseInt(e.target.value))}
                  className="level-slider"
                  disabled={!hasData}
                  aria-label={`Nível de ${b.name}`}
                  aria-valuetext={`Nível ${currentLevel} de ${b.maxLevel}`}
                />
                <div className="level-ticks">
                  {Array.from({ length: b.maxLevel }, (_, i) => i + 1).map(l => (
                    <button
                      key={l}
                      type="button"
                      className={`tick ${l <= currentLevel ? 'tick-filled' : ''} ${l === currentLevel ? 'tick-current' : ''}`}
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
