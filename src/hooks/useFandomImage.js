import { GAMEDB_IMAGES, getEmojiForItem } from '../data/upgrades'

export function useFandomImage(itemName) {
  if (!itemName) return { src: '📦', isEmoji: true }

  const url = GAMEDB_IMAGES[itemName]
  if (url) return { src: url, isEmoji: false }

  return { src: getEmojiForItem(itemName), isEmoji: true }
}
