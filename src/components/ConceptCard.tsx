import type { Concept } from '../data/types'
import { DOMAIN_LABELS } from '../data/types'
import { getConcept } from '../data/concepts'
import { CopyButton } from './CopyButton'

interface Props {
  concept: Concept
  /** Original query words that matched, shown so the ranking is legible. */
  matchedTerms?: string[]
  eyebrow?: string
  onOpenConcept: (id: string) => void
}

export function ConceptCard({ concept, matchedTerms, eyebrow, onOpenConcept }: Props) {
  const related = concept.related.map(getConcept).filter((c): c is Concept => Boolean(c))

  return (
    <article className="card">
      <div className="card-top">
        {eyebrow && (
          <div className="eyebrow">
            <span>✦</span>
            <span>{eyebrow}</span>
          </div>
        )}
        <h2 className="concept-name">{concept.name}</h2>
        <p className="provenance">
          {concept.origin && <span>{concept.origin}</span>}
          {concept.origin && concept.aka?.length ? <span> · </span> : null}
          {concept.aka?.length ? <span className="aka">also called {concept.aka.join(', ')}</span> : null}
        </p>
        <p className="one-liner">{concept.oneLiner}</p>

        {matchedTerms && matchedTerms.length > 0 && (
          <div className="matched">
            <span className="m-label">Matched on</span>
            {matchedTerms.map((t) => (
              <span className="m-term" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="magic">
        <div className="magic-head">
          <span className="label">The magic words</span>
          <CopyButton text={concept.prompt} label="Copy prompt" />
        </div>
        <p className="magic-text">{concept.prompt}</p>
      </div>

      <div className="card-body">
        <p className="note">
          <strong>Why it works:</strong> {concept.why}
        </p>
        {concept.watchOut && (
          <p className="note caution">
            <strong>Watch out:</strong> {concept.watchOut}
          </p>
        )}

        {concept.variants?.length ? (
          <div className="variants">
            {concept.variants.map((v) => (
              <details className="variant" key={v.label}>
                <summary>{v.label}</summary>
                <div className="variant-body">
                  <p className="magic-text">{v.prompt}</p>
                  <CopyButton text={v.prompt} label="Copy this version" />
                </div>
              </details>
            ))}
          </div>
        ) : null}

        {related.length > 0 && (
          <>
            <p className="note" style={{ marginTop: 20, marginBottom: 4 }}>
              <strong>If that is not quite it:</strong>
            </p>
            <div className="related-inline">
              {related.map((r) => (
                <button
                  type="button"
                  className="related-chip"
                  key={r.id}
                  onClick={() => onOpenConcept(r.id)}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </>
        )}

        <p className="note" style={{ marginTop: 20, marginBottom: 0, fontSize: 13, color: 'var(--text-faint)' }}>
          {concept.domains.map((d) => DOMAIN_LABELS[d]).join(' · ')}
        </p>
      </div>
    </article>
  )
}
