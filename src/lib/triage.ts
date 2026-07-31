/**
 * Stream-of-consciousness triage.
 *
 * `search()` answers one question well. What people actually type — into the
 * site's box, and into Claude — is rarely one question. It is a paragraph that
 * starts with a deploy that went wrong, mentions in passing that nobody agreed
 * who owns the decision, and ends by asking for help writing it up. Handing all
 * of that to the ranker as a single query gets you the concept that best
 * matches the *average* of three problems, which is usually none of them: the
 * signal for each strand is diluted by the words belonging to the others.
 *
 * So the input is cut into threads first, each thread is searched on its own,
 * and the results are merged. The user gets a word per problem instead of one
 * word for the blur, and — because every pick knows which strand summoned it —
 * they can be shown *why* each one arrived, in their own words.
 *
 * Both the site and the Claude Code skill run through here, so what the skill
 * injects and what the site prints are the same thing by construction.
 */

import type { Concept, Domain, Intent } from '../data/types'
import { search, type Result } from './search'
import { tokenize } from './text'

export type Confidence = 'strong' | 'tentative'

export interface Pick {
  concept: Concept
  /**
   * The strand of the input that summoned this concept, verbatim, so the user
   * can be told which of the things they said got them this word.
   */
  because: string
  /** True when nothing in particular summoned it — the whole input did. */
  fromWholeInput: boolean
  score: number
  /** Query words that carried the match, for a "matched on…" line. */
  matchedTerms: string[]
  /**
   * `strong` is worth acting on unprompted. `tentative` is worth offering and
   * not worth injecting into someone's request behind their back.
   *
   * The line is `Result.looseMatch` — barely any of the user's words appear in
   * the concept, so the ranking is resting on the latent space alone — and
   * nothing else. The obvious alternative, a threshold on the merged score, is
   * swept in `npm run bench` against all 131 single-problem cases, and the two
   * mark the ends of one coverage-for-precision trade. `looseMatch` sits at the
   * coverage end: 94.7% of picks called strong, 70.2% of those right against a
   * 66.4% baseline, and the 5.3% it holds back right none of the time at all. A
   * cutoff of 2.0 sits at the other: 84.8% right, silent about 30% of picks.
   *
   * At 119 concepts these were nearly the same signal — a cutoff high enough to
   * matter had already excluded every loose pick, and adding the lexical test on
   * top of it changed nothing. At 619 they have come apart, and the cutoff now
   * buys a real 15 points of precision for a real 25 of coverage.
   *
   * The coverage end is still the right one, because of what silence costs. A
   * pick called strong is shown by name with the user's own words next to it and
   * is trivially ignored; a pick withheld is the entire product not happening.
   * Precision would matter more than this if anything acted on a pick without
   * the user seeing it, and nothing does. What `looseMatch` is doing here is the
   * part worth keeping either way: it finds the bucket that is wrong every time.
   */
  confidence: Confidence
}

export interface Triage {
  /** The input as it was cut up. One entry for anything short or single-clause. */
  threads: string[]
  /** Best concept per problem, strongest first, deduplicated across threads. */
  picks: Pick[]
  /** Everything else the input ranked, for the "other magic words" list. */
  others: Result[]
}

/** Overridable so `triage.bench.ts` can sweep it. Nothing else sets this. */
export interface TriageTuning {
  /** See WHOLE_INPUT_WEIGHT. */
  wholeInputWeight: number
}

export interface TriageOptions {
  domains?: Domain[]
  intents?: Intent[]
  /** How many picks to return. Kept small on purpose; see the note below. */
  limit?: number
  /** Evaluation only: override the merge constants. */
  tuning?: Partial<TriageTuning>
}

/**
 * Three, and the default is not arbitrary.
 *
 * The failure mode of this whole idea is not missing a concept, it is burying
 * the request under six of them. Every injected phrase competes with the user's
 * own instructions for the model's attention, and the fourth-best match for a
 * paragraph is nearly always a thematic neighbour of the first rather than a
 * new problem. Two or three named techniques is what a knowledgeable colleague
 * would say; a numbered list of eight is what a search engine would say.
 */
const DEFAULT_LIMIT = 3

/** Below this a result is noise from a thread with nothing much in it. */
const FLOOR_SCORE = 0.35

