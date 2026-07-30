/**
 * The shape of a "magic word" — a named expert concept, plus the exact phrasing
 * that gets Claude to apply it.
 */

export type Domain =
  | 'product'
  | 'engineering'
  | 'design'
  | 'writing'
  | 'research'
  | 'strategy'
  | 'data'
  | 'learning'
  | 'career'
  | 'meta'

export type Intent =
  | 'reframe'
  | 'ideate'
  | 'decide'
  | 'prioritize'
  | 'critique'
  | 'plan'
  | 'diagnose'
  | 'explain'
  | 'communicate'
  | 'structure'
  | 'estimate'
  | 'steer'

export interface PromptVariant {
  /** Short label for the situation this variant fits. */
  label: string
  prompt: string
}

export interface Concept {
  /** Stable kebab-case identifier, also used in the URL. */
  id: string
  /** The magic word itself. */
  name: string
  /** Alternate names people search for. Weighted almost as highly as the name. */
  aka?: string[]
  /** Where it comes from — the provenance is what makes it land as a term of art. */
  origin?: string
  domains: Domain[]
  intents: Intent[]
  /** One sentence: what the technique actually is. */
  oneLiner: string
  /**
   * Symptom phrases, written the way someone describes the problem *before*
   * they know the concept exists. This is the primary search surface.
   */
  useWhen: string[]
  /** The phrase to hand Claude. */
  prompt: string
  /** Alternative phrasings for adjacent situations. */
  variants?: PromptVariant[]
  /** Why this steers a model well, not just why the framework is good. */
  why: string
  /** Where it misfires. Honest limits beat overselling. */
  watchOut?: string
  /** Ids of neighbouring concepts to offer as alternatives. */
  related: string[]
  tags: string[]
}

export const DOMAIN_LABELS: Record<Domain, string> = {
  product: 'Product',
  engineering: 'Engineering',
  design: 'Design & UX',
  writing: 'Writing',
  research: 'Research',
  strategy: 'Strategy',
  data: 'Data & analysis',
  learning: 'Learning',
  career: 'People & career',
  meta: 'Working with AI',
}

export const INTENT_LABELS: Record<Intent, string> = {
  reframe: 'Reframe the problem',
  ideate: 'Generate more options',
  decide: 'Make a decision',
  prioritize: 'Prioritise / sequence',
  critique: 'Pressure-test my thinking',
  plan: 'Plan the work',
  diagnose: 'Find out what is wrong',
  explain: 'Understand or teach it',
  communicate: 'Write it up persuasively',
  structure: 'Organise a mess',
  estimate: 'Size or forecast it',
  steer: 'Control how the AI works',
}

export const INTENT_HINTS: Record<Intent, string> = {
  reframe: 'You suspect you are solving the wrong problem.',
  ideate: 'You have one idea and want ten.',
  decide: 'You have options and need to pick.',
  prioritize: 'Everything feels important.',
  critique: 'You want the holes found before someone else finds them.',
  plan: 'You know the goal, not the steps.',
  diagnose: 'Something is broken or underperforming.',
  explain: 'You need to actually understand it, or make someone else.',
  communicate: 'The thinking is done; the writing is not.',
  structure: 'You have notes, not an argument.',
  estimate: 'You need a number you can defend.',
  steer: 'The model keeps giving you the wrong shape of answer.',
}

export const DOMAINS = Object.keys(DOMAIN_LABELS) as Domain[]
export const INTENTS = Object.keys(INTENT_LABELS) as Intent[]
