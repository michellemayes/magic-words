import { useEffect, useMemo } from 'react'
import { getConcept } from './data/concepts'
import { warmSemanticSpace } from './lib/search'
import { triage } from './lib/triage'
import { useRoute } from './lib/router'
import { ConceptCard } from './components/ConceptCard'
import { SearchForm, type FormValue } from './components/SearchForm'
import { Browse } from './components/Browse'
import { Spell } from './components/Spell'
import { Untangled } from './components/Untangled'
import { PluginPage } from './components/PluginPage'
import { Install } from './components/Install'
import { CONCEPTS } from './data/concepts'

const EMPTY: FormValue = { text: '', domains: [], intents: [] }

export default function App() {
  const [route, navigate] = useRoute()

  /**
   * The latent space takes about 40ms to build. That is worth paying, but not
   * before first paint — so it is built in the first idle slot instead. Anyone
   * arriving on the home page will have spent several seconds reading and
   * typing before they search, by which point it is long since ready; only a
   * deep link straight into a search pays for it inline.
   */
  useEffect(() => {
    const idle = window.requestIdleCallback
    if (idle) {
      const handle = idle(() => warmSemanticSpace(), { timeout: 2000 })
      return () => window.cancelIdleCallback?.(handle)
    }
    const timer = window.setTimeout(warmSemanticSpace, 200)
    return () => window.clearTimeout(timer)
  }, [])

  const found = useMemo(() => {
    if (route.name !== 'search') return null
    return triage(route.text, { domains: route.domains, intents: route.intents, limit: 3 })
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
          <button
            className="navlink"
            aria-current={route.name === 'plugin'}
            onClick={() => navigate({ name: 'plugin' })}
          >
            Plugin
          </button>
        </nav>
      </header>

      <main>
        {route.name === 'home' && (
          <>
            <section className="hero">
              <h1>
                Describe the mess.
                <br />
                Get the <em>words that fix it.</em>
              </h1>
              <p className="lede">
                There is usually a named technique for what you are stuck on — and naming it is what
                gets Claude to actually do it. Tell us what is going on, in your own words, however
                many problems that turns out to be. You get the concept, the exact phrasing, and
                your own request with the phrasing folded into it.
              </p>
            </section>
            <SearchForm initial={EMPTY} onSubmit={runSearch} />

            {/*
              The landing page's second offer. Someone who has read this far has
              understood the idea, and the better version of the idea is the one
              where they never have to come back here — so the install goes on
              the front page rather than behind a nav item.
            */}
            <section className="pitch">
              <h2>
                <span className="callout-glyph" aria-hidden="true">
                  ✦
                </span>{' '}
                Or never come back here again
              </h2>
              <p>
                The same {CONCEPTS.length} concepts as a Claude Code plugin. It reads the request
                you were going to send anyway, works out which named techniques it needs, and puts
                the phrasing in before the work starts — then tells you which words it used.
              </p>
              <Install />
              <p className="pitch-foot">
                Two commands, no dependencies, nothing leaves your machine.{' '}
                <button
                  type="button"
                  className="linkish"
                  onClick={() => navigate({ name: 'plugin' })}
                >
                  What it does, and when it stays out of the way →
                </button>
              </p>
            </section>
          </>
        )}

        {route.name === 'search' && found && (
          <SearchResults
            query={route.text}
            found={found}
            onOpenConcept={openConcept}
            initial={{ text: route.text, domains: route.domains, intents: route.intents }}
            onSubmit={runSearch}
          />
        )}

        {route.name === 'concept' && (
          <ConceptPage id={route.id} onOpenConcept={openConcept} onBack={() => window.history.back()} />
        )}

        {route.name === 'browse' && <Browse onOpenConcept={openConcept} />}

        {route.name === 'plugin' && <PluginPage />}
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
  found,
  onOpenConcept,
  initial,
  onSubmit,
}: {
  query: string
  found: ReturnType<typeof triage>
  onOpenConcept: (id: string) => void
  initial: FormValue
  onSubmit: (v: FormValue) => void
}) {
  const { threads, picks, others } = found

  /**
   * With facets and no words there is nothing to attribute a pick to, so
   * `triage` declines to make any and the ranked list leads instead. The page
   * still needs a headline card, which is the top of that list.
   */
  const headline = picks[0]?.concept ?? others[0]?.concept
  const shownIds = new Set([...picks.map((p) => p.concept.id), headline?.id])
  const rest = others.filter((r) => !shownIds.has(r.concept.id))

  if (!headline) {
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

  const lead = picks[0]

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

      <Untangled threads={threads} picks={picks} onOpenConcept={onOpenConcept} />

      <ConceptCard
        // Keyed on the concept so a new search remounts the card and the name
        // is conjured again; re-running the same search leaves it alone.
        key={headline.id}
        concept={headline}
        matchedTerms={lead && lead.confidence === 'strong' ? lead.matchedTerms : undefined}
        looseMatch={lead?.confidence === 'tentative'}
        eyebrow={threads.length > 1 ? 'The strongest of them' : 'Closest match'}
        conjure
        onOpenConcept={onOpenConcept}
      />

      <Spell key={`spell:${picks.map((p) => p.concept.id).join(',')}`} text={query} picks={picks} />

      {/*
        Only where there is no untangled list above. With one, these rows would
        be the third appearance of the same two concepts on one screen — named
        in the strands, quoted in the spell, and then listed again.
      */}
      {picks.length > 1 && threads.length < 2 && (
        <>
          <h2 className="section-label">The other words for this</h2>
          <div className="rows">
            {picks.slice(1).map((p) => (
              <button
                type="button"
                className="row"
                key={p.concept.id}
                onClick={() => onOpenConcept(p.concept.id)}
              >
                <p className="row-name">{p.concept.name}</p>
                <p className="row-line">{p.concept.oneLiner}</p>
                <div className="row-tags">
                  {p.concept.tags.slice(0, 3).map((t) => (
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

      {rest.length > 0 && (
        <>
          <h2 className="section-label">If none of those is it</h2>
          <div className="rows">
            {rest.slice(0, 5).map((r) => (
              <button
                type="button"
                className="row"
                key={r.concept.id}
                onClick={() => onOpenConcept(r.concept.id)}
              >
                <p className="row-name">{r.concept.name}</p>
                <p className="row-line">{r.concept.oneLiner}</p>
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
