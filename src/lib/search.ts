/**
 * Retrieval over the concept corpus.
 *
 * Hybrid ranking: BM25 over a weighted-field index for precision, plus cosine
 * similarity in a latent semantic space (see `embeddings.ts`) for the queries
 * BM25 cannot see at all. Facet boosting from the form answers and a light
 * diversity pass finish the job. Everything runs in the browser against ~120
 * documents, so both indexes are built locally and there is no server.
 *
 * The two halves fail in opposite directions, which is why they are combined
 * rather than chosen between. BM25 is exact and blind: it scores a query zero
 * if the user's words do not appear, however obviously the concept is the
 * right one. The semantic half always has an opinion and is never precise:
 * on its own it will happily rank a vaguely thematic neighbour above a
 * verbatim name match. Normalising both to a common scale and adding them
 * keeps the lexical signal in charge whenever it has something to say.
 */

import type { Concept, Domain, Intent } from '../data/types'
import { CONCEPTS } from '../data/concepts'
import { DOMAIN_LABELS, INTENT_LABELS } from '../data/types'
import { buildSemanticSpace, type SemanticSpace } from './embeddings'
import { expand, tokenize, tokenizeDetailed } from './text'

/**
 * The knobs that decide the ranking. Collected in one place and overridable per
 * query so the benchmark can sweep them — every value below was chosen by
 * running `npm run bench` over the held-out cases, not by taste.
 */
export interface Tuning {
  /** Latent dimensions kept. Low numbers generalise; high numbers memorise. */
  semanticDims: number
  /** How much BM25 is allowed to say. Only the benchmark ever sets this to 0. */
  lexicalWeight: number
  /** How much the latent space is allowed to say, relative to the best BM25 hit. */
  semanticWeight: number
  /** Cosine below this is thematic drift rather than similarity. */
  semanticFloor: number
  /** How hard a result is discounted for resembling one already picked. */
  diversityStrength: number
  /** How much of a concept's score flows to the neighbours its author linked. */
  relatedDiffusion: number
}

export interface Query {
  /** The user's own description of their problem. */
  text: string
  domains?: Domain[]
  intents?: Intent[]
  limit?: number
  /** Evaluation only: override ranking constants. See `relevancy.bench.ts`. */
  tuning?: Partial<Tuning>
}

export interface Result {
  concept: Concept
  score: number
  /** Original query words that contributed most, for "matched on…" chips. */
  matchedTerms: string[]
  /** True when the query literally names the concept or one of its aliases. */
  exactNameMatch: boolean
  /** BM25 share of the score, normalised against the best hit for this query. */
  lexical: number
  /** Latent-space cosine, or 0 if it fell below the floor. */
  semantic: number
  /**
   * The query and this concept share almost no vocabulary, so the ranking is
   * resting on the latent space alone.
   *
   * This began as the opposite feature — a flourish saying "you did not use any
   * of these words, we knew what you meant", which is a lovely thing for a
   * search engine to be able to say. Measuring it killed it: across all 131
   * evaluation cases, results flagged that way are right 17% of the time
   * against a 76% baseline. No threshold on the semantic score rescued it; the
   * best on offer was 50%, still well below simply keeping quiet.
   *
   * So it says the true thing instead. Weak lexical evidence is a real signal —
   * just of doubt rather than of insight — and a user who knows this one is a
   * stretch will look at the alternatives, which is exactly what they should do.
   */
  looseMatch: boolean
}

/**
 * Field weights for the latent space, which are deliberately not the BM25
 * weights below.
 *
 * Reusing one weighted bag for both looked like the tidy choice and cost a
 * third of the semantic ranking. BM25 wants `name` at weight 7, because
 * someone typing "Chesterton's fence" means that concept and nothing else. The
 * SVD reads the same table as a claim about what the corpus is *about*, so the
 * loudest signal in every latent dimension becomes a set of proper nouns that
 * no user describing a problem will ever type. Dropping names, aliases and
 * prompt text from the semantic corpus — leaving the symptom phrases and the
 * plain-language description — took held-out recall@1 from 46.6% to 60.3%.
 *
 * The name is not lost. It is what BM25 is for.
 */
const SEMANTIC_FIELD_WEIGHTS = {
  useWhen: 4,
  tags: 3,
  oneLiner: 2.2,
  why: 1,
  watchOut: 0.5,
} as const

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

/**
 * Scores below are on a normalised scale where 1.0 is the best lexical match
 * in this particular query, so the constants read as multiples of "as good as
 * the top BM25 hit".
 */
const PHRASE_BONUS = 3.5
const ALIAS_PHRASE_BONUS = 2.5

export const DEFAULT_TUNING: Tuning = {
  semanticDims: 96,
  lexicalWeight: 1,
  semanticWeight: 2.5,
  semanticFloor: 0.1,
  diversityStrength: 0.2,
  relatedDiffusion: 0.25,
}

