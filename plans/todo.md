# Plano de Correções — Critique `src/App.jsx`

## Contexto

Critique gerada em `2026-08-11T00-34-11Z` apontou score 19/40 em 10 heurísticas. Os dois P1s bloqueiam usuários de teclado/screen reader e induzem erro real de uso. Os P2s corrigem ambiguidade de UI. As minors corrigem tensões CSS detectadas automaticamente.

---

## Etapa 1 — P1-A: Acessibilidade WCAG 2.1 AA

**Arquivos:** `src/components/BuildingLevelSelector.jsx`, `src/components/ItemCard.jsx`, `src/components/ItemsToKeep.jsx`, `src/index.css`

### `BuildingLevelSelector.jsx`
- Linha 49–55: converter cada `<span className="tick" onClick>` → `<button type="button" className="tick" aria-label={`Nível ${l}`} aria-pressed={l === currentLevel} onClick={...}>` 
  - Remover a guarda `hasData &&` do onClick e usar `disabled={!hasData}` no button
- Linha 38–46: adicionar no `<input type="range">`:
  - `aria-label={`Nível de ${b.name}`}`
  - `aria-valuetext={`Nível ${currentLevel} de ${b.maxLevel}`}`

### `ItemCard.jsx`
- Linha 18: `<span className="item-emoji">` → `<span className="item-emoji" role="img" aria-label={name}>`

### `ItemsToKeep.jsx`
- Linha 73: adicionar `aria-live="polite"` ao `<span className="items-count">`

### `App.jsx`
- Linhas 130–139: adicionar `aria-pressed={activeRarities.includes(r)}` nos botões de raridade

### `index.css`
- Adicionar utilitário `.sr-only` (position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap)
- Linha 358: `.toggle-input { display: none }` → usar estilos `.sr-only` inline (mantém `:checked` sibling selectors funcionando)
- Adicionar `button.tick { appearance: none; background: none; border: none; font: inherit; cursor: pointer; }` para reset de estilos de botão nos ticks
- Adicionar em `.rarity-filter-btn.active`: `font-weight: 700` (indicador não-colorido para WCAG 1.4.1)
- Adicionar `:focus-visible` nos `.tick` e `.filter-btn` para navegação por teclado visível

---

## Etapa 2 — P1-B: Empty State Enganoso + "Limpar Filtros"

**Arquivos:** `src/App.jsx`, `src/components/ItemsToKeep.jsx`, `src/index.css`

### `App.jsx`
- Adicionar callback `clearFilters` (linha ~65):
  ```js
  const clearFilters = useCallback(() => {
    setActiveBuildingIds(buildings.map(b => b.id))
    setActiveRarities(ALL_RARITIES)
    setSearch('')
  }, [])
  ```
- Passar para `<ItemsToKeep ... clearFilters={clearFilters} totalBuildings={buildings.length} />`

### `ItemsToKeep.jsx`
- Aceitar props `clearFilters` e `totalBuildings`
- Adicionar computed `hasActiveFilter = activeBuildingIds.length < totalBuildings || activeRarities.length < ALL_RARITIES.length`
- Adicionar barra de resumo acima da `items-grid` quando `hasActiveFilter`:
  ```jsx
  <div className="filter-summary">
    {activeBuildingIds.length < totalBuildings && <span>{activeBuildingIds.length} de {totalBuildings} estruturas</span>}
    {activeRarities.length < 6 && <span>{activeRarities.length} raridades</span>}
    <button className="filter-summary-clear" onClick={clearFilters}>Limpar filtros</button>
  </div>
  ```
- Linha 63: substituir empty state `✅`:
  ```jsx
  <><div className="empty-icon">🔧</div>
  <p>Todos os itens estão ocultos pelos filtros ativos.</p>
  <button className="empty-clear-btn" onClick={clearFilters}>Limpar todos os filtros</button></>
  ```

### `index.css`
- Estilos para `.filter-summary` (flex, gap, fonte pequena, cor muted, border-bottom)
- Estilos para `.filter-summary-clear` e `.empty-clear-btn` (aparência de link, cor gold)

---

## Etapa 3 — P2-A: Legenda de Quantidade

**Arquivos:** `src/components/ItemsToKeep.jsx`, `src/components/ItemCard.jsx`, `src/index.css`

### `ItemsToKeep.jsx`
- Após o `<p className="section-subtitle">` (linha 75–79), adicionar:
  ```jsx
  <p className="qty-legend">
    Total = soma de todos os upgrades futuros · <em>N próximo</em> = apenas o próximo nível de cada estrutura
  </p>
  ```

### `ItemCard.jsx`
- `<span className="qty-total">` → adicionar `title="Total necessário para maxar as estruturas selecionadas"`
- `<span className="qty-detail">` → adicionar `title="Necessário apenas para o próximo upgrade"`

### `index.css`
- Adicionar `.qty-legend { font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; }`

---

## Etapa 4 — P2-B: Consistência de Linguagem

**Arquivo:** `src/App.jsx`

- Linha 93: `📖 Fonte: Game Rant` → `📖 Ver guia completo`

---

## Etapa 5 — Minors CSS

**Arquivo:** `src/index.css`

### border-top geometric tension (linha 440)
- Trocar `border-top: 3px solid var(--rc, var(--border))` → `border-left: 4px solid var(--rc, var(--border))`
- Remover o `border-top: 3px solid` específico do `.item-card`
- Ajustar padding-left de 14px → 10px (a border-left de 4px compensará visualmente)
- **Impacto visual:** o accent de raridade muda de topo para lado esquerdo — elimina tensão nos cantos arredondados

### Touch targets dos ticks (mobile)
- No `@media (max-width: 640px)`: adicionar `.tick { min-height: 36px; display: flex; align-items: center; justify-content: center; }`

---

## Verificação

1. `npm run dev` → abrir no browser
2. Navegar toda a interface via Tab/Enter/Space — sliders, ticks, toggle, filtros de raridade devem ser operáveis
3. Desativar todos os building filters + raridades → confirmar empty state mostra 🔧 com botão "Limpar"
4. Clicar "Limpar filtros" na barra de resumo ou no empty state → confirmar grid restaura
5. Hover em qty-total/qty-detail → confirmar tooltips aparecem
6. Confirmar `📖 Ver guia completo` no header
7. Confirmar border-left nos item-cards (se etapa 5 aprovada)
