import { useState } from 'react'
import { useFandomImage } from '../hooks/useFandomImage'
import { ITEM_RARITIES, getEmojiForItem } from '../data/upgrades'

export default function ItemCard({ name, qty, totalQty, sources, inventoryQty = 0, onInventoryChange }) {
  const { src, isEmoji } = useFandomImage(name)
  const [imgFailed, setImgFailed] = useState(false)
  const [open, setOpen] = useState(false)

  const showEmoji = isEmoji || imgFailed
  const emojiChar = isEmoji ? src : getEmojiForItem(name)
  const rarity = ITEM_RARITIES[name] ?? 'Common'
  const rarityClass = `rarity-${rarity.toLowerCase()}`

  const fillPct = Math.min((inventoryQty / qty) * 100, 100)
  const surplusQty = Math.max(0, inventoryQty - qty)
  const hasSufficient = inventoryQty >= qty

  return (
    <div className={`item-card ${rarityClass}`} onClick={() => setOpen(o => !o)}>
      <div className="item-image-wrap">
        {showEmoji ? (
          <span className="item-emoji" role="img" aria-label={name}>{emojiChar}</span>
        ) : (
          <img
            src={src}
            alt={name}
            className="item-image"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      <div className="item-info">
        <span className="rarity-badge">{rarity}</span>
        <div className="item-name">{name}</div>

        <div className="item-qty">
          <div className="inv-progress-wrap">
            <div className="inv-progress-track">
              <div
                className={`inv-progress-fill${hasSufficient ? ' fill-ok' : ''}`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
            <div className="inv-progress-meta">
              <span className={`inv-progress-count${hasSufficient && !surplusQty ? ' count-ok' : ''}`}>
                {Math.min(inventoryQty, qty)} / {qty}{hasSufficient && !surplusQty ? ' ✓' : ''}
              </span>
              {surplusQty > 0 && <span className="inv-progress-surplus">+{surplusQty}</span>}
            </div>
          </div>
        </div>

        {open && (
          <div className="inv-controls">
            <button
              className="inv-btn"
              aria-label="Diminuir quantidade"
              onClick={e => { e.stopPropagation(); onInventoryChange(name, inventoryQty - 1) }}
              disabled={inventoryQty <= 0}
            >−</button>
            <span className="inv-qty" aria-live="polite" aria-atomic="true">{inventoryQty}</span>
            <button
              className="inv-btn"
              aria-label="Aumentar quantidade"
              onClick={e => { e.stopPropagation(); onInventoryChange(name, inventoryQty + 1) }}
            >+</button>
          </div>
        )}
      </div>
    </div>
  )
}
