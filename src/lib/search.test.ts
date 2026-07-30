import { describe, expect, it } from 'vitest'
import { search } from './search'
import { stem, tokenize } from './text'

const ids = (text: string, opts: Parameters<typeof search>[0] extends never ? never : object = {}) =>
  search({ text, limit: 8, ...opts }).map((r) => r.concept.id)

/**
 * The retrieval bar: a person describes a problem in their own words, without
 * knowing the name of the thing that solves it, and the thing comes back.
 */
const CASES: { query: string; expect: string; within?: number }[] = [
  { query: 'my problem statement is too narrow and we jumped straight to a solution', expect: 'abstraction-laddering' },
  { query: 'we keep fixing the same thing over and over and it comes back', expect: 'five-whys' },
  { query: 'this old code looks useless and I want to delete it but I am nervous', expect: 'chestertons-fence' },
  { query: 'the plan looks solid and nobody is objecting before we commit real money', expect: 'pre-mortem' },
  { query: 'everything in the backlog is labelled P0 and the loudest stakeholder wins', expect: 'rice-scoring' },
  { query: 'my emails are too long and busy people ignore them', expect: 'bluf' },
  { query: 'the answers I get are generic and could apply to anyone', expect: 'interview-me-first' },
  { query: 'the site is slow and I have no idea which service to look at', expect: 'observability-triage' },
  { query: 'I need to give a colleague difficult feedback without it getting personal', expect: 'sbi-feedback' },
  { query: 'I have been changing random things hoping the bug goes away', expect: 'hypothesis-driven-debugging' },
  { query: 'it used to work last week and now it does not', expect: 'binary-search-debugging' },
  { query: 'we need to cut scope to hit the date but the client says everything is essential', expect: 'moscow' },
  { query: 'users asked for a feature but I do not know what they actually want', expect: 'jobs-to-be-done' },
  { query: 'how do I remember what I read instead of forgetting it immediately', expect: 'active-recall' },
  { query: 'I think I understand this but I cannot explain it to anyone', expect: 'feynman-technique' },
  { query: 'we are setting a new KPI and I am worried the team will game it', expect: 'goodharts-law' },
  { query: 'our estimate feels optimistic we always run over on time', expect: 'reference-class-forecasting' },
  { query: 'the document buries the point and executives stop reading', expect: 'pyramid-principle' },
  { query: 'everything it writes sounds the same and reads bland', expect: 'constraint-stacking' },
  { query: 'it wrote three thousand words with the wrong structure', expect: 'progressive-disclosure' },
  { query: 'should we build this ourselves or buy it, where is our differentiation', expect: 'wardley-mapping' },
  { query: 'the metric is flat but I think something is happening underneath', expect: 'cohort-analysis' },
  { query: 'users drop off somewhere in the flow and I cannot tell where', expect: 'user-journey-mapping' },
  { query: 'I only have one idea and it is the obvious one', expect: 'crazy-eights' },
  { query: 'this decision keeps coming back up and nobody knows who decides', expect: 'decision-roles-daci' },
  { query: 'I am busy all day and never get to the important work', expect: 'eisenhower-matrix' },
  { query: 'preparing for a job interview and my answers ramble', expect: 'star-method' },
  { query: 'where do I even start building this, integration always breaks late', expect: 'walking-skeleton' },
  { query: 'the agent keeps editing the wrong files and ignoring our conventions', expect: 'context-priming' },
  { query: 'I need a rough market size and I have no data at all', expect: 'fermi-estimation' },
]

describe('retrieval quality', () => {
  for (const c of CASES) {
    const within = c.within ?? 5
    it(`"${c.query.slice(0, 52)}…" surfaces ${c.expect}`, () => {
      const top = ids(c.query).slice(0, within)
      expect(top, `got: ${top.join(', ')}`).toContain(c.expect)
    })
  }
})

