import { useEffect, useRef, useState } from 'react'

/**
 * Copying the prompt is the point of the whole site, so it falls back to a
 * hidden textarea when the async clipboard API is unavailable (http, older
 * Safari, permissions denied).
 */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'done' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const flash = (next: 'done' | 'failed') => {
    setState(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 1800)
  }

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        flash('done')
        return
      }
      throw new Error('clipboard unavailable')
    } catch {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      document.body.appendChild(area)
      area.select()
      const ok = document.execCommand?.('copy')
      document.body.removeChild(area)
      flash(ok ? 'done' : 'failed')
    }
  }

  return (
    <button
      type="button"
      className={`copy${state === 'done' ? ' done' : ''}`}
      onClick={copy}
      aria-live="polite"
    >
      {state === 'done' ? '✓ Copied' : state === 'failed' ? 'Press ⌘C' : label}
    </button>
  )
}
