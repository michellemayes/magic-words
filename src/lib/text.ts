/**
 * Tokenisation, normalisation and query expansion.
 *
 * The corpus is written in expert vocabulary; people describe their problems in
 * ordinary words. Almost all of the retrieval quality lives in bridging that gap,
 * which is what EXPANSIONS below is for.
 */

const STOPWORDS = new Set([
  'a', 'about', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'done', 'for', 'from', 'get', 'getting', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'him', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'just', 'me', 'my', 'of', 'on', 'or', 'our', 'out', 'over', 'own', 'she',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they',
  'this', 'those', 'to', 'too', 'up', 'us', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'will', 'with', 'would', 'you', 'your',
])

/**
 * British/American and other spelling variants, normalised to one form so a
 * search for "prioritise" hits a corpus entry written as "prioritize".
 */
const SPELLING: Record<string, string> = {
  prioritise: 'prioritize', prioritisation: 'prioritization', prioritised: 'prioritized',
  organise: 'organize', organisation: 'organization', organised: 'organized',
  optimise: 'optimize', optimisation: 'optimization', optimised: 'optimized',
  summarise: 'summarize', categorise: 'categorize', minimise: 'minimize', maximise: 'maximize',
  realise: 'realize', recognise: 'recognize', emphasise: 'emphasize', standardise: 'standardize',
  visualise: 'visualize', generalise: 'generalize', specialise: 'specialize', utilise: 'utilize',
  analyse: 'analyze', analysed: 'analyzed', analysing: 'analyzing',
  behaviour: 'behavior', behavioural: 'behavioral', colour: 'color', favour: 'favor',
  honour: 'honor', labour: 'labor', rumour: 'rumor', humour: 'humor', endeavour: 'endeavor',
  defence: 'defense', licence: 'license', practise: 'practice', judgement: 'judgment',
  modelling: 'modeling', modelled: 'modeled', cancelled: 'canceled', travelling: 'traveling',
}

/**
 * Colloquial term -> corpus vocabulary. Expansion terms are scored at a reduced
 * weight so a literal match always outranks an inferred one.
 *
 * Keys are matched post-stemming, so list the stem people actually type.
 */