describe('search behaviour', () => {
  it('ranks an exact concept name first', () => {
    expect(ids('abstraction laddering')[0]).toBe('abstraction-laddering')
    expect(ids('what is a pre-mortem')[0]).toBe('pre-mortem')
    expect(ids('tell me about jobs to be done')[0]).toBe('jobs-to-be-done')
  })

  it('finds a concept by an alias rather than its formal name', () => {
    expect(ids('rubber ducking')[0]).toBe('rubber-duck-debugging')
    expect(ids('bottom line up front')[0]).toBe('bluf')
    expect(ids('5 whys')[0]).toBe('five-whys')
  })

  it('marks exact name matches so the UI can say so', () => {
    const [first] = search({ text: 'red teaming', limit: 3 })
    expect(first.concept.id).toBe('red-teaming')
    expect(first.exactNameMatch).toBe(true)

    const vague = search({ text: 'I am stuck on something', limit: 3 })
    expect(vague.every((r) => !r.exactNameMatch)).toBe(true)
  })

  it('lets facets rank the corpus when there is no problem text', () => {
    const results = search({ text: '', domains: ['design'], intents: ['critique'], limit: 6 })
    expect(results.length).toBe(6)
    // Everything at the top should satisfy both facets.
    for (const r of results.slice(0, 3)) {
      expect(r.concept.domains).toContain('design')
      expect(r.concept.intents).toContain('critique')
    }
  })

  it('uses facets to disambiguate identical wording', () => {
    const text = 'I need to critique this and find the problems'
    const design = search({ text, domains: ['design'], limit: 5 }).map((r) => r.concept.id)
    const engineering = search({ text, domains: ['engineering'], limit: 5 }).map((r) => r.concept.id)
    expect(design).not.toEqual(engineering)
  })

  it('does not let facets hard-exclude a strong text match', () => {
    // Wrong domain on purpose; the named concept should still be reachable.
    const results = search({ text: 'abstraction laddering', domains: ['data'], limit: 5 })
    expect(results[0].concept.id).toBe('abstraction-laddering')
  })

  it('returns diverse results rather than one family', () => {
    const results = search({ text: 'the plan might fail and I want to find the risks', limit: 6 })
    const primaryTags = results.map((r) => r.concept.tags[0])
    expect(new Set(primaryTags).size).toBeGreaterThan(2)
  })

  it('reports matches as the words the user actually typed, not stems', () => {
    const text = 'we had an outage and need to write up the postmortem'
    const [first] = search({ text, limit: 3 })
    expect(first.matchedTerms.length).toBeGreaterThan(0)
    const typed = text.toLowerCase().split(/\W+/)
    for (const term of first.matchedTerms) {
      expect(typed, `"${term}" is not a word the user typed`).toContain(term)
    }
  })

  it('respects the limit and returns nothing for gibberish', () => {
    expect(search({ text: 'anything at all', limit: 3 }).length).toBeLessThanOrEqual(3)
    expect(search({ text: 'zzzqqxv wgrblfx', limit: 5 })).toEqual([])
  })

  it('is stable across repeated identical queries', () => {
    const a = ids('how do I prioritise a messy roadmap')
    const b = ids('how do I prioritise a messy roadmap')
    expect(a).toEqual(b)
  })
})

describe('text normalisation', () => {
  it('normalises British and American spellings to the same token', () => {
    expect(tokenize('prioritise')).toEqual(tokenize('prioritize'))
    expect(tokenize('behaviour')).toEqual(tokenize('behavior'))
    expect(tokenize('analyse the organisation')).toEqual(tokenize('analyze the organization'))
  })

  it('stems inflections together', () => {
    expect(stem('debugging')).toBe(stem('debugged'))
    expect(stem('estimates')).toBe(stem('estimate'))
    expect(stem('prioritizing')).toBe(stem('prioritized'))
  })

  it('drops stopwords but keeps meaningful short words', () => {
    expect(tokenize('the plan is a mess')).toEqual(['plan', 'mess'])
    expect(tokenize('is my UX bad')).toContain('ux')
  })

  it('finds the same concept whichever spelling is used', () => {
    expect(ids('how do I prioritise the backlog')[0]).toBe(ids('how do I prioritize the backlog')[0])
  })
})