/**
 * A thread must have at least this many content tokens to be searched alone.
 *
 * Scores are comparable across queries because both halves are normalised —
 * BM25 against a perfect match for *that* query, the semantic half being a
 * cosine — but that same normalisation makes a two-word fragment cheap to
 * satisfy: "it is slow" matches something perfectly and means almost nothing.
 * Short fragments are merged into their neighbour rather than searched.
 */
const MIN_THREAD_TOKENS = 3

/** More threads than this and we are dicing, not splitting. */
const MAX_THREADS = 6

/**
 * A single strand longer than this is a run-on rather than one thought, and
 * only then is it worth splitting on bare "and" / "but". Doing that eagerly
 * breaks real single problems in half — "the payment went through but the order
 * was never created" is one bug, not two — so it is the fallback, not the rule.
 */
const RUN_ON_TOKENS = 16

/**
 * Boundaries that reliably mean "new thought": punctuation, line breaks, spaced
 * dashes, and the handful of spoken connectives people use to change subject.
 * Deliberately excludes bare "and" and "but", which join clauses within one
 * problem far more often than they separate problems.
 */
const HARD_BOUNDARY =
  /(?:[.!?;]+\s+|\n+|\s+[—–]\s+|\s+(?:and then|and also|and now|and separately|oh and|another thing|on top of that|at the same time|meanwhile|separately|anyway|also|plus)\s+)/i

const RUN_ON_BOUNDARY = /(?:\s+(?:and|but|although|whereas|while)\s+)/i

/**
 * Discourse markers stripped from the front of a thread once it has been cut
 * out. They carry no problem — "ok so the deploy fell over" is about a deploy —
 * and two of them cause real damage rather than mere untidiness.
 *
 * Where two boundaries overlap, splitting consumes the outer one and strands
 * the inner: "on time — and separately I cannot tell" cuts at the dash and
 * again at "separately", leaving a thread whose entire content is the word
 * "and", which then gets folded onto the end of its neighbour. And because the
 * site quotes threads back at the user as the reason a word arrived, a thread
 * that begins "and also then" reads as though the splitter is guessing.
 *
 * Applied repeatedly, since they stack: "ok so anyway…".
 */
const LEADING_FILLER =
  /^(?:ok|okay|so|and|but|then|also|plus|oh|well|anyway|basically|honestly|um|uh|yeah|separately|meanwhile)[,]?(?:\s+|$)/i

function stripFiller(text: string): string {
  let out = text
  while (LEADING_FILLER.test(out)) out = out.replace(LEADING_FILLER, '')
  return out
}

function contentTokens(text: string): number {
  return tokenize(text).length
}

/** Split on a regex while keeping the pieces, since JS `split` needs a global. */
function splitAll(text: string, boundary: RegExp): string[] {
  const global = new RegExp(boundary.source, boundary.flags.includes('g') ? boundary.flags : boundary.flags + 'g')
  return text.split(global).filter((p) => p != null)
}

/**
 * Cut a ramble into the problems it contains.
 *
 * Exported because it is the part most worth testing directly, and because the
 * site quotes its output back at the user, so its mistakes are visible ones.
 */
