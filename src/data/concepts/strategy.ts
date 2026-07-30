import type { Concept } from '../types'

export const strategy: Concept[] = [
  {
    id: 'playing-to-win',
    name: 'Playing To Win Cascade',
    aka: ['strategy choice cascade', 'where to play how to win', 'Lafley Martin'],
    origin: 'A.G. Lafley & Roger Martin',
    domains: ['strategy', 'product'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Strategy is five linked choices: winning aspiration, where to play, how to win, capabilities required, and management systems — each constraining the next.',
    useWhen: [
      'our strategy is a list of goals not a strategy',
      'we say we will win by being the best which is not a strategy',
      'writing an annual strategy document',
      'the team cannot explain what we do not do',
      'everything in the plan is a priority',
    ],
    prompt:
      'Put this through the Playing To Win cascade: winning aspiration, where to play, how to win, what capabilities must be in place, and what management systems are required. Apply the hard test at each level — if the opposite of a choice would be absurd, it is not a choice, it is a platitude, and you should call it out and push me to make a real one. "Where to play" must name what we are explicitly not playing in. "How to win" must explain why we win specifically, in a way a competitor could not simply copy next quarter.',
    why:
      'The "if the opposite is absurd it is not a choice" test is the single most useful strategy heuristic, and models will apply it rigorously when asked — including to their own suggestions.',
    related: ['wardley-mapping', 'okr-laddering', 'competitive-teardown', 'opportunity-cost'],
    tags: ['strategy', 'positioning', 'annual planning', 'choices', 'leadership'],
  },

  {
    id: 'wardley-mapping',
    name: 'Wardley Mapping',
    aka: ['value chain evolution map', 'Wardley map', 'genesis to commodity'],
    origin: 'Simon Wardley',
    domains: ['strategy', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Chart your value chain against evolutionary maturity — genesis, custom, product, commodity — to see what to build, buy, or outsource, and where the landscape is moving.',
    useWhen: [
      'should we build this or buy it',
      'where is our actual differentiation',
      'we are building things that should be commodities',
      'the technology landscape is shifting under us',
      'making an architecture decision with strategic implications',
    ],
    prompt:
      'Build a Wardley map for this. Start from the user need at the top and chain down through the components required to meet it. Place each component on the evolution axis: genesis, custom-built, product or rental, or commodity or utility. Then tell me: which components are we custom-building that are actually commodities (waste), which are commodities we should be consuming, and which single component is mid-evolution — because that is where the strategic opportunity and the strategic risk both sit. Note where the map suggests we will be in two years if current evolution continues.',
    why:
      'The evolution axis is what makes this different from an architecture diagram. It tells you where the landscape moves, not just what exists today.',
    watchOut:
      'The notation takes a while to click. Ask for a plain-language walkthrough of the map alongside it the first few times.',
    related: ['playing-to-win', 'theory-of-constraints', 'competitive-teardown', 'first-principles'],
    tags: ['strategy', 'build vs buy', 'architecture', 'evolution', 'value chain'],
  },

  {
    id: 'okr-laddering',
    name: 'OKR Laddering',
    aka: ['goal cascade', 'objectives and key results', 'line of sight'],
    origin: 'Andy Grove at Intel; John Doerr',
    domains: ['strategy', 'product', 'career'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Connect a qualitative objective to measurable key results, and verify each level actually ladders to the one above rather than merely sitting under it.',
    useWhen: [
      'our OKRs are just a list of projects',
      'I cannot explain how my team goal connects to the company goal',
      'key results that are really tasks',
      'writing quarterly goals',
      'the team is busy and nothing moves the company metric',
    ],
    prompt:
      'Ladder these OKRs. For each objective, check that it is qualitative, time-bound and genuinely motivating. For each key result, check it measures an outcome rather than the completion of an activity — if it can be satisfied by shipping something regardless of whether anything improved, rewrite it. Then verify the ladder upward: for each key result, state the causal claim that links it to the parent objective, and flag any where that link is a hope rather than a mechanism. Finish by naming which key result would be hardest to hit and whether that is because it is ambitious or because it is outside our control.',
    why:
      'Forcing the causal claim to be stated explicitly is what exposes goals that merely sit under a parent without moving it — the near-universal OKR failure.',
    related: ['playing-to-win', 'goodharts-law', 'opportunity-solution-tree', 'backcasting'],
    tags: ['okr', 'goals', 'alignment', 'quarterly planning', 'metrics'],
  },

  {
    id: 'competitive-teardown',
    name: 'Competitive Teardown',
    aka: ['competitor analysis', 'teardown', 'why did they build it that way'],
    origin: 'Product and design practice',
    domains: ['product', 'design', 'strategy'],
    intents: ['critique', 'ideate'],
    oneLiner:
      'Analyse a competitor\'s product for the decisions behind it and the constraints those decisions reveal — not for a feature checklist.',
    useWhen: [
      'what are our competitors doing',
      'they have a feature we do not and I do not know if it matters',
      'evaluating a rival product',
      'we keep copying features without understanding why',
      'preparing a competitive positioning doc',
    ],
    prompt:
      'Tear this competitor down by decision rather than by feature. For each significant choice they made, infer what they must believe about their user, their business model, or their constraints for that choice to be rational. Identify what they have deliberately chosen not to do and what that reveals about their strategy. Then tell me which of their choices are genuinely load-bearing versus cosmetic, and which of their constraints we do not share — because those gaps are where we can do something they cannot follow.',
    why:
      'Inferring beliefs from choices produces strategy; listing features produces a roadmap of catch-up work. The "constraints we do not share" question is where the actual opportunity is.',
    related: ['playing-to-win', 'wardley-mapping', 'kano-model', 'blue-ocean-errc'],
    tags: ['competition', 'market analysis', 'positioning', 'benchmarking', 'product strategy'],
  },

  {
    id: 'blue-ocean-errc',
    name: 'ERRC Grid (Eliminate-Reduce-Raise-Create)',
    aka: ['blue ocean strategy', 'ERRC', 'value curve'],
    origin: 'W. Chan Kim & Renée Mauborgne',
    domains: ['strategy', 'product', 'design'],
    intents: ['ideate', 'decide'],
    oneLiner:
      'Rather than beating competitors on the industry\'s standard factors, decide which to eliminate, reduce, raise, and which new ones to create.',
    useWhen: [
      'we are competing on the same axes as everyone else',
      'the market is commoditised and margins are dying',
      'how do we differentiate meaningfully',
      'feature parity is a treadmill',
      'looking for a genuinely different angle',
    ],
    prompt:
      'Build an ERRC grid for this. First list the factors the whole industry competes on and rate everyone on them — that is the current value curve. Then: which factors can we eliminate entirely that the industry takes for granted, which can we reduce well below standard, which should we raise well above standard, and which factors that the industry has never offered should we create? Be aggressive about the eliminate column, since it is the one that makes the economics work and the one everyone skips. Then state which customer segment would find the resulting curve compelling and which would defect.',
    why:
      'The eliminate column is where the differentiation and the margin both come from, and it is the column every team avoids. Naming that avoidance in the prompt is what gets real answers.',
    related: ['competitive-teardown', 'kano-model', 'inversion', 'playing-to-win'],
    tags: ['differentiation', 'innovation', 'positioning', 'strategy', 'commoditisation'],
  },
]
