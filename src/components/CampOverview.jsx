import { useMemo } from 'react'
import { buildings } from '../data/upgrades'

export default function CampOverview({ levels, onReset }) {
  const stats = useMemo(() => {
    let maxed = 0
    let pending = 0
    for (const b of buildings) {
      const cur = levels[b.id] ?? 1
      if (cur >= b.maxLevel) {
        maxed++
      } else {
        pending += b.maxLevel - cur
      }
    }
    return { maxed, pending, total: buildings.length }
  }, [levels])

  const pct = Math.round((stats.maxed / stats.total) * 100)
  const allMaxed = stats.maxed === stats.total

  return (
    <div className="camp-overview">
      <div className="camp-overview-label">Acampamento</div>

      <div className="camp-progress-bar-wrap">
        <div className="camp-progress-bar" role="progressbar" aria-valuenow={stats.maxed} aria-valuemin={0} aria-valuemax={stats.total} aria-label="Progresso geral do acampamento">
          <div
            className={`camp-progress-fill${allMaxed ? ' all-maxed' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="camp-progress-label">{stats.maxed}/{stats.total}</span>
      </div>

      <div className="camp-stats-row">
        <span className="camp-stat-item">
          <strong>{stats.pending}</strong> upgrades pendentes
        </span>
        <button className="reset-btn" onClick={onReset} title="Reiniciar todos os níveis para 1">
          ↺ Reiniciar
        </button>
      </div>
    </div>
  )
}
