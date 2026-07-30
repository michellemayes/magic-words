/**
 * Retrieval over the concept corpus.
 *
 * BM25 over a weighted-field index, plus facet boosting from the form answers
 * and a light diversity pass so the top results are not five members of the
 * same family. Everything runs in the browser against ~90 documents, so the
 * whole index is built once at module load and there is no server.
 */

import type { Concept, Domain, Intent } from '../data/types'
import { CONCEPTS } from '../data/concepts'
import { DOMAIN_LABELS, INTENT_LABELS } from '../data/types'
import { expand, tokenize, tokenizeDetailed } from './text'

export interface Query {
  /** The user's own description of their problem. */
  text: string
  domains?: Domain[]
  intents?: Intent[]
  limit?: number
}

export interface Result {
  concept: Concept
  score: number
  /** Original query words that contributed most, for "matched on…" chips. */
  matchedTerms: string[]
  /** True when the query literally names the concept or one of its aliases. */
  exactNameMatch: boolean
}

/** Field weights. `useWhen` carries the symptom language people actually type. */
const FIELD_WEIGHTS = {
  name: 7,
  aka: 5.5,
  useWhen: 4,
  tags: 3,
  oneLiner: 2.2,
  facets: 1.6,
  variantLabels: 1.2,
  why: 1,
  origin: 0.9,
  prompt: 0.6,
  watchOut: 0.5,
} as const

const K1 = 1.2
const B = 0.6
/** Expansion terms are inferred, not stated, so they score lower. */
const EXPANSION_WEIGHT = 0.4
const PHRASE_BONUS = 14
const ALIAS_PHRASE_BONUS = 10

interface Doc {
  concept: Concept
  /** term -> weighted frequency */
  tf: Map<string, number>
  length: number
  /** Lowercased name + aliases, for substring phrase matching. */
  phrases: string[]
  tagSet: Set<string>
}

function addField(tf: Map<string, number>, text: string, weight: number): number {
  let added = 0
  for (const term of tokenize(text)) {
    tf.set(term, (tf.get(term) ?? 0) + weight)
    added += weight
  }
  return added
}

function buildDoc(concept: Concept): Doc {
  const tf = new Map<string, number>()
  let length = 0

  length += addField(tf, concept.name, FIELD_WEIGHTS.name)
  for (const a of concept.aka ?? []) length += addField(tf, a, FIELD_WEIGHTS.aka)
  for (const u of concept.useWhen) length += addField(tf, u, FIELD_WEIGHTS.useWhen)
  for (const t of concept.tags) length += addField(tf, t, FIELD_WEIGHTS.tags)
  length += addField(tf, concept.oneLiner, FIELD_WEIGHTS.oneLiner)
  for (const d of concept.domains) length += addField(tf, DOMAIN_LABELS[d], FIELD_WEIGHTS.facets)
  for (const i of concept.intents) length += addField(tf, INTENT_LABELS[i], FIELD_WEIGHTS.facets)
  for (const v of concept.variants ?? []) length += addField(tf, v.label, FIELD_WEIGHTS.variantLabels)
  length += addField(tf, concept.why, FIELD_WEIGHTS.why)
  if (concept.origin) length += addField(tf, concept.origin, FIELD_WEIGHTS.origin)
  length += addField(tf, concept.prompt, FIELD_WEIGHTS.prompt)
  if (concept.watchOut) length += addField(tf, concept.watchOut, FIELD_WEIGHTS.watchOut)

  return {
    concept,
    tf,
    length,
    phrases: [concept.name, ...(concept.aka ?? [])].map((p) => p.toLowerCase()),
    tagSet: new Set(concept.tags),
  }
}

class Index {
  readonly docs: Doc[]
  private readonly df = new Map<string, number>()
  private readonly avgLength: number

  constructor(concepts: Concept[]) {
    this.docs = concepts.map(buildDoc)
    for (const doc of this.docs) {
      for (const term of doc.tf.keys()) {
        this.df.set(term, (this.df.get(term) ?? 0) + 1)
      }
    }
    const total = this.docs.reduce((sum, d) => sum + d.length, 0)
    this.avgLength = this.docs.length ? total / this.docs.length : 1
  }

  idf(term: string): number {
    const n = this.docs.length
    const df = this.df.get(term) ?? 0
    return Math.log(1 + (n - df + 0.5) / (df + 0.5))
  }

  /** BM25 contribution of one term to one document. */
  termScore(doc: Doc, term: string): number {
    const f = doc.tf.get(term)
    if (!f) return 0
    const norm = 1 - B + (B * doc.length) / this.avgLength
    return this.idf(term) * ((f * (K1 + 1)) / (f + K1 * norm))
  }
}

