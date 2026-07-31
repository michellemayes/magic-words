/**
 * Relevancy benchmark. `npm run bench`.
 *
 * Scores the lexical half on its own against the full hybrid, on both the
 * tuning cases and the held-out ones, and prints every case the hybrid still
 * gets wrong. Named `.bench.ts` so it stays out of `npm test`: it reports
 * numbers rather than asserting them, and a benchmark that fails the build
 * every time the corpus grows is a benchmark people delete.
 */

import { describe, it } from 'vitest'
import { search, type Tuning } from './search'
import { HELD_OUT_CASES, TUNING_CASES, type RetrievalCase } from './evaluation'

interface Metrics {
  recallAt1: number
  recallAt3: number
  recallAt5: number
  mrr: number
  misses: { query: string; expect: string[]; got: string[] }[]
}

function evaluate(cases: RetrievalCase[], tuning: Partial<Tuning> = {}): Metrics {
  let at1 = 0
  let at3 = 0
  let at5 = 0
  let reciprocal = 0
  const misses: Metrics['misses'] = []

  for (const c of cases) {
    const got = search({ text: c.query, limit: 8, tuning }).map((r) => r.concept.id)
    const rank = got.findIndex((id) => c.expect.includes(id))

    if (rank === 0) at1++
    if (rank >= 0 && rank < 3) at3++
    if (rank >= 0 && rank < 5) at5++
    if (rank >= 0) reciprocal += 1 / (rank + 1)
    if (rank < 0 || rank >= 5) misses.push({ query: c.query, expect: c.expect, got: got.slice(0, 3) })
  }

  const n = cases.length
  return {
    recallAt1: at1 / n,
    recallAt3: at3 / n,
    recallAt5: at5 / n,
    mrr: reciprocal / n,
    misses,
  }
}

const pct = (x: number) => `${(x * 100).toFixed(1)}%`.padStart(6)

const LEXICAL_ONLY: Partial<Tuning> = { semanticWeight: 0, relatedDiffusion: 0 }
const SEMANTIC_ONLY: Partial<Tuning> = { lexicalWeight: 0, relatedDiffusion: 0 }
const NO_DIFFUSION: Partial<Tuning> = { relatedDiffusion: 0 }

function report(label: string, cases: RetrievalCase[]) {
  const lexical = evaluate(cases, LEXICAL_ONLY)
  const semantic = evaluate(cases, SEMANTIC_ONLY)
  const noDiffusion = evaluate(cases, NO_DIFFUSION)
  const hybrid = evaluate(cases)

  const delta = (a: number, b: number) => {
    const d = (b - a) * 100
    return `${d >= 0 ? '+' : ''}${d.toFixed(1)}pt`.padStart(8)
  }

  console.log(`\n${label} — ${cases.length} cases`)
  console.log('              BM25 only  latent only   hybrid   +related    delta')
  const row = (name: string, pick: (m: Metrics) => number) =>
    console.log(
      `  ${name.padEnd(12)}${pct(pick(lexical))}       ${pct(pick(semantic))}   ${pct(pick(noDiffusion))}   ${pct(pick(hybrid))}  ${delta(pick(lexical), pick(hybrid))}`,
    )
  row('recall@1', (m) => m.recallAt1)
  row('recall@3', (m) => m.recallAt3)
  row('recall@5', (m) => m.recallAt5)
  row('MRR', (m) => m.mrr)

  if (hybrid.misses.length) {
    console.log(`\n  still missing from the top 5 (${hybrid.misses.length}):`)
    for (const m of hybrid.misses) {
      console.log(`    "${m.query}"`)
      console.log(`      wanted ${m.expect.join(' | ')}  ·  got ${m.got.join(', ')}`)
    }
  }
}

describe('relevancy', () => {
  it('reports retrieval quality', () => {
    report('Tuning cases (ranking was fitted to these)', TUNING_CASES)
    report('Held-out cases (written after the fact, no weight tuned on them)', HELD_OUT_CASES)
    console.log('')
  })
})
