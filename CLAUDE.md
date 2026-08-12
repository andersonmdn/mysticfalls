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

**Layout:** sidebar (`app-sidebar`) + main content. The sidebar is collapsible on mobile via a hamburger toggle in the header. The sidebar overlay (`sidebar-overlay`) closes it on backdrop click.

**Data flow:**
1. `src/data/upgrades.js` — static source of truth. Exports `buildings`: an array of building objects, each with `id`, `name`, `icon`, `priority`, `maxLevel`, and a `levels` map (`{ [level]: [{name, qty, rarity}] }`) listing items required for each upgrade.
2. `src/App.jsx` — root state: `levels` (building id → current level), filter state (`activeBuildingIds`, `activeRarities`, `search`, `onlyNext`). Both are persisted to `localStorage`. Also owns the reset confirmation modal.
3. `src/components/CampOverview.jsx` — sidebar widget showing overall progress bar (maxed/total buildings) and the global reset button.
4. `src/components/BuildingLevelSelector.jsx` — renders a slider + tick marks per building so the user sets their current level. Calls `onChange(buildingId, level)` up to App.
5. `src/components/FilterBar.jsx` — three-row filter UI: text search, building pills, rarity pills. Receives all filter state and callbacks from App. The `onlyNext` toggle switches between aggregating only the immediately next upgrade level vs. all future levels.
6. `src/components/ItemsToKeep.jsx` — computes aggregate item quantities from `levels` + `upgrades.js`, applies all active filters, and renders the grid.
7. `src/components/ItemCard.jsx` — single item card; uses `useFandomImage` to fetch a wiki thumbnail.
8. `src/hooks/useFandomImage.js` — fetches item images from the Fandom Wiki API.

**Rarities:** `Common`, `Rare`, `Excellent`, `Epic`, `Legendary`, `Holy` — defined in both `App.jsx` (`ALL_RARITIES`) and `FilterBar.jsx`. Each item entry in `upgrades.js` can carry a `rarity` field used for filtering.

**Persistence:** three `localStorage` keys:
- `mysticfalls_levels` — `{[buildingId]: level}` map
- `mf_filters` — `{activeBuildingIds, activeRarities, search, onlyNext}` filter snapshot
- `mf_notice_dismissed` — one-time info banner dismissal flag

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