const INDEX = new Index(CONCEPTS)

/** Facet agreement multiplier. Absent facets neither help nor hurt. */
function facetMultiplier(concept: Concept, query: Query): number {
  let m = 1
  if (query.domains?.length) {
    m *= query.domains.some((d) => concept.domains.includes(d)) ? 1.5 : 0.82
  }
  if (query.intents?.length) {
    m *= query.intents.some((i) => concept.intents.includes(i)) ? 1.45 : 0.84
  }
  return m
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0
  let shared = 0
  for (const x of a) if (b.has(x)) shared++
  return shared / (a.size + b.size - shared)
}

/**
 * Reorder by relevance discounted by similarity to already-picked results, so
 * the list spans approaches rather than repeating one family.
 */
function diversify(scored: { doc: Doc; score: number }[], limit: number) {
  const picked: { doc: Doc; score: number }[] = []
  const pool = [...scored]
  while (picked.length < limit && pool.length) {
    let bestIdx = 0
    let bestValue = -Infinity
    for (let i = 0; i < pool.length; i++) {
      const overlap = picked.reduce(
        (max, p) => Math.max(max, jaccard(pool[i].doc.tagSet, p.doc.tagSet)),
        0,
      )
      const value = pool[i].score * (1 - 0.35 * overlap)
      if (value > bestValue) {
        bestValue = value
        bestIdx = i
      }
    }
    picked.push(pool.splice(bestIdx, 1)[0])
  }
  return picked
}

export function search(query: Query): Result[] {
  const limit = query.limit ?? 8
  const raw = query.text.trim().toLowerCase()
  const detailed = tokenizeDetailed(query.text)
  const literal = detailed.map((t) => t.term)
  const expanded = expand(literal)
  const hasText = literal.length > 0

  // Stemmed terms are unreadable ("lik", "prd"), so quote the user's own words back.
  const spoken = new Map<string, string>()
  for (const t of detailed) if (!spoken.has(t.term)) spoken.set(t.term, t.original)

  const scored = INDEX.docs.map((doc) => {
    let score = 0
    const contributions: { term: string; value: number }[] = []

    for (const term of literal) {
      const value = INDEX.termScore(doc, term)
      if (value > 0) contributions.push({ term, value })
      score += value
    }
    for (const term of expanded) {
      score += INDEX.termScore(doc, term) * EXPANSION_WEIGHT
    }

    // Someone who types the concept's name wants that concept, full stop.
    let exactNameMatch = false
    if (raw.length > 2) {
      for (let i = 0; i < doc.phrases.length; i++) {
        if (raw.includes(doc.phrases[i])) {
          score += i === 0 ? PHRASE_BONUS : ALIAS_PHRASE_BONUS
          exactNameMatch = true
          break
        }
      }
    }

    // With no text at all the facets are the entire query.
    if (!hasText) score = 1

    score *= facetMultiplier(doc.concept, query)

    contributions.sort((a, b) => b.value - a.value)
    // Only the terms that actually carried the match; the long tail is noise.
    const cutoff = (contributions[0]?.value ?? 0) * 0.3
    return {
      doc,
      score,
      exactNameMatch,
      matchedTerms: contributions
        .filter((c) => c.value >= cutoff)
        .slice(0, 4)
        .map((c) => spoken.get(c.term) ?? c.term),
    }
  })

  const ranked = scored
    .filter((s) => s.score > 0.01)
    .sort((a, b) => b.score - a.score || a.doc.concept.name.localeCompare(b.doc.concept.name))

  // An exact name match is an answer, not a candidate — never let diversity move it.
  const pinned = ranked.filter((r) => r.exactNameMatch).slice(0, 1)
  const rest = ranked.filter((r) => !pinned.includes(r))
  const diversified = diversify(rest, Math.max(0, limit - pinned.length))

  return [...pinned, ...diversified].map((s) => {
    const full = ranked.find((r) => r.doc === s.doc)!
    return {
      concept: s.doc.concept,
      score: s.score,
      matchedTerms: full.matchedTerms,
      exactNameMatch: full.exactNameMatch,
    }
  })
}

/**
 * Alternatives to a result: the concepts its author linked as neighbours, plus
 * anything else the query ranked highly that is not already on screen.
 */
export function alternativesFor(concept: Concept, exclude: Set<string>): Concept[] {
  const out: Concept[] = []
  for (const id of concept.related) {
    if (exclude.has(id)) continue
    const c = CONCEPTS.find((x) => x.id === id)
    if (c) out.push(c)
  }
  return out.slice(0, 4)
}

/** Every concept, for the browse-everything view. */
export function allConcepts(): Concept[] {
  return [...CONCEPTS].sort((a, b) => a.name.localeCompare(b.name))
}
