import type { Pick } from '../lib/triage'

/**
 * The ramble, cut up, with the word each strand summoned.
 *
 * This is the part that makes the ranking legible. A single result page can
 * always be dismissed as a search engine guessing; a list that says "you said
 * *this*, and the word for it is *that*" can be checked line by line, and the
 * lines it gets wrong are obvious rather than hidden inside an ordering.
 *
 * It shows strands with no answer too. A thread that found nothing is a real
 * outcome — the index is large but it is not one concept per sentence — and
 * quietly dropping it would make the split look better than it is.
 */
export function Untangled({
  threads,
  picks,
  onOpenConcept,
}: {
  threads: string[]
  picks: Pick[]
  onOpenConcept: (id: string) => void
}) {
  if (threads.length < 2) return null

  const fromWhole = picks.filter((p) => p.fromWholeInput)

  return (
    <section className="untangled">
      <h2 className="section-label">
        {threads.length} things in what you said
      </h2>
      <ol className="threads">
        {threads.map((thread, i) => {
          const pick = picks.find((p) => !p.fromWholeInput && p.because === thread)
          return (
            <li className="thread" key={`${i}-${thread.slice(0, 24)}`}>
              <p className="thread-said">“{thread}”</p>
              {pick ? (
                <button
                  type="button"
                  className="thread-word"
                  onClick={() => onOpenConcept(pick.concept.id)}
                >
                  <span className="thread-arrow" aria-hidden="true">
                    ✦
                  </span>
                  <span className="thread-name">{pick.concept.name}</span>
                  <span className="thread-line">{pick.concept.oneLiner}</span>
                </button>
              ) : (
                <p className="thread-none">No word for this one.</p>
              )}
            </li>
          )
        })}
      </ol>

      {fromWhole.length > 0 && (
        <p className="thread-whole">
          And, reading the whole thing together:{' '}
          {fromWhole.map((p, i) => (
            <span key={p.concept.id}>
              {i > 0 && ', '}
              <button type="button" className="linkish" onClick={() => onOpenConcept(p.concept.id)}>
                {p.concept.name}
              </button>
            </span>
          ))}
          .
        </p>
      )}
    </section>
  )
}
