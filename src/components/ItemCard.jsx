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

  const hasSufficient = inventoryQty >= qty
  const lacking = qty - inventoryQty

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
          <div className="qty-row">
            <span className="qty-label">Total</span>
            <span className="qty-total">{totalQty}×</span>
          </div>
          {totalQty > qty && (
            <div className="qty-row">
              <span className="qty-label">Próximo</span>
              <span className="qty-next">{qty}×</span>
            </div>
          )}
          <div className="qty-row">
            <span className="qty-label">Em Posse</span>
            <span className={`qty-owned ${hasSufficient ? 'owned-ok' : 'owned-low'}`}>
              {inventoryQty}× {hasSufficient ? '✓' : '✕'}
            </span>
          </div>
          {!hasSufficient && (
            <div className="qty-row">
              <span className="qty-label">Faltam</span>
              <span className="qty-lack">{lacking}×</span>
            </div>
          )}
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
