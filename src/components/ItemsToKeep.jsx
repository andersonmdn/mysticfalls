import { useMemo } from 'react'
import { buildings, ITEM_RARITIES } from '../data/upgrades'
import ItemCard from './ItemCard'

const RARITY_ORDER = ['Holy', 'Legendary', 'Epic', 'Excellent', 'Rare', 'Common']

export default function ItemsToKeep({ levels, filters, clearFilters, totalBuildings, inventory = {}, onInventoryChange }) {
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

  const groupedItems = useMemo(() => {
    const byRarity = {}
    for (const item of items) {
      const rarity = ITEM_RARITIES[item.name] ?? 'Common'
      if (!byRarity[rarity]) byRarity[rarity] = []
      byRarity[rarity].push(item)
    }
    return RARITY_ORDER
      .filter(r => byRarity[r]?.length > 0)
      .map(r => ({ rarity: r, items: byRarity[r] }))
  }, [items])

  const hasActiveFilter = activeBuildingIds.length < totalBuildings || activeRarities.length < 6

  if (items.length === 0) {
    return (
      <div className="items-section">
        <div className="empty-state">
          {Object.values(levels).every(v => v >= 7)
            ? <><div className="empty-icon">🏆</div><p>Todas as estruturas estão no nível máximo!</p></>
            : search
            ? <><div className="empty-icon">🔍</div><p>Nenhum item encontrado para "<strong>{search}</strong>"</p></>
            : <><div className="empty-icon">🔧</div><p>Todos os itens estão ocultos pelos filtros ativos.</p><button className="empty-clear-btn" onClick={clearFilters}>Limpar todos os filtros</button></>
          }
        </div>
      </div>
    )
  }

  return (
    <div className="items-section">
      <div className="items-header">
        <h2 className="section-title">Itens a Guardar</h2>
        <span className="items-count" aria-live="polite">{items.length} {items.length === 1 ? 'item' : 'itens'}</span>
      </div>

      {hasActiveFilter && (
        <div className="filter-summary">
          {activeBuildingIds.length < totalBuildings && <span>{activeBuildingIds.length} de {totalBuildings} estruturas</span>}
          {activeRarities.length < 6 && <span>{activeRarities.length} raridades</span>}
          <button className="filter-summary-clear" onClick={clearFilters}>Limpar filtros</button>
        </div>
      )}

      {groupedItems.map(({ rarity, items: groupItems }) => (
        <div key={rarity} className="rarity-group">
          <h3 className={`rarity-group-header rarity-${rarity.toLowerCase()}`}>
            {rarity} <span className="rarity-group-count">({groupItems.length})</span>
          </h3>
          <div className="items-grid">
            {groupItems.map(item => (
              <ItemCard
                key={item.name}
                name={item.name}
                qty={item.nextQty ?? item.totalQty}
                totalQty={item.totalQty}
                sources={item.sources}
                inventoryQty={inventory[item.name] ?? 0}
                onInventoryChange={onInventoryChange}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
