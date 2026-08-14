import { useState, useEffect, useCallback, useRef } from 'react'

const PADDING = 8
const TOOLTIP_W = 320
const TOOLTIP_H = 230
const GAP = 14

const STEPS = [
  {
    target: null,
    title: 'Bem-vindo ao MysticFalls!',
    text: 'Este guia rápido mostra como usar o tracker de upgrades do seu acampamento. Você pode pular a qualquer momento e reabri-lo pelo botão ? no cabeçalho.',
    position: 'center',
  },
  {
    target: '.item-card',
    title: 'Cards de itens',
    text: 'Cada card representa um material necessário para melhorar suas estruturas. A quantidade em destaque mostra o total que você vai precisar para todos os upgrades futuros.',
    position: 'bottom',
  },
  {
    target: '.inv-progress-wrap',
    title: 'Barra de progresso',
    text: 'A barra mostra seu progresso: 4 / 6 significa que você tem 4 de 6 necessários. Quando fica verde e cheia, você tem o suficiente. O badge +3 indica sobra; ✓ confirma que está ok.',
    position: 'bottom',
  },
  {
    target: '.item-card',
    title: 'Registrar quantidade',
    text: 'Clique em qualquer card para expandir os controles. Use − e + para informar quantos daquele item você possui. O progresso da barra atualiza na hora.',
    position: 'right',
  },
  {
    target: '.toggle-track',
    title: 'PRÓXIMO vs. Todos os upgrades',
    text: 'Este botão alterna a exibição: ativado mostra só os materiais para o próximo upgrade de cada estrutura; desativado exibe tudo que você vai precisar no futuro.',
    position: 'bottom',
  },
  {
    target: '.filter-bar',
    title: 'Filtros',
    text: 'Use a busca para encontrar itens por nome. Os botões de estrutura e raridade filtram o que aparece na tela. Clique em "Limpar" para remover todos os filtros de uma vez.',
    position: 'bottom',
  },
  {
    target: '.app-sidebar',
    title: 'Estruturas do acampamento',
    text: 'Na barra lateral você define o nível atual de cada estrutura. Clique nos números abaixo da barra de progresso para ajustar rapidamente o nível de qualquer estrutura.',
    position: 'right',
  },
  {
    target: '.badge-ready',
    fallbackTarget: '.building-row',
    title: 'Upgrade disponível',
    text: 'O badge verde "Pronto" aparece quando você tem todos os materiais para o próximo nível. Clique no número do próximo nível para confirmar o upgrade.',
    position: 'right',
  },
  {
    target: null,
    title: 'Upgrade desconta o inventário',
    text: 'Ao confirmar um upgrade, o sistema exibe os materiais que serão consumidos e os desconta automaticamente do seu inventário. O nível da estrutura sobe imediatamente.',
    position: 'center',
  },
  {
    target: null,
    title: 'Tudo salvo automaticamente',
    text: 'Seus níveis, inventário e filtros são salvos no navegador. Feche e reabra a página sem perder nada. Use o botão ? no cabeçalho para rever este guia quando quiser.',
    position: 'center',
  },
]

function computeRect(selector, fallback) {
  if (!selector) return null
  let el = document.querySelector(selector)
  if (!el && fallback) el = document.querySelector(fallback)
  if (!el) return null
  const r = el.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (r.right < 0 || r.bottom < 0 || r.left > vw || r.top > vh) return null
  return {
    top: r.top - PADDING,
    left: r.left - PADDING,
    width: r.width + PADDING * 2,
    height: r.height + PADDING * 2,
  }
}

function computeTooltipStyle(rect, position) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const isMobile = vw <= 640

  if (isMobile) return {}

  if (!rect || position === 'center') {
    return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  }

  let top, left
  switch (position) {
    case 'bottom':
      top = rect.top + rect.height + GAP
      left = rect.left + rect.width / 2 - TOOLTIP_W / 2
      break
    case 'top':
      top = rect.top - TOOLTIP_H - GAP
      left = rect.left + rect.width / 2 - TOOLTIP_W / 2
      break
    case 'right':
      top = rect.top + rect.height / 2 - TOOLTIP_H / 2
      left = rect.left + rect.width + GAP
      break
    case 'left':
      top = rect.top + rect.height / 2 - TOOLTIP_H / 2
      left = rect.left - TOOLTIP_W - GAP
      break
    default:
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  }

  left = Math.max(12, Math.min(left, vw - TOOLTIP_W - 12))
  top = Math.max(12, Math.min(top, vh - TOOLTIP_H - 12))
  return { top, left }
}

export default function HelpTour({ onClose }) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState(null)
  const nextBtnRef = useRef(null)
  const current = STEPS[step]

  const refresh = useCallback(() => {
    setRect(computeRect(current.target, current.fallbackTarget))
  }, [current])

  useEffect(() => {
    if (current.target) {
      const el =
        document.querySelector(current.target) ||
        (current.fallbackTarget && document.querySelector(current.fallbackTarget))
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
    const t = setTimeout(refresh, 80)
    return () => clearTimeout(t)
  }, [current, refresh])

  useEffect(() => {
    window.addEventListener('resize', refresh)
    return () => window.removeEventListener('resize', refresh)
  }, [refresh])

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    nextBtnRef.current?.focus()
  }, [step])

  const advance = () => step < STEPS.length - 1 ? setStep(s => s + 1) : onClose()
  const goBack = () => step > 0 && setStep(s => s - 1)

  const spotlightStyle = rect
    ? { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    : null
  const tooltipStyle = computeTooltipStyle(rect, current.position)

  return (
    <div
      className="tour-overlay"
      style={{ background: spotlightStyle ? 'transparent' : 'rgba(0,0,0,0.78)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Tutorial do MysticFalls"
    >
      {spotlightStyle && (
        <div className="tour-spotlight" style={spotlightStyle} aria-hidden="true" />
      )}
      <div className="tour-tooltip" style={tooltipStyle}>
        <div className="tour-step-label">Passo {step + 1} de {STEPS.length}</div>
        <h3 className="tour-title">{current.title}</h3>
        <p className="tour-body">{current.text}</p>
        <div className="tour-dots" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={`tour-dot${i === step ? ' active' : ''}`} />
          ))}
        </div>
        <div className="tour-nav">
          {step > 0 && (
            <button className="tour-btn tour-btn-back" onClick={goBack}>
              ← Voltar
            </button>
          )}
          <button ref={nextBtnRef} className="tour-btn tour-btn-next" onClick={advance}>
            {step === STEPS.length - 1 ? 'Concluir ✓' : 'Próximo →'}
          </button>
          {step < STEPS.length - 1 && (
            <button className="tour-btn-skip" onClick={onClose}>
              Pular tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
