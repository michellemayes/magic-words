import type { Concept } from '../types'

export const critique: Concept[] = [
  {
    id: 'red-teaming',
    name: 'Red Teaming',
    aka: ['adversarial review', 'attack this', 'devils advocate team'],
    origin: 'Military wargaming; adopted in security and policy',
    domains: ['security', 'engineering', 'strategy', 'product'],
    intents: ['critique'],
    oneLiner:
      'Assign someone the explicit job of attacking the plan as an intelligent adversary, rather than hoping objections surface politely.',
    useWhen: [
      'I want the holes found before my boss finds them',
      'the proposal has had no real pushback',
      'everyone is being too nice about this',
      'security or abuse review',
      'stress-test my argument before I present it',
    ],
    prompt:
      'Red team this. You are a hostile, well-resourced, technically competent critic whose reputation depends on finding the fatal flaw. Attack the weakest assumption first, not the easiest one. Give me your five strongest attacks in descending order of how much damage they do, and for each: the specific failure it causes, how plausible it actually is, and what a competent defender would say in response. Do not soften anything and do not end with encouragement.',
    variants: [
      {
        label: 'For a document about to be reviewed',
        prompt:
          'Read this as the most skeptical person in the review meeting. List every question you would ask that the document cannot currently answer, ordered by how badly it would derail the meeting. For each, draft the sentence I should add to pre-empt it.',
      },
      {
        label: 'For security or abuse',
        prompt:
          'Red team this from an abuse perspective. Assume a motivated bad actor with a normal user account and no special access. Walk me through the three most damaging things they could do, step by step, and what control breaks each chain earliest and cheapest.',
      },
    ],
    why:
      'The explicit "no encouragement" clause matters more than it looks — models default to a compliment sandwich that dilutes the critique into advice you can comfortably ignore.',
    watchOut:
      'Red teams generate volume. Insist on the ordering and plausibility rating or you will treat a far-fetched attack as equal to a likely one.',
    related: ['threat-modeling-stride', 'pre-mortem', 'steelmanning', 'inversion', 'assumption-mapping'],
    tags: ['critique', 'review', 'security', 'stress test', 'adversarial'],
  },

  {
    id: 'steelmanning',
    name: 'Steelmanning',
    aka: ['steel man', 'strongest version of the argument', 'opposite of strawman'],
    origin: 'Rationalist community; contrast with "straw man"',
    domains: ['strategy', 'writing', 'career'],
    intents: ['critique', 'communicate'],
    oneLiner:
      'Construct the strongest possible version of the opposing view — stronger than its actual advocates state it — before responding to it.',
    useWhen: [
      'I think the other side is obviously wrong',
      'I need to write a convincing counter-argument',
      'preparing for a debate or a difficult review',
      'I want to check whether I am strawmanning',
      'the disagreement keeps repeating without progress',
    ],
    prompt:
      'Steelman the position I disagree with. Build the strongest, most charitable version — stronger than its actual advocates usually manage — assuming the people who hold it are intelligent and have information I might lack. State what they would have to believe about the world for their position to be clearly correct. Then tell me honestly: which parts of the steelman are actually right, and what is the narrowest remaining point of genuine disagreement?',
    why:
      'The "narrowest remaining disagreement" step is the useful output. Most disputes shrink to a single empirical question once both sides are stated at full strength, and finding that question is what unblocks the conversation.',
    related: ['red-teaming', 'socratic-questioning', 'disagree-and-commit', 'falsification-test'],
    tags: ['argument', 'debate', 'persuasion', 'empathy', 'critical thinking'],
  },

  {
    id: 'assumption-mapping',
    name: 'Assumption Mapping',
    aka: ['riskiest assumption test', 'RAT', 'assumption grid'],
    origin: 'David Bland, Testing Business Ideas',
    domains: ['product', 'design', 'strategy'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Plot every assumption by importance and by evidence, and test the one that is both load-bearing and unevidenced first.',
    useWhen: [
      'what should we validate first',
      'we are about to build something on a guess',
      'the business case rests on numbers we made up',
      'how do we de-risk this cheaply',
      'the plan assumes users will do something they have never done',
    ],
    prompt:
      'Map the assumptions behind this. Extract every assumption, including the ones stated so confidently they no longer look like assumptions, and sort them into desirability, viability, feasibility and usability. Plot each on two axes: how load-bearing it is (does the whole thing collapse if it is false?) and how much evidence we actually have. Give me the top three in the high-importance / low-evidence quadrant, and for each, the cheapest and fastest test that could falsify it in under two weeks.',
    why:
      'The instruction to catch assumptions "stated so confidently they no longer look like assumptions" is what surfaces the dangerous ones. The obvious assumptions are rarely the ones that kill you.',
    related: ['pre-mortem', 'falsification-test', 'mvp-riskiest-assumption', 'opportunity-solution-tree'],
    tags: ['validation', 'risk', 'experiments', 'de-risking', 'startup'],
  },

  {
    id: 'falsification-test',
    name: 'Falsification Test',
    aka: ['what would change my mind', 'disconfirming evidence', 'Popper test'],
    origin: 'Karl Popper',
    domains: ['research', 'data', 'strategy'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'State in advance what evidence would prove you wrong — a belief with no possible disconfirming evidence is not a belief, it is a commitment.',
    useWhen: [
      'I might be fooling myself about this',
      'everyone on the team already agrees',
      'we keep finding evidence that supports our view',
      'how do I know if my hypothesis is right',
      'is this strategy actually working',
    ],
    prompt:
      'Apply a falsification test to this claim. State precisely what observation would prove it false, with a threshold specific enough that we would agree in advance on what counts. Then tell me whether that evidence is something we could actually go and collect, and by when. If no observation could falsify the claim, say so plainly and tell me what unfalsifiable thing I am actually asserting.',
    why:
      'Pre-registering the disconfirming threshold is what stops post-hoc reinterpretation. Once the number is written down, a miss is a miss.',
    related: ['assumption-mapping', 'steelmanning', 'confounders-check', 'red-teaming'],
    tags: ['hypothesis', 'evidence', 'confirmation bias', 'science', 'rigour'],
  },

  {
    id: 'socratic-questioning',
    name: 'Socratic Questioning',
    aka: ['socratic method', 'question me instead of answering'],
    origin: 'Socrates via Plato',
    domains: ['learning', 'strategy', 'meta'],
    intents: ['explain', 'critique'],
    oneLiner:
      'Progress by disciplined questioning rather than assertion, so the reasoning gets examined instead of the conclusion being handed over.',
    useWhen: [
      'I want to understand this myself not be told the answer',
      'stop giving me answers and make me think',
      'help me find the flaw in my own reasoning',
      'I am studying and want to be tested',
      'coaching someone through a problem',
    ],
    prompt:
      'Use the Socratic method with me on this. Ask one question at a time and wait for my answer before the next. Target the assumption my position most depends on, and follow my answers rather than a script. Do not tell me your conclusion, do not answer your own questions, and do not lead me to a predetermined destination — if my reasoning holds, say so and stop.',
    why:
      '"One question at a time and wait" is the load-bearing instruction. Without it a model produces a list of twelve Socratic questions, which is a quiz, not a dialogue.',
    watchOut:
      'Slow by design. Use the direct answer when you need the answer.',
    related: ['feynman-technique', 'steelmanning', 'interview-me-first', 'five-whys'],
    tags: ['learning', 'coaching', 'questioning', 'critical thinking', 'teaching'],
  },

  {
    id: 'fmea',
    name: 'Failure Mode and Effects Analysis',
    aka: ['FMEA', 'failure modes', 'RPN analysis'],
    origin: 'US military, 1949; adopted in aerospace and automotive',
    domains: ['engineering', 'design'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Enumerate every way each component can fail, score severity, likelihood and detectability, and fix in order of the product.',
    useWhen: [
      'what could break in this system',
      'designing something safety or money critical',
      'we need a systematic reliability review',
      'which failures should we actually guard against',
      'pre-launch readiness review',
    ],
    prompt:
      'Run an FMEA on this design. For each component or step, list the ways it can fail, the effect of each failure on the user or the system, and the cause. Score severity, occurrence and detectability from 1 to 10, and compute the risk priority number. Sort by RPN and give me the top failure modes with a specific mitigation for each. Call out any failure mode with high severity but low detectability separately — those are the ones that hurt most regardless of RPN.',
    why:
      'The low-detectability callout corrects RPN\'s known weakness: a rare, severe, silent failure scores mid-table and gets ignored, and that is exactly the outage that ruins a quarter.',
    watchOut:
      'FMEA is heavy. For a two-week feature, a pre-mortem gets you 80% of the value in 20 minutes.',
    related: ['pre-mortem', 'red-teaming', 'inversion', 'observability-triage'],
    tags: ['reliability', 'risk', 'safety', 'engineering', 'quality'],
  },

  {
    id: 'blind-spot-audit',
    name: 'Blind Spot Audit',
    aka: ['what am I not asking', 'unknown unknowns', 'negative space review'],
    origin: 'Adapted from intelligence analysis practice',
    domains: ['strategy', 'research', 'meta'],
    intents: ['critique', 'reframe'],
    oneLiner:
      'Ask what is conspicuously absent from your own analysis — the questions not asked, the stakeholders not consulted, the data not gathered.',
    useWhen: [
      'what am I missing',
      'I feel like there is something I have not thought of',
      'before I finalise this I want a sanity check',
      'we have analysed this to death and it still feels off',
      'what questions should I be asking',
    ],
    prompt:
      'Audit this for blind spots. Do not critique what I wrote — instead tell me what is conspicuously missing: which stakeholder\'s perspective never appears, which time horizon I have ignored, which failure mode I have not mentioned, which data I would need but have not gathered, and which question a domain expert would ask in the first two minutes that I have not addressed anywhere. Rank them by how much my conclusion would change if I had that information.',
    why:
      'Directing the model at absence rather than content is a genuinely different query, and it returns different results. Critique-what-is-there and name-what-is-missing pull from different places.',
    related: ['red-teaming', 'assumption-mapping', 'triangulation', 'interview-me-first'],
    tags: ['gaps', 'unknown unknowns', 'review', 'completeness', 'perspective'],
  },

  {
    id: 'design-critique',
    name: 'Structured Design Critique',
    aka: ['I like I wish what if', 'crit', 'feedback protocol'],
    origin: 'Stanford d.school feedback protocol',
    domains: ['design', 'writing', 'product'],
    intents: ['critique', 'communicate'],
    oneLiner:
      'Separate feedback into what works, what does not, and what could be — so critique stays actionable and does not collapse into taste.',
    useWhen: [
      'I need feedback on a design',
      'the review turned into people restating their preferences',
      'how do I critique someone\'s work without crushing them',
      'running a design review',
      'feedback keeps being vague',
    ],
    prompt:
      'Critique this using the I Like / I Wish / What If protocol. Under "I like", name what is working and the principle that makes it work, not just praise. Under "I wish", state each problem in terms of the user\'s experience rather than your preference, and tie it to a specific heuristic or goal. Under "What if", propose alternatives that are genuinely different in approach rather than variations on the same idea. Then rank everything under "I wish" by impact on the primary user task.',
    why:
      'Requiring the *principle* behind each like and the *heuristic* behind each wish is what converts taste into critique. Without it, you get an opinion in a nicer format.',
    related: ['heuristic-evaluation', 'red-teaming', 'sbi-feedback', 'rubric-grading'],
    tags: ['design review', 'feedback', 'critique', 'ux', 'collaboration'],
  },
]
