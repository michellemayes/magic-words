import { useMemo } from 'react'
import { getConcept } from './data/concepts'
import { search } from './lib/search'
import { useRoute } from './lib/router'
import { ConceptCard } from './components/ConceptCard'
import { SearchForm, type FormValue } from './components/SearchForm'
import { Browse } from './components/Browse'
import { CONCEPTS } from './data/concepts'

const EMPTY: FormValue = { text: '', domains: [], intents: [] }

export default function App() {
  const [route, navigate] = useRoute()

  const results = useMemo(() => {
    if (route.name !== 'search') return []
    return search({
      text: route.text,
      domains: route.domains,
      intents: route.intents,
      limit: 7,
    })
  }, [route])

  const openConcept = (id: string) => navigate({ name: 'concept', id })
  const runSearch = (v: FormValue) =>
    navigate({ name: 'search', text: v.text, domains: v.domains, intents: v.intents })

  return (
    <div className="shell">
      <header className="masthead">
        <button className="wordmark" onClick={() => navigate({ name: 'home' })}>
          <span className="glyph">✦</span>
          <span>
            Magic <em>Words</em>
          </span>
        </button>
        <nav>
          <button
            className="navlink"
            aria-current={route.name === 'home' || route.name === 'search'}
            onClick={() => navigate({ name: 'home' })}
          >
            Search
          </button>
          <button
            className="navlink"
            aria-current={route.name === 'browse'}
            onClick={() => navigate({ name: 'browse' })}
          >
            Browse all
          </button>
        </nav>
      </header>

      <main>
        {route.name === 'home' && (
          <>
            <section className="hero">
              <h1>
                Describe the problem.
                <br />
                Get the <em>phrase that fixes it.</em>
              </h1>
              <p className="lede">
                There is usually a named technique for what you are stuck on — and naming it is
                what gets Claude to actually do it. Tell us the problem in your own words and we
                will find the concept, the exact prompt, and the alternatives worth trying.
              </p>
            </section>
            <SearchForm initial={EMPTY} onSubmit={runSearch} />
          </>
        )}

        {route.name === 'search' && (
          <SearchResults
            query={route.text}
            results={results}
            onOpenConcept={openConcept}
            initial={{ text: route.text, domains: route.domains, intents: route.intents }}
            onSubmit={runSearch}
          />
        )}

        {route.name === 'concept' && <ConceptPage id={route.id} onOpenConcept={openConcept} onBack={() => window.history.back()} />}

        {route.name === 'browse' && <Browse onOpenConcept={openConcept} />}
      </main>

      <footer className="foot">
        <p>
          <strong>{CONCEPTS.length}</strong> concepts, searched entirely in your browser — nothing
          you type is sent anywhere. Every entry names its origin so you can go read the source.
        </p>
        <p>
          Free to use. Missing a concept?{' '}
          <a href="https://github.com/michellemayes/magic-words">Add it on GitHub.</a>
        </p>
      </footer>
    </div>
  )
}

function SearchResults({
  query,
  results,
  onOpenConcept,
  initial,
  onSubmit,
}: {
  query: string
  results: ReturnType<typeof search>
  onOpenConcept: (id: string) => void
  initial: FormValue
  onSubmit: (v: FormValue) => void
}) {
  const [best, ...rest] = results

  if (!best) {
    return (
      <>
        <div className="empty">
          <p>Nothing in the index matches that yet.</p>
          <p style={{ color: 'var(--text-faint)', fontSize: 14 }}>
            Try describing the symptom rather than the solution — “the plan looks fine and nobody
            is objecting” finds more than “risk framework”.
          </p>
        </div>
        <SearchForm initial={initial} onSubmit={onSubmit} />
      </>
    )
  }

  return (
    <>
      <div className="results-head">
        <p className="echo">
          {query.trim() ? (
            <>
              For <strong>“{query.trim()}”</strong>
            </>
          ) : (
            <>Ranked by what you picked above.</>
          )}
        </p>
      </div>

      <ConceptCard
        concept={best.concept}
        matchedTerms={best.exactNameMatch ? undefined : best.matchedTerms}
        eyebrow={best.exactNameMatch ? 'You asked for this one' : 'Closest match'}
        onOpenConcept={onOpenConcept}
      />

      {rest.length > 0 && (
        <>
          <h2 className="section-label">Other magic words for this</h2>
          <div className="rows">
            {rest.map((r) => (
              <button
                type="button"
                className="row"
                key={r.concept.id}
                onClick={() => onOpenConcept(r.concept.id)}
              >
                <p className="row-name">{r.concept.name}</p>
                <p className="row-line">{r.concept.oneLiner}</p>
                <div className="row-tags">
                  {r.concept.tags.slice(0, 3).map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <h2 className="section-label">Not it? Adjust and search again</h2>
      <SearchForm initial={initial} onSubmit={onSubmit} showExamples={false} />
    </>
  )
}

function ConceptPage({
  id,
  onOpenConcept,
  onBack,
}: {
  id: string
  onOpenConcept: (id: string) => void
  onBack: () => void
}) {
  const concept = getConcept(id)

  if (!concept) {
    return (
      <div className="empty">
        <p>No concept with the id “{id}”.</p>
        <button className="ghost" onClick={onBack}>
          Go back
        </button>
      </div>
    )
  }

  return (
    <>
      <button className="back" onClick={onBack}>
        ← Back
      </button>
      <div style={{ height: 12 }} />
      <ConceptCard concept={concept} onOpenConcept={onOpenConcept} />
    </>
  )
}