const EXPANSIONS: Record<string, string[]> = {
  // Being stuck
  stuck: ['blocked', 'impasse', 'unclear', 'debug'],
  block: ['stuck', 'constraint', 'bottleneck'],
  lost: ['unclear', 'orient', 'stuck'],
  overwhelm: ['prioritize', 'scope', 'structure'],
  confus: ['unclear', 'ambiguous', 'structure'],
  mess: ['structure', 'unclear', 'organize'],

  // Vagueness and abstraction
  vagu: ['ambiguous', 'unclear', 'abstract', 'altitude'],
  fuzzi: ['ambiguous', 'unclear', 'abstract'],
  gener: ['generic', 'bland', 'obvious', 'default'],
  bland: ['generic', 'obvious', 'creativity'],
  obviou: ['generic', 'default', 'anchor'],
  broad: ['abstract', 'scope', 'altitude'],
  abstract: ['altitude', 'concrete', 'ladder'],

  // AI / model steering
  ai: ['prompt', 'model', 'llm'],
  llm: ['prompt', 'model', 'ai'],
  claud: ['prompt', 'model', 'ai'],
  chatgpt: ['prompt', 'model', 'ai'],
  gpt: ['prompt', 'model', 'ai'],
  agent: ['prompt', 'model', 'ai', 'coding'],
  chatbot: ['prompt', 'model', 'ai'],
  prompt: ['steer', 'model', 'ai'],
  output: ['format', 'response', 'answer'],
  hallucin: ['accuracy', 'evidence', 'verify', 'confident'],

  // Problems with work product
  bug: ['debug', 'failure', 'defect', 'troubleshoot'],
  crash: ['failure', 'debug', 'incident'],
  error: ['failure', 'debug', 'incident'],
  broken: ['failure', 'debug', 'incident'],
  fail: ['failure', 'debug', 'risk'],
  outag: ['incident', 'postmortem', 'failure', 'production'],
  slow: ['performance', 'latency', 'bottleneck', 'throughput'],
  flaki: ['intermittent', 'debug', 'reliability'],
  regress: ['bisect', 'debug', 'broke'],

  // Product & planning
  roadmap: ['prioritization', 'planning', 'sequencing'],
  backlog: ['prioritization', 'planning', 'scope'],
  featur: ['product', 'scope', 'prioritization'],
  ticket: ['requirements', 'acceptance', 'scope'],
  sprint: ['planning', 'scope', 'agile'],
  estim: ['estimation', 'forecast', 'sizing'],
  deadlin: ['schedule', 'date', 'sequencing', 'scope'],
  lat: ['schedule', 'estimation', 'slip'],
  scop: ['requirements', 'prioritization', 'cutting'],
  launch: ['release', 'risk', 'readiness'],
  mvp: ['scope', 'validation', 'minimum'],

  // People & org
  boss: ['leadership', 'executive', 'stakeholder'],
  manag: ['leadership', 'stakeholder', 'feedback'],
  exec: ['leadership', 'executive', 'stakeholder'],
  leadership: ['executive', 'stakeholder', 'alignment'],
  stakehold: ['leadership', 'alignment', 'communication'],
  team: ['collaboration', 'alignment', 'leadership'],
  meet: ['decision', 'alignment', 'facilitation'],
  argu: ['disagreement', 'conflict', 'debate'],
  disagr: ['conflict', 'debate', 'alignment'],
  conflict: ['disagreement', 'feedback', 'communication'],
  coworker: ['colleague', 'feedback', 'conflict'],
  colleagu: ['feedback', 'conflict', 'communication'],
  hir: ['interview', 'career', 'evaluation'],
  promot: ['career', 'interview', 'review'],
  intervi: ['career', 'interview'],

  // Writing & communication
  email: ['writing', 'communication', 'brevity'],
  slack: ['writing', 'communication', 'brevity'],
  doc: ['writing', 'document', 'structure'],
  writ: ['writing', 'communication', 'clarity'],
  present: ['communication', 'narrative', 'audience'],
  deck: ['presentation', 'narrative', 'communication'],
  pitch: ['narrative', 'persuasion', 'communication'],
  explain: ['explanation', 'clarity', 'audience', 'teaching'],
  jargon: ['clarity', 'audience', 'plain'],
  ramb: ['brevity', 'structure', 'concise'],
  long: ['brevity', 'concise', 'structure'],
  bor: ['narrative', 'engagement', 'story'],

  // Decisions
  decid: ['decision', 'choice', 'trade-off'],
  decis: ['choice', 'trade-off', 'criteria'],
  choos: ['decision', 'choice', 'criteria'],
  option: ['alternative', 'choice', 'decision'],
  tradeof: ['trade-off', 'criteria', 'decision'],
  risk: ['failure', 'uncertainty', 'mitigation'],
  wrong: ['failure', 'mistake', 'critique'],

  // Learning
  learn: ['learning', 'understanding', 'study'],
  understand: ['understanding', 'explanation', 'learning'],
  remember: ['memory', 'retention', 'recall'],
  forget: ['memory', 'retention', 'recall'],
  studi: ['learning', 'retention', 'practice'],
  teach: ['teaching', 'explanation', 'learning'],
  onboard: ['learning', 'orientation', 'documentation'],

  // Data
  metric: ['measurement', 'kpi', 'analytics'],
  kpi: ['metric', 'measurement', 'goal'],
  data: ['analytics', 'evidence', 'measurement'],
  chart: ['analytics', 'measurement'],
  test: ['experiment', 'validation', 'evidence'],
  experi: ['experiment', 'validation', 'test'],
  churn: ['retention', 'cohort', 'analytics'],
  retent: ['cohort', 'analytics', 'churn'],
  conversion: ['funnel', 'analytics', 'journey'],
  funnel: ['journey', 'analytics', 'dropoff'],

  // Architecture & codebase structure
  legacy: ['migration', 'refactoring', 'modernization', 'old'],
  monolith: ['architecture', 'service', 'decomposition'],
  monolithic: ['architecture', 'service', 'decomposition'],
  microservic: ['architecture', 'service', 'boundaries', 'distributed'],
  coupl: ['dependency', 'architecture', 'modularity', 'boundaries'],
  refactor: ['restructure', 'architecture', 'cleanup', 'migration'],
  spaghetti: ['coupling', 'structure', 'architecture', 'tangled'],
  testabl: ['testing', 'dependency', 'isolation', 'architecture'],
  mock: ['testing', 'dependency', 'isolation'],
  rewrit: ['migration', 'legacy', 'incremental', 'architecture'],
  boilerplat: ['abstraction', 'structure', 'ceremony'],
  framework: ['architecture', 'dependency', 'coupling'],
  databas: ['persistence', 'data', 'schema'],
  sql: ['persistence', 'database', 'query'],
  orm: ['persistence', 'database', 'entity'],
  schema: ['model', 'data', 'structure'],
  api: ['interface', 'contract', 'boundaries'],
  apis: ['interface', 'contract', 'boundaries'],
  endpoint: ['api', 'interface', 'client'],
  layer: ['architecture', 'boundaries', 'structure'],
  modul: ['architecture', 'boundaries', 'structure'],
  interfac: ['abstraction', 'contract', 'boundaries'],
  deploy: ['operations', 'release', 'environment'],
  config: ['environment', 'deployment', 'operations'],
  configuration: ['environment', 'deployment', 'operations'],
  scal: ['scalability', 'performance', 'throughput'],
  frontend: ['ui', 'client', 'interface'],
  backend: ['service', 'api', 'server'],

  // Design
  ux: ['usability', 'design', 'experience'],
  ui: ['interface', 'design', 'usability'],
  usabl: ['usability', 'heuristic', 'interface'],
  design: ['interface', 'usability', 'critique'],
  wirefram: ['design', 'interface', 'prototype'],

  // Emotional / meta signals worth routing on
  anxiou: ['risk', 'uncertainty', 'pre-mortem'],
  worri: ['risk', 'uncertainty', 'failure'],
  nervou: ['risk', 'uncertainty', 'caution'],
  frustrat: ['stuck', 'conflict', 'friction'],
  procrastin: ['prioritization', 'timebox', 'focus'],
  busi: ['prioritization', 'focus', 'delegation'],
  circl: ['stuck', 'decision', 'relitigate'],
  repeat: ['recurring', 'root', 'systemic'],
  again: ['recurring', 'root', 'systemic'],
}

