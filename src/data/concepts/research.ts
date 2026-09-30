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

  {
    id: 'the-mom-test',
    name: 'The Mom Test',
    aka: ['customer discovery interviews', 'non-leading interview questions', 'problem interviews'],
    origin: 'Rob Fitzpatrick, The Mom Test (2013)',
    domains: ['research', 'product'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Ask about the specifics of what people did in the past, never whether they like your idea, because even your mother will lie to be kind.',
    useWhen: [
      'everyone I pitched said they would use it and then nobody signed up',
      'customer calls feel encouraging but I learn nothing',
      'writing questions for validation interviews with potential users',
      'people keep saying it sounds great and I do not trust it',
      'how do I talk to customers without leading them',
    ],
    prompt:
      'Rewrite my customer interview plan so it passes the Mom Test. First, list every question I drafted that mentions my idea, asks about the future ("would you", "will you"), or asks for an opinion, and explain what a polite person would answer. Then replace each with a question about a specific past event: the last time the problem happened, what they did about it, what it cost them, and what they have already tried or paid for. Add two questions that probe for commitment, such as time, money, or an introduction. Finish with a short list of signals that count as real evidence versus compliments, fluff, and hypothetical promises, so I can score each call afterwards.',
    why:
      'Models default to survey-style questions about preferences because that is what most question lists look like. Naming the three failure types (mentions the idea, asks about the future, asks for opinion) gives the model a filter it can apply line by line, and the evidence-versus-compliment list turns fuzzy calls into something you can score.',
    watchOut:
      'It tells you whether a problem is real and painful, not whether your particular solution is right. You still need a prototype or a pre-sale for that.',
    related: ['jobs-to-be-done', 'mvp-riskiest-assumption', 'assumption-mapping', 'affinity-mapping'],
    tags: ['customer interviews', 'user research', 'validation', 'discovery', 'startups'],
  },

  {
    id: 'affinity-mapping',
    name: 'Affinity Mapping',
    aka: ['affinity diagram', 'KJ method', 'thematic clustering', 'sticky note synthesis'],
    origin: 'Jiro Kawakita, KJ method (1960s)',
    domains: ['research', 'product', 'design'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Break qualitative notes into single observations, then cluster them bottom-up by similarity and name each cluster only after it forms.',
    useWhen: [
      'I have forty pages of interview notes and no idea what they say',
      'how do I turn a pile of user feedback into themes',
      'the research readout is just a list of quotes',
      'hundreds of support tickets and open-ended survey answers to make sense of',
      'we did the interviews and now need to find patterns',
    ],
    prompt:
      'Synthesise these notes with affinity mapping. Step one: split everything into atomic observations, one idea each, keeping a source tag (participant or ticket id) on every one, and quote rather than paraphrase where the wording matters. Step two: group observations by similarity without using any categories decided in advance; let the groups emerge from the notes. Step three: name each group with a sentence that states the insight, not a one-word topic. Step four: group the groups into a few higher themes. For every theme, report how many distinct sources support it, list the observations that did not fit anywhere, and flag any theme resting on a single loud source.',
    why:
      'Asked to "find themes", a model imposes familiar categories (usability, pricing, performance) and then fills them. Forcing atomic notes first and naming groups last keeps the structure coming from the data, and the source counts stop one vivid quote from becoming a headline finding.',
    watchOut:
      'Frequency is not importance. A theme mentioned by two people can matter more than one mentioned by twenty, so weigh severity separately.',
    related: ['triangulation', 'jobs-to-be-done', 'user-journey-mapping', 'the-mom-test', 'diary-study'],
    tags: ['synthesis', 'qualitative research', 'user research', 'themes', 'interview notes'],
  },

  {
    id: 'survivorship-bias',
    name: 'Survivorship Bias',
    aka: ['missing bullet holes', 'silent evidence', 'survivor bias', 'Wald\'s bombers'],
    origin: 'Abraham Wald\'s WWII aircraft armour analysis; Nassim Taleb\'s "silent evidence"',
    domains: ['research', 'data', 'strategy'],
    intents: ['critique', 'reframe'],
    oneLiner:
      'Drawing conclusions only from the cases that made it through a filter, while the failures that would contradict you are invisible.',
    useWhen: [
      'every successful founder I read about dropped out of college',
      'we only surveyed current customers about why they chose us',
      'the playbook comes from studying the companies that won',
      'old buildings were built better than new ones',
      'our long-time users love the feature so it must be good',
    ],
    prompt:
      'Check this conclusion for survivorship bias. First, name the filter: what process decided which cases ended up in the data I am looking at, such as churn, failure, deletion, or not responding. Second, describe the missing population: who or what went through the same process and did not survive, and roughly how large that group is. Third, ask whether the trait I am crediting was also common among the failures; if it was, it cannot explain success. Fourth, tell me where I could actually find data on the non-survivors (exit surveys, archived records, cancelled accounts, failed competitors). End with a rewritten version of my claim that only says what the surviving data supports.',
    why:
      'Survivorship is hard to spot because the evidence against you is absent rather than wrong. Making the model name the filter and estimate the missing group forces it to reason about data that is not in front of it, which it will not do unprompted.',
    watchOut:
      'Sometimes the survivors are the right population, for example when you only care about serving the customers you keep. Decide which question you are asking first.',
    related: ['confounders-check', 'regression-to-the-mean', 'reference-class-forecasting', 'triangulation'],
    tags: ['bias', 'statistics', 'selection effects', 'critical thinking', 'data'],
  },

  {
    id: 'regression-to-the-mean',
    name: 'Regression to the Mean',
    aka: ['reversion to the mean', 'regression toward mediocrity', 'sophomore slump'],
    origin: 'Francis Galton (1886); popularised by Daniel Kahneman',
    domains: ['data', 'research'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'Extreme results partly reflect luck, so the next measurement tends to land closer to average whether or not anything changed.',
    useWhen: [
      'we intervened on the worst performing stores and they all improved',
      'the rep with the best quarter had a terrible one after',
      'praising people seems to make them worse and criticism makes them better',
      'the fix worked on the teams with the worst scores',
      'last month was a record and this month it dropped back',
    ],
    prompt:
      'Before crediting the change, check whether this is regression to the mean. Tell me how the cases were selected and whether they were picked because their first measurement was extreme. Estimate how noisy the metric is from period to period, using the data I have or a range if I do not. Work out roughly how much movement toward the average we would expect with no intervention at all. Then tell me what comparison would separate the effect from the rebound: a similar extreme group that was not treated, a randomised holdout, or a longer baseline. State plainly how much of the observed improvement is left once expected rebound is subtracted.',
    why:
      'The intervention story is always more compelling than noise, and a model asked "did it work?" will usually find reasons it did. Asking for the expected rebound as a number makes the null explanation compete on equal terms instead of being mentioned and dismissed.',
    watchOut:
      'Regression does not mean nothing happened. It means the before-and-after on an extreme group cannot tell you; a control group can.',
    related: ['confounders-check', 'survivorship-bias', 'pre-registration', 'falsification-test'],
    tags: ['statistics', 'noise', 'experiments', 'performance reviews', 'bias'],
  },

  {
    id: 'simpsons-paradox',
    name: 'Simpson\'s Paradox',
    aka: ['Yule-Simpson effect', 'aggregation reversal', 'the trend flips when you split it'],
    origin: 'Edward Simpson (1951), earlier Udny Yule and Karl Pearson',
    domains: ['data', 'research'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'A relationship that holds in every subgroup can reverse when the groups are pooled, because the groups differ in size and base rate.',
    useWhen: [
      'variant B wins on mobile and on desktop but loses overall',
      'each department admits women at a higher rate but the university admits fewer',
      'the new treatment looks worse in total but better for every patient type',
      'the numbers point opposite ways depending on how I slice them',
      'which version of this breakdown should I believe',
    ],
    prompt:
      'Check this comparison for Simpson\'s paradox. Build the table both ways: pooled, and split by the most plausible grouping variable, with counts and rates in each cell. Show whether the direction of the effect changes. If it does, explain the mechanism in one paragraph: which group is over-represented on which side, and why its base rate drags the total. Then answer the part people skip: given how the grouping variable relates to the treatment (does it cause the treatment, or is it caused by it?), tell me whether the pooled or the split answer is the right one to act on, and why.',
    why:
      'Most explanations stop at "it reverses", which leaves you with two contradictory numbers. Asking which level to trust, based on the causal role of the grouping variable, is what turns the paradox into a decision.',
    watchOut:
      'Splitting by every variable you can find will eventually produce a reversal by chance. Pick the grouping for a causal reason before you look.',
    related: ['cohort-analysis', 'confounders-check', 'regression-to-the-mean', 'pre-registration'],
    tags: ['statistics', 'ab testing', 'aggregation', 'analytics', 'paradox'],
  },

  {
    id: 'pre-registration',
    name: 'Pre-registration',
    aka: ['analysis plan up front', 'pre-specified success criteria', 'registered report', 'decide the bar before you look'],
    origin: 'Clinical trial registration; adopted in psychology after the replication crisis',
    domains: ['research', 'data', 'product'],
    intents: ['plan', 'critique'],
    oneLiner:
      'Write down the hypothesis, the metric, the analysis and what counts as success before seeing any results, so the data cannot quietly move the goalposts.',
    useWhen: [
      'every experiment we run somehow ends up counting as a win',
      'we keep slicing the results until something looks significant',
      'the success metric changed after the launch numbers came in',
      'planning an A/B test and want it to be honest',
      'the team argues about what the result means after every test',
    ],
    prompt:
      'Help me pre-register this experiment before any data comes in. Produce a one-page plan with: the hypothesis in one sentence; the single primary metric and exactly how it is computed; any secondary metrics, labelled as exploratory; the sample size or run length and why; exclusions decided now (bots, internal users, outliers); the analysis method; and the decision rule, stated as "if the primary metric moves by at least X we ship, if it is below Y we stop, otherwise we do Z". List the subgroup cuts we are allowed to report as findings and say that any other cut is a lead for a new test, not a result. Then point out anything in my plan still vague enough to be decided after the fact.',
    why:
      'A model helping analyse results will happily find the angle that works, because that is what it is asked for. Having it write the decision rule first, with numbers, gives both of you something fixed to check the result against, and the "still vague" pass catches loopholes.',
    watchOut:
      'Pre-registration does not ban exploration; it labels it. Keep exploring, just do not present exploratory cuts as confirmed.',
    related: ['falsification-test', 'goodharts-law', 'simpsons-paradox', 'regression-to-the-mean'],
    tags: ['experiments', 'ab testing', 'p-hacking', 'research methods', 'success criteria'],
  },

  {
    id: 'diary-study',
    name: 'Diary Study',
    aka: ['experience sampling', 'longitudinal user research', 'in-context logging'],
    origin: 'HCI and social science field research; experience sampling method (Csikszentmihalyi)',
    domains: ['research', 'product', 'design'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Participants log short entries in the moment over days or weeks, capturing behaviour and context that a single interview or session cannot recall.',
    useWhen: [
      'people cannot remember how they actually use the product day to day',
      'the problem only shows up over weeks, not in one session',
      'usability tests look fine but real usage tells a different story',
      'I want to see habits forming or dropping off over time',
      'the task happens at home or on the move, not in front of us',
    ],
    prompt:
      'Design a diary study for this research question. Specify: the question in one sentence and what decision it feeds; who to recruit and how many, allowing for dropout; duration and why; the entry trigger (event-based, such as each time they do the task, or signal-based, such as a daily prompt); the entry format, kept under two minutes, with the exact prompts and whether photos or screenshots are wanted; how we keep people engaged mid-study; and the kickoff and exit interviews. Give me a draft of the first three prompts and flag any that ask people to interpret rather than report what happened. End with how we will analyse the entries.',
    why:
      'Left open, a model designs a survey spread over time, with long retrospective questions. Separating the trigger, the two-minute format and the report-not-interpret check keeps the study close to the moment, which is the point of doing one.',
    watchOut:
      'Diary studies are expensive in participant effort and dropout is high. Keep entries short and pay people to stay to the end, or the late data comes only from enthusiasts.',
    related: ['affinity-mapping', 'user-journey-mapping', 'the-mom-test', 'triangulation', 'jobs-to-be-done'],
    tags: ['user research', 'longitudinal', 'qualitative research', 'field study', 'behaviour'],
  },
]
