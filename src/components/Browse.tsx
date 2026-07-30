import { useMemo, useState } from 'react'
import type { Concept, Domain } from '../data/types'
import { DOMAIN_LABELS, DOMAINS } from '../data/types'
import { allConcepts } from '../lib/search'

export function Browse({ onOpenConcept }: { onOpenConcept: (id: string) => void }) {
  const [domain, setDomain] = useState<Domain | null>(null)
  const [filter, setFilter] = useState('')

  const groups = useMemo(() => {
    const needle = filter.trim().toLowerCase()
    const matches = (c: Concept) =>
      !needle ||
      c.name.toLowerCase().includes(needle) ||
      c.oneLiner.toLowerCase().includes(needle) ||
      (c.aka ?? []).some((a) => a.toLowerCase().includes(needle)) ||
      c.tags.some((t) => t.includes(needle))

    const shown = allConcepts().filter(matches)
    // Filtering to a domain includes concepts where it is a secondary use;
    // the ungrouped view files each concept under its primary domain only.
    if (domain) {
      return [{ domain, items: shown.filter((c) => c.domains.includes(domain)) }].filter(
        (g) => g.items.length > 0,
      )
    }
    return DOMAINS.map((d) => ({
      domain: d,
      items: shown.filter((c) => c.domains[0] === d),
    })).filter((g) => g.items.length > 0)
  }, [domain, filter])

  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <div>
      <div className="results-head">
        <p className="echo">
          Every concept in the index, grouped by where it is primarily used.{' '}
          <strong>{total} shown.</strong>
        </p>
      </div>

      <div className="browse-filter field">
        <input
          className="problem"
          style={{ minHeight: 0, height: 44 }}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name, alias or tag…"
          aria-label="Filter concepts"
        />
      </div>

      <div className="chips" style={{ marginBottom: 8 }}>
        <button
          type="button"
          className="chip"
          aria-pressed={domain === null}
          onClick={() => setDomain(null)}
        >
          All
        </button>
        {DOMAINS.map((d) => (
          <button
            type="button"
            key={d}
            className="chip"
            aria-pressed={domain === d}
            onClick={() => setDomain(domain === d ? null : d)}
          >
            {DOMAIN_LABELS[d]}
          </button>
        ))}
      </div>

      {total === 0 && (
        <div className="empty">
          <p>Nothing matches “{filter}”.</p>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.domain}>
          <h2 className="group-head">
            {DOMAIN_LABELS[g.domain]} <span className="count">· {g.items.length}</span>
          </h2>
          <div className="rows">
            {g.items.map((c) => (
              <button type="button" className="row" key={c.id} onClick={() => onOpenConcept(c.id)}>
                <p className="row-name">{c.name}</p>
                <p className="row-line">{c.oneLiner}</p>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
