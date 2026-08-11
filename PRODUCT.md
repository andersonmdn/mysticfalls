# MysticFalls — Camp Upgrade Tracker

## Product

A daily-use companion web app for players of *Mistfall Hunter* (mobile action RPG). Players open this tool to answer one question: **"What items do I need to keep farming?"**

## Mechanism

Users set their current level for each of 11 camp buildings. The app computes which upgrade materials are still required — either for all future levels or just the next one — and displays them sorted by quantity. A rarity system (Common → Legendary) helps players prioritize.

## Audience

Mobile-first Mistfall Hunter players. Opened daily, briefly, during or after play sessions. Primary device: phone. Secondary: laptop for planning sessions.

## Constraints

- Static data only (`src/data/upgrades.js`). No backend.
- Levels persisted in `localStorage`.
- Images from Fandom Wiki API with emoji fallback.
- Pure CSS, React 18, Vite.
- UI language: Brazilian Portuguese.

## What must not change

- All upgrade data and computation logic
- Rarity system and color coding
- localStorage persistence
- Filter behavior (building, rarity, search, próximo nível)
- Source attribution (Game Rant / Fandom Wiki)
