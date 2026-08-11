import { useState } from 'react'
import { useFandomImage } from '../hooks/useFandomImage'
import { ITEM_RARITIES, getEmojiForItem } from '../data/upgrades'

export default function ItemCard({ name, qty, totalQty, sources }) {
  const { src, isEmoji } = useFandomImage(name)
  const [imgFailed, setImgFailed] = useState(false)

  const showEmoji = isEmoji || imgFailed
  const emojiChar = isEmoji ? src : getEmojiForItem(name)
  const rarity = ITEM_RARITIES[name] ?? 'Common'
  const rarityClass = `rarity-${rarity.toLowerCase()}`

  return (
    <div className={`item-card ${rarityClass}`}>
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
        </div>

        <div className="item-sources">
          {sources.map((s, i) => (
            <span
              key={i}
              className="source-badge"
              aria-label={`${s.buildingName} nível ${s.level}`}
            >
              {s.buildingIcon} L{s.level}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
