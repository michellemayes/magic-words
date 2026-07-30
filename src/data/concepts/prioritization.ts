import type { Concept } from '../types'

export const prioritization: Concept[] = [
  {
    id: 'rice-scoring',
    name: 'RICE Scoring',
    aka: ['RICE', 'reach impact confidence effort'],
    origin: 'Intercom',
    domains: ['product'],
    intents: ['prioritize', 'decide'],
    oneLiner:
      'Score each item as Reach × Impact × Confidence ÷ Effort, so that scale and certainty are priced in rather than argued about.',
    useWhen: [
      'the backlog is a wish list with no order',
      'the loudest stakeholder keeps winning',
      'I need to defend my roadmap ordering',
      'everything is labelled P0',
      'quarterly planning and too many candidates',
    ],
    prompt:
      'Score these items with RICE. For each: Reach as number of users or events per quarter, Impact on the 3 / 2 / 1 / 0.5 / 0.25 scale, Confidence as a percentage with a one-line reason, and Effort in person-months. Show your inputs in a table before the scores so I can argue with the inputs rather than the ranking. Then flag any item whose ranking is driven almost entirely by a Confidence number you had no real basis for.',
    variants: [
      {
        label: 'Lighter weight — impact vs effort only',
        prompt:
          'Plot these on an impact/effort matrix. Put each item in one of four quadrants — quick wins, big bets, fill-ins, money pits — and for anything you place in "big bets", name the one experiment that would cheaply tell us whether the impact is real.',
      },
    ],
    why:
      'Demanding the raw inputs in a table before the arithmetic is what makes this useful. A RICE score presented alone is unfalsifiable; the inputs are where the actual disagreement lives.',
    watchOut:
      'RICE systematically underrates foundational work with no direct reach. Score platform items against the features they unblock.',
    related: ['moscow', 'cost-of-delay', 'opportunity-cost', 'kano-model', 'eisenhower-matrix'],
    tags: ['backlog', 'roadmap', 'prioritisation', 'product management', 'planning'],
  },

  {
    id: 'moscow',
    name: 'MoSCoW Prioritisation',
    aka: ['must should could wont', 'MoSCoW method'],
    origin: 'Dai Clegg, DSDM',
    domains: ['product', 'engineering'],
    intents: ['prioritize', 'plan'],
    oneLiner:
      'Sort scope into Must, Should, Could and Won\'t-this-time — where "Won\'t" is the category that does the actual work.',
    useWhen: [
      'we need to cut scope to hit a date',
      'the client says everything is essential',
      'defining an MVP and nobody will let go of anything',
      'I need agreement on what we are not building',
    ],
    prompt:
      'Sort this scope into MoSCoW. Apply a hard test to the Must list: if we shipped without it, does the release fail to deliver its core purpose, or is it merely worse? Anything that is merely worse is a Should. Keep Musts under 60% of total effort and tell me if I have blown that budget. Give the Won\'t-this-time list real entries with a one-line rationale each — an empty Won\'t list means the exercise did not happen.',
    why:
      'Naming the Must-list effort budget and demanding a populated Won\'t list are the two constraints that stop MoSCoW collapsing into "everything is a Must", which is its universal failure mode.',
    related: ['rice-scoring', 'mvp-riskiest-assumption', 'definition-of-done', 'timeboxing'],
    tags: ['scope', 'mvp', 'deadline', 'requirements', 'cutting scope'],
  },

  {
    id: 'eisenhower-matrix',
    name: 'Eisenhower Matrix',
    aka: ['urgent important matrix', 'urgency importance grid'],
    origin: 'Attributed to Dwight D. Eisenhower; Stephen Covey',
    domains: ['career', 'product'],
    intents: ['prioritize', 'structure'],
    oneLiner:
      'Split work by urgent versus important, because the urgent-but-unimportant quadrant is what quietly consumes the week.',
    useWhen: [
      'I am busy all day and get nothing meaningful done',
      'my calendar is full of other peoples priorities',
      'everything feels urgent',
      'I never get to the important work',
      'too many small tasks',
    ],
    prompt:
      'Sort my list into the Eisenhower matrix. Be strict about the difference between urgent and important — urgency is someone else\'s deadline, importance is my own goals. For the urgent-but-not-important quadrant, propose specifically who to delegate each item to or what would happen if it simply did not get done. Then tell me what percentage of my listed time sits in each quadrant and what that says about my week.',
    why:
      'The percentage-per-quadrant step converts a sorting exercise into a diagnosis, which is where the actual insight is.',
    related: ['moscow', 'opportunity-cost', 'rice-scoring', 'timeboxing'],
    tags: ['time management', 'productivity', 'delegation', 'focus', 'personal'],
  },

  {
    id: 'kano-model',
    name: 'Kano Model',
    aka: ['kano analysis', 'delighters and basics', 'must-be attractive one-dimensional'],
    origin: 'Noriaki Kano, 1984',
    domains: ['product', 'design'],
    intents: ['prioritize', 'ideate'],
    oneLiner:
      'Classify features as basic expectations, linear satisfiers, or delighters — because investment in each category pays back completely differently.',
    useWhen: [
      'which features actually drive satisfaction',
      'we polished something nobody noticed',
      'the product is fine but nobody loves it',
      'deciding what to invest in beyond parity',
      'competitors have features we do not and I do not know if that matters',
    ],
    prompt:
      'Classify these features using the Kano model: Must-be (absence causes anger, presence is unnoticed), One-dimensional (satisfaction scales with quality), Attractive (delighters), and Indifferent. For each, state which category and why. Then apply the decay rule: name which of today\'s delighters will be must-haves in two years, and which must-haves we are currently over-investing in past the point of diminishing return.',
    why:
      'The decay rule is the part most Kano analyses skip, and it is the part that changes a roadmap — categories migrate, and investment should migrate ahead of them.',
    related: ['rice-scoring', 'jobs-to-be-done', 'competitive-teardown', 'moscow'],
    tags: ['features', 'satisfaction', 'delight', 'product management', 'differentiation'],
  },

  {
    id: 'cost-of-delay',
    name: 'Cost of Delay',
    aka: ['CD3', 'WSJF', 'weighted shortest job first'],
    origin: 'Don Reinertsen, Principles of Product Development Flow',
    domains: ['product', 'engineering', 'strategy'],
    intents: ['prioritize', 'estimate'],
    oneLiner:
      'Price what each week of delay costs you, then divide by duration — sequencing by that ratio beats sequencing by value alone.',
    useWhen: [
      'two things are both valuable and I cannot sequence them',
      'does it matter if this slips a quarter',
      'justifying why we should do the small thing first',
      'time-sensitive opportunity versus long-term investment',
      'the deadline is arbitrary or is it',
    ],
    prompt:
      'Calculate cost of delay for each of these items. For each, express what one month of delay costs in money, market position, compounding, or risk — and classify its urgency profile as one of: standard decay, fixed-date cliff, or accelerating loss. Then divide cost of delay by duration to get CD3 and give me the resulting sequence. Highlight any item where the sequence flips versus ordering by raw value, and explain why.',
    why:
      'The urgency-profile classification is what makes deadlines arguable. Most "hard dates" turn out to be standard decay, and the few genuine cliffs deserve to dominate the sequence.',
    related: ['rice-scoring', 'opportunity-cost', 'critical-path', 'theory-of-constraints'],
    tags: ['sequencing', 'economics', 'deadline', 'flow', 'agile'],
  },

  {
    id: 'opportunity-solution-tree',
    name: 'Opportunity Solution Tree',
    aka: ['OST', 'Teresa Torres tree', 'discovery tree'],
    origin: 'Teresa Torres, Continuous Discovery Habits',
    domains: ['product', 'design'],
    intents: ['structure', 'plan', 'ideate'],
    oneLiner:
      'Connect one desired outcome to the opportunities that could move it, then to solutions and the experiments that would test them.',
    useWhen: [
      'my roadmap is a feature list not a strategy',
      'I cannot explain how this feature ladders to our goal',
      'we have lots of user research and no structure',
      'connecting discovery work to outcomes',
      'leadership asks why we are building this',
    ],
    prompt:
      'Build an opportunity solution tree. Root it in one measurable outcome. Below that, list the distinct opportunities — customer needs, pain points and desires drawn from evidence, phrased in the customer\'s language, not as solutions in disguise. Below each opportunity, two or three candidate solutions. Below each solution, the smallest experiment that would test its riskiest assumption. Flag any opportunity that is really a solution wearing a costume, and any branch resting on zero evidence.',
    why:
      'The "solution wearing a costume" check is the workhorse. Opportunity layers collapse into solution layers by default, and the tree becomes a feature list with extra steps unless you police it.',
    related: ['jobs-to-be-done', 'assumption-mapping', 'okr-laddering', 'how-might-we'],
    tags: ['discovery', 'roadmap', 'outcomes', 'product management', 'experiments'],
  },

  {
    id: 'theory-of-constraints',
    name: 'Theory of Constraints',
    aka: ['bottleneck analysis', 'the goal', 'constraint thinking'],
    origin: 'Eliyahu Goldratt, The Goal',
    domains: ['engineering', 'strategy', 'product'],
    intents: ['diagnose', 'prioritize'],
    oneLiner:
      'A system\'s throughput is set by exactly one bottleneck at a time; improvements anywhere else are illusory.',
    useWhen: [
      'we added people and did not get faster',
      'where is the actual bottleneck',
      'lots of local optimisation with no overall improvement',
      'the pipeline is slow but every stage looks fine',
      'we are busy but not shipping',
    ],
    prompt:
      'Apply the Theory of Constraints to this system. Identify the single binding constraint on throughput and give me the evidence that points at it rather than the alternatives. Then work the five steps: exploit it (get more from it without new resources), subordinate everything else to it, elevate it (spend money), and predict where the constraint will move once this one is relieved. Be explicit about which of my proposed improvements are targeting non-constraints and would therefore produce no throughput gain at all.',
    why:
      'The last clause is the payoff. Models will happily bless a list of sensible-sounding improvements; asking which ones are aimed at non-constraints kills most of the list and saves the quarter.',
    related: ['cost-of-delay', 'critical-path', 'root-cause-fishbone', 'second-order-thinking'],
    tags: ['bottleneck', 'throughput', 'process', 'efficiency', 'systems thinking'],
  },
]
