# ⚔️ MysticFalls — Camp Upgrade Tracker

Ferramenta web para rastrear os itens necessários para upar as estruturas do acampamento em **Mistfall Hunter**.

## O que faz

- Defina o nível atual de cada estrutura pelos sliders na barra lateral
- Veja automaticamente quais itens guardar para os upgrades futuros
- Alterne entre "todos os upgrades futuros" ou "só o próximo nível"
- Filtre por estrutura, por raridade do item ou busque por nome
- Acompanhe o progresso geral do acampamento (estruturas no máximo / total)
- Reinicie todos os níveis de uma vez com confirmação
- Níveis e filtros são salvos automaticamente no navegador (localStorage)

## Tecnologias

- React 18 + Vite
- CSS puro (sem framework)
- Imagens de itens via Fandom Wiki API

## Como rodar localmente

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

```bash
npm run build    # gera build de produção em dist/
npm run preview  # serve o build localmente
```

## Estrutura de dados

Os dados de upgrade ficam em `src/data/upgrades.js`. Cada estrutura lista os itens exigidos por nível:

```js
{
  id: 'warehouse',
  name: 'Warehouse',
  icon: '🏪',
  priority: 1,        // ordem de exibição
  maxLevel: 13,
  levels: {
    2: [{ name: 'Pearl Dust', qty: 1, rarity: 'Common' }, ...],
    // chave = nível de destino; nível 1 não tem custo
  }
}
```

Raridades válidas: `Common`, `Rare`, `Excellent`, `Epic`, `Legendary`, `Holy`.