export function splitThreads(input: string): string[] {
  const trimmed = input.trim()
  if (!trimmed) return []

  let parts = splitAll(trimmed, HARD_BOUNDARY)
    .map((p) => p.trim())
    .filter(Boolean)

  // Only now, and only where a piece is still long enough to be two thoughts.
  parts = parts.flatMap((part) =>
    contentTokens(part) > RUN_ON_TOKENS
      ? splitAll(part, RUN_ON_BOUNDARY).map((p) => p.trim()).filter(Boolean)
      : [part],
  )

  // Strip before merging, so a stranded connective disappears instead of being
  // glued onto the end of the thread before it.
  parts = parts.map(stripFiller).filter((p) => p.length > 0)

  // Fold anything too thin to search into the piece before it, so the user's
  // words all still appear somewhere and nothing is silently dropped.
  const merged: string[] = []
  for (const part of parts) {
    if (contentTokens(part) < MIN_THREAD_TOKENS && merged.length) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${part}`
    } else {
      merged.push(part)
    }
  }
  if (merged.length > 1 && contentTokens(merged[0]) < MIN_THREAD_TOKENS) {
    const [first, second, ...rest] = merged
    return capThreads([`${first} ${second}`, ...rest])
  }

  return capThreads(merged.length ? merged : [trimmed])
}

/** Keep the meatiest threads, in the order they were said. */
function capThreads(threads: string[]): string[] {
  if (threads.length <= MAX_THREADS) return threads
  const keep = new Set(
    threads
      .map((text, index) => ({ index, weight: contentTokens(text) }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, MAX_THREADS)
      .map((t) => t.index),
  )
  return threads.filter((_, i) => keep.has(i))
}

/**
 * Whole-input results are multiplied by this before being compared with
 * per-thread ones. It is 1, which is to say: they are not.
 *
 * A correction looked obviously necessary. A thread is a short query, and short
 * queries score higher against the ideal lexical ceiling than long ones do —
 * every one of your four words appearing is a perfect match in a way that every
 * one of your forty words appearing never is — so the reading of the whole
 * paragraph should presumably be given a thumb on the scale. `npm run bench`
 * sweeps it and the thumb costs coverage: from 1.35 up, a weak whole-input
 * result starts displacing a strong thread's answer, and by 2 the ramble set
 * has lost 10 points and is doing no better than not splitting at all.
 *
 * The other direction is live but thin. Discounting the whole-input reading to
 * 0.8 currently covers one problem more than parity does — one case in twenty,
 * on a set of twenty, which is not enough to move a constant on. It was a
 * three-way tie at 119 concepts and it may be a real effect at 619; it needs
 * more rambles to say, not a smaller p-value on these.
 *
 * What does matter, and has not moved, is that the whole-input reading is in
 * the pool at all. Dropping it (weight 0, threads only) costs 10 points of
 * coverage, because a paragraph often states its real problem across a boundary
 * rather than inside one clause. So both readings compete, at par, and the knob
 * stays because the sweep is the evidence for it.
 */
const WHOLE_INPUT_WEIGHT = 1

export const DEFAULT_TRIAGE_TUNING: TriageTuning = {
  wholeInputWeight: WHOLE_INPUT_WEIGHT,
}

export function triage(input: string, options: TriageOptions = {}): Triage {
  const limit = options.limit ?? DEFAULT_LIMIT
  const tuning = { ...DEFAULT_TRIAGE_TUNING, ...options.tuning }
  const threads = splitThreads(input)
  const facets = { domains: options.domains, intents: options.intents }

  const whole = search({ text: input, ...facets, limit: 8 })

  // Facets on their own still rank the corpus, but there is nothing to
  // attribute a pick to and nothing to compose a prompt around: with no words
  // from the user, "you said X, so here is Y" would be a fabrication. The
  // ranked list is returned and the interface leads with the top of it.
  if (!contentTokens(input)) return { threads: [], picks: [], others: whole }

  /** Best evidence seen for each concept, and what produced it. */
  const best = new Map<string, { result: Result; score: number; because: string; fromWholeInput: boolean }>()

  const offer = (result: Result, score: number, because: string, fromWholeInput: boolean) => {
    const existing = best.get(result.concept.id)
    if (existing && existing.score >= score) return
    best.set(result.concept.id, { result, score, because, fromWholeInput })
  }

  for (const r of whole) offer(r, r.score * tuning.wholeInputWeight, input.trim(), true)

  // One thread is one problem, so it only ever contributes its own best answer.
  // Taking the top two would fill the picks with a single strand's neighbours.
  if (threads.length > 1) {
    for (const thread of threads) {
      const [top] = search({ text: thread, ...facets, limit: 1 })
      if (top) offer(top, top.score, thread, false)
    }
  }

  const ranked = [...best.values()].sort((a, b) => b.score - a.score)

  const picks: Pick[] = ranked
    .filter((r) => r.score >= FLOOR_SCORE)
    .slice(0, limit)
    .map((r) => ({
      concept: r.result.concept,
      because: r.because,
      // With one thread the whole input *is* the thread, and calling that
      // "found in the request as a whole" would imply a distinction the user
      // cannot see and that does not exist.
      fromWholeInput: r.fromWholeInput && threads.length > 1,
      score: r.score,
      matchedTerms: r.result.matchedTerms,
      confidence: r.result.looseMatch ? ('tentative' as const) : ('strong' as const),
    }))

  const picked = new Set(picks.map((p) => p.concept.id))

  return {
    threads,
    picks,
    others: whole.filter((r) => !picked.has(r.concept.id)),
  }
}
