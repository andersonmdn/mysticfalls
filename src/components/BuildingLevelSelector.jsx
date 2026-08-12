import { buildings } from '../data/upgrades'

export default function BuildingLevelSelector({ levels, onChange, inventory = {}, onUpgrade }) {
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

        const nextLevel = currentLevel + 1
        const nextCost = b.levels[nextLevel]
        const canUpgrade = !isMaxed && hasData && nextCost &&
          nextCost.every(item => (inventory[item.name] ?? 0) >= item.qty)

        return (
          <div key={b.id} className={`building-row${isMaxed ? ' maxed' : ''}${!hasData ? ' no-data' : ''}`}>
            <div className="building-row-header">
              <span className="building-row-icon" aria-hidden="true">{b.icon}</span>
              <span className="building-row-name">{b.name}</span>
              {isMaxed
                ? <span className="building-row-badge badge-maxed">MAX</span>
                : !hasData
                ? <span className="building-row-badge badge-soon">Em Breve</span>
                : canUpgrade
                ? <span className="building-row-badge badge-ready">Pronto!</span>
                : <span className="building-row-level">Lv <span>{currentLevel}</span>/{b.maxLevel}</span>
              }
            </div>

            <div className="building-row-progress" aria-hidden="true">
              <div className="building-row-progress-fill" style={{ width: `${pct}%` }} />
            </div>

            <div className="level-ticks">
              {Array.from({ length: b.maxLevel }, (_, i) => i + 1).map(l => {
                const isNextUpgradeable = l === nextLevel && canUpgrade
                return (
                  <button
                    key={l}
                    type="button"
                    className={`tick${l <= currentLevel ? ' tick-filled' : ''}${l === currentLevel ? ' tick-current' : ''}${isNextUpgradeable ? ' tick-upgradeable' : ''}`}
                    aria-label={isNextUpgradeable ? `Upar para Nível ${l}` : `Nível ${l}`}
                    aria-pressed={l === currentLevel}
                    disabled={!hasData}
                    onClick={() => isNextUpgradeable ? onUpgrade(b.id) : onChange(b.id, l)}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