interface Doc {
  concept: Concept
  /** term -> weighted frequency, for BM25 */
  tf: Map<string, number>
  /** term -> weighted frequency, for the latent space. See the note above. */
  semanticTf: Map<string, number>
  length: number
  /**
   * Name + aliases as token sequences. Matched as whole tokens rather than as
   * substrings: the alias "EV" occurs inside "everyone", "never" and "level",
   * and a raw substring test pinned Expected Value Framing to the top of any
   * query containing one of them.
   *
   */
  phrases: { tokens: string[]; isName: boolean }[]
  tagSet: Set<string>
}

/**
 * What fraction of the query a name has to account for before matching it
 * counts as "the user asked for this concept by name".
 *
 * Several aliases are written as conversational questions, and stopword
 * stripping can reduce one to a single ordinary word: "what are we not doing"
 * became `[not]`, "what happened when" became `[happen]`, "what else could it
 * be" became `[els]`. Each was pinning its concept to rank one on any query
 * containing that word, and Opportunity Cost Framing was the top result for a
 * third of the held-out queries purely because they contained "not". Alone it
 * cost more held-out accuracy than the entire semantic half contributes.
 *
 * Distinctiveness cannot separate these from real names: "Jobs To Be Done"
 * reduces to `[job]` and "Five Whys" is reachable only as `[why]`, both of
 * which are commoner in this corpus than `[els]`. What separates them is how
 * much of the query is left over. Someone naming a concept types little else,
 * so the name is most of what they typed; someone describing a problem in
 * fifteen words who happens to say "not" is at one token in eight. So the
 * bonus scales with coverage, and only a query that is mostly a name pins.
 */
const PHRASE_PIN_COVERAGE = 0.5

/**
 * Below this share of a perfect lexical match, a result is flagged as loose.
 * See `Result.looseMatch` for where the number comes from.
 */
