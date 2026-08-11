# ⚔️ MysticFalls — Camp Upgrade Tracker

Ferramenta web para rastrear os itens necessários para upar as estruturas do acampamento em **Mistfall Hunter**.

## O que faz

- Defina o nível atual de cada estrutura usando os sliders
- Veja automaticamente quais itens você precisa guardar para os upgrades futuros
- Filtre por estrutura, por raridade do item ou busque por nome
- Alterne entre "todos os upgrades futuros" ou "só o próximo nível"
- Os níveis são salvos automaticamente no navegador (localStorage)

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
  maxLevel: 13,
  levels: {
    2: [{ name: 'Pearl Dust', qty: 1 }, ...],
    // chave = nível de destino do upgrade
  }
}
```

## Fonte dos dados

Itens e quantidades extraídos do guia publicado no [Game Rant](https://gamerant.com/mistfall-hunter-what-to-upgrade-first-camp-workstations/). Alguns níveis ainda não foram publicados e aparecem como **Em Breve** no site original.
