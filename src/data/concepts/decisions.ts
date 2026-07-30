import type { Concept } from '../types'

export const decisions: Concept[] = [
  {
    id: 'pre-mortem',
    name: 'Pre-mortem',
    aka: ['prospective hindsight', 'imagine it failed', 'project premortem'],
    origin: 'Gary Klein, Harvard Business Review 2007',
    domains: ['product', 'engineering', 'strategy'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Assume the project has already failed spectacularly, then work backwards to write the story of how — before you commit.',
    useWhen: [
      'the plan looks solid and nobody is objecting',
      'we are about to commit real money or time',
      'the team is too optimistic',
      'I want risks surfaced before launch not after',
      'everyone agreed too quickly',
    ],
    prompt:
      'Run a pre-mortem. It is twelve months from now and this has failed badly enough that we are writing a postmortem about it. Write that postmortem: the specific narrative of what went wrong, in order, with the moment where it became unrecoverable clearly marked. Then extract the top five failure modes, estimate likelihood and blast radius for each, and give me the cheapest early-warning signal that would tell me each one is starting.',
    variants: [
      {
        label: 'Fast version, mid-meeting',
        prompt:
          'Pre-mortem this in five bullets. Assume it failed. What is the single most likely cause, and what would we see in the first two weeks that would tell us it is happening?',
      },
      {
        label: 'When the risk is organisational rather than technical',
        prompt:
          'Pre-mortem this assuming the technology worked perfectly and it still failed. The failure must come from people, incentives, politics, timing, or attention. Write that story.',
      },
    ],
    why:
      'Prospective hindsight — imagining an outcome as already certain — measurably increases the number and specificity of causes people generate. Models show the same effect: "what could go wrong" gives you hedges, "write the postmortem" gives you a plot.',
    watchOut:
      'A pre-mortem produces a long risk list. Without the likelihood-and-blast-radius step you will just feel anxious rather than better prepared.',
    related: ['inversion', 'red-teaming', 'fmea', 'assumption-mapping', 'blameless-postmortem'],
    tags: ['risk', 'planning', 'launch', 'failure modes', 'project management'],
  },

  {
    id: 'type-1-type-2-decisions',
    name: 'Type 1 / Type 2 Decisions',
    aka: ['one-way door', 'two-way door', 'reversible decisions'],
    origin: 'Jeff Bezos, Amazon shareholder letter 1997',
    domains: ['strategy', 'product', 'engineering'],
    intents: ['decide', 'prioritize'],
    oneLiner:
      'Sort decisions by reversibility: one-way doors deserve deliberation, two-way doors deserve speed, and treating one like the other is the expensive mistake.',
    useWhen: [
      'we are spending too long on this decision',
      'I do not know how much analysis this deserves',
      'the team is deadlocked and the stakes seem low',
      'we keep escalating small decisions',
      'this feels irreversible but I am not sure it is',
    ],
    prompt:
      'Classify this decision as a one-way or two-way door. Be specific about what exactly would be hard to reverse — the code, the data model, the contract, the public commitment, or the org\'s expectations — and estimate the real cost and time to undo it. If it is mostly two-way with a small one-way component, separate the two and tell me how to move fast on the reversible part while slowing down only on the part that locks us in. Then tell me how much more analysis this decision actually warrants.',
    why:
      'The decomposition step is what makes this useful. Most decisions that feel irreversible are a fast reversible core with one small locking commitment attached — and the model will find it if you ask it to look.',
    related: ['expected-value', 'reference-class-forecasting', 'decision-matrix', 'walking-skeleton'],
    tags: ['decision making', 'reversibility', 'speed', 'leadership', 'risk'],
  },

  {
    id: 'decision-matrix',
    name: 'Weighted Decision Matrix',
    aka: ['decision matrix', 'weighted scoring', 'Pugh matrix', 'trade-off table'],
    origin: 'Stuart Pugh, design engineering',
    domains: ['product', 'engineering', 'strategy'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Score each option against explicitly weighted criteria so the trade-off is visible and arguable, rather than buried in a preference.',
    useWhen: [
      'we have several options and keep going in circles',
      'people are comparing options on different criteria',
      'I need to justify a choice to stakeholders',
      'the debate is about vibes not facts',
      'vendor selection or build versus buy',
    ],
    prompt:
      'Build a weighted decision matrix for these options. First propose the criteria and their weights and pause for me to correct them — do not score anything until I confirm the weights. Then score each option 1-5 per criterion with a one-line justification for each score, compute weighted totals, and show the table. Finally, run a sensitivity check: name the single weight I would have to change, and by how much, to flip the winner.',
    variants: [
      {
        label: 'When you suspect the matrix is post-hoc justification',
        prompt:
          'I think I already know which option I want. Build the weighted decision matrix, then tell me which weights I would have had to choose to make my preferred option lose — and whether those weights are more defensible than mine.',
      },
    ],
    why:
      'The forced pause on weights is essential. If the model picks criteria and scores in one pass, it will reverse-engineer weights that justify whichever option it described most enthusiastically.',
    watchOut:
      'Matrices launder judgement into arithmetic. The sensitivity check is what keeps them honest.',
    related: ['type-1-type-2-decisions', 'expected-value', 'rice-scoring', 'opportunity-cost'],
    tags: ['trade-offs', 'evaluation', 'vendor selection', 'build vs buy', 'criteria'],
  },

  {
    id: 'expected-value',
    name: 'Expected Value Framing',
    aka: ['EV', 'decision tree', 'probability weighted outcome'],
    origin: 'Decision theory / Pascal',
    domains: ['strategy', 'data', 'product'],
    intents: ['decide', 'estimate'],
    oneLiner:
      'Multiply each outcome by its probability so a low-odds, high-payoff bet can be compared honestly against a safe, modest one.',
    useWhen: [
      'the safe option feels right but I am not sure it is',
      'how do I compare a risky bet to a sure thing',
      'we always pick the predictable option and never grow',
      'I need to justify a speculative investment',
      'the downside scares me more than the upside excites me',
    ],
    prompt:
      'Do an expected-value analysis of these options. For each, enumerate the distinct outcomes, assign a probability and a magnitude to each, and show the EV calculation. State your probability estimates as explicit assumptions I can challenge, and flag any where you are essentially guessing. Then add the part EV misses: which option has a downside we could not survive, regardless of its expected value?',
    why:
      'Forcing the probabilities into the open converts an argument about feelings into an argument about numbers you can actually disagree with. The survivability question prevents the classic EV failure of accepting a ruinous tail.',
    watchOut:
      'Model-generated probabilities are anchored guesses, not knowledge. Treat them as a structure for your own estimates.',
    related: ['reference-class-forecasting', 'decision-matrix', 'fermi-estimation', 'second-order-thinking'],
    tags: ['probability', 'risk', 'investment', 'bets', 'quantitative'],
  },

  {
    id: 'second-order-thinking',
    name: 'Second-Order Thinking',
    aka: ['and then what', 'downstream consequences', 'second order effects'],
    origin: 'Howard Marks / systems thinking',
    domains: ['strategy', 'product', 'engineering'],
    intents: ['critique', 'decide'],
    oneLiner:
      'Ask "and then what happens?" repeatedly, because the consequences of the consequences are usually where the surprises live.',
    useWhen: [
      'this seems obviously good and I want to check',
      'what are the unintended consequences',
      'the metric will improve but I am worried about side effects',
      'this policy might get gamed',
      'everyone agrees this is a no-brainer',
    ],
    prompt:
      'Do a second- and third-order analysis of this change. First-order: the intended direct effect. Second-order: how people, teams, and systems adapt once they know this is the rule. Third-order: what that adaptation causes six to twelve months out. Pay particular attention to how someone would game it in their own rational self-interest, and to which currently-healthy behaviour this quietly stops rewarding.',
    why:
      'Models default to first-order analysis because that is what most training text contains. Explicitly numbering the orders and naming the adaptation mechanism is what surfaces the non-obvious effects.',
    related: ['inversion', 'pre-mortem', 'goodharts-law', 'theory-of-constraints'],
    tags: ['consequences', 'systems thinking', 'incentives', 'unintended effects', 'policy'],
  },

  {
    id: 'goodharts-law',
    name: "Goodhart's Law Check",
    aka: ['metric gaming', 'when a measure becomes a target', 'perverse incentives'],
    origin: 'Charles Goodhart, 1975',
    domains: ['product', 'data', 'strategy'],
    intents: ['critique', 'decide'],
    oneLiner:
      'Once a measure becomes a target it stops measuring what it did — so stress-test any metric by asking how it would be hit without the underlying good happening.',
    useWhen: [
      'we are setting a new KPI or OKR',
      'the metric went up but nothing feels better',
      'I am worried this target will be gamed',
      'the team is optimising the number not the outcome',
      'choosing success metrics for a launch',
    ],
    prompt:
      "Run a Goodhart's Law check on this metric. Assume a smart, well-meaning team is now compensated on it. List the five cheapest ways to move this number without creating any of the underlying value it is supposed to proxy for. Then propose a guardrail or paired counter-metric for each, and tell me which single pair of metrics would be hardest to game together.",
    why:
      'Framing the gamers as "smart and well-meaning" rather than malicious gets much better answers — it surfaces the realistic drift that actually happens rather than cartoon fraud.',
    related: ['second-order-thinking', 'okr-laddering', 'cohort-analysis', 'inversion'],
    tags: ['metrics', 'kpi', 'okr', 'incentives', 'measurement'],
  },

  {
    id: 'reference-class-forecasting',
    name: 'Reference Class Forecasting',
    aka: ['outside view', 'base rates', 'what usually happens'],
    origin: 'Kahneman & Tversky; Bent Flyvbjerg',
    domains: ['strategy', 'data', 'product'],
    intents: ['estimate', 'critique'],
    oneLiner:
      'Estimate by asking how similar projects actually turned out, instead of reasoning forward from the specifics of this one.',
    useWhen: [
      'our estimate feels optimistic',
      'we always run over on time and budget',
      'how long does this kind of thing usually take',
      'I need a sanity check on a forecast',
      'the plan assumes everything goes right',
    ],
    prompt:
      'Give me the outside view on this. Define the reference class — the set of comparable past efforts — as precisely as you can, state the typical outcome and spread for that class, and be explicit about the base rate of failure or overrun. Then, and only then, adjust for what is genuinely different about my case, showing the adjustment as a separate step. If my inside-view estimate differs from the base rate by more than 30%, tell me what would have to be exceptionally true about us to justify the gap.',
    why:
      'Separating the base rate from the adjustment stops the specifics of your project from dominating the estimate — which is exactly the mechanism behind the planning fallacy.',
    watchOut:
      'The model may not have reliable base rates for niche domains. Ask it to say when it is inferring rather than recalling.',
    related: ['fermi-estimation', 'expected-value', 'pre-mortem', 'critical-path'],
    tags: ['estimation', 'forecasting', 'planning fallacy', 'base rate', 'schedule'],
  },

  {
    id: 'opportunity-cost',
    name: 'Opportunity Cost Framing',
    aka: ['what are we not doing', 'cost of the road not taken'],
    origin: 'Economics',
    domains: ['strategy', 'product', 'career'],
    intents: ['decide', 'prioritize'],
    oneLiner:
      'The real cost of a choice is the best thing you gave up to make it — so evaluate options against the alternative, not against zero.',
    useWhen: [
      'everything on the roadmap looks worth doing',
      'this project is good but is it the best use of the team',
      'we say yes to too much',
      'I need to justify killing something that is working',
      'should I take this job or stay',
    ],
    prompt:
      'Analyse this in terms of opportunity cost rather than absolute value. What is the single best thing this team, budget, or my own time could be doing instead? Compare against that alternative, not against doing nothing. Then tell me what would have to be true for this to beat the alternative, and whether that is the case today.',
    why:
      'Asked whether something is worth doing, a model compares it to nothing and says yes. Naming the specific alternative changes the comparison set and produces a genuinely different answer.',
    related: ['decision-matrix', 'rice-scoring', 'cost-of-delay', 'theory-of-constraints'],
    tags: ['prioritisation', 'roadmap', 'saying no', 'resource allocation', 'trade-offs'],
  },

  {
    id: 'decision-roles-daci',
    name: 'Decision Roles (DACI / RAPID)',
    aka: ['DACI', 'RAPID', 'RACI', 'who decides'],
    origin: 'Intuit (DACI) / Bain (RAPID)',
    domains: ['strategy', 'career', 'product'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Name explicitly who drives, who approves, who contributes and who is merely informed, so the decision stops circling.',
    useWhen: [
      'this decision keeps coming back up',
      'nobody knows who actually decides',
      'too many people in the room',
      'we made a decision and someone overturned it later',
      'the meeting ended without a decision again',
    ],
    prompt:
      'Assign DACI roles for this decision: Driver, Approver, Contributors, Informed. For each role, name the specific person or role title and state what they are accountable for. Flag any place where we currently have two approvers, no driver, or contributors who believe they are approvers — those are the reasons this is stuck. Then draft the one-paragraph message the driver should send to lock it in.',
    why:
      'Decisions that keep reopening are almost always a role ambiguity rather than an information gap. Making the model assign named roles exposes the ambiguity immediately.',
    related: ['type-1-type-2-decisions', 'disagree-and-commit', 'bluf', 'decision-matrix'],
    tags: ['leadership', 'meetings', 'accountability', 'org design', 'stuck decision'],
  },

  {
    id: 'disagree-and-commit',
    name: 'Disagree and Commit',
    aka: ['commit despite disagreement', 'strong opinions loosely held'],
    origin: 'Andy Grove / Amazon leadership principle',
    domains: ['career', 'strategy'],
    intents: ['decide', 'communicate'],
    oneLiner:
      'Register your objection fully and on the record, then commit to the decision wholeheartedly so the team can move at speed.',
    useWhen: [
      'I lost the argument but still think I am right',
      'the team is relitigating a decision we already made',
      'how do I object without blocking',
      'I need to support a decision I disagree with',
    ],
    prompt:
      'Help me disagree and commit. First, write the strongest possible version of my objection — the one that would actually change a reasonable person\'s mind — in under 150 words, with the specific evidence that would prove me right. Then write the separate commitment message: unambiguous support, no hedging, no "as I said". Finally, name the concrete signal we should agree to watch that would justify reopening this, so my objection has a future without me relitigating it now.',
    why:
      'Splitting the objection and the commitment into two artefacts is the whole technique. It stops the passive-aggressive blend of the two that undermines both.',
    related: ['decision-roles-daci', 'steelmanning', 'sbi-feedback', 'bluf'],
    tags: ['leadership', 'conflict', 'teamwork', 'communication', 'alignment'],
  },
]
