import { useState } from 'react'
import type { Pick } from '../lib/triage'
import { composePrompt, INJECTION_HEADER } from '../lib/compose'
import { CopyButton } from './CopyButton'

/**
 * The deliverable: the user's own request with the steering phrases folded
 * into it, ready to paste.
 *
 * Everything else on this site is a page *about* a concept. This is the thing
 * you actually send, and it is the same string the Claude Code skill builds
 * from the same picks — `composePrompt` is shared so the two cannot drift.
 *
 * Two decisions worth defending. The user's words are reproduced verbatim and
 * first, never paraphrased: a rewrite would quietly drop the one detail that
 * mattered and nobody would notice until the answer came back wrong. And the
 * phrases are toggles rather than a fixed block, with the thin-evidence ones
 * off to begin with, because the honest state of a loose match is "here is
 * something, you decide" and a checkbox says that better than a paragraph can.
 */
export function Spell({ text, picks }: { text: string; picks: Pick[] }) {
  const [chosen, setChosen] = useState<string[]>(() =>
    picks.filter((p) => p.confidence === 'strong').map((p) => p.concept.id),
  )

  const original = text.trim()
  if (!original || !picks.length) return null

  const selected = picks.filter((p) => chosen.includes(p.concept.id))
  const composed = composePrompt(original, selected)

  const toggle = (id: string) =>
    setChosen((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  return (
    <section className="spell" aria-labelledby="spell-label">
      <div className="spell-head">
        <span className="label" id="spell-label">
          <span className="spell-glyph" aria-hidden="true">
            ✦
          </span>{' '}
          Your words, with the magic in them
        </span>
        <CopyButton text={composed} label="Copy the whole prompt" />
      </div>

      <div className="spell-body">
        <p className="spell-original">{original}</p>
        {selected.length > 0 && <p className="spell-lead">{INJECTION_HEADER}</p>}
        {selected.map((p) => (
          <p className="spell-injection" key={p.concept.id}>
            <strong>{p.concept.name}.</strong> {p.concept.prompt}
          </p>
        ))}
        {selected.length === 0 && (
          <p className="spell-empty">
            Nothing selected — this is just what you typed. Turn one of them back on below.
          </p>
        )}
      </div>

      <div className="spell-toggles">
        <span className="hint">Include</span>
        <div className="chips">
          {picks.map((p) => (
            <button
              type="button"
              key={p.concept.id}
              className="chip"
              aria-pressed={chosen.includes(p.concept.id)}
              title={p.confidence === 'tentative' ? 'A loose match — read it before you send it' : undefined}
              onClick={() => toggle(p.concept.id)}
            >
              {p.concept.name}
              {p.confidence === 'tentative' && <span className="chip-note"> · loose</span>}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
