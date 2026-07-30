import { describe, expect, it } from 'vitest'
import { CONCEPTS, CONCEPTS_BY_ID } from '../data/concepts'
import { DOMAINS, INTENTS } from '../data/types'
import { tokenize } from './text'

describe('corpus integrity', () => {
  it('has a substantial number of concepts', () => {
    expect(CONCEPTS.length).toBeGreaterThanOrEqual(60)
  })

  it('has unique ids', () => {
    const ids = CONCEPTS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('uses kebab-case ids', () => {
    for (const c of CONCEPTS) {
      expect(c.id, c.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('has unique names', () => {
    const names = CONCEPTS.map((c) => c.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
  })

  it('resolves every related id, with no self-references', () => {
    for (const c of CONCEPTS) {
      for (const id of c.related) {
        expect(CONCEPTS_BY_ID.has(id), `${c.id} -> ${id}`).toBe(true)
        expect(id, `${c.id} references itself`).not.toBe(c.id)
      }
      expect(new Set(c.related).size, `${c.id} has duplicate related ids`).toBe(c.related.length)
    }
  })

  it('gives every concept the fields the UI renders', () => {
    for (const c of CONCEPTS) {
      expect(c.name.length, c.id).toBeGreaterThan(2)
      expect(c.oneLiner.length, c.id).toBeGreaterThan(40)
      expect(c.why.length, c.id).toBeGreaterThan(40)
      expect(c.domains.length, c.id).toBeGreaterThan(0)
      expect(c.intents.length, c.id).toBeGreaterThan(0)
      expect(c.related.length, c.id).toBeGreaterThan(0)
      expect(c.tags.length, c.id).toBeGreaterThanOrEqual(3)
    }
  })

  it('gives every concept enough symptom phrases to be findable', () => {
    for (const c of CONCEPTS) {
      expect(c.useWhen.length, c.id).toBeGreaterThanOrEqual(4)
      for (const u of c.useWhen) {
        expect(u.length, `${c.id}: "${u}"`).toBeGreaterThan(10)
        // Symptoms are what the user says before they know the concept, so they
        // must not be phrased in the concept's own vocabulary.
        expect(u.toLowerCase(), c.id).not.toContain(c.name.toLowerCase())
      }
    }
  })

  it('gives every concept a prompt substantial enough to be worth copying', () => {
    for (const c of CONCEPTS) {
      expect(c.prompt.length, c.id).toBeGreaterThan(200)
      expect(c.prompt.length, `${c.id} prompt is too long to paste comfortably`).toBeLessThan(1400)
      for (const v of c.variants ?? []) {
        expect(v.prompt.length, `${c.id}/${v.label}`).toBeGreaterThan(80)
        expect(v.label.length, `${c.id}/${v.label}`).toBeGreaterThan(5)
      }
    }
  })

  it('uses only known domains and intents', () => {
    for (const c of CONCEPTS) {
      for (const d of c.domains) expect(DOMAINS, c.id).toContain(d)
      for (const i of c.intents) expect(INTENTS, c.id).toContain(i)
    }
  })

  it('covers every domain and every intent', () => {
    for (const d of DOMAINS) {
      expect(CONCEPTS.filter((c) => c.domains.includes(d)).length, d).toBeGreaterThanOrEqual(3)
    }
    for (const i of INTENTS) {
      expect(CONCEPTS.filter((c) => c.intents.includes(i)).length, i).toBeGreaterThanOrEqual(3)
    }
  })

  it('produces indexable tokens for every concept name', () => {
    for (const c of CONCEPTS) {
      expect(tokenize(c.name).length, c.id).toBeGreaterThan(0)
    }
  })
})
