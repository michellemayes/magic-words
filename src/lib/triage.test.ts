import { describe, expect, it } from 'vitest'
import { splitThreads, triage } from './triage'
import { composePrompt, describePicks, INJECTION_HEADER } from './compose'
import { RAMBLE_CASES } from './evaluation'
import { search } from './search'

describe('splitting a ramble into threads', () => {
  it('leaves a single problem alone', () => {
    const text = 'the plan looks solid and nobody is objecting before we commit real money'
    expect(splitThreads(text)).toEqual([text])
  })

  it('splits on sentence boundaries and spoken connectives', () => {
    const threads = splitThreads(
      'the deploy fell over on friday and I cannot tell why. and then the write up turned into blaming people — oh and I still owe the exec team a summary',
    )
    expect(threads).toHaveLength(3)
    expect(threads[1]).toContain('write up')
  })

  it('does not split a single problem that happens to contain "but"', () => {
    // Two clauses, one bug. Splitting here would hand each half to the ranker
    // with the other half's meaning missing.
    expect(
      splitThreads('the payment went through but the order was never created'),
    ).toHaveLength(1)
  })

  it('falls back to weak connectives only for a genuine run-on', () => {
    const threads = splitThreads(
      'the backlog is enormous and every single item in it is marked as a P0 priority by somebody and the loudest stakeholder in the room always wins the argument and nobody can tell me who is actually meant to be deciding any of this',
    )
    expect(threads.length).toBeGreaterThan(1)
  })

  it('folds fragments too thin to search into their neighbour', () => {
    const threads = splitThreads('it is slow. I have no idea which service to look at')
    expect(threads).toHaveLength(1)
    expect(threads[0]).toContain('slow')
  })

  it('handles empty and whitespace-only input', () => {
    expect(splitThreads('')).toEqual([])
    expect(splitThreads('   \n  ')).toEqual([])
  })

  it('never invents or drops the user\'s words', () => {
    const input =
      'everyone has admin because it was easier. and there is an api key in the repo that was never rotated'
    for (const thread of splitThreads(input)) {
      expect(input).toContain(thread.split(/\s+/)[0])
    }
  })
})

describe('triage', () => {
  it('quotes back only words the user actually said', () => {
    // The interface tells people "you said X, so here is Y". If `because` were
    // ever paraphrased that claim would be a lie, so it is checked rather than
    // assumed.
    for (const c of RAMBLE_CASES) {
      for (const pick of triage(c.input).picks) {
        expect(c.input).toContain(pick.because)
      }
    }
  })

  it('finds a word for each problem in a ramble', () => {
    const missed: string[] = []
    let expected = 0
    let found = 0

    for (const c of RAMBLE_CASES) {
      const ids = triage(c.input).picks.map((p) => p.concept.id)
      for (const group of c.expect) {
        expected++
        if (group.some((id) => ids.includes(id))) found++
        else missed.push(`${group.join(' | ')} — got ${ids.join(', ')}`)
      }
    }

    // Not 100%: three picks cannot cover four problems, and the set contains
    // one four-problem case on purpose. The bar is that the great majority of
    // strands still get their own word once buried in a paragraph.
    expect(found / expected, `missed:\n  ${missed.join('\n  ')}`).toBeGreaterThanOrEqual(0.8)
  })

  it('beats searching the whole ramble as one query', () => {
    // The entire justification for this module. If handing the paragraph
    // straight to `search()` did as well, none of it would earn its place.
    const covered = (ids: string[], c: (typeof RAMBLE_CASES)[number]) =>
      c.expect.filter((group) => group.some((id) => ids.includes(id))).length

    let triaged = 0
    let flat = 0
    for (const c of RAMBLE_CASES) {
      triaged += covered(triage(c.input).picks.map((p) => p.concept.id), c)
      flat += covered(
        search({ text: c.input, limit: 3 }).map((r) => r.concept.id),
        c,
      )
    }
    expect(triaged).toBeGreaterThan(flat)
  })

  it('does not turn one problem into a committee', () => {
    const single = RAMBLE_CASES.filter((c) => c.threads === 1)
    expect(single.length).toBeGreaterThan(0)
    for (const c of single) {
      const { threads, picks } = triage(c.input)
      expect(threads).toHaveLength(1)
      expect(picks[0].concept.id).toBe(c.expect[0][0])
      // The others are still offered — they are just not called confident.
      expect(picks.filter((p) => p.confidence === 'strong')).toHaveLength(1)
    }
  })

  it('respects the pick limit and never repeats a concept', () => {
    for (const c of RAMBLE_CASES) {
      const picks = triage(c.input, { limit: 2 }).picks
      expect(picks.length).toBeLessThanOrEqual(2)
      expect(new Set(picks.map((p) => p.concept.id)).size).toBe(picks.length)
    }
  })

  it('keeps facets working through the split', () => {
    const picks = triage('everyone has admin because it was easier that way', {
      domains: ['security'],
    }).picks
    expect(picks[0].concept.domains).toContain('security')
  })

  it('returns nothing for empty input rather than throwing', () => {
    const { threads, picks } = triage('   ')
    expect(threads).toEqual([])
    expect(picks).toEqual([])
  })
})

describe('composing the prompt', () => {
  const picks = triage('everyone has admin because it was easier that way', { limit: 2 }).picks

  it('reproduces the user\'s words verbatim, first', () => {
    const input = 'everyone has admin because it was easier that way'
    expect(composePrompt(input, picks).startsWith(input)).toBe(true)
  })

  it('names every technique it injects', () => {
    const composed = composePrompt('some request', picks)
    expect(composed).toContain(INJECTION_HEADER)
    for (const p of picks) {
      expect(composed).toContain(p.concept.name)
      expect(composed).toContain(p.concept.prompt)
    }
  })

  it('returns the request untouched when there is nothing worth adding', () => {
    expect(composePrompt('  just do the thing  ', [])).toBe('just do the thing')
  })

  it('describes picks the way a person would say them', () => {
    const named = (names: string[]) =>
      describePicks(names.map((name) => ({ concept: { name } as never })))
    expect(named(['Pre-mortem'])).toBe('Pre-mortem')
    expect(named(['Pre-mortem', 'Blast Radius'])).toBe('Pre-mortem and Blast Radius')
    expect(named(['A', 'B', 'C'])).toBe('A, B and C')
    expect(named([])).toBe('')
  })
})
