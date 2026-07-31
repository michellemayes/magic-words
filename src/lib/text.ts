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
 * Keys are ordinary words, not stems. They used to be stems, written by hand to
 * match what the stemmer produces — and fourteen of them were wrong, so they sat
 * in the table looking maintained while matching nothing. `estim` never fired
 * because "estimate" stems to `estimat`; `hallucin` never fired because
 * "hallucinating" stems to `hallucinat`. The keys are now stemmed by the same
 * function as the corpus and the query (see EXPANSION_INDEX below), which makes
 * that whole class of silent failure impossible rather than merely tested for.
 *
 * Where several spellings of an idea stem apart — "flaky" and "flakiness" do —
 * list them both. Duplicate keys landing on one stem merge their targets.
 */
const EXPANSIONS: Record<string, string[]> = {
  // Being stuck
  stuck: ['blocked', 'impasse', 'unclear', 'debug'],
  blocked: ['stuck', 'constraint', 'bottleneck'],
  blocker: ['stuck', 'constraint', 'bottleneck'],
  lost: ['unclear', 'orient', 'stuck'],
  overwhelmed: ['prioritize', 'scope', 'structure'],
  confused: ['unclear', 'ambiguous', 'structure'],
  confusing: ['unclear', 'ambiguous', 'structure'],
  mess: ['structure', 'unclear', 'organize'],

  // Vagueness and abstraction
  vague: ['ambiguous', 'unclear', 'abstract', 'altitude'],
  fuzzy: ['ambiguous', 'unclear', 'abstract'],
  fuzziness: ['ambiguous', 'unclear', 'abstract'],
  generic: ['generic', 'bland', 'obvious', 'default'],
  general: ['generic', 'bland', 'obvious', 'default'],
  bland: ['generic', 'obvious', 'creativity'],
  obvious: ['generic', 'default', 'anchor'],
  broad: ['abstract', 'scope', 'altitude'],
  abstract: ['altitude', 'concrete', 'ladder'],

  // AI / model steering
  ai: ['prompt', 'model', 'llm'],
  llm: ['prompt', 'model', 'ai'],
  claude: ['prompt', 'model', 'ai'],
  chatgpt: ['prompt', 'model', 'ai'],
  gpt: ['prompt', 'model', 'ai'],
  agent: ['prompt', 'model', 'ai', 'coding'],
  chatbot: ['prompt', 'model', 'ai'],
  prompt: ['steer', 'model', 'ai'],
  output: ['format', 'response', 'answer'],
  hallucinate: ['accuracy', 'evidence', 'verify', 'confident'],
  hallucination: ['accuracy', 'evidence', 'verify', 'confident'],

  // Problems with work product
  bug: ['debug', 'failure', 'defect', 'troubleshoot'],
  crash: ['failure', 'debug', 'incident'],
  error: ['failure', 'debug', 'incident'],
  broken: ['failure', 'debug', 'incident'],
  fail: ['failure', 'debug', 'risk'],
  outage: ['incident', 'postmortem', 'failure', 'production'],
  slow: ['performance', 'latency', 'bottleneck', 'throughput'],
  flaky: ['intermittent', 'debug', 'reliability'],
  flakiness: ['intermittent', 'debug', 'reliability'],
  regressed: ['bisect', 'debug', 'broke'],
  regression: ['bisect', 'debug', 'broke'],

  // Product & planning
  roadmap: ['prioritization', 'planning', 'sequencing'],
  backlog: ['prioritization', 'planning', 'scope'],
  feature: ['product', 'scope', 'prioritization'],
  ticket: ['requirements', 'acceptance', 'scope'],
  sprint: ['planning', 'scope', 'agile'],
  estimate: ['estimation', 'forecast', 'sizing'],
  estimation: ['estimation', 'forecast', 'sizing'],
  deadline: ['schedule', 'date', 'sequencing', 'scope'],
  late: ['schedule', 'estimation', 'slip'],
  scope: ['requirements', 'prioritization', 'cutting'],
  launch: ['release', 'risk', 'readiness'],
  mvp: ['scope', 'validation', 'minimum'],

  // People & org
  boss: ['leadership', 'executive', 'stakeholder'],
  manager: ['leadership', 'stakeholder', 'feedback'],
  managing: ['leadership', 'stakeholder', 'feedback'],
  management: ['leadership', 'stakeholder', 'feedback'],
  exec: ['leadership', 'executive', 'stakeholder'],
  executive: ['leadership', 'executive', 'stakeholder'],
  leadership: ['executive', 'stakeholder', 'alignment'],
  stakeholder: ['leadership', 'alignment', 'communication'],
  team: ['collaboration', 'alignment', 'leadership'],
  meeting: ['decision', 'alignment', 'facilitation'],
  arguing: ['disagreement', 'conflict', 'debate'],
  argument: ['disagreement', 'conflict', 'debate'],
  disagree: ['conflict', 'debate', 'alignment'],
  disagreement: ['conflict', 'debate', 'alignment'],
  conflict: ['disagreement', 'feedback', 'communication'],
  coworker: ['colleague', 'feedback', 'conflict'],
  colleague: ['feedback', 'conflict', 'communication'],
  hiring: ['interview', 'career', 'evaluation'],
  promoted: ['career', 'interview', 'review'],
  promotion: ['career', 'interview', 'review'],
  interview: ['career', 'interview', 'evaluation'],

  // Writing & communication
  email: ['writing', 'communication', 'brevity'],
  slack: ['writing', 'communication', 'brevity'],
  doc: ['writing', 'document', 'structure'],
  writing: ['writing', 'communication', 'clarity'],
  present: ['communication', 'narrative', 'audience'],
  deck: ['presentation', 'narrative', 'communication'],
  pitch: ['narrative', 'persuasion', 'communication'],
  explain: ['explanation', 'clarity', 'audience', 'teaching'],
  jargon: ['clarity', 'audience', 'plain'],
  ramble: ['brevity', 'structure', 'concise'],
  rambling: ['brevity', 'structure', 'concise'],
  long: ['brevity', 'concise', 'structure'],
  boring: ['narrative', 'engagement', 'story'],

  // Decisions
  decide: ['decision', 'choice', 'trade-off'],
  decision: ['choice', 'trade-off', 'criteria'],
  choose: ['decision', 'choice', 'criteria'],
  option: ['alternative', 'choice', 'decision'],
  tradeoff: ['trade-off', 'criteria', 'decision'],
  risk: ['failure', 'uncertainty', 'mitigation'],
  wrong: ['failure', 'mistake', 'critique'],

  // Learning
  learn: ['learning', 'understanding', 'study'],
  understand: ['understanding', 'explanation', 'learning'],
  remember: ['memory', 'retention', 'recall'],
  forget: ['memory', 'retention', 'recall'],
  study: ['learning', 'retention', 'practice'],
  studying: ['learning', 'retention', 'practice'],
  teach: ['teaching', 'explanation', 'learning'],
  onboard: ['learning', 'orientation', 'documentation'],

  // Data
  metric: ['measurement', 'kpi', 'analytics'],
  kpi: ['metric', 'measurement', 'goal'],
  data: ['analytics', 'evidence', 'measurement'],
  chart: ['analytics', 'measurement'],
  test: ['experiment', 'validation', 'evidence'],
  experiment: ['experiment', 'validation', 'test'],
  churn: ['retention', 'cohort', 'analytics'],
  retention: ['cohort', 'analytics', 'churn'],
  conversion: ['funnel', 'analytics', 'journey'],
  funnel: ['journey', 'analytics', 'dropoff'],

  // Architecture & codebase structure
  legacy: ['migration', 'refactoring', 'modernization', 'old'],
  monolith: ['architecture', 'service', 'decomposition'],
  monolithic: ['architecture', 'service', 'decomposition'],
  microservice: ['architecture', 'service', 'boundaries', 'distributed'],
  coupled: ['dependency', 'architecture', 'modularity', 'boundaries'],
  coupling: ['dependency', 'architecture', 'modularity', 'boundaries'],
  refactor: ['restructure', 'architecture', 'cleanup', 'migration'],
  spaghetti: ['coupling', 'structure', 'architecture', 'tangled'],
  testable: ['testing', 'dependency', 'isolation', 'architecture'],
  testability: ['testing', 'dependency', 'isolation', 'architecture'],
  mock: ['testing', 'dependency', 'isolation'],
  rewrite: ['migration', 'legacy', 'incremental', 'architecture'],
  boilerplate: ['abstraction', 'structure', 'ceremony'],
  framework: ['architecture', 'dependency', 'coupling'],
  database: ['persistence', 'data', 'schema'],
  sql: ['persistence', 'database', 'query'],
  orm: ['persistence', 'database', 'entity'],
  schema: ['model', 'data', 'structure'],
  api: ['interface', 'contract', 'boundaries'],
  apis: ['interface', 'contract', 'boundaries'],
  endpoint: ['api', 'interface', 'client'],
  layer: ['architecture', 'boundaries', 'structure'],
  module: ['architecture', 'boundaries', 'structure'],
  modular: ['architecture', 'boundaries', 'structure'],
  interface: ['abstraction', 'contract', 'boundaries'],
  deploy: ['operations', 'release', 'environment'],
  config: ['environment', 'deployment', 'operations'],
  configuration: ['environment', 'deployment', 'operations'],
  scale: ['scalability', 'performance', 'throughput'],
  scaling: ['scalability', 'performance', 'throughput'],
  frontend: ['ui', 'client', 'interface'],
  backend: ['service', 'api', 'server'],

  // Security & privacy
  secure: ['security', 'hardening', 'threat', 'access'],
  security: ['hardening', 'threat', 'access', 'protection'],
  insecure: ['security', 'vulnerability', 'hardening'],
  permission: ['access control', 'privilege', 'authorization'],
  privilege: ['access control', 'permissions', 'escalation'],
  admin: ['privilege', 'access control', 'permissions'],
  access: ['permissions', 'privilege', 'authorization'],
  auth: ['authentication', 'authorization', 'identity'],
  login: ['authentication', 'identity', 'access'],
  password: ['credentials', 'secrets', 'authentication'],
  credential: ['secrets', 'rotation', 'authentication'],
  secret: ['credentials', 'rotation', 'key'],
  token: ['credentials', 'authentication', 'secrets'],
  key: ['credentials', 'secrets', 'rotation'],
  leak: ['exposure', 'breach', 'secrets', 'disclosure'],
  breach: ['incident', 'exposure', 'compromise'],
  hack: ['attack', 'compromise', 'threat'],
  attack: ['threat', 'adversary', 'exploit'],
  exploit: ['attack', 'vulnerability', 'threat'],
  vulnerable: ['weakness', 'exploit', 'security'],
  vulnerability: ['weakness', 'exploit', 'security'],
  compromise: ['breach', 'attack', 'containment'],
  malicious: ['attack', 'adversary', 'abuse'],
  abuse: ['attack', 'adversary', 'misuse'],
  inject: ['validation', 'input', 'boundaries'],
  injection: ['validation', 'input', 'boundaries'],
  sanitise: ['validation', 'input', 'encoding'],
  sanitize: ['validation', 'input', 'encoding'],
  encrypt: ['confidentiality', 'security', 'data'],
  encryption: ['confidentiality', 'security', 'data'],
  audit: ['compliance', 'logging', 'controls'],
  compliance: ['audit', 'controls', 'regulation'],
  gdpr: ['privacy', 'retention', 'data'],
  privacy: ['data', 'retention', 'minimization'],
  pii: ['privacy', 'data', 'sensitive'],
  firewall: ['network', 'perimeter', 'security'],
  vpn: ['network', 'perimeter', 'access'],
  dependency: ['supply chain', 'package', 'library'],
  package: ['dependency', 'supply chain', 'library'],

  // Design
  ux: ['usability', 'design', 'experience'],
  ui: ['interface', 'design', 'usability'],
  usable: ['usability', 'heuristic', 'interface'],
  usability: ['usability', 'heuristic', 'interface'],
  design: ['interface', 'usability', 'critique'],
  wireframe: ['design', 'interface', 'prototype'],

  // Emotional / meta signals worth routing on
  anxious: ['risk', 'uncertainty', 'pre-mortem'],
  worried: ['risk', 'uncertainty', 'failure'],
  nervous: ['risk', 'uncertainty', 'caution'],
  frustrated: ['stuck', 'conflict', 'friction'],
  procrastinate: ['prioritization', 'timebox', 'focus'],
  procrastination: ['prioritization', 'timebox', 'focus'],
  busy: ['prioritization', 'focus', 'delegation'],
  business: ['prioritization', 'focus', 'delegation'],
  circles: ['stuck', 'decision', 'relitigate'],
  repeat: ['recurring', 'root', 'systemic'],
  again: ['recurring', 'root', 'systemic'],
}

/**
 * The table above, re-keyed by stem so lookups can be done on the same tokens
 * the query produces. Built once at load; several words may share a stem, in
 * which case their targets merge.
 */
const EXPANSION_INDEX: Map<string, string[]> = (() => {
  const index = new Map<string, string[]>()
  for (const [word, targets] of Object.entries(EXPANSIONS)) {
    const key = stem(SPELLING[word] ?? word)
    const existing = index.get(key)
    if (existing) {
      for (const t of targets) if (!existing.includes(t)) existing.push(t)
    } else {
      index.set(key, [...targets])
    }
  }
  return index
})()

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
    const extra = EXPANSION_INDEX.get(t)
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
