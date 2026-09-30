import type { Concept } from '../types'

export const framing: Concept[] = [
  {
    id: 'abstraction-laddering',
    name: 'Abstraction Laddering',
    aka: ['abstraction ladder', 'why-how ladder', 'zoom out zoom in'],
    origin: 'Design thinking / Hasso Plattner Institute',
    domains: ['product', 'design', 'strategy'],
    intents: ['reframe', 'ideate'],
    oneLiner:
      'Take a problem statement and move it up the ladder by asking "why?" to widen it, or down by asking "how?" to make it concrete — then pick the rung with the best solution space.',
    useWhen: [
      'my problem statement feels too narrow',
      'we jumped straight to a solution',
      'the feature request is really a symptom of something bigger',
      'I only have one idea and it feels obvious',
      'the scope is either enormous or trivially small',
      'stakeholders are arguing about the solution instead of the problem',
      'the PRD reads like a spec not a rationale',
    ],
    prompt:
      'Run an abstraction ladder on this problem statement. Go up three rungs by repeatedly asking "why do we want this?" and down three rungs by asking "how could we do this?". Show the ladder as a list from most abstract to most concrete. Then tell me which rung is the right altitude to solve at and why, and what solution space opens up at that rung that is invisible at the one I started on.',
    variants: [
      {
        label: 'You suspect the ask is too small',
        prompt:
          'Ladder this feature request up two levels of abstraction. At each level, state the problem in one sentence and name one solution that only becomes visible at that level. End with the level I should actually be writing the PRD against.',
      },
      {
        label: 'You suspect the ask is too vague',
        prompt:
          'This goal is stated too abstractly to act on. Ladder it down by asking "how?" until each leaf is something a team could start on Monday. Show it as a tree, and flag any branch where the "how" is actually an unvalidated assumption.',
      },
    ],
    why:
      'Naming the ladder forces the model to generate the intermediate framings rather than answering at whatever altitude your question happened to land on. Most weak AI output is not wrong — it is pitched at the wrong level of abstraction.',
    watchOut:
      'Laddering up too far produces platitudes ("we want to delight users"). Cap it at three rungs and insist each rung stays falsifiable.',
    related: ['five-whys', 'jobs-to-be-done', 'how-might-we', 'first-principles'],
    tags: ['problem framing', 'altitude', 'scope', 'product management', 'reframing'],
  },

  {
    id: 'five-whys',
    name: 'Five Whys',
    aka: ['5 whys', 'why chain', 'root cause laddering'],
    origin: 'Toyota Production System (Sakichi Toyoda)',
    domains: ['engineering', 'product', 'strategy'],
    intents: ['diagnose', 'reframe'],
    oneLiner:
      'Ask "why did that happen?" five times in sequence, so each answer becomes the next question, until you reach a cause worth fixing rather than a symptom worth patching.',
    useWhen: [
      'we keep fixing the same thing over and over',
      'the fix worked but the problem came back',
      'the incident report stops at the proximate cause',
      'I want to know the real reason not the surface reason',
      'the bug is fixed but I do not understand why it happened',
    ],
    prompt:
      'Run a Five Whys on this. Each "why" must take the previous answer as its subject, not restart from the original problem. Stop early if you hit a cause that is outside our control and say so. At the end, separate the chain into proximate cause, contributing causes, and the systemic cause — and propose one fix at each level, noting which one actually prevents recurrence.',
    variants: [
      {
        label: 'For a process or org problem, not a bug',
        prompt:
          'Five Whys this, but treat each answer as a system-design question rather than a person-blame question. If any link in the chain reduces to "someone should have been more careful", reject it and dig for the structural reason that behaviour was rational at the time.',
      },
    ],
    why:
      'Without the explicit chain instruction, models answer "why?" five times against the *original* problem and produce five parallel guesses. Insisting that each why chains off the previous answer is what makes it a root-cause tool.',
    watchOut:
      'Five Whys yields a single causal line. Real incidents usually have several. Pair it with a fishbone if the failure had multiple contributing factors.',
    related: ['root-cause-fishbone', 'blameless-postmortem', 'abstraction-laddering', 'chestertons-fence'],
    tags: ['root cause', 'incident', 'debugging', 'recurring problem', 'systems thinking'],
  },

  {
    id: 'jobs-to-be-done',
    name: 'Jobs To Be Done',
    aka: ['JTBD', 'job story', 'hiring a product', 'milkshake framework'],
    origin: 'Clayton Christensen / Tony Ulwick',
    domains: ['product', 'design', 'strategy'],
    intents: ['reframe', 'ideate', 'communicate'],
    oneLiner:
      'Describe what progress the user is trying to make and in what circumstance, rather than who they are demographically or which feature they asked for.',
    useWhen: [
      'our personas are not helping us build anything',
      'users asked for a feature but I do not know what they actually want',
      'I cannot tell who our real competitor is',
      'the roadmap is a list of features with no throughline',
      'we keep building things people say they want and do not use',
    ],
    prompt:
      'Reframe this as a set of Jobs To Be Done. For each job use the format "When [situation], I want to [motivation], so I can [expected outcome]". Focus on the progress the person is trying to make, not their demographics. Then for each job list: what they hire today instead (including non-obvious substitutes and doing nothing), the forces pushing them to switch, and the anxieties holding them back.',
    variants: [
      {
        label: 'Turning a feature request into a job',
        prompt:
          'A user asked for this specific feature. Work backwards to the job they were hiring it for. Give me three candidate jobs that would explain the request, and for each, a different feature that would serve it better than what they asked for.',
      },
    ],
    why:
      'The "when / I want to / so I can" template is a hard structural constraint. It blocks the model from sliding back into demographic personas, which is its default and the least useful answer.',
    watchOut:
      'JTBD is weak for infrastructure and platform work where the "user" is a system. Do not force it.',
    related: ['abstraction-laddering', 'how-might-we', 'user-journey-mapping', 'working-backwards'],
    tags: ['product management', 'user research', 'personas', 'discovery', 'customer needs'],
  },

  {
    id: 'how-might-we',
    name: 'How Might We',
    aka: ['HMW', 'opportunity statement'],
    origin: 'Procter & Gamble, popularised by IDEO',
    domains: ['design', 'product'],
    intents: ['reframe', 'ideate'],
    oneLiner:
      'Convert a problem or insight into an optimistically-phrased question that is broad enough to invite many solutions but narrow enough to give direction.',
    useWhen: [
      'I have research findings and do not know what to do with them',
      'the problem statement is a complaint not a brief',
      'brainstorms keep going nowhere',
      'the question is so big nobody knows where to start',
    ],
    prompt:
      'Turn this insight into a set of How Might We questions. Give me three at different scopes: one too narrow (solution smuggled in), one too broad (unactionable), and three in the useful middle. For each of the useful ones, explain what kind of solution it invites and what it rules out. Flag any HMW that has a solution hidden inside the question.',
    why:
      'Asking for the deliberately-too-narrow and too-broad versions gives the model an explicit calibration range, which produces sharper middle options than asking for good ones directly.',
    watchOut:
      'HMW without a real insight behind it generates pleasant-sounding nonsense. Anchor it to an actual observation.',
    related: ['jobs-to-be-done', 'abstraction-laddering', 'crazy-eights', 'design-critique'],
    tags: ['ideation', 'design thinking', 'brainstorming', 'workshop', 'problem framing'],
  },

  {
    id: 'first-principles',
    name: 'First Principles Thinking',
    aka: ['reasoning from first principles', 'reduction to fundamentals'],
    origin: 'Aristotle; modernised by Feynman and Musk',
    domains: ['engineering', 'strategy', 'product'],
    intents: ['reframe', 'ideate'],
    oneLiner:
      'Strip an argument down to the facts that must be true regardless of convention, then rebuild upward — discarding everything inherited by analogy.',
    useWhen: [
      'everyone says this is just how it is done',
      'we are copying a competitor without knowing why',
      'the constraint might not be a real constraint',
      'the cost seems fixed but I suspect it is not',
      'best practice is not working for us',
    ],
    prompt:
      'Reason about this from first principles. First, list every assumption embedded in how it is currently done, and label each one as a law of physics, an economic constraint, a regulatory requirement, or merely a convention. Discard the conventions. Then rebuild the solution using only what survived, and tell me explicitly what becomes possible that the conventional approach forecloses.',
    why:
      'The label-then-discard step is doing the work. Without it, models restate the conventional approach in more confident language and call it first principles.',
    watchOut:
      'Conventions often encode hard-won knowledge. Run Chesterton\'s Fence on anything you are about to discard.',
    related: ['chestertons-fence', 'inversion', 'abstraction-laddering', 'theory-of-constraints'],
    tags: ['fundamentals', 'assumptions', 'innovation', 'constraints', 'contrarian'],
  },

  {
    id: 'chestertons-fence',
    name: "Chesterton's Fence",
    aka: ['why is this here', 'do not remove what you do not understand'],
    origin: 'G.K. Chesterton, 1929',
    domains: ['engineering', 'strategy', 'product'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Before removing something that looks pointless, establish why it was put there — the reason is often invisible precisely because the thing is working.',
    useWhen: [
      'this code looks useless and I want to delete it',
      'why does this weird process exist',
      'we want to remove a rule nobody can justify',
      'this seems like obvious tech debt but I am nervous',
      'the previous team did something strange here',
    ],
    prompt:
      "Apply Chesterton's Fence to this before I remove it. Generate the most plausible reasons it was originally added, ranked by likelihood, including reasons that would no longer be visible in the current system (a bug that has since been fixed elsewhere, a customer who has since churned, a platform limitation that has since lifted). For each, tell me the specific evidence I could go look for to confirm or rule it out. Only then give me your recommendation.",
    why:
      'Models are agreeable and will happily endorse a deletion you propose. Framing it as a fence inverts the burden of proof and forces the generation of counter-evidence before the recommendation.',
    related: ['first-principles', 'pre-mortem', 'five-whys', 'assumption-mapping'],
    tags: ['refactoring', 'tech debt', 'legacy code', 'caution', 'deletion'],
  },

  {
    id: 'xy-problem',
    name: 'The XY Problem',
    aka: ['asking about the attempted solution', 'X Y problem'],
    origin: 'Usenet / sysadmin folklore',
    domains: ['engineering', 'meta'],
    intents: ['reframe', 'diagnose'],
    oneLiner:
      'You ask about your attempted solution Y instead of your actual problem X, so all the help you get is aimed at the wrong thing.',
    useWhen: [
      'I am fighting the tool instead of solving the problem',
      'the answers I get are technically correct but useless',
      'I have been stuck on this approach for hours',
      'my question keeps getting weird answers',
      'I am asking how to do something awkward',
    ],
    prompt:
      'Before answering, check whether I am asking an XY problem. Restate what I appear to be trying to accomplish at the level above my question. If my actual goal could be reached a different way, tell me that first and answer my literal question second. If my question genuinely is the right question, say so and just answer it.',
    why:
      'This is the single highest-leverage instruction to keep in a system prompt. It licenses the model to overrule the framing of your question, which it will otherwise almost never do.',
    watchOut:
      'Sometimes you really do just want the literal answer. The "answer it second" clause keeps you from losing it.',
    related: ['abstraction-laddering', 'interview-me-first', 'rubber-duck-debugging', 'five-whys'],
    tags: ['stuck', 'wrong question', 'debugging', 'asking for help', 'prompting'],
  },

  {
    id: 'inversion',
    name: 'Inversion',
    aka: ['via negativa', 'invert always invert', 'thinking backwards'],
    origin: 'Carl Jacobi; popularised by Charlie Munger',
    domains: ['strategy', 'product', 'engineering'],
    intents: ['critique', 'ideate'],
    oneLiner:
      'Instead of asking how to succeed, ask how to guarantee failure — then systematically avoid those things.',
    useWhen: [
      'I cannot see what could go wrong',
      'the plan looks good and that worries me',
      'I want a different angle on this problem',
      'success criteria are fuzzy but failure would be obvious',
      'I need to find the risks nobody has named',
    ],
    prompt:
      'Invert this problem. Instead of asking how to make it succeed, ask: what would I do if I wanted to guarantee this fails badly? Give me the ten most effective ways to sabotage it. Then, for each, tell me honestly whether we are currently doing some version of it — and rank those by how much of the failure risk they account for.',
    why:
      '"How do we succeed" pulls generic best practice out of a model. "How do we guarantee failure" pulls specific, concrete, memorable failure modes, because destruction is easier to reason about concretely than construction.',
    related: ['pre-mortem', 'red-teaming', 'first-principles', 'fmea'],
    tags: ['risk', 'failure modes', 'mental model', 'contrarian', 'planning'],
  },

  {
    id: 'six-thinking-hats',
    name: 'Six Thinking Hats',
    aka: ['de Bono hats', 'parallel thinking', 'thinking hats'],
    origin: 'Edward de Bono, Six Thinking Hats (1985)',
    domains: ['strategy', 'product', 'career'],
    intents: ['critique', 'ideate', 'structure'],
    oneLiner:
      'Look at a problem in six separate modes in turn (facts, feelings, risks, benefits, new ideas and process) so everyone thinks in the same direction at once instead of arguing across modes.',
    useWhen: [
      'our meetings turn into one person attacking and another defending',
      'we only ever talk about why an idea will not work',
      'I want to look at this proposal from every angle',
      'feelings about the plan are driving the debate but nobody says so',
      'the discussion jumps between data, opinions and ideas',
    ],
    prompt:
      'Examine this using the Six Thinking Hats, one hat at a time in separate sections. White: the facts and figures we have, and the information we are missing. Red: gut reactions and feelings, stated without justification. Black: risks, weaknesses and why it might fail. Yellow: benefits and why it might work, argued as seriously as the risks. Green: alternatives, new ideas and changes, including ones that answer the black-hat points. Blue: a summary of what the other hats showed, the decision or next step it points to, and which hat deserves more time. Keep each hat to its own mode; a risk that turns up under yellow belongs under black.',
    why:
      'An open "evaluate this" produces a blended pros and cons list that leans toward whichever mode the model starts in. Separating the hats, and requiring yellow to be argued as seriously as black, gives optimism and emotion equal airtime, and the blue hat forces a conclusion.',
    watchOut:
      'On a simple question it produces six thin sections. Use it for contested proposals or group discussions, not for questions with a clear answer.',
    related: ['red-teaming', 'steelmanning', 'crazy-eights', 'decision-matrix'],
    tags: ['meetings', 'perspective', 'facilitation', 'brainstorming', 'group thinking'],
  },

  {
    id: 'scamper',
    name: 'SCAMPER',
    aka: ['substitute combine adapt modify', 'Osborn checklist', 'idea checklist'],
    origin: 'Bob Eberle (1971), building on Alex Osborn\'s brainstorming checklist',
    domains: ['product', 'design', 'strategy'],
    intents: ['ideate'],
    oneLiner:
      'Generate variations on an existing product or process by running it through seven prompts: substitute, combine, adapt, modify, put to another use, eliminate, and reverse.',
    useWhen: [
      'we need to improve the product but have run out of ideas',
      'how can we make this existing thing different',
      'the brainstorm keeps producing the same three suggestions',
      'I want to rework an old service rather than start from scratch',
      'looking for new uses for something we already have',
    ],
    prompt:
      'Apply SCAMPER to this, one letter at a time, with at least two concrete ideas per letter. Substitute: a component, material, person or step we could swap. Combine: what could merge with it, including another product or process. Adapt: what idea from another industry or context we could borrow. Modify: what could be made bigger, smaller, faster or different in form. Put to another use: who else or what else it could serve. Eliminate: what could be removed entirely. Reverse or rearrange: what order, role or direction could be flipped. Make each idea specific to this case, not a generic category. Then pick the three most promising and say what would need to be true for each to work.',
    why:
      'An open request for ideas returns the most probable suggestions, which are the obvious ones. Seven fixed lenses with two ideas each push the model into less likely territory, and banning generic categories stops filler like "combine it with AI" that fills a letter without saying anything.',
    watchOut:
      'It works on something that already exists. For a blank-slate problem, reframe first with how might we or jobs to be done.',
    related: ['crazy-eights', 'how-might-we', 'blue-ocean-errc', 'first-principles', 'six-thinking-hats'],
    tags: ['brainstorming', 'innovation', 'creativity', 'ideation', 'product improvement'],
  },
]
