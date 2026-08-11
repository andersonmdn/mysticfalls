# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Vite, localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve the dist/ build locally
```

No lint, test runner, or TypeScript configured.

## Architecture

React 18 + Vite SPA. No router — single page. All styles in `src/index.css`.

**Data flow:**
1. `src/data/upgrades.js` — static source of truth. Exports `buildings`: an array of building objects, each with `id`, `name`, `icon`, `maxLevel`, and a `levels` map (`{ [level]: [{name, qty}] }`) listing items required for each upgrade.
2. `src/App.jsx` — root state: `levels` (building id → current level, persisted to `localStorage`), filter state (`activeBuildingIds`, `activeRarities`, `search`, `onlyNext`). Passes `levels` down to both panels.
3. `src/components/BuildingLevelSelector.jsx` — renders a slider + tick marks per building so the user sets their current level. Calls `onChange(buildingId, level)` up to App.
4. `src/components/ItemsToKeep.jsx` — computes aggregate item quantities from `levels` + `upgrades.js`, applies all active filters, and renders the grid.
5. `src/components/ItemCard.jsx` — single item card; uses `useFandomImage` to fetch a wiki thumbnail.
6. `src/hooks/useFandomImage.js` — fetches item images from the Fandom Wiki API.

**Persistence:** `localStorage` key `mysticfalls_levels` stores the `{[buildingId]: level}` map. Key `mf_notice_dismissed` stores the one-time info banner dismissal.

## Adding or Updating Upgrade Data

All game data lives in `src/data/upgrades.js`. Each building entry:
```js
{
  id: 'warehouse',       // unique, used as localStorage key segment and filter id
  name: 'Warehouse',
  icon: '🏪',
  priority: 1,           // display order
  maxLevel: 13,
  levels: {
    2: [{ name: 'Pearl Dust', qty: 1 }, ...],
    // key = the level being upgraded TO; level 1 has no cost
  }
}
```

`buildings_data.json` at the project root is a raw data reference file (not imported by the app).

## UI Language

The UI is in Brazilian Portuguese. Keep all user-facing strings in Portuguese.

## Active Work

`plans/todo.md` tracks a pending accessibility and UI improvement task (WCAG fixes, empty-state improvements, CSS minor fixes) generated from an Impeccable critique.
