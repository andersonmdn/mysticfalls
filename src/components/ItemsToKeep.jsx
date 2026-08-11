import { useMemo } from 'react'
import { buildings, ITEM_RARITIES } from '../data/upgrades'
import ItemCard from './ItemCard'

export default function ItemsToKeep({ levels, filters }) {
  const { activeBuildingIds, search, onlyNext, activeRarities } = filters

  const itemMap = useMemo(() => {
    const map = {}

    for (const building of buildings) {
      if (!activeBuildingIds.includes(building.id)) continue

      const currentLevel = levels[building.id] ?? 1
      const levelEntries = Object.entries(building.levels)
        .map(([k, v]) => [parseInt(k), v])
        .filter(([lvl, items]) => {
          if (!items) return false
          if (onlyNext) return lvl === currentLevel + 1
          return lvl > currentLevel
        })

      for (const [lvl, items] of levelEntries) {
        for (const item of items) {
          const key = item.name
          if (!map[key]) {
            map[key] = { name: item.name, totalQty: 0, nextQty: null, sources: [] }
          }
          map[key].totalQty += item.qty
          if (lvl === (levels[building.id] ?? 1) + 1) {
            map[key].nextQty = (map[key].nextQty ?? 0) + item.qty
          }
          map[key].sources.push({
            buildingId: building.id,
            buildingName: building.name,
            buildingIcon: building.icon,
            level: lvl,
          })
        }
      }
    }

    return map
  }, [levels, activeBuildingIds, onlyNext])

  const items = useMemo(() => {
    const filtered = Object.values(itemMap).filter(item => {
      if (!item.name.toLowerCase().includes(search.toLowerCase())) return false
      const rarity = ITEM_RARITIES[item.name] ?? 'Common'
      if (activeRarities && !activeRarities.includes(rarity)) return false
      return true
    })
    return filtered.sort((a, b) => b.totalQty - a.totalQty || a.name.localeCompare(b.name))
  }, [itemMap, search, activeRarities])

  if (items.length === 0) {
    return (
      <div className="empty-state">
        {Object.values(levels).every(v => v >= 7)
          ? <><div className="empty-icon">🏆</div><p>Todas as estruturas estão no nível máximo!</p></>
          : search
          ? <><div className="empty-icon">🔍</div><p>Nenhum item encontrado para "<strong>{search}</strong>"</p></>
          : <><div className="empty-icon">✅</div><p>Nenhum item para guardar com os filtros atuais.</p></>
        }
      </div>
    )
  }

  return (
    <div className="items-section">
      <div className="items-header">
        <h2 className="section-title">Itens a Guardar</h2>
        <span className="items-count">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
      </div>
      <p className="section-subtitle">
        {onlyNext
          ? 'Apenas os itens necessários para o próximo upgrade de cada estrutura.'
          : 'Todos os itens necessários para maxar as estruturas selecionadas.'}
      </p>
      <div className="items-grid">
        {items.map(item => (
          <ItemCard
            key={item.name}
            name={item.name}
            qty={item.nextQty ?? item.totalQty}
            totalQty={item.totalQty}
            sources={item.sources}
          />
        ))}
      </div>
    </div>
  )
}
