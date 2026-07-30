import type { Concept } from '../types'

export const research: Concept[] = [
  {
    id: 'fermi-estimation',
    name: 'Fermi Estimation',
    aka: ['back of the envelope', 'order of magnitude estimate', 'guesstimate'],
    origin: 'Enrico Fermi',
    domains: ['data', 'strategy', 'engineering'],
    intents: ['estimate'],
    oneLiner:
      'Decompose an unknowable quantity into factors you can each estimate within an order of magnitude, so the errors partly cancel.',
    useWhen: [
      'how big is this market really',
      'I need a rough number and have no data',
      'is this even worth investigating properly',
      'how much traffic or load should we design for',
      'sizing an opportunity from nothing',
    ],
    prompt:
      'Do a Fermi estimate for this. Decompose it into factors, each of which you can estimate within an order of magnitude, and show the chain multiplicatively. State each input as a range rather than a point, and say where each came from — recalled figure, inference, or pure guess. Give me a low, central and high result. Then tell me which single input the answer is most sensitive to, because that is the only one worth researching properly.',
    why:
      'Labelling each input as recalled / inferred / guessed is what makes a model-generated estimate usable. Without it, a confidently stated fabricated constant sits in the middle of the chain and you cannot tell.',
    watchOut:
      'Treat the arithmetic as sound and the constants as suspect. Verify the sensitive input before acting on the number.',
    related: ['reference-class-forecasting', 'expected-value', 'sensitivity-analysis'],
    tags: ['estimation', 'market sizing', 'napkin math', 'quantitative', 'capacity planning'],
  },

  {
    id: 'sensitivity-analysis',
    name: 'Sensitivity Analysis',
    aka: ['what if analysis', 'tornado chart', 'which assumption matters'],
    origin: 'Operations research / financial modelling',
    domains: ['data', 'strategy'],
    intents: ['estimate', 'critique'],
    oneLiner:
      'Vary each input in turn to see which ones actually move the output — most do not, and knowing which do tells you where to spend effort.',
    useWhen: [
      'my model has twenty assumptions and I do not know which matter',
      'the business case is very sensitive to something and I am not sure what',
      'which number should I go and validate',
      'the forecast changes wildly with small tweaks',
      'defending a financial model in a review',
    ],
    prompt:
      'Run a sensitivity analysis on this model. Vary each input across its plausible range while holding the others at their central values, and rank the inputs by how much they move the final output — a tornado ranking. Separate the inputs we can actually influence from the ones we merely observe. Then identify the break-even value of the top driver: the point at which the conclusion flips, and whether that value is inside or outside the plausible range.',
    why:
      'The break-even framing converts an anxious model into a single testable question: is the driver above or below this number? That is usually a researchable fact.',
    related: ['fermi-estimation', 'expected-value', 'decision-matrix', 'falsification-test'],
    tags: ['modelling', 'assumptions', 'financial model', 'forecast', 'analysis'],
  },

  {
    id: 'triangulation',
    name: 'Triangulation',
    aka: ['multiple methods', 'converging evidence', 'cross-validation of sources'],
    origin: 'Social science methodology (Norman Denzin)',
    domains: ['research', 'data', 'product'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Approach a question by several independent methods; agreement is evidence, and disagreement is a finding in itself.',
    useWhen: [
      'the survey says one thing and the analytics say another',
      'how confident should I be in this finding',
      'I only have one source for this',
      'user interviews contradict the usage data',
      'validating a research conclusion',
    ],
    prompt:
      'Triangulate this question. Name three genuinely independent ways to get at it — different in method and in failure mode, not just different datasets — such as behavioural data, direct qualitative evidence, and a market or comparative signal. For each, state what it would show if my hypothesis were true and what it would show if it were false. Then tell me what it means if they disagree: which source is most likely to be biased in which direction, and what the disagreement itself would reveal.',
    why:
      'Insisting the methods differ in failure mode, not just in dataset, is what makes triangulation real. Three sources sharing one bias is one source.',
    related: ['falsification-test', 'confounders-check', 'blind-spot-audit', 'differential-diagnosis'],
    tags: ['research methods', 'validation', 'evidence', 'user research', 'confidence'],
  },

  {
    id: 'confounders-check',
    name: 'Confounders & Selection Bias Check',
    aka: ['correlation is not causation', 'selection bias', 'lurking variable', 'survivorship bias'],
    origin: 'Statistics / causal inference',
    domains: ['data', 'research', 'product'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Before believing a relationship is causal, hunt for the third variable, the selection effect, and the survivors you never observed.',
    useWhen: [
      'the A/B test shows a lift and I am suspicious',
      'users who do X retain better so should we push X',
      'is this correlation actually causal',
      'our best customers all do this thing',
      'the analysis looks too good',
    ],
    prompt:
      'Stress-test this causal claim. Identify plausible confounders — variables that could cause both the treatment and the outcome. Check for selection effects: who ended up in each group and why, and whether that assignment is related to the outcome. Check for survivorship: whose data is missing entirely because they churned, failed, or never showed up. Check for reverse causation. For each threat you find, tell me the specific check or cut of the data that would rule it out, and rank them by how likely they are to be what is actually happening here.',
    why:
      'The four named threats form a checklist. Asked generically whether a finding is causal, a model hedges; asked to check four specific mechanisms, it finds the one that applies.',
    related: ['triangulation', 'falsification-test', 'cohort-analysis', 'goodharts-law'],
    tags: ['statistics', 'causality', 'ab testing', 'analytics', 'bias'],
  },

  {
    id: 'cohort-analysis',
    name: 'Cohort & Segment Decomposition',
    aka: ['cohort analysis', 'segmentation', "Simpson's paradox check", 'slice the metric'],
    origin: 'Growth analytics practice',
    domains: ['data', 'product'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Break an aggregate metric into cohorts by join date, segment or behaviour — averages hide the mechanism and sometimes invert the sign.',
    useWhen: [
      'the metric is flat but something must be happening underneath',
      'retention looks stable and I do not believe it',
      'why did the average change',
      'growth is up but revenue is not',
      'the overall number hides two opposite trends',
    ],
    prompt:
      'Decompose this metric into cohorts and segments. Cut it by acquisition period, by segment, and by behavioural tier, and tell me which cut is most likely to be informative given what I have described. Explicitly check for Simpson\'s paradox — a case where every subgroup moves one way while the aggregate moves the other, usually because the mix shifted. Distinguish mix effects (the composition changed) from rate effects (behaviour changed within groups), since they need completely different responses. Tell me which cut to look at first and what pattern would confirm each explanation.',
    why:
      'The mix-versus-rate distinction is the actionable output. "Retention dropped" has one fix; "we acquired a worse mix" has an entirely different one, and the aggregate looks identical.',
    related: ['confounders-check', 'goodharts-law', 'triangulation', 'sensitivity-analysis'],
    tags: ['analytics', 'metrics', 'retention', 'growth', 'segmentation'],
  },

  {
    id: 'literature-scan',
    name: 'Structured Literature Scan',
    aka: ['landscape review', 'prior art search', 'has this been solved'],
    origin: 'Systematic review methodology',
    domains: ['research', 'engineering', 'strategy'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Map what is already known on a question — the consensus, the live disagreements, and the genuine gaps — before adding to it.',
    useWhen: [
      'has someone already solved this',
      'I am new to this field and need the lay of the land',
      'what is the state of the art here',
      'I do not want to reinvent something',
      'preparing a technical evaluation of an unfamiliar area',
    ],
    prompt:
      'Give me a structured landscape of this area. Cover: the settled consensus, the live disagreements and what each camp believes, the standard approaches with their known trade-offs, and the genuine open problems. Separate what is well-established from what is contested from what you are inferring — and mark anything you are not confident is real, including whether a named source might not exist. Then tell me the three things I should read or try first, and what question each would answer.',
    why:
      'Splitting settled / contested / inferred is essential when a model is the one doing the scan. Without it, a confident summary flattens a live controversy into false consensus.',
    watchOut:
      'Verify citations independently. Treat this as a map of the terrain, not as sourcing.',
    related: ['triangulation', 'competitive-teardown', 'analogical-mapping', 'blind-spot-audit'],
    tags: ['research', 'prior art', 'state of the art', 'literature', 'orientation'],
  },
]
