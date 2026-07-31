import { describe, expect, it } from 'vitest'
import { buildSemanticSpace } from './embeddings'
import { tokenize } from './text'

/**
 * A tiny corpus with two obvious themes and no vocabulary shared between them.
 * "leak" and "rotate" never co-occur with "sprint" or "backlog", so anything
 * the space learns about them has to come from the documents.
 */
function corpus(): Map<string, number>[] {
  const documents = [
    'a credential leaked and nobody rotated the key afterwards',
    'rotate every secret on a schedule so a leak stops mattering',
    'the api key was committed to the repository and never rotated',
    'the sprint backlog is full and everything is labelled urgent',
    'we plan the sprint by arguing about the backlog until it is full',
    'ranking the backlog needs a score rather than the loudest voice',
  ]
  return documents.map((d) => {
    const tf = new Map<string, number>()
    for (const t of tokenize(d)) tf.set(t, (tf.get(t) ?? 0) + 1)
    return tf
  })
}

describe('semantic space', () => {
  it('places a query nearest the documents that share its subject', () => {
    const space = buildSemanticSpace(corpus(), 4)
    const vector = space.fold(tokenize('our secrets were exposed'))!
    const scores = corpus().map((_, i) => space.similarity(vector, i))

    const secrets = Math.max(scores[0], scores[1], scores[2])
    const planning = Math.max(scores[3], scores[4], scores[5])
    expect(secrets).toBeGreaterThan(planning)
  })

  it('bridges vocabulary the query never uses', () => {
    // "rotate" appears in the corpus but not in this query; the query's own
    // words pull it toward the documents that talk about rotation anyway.
    const space = buildSemanticSpace(corpus(), 4)
    const vector = space.fold(tokenize('a key leaked'))!
    expect(space.similarity(vector, 1)).toBeGreaterThan(0.2)
  })

  it('has no opinion about a query made entirely of unknown words', () => {
    const space = buildSemanticSpace(corpus(), 4)
    expect(space.fold(tokenize('zzzqqxv wgrblfx'))).toBeNull()
    expect(space.fold([])).toBeNull()
  })

  it('is deterministic, so rankings do not drift between page loads', () => {
    const a = buildSemanticSpace(corpus(), 4)
    const b = buildSemanticSpace(corpus(), 4)
    const query = tokenize('rotate the leaked credential')
    for (let i = 0; i < 6; i++) {
      expect(a.similarity(a.fold(query)!, i)).toBe(b.similarity(b.fold(query)!, i))
    }
  })

  it('reconstructs a document from its own terms', () => {
    const documents = corpus()
    const space = buildSemanticSpace(documents, 6)
    for (let i = 0; i < documents.length; i++) {
      const self = space.fold(documents[i].keys())!
      expect(space.similarity(self, i), `document ${i}`).toBeGreaterThan(0.5)
    }
  })

  it('never keeps more dimensions than there are documents', () => {
    expect(buildSemanticSpace(corpus(), 500).dims).toBeLessThanOrEqual(6)
    expect(buildSemanticSpace(corpus(), 3).dims).toBe(3)
  })

  it('finds the terms that keep company with a term', () => {
    const space = buildSemanticSpace(corpus(), 4)
    const near = space.neighbours('leak', 6).map((n) => n.term)
    expect(near).toContain(tokenize('rotated')[0])
    expect(near).not.toContain(tokenize('backlog')[0])
  })
})
