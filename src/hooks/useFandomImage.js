import { GAMEDB_IMAGES, getEmojiForItem } from '../data/upgrades'

export function useFandomImage(itemName) {
  if (!itemName) return { src: '📦', isEmoji: true }

  const url = GAMEDB_IMAGES[itemName]
  if (url) return { src: import.meta.env.BASE_URL + url.slice(1), isEmoji: false }

  return { src: getEmojiForItem(itemName), isEmoji: true }
}