export interface Token {
  /** The indexed form. */
  term: string
  /** The word the user actually typed, so the UI can quote them back. */
  original: string
}

/** Split raw text into normalised, stopword-filtered, stemmed tokens. */
export function tokenizeDetailed(input: string): Token[] {
  const out: Token[] = []
  for (const word of input.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/)) {
    if (!word) continue
    const normalized = SPELLING[word] ?? word
    if (normalized.length < 2 || STOPWORDS.has(normalized)) continue
    const term = stem(normalized)
    if (term) out.push({ term, original: word })
  }
  return out
}

export function tokenize(input: string): string[] {
  return tokenizeDetailed(input).map((t) => t.term)
}

/**
 * Deliberately light suffix stripping. Precision matters less than applying the
 * exact same transformation to the query and the corpus.
 */
export function stem(word: string): string {
  let w = word
  if (w.length <= 3) return w

  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y'
  if (w.endsWith('sses')) return w.slice(0, -2)
  if (w.endsWith('ness') && w.length > 6) w = w.slice(0, -4)
  else if (w.endsWith('ment') && w.length > 7) w = w.slice(0, -4)
  else if (w.endsWith('ing') && w.length > 5) w = w.slice(0, -3)
  else if (w.endsWith('edly') && w.length > 6) w = w.slice(0, -4)
  else if (w.endsWith('ed') && w.length > 4) w = w.slice(0, -2)
  else if (w.endsWith('ly') && w.length > 4) w = w.slice(0, -2)
  else if (w.endsWith('es') && w.length > 4 && !/[aeiou]es$/.test(w)) w = w.slice(0, -2)
  else if (w.endsWith('s') && !/(ss|us|is|as)$/.test(w) && w.length > 3) w = w.slice(0, -1)
  // Drop a silent final -e so "estimate" and "estimates" land on the same stem.
  else if (w.endsWith('e')) w = w.slice(0, -1)

  // Collapse doubled final consonants left behind by -ing/-ed stripping.
  if (/([bdfglmnprt])\1$/.test(w)) w = w.slice(0, -1)
  return w
}

/**
 * Terms implied by, but not present in, the user's wording. Returned separately
 * so the caller can score them below literal matches.
 */
export function expand(tokens: string[]): string[] {
  const out = new Set<string>()
  const literal = new Set(tokens)
  for (const t of tokens) {
    const extra = EXPANSIONS[t]
    if (!extra) continue
    for (const e of extra) {
      for (const st of tokenize(e)) {
        if (!literal.has(st)) out.add(st)
      }
    }
  }
  return [...out]
}

/** Exposed for the corpus test, which checks expansion targets are reachable. */
export const EXPANSION_KEYS = Object.keys(EXPANSIONS)
export const EXPANSION_TABLE = EXPANSIONS
