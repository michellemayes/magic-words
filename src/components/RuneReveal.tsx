import { useEffect, useRef, useState } from 'react'

/**
 * Resolves text out of a scatter of glyphs, letter by letter.
 *
 * The whole premise of this site is that there is a word for your problem and
 * you do not know it yet, so the moment the word arrives should feel like it
 * arrived rather than like a div rendered. Each character holds a random glyph
 * until its turn, then settles — left to right, over about half a second.
 *
 * Two things it deliberately does not do. It never animates on a page the user
 * merely navigated back to, only on a fresh result, because a name that
 * re-scrambles every time you hit back stops reading as magic and starts
 * reading as a bug. And it holds the layout still: the placeholder glyphs are
 * drawn from a set of similar width, and the element keeps the final text in
 * the accessibility tree throughout, so nothing reflows and a screen reader
 * only ever hears the real name.
 */

const GLYPHS = '✦✧⋆∴⟡◇⟢∵⌁⍟✧⋄'

const REVEAL_MS = 620
/** Each character churns for this long before it settles. */
const CHURN_MS = 260

function randomGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function RuneReveal({ text, className }: { text: string; className?: string }) {
  const reduced = prefersReducedMotion()
  const [display, setDisplay] = useState<string | null>(() => (reduced ? null : ''))
  const frame = useRef(0)

  useEffect(() => {
    if (reduced) {
      setDisplay(null)
      return
    }

    const characters = [...text]
    // Whitespace is structure, not content — it should never churn, or the
    // word boundaries jitter and the whole line looks like it is vibrating.
    const settleAt = characters.map((c, i) =>
      /\s/.test(c) ? 0 : (i / Math.max(1, characters.length - 1)) * (REVEAL_MS - CHURN_MS),
    )
    const start = performance.now()

    const tick = (now: number) => {
      const elapsed = now - start
      setDisplay(
        characters
          .map((c, i) => {
            if (elapsed >= settleAt[i] + CHURN_MS) return c
            if (elapsed < settleAt[i]) return ' '
            return randomGlyph()
          })
          .join(''),
      )
      if (elapsed < REVEAL_MS) {
        frame.current = requestAnimationFrame(tick)
      } else {
        // Null means finished: drop back to a single plain text node, so the
        // steady state is ordinary text that selects and copies once.
        setDisplay(null)
      }
    }

    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [text, reduced])

  if (display === null) return <span className={className}>{text}</span>

  return (
    <span className={className}>
      <span aria-hidden="true" className="rune-glyphs">
        {display}
      </span>
      <span className="visually-hidden">{text}</span>
    </span>
  )
}
