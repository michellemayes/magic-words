/**
 * Triage benchmark. Runs as part of `npm run bench`.
 *
 * Two questions, neither of which retrieval quality answers on its own.
 *
 * **Does splitting help?** A ramble is scored against the same input handed to
 * `search()` whole. If cutting it up did not cover more of the problems in it,
 * this module is elaborate packaging around one query and should be deleted.
 *
 * **Where does confidence start?** `triage()` labels a pick `strong` or
 * `tentative`, and the site and the skill both act on that label — a strong
 * pick gets injected into someone's request without being asked. So the
 * threshold is swept here against every case in the evaluation set, and the
 * value in `triage.ts` is the one these numbers chose. Precision is what
 * matters at the top of the sweep; coverage is what you pay for it.
 */

import { describe, it } from 'vitest'
import { search } from './search'
import { splitThreads, triage, type TriageTuning } from './triage'
import { HELD_OUT_CASES, RAMBLE_CASES, TUNING_CASES } from './evaluation'

const pct = (x: number) => `${(x * 100).toFixed(1)}%`.padStart(6)

/** How many of a ramble's problems got a word of their own. */
function coverage(ids: string[], expect: string[][]): number {
  return expect.filter((group) => group.some((id) => ids.includes(id))).length
}

function rambleCoverage(tuning: Partial<TriageTuning> = {}): {
  found: number
  total: number
  /** Rambles whose leading pick answers one of the problems in it. */
  leadRight: number
} {
  let found = 0
  let total = 0
  let leadRight = 0
  for (const c of RAMBLE_CASES) {
    total += c.expect.length
    const ids = triage(c.input, { tuning }).picks.map((p) => p.concept.id)
    found += coverage(ids, c.expect)
    if (c.expect.some((group) => group.includes(ids[0]))) leadRight++
  }
  return { found, total, leadRight }
}

describe('triage', () => {
  it('reports splitting, merging and confidence', () => {
    console.log('\nStream-of-consciousness triage')

    // --- Splitting earns its place, or it does not ---------------------------
    let flat = 0
    let flatTop1 = 0
    let total = 0
    for (const c of RAMBLE_CASES) {
      total += c.expect.length
      const ids = search({ text: c.input, limit: 3 }).map((r) => r.concept.id)
      flat += coverage(ids, c.expect)
      flatTop1 += coverage(ids.slice(0, 1), c.expect)
    }
    const triaged = rambleCoverage()

    console.log(`\n  ${RAMBLE_CASES.length} rambles, ${total} problems in them`)
    console.log(`    one query, top 1        ${`${flatTop1}/${total}`.padStart(7)}  ${pct(flatTop1 / total)}`)
    console.log(`    one query, top 3        ${`${flat}/${total}`.padStart(7)}  ${pct(flat / total)}`)
    console.log(`    triaged, top 3          ${`${triaged.found}/${total}`.padStart(7)}  ${pct(triaged.found / total)}`)

    // --- The whole-input correction -----------------------------------------
    //
    // A thread is a short query, and short queries score higher against the
    // ideal lexical ceiling than long ones do, so the merge needs to know how
    // much to trust the reading of the whole paragraph against the readings of
    // its parts. Coverage answers one half of that and which pick leads
    // answers the other.
    console.log('\n  whole-input weight (0 = threads only, high = never split)')
    console.log('    weight   problems covered   leads with a right answer')
    for (const w of [0, 0.8, 1, 1.15, 1.35, 1.6, 2, 3]) {
      const c = rambleCoverage({ wholeInputWeight: w })
      console.log(
        `    ${String(w).padEnd(9)}${`${c.found}/${c.total}`.padStart(7)}  ${pct(c.found / c.total)}      ${`${c.leadRight}/${RAMBLE_CASES.length}`.padStart(6)}  ${pct(c.leadRight / RAMBLE_CASES.length)}`,
      )
    }

    // --- What separates a confident pick from a guess -----------------------
    //
    // Scored on the single-problem cases, where "was the top pick right" has an
    // unambiguous answer. Two candidate signals: the merged score, and the
    // lexical evidence behind it (`looseMatch` — the user's words barely appear
    // in the concept at all, so the latent space is carrying the result alone).
    const singles = [...TUNING_CASES, ...HELD_OUT_CASES]
    const scored = singles.map((c) => {
      const [top] = triage(c.query, { limit: 1 }).picks
      return {
        score: top?.score ?? 0,
        loose: !top || top.confidence === 'tentative',
        correct: !!top && c.expect.includes(top.concept.id),
      }
    })
    const baseline = scored.filter((s) => s.correct).length / scored.length

    console.log(`\n  confidence, ${singles.length} single-problem cases · baseline ${pct(baseline).trim()} right`)
    const confident = scored.filter((s) => !s.loose)
    const loose = scored.filter((s) => s.loose)
    const share = (group: typeof scored) =>
      `${pct(group.length / scored.length)} of picks, ${pct(group.length ? group.filter((s) => s.correct).length / group.length : 0)} right`
    console.log(`    lexical evidence  strong     ${share(confident)}`)
    console.log(`                      tentative  ${share(loose)}`)

    console.log('\n    a score threshold instead, and the two together')
    console.log('      cutoff   score alone            score and lexical')
    for (const cutoff of [0.6, 0.9, 1.05, 1.4, 1.7, 2, 2.4]) {
      const row = (group: typeof scored) =>
        `${pct(group.length / scored.length)} of picks, ${pct(group.length ? group.filter((s) => s.correct).length / group.length : 0)} right`
      console.log(
        `      ${String(cutoff).padEnd(9)}${row(scored.filter((s) => s.score >= cutoff))}   ${row(scored.filter((s) => s.score >= cutoff && !s.loose))}`,
      )
    }

    // --- What the splitter actually does to real input ----------------------
    console.log('\n  threads per ramble')
    for (const c of RAMBLE_CASES) {
      const threads = splitThreads(c.input)
      const ids = triage(c.input).picks.map((p) => p.concept.id)
      const got = coverage(ids, c.expect)
      console.log(
        `    ${String(threads.length).padStart(2)} threads  ${got}/${c.expect.length} problems  "${c.input.slice(0, 58)}…"`,
      )
      if (got < c.expect.length) {
        const missing = c.expect.filter((g) => !g.some((id) => ids.includes(id)))
        console.log(`        missed ${missing.map((g) => g.join('|')).join(', ')}  ·  got ${ids.join(', ')}`)
      }
    }
    console.log('')
  })
})
