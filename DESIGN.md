# MysticFalls — Design System

## Direction

Garrison logistics board. Sidebar handles configuration; main stage answers "what do I farm today?" Two-panel layout puts items above the fold on desktop. Refuses the scroll-past-buildings pattern.

## Color

| Token | Value | Role |
|---|---|---|
| `--bg-page` | `#12141c` | Page / outermost background |
| `--bg-sidebar` | `#161928` | Sidebar background |
| `--bg-surface` | `#1c1f2e` | Filter bar, cards, elevated surfaces |
| `--bg-card` | `#20233a` | Item cards, building rows |
| `--bg-card-hover` | `#252847` | Card hover state |
| `--bg-elevated` | `#2a2e50` | Inputs, tick backgrounds |
| `--amber` | `#e8a040` | Primary accent: progress, quantities, active states |
| `--amber-light` | `#f0b860` | Lighter amber for hover highlights |
| `--amber-dim` | `rgba(232,160,64,0.15)` | Amber tint fills |
| `--amber-border` | `rgba(232,160,64,0.25)` | Amber border tint |
| `--teal` | `#3ccfb4` | Maxed / complete state |
| `--teal-dim` | `rgba(60,207,180,0.15)` | Teal tint fills |
| `--red` | `#f04f5a` | Danger / destructive |
| `--text-primary` | `#edeae2` | Body text |
| `--text-secondary` | `#8c8fa8` | Secondary labels |
| `--text-muted` | `#555870` | Tertiary, placeholders |
| `--border` | `rgba(232,160,64,0.12)` | Default border |
| `--border-mid` | `rgba(232,160,64,0.25)` | Medium border |
| `--border-bright` | `rgba(232,160,64,0.45)` | Active / focused border |

Rarity colors are unchanged from original (Common #8a8a8a through Legendary #f0d060).

## Typography

- **Headings / structural labels:** Barlow Condensed 600–700, tracked uppercase for section labels
- **Body / inputs / badges:** Rubik 400–500
- **Quantities:** Barlow Condensed 700, tabular numerals, amber color
- No gradient text. Emphasis through weight and size only.

## Layout

- Desktop (≥1024px): two-panel grid. Sidebar 320px fixed left, main scrolls right. Header 52px full-width sticky.
- Tablet (768–1023px): sidebar off-canvas drawer toggled by header button.
- Mobile (<768px): single column, building accordion, items grid 2-col.

## Components

- **Building rows:** compact rows in sidebar. Progress bar (amber fill, teal when maxed), slider, tick marks.
- **Item cards:** left 3px rarity-colored border. Image 56×56. Rarity badge filled pill. Quantity large amber number. Source badges compact.
- **Filter bar:** sticky top of main. Search + toggle row 1. Building pills scrollable row 2. Rarity pills row 3.
- **Camp overview:** progress bar X/11 buildings, pending upgrade count.

## Rules

- No colored `border-left` wider than 3px on cards (exception: rarity indicator is the design)
- No gradient text
- Shadows carry offset + soft blur
- Hover states: subtle lift (`translateY(-2px)`) + border brightening
- Focus: `2px solid var(--amber)` outline, `2px` offset
