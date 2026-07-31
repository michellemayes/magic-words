import { useEffect, useRef, useState } from 'react'
import type { Domain, Intent } from '../data/types'
import { DOMAIN_LABELS, DOMAINS, INTENTS, INTENT_HINTS, INTENT_LABELS } from '../data/types'

export interface FormValue {
  text: string
  domains: Domain[]
  intents: Intent[]
}

/**
 * The examples are the fastest way to explain what this box wants, so one of
 * them is deliberately a mess with three separate problems in it — that is the
 * shape of input the site is best at and the least obvious from an empty
 * textarea.
 */
const EXAMPLES: FormValue[] = [
  {
    text: 'ok so the deploy went out on friday and the site is slow and I have no idea which service to look at. and then when we sat down to write it up it turned into everyone blaming the new person. also I owe the exec team a summary and my document buries the point so they stop reading',
    domains: [],
    intents: [],
  },
  {
    text: 'My PRDs read like feature specs and leadership keeps asking why we are building this',
    domains: ['product'],
    intents: ['reframe'],
  },
  {
    text: 'Everything Claude writes for me sounds the same and it is always too long',
    domains: ['meta'],
    intents: ['steer'],
  },
  {
    text: 'everyone on the team has admin because it was easier that way and there is an api key in the repo that was never rotated',
    domains: ['security'],
    intents: [],
  },
  {
    text: 'The whole backlog is a P0 and the loudest stakeholder always wins',
    domains: ['product'],
    intents: ['prioritize'],
  },
]

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function SearchForm({
  initial,
  onSubmit,
  showExamples = true,
}: {
  initial: FormValue
  onSubmit: (v: FormValue) => void
  /** Off on the results page, where the examples are just repetition. */
  showExamples?: boolean
}) {
  const [text, setText] = useState(initial.text)
  const [domains, setDomains] = useState<Domain[]>(initial.domains)
  const [intents, setIntents] = useState<Intent[]>(initial.intents)

  // Purely the flourish on the button. Results are synchronous — this is not a
  // loading state and must never gate them, so it is set and forgotten.
  const [casting, setCasting] = useState(false)
  const castTimer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(castTimer.current), [])

  const empty = !text.trim() && !domains.length && !intents.length
  const narrowed = domains.length + intents.length

  const cast = () => {
    setCasting(true)
    window.clearTimeout(castTimer.current)
    castTimer.current = window.setTimeout(() => setCasting(false), 700)
  }

  const send = (v: FormValue) => {
    cast()
    onSubmit(v)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (empty) return
    send({ text, domains, intents })
  }

  return (
    <form className="form" onSubmit={submit}>
      {/*
        The free text does most of the work — the facets below multiply the
        ranking rather than filtering it — so it goes first and gets the room.
        It used to be the third question on the page, under two rows of chips,
        which taught people to answer the chips and type a fragment.
      */}
      <div className="field">
        <label htmlFor="problem" className="big-label">
          What is going on?
        </label>
        <span className="hint">
          Say it however it comes out. Several problems at once is fine — they get untangled and
          answered separately. Plain language beats jargon here; the whole point is that you should
          not have to know the term already.
        </span>
        <textarea
          id="problem"
          className="problem"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // A long ramble and a mouse trip to the button is a bad trade.
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !empty) {
              e.preventDefault()
              send({ text, domains, intents })
            }
          }}
          placeholder="e.g. the plan looks fine and nobody is objecting, but we are about to commit a quarter of the budget and something feels off. and I still have to write it up for the exec team"
        />
      </div>

      <details className="narrow" open={narrowed > 0}>
        <summary>
          Narrow it down
          {narrowed > 0 ? <span className="narrow-count"> · {narrowed} selected</span> : <span className="hint"> — optional</span>}
        </summary>

        <div className="narrow-body">
          <div className="field">
            <span className="field-label" id="intent-label">
              What do you need to happen?
            </span>
            <div className="chips" role="group" aria-labelledby="intent-label">
              {INTENTS.map((i) => (
                <button
                  type="button"
                  key={i}
                  className="chip"
                  title={INTENT_HINTS[i]}
                  aria-pressed={intents.includes(i)}
                  onClick={() => setIntents(toggle(intents, i))}
                >
                  {INTENT_LABELS[i]}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field-label" id="domain-label">
              What are you working on?
            </span>
            <div className="chips" role="group" aria-labelledby="domain-label">
              {DOMAINS.map((d) => (
                <button
                  type="button"
                  key={d}
                  className="chip"
                  aria-pressed={domains.includes(d)}
                  onClick={() => setDomains(toggle(domains, d))}
                >
                  {DOMAIN_LABELS[d]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      <div className="actions">
        <button type="submit" className={casting ? 'primary casting' : 'primary'} disabled={empty}>
          <span className="cast-glyph" aria-hidden="true">
            ✦
          </span>
          Find the magic words
        </button>
        {!empty && (
          <button
            type="button"
            className="ghost"
            onClick={() => {
              setText('')
              setDomains([])
              setIntents([])
            }}
          >
            Clear
          </button>
        )}
      </div>

      {showExamples && (
        <div className="examples">
          <span className="field-label">Or start from one of these</span>
          <div className="example-list">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                className="example"
                key={ex.text}
                onClick={() => {
                  setText(ex.text)
                  setDomains(ex.domains)
                  setIntents(ex.intents)
                  send(ex)
                }}
              >
                “{ex.text}”
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  )
}
