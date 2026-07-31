/**
 * Tuning grid. `npm run bench` runs this alongside the relevancy report.
 *
 * Every constant in DEFAULT_TUNING came out of this. Re-run it after adding a
 * batch of concepts — the corpus is small enough that a dozen new entries can
 * move where the optimum sits, and the numbers below are the only way to know.
 *
 * Read the two halves of each row together. A configuration that gains on the
 * held-out cases while losing on the tuning cases has usually just traded one
 * kind of query for another rather than improving anything.
 */
import { describe, it } from 'vitest'
import { DEFAULT_TUNING, search, type Tuning } from './search'
import { HELD_OUT_CASES, TUNING_CASES, type RetrievalCase } from './evaluation'

function score(cases: RetrievalCase[], tuning: Partial<Tuning>) {
  let at1 = 0
  let at3 = 0
  let at5 = 0
  let rr = 0
  for (const c of cases) {
    const got = search({ text: c.query, limit: 8, tuning }).map((r) => r.concept.id)
    const rank = got.findIndex((id) => c.expect.includes(id))
    if (rank === 0) at1++
    if (rank >= 0 && rank < 3) at3++
    if (rank >= 0 && rank < 5) at5++
    if (rank >= 0) rr += 1 / (rank + 1)
  }
  const n = cases.length
  return { at1: at1 / n, at3: at3 / n, at5: at5 / n, mrr: rr / n }
}

const p = (x: number) => (x * 100).toFixed(1).padStart(5)

function line(label: string, tuning: Partial<Tuning>) {
  const held = score(HELD_OUT_CASES, tuning)
  const tune = score(TUNING_CASES, tuning)
  console.log(
    `${label.padEnd(34)} held @1 ${p(held.at1)} @3 ${p(held.at3)} @5 ${p(held.at5)} mrr ${p(held.mrr)}` +
      `  |  tune @1 ${p(tune.at1)} mrr ${p(tune.mrr)}`,
  )
}

describe('tuning grid', () => {
  it('sweeps each knob around the shipping configuration', () => {
    console.log('\n--- shipping configuration ---')
    line('  default', {})

    console.log('\n--- latent dimensions ---')
    for (const semanticDims of [24, 48, 64, 80, 96, 118]) line(`  dims ${semanticDims}`, { semanticDims })

    console.log('\n--- semantic weight (0 = BM25 only) ---')
    for (const semanticWeight of [0, 0.5, 1, 1.5, 2, 2.5, 3, 4]) line(`  weight ${semanticWeight}`, { semanticWeight })

    console.log('\n--- related-graph diffusion ---')
    for (const relatedDiffusion of [0, 0.15, 0.25, 0.35, 0.5, 0.7]) line(`  diffusion ${relatedDiffusion}`, { relatedDiffusion })

    console.log('\n--- diversity strength ---')
    for (const diversityStrength of [0, 0.1, 0.2, 0.35, 0.5]) line(`  diversity ${diversityStrength}`, { diversityStrength })

    console.log(`\ndefaults: ${JSON.stringify(DEFAULT_TUNING)}\n`)
  }, 600_000)
})
