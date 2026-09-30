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

  {
    id: 'ideal-customer-profile',
    name: 'Ideal Customer Profile',
    aka: ['ICP', 'customer profiling', 'target account profile', 'best-fit customer'],
    origin: 'B2B sales and account-based marketing',
    domains: ['strategy', 'product'],
    intents: ['prioritize', 'reframe'],
    oneLiner:
      'Describe the kind of organisation that gets the most value from you and is cheapest to win and keep, based on your best existing customers rather than on who might conceivably buy.',
    useWhen: [
      'we sell to anyone who will pay and it is exhausting',
      'our sales pipeline is full of deals that never close',
      'who should we actually be targeting',
      'some customers churn fast and others stay forever',
      'marketing and sales disagree about who the customer is',
    ],
    prompt:
      'Build an ideal customer profile from our actual customer base, not from aspiration. Split customers into the best (retain, expand, cheap to serve, refer others) and the worst (churn, heavy support, long sales cycles, discount-driven), and find the observable attributes that separate the two groups: industry, size, tech stack, the trigger event that made them buy, who championed it, and the problem they had. Keep only attributes a salesperson could check before the first call. Then write the profile as qualifying criteria, and the disqualifiers that should end a deal early.',
    why:
      'Left alone, a model writes an aspirational persona that fits everyone. Anchoring on the contrast between best and worst customers, and restricting to attributes checkable before a call, makes the profile something that changes who gets pursued.',
    watchOut:
      'An ICP built from a small or early customer base describes who found you first, not who you serve best. Revisit it as the base grows.',
    related: ['playing-to-win', 'blue-ocean-errc', 'competitive-teardown'],
    tags: ['sales', 'marketing', 'targeting', 'go to market', 'customers', 'profiling'],
  },

  {
    id: 'porter-five-forces',
    name: 'Porter\'s Five Forces',
    aka: ['five forces', 'industry analysis', 'industry attractiveness', 'Porter'],
    origin: 'Michael Porter, Harvard Business Review, 1979',
    domains: ['strategy', 'product'],
    intents: ['diagnose', 'decide'],
    oneLiner:
      'Explain an industry\'s profitability through five pressures: rivalry, buyer power, supplier power, the threat of substitutes, and the threat of new entrants.',
    useWhen: [
      'is this market actually worth entering',
      'everyone in this industry seems to make thin margins',
      'our customers keep squeezing us on price',
      'a big supplier could raise prices and we would be stuck',
      'why are some industries so much more profitable than others',
    ],
    prompt:
      'Run a five forces analysis on this industry, from the point of view of a typical company in it rather than ours alone. For each force (rivalry among existing competitors, bargaining power of buyers, bargaining power of suppliers, threat of substitutes, threat of new entrants), rate it high, medium or low and give the specific structural reason, such as concentration, switching costs, capital requirements, differentiation or regulation. Substitutes means different products that do the same job, not direct competitors. Then say which one or two forces set the ceiling on profitability, how each is likely to shift over the next three to five years, and where our position lets us escape or reshape the strongest force.',
    why:
      'Asked about a market, a model lists competitors and trends. Naming the five forces and demanding a structural cause for each rating moves it from who is in the market to why money is or is not made there, and asking which forces set the ceiling stops it treating all five as equally important.',
    watchOut:
      'It describes an industry, not a company, and it is a snapshot. Pair it with a view of your own advantages and of where the industry is heading, or it will tell you a market is hard without saying what to do.',
    related: ['seven-powers', 'competitive-teardown', 'blue-ocean-errc', 'wardley-mapping'],
    tags: ['competition', 'market analysis', 'industry structure', 'pricing power', 'strategy'],
  },

  {
    id: 'seven-powers',
    name: '7 Powers',
    aka: ['Seven Powers', 'Hamilton Helmer', 'durable competitive advantage', 'moat', 'moats'],
    origin: 'Hamilton Helmer, 7 Powers: The Foundations of Business Strategy (2016)',
    domains: ['strategy', 'product'],
    intents: ['critique', 'decide'],
    oneLiner:
      'A durable advantage needs both a benefit that raises cash flow and a barrier that stops competitors copying it, and there are only seven kinds: scale economies, network economies, counter-positioning, switching costs, branding, cornered resource and process power.',
    useWhen: [
      'what actually stops a competitor from copying us',
      'investors keep asking about our defensibility',
      'we are winning now but I am not sure it will last',
      'a bigger company could build this in a quarter',
      'is our advantage real or are we just early',
    ],
    prompt:
      'Assess our strategic position using Hamilton Helmer\'s 7 Powers. For each of the seven (scale economies, network economies, counter-positioning, switching costs, branding, cornered resource, process power), say whether we have it, are building it, or do not have it. Where you say we have it, name both halves: the benefit, meaning how it improves our cash flow, and the barrier, meaning why a well-funded competitor cannot or will not copy it. If you cannot name the barrier, it is not a power. Then say which power is realistic to build at our stage: counter-positioning and cornered resource during origination, scale, network economies and switching costs during takeoff, branding and process power once stable. End with the biggest threat to it.',
    why:
      'Models call anything good a moat. Requiring both a benefit and a barrier for each claimed power, and saying outright that a missing barrier disqualifies it, filters out operating strengths like a good team or fast shipping that competitors can match.',
    watchOut:
      'Most early companies honestly have no power yet. The useful output then is which one to build, not a flattering reading of the current position.',
    related: ['porter-five-forces', 'flywheel-effect', 'competitive-teardown', 'playing-to-win', 'wardley-mapping'],
    tags: ['moat', 'competitive advantage', 'defensibility', 'strategy', 'investing'],
  },

  {
    id: 'flywheel-effect',
    name: 'Flywheel Effect',
    aka: ['flywheel', 'virtuous cycle', 'Amazon flywheel', 'reinforcing loop'],
    origin: 'Jim Collins, Good to Great; Amazon\'s growth napkin sketch',
    domains: ['strategy', 'product'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Describe the business as a closed loop of steps where each one feeds the next, so effort compounds instead of having to be restarted every quarter.',
    useWhen: [
      'every quarter we start growth from scratch',
      'we run lots of initiatives and none of them build on each other',
      'how do the parts of our business reinforce each other',
      'growth only happens when we spend on ads',
      'explaining to the board why this investment compounds',
    ],
    prompt:
      'Draw our business as a flywheel. Give four to six steps in a closed loop, where each step causes the next and the last feeds back into the first, and write the causal link on each arrow as a testable claim, such as "more sellers leads to more selection". Mark which arrows we have evidence for and which are hopes. Identify the step where a push produces the most rotation, and any step that currently leaks energy out of the loop. Then list our current initiatives and say which push a step on the wheel and which sit outside it, since those are the candidates to stop.',
    why:
      'A flywheel prompt on its own yields a tidy diagram with vague arrows. Making each arrow a testable causal claim flagged by evidence, then sorting current initiatives against the loop, turns it into a prioritisation tool rather than a slide.',
    watchOut:
      'Loops drawn after the fact always look inevitable. If no arrow can be measured, the flywheel is a story, and the causal links are what to test first.',
    related: ['seven-powers', 'north-star-metric', 'second-order-thinking', 'playing-to-win'],
    tags: ['growth', 'compounding', 'systems thinking', 'business model', 'strategy'],
  },

  {
    id: 'north-star-metric',
    name: 'North Star Metric',
    aka: ['NSM', 'north star', 'one metric that matters', 'OMTM'],
    origin: 'Growth practice, popularised by Sean Ellis and Amplitude',
    domains: ['product', 'strategy', 'data'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Pick the one measure that best captures the value customers get from the product, and tie it to a few input metrics that teams can actually move.',
    useWhen: [
      'we track forty metrics and nobody knows which matters',
      'every team optimises a different number',
      'revenue is up but I am not sure customers are getting value',
      'what should be the main number on our dashboard',
      'teams cannot connect their work to company results',
    ],
    prompt:
      'Help me choose a north star metric. Propose three candidates and test each against these criteria: it reflects value the customer receives rather than value we extract, it leads revenue rather than lagging it, it can visibly move within weeks, and it cannot easily be inflated in ways that hurt customers. Reject revenue, signups and page views unless you can argue otherwise. For the best candidate, break it into three to five input metrics that specific teams can own, and show the causal link from each input to the north star. Finish with the counter-metric we should watch so the north star is not gamed.',
    why:
      'Without criteria, a model suggests daily active users for everything. The value-received and leading-indicator tests rule out vanity numbers, and asking for input metrics and a counter-metric makes the result usable by teams and guards against Goodhart effects.',
    watchOut:
      'One number simplifies; it does not replace judgement. A business with very different customer types may need one per product line.',
    related: ['goodharts-law', 'okr-laddering', 'flywheel-effect', 'opportunity-solution-tree'],
    tags: ['metrics', 'kpi', 'alignment', 'product management', 'growth'],
  },

  {
    id: 'value-proposition-canvas',
    name: 'Value Proposition Canvas',
    aka: ['VPC', 'customer profile and value map', 'jobs pains gains', 'Strategyzer canvas'],
    origin: 'Alexander Osterwalder et al., Value Proposition Design (Strategyzer)',
    domains: ['product', 'strategy', 'design'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Map a customer segment\'s jobs, pains and gains against the product\'s pain relievers and gain creators, and check where the two sides actually fit.',
    useWhen: [
      'our pitch describes features and customers shrug',
      'I cannot explain why someone would switch to us',
      'the landing page copy lists everything the product does',
      'we built it and now need to work out who it is for',
      'checking whether the product solves a problem people care about',
    ],
    prompt:
      'Build a value proposition canvas for this product and one specific customer segment. On the customer side, list their jobs (functional, social, emotional), their pains and their gains, ranked by how much the customer cares, based on the evidence I gave you and marking anything you assumed. On the product side, list the products and services, the pain relievers and the gain creators. Then draw the fit explicitly by connecting each reliever or creator to the pain or gain it addresses. Report the high-ranked pains and gains that nothing addresses, and the features that address nothing the customer ranked highly. Close with a one-sentence value proposition built only from connections that held.',
    why:
      'Filling two columns is easy and says nothing. The value is in the fit check, so the prompt asks for explicit connections and for both kinds of mismatch, unmet high-priority pains and features serving nobody, which is where the product or the pitch has to change.',
    watchOut:
      'A canvas filled from the team\'s imagination rather than customer evidence just confirms the product. Mark the assumptions and go test them.',
    related: ['jobs-to-be-done', 'ideal-customer-profile', 'kano-model', 'assumption-mapping'],
    tags: ['positioning', 'product market fit', 'customers', 'messaging', 'product strategy'],
  },
]
