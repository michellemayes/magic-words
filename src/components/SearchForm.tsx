import { useState } from 'react'
import type { Domain, Intent } from '../data/types'
import { DOMAIN_LABELS, DOMAINS, INTENTS, INTENT_HINTS, INTENT_LABELS } from '../data/types'

export interface FormValue {
  text: string
  domains: Domain[]
  intents: Intent[]
}

const EXAMPLES: FormValue[] = [
  {
    text: 'My PRDs read like feature specs and leadership keeps asking why we are building this',
    domains: ['product'],
    intents: ['reframe'],
  },
  {
    text: 'We keep fixing the same production issue every couple of months',
    domains: ['engineering'],
    intents: ['diagnose'],
  },
  {
    text: 'Everything Claude writes for me sounds the same and it is always too long',
    domains: ['meta'],
    intents: ['steer'],
  },
  {
    text: 'I have to tell a teammate their work is not good enough and I am dreading it',
    domains: ['career'],
    intents: ['communicate'],
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

  const empty = !text.trim() && !domains.length && !intents.length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!empty) onSubmit({ text, domains, intents })
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="field">
        <span className="field-label" id="domain-label">
          What are you working on?
        </span>
        <span className="hint">Optional. Pick as many as fit.</span>
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

      <div className="field">
        <span className="field-label" id="intent-label">
          What do you need to happen?
        </span>
        <span className="hint">Optional. This is what steers the ranking most.</span>
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
        <label htmlFor="problem">Describe the problem in your own words</label>
        <span className="hint">
          Plain language beats jargon here — the whole point is that you should not need to know
          the term already.
        </span>
        <textarea
          id="problem"
          className="problem"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. I keep getting answers that are technically fine but way too generic to actually use"
        />
      </div>

      <div className="actions">
        <button type="submit" className="primary" disabled={empty}>
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
                onSubmit(ex)
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
