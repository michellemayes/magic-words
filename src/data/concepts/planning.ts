import type { Concept } from '../types'

export const planning: Concept[] = [
  {
    id: 'walking-skeleton',
    name: 'Walking Skeleton',
    aka: ['tracer bullet', 'thin vertical slice', 'end to end first'],
    origin: 'Alistair Cockburn; tracer bullets from The Pragmatic Programmer',
    domains: ['engineering', 'product'],
    intents: ['plan', 'reframe'],
    oneLiner:
      'Build the thinnest possible end-to-end path through every layer of the system first, then thicken it — rather than completing one layer at a time.',
    useWhen: [
      'where do I even start on this build',
      'we built the backend for months and integration broke everything',
      'the architecture is unproven',
      'how do I sequence a big technical project',
      'I want to de-risk the integration early',
    ],
    prompt:
      'Design a walking skeleton for this. Define the thinnest end-to-end path that touches every architectural layer and every system boundary while doing something trivially small but real. Specify what is deliberately fake, hardcoded or stubbed in v1 and what must be genuinely real from day one — the rule being that anything carrying integration risk must be real. Then give me the order in which to thicken each slice, riskiest integration first.',
    why:
      '"Anything carrying integration risk must be real" is the discriminator that makes this different from an MVP. It puts the unknowns in week one instead of week ten.',
    related: ['mvp-riskiest-assumption', 'work-breakdown-structure', 'critical-path', 'timeboxing'],
    tags: ['architecture', 'sequencing', 'integration', 'engineering', 'de-risking'],
  },

  {
    id: 'mvp-riskiest-assumption',
    name: 'Riskiest Assumption First',
    aka: ['MVP scoping', 'RAT over MVP', 'minimum viable test'],
    origin: 'Lean startup lineage; refined by Rik Higham',
    domains: ['product', 'design'],
    intents: ['plan', 'prioritize'],
    oneLiner:
      'Build the smallest thing that tests your riskiest assumption — which is often not a product at all.',
    useWhen: [
      'what should the MVP actually be',
      'our MVP is turning into a full product',
      'how do we test this cheaply before building',
      'we do not know if anyone wants this',
      'six months of build before any signal',
    ],
    prompt:
      'Scope this by riskiest assumption rather than by minimum feature set. Identify the single assumption that, if false, makes the whole thing pointless. Then design the cheapest test of that specific assumption — and consider tests that are not products at all: a landing page, a concierge service done manually, a sales conversation, an ad, a spreadsheet. Give me three options at different cost levels, what each would actually prove, and the decision threshold that would make me stop.',
    why:
      'Pushing explicitly for non-product tests is what breaks the reflex to answer "MVP" with a smaller version of the thing you already wanted to build.',
    related: ['assumption-mapping', 'walking-skeleton', 'moscow', 'opportunity-solution-tree'],
    tags: ['mvp', 'lean startup', 'validation', 'experiments', 'scoping'],
  },

  {
    id: 'work-breakdown-structure',
    name: 'Work Breakdown Structure',
    aka: ['WBS', 'task decomposition', 'break it down'],
    origin: 'Project management (US DoD, 1960s)',
    domains: ['engineering', 'product'],
    intents: ['plan', 'structure', 'estimate'],
    oneLiner:
      'Decompose deliverables hierarchically until every leaf is small enough to estimate confidently and assign to one owner.',
    useWhen: [
      'this project is too big to think about',
      'I need to estimate something large',
      'where do we start and who does what',
      'the ticket is enormous and needs splitting',
      'planning a quarter of work',
    ],
    prompt:
      'Build a work breakdown structure for this. Decompose by deliverable rather than by activity, and keep going until every leaf is something one person could finish in under three days. Apply the 100% rule: the children of any node must fully account for that node with nothing missing and nothing extra. Then flag the leaves you are least confident about and say whether the uncertainty is scope, technical unknown, or dependency on someone else — and mark which leaves are actually spikes rather than build work.',
    why:
      'The 100% rule is what catches the missing work. Without it, decomposition produces a plausible-looking tree that quietly omits migration, rollback, and everything that is not the happy path.',
    related: ['critical-path', 'walking-skeleton', 'definition-of-done', 'timeboxing'],
    tags: ['planning', 'estimation', 'decomposition', 'project management', 'tasks'],
  },

  {
    id: 'critical-path',
    name: 'Critical Path Analysis',
    aka: ['CPM', 'critical path method', 'dependency chain', 'longest path'],
    origin: 'DuPont / Remington Rand, 1957',
    domains: ['engineering', 'product', 'strategy'],
    intents: ['plan', 'prioritize', 'estimate'],
    oneLiner:
      'Find the longest chain of dependent tasks: it sets the minimum duration, and only shortening it moves the date.',
    useWhen: [
      'can we hit this date',
      'what should we start first',
      'where should I add people to go faster',
      'the schedule keeps slipping and I do not know why',
      'which of these tasks actually matter to the deadline',
    ],
    prompt:
      'Do a critical path analysis. Build the dependency graph, identify the longest chain, and give me the minimum achievable duration. Show which tasks have slack and how much. Then tell me: which single task on the critical path would most shorten the schedule if compressed, which off-path tasks I am currently over-resourcing for no schedule benefit, and where an external dependency — a vendor, an approval, another team — sits on the path, since those are the ones I cannot fix by working harder.',
    why:
      'The external-dependency callout is where schedules actually die. Internal tasks can be compressed; a legal review or a partner integration cannot, and it needs to be started far earlier than its position in the plan suggests.',
    related: ['work-breakdown-structure', 'theory-of-constraints', 'cost-of-delay', 'reference-class-forecasting'],
    tags: ['schedule', 'dependencies', 'deadline', 'project management', 'planning'],
  },

  {
    id: 'definition-of-done',
    name: 'Definition of Done / Acceptance Criteria',
    aka: ['DoD', 'acceptance criteria', 'given when then', 'gherkin'],
    origin: 'Scrum; Given-When-Then from BDD (Dan North)',
    domains: ['engineering', 'product'],
    intents: ['plan', 'structure'],
    oneLiner:
      'State the observable conditions under which the work is finished, before starting, in terms someone else could verify.',
    useWhen: [
      'the ticket keeps coming back from QA',
      'we thought it was done and it was not',
      'requirements are vague',
      'engineering built something different from what I asked for',
      'writing a ticket or user story',
    ],
    prompt:
      'Write acceptance criteria for this in Given / When / Then form. Cover the happy path, then the edge cases, then the error and empty states, then anything about permissions, and then the non-functional bar — performance, accessibility, and what happens on a slow connection. Every criterion must be checkable by someone who was not in the conversation. Then list what is explicitly out of scope, because that list is what stops the ticket coming back.',
    why:
      'Sequencing the categories — happy, edge, error, empty, permissions, non-functional — is what produces coverage. Asked for acceptance criteria flat, a model writes three happy-path bullets and stops.',
    related: ['moscow', 'work-breakdown-structure', 'output-contract', 'walking-skeleton'],
    tags: ['requirements', 'user story', 'qa', 'tickets', 'agile'],
  },

  {
    id: 'backcasting',
    name: 'Backcasting',
    aka: ['work backwards from the goal', 'reverse planning', 'pre-parade'],
    origin: 'Futures studies / John B. Robinson',
    domains: ['strategy', 'product', 'career'],
    intents: ['plan', 'reframe'],
    oneLiner:
      'Start from the desired end state and step backwards to now, asking what must be true immediately before each step.',
    useWhen: [
      'we have a big ambitious goal and no path',
      'forward planning keeps producing incrementalism',
      'what would have to be true for this to work',
      'a three year vision with no year one',
      'planning backwards from a launch date',
    ],
    prompt:
      'Backcast from this goal. Start at the end state, described concretely enough that we would know it had happened. Then step backwards: what must have been true immediately before that, and before that, until you reach something we could start this month. At each step state what must be true, not what we would do. Then mark which of those preconditions are outside our control, since those determine whether the plan is a plan or a wish.',
    why:
      '"What must be true" rather than "what would we do" is the crucial phrasing — it surfaces the preconditions and dependencies that forward planning hides behind activity.',
    related: ['critical-path', 'working-backwards', 'okr-laddering', 'first-principles'],
    tags: ['vision', 'roadmap', 'goals', 'long term', 'strategy'],
  },

  {
    id: 'timeboxing',
    name: 'Timeboxing & Spikes',
    aka: ['spike', 'timebox', 'research spike', 'fixed time variable scope'],
    origin: 'Extreme Programming',
    domains: ['engineering', 'product', 'career'],
    intents: ['plan', 'estimate'],
    oneLiner:
      'Fix the time and let the scope vary, especially for work whose size you cannot know until you have started it.',
    useWhen: [
      'we cannot estimate this until we investigate',
      'the research keeps expanding',
      'how long should we spend evaluating options',
      'this task has consumed a week with no end in sight',
      'gold plating and perfectionism',
    ],
    prompt:
      'Turn this into a timeboxed spike. Set a fixed duration proportionate to the decision it feeds. State the specific question the spike must answer, and what artefact it produces — a recommendation, a prototype, a number. Define in advance what we do at the end of the box in each case: answer found, answer not found, or answer found and it is bad news. The point is that the box ends regardless, so tell me what the fallback decision is if we learn nothing.',
    why:
      'Pre-committing to the "we learned nothing" branch is what makes a timebox actually end. Without it the box gets extended, which is the same as not having one.',
    related: ['work-breakdown-structure', 'mvp-riskiest-assumption', 'eisenhower-matrix', 'moscow'],
    tags: ['time management', 'research', 'estimation', 'agile', 'scope creep'],
  },

  {
    id: 'working-backwards',
    name: 'Working Backwards (PR-FAQ)',
    aka: ['press release FAQ', 'PRFAQ', 'Amazon working backwards', 'six pager'],
    origin: 'Amazon',
    domains: ['product', 'writing', 'strategy'],
    intents: ['plan', 'communicate', 'reframe'],
    oneLiner:
      'Write the launch press release and customer FAQ before building anything; if the release is not compelling, the product is not either.',
    useWhen: [
      'is this idea actually worth building',
      'I need to pitch a new product internally',
      'we cannot articulate the value clearly',
      'getting alignment on a big bet',
      'writing a product brief',
    ],
    prompt:
      'Write this as a working-backwards PR-FAQ. First the press release: headline, subheading, the problem in the customer\'s words, our solution, a quote from a customer that would only be true if we got it right, and how to get started — one page, no jargon, no internal terminology. Then the external FAQ (what customers will ask) and the internal FAQ (the hard questions leadership will ask: why us, why now, what breaks at scale, what we are giving up). If the press release is boring, say so plainly rather than polishing it — that is the signal the idea needs work.',
    why:
      '"If it is boring, say so" is the whole point of the exercise. A press release is a forcing function only if it is allowed to fail.',
    related: ['jobs-to-be-done', 'backcasting', 'pyramid-principle', 'bluf'],
    tags: ['product brief', 'pitch', 'alignment', 'launch', 'amazon'],
  },
]