const LOOSE_MATCH_LEXICAL = 0.2

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

  const semanticTf = new Map<string, number>()
  for (const u of concept.useWhen) addField(semanticTf, u, SEMANTIC_FIELD_WEIGHTS.useWhen)
  for (const t of concept.tags) addField(semanticTf, t, SEMANTIC_FIELD_WEIGHTS.tags)
  addField(semanticTf, concept.oneLiner, SEMANTIC_FIELD_WEIGHTS.oneLiner)
  addField(semanticTf, concept.why, SEMANTIC_FIELD_WEIGHTS.why)
  if (concept.watchOut) addField(semanticTf, concept.watchOut, SEMANTIC_FIELD_WEIGHTS.watchOut)

  return {
    concept,
    tf,
    semanticTf,
    length,
    phrases: [concept.name, ...(concept.aka ?? [])]
      .map((p, i) => ({ tokens: tokenize(p), isName: i === 0 }))
      .filter((p) => p.tokens.length > 0),
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

/**
 * The latent space costs ~40ms to build — worth paying, but not while someone
 * is waiting to see the home page. It is built on first use instead, and
 * `warmSemanticSpace` lets the app do that in idle time after first paint, so
 * by the time anyone has finished typing a problem description it is ready.
 * A deep link straight into a search pays the 40ms once.
 */
const SPACES = new Map<number, SemanticSpace>()

function semanticSpace(dims: number): SemanticSpace {
  let space = SPACES.get(dims)
  if (!space) {
    space = buildSemanticSpace(
      INDEX.docs.map((d) => d.semanticTf),
      dims,
    )
    SPACES.set(dims, space)
  }
  return space
}

/** Build the latent space ahead of the first query. Safe to call repeatedly. */
export function warmSemanticSpace(): void {
  semanticSpace(DEFAULT_TUNING.semanticDims)
}

/**
 * Undirected neighbour map from the `related` links each entry's author wrote.
 *
 * These are the best signal in the corpus and until now only fed the "if that
 * is not quite it" chips. A query that lands squarely on Pre-mortem is very
 * often a query that wanted Red Teaming, and the corpus already knows the two
 * are neighbours — so a fraction of each concept's score flows to the ones it
 * is linked to. It rescues the near-miss without ever displacing a direct hit,
 * because the direct hit keeps its own score and gains from its neighbours too.
 */
const NEIGHBOURS: number[][] = (() => {
  const indexOfId = new Map<string, number>()
  CONCEPTS.forEach((c, i) => indexOfId.set(c.id, i))

  const adjacency: Set<number>[] = CONCEPTS.map(() => new Set<number>())
  CONCEPTS.forEach((c, i) => {
    for (const id of c.related) {
      const j = indexOfId.get(id)
      if (j === undefined || j === i) continue
      adjacency[i].add(j)
      adjacency[j].add(i)
    }
  })
  return adjacency.map((s) => [...s])
})()

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

/** True when `needle` appears as a contiguous run of tokens inside `haystack`. */
function containsSequence(haystack: string[], needle: string[]): boolean {
  if (!needle.length || needle.length > haystack.length) return false
  outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) continue outer
    }
    return true
  }
  return false
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
function diversify<T extends { doc: Doc; score: number }>(
  scored: T[],
  limit: number,
  strength: number,
): T[] {
  const picked: T[] = []
  const pool = [...scored]
  while (picked.length < limit && pool.length) {
    let bestIdx = 0
    let bestValue = -Infinity
    for (let i = 0; i < pool.length; i++) {
      const overlap = picked.reduce(
        (max, p) => Math.max(max, jaccard(pool[i].doc.tagSet, p.doc.tagSet)),
        0,
      )
      const value = pool[i].score * (1 - strength * overlap)
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
  const detailed = tokenizeDetailed(query.text)
  const literal = detailed.map((t) => t.term)
  const expanded = expand(literal)
  const hasText = literal.length > 0

  // Stemmed terms are unreadable ("lik", "prd"), so quote the user's own words back.
  const spoken = new Map<string, string>()
  for (const t of detailed) if (!spoken.has(t.term)) spoken.set(t.term, t.original)

  const tuning = { ...DEFAULT_TUNING, ...query.tuning }

  // Only literal terms are folded into the latent space. Feeding the hand-built
  // expansions in too would let one guess at the user's meaning vote twice.
  const space = hasText && tuning.semanticWeight > 0 ? semanticSpace(tuning.semanticDims) : null
  const queryVector = space ? space.fold(literal) : null

  // Pass one: raw BM25, which has no fixed upper bound and so has to be put on
  // a common scale before it can be added to a cosine.
  const lexicalPass = INDEX.docs.map((doc) => {
    let value = 0
    const contributions: { term: string; value: number }[] = []

    for (const term of literal) {
      const termValue = INDEX.termScore(doc, term)
      if (termValue > 0) contributions.push({ term, value: termValue })
      value += termValue
    }
    for (const term of expanded) {
      value += INDEX.termScore(doc, term) * EXPANSION_WEIGHT
    }

    contributions.sort((a, b) => b.value - a.value)
    return { value, contributions }
  })

  /**
   * Normalise against what a perfect lexical match would have scored, not
   * against the best match this query happened to find.
   *
   * Dividing by the observed maximum was the single worst thing in this
   * ranking. It guarantees some document scores exactly 1.0 no matter how
   * badly the query matched, so on a query with no real lexical signal the
   * loudest piece of noise arrives with full confidence and buries the
   * semantic half. Against the theoretical ceiling — every query term present
   * and saturated — a query the corpus has no words for correctly scores
   * everyone near zero, and the latent space gets to lead.
   */
  const idealLexical = literal.reduce((sum, term) => sum + INDEX.idf(term) * (K1 + 1), 0)

  // Pass two: put both halves on one scale. Held separately first because the
  // diffusion step below needs everyone's evidence before anyone's total.
  const evidence = INDEX.docs.map((_doc, i) => {
    const lexical = idealLexical > 0 ? lexicalPass[i].value / idealLexical : 0
    let semantic = 0
    if (queryVector && space) {
      const cosine = space.similarity(queryVector, i)
      if (cosine > tuning.semanticFloor) semantic = cosine
    }
    return {
      lexical,
      semantic,
      base: tuning.lexicalWeight * lexical + tuning.semanticWeight * semantic,
    }
  })

  const scored = INDEX.docs.map((doc, i) => {
    const { contributions } = lexicalPass[i]
    const { lexical, semantic, base } = evidence[i]

    // A concept's neighbours vouch for it. Taking the strongest neighbour
    // rather than the sum stops a densely linked hub from collecting a bonus
    // from many weak signals that individually mean nothing.
    let vouched = 0
    for (const j of NEIGHBOURS[i]) vouched = Math.max(vouched, evidence[j].base)

    let score = base + tuning.relatedDiffusion * vouched

    // Someone who types the concept's name wants that concept, full stop.
    let exactNameMatch = false
    for (const phrase of doc.phrases) {
      if (!containsSequence(literal, phrase.tokens)) continue
      const coverage = Math.min(1, phrase.tokens.length / literal.length)
      score += (phrase.isName ? PHRASE_BONUS : ALIAS_PHRASE_BONUS) * coverage
      exactNameMatch = coverage >= PHRASE_PIN_COVERAGE
      break
    }

    // With no text at all the facets are the entire query.
    if (!hasText) score = 1

    score *= facetMultiplier(doc.concept, query)

    // Only the terms that actually carried the match; the long tail is noise.
    const cutoff = (contributions[0]?.value ?? 0) * 0.3
    return {
      doc,
      score,
      exactNameMatch,
      lexical,
      semantic,
      looseMatch: hasText && lexical < LOOSE_MATCH_LEXICAL && !exactNameMatch,
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
  const diversified = diversify(rest, Math.max(0, limit - pinned.length), tuning.diversityStrength)

  return [...pinned, ...diversified].map((s) => ({
    concept: s.doc.concept,
    score: s.score,
    matchedTerms: s.matchedTerms,
    exactNameMatch: s.exactNameMatch,
    lexical: s.lexical,
    semantic: s.semantic,
    looseMatch: s.looseMatch,
  }))
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
