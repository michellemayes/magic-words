import type { Concept } from '../types'

export const practice: Concept[] = [
  {
    id: 'pair-programming',
    name: 'Pair Programming',
    aka: ['driver navigator', 'working together at one keyboard'],
    origin: 'Extreme Programming; Kent Beck and Ward Cunningham',
    domains: ['engineering', 'career'],
    intents: ['plan', 'explain'],
    oneLiner:
      'Two people working on one problem together, with explicit roles, trading raw throughput for fewer defects, faster knowledge transfer and a decision made twice.',
    useWhen: [
      'only one person understands this part of the system',
      'the new joiner is stuck and reluctant to keep asking',
      'this change is risky and I want a second brain on it in real time',
      'we tried pairing and it felt like one person watching the other work',
    ],
    prompt:
      'Design how we pair on this work. Assign the two roles explicitly and rotate them on a timer, because the most common failure is one person typing while the other watches passively — the navigator has a job, which is thinking one step ahead about tests, edge cases and design, not proofreading syntax. Then choose the tasks worth pairing on: unfamiliar territory, high-risk changes, and knowledge transfer, rather than everything. Specify session length with breaks, since this is more tiring than solo work. Finish with the norms that make it work across experience levels, particularly how the less experienced person gets the keyboard rather than watching.',
    why:
      'Naming what the navigator is actually for, and putting the keyboard with the less experienced person, are the two things that make pairing productive rather than performative.',
    watchOut:
      'Pairing everything doubles cost on work that carries no risk and no learning. It is a tool for specific situations, not a default mode.',
    related: ['mob-programming', 'bus-factor', 'code-review-checklist', 'onboarding-ramp'],
    tags: ['collaboration', 'practice', 'learning', 'quality'],
  },

  {
    id: 'mob-programming',
    name: 'Mob Programming',
    aka: ['ensemble programming', 'whole team at one problem'],
    origin: 'Woody Zuill, 2011',
    domains: ['engineering', 'career'],
    intents: ['plan', 'structure'],
    oneLiner:
      'The whole team works on one thing at one time, which is expensive per hour and can be the fastest way through a decision nobody can make alone.',
    useWhen: [
      'the design decision keeps being relitigated in every review',
      'the whole team needs to understand this new system',
      'work keeps blocking on the one person who knows the area',
      'we have five things in progress and nothing finished',
    ],
    prompt:
      'Decide whether this work suits the whole team at once, and be selective, since the cost is the entire team\'s time. The cases that justify it are a decision needing everyone\'s agreement, knowledge that must spread quickly, or a critical piece where a defect would be very expensive. Say whether ours qualifies. If it does, specify the mechanics: a rotating typist who does not decide, everyone else contributing at different levels of abstraction, short rotations, and a facilitator watching that quieter people are heard. Set a time limit and a checkpoint to decide whether to continue. Finish with what the team should notice afterwards about which parts were worth doing together.',
    why:
      'Making the typist a non-decider is what stops the loudest person driving, and the checkpoint prevents an expensive session running past the point of value.',
    watchOut:
      'A session where two people talk and five watch is an expensive meeting. Facilitation is the difference, not the format.',
    related: ['pair-programming', 'psychological-safety', 'bus-factor', 'architecture-review-forum'],
    tags: ['collaboration', 'practice', 'decisions', 'learning'],
  },

  {
    id: 'bus-factor',
    name: 'Bus Factor',
    aka: ['truck number', 'key person risk', 'knowledge concentration'],
    origin: 'Software engineering folklore; formalised in knowledge risk analysis',
    domains: ['engineering', 'career'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'How many people would have to become unavailable before work stops — measured per system, it is usually one and nobody has noticed.',
    useWhen: [
      'one person is the only one who understands the billing system',
      'we cannot let this person take a holiday',
      'someone left and took critical knowledge with them',
      'every question about this area goes to the same person',
    ],
    prompt:
      'Assess knowledge concentration across our systems using evidence rather than impressions. Use commit history to find areas where one person is the overwhelming author, and combine that with where questions actually go, which the repository does not show. Report the areas where the number is one, weighted by how critical the system is. Then propose remedies matched to the cause — documentation for knowledge that is written down nowhere, pairing or rotation for knowledge that only comes from doing, and simplification where the concentration exists because the system is too complicated for anyone else to learn. Finish with the specific commitment, since this is easy to acknowledge and never act on.',
    why:
      'Combining commit authorship with where questions actually go finds the real concentration, and matching the remedy to why the knowledge is concentrated avoids writing documents that do not help.',
    watchOut:
      'The concentration is often a symptom of complexity rather than of hoarding. If nobody else can learn it in reasonable time, the system is the problem.',
    related: ['code-ownership', 'onboarding-ramp', 'documentation-freshness', 'single-point-of-failure-audit'],
    tags: ['team', 'risk', 'knowledge', 'resilience'],
  },

  {
    id: 'onboarding-ramp',
    name: 'Onboarding Ramp',
    aka: ['time to first commit', 'developer onboarding', 'ramp-up plan'],
    origin: 'Engineering management practice',
    domains: ['engineering', 'career'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Measure and design how long it takes a new engineer to ship something meaningful, because that time also measures how comprehensible your system is to everyone.',
    useWhen: [
      'new joiners take three months to become productive',
      'the setup instructions do not work and everyone patches them verbally',
      'people are afraid to make their first change',
      'we onboard by assigning someone to answer questions ad hoc',
    ],
    prompt:
      'Design the onboarding path for a new engineer here. Set the milestones with target times: environment running, first change merged, first change deployed, first on-call shift. Then work backwards from the obstacles, using the most recent joiner\'s actual experience rather than the intended process — every place they got stuck is a defect in the system, not in them, and the fixes usually help everyone. Specify the first tasks deliberately: small, real, touching the main paths, with a named person available rather than an open invitation to ask. Finish with the practice of having each new joiner improve the onboarding materials as their first contribution, while the friction is still visible.',
    why:
      'Treating every point of confusion as a defect in the system rather than a gap in the person is what turns onboarding into an improvement loop that benefits the whole team.',
    watchOut:
      'A heavily documented onboarding for a system that is genuinely confusing treats the symptom. Sometimes the honest finding is that the architecture needs simplifying.',
    related: ['bus-factor', 'documentation-freshness', 'pair-programming', 'developer-experience-metrics'],
    tags: ['team', 'onboarding', 'productivity', 'documentation'],
  },

  {
    id: 'wip-limits',
    name: 'Work in Progress Limits',
    aka: ['WIP limits', 'stop starting start finishing', 'kanban limits'],
    origin: 'Lean and kanban practice; David Anderson\'s Kanban, 2010',
    domains: ['engineering'],
    intents: ['prioritize', 'plan'],
    oneLiner:
      'Cap how many things are in progress at once, because starting more work does not finish more work — it lengthens everything and hides the bottleneck.',
    useWhen: [
      'everyone is busy and nothing has shipped for weeks',
      'we have fourteen things in progress and six people',
      'work sits waiting for review while everyone starts something new',
      'context switching is constant and progress feels invisible',
    ],
    prompt:
      'Apply flow limits to this team\'s work. Count what is genuinely in progress including work waiting for review, waiting for deployment and blocked, since those are usually excluded and they are exactly where the queue is. Then set a limit per stage below the current level and specify what happens when it is reached: the team helps finish existing work rather than starting new, which is the whole mechanism and the part that feels wrong at first. Then use the limits diagnostically — the stage that repeatedly hits its limit is the constraint, so name it and address it. Finish with the measure that shows whether this is working, which is completion time rather than utilisation.',
    why:
      'Counting waiting-for-review as in progress is what reveals the real queue, and using the blocked stage to identify the constraint is what turns a limit into an improvement.',
    watchOut:
      'Limits imposed without the swarm-to-finish behaviour just create idle people who feel unproductive. The response to hitting a limit has to be agreed first.',
    related: ['lead-time-analysis', 'theory-of-constraints', 'context-switching-cost', 'small-batch-releases'],
    tags: ['flow', 'productivity', 'process', 'team'],
  },

  {
    id: 'context-switching-cost',
    name: 'Context Switching Cost',
    aka: ['multitasking penalty', 'fragmented attention', 'project switching'],
    origin: 'Cognitive psychology; applied to knowledge work by Gerald Weinberg',
    domains: ['engineering', 'career'],
    intents: ['estimate', 'diagnose'],
    oneLiner:
      'Splitting a person across several efforts costs far more than the arithmetic suggests, because each switch discards mental context that must be rebuilt.',
    useWhen: [
      'I am on three projects and making progress on none',
      'someone thinks half a person on two projects equals one person',
      'my day is fragmented and the hard work never gets done',
      'the estimate assumed full-time attention and nobody is full-time on anything',
    ],
    prompt:
      'Analyse the switching cost in this arrangement. Estimate the effective capacity when a person is split across efforts, accounting for the reload time on each switch and the fact that deep work requires uninterrupted blocks rather than total hours — then compare against the assumed capacity in our plan and state the gap. Then propose the alternatives in order of effectiveness: sequencing efforts rather than running them concurrently, assigning whole people to fewer things, and consolidating interruptions into defined windows. Where splitting is unavoidable, recommend the least damaging split, which is usually by day rather than within a day.',
    why:
      'Making the effective-versus-assumed capacity gap explicit is what lets a team push back on being split, and splitting by day rather than by hour is the practical compromise.',
    watchOut:
      'Some fragmentation is genuinely unavoidable in support and on-call roles. The answer there is to protect a portion of time rather than to pretend it can be eliminated.',
    related: ['wip-limits', 'interrupt-management', 'lead-time-analysis', 'estimation-uncertainty'],
    tags: ['productivity', 'planning', 'focus', 'team'],
  },

  {
    id: 'interrupt-management',
    name: 'Interrupt Management',
    aka: ['support rotation', 'interrupt shield', 'protecting focus time'],
    origin: 'Engineering team practice',
    domains: ['engineering', 'career'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Route unplanned work through one designated person on rotation, so the interruption cost lands on one person instead of everyone.',
    useWhen: [
      'every question goes to the whole team channel and derails several people',
      'nobody gets a clear block of time to work on anything',
      'urgent requests always beat planned work',
      'the same person keeps getting pulled in because they answer fastest',
    ],
    prompt:
      'Design an interrupt-handling rotation for this team. Specify the role: one person per period handles all incoming questions, support escalations and small urgent tasks, with no planned project work assigned to them that period — that last part is what makes it work, since a person with both will fail at one. Then define the routing so requesters have one place to go, the triage rule for what the person handles versus escalates, and the handover at rotation. Then use the data: record what comes in, and treat recurring categories as candidates for documentation, automation or a product fix, since the volume is a signal rather than a constant.',
    why:
      'Assigning no planned work to the person on rotation is the detail that determines success, and treating interrupt volume as a fixable signal is what shrinks it over time.',
    watchOut:
      'A rotation without capacity to fix the causes just distributes the pain fairly forever. Reserve time for the fixes the data suggests.',
    related: ['context-switching-cost', 'on-call-health', 'toil-reduction', 'wip-limits'],
    tags: ['team', 'productivity', 'process', 'support'],
  },

  {
    id: 'estimation-uncertainty',
    name: 'Estimating with Uncertainty',
    aka: ['cone of uncertainty', 'ranges not points', 'confidence intervals in planning'],
    origin: 'Barry Boehm\'s cone of uncertainty; Steve McConnell on software estimation',
    domains: ['engineering'],
    intents: ['estimate', 'communicate'],
    oneLiner:
      'Early estimates are uncertain by a large factor, so give ranges with a stated confidence and the assumptions that would move them, rather than a single number.',
    useWhen: [
      'we gave a number in a meeting and it became a commitment',
      'our estimates are always optimistic and we never learn',
      'someone wants a date for work we have barely defined',
      'the estimate has no error bars and gets treated as precise',
    ],
    prompt:
      'Produce an estimate for this work with its uncertainty made explicit. Give a range rather than a point, with a confidence level attached and the specific unknowns that would narrow it — listing what we would have to learn to give a better number is often more useful than the number itself. Then decompose, since estimates of small pieces aggregate better than one estimate of a large thing, and explicitly include the work usually forgotten: review, testing, deployment, documentation, and handling the unknowns discovered midway. Compare against how similar past work actually went rather than against how long the coding seems. Finish with what we would commit to versus what remains a forecast.',
    why:
      'Comparing against how similar past work actually went is the single strongest correction for optimism, and separating a commitment from a forecast is what stops a range being read as a date.',
    watchOut:
      'A range is often collapsed to its lower bound by whoever hears it. State which end you would plan against and why.',
    related: ['reference-class-forecasting', 'story-slicing', 'timeboxed-spike', 'context-switching-cost'],
    tags: ['estimation', 'planning', 'uncertainty', 'communication'],
  },

  {
    id: 'story-slicing',
    name: 'Story Slicing',
    aka: ['vertical slicing', 'breaking down work', 'thin end-to-end increments'],
    origin: 'Agile practice; patterns from Bill Wake and Richard Lawrence',
    domains: ['engineering', 'product'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Split work into pieces that each deliver something end to end, rather than into technical layers that only have value once all of them are finished.',
    useWhen: [
      'this story is too big and I do not know how to split it',
      'we split by layer and nothing works until the last piece lands',
      'the story has been in progress for three weeks',
      'we cannot demonstrate anything until everything is done',
    ],
    prompt:
      'Slice this work into independently valuable pieces. Avoid splitting by technical layer, since a database slice delivers nothing on its own. Use the patterns that produce genuine slices instead: by workflow step, by business rule variation, by data type, by interface simplicity with a manual step first, by happy path before error handling, and by one user segment before all. Generate several candidate slicings and pick the one where the first slice is smallest while still being genuinely usable. Then state what each slice deliberately does not include and confirm the whole set still adds up. Finish with the slice that would teach us the most if we built it first.',
    why:
      'Generating several candidate slicings rather than the first one that occurs to you is what produces a genuinely thin first slice, and naming the most informative one connects slicing to risk.',
    watchOut:
      'Slices that are individually shippable but deliver a half-built experience can damage trust with users. Some slices should ship behind a flag.',
    related: ['walking-skeleton', 'small-batch-releases', 'estimation-uncertainty', 'mvp-riskiest-assumption'],
    tags: ['planning', 'agile', 'decomposition', 'delivery'],
  },

  {
    id: 'timeboxed-spike',
    name: 'Timeboxed Spike',
    aka: ['research spike', 'tracer investigation', 'learning task'],
    origin: 'Extreme Programming practice',
    domains: ['engineering'],
    intents: ['plan', 'estimate'],
    oneLiner:
      'When you cannot estimate because you do not know something, buy the knowledge with a fixed-duration investigation that has a defined question and a defined output.',
    useWhen: [
      'we cannot estimate this until we know whether that library works',
      'the research has gone on for two weeks with no conclusion',
      'we keep debating an approach nobody has tried',
      'the prototype became the implementation by accident',
    ],
    prompt:
      'Define a timeboxed investigation for this unknown. State the question it must answer, the fixed duration, and the deliverable, which is a recommendation with evidence rather than working code — that distinction is what stops a spike becoming an unplanned implementation. Then specify what would make us stop early in either direction: enough evidence to decide, or enough difficulty to conclude the approach is wrong. Say explicitly what happens to any code written, which is normally deletion, and what is kept, which is the written finding. Finish with the decision the answer feeds into and who makes it, so the investigation is not simply interesting.',
    why:
      'Naming the deliverable as a recommendation rather than code, and pre-committing to delete the throwaway, is what keeps a spike from silently becoming the production implementation.',
    watchOut:
      'Spike code that ships because it works is how prototypes become unmaintainable production systems with nobody having decided that.',
    related: ['estimation-uncertainty', 'proof-of-concept-vs-prototype', 'walking-skeleton', 'story-slicing'],
    tags: ['planning', 'research', 'estimation', 'risk'],
  },

  {
    id: 'retrospective-facilitation',
    name: 'Retrospective Facilitation',
    aka: ['sprint retrospective', 'team reflection', 'prime directive'],
    origin: 'Agile practice; Norm Kerth\'s Project Retrospectives, 2001',
    domains: ['engineering', 'career'],
    intents: ['critique', 'plan'],
    oneLiner:
      'A structured reflection that produces a small number of changes actually made — not a recurring meeting where the same complaints are aired and nothing moves.',
    useWhen: [
      'we raise the same problems every fortnight and nothing changes',
      'the retrospective has become a complaining session',
      'only the loudest voices contribute',
      'we generate twenty actions and complete none',
    ],
    prompt:
      'Design a retrospective that produces change. Structure it to gather data before interpreting it, since jumping to opinions loses the quieter observations — collect events, facts and feelings first, individually and in writing, so the discussion is not anchored by whoever speaks first. Then converge on one or two changes rather than a list, each with an owner and a check at the next session, because completion rate matters more than idea count. Vary the format to avoid the ritual going stale, and periodically look further back than the last two weeks. Finish with the norms: it is about the system rather than individuals, and what is said stays in the room.',
    why:
      'Individual written collection before discussion is what surfaces the observations that group dynamics suppress, and limiting to one or two owned actions is what makes anything actually change.',
    watchOut:
      'A retrospective in a team without safety produces polite silence and false consensus. Fix that first or the meeting is worse than nothing.',
    related: ['psychological-safety', 'blameless-postmortem', 'corrective-action-tracking', 'near-miss-reporting'],
    tags: ['team', 'improvement', 'facilitation', 'process'],
  },

  {
    id: 'psychological-safety',
    name: 'Psychological Safety',
    aka: ['safe to speak up', 'admitting mistakes', 'team climate'],
    origin: 'Amy Edmondson, 1999; confirmed as a key factor by Google\'s Project Aristotle',
    domains: ['career', 'engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'The shared belief that you can admit a mistake, ask a basic question or challenge a decision without being punished — measurable by what people actually do, not by how nice the team is.',
    useWhen: [
      'nobody asks questions in reviews or design sessions',
      'we found out about the problem far too late because nobody raised it',
      'people say yes in meetings and disagree afterwards',
      'the junior engineers never push back on anything',
    ],
    prompt:
      'Assess this team\'s climate using observable behaviour rather than sentiment: how often people ask questions revealing they do not know something, how often junior members disagree with senior ones in public, how mistakes are reported and what happens next, and how bad news travels upward. Those behaviours are the measure. Then identify the specific things suppressing them — how errors were responded to recently, whether questions were met with impatience, whether disagreement has ever visibly changed a decision. Propose concrete leader behaviours rather than values statements: admitting one\'s own mistakes publicly, responding to bad news with curiosity, and visibly changing a decision when challenged.',
    why:
      'Measuring by behaviours like public disagreement and error reporting makes an abstract concept assessable, and leader behaviour is the lever that actually moves it.',
    watchOut:
      'Safety is not the absence of disagreement or high standards. Teams with both high safety and high standards perform best; comfortable teams with low standards do not.',
    related: ['blameless-postmortem', 'retrospective-facilitation', 'near-miss-reporting', 'mob-programming'],
    tags: ['team', 'culture', 'leadership', 'learning'],
  },

  {
    id: 'conways-law',
    name: 'Conway\'s Law',
    aka: ['organisation mirrors architecture', 'inverse Conway manoeuvre'],
    origin: 'Melvin Conway, 1968',
    domains: ['engineering', 'strategy'],
    intents: ['diagnose', 'reframe'],
    oneLiner:
      'Systems come to mirror the communication structure of the organisation that builds them — so a structure you cannot change constrains an architecture you want.',
    useWhen: [
      'the architecture keeps drifting back toward our team boundaries',
      'this integration is painful and it is between two departments',
      'we designed a modular system and it came out as one tangle',
      'the same interface has three versions because three teams built it',
    ],
    prompt:
      'Analyse the fit between our team structure and our intended architecture. Map which teams own which components and where the seams in the system align or fail to align with organisational boundaries — misalignments predict where the integration pain and the duplicated work will be, so name them. Then consider the deliberate inversion: reshaping teams so the communication structure matches the architecture we want, since that is often more effective than trying to build an architecture across an unsuited structure. Say what that would mean here. Finish with the case where the structure cannot change, and what compensating mechanisms would help.',
    why:
      'Using structure-architecture misalignment to predict where integration pain will appear turns an observation into a planning tool, and the deliberate inversion is the actionable half.',
    watchOut:
      'Reorganising to fit an architecture is disruptive and slow, and if the architecture is wrong you have now made it structural.',
    related: ['team-topologies', 'bounded-context', 'cognitive-load-team', 'database-per-service'],
    tags: ['organisation', 'architecture', 'teams', 'strategy'],
  },

  {
    id: 'team-topologies',
    name: 'Team Topologies',
    aka: ['stream-aligned teams', 'platform teams', 'interaction modes'],
    origin: 'Matthew Skelton and Manuel Pais, 2019',
    domains: ['engineering', 'strategy'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Four team types and three interaction modes, arranged so that most teams can deliver end to end without waiting on anyone.',
    useWhen: [
      'every feature needs three teams to coordinate',
      'our platform team is a ticket queue everyone is blocked on',
      'we have teams organised by technical layer and delivery is slow',
      'nobody can ship without a handoff',
    ],
    prompt:
      'Assess our team structure against the flow-oriented model. Classify each team as stream-aligned, platform, enabling or complicated-subsystem, and check the ratio, since a healthy structure is mostly stream-aligned teams with the others existing to support them. Then examine the interactions: a platform team should provide self-service capability rather than doing work on request, and an enabling team should raise capability and then withdraw rather than becoming permanent. Name where ours are the wrong mode. Finish with the dependencies blocking end-to-end delivery for each stream-aligned team, and what would have to become self-service to remove them.',
    why:
      'The platform-as-self-service rather than as ticket queue distinction is the practical change that unblocks delivery, and the mode audit surfaces exactly where handoffs are creating the queue.',
    watchOut:
      'Relabelling existing teams without changing how they interact achieves nothing. The interaction modes are the substance, not the names.',
    related: ['conways-law', 'cognitive-load-team', 'developer-experience-metrics', 'platform-as-product'],
    tags: ['organisation', 'teams', 'delivery', 'structure'],
  },

  {
    id: 'cognitive-load-team',
    name: 'Team Cognitive Load',
    aka: ['too many systems per team', 'domain load', 'boundary sizing'],
    origin: 'Team Topologies, drawing on cognitive load theory',
    domains: ['engineering', 'career'],
    intents: ['diagnose', 'decide'],
    oneLiner:
      'A team can only hold so much in its collective head — when responsibilities exceed that, quality and speed drop in ways that look like a people problem.',
    useWhen: [
      'this team owns eleven services and knows none of them well',
      'we keep adding responsibilities without removing any',
      'the team is competent and everything takes longer than it should',
      'nobody has time to learn any system properly',
    ],
    prompt:
      'Assess this team\'s load. Inventory everything they are responsible for — systems owned, domains understood, technologies operated, stakeholders served, and interrupt sources — and classify the load as intrinsic to the problem, extraneous from accidental complexity such as awkward tooling and deployment friction, or germane, which is the learning that actually adds capability. Extraneous load is the first target because removing it costs nothing in scope. Then, if the load is still too high, propose the options honestly: fewer responsibilities, a platform absorbing some, or simplification. Finish with the observable symptoms we should expect to improve.',
    why:
      'Separating extraneous load from intrinsic gives an immediate target that does not require reorganisation, and it usually accounts for more than people expect.',
    watchOut:
      'Adding people to an overloaded team raises coordination cost and may not raise capacity. Reducing scope usually works better than growing the team.',
    related: ['team-topologies', 'conways-law', 'toil-reduction', 'context-switching-cost'],
    tags: ['team', 'workload', 'organisation', 'sustainability'],
  },

  {
    id: 'rfc-process',
    name: 'RFC Process',
    aka: ['design document review', 'technical proposal process', 'written design review'],
    origin: 'Internet Engineering Task Force tradition; adopted widely in engineering organisations',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'decide'],
    oneLiner:
      'Circulate a written proposal for comment before building, so disagreement surfaces while it is cheap and the reasoning is recorded.',
    useWhen: [
      'we built it and then discovered another team had strong objections',
      'design decisions are made in unrecorded conversations',
      'the same architectural debate recurs with new people',
      'our design documents are written after the fact to satisfy a process',
    ],
    prompt:
      'Design a proposal process for us. Define the threshold for what needs one, since requiring it for everything creates a bottleneck and requiring it for nothing loses the benefit — anchor it to reversibility and blast radius. Specify the template covering the problem, the constraints, the options considered with trade-offs, the recommendation, and the open questions the author actively wants opinions on. Then set the mechanics that determine whether it works: a comment period with a deadline, a named decider rather than consensus, and an explicit resolution recorded at the end so it is closed rather than fading. Finish with where the accepted proposals live and how they are found later.',
    why:
      'A named decider plus a deadline is what prevents proposals dying in indefinite discussion, and recording the resolution is what stops the debate recurring.',
    watchOut:
      'A process where every proposal is approved unchanged means people are writing them after deciding. That is documentation, not review.',
    related: ['architecture-decision-records', 'architecture-review-forum', 'disagree-and-commit', 'timeboxed-spike'],
    tags: ['process', 'design', 'writing', 'decisions'],
  },

  {
    id: 'architecture-review-forum',
    name: 'Architecture Review Forum',
    aka: ['design review board', 'architecture guild', 'advisory review'],
    origin: 'Engineering governance practice',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'A regular forum where significant designs get scrutiny from outside the team — advisory rather than gating, or it becomes a queue teams route around.',
    useWhen: [
      'teams keep solving the same problem in incompatible ways',
      'the architecture board takes six weeks and everyone bypasses it',
      'nobody outside the team sees a design until it ships',
      'we have three message queues because three teams chose independently',
    ],
    prompt:
      'Design a review forum that helps rather than blocks. Set the scope by what genuinely benefits from outside scrutiny — cross-cutting choices, new technology adoption, and anything hard to reverse — and let everything else proceed without it. Then make it advisory by default with a small set of decisions that genuinely require agreement, and state which. Specify the mechanics: material circulated in advance so the session is discussion rather than presentation, a diverse group rather than only senior architects, and a written outcome recording advice given and whether it was taken. Finish with the measure of usefulness, which is whether teams choose to bring things voluntarily.',
    why:
      'Voluntary attendance is the honest measure of whether a review forum adds value, and making it advisory by default is what keeps it from becoming a bottleneck to bypass.',
    watchOut:
      'A forum staffed only by people who no longer write code drifts toward theoretical objections. Include practitioners from the systems concerned.',
    related: ['rfc-process', 'tech-radar', 'architecture-decision-records', 'change-management-lightweight'],
    tags: ['process', 'architecture', 'governance', 'collaboration'],
  },

  {
    id: 'tech-radar',
    name: 'Technology Radar',
    aka: ['adopt trial assess hold', 'technology governance', 'approved technology list'],
    origin: 'ThoughtWorks Technology Radar, 2010',
    domains: ['engineering', 'strategy'],
    intents: ['decide', 'communicate'],
    oneLiner:
      'Classify technologies by how much confidence the organisation has in them, so adoption decisions have a shared reference instead of being argued case by case.',
    useWhen: [
      'every team picks a different framework for the same job',
      'we have four programming languages and no policy',
      'someone wants to introduce a new database and there is no process',
      'we have an approved list that has not changed in three years',
    ],
    prompt:
      'Build a technology classification for our organisation. Use rings expressing confidence and intent — adopt as the default choice, trial for controlled use with a named team, assess for worth exploring, and hold for do not start anything new with this — and be clear that hold does not mean rip out. Populate it from what we actually run, including the things nobody would choose again, since making those visible is half the value. Then define the movement process: what evidence moves something between rings and who decides, so it stays current rather than becoming a stale list. Finish with the exception path for a genuinely justified departure.',
    why:
      'Populating from what actually runs, rather than from what people would like to use, is what makes the radar an honest inventory and surfaces the hold items nobody has admitted to.',
    watchOut:
      'A list maintained by a central group with no adoption path becomes a rule to circumvent. Teams must be able to move things through trial.',
    related: ['architecture-review-forum', 'build-vs-buy', 'vendor-evaluation', 'technical-debt-register'],
    tags: ['strategy', 'technology', 'governance', 'standards'],
  },

  {
    id: 'build-vs-buy',
    name: 'Build versus Buy',
    aka: ['make or buy', 'core versus context', 'commodity or differentiator'],
    origin: 'Strategy practice; Geoffrey Moore\'s core and context distinction',
    domains: ['engineering', 'strategy'],
    intents: ['decide', 'estimate'],
    oneLiner:
      'Build what differentiates you and buy what does not — then compare on total cost over years rather than on the initial build estimate versus the licence fee.',
    useWhen: [
      'we are about to build our own authentication system',
      'the vendor quote seems expensive and building looks cheap',
      'we bought a tool and now spend more integrating it than it saved',
      'someone says we could build this in two weeks',
    ],
    prompt:
      'Evaluate building against buying for this capability. First classify it: does this differentiate us with customers, or is it necessary and invisible? That answer dominates, so state it plainly. Then compare on total cost over a realistic horizon rather than initial effort, including for building the ongoing maintenance, security patching, on-call burden and the features you will need later that the vendor already has, and for buying the integration effort, the data migration, the customisation limits and the exit cost. Include the option value of each: how hard it is to change course later. Finish with the hybrid where we buy the commodity and build only the part that differentiates.',
    why:
      'Initial build estimates ignore years of maintenance while vendor evaluations ignore integration, so forcing both into a multi-year total is what makes the comparison honest.',
    watchOut:
      'Buying something core to your differentiation caps how good it can be, since every competitor can buy the same thing.',
    related: ['vendor-evaluation', 'tech-radar', 'total-cost-of-ownership', 'opportunity-cost'],
    tags: ['strategy', 'decisions', 'cost', 'architecture'],
  },

  {
    id: 'vendor-evaluation',
    name: 'Vendor Evaluation',
    aka: ['tool selection', 'proof of value', 'lock-in assessment'],
    origin: 'Procurement and technology selection practice',
    domains: ['engineering', 'strategy'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Evaluate a supplier on how they behave when things go wrong and how hard they are to leave, not only on the feature comparison in the sales deck.',
    useWhen: [
      'we are choosing between three tools and the comparison is all features',
      'we picked a vendor and their support has been useless',
      'moving off this platform would take a year',
      'the demo was impressive and the trial was painful',
    ],
    prompt:
      'Design an evaluation for these suppliers. Start with must-haves separated from nice-to-haves, and test against our own data and workflow rather than their demonstration, since demos are built to avoid the awkward cases. Then evaluate the dimensions that determine the experience after purchase: support responsiveness and escalation with evidence from existing customers, their reliability history and how they communicate during incidents, the release cadence and how breaking changes are handled, and security posture. Assess exit cost explicitly — can we get our data out in a usable form, and what would migration cost — because that determines our negotiating position at every renewal.',
    why:
      'Exit cost determines your leverage at renewal and is almost never assessed at purchase, and testing with your own data is what exposes the gaps a demo hides.',
    watchOut:
      'The lowest initial price frequently carries the highest switching cost. Price the whole relationship, including the renewal after the introductory discount.',
    related: ['build-vs-buy', 'total-cost-of-ownership', 'tech-radar', 'supply-chain-provenance'],
    tags: ['strategy', 'procurement', 'decisions', 'risk'],
  },

  {
    id: 'proof-of-concept-vs-prototype',
    name: 'Proof of Concept versus Prototype',
    aka: ['spike versus demo', 'throwaway versus foundation', 'what is this code for'],
    origin: 'Product and engineering practice',
    domains: ['engineering', 'design'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Decide in advance whether you are testing feasibility, testing desirability, or building the first version — because each justifies completely different shortcuts.',
    useWhen: [
      'the demo we hacked together is now in production',
      'we spent three weeks polishing something meant to answer one question',
      'the prototype tested the interface and everyone thinks the backend is done',
      'nobody knows whether this code is meant to survive',
    ],
    prompt:
      'Classify what we are actually building here and set the rules accordingly. A feasibility proof answers can-this-work technically and may have no interface and no error handling. A desirability prototype answers do-people-want-this and may be entirely fake underneath. A first increment is real code and must meet real standards. State which this is, the single question it answers, and the shortcuts explicitly permitted. Then set the disposal rule before starting: for the first two, the code is deleted and only the finding survives, and say who enforces that. Finish with how the result is communicated so nobody mistakes a fake backend for a working one.',
    why:
      'Pre-committing to disposal and naming the permitted shortcuts is what prevents the demo becoming production, which is the failure this distinction exists to avoid.',
    watchOut:
      'A prototype shown to stakeholders creates an expectation of near-completion regardless of what you say. Manage that at the demonstration, not afterwards.',
    related: ['timeboxed-spike', 'walking-skeleton', 'mvp-riskiest-assumption', 'technical-debt-register'],
    tags: ['practice', 'prototyping', 'planning', 'expectations'],
  },

  {
    id: 'rewrite-vs-refactor',
    name: 'Rewrite versus Refactor',
    aka: ['second system effect', 'big bang rewrite', 'incremental replacement'],
    origin: 'Joel Spolsky\'s rewrite essay, 2000; Fred Brooks on the second system',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Rewrites are attractive because reading code is harder than writing it, and they usually take far longer than expected while the old system keeps changing.',
    useWhen: [
      'the team wants to start again from scratch',
      'we started a rewrite two years ago and it has not shipped',
      'the existing system is genuinely built on a dead technology',
      'every change to the old system takes weeks',
    ],
    prompt:
      'Evaluate rewriting against incremental replacement here. Be specific about what is actually wrong, since the answer differs: outdated technology, poor structure, missing tests, wrong domain model, or simply unfamiliarity — and only some of those require replacement. Then price the rewrite realistically, including the behaviour embedded in the old system that nobody has documented, which is where the schedule always goes, and the fact that the old system must keep changing during the transition. Compare against incremental replacement with a strangler approach. If rewriting is genuinely right, define how value ships during it rather than only at the end.',
    why:
      'Naming the undocumented accumulated behaviour as the main cost is what makes rewrite estimates honest, and requiring value to ship during the transition is what prevents a two-year invisible project.',
    watchOut:
      'The team that wants to rewrite is often the team that would benefit most from understanding the existing system. Unfamiliarity is not a technical reason.',
    related: ['strangler-fig', 'migration-planning', 'characterization-tests', 'chestertons-fence'],
    tags: ['engineering', 'decisions', 'legacy', 'risk'],
  },

  {
    id: 'migration-planning',
    name: 'Migration Planning',
    aka: ['system migration', 'cutover planning', 'dual running'],
    origin: 'Systems engineering practice',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'A migration is a sequence of reversible steps with verification at each, not a cutover — and the hardest part is always the long tail of consumers.',
    useWhen: [
      'we are moving to a new system and I do not know where to start',
      'the migration is ninety percent done and has been for six months',
      'we cannot turn off the old system because someone still uses it',
      'the cutover weekend went wrong and we could not go back',
    ],
    prompt:
      'Plan this migration as reversible increments. Enumerate every consumer of the old system first, including the ones nobody remembers — scheduled jobs, reports, integrations, and internal tools — since the unknown consumers are what leave it running for years. Then sequence: run both systems with reconciliation between them, move consumers one at a time with the ability to move back, and only then decommission. Specify the verification proving the new system matches the old before each move, and the rollback per step. Finish with the completion definition and the specific plan for the last stragglers, since without a forcing mechanism the old system never turns off.',
    why:
      'The consumer inventory and the forcing mechanism for stragglers are what determine whether a migration finishes, and both are usually left until the end when they are hardest.',
    watchOut:
      'Running both systems indefinitely doubles the maintenance and gradually becomes the permanent state. Set the decommission date at the start.',
    related: ['strangler-fig', 'system-decommissioning', 'shadow-traffic', 'reconciliation-jobs'],
    tags: ['engineering', 'migration', 'planning', 'legacy'],
  },

  {
    id: 'system-decommissioning',
    name: 'System Decommissioning',
    aka: ['turning it off', 'sunsetting internal systems', 'the long tail of shutdown'],
    origin: 'Operations and portfolio management practice',
    domains: ['engineering'],
    intents: ['plan', 'prioritize'],
    oneLiner:
      'Turning a system off is a project with its own plan — data retention, consumer migration, evidence of disuse, and a reversible sequence.',
    useWhen: [
      'we still run a service that we think nobody uses',
      'the old system costs money and nobody will approve turning it off',
      'we turned something off and broke a process nobody knew about',
      'we have twelve systems that are supposedly retired',
    ],
    prompt:
      'Plan the shutdown of this system. Start with evidence of use rather than belief: instrument every entry point and observe for a period long enough to catch monthly and quarterly processes, since a system idle for three weeks may be essential at quarter end. Then work through the sequence with reversibility at each step: notify identified consumers, restrict access to a reduced set, disable with a fast path to re-enable, then archive the data according to retention obligations, then remove infrastructure. Specify the observation period between steps. Finish with what must be preserved — data required for legal retention, and enough documentation to answer questions about historic records.',
    why:
      'Observing long enough to catch quarterly usage, and staging the shutdown so it can be reversed quickly, is what prevents the outage that makes teams afraid to decommission anything again.',
    watchOut:
      'Turning off the system without addressing the data retention obligation can breach a legal requirement that outlives the service by years.',
    related: ['migration-planning', 'data-retention-policy', 'dead-code-removal', 'deprecation-policy'],
    tags: ['engineering', 'operations', 'lifecycle', 'cost'],
  },

  {
    id: 'security-review-triggers',
    name: 'Security Review Triggers',
    aka: ['when to involve security', 'risk-based review', 'security design review'],
    origin: 'Application security practice',
    domains: ['security', 'engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Define the specific change characteristics that require a security review, so it happens by rule at design time rather than by memory just before launch.',
    useWhen: [
      'security reviews everything and is a bottleneck',
      'security saw this two days before launch and had major objections',
      'we do not know which changes need security involvement',
      'a change that handled personal data shipped without any review',
    ],
    prompt:
      'Define the triggers that require security involvement here. Base them on characteristics rather than on judgement, so the rule can be applied by anyone: new handling of personal or payment data, a change to authentication or authorisation, a new external interface or third-party integration, a new dependency with broad privileges, changes to secrets handling, and anything altering a trust boundary. Then specify the response per trigger, which should scale — a short checklist for most, a full design review for the significant minority — since uniform heavy review is why teams avoid it. Finish with the timing rule: at design, not before launch, and what security owes in return, principally responsiveness.',
    why:
      'Characteristic-based triggers make the rule applicable without security judgement, and scaling the response is what keeps reviews from becoming a bottleneck teams route around.',
    watchOut:
      'A trigger list that catches almost every change is the same as reviewing everything. Tune it against real changes before adopting it.',
    related: ['threat-modeling-stride', 'operational-readiness-review', 'change-management-lightweight', 'trust-boundary'],
    tags: ['security', 'process', 'review', 'risk'],
  },

  {
    id: 'developer-experience-metrics',
    name: 'Developer Experience Metrics',
    aka: ['SPACE framework', 'developer productivity measurement', 'friction survey'],
    origin: 'SPACE framework, Forsgren and colleagues, 2021; DevEx research',
    domains: ['engineering'],
    intents: ['estimate', 'diagnose'],
    oneLiner:
      'Measure developer effectiveness across several dimensions including how the work feels, because any single metric is gamed and none of them measure output well.',
    useWhen: [
      'leadership wants to measure engineering productivity',
      'someone proposed counting commits or story points per person',
      'we know things are slow and cannot show it',
      'we invested in tooling and cannot demonstrate the benefit',
    ],
    prompt:
      'Design a way to understand engineering effectiveness here. Combine system data with perception data, since the friction people feel is real and often invisible in the numbers — pair pipeline and lead time measurements with a short recurring survey about the biggest obstacles. Cover several dimensions rather than one: flow and delivery, quality, collaboration, and satisfaction. Then state the two rules that keep it useful: measure at team level rather than individual, because individual measurement changes behaviour destructively, and use it to find friction rather than to compare teams. Finish with the friction inventory it should produce and how items get prioritised as work.',
    why:
      'Pairing system metrics with perception data catches the friction that no pipeline metric shows, and the team-not-individual rule is what prevents the measurement doing harm.',
    watchOut:
      'Any of these numbers used in performance evaluation will be gamed immediately and permanently, and the underlying signal will be lost.',
    related: ['dora-metrics', 'lead-time-analysis', 'toil-reduction', 'goodharts-law'],
    tags: ['engineering', 'metrics', 'productivity', 'measurement'],
  },

  {
    id: 'meeting-hygiene',
    name: 'Meeting Hygiene',
    aka: ['agenda and outcome', 'default to no meeting', 'meeting cost'],
    origin: 'Management practice; widely codified in remote-first companies',
    domains: ['career', 'engineering'],
    intents: ['structure', 'prioritize'],
    oneLiner:
      'A meeting needs a decision to make or a thing to create together — everything else is a document, and the recurring ones are the most expensive.',
    useWhen: [
      'my calendar is full and I have no time to do the work',
      'this meeting has twelve attendees and no agenda',
      'the recurring meeting has outlived whatever it was for',
      'decisions get made in meetings that half the affected people miss',
    ],
    prompt:
      'Audit these meetings. For each, state the decision it makes or the artefact it produces, and the cost in person-hours per month — a recurring hour with eight people is a substantial ongoing expense that nobody ever re-approves, so make that number visible. Then propose per meeting: keep with a tightened agenda and attendee list, convert to a written update with asynchronous comment, or cancel. For those kept, specify pre-reading circulated in advance, the required attendees separated from the optional, and the written outcome so absentees are not excluded from the decision. Finish with a review date so recurring meetings expire by default.',
    why:
      'Costing recurring meetings in person-hours per month makes the expense visible for the first time, and an expiry date is what stops them outliving their purpose.',
    watchOut:
      'Cancelling meetings without replacing the coordination they provided pushes the cost into interruptions and missed information.',
    related: ['async-first-collaboration', 'context-switching-cost', 'interrupt-management', 'rfc-process'],
    tags: ['team', 'productivity', 'communication', 'process'],
  },

  {
    id: 'async-first-collaboration',
    name: 'Asynchronous Collaboration',
    aka: ['written-first culture', 'remote-friendly working', 'documentation over meetings'],
    origin: 'Distributed and remote-first company practice',
    domains: ['career', 'engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Default to writing things down where they can be read later, so time zones, focus time and absence stop being obstacles to participating.',
    useWhen: [
      'decisions are made in conversations and colleagues elsewhere miss them',
      'people cannot take focus time because they might miss something',
      'the team is distributed and everything requires a call',
      'context lives in chat history nobody can search usefully',
    ],
    prompt:
      'Design asynchronous working practices for this team. Classify communication by what it needs: decisions and their rationale need a durable searchable home, coordination needs a channel with expected response times, and genuinely ambiguous or sensitive conversations need real time. Say where each of ours currently happens and where it should. Then set the expectations that make asynchronous work rather than merely slower: response time norms per channel so people know when they must check, a rule that any decision reached synchronously is written up before it is acted on, and an explicit statement of the small set of things that genuinely require everyone at once.',
    why:
      'The rule that synchronous decisions must be written up before action is what keeps the written record authoritative, which is the thing that makes asynchronous participation real rather than second-class.',
    watchOut:
      'Asynchronous by default without response norms produces slow decisions and anxiety about whether anyone has read anything. The norms are the substance.',
    related: ['meeting-hygiene', 'rfc-process', 'architecture-decision-records', 'documentation-freshness'],
    tags: ['team', 'communication', 'remote', 'process'],
  },

  {
    id: 'interview-loop-design',
    name: 'Interview Loop Design',
    aka: ['hiring process design', 'structured interviews', 'signal per stage'],
    origin: 'Hiring research on structured interviews; industry practice',
    domains: ['career', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Design each stage to gather a specific signal that no other stage gathers, with consistent questions and a rubric, because unstructured interviews mostly measure similarity to the interviewer.',
    useWhen: [
      'every interviewer asks whatever they feel like',
      'we cannot explain why we rejected that candidate',
      'our process takes six hours and three stages test the same thing',
      'the debrief is a conversation about whether people liked them',
    ],
    prompt:
      'Design a hiring loop for this role. Start from the attributes that actually predict success in it, then assign each to exactly one stage, since duplicated signal wastes everyone\'s time and gaps go unnoticed. Specify per stage the questions or exercise, the rubric with described levels rather than a numeric score, and what would be disqualifying. Then design the debrief to reduce bias: written independent assessments submitted before discussion so nobody is anchored, and evidence quoted rather than impressions. Finish with the candidate experience, which is also a hiring signal in the other direction, including total time required and how quickly they get an answer.',
    why:
      'Independent written assessments before discussion is the single most effective bias reduction in a debrief, and mapping attributes to exactly one stage is what removes redundant hours.',
    watchOut:
      'A rubric applied by interviewers who have not calibrated on real examples produces consistent-looking scores that mean different things per interviewer.',
    related: ['hiring-work-sample', 'engineering-levels', 'psychological-safety', 'star-method'],
    tags: ['hiring', 'process', 'career', 'assessment'],
  },

  {
    id: 'hiring-work-sample',
    name: 'Work Sample Assessment',
    aka: ['take-home versus pairing exercise', 'realistic task interview'],
    origin: 'Selection research; work sample tests are among the most predictive methods',
    domains: ['career', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Ask candidates to do a small version of the actual job, because performance on realistic work predicts far better than puzzles or recall of algorithms.',
    useWhen: [
      'our interview tests algorithms and the job is nothing like that',
      'we hired someone who interviewed brilliantly and could not do the work',
      'the take-home exercise takes candidates a whole weekend',
      'strong candidates drop out during our process',
    ],
    prompt:
      'Design a work sample for this role. Derive it from a real task the person would do, reduced to something completable in a strictly bounded time, and state that bound as a maximum rather than a suggestion — unbounded exercises select for available time rather than ability. Then choose the format with the trade stated: a collaborative session shows how someone works with others and how they think aloud, while an independent exercise shows what they produce with time to think but risks unequal effort. Specify the evaluation rubric before anyone sits it, and what candidates are told about the criteria, since a fair exercise is one they can prepare for.',
    why:
      'A hard time bound and a pre-written rubric are what make work samples fair and comparable, and stating the criteria to candidates removes the guessing that advantages insiders.',
    watchOut:
      'A lengthy unpaid exercise excludes candidates with caring responsibilities or another job, which narrows your pool along lines unrelated to ability.',
    related: ['interview-loop-design', 'engineering-levels', 'worked-example-fading', 'psychological-safety'],
    tags: ['hiring', 'assessment', 'career', 'fairness'],
  },

  {
    id: 'engineering-levels',
    name: 'Engineering Levels',
    aka: ['career ladder', 'level expectations', 'scope and impact'],
    origin: 'Engineering management practice; published ladders from several companies',
    domains: ['career'],
    intents: ['communicate', 'decide'],
    oneLiner:
      'Describe levels by the scope someone operates at and the ambiguity they resolve, not by years of experience or technical depth alone.',
    useWhen: [
      'nobody knows what is expected at the next level',
      'promotion decisions feel arbitrary and inconsistent',
      'our ladder describes seniority as knowing more technologies',
      'two people at the same level are doing completely different jobs',
    ],
    prompt:
      'Define or review our level expectations. Frame each level by scope of impact and by the ambiguity a person handles independently — one task, one system, one team, several teams — since that framing scales while a list of technical skills does not. Give observable behaviours per level rather than adjectives, so evidence can be produced. Then handle the two things ladders get wrong: describing the individual contributor track as a shadow of the management track rather than as its own progression, and confusing tenure with level. Finish with how evidence is gathered and how the ladder is calibrated across teams so a level means the same thing everywhere.',
    why:
      'Scope and ambiguity scale as a framing where technical skill lists do not, and observable behaviours are what make promotion decisions evidence-based rather than reputational.',
    watchOut:
      'A ladder used to justify decisions already made becomes a source of cynicism. It only works if evidence genuinely determines outcomes.',
    related: ['brag-document', 'interview-loop-design', 'psychological-safety', 'sbi-feedback'],
    tags: ['career', 'progression', 'expectations', 'management'],
  },

  {
    id: 'brag-document',
    name: 'Brag Document',
    aka: ['impact log', 'accomplishments file', 'evidence for review'],
    origin: 'Julia Evans, 2019',
    domains: ['career'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Keep a running record of what you did and what changed because of it, because at review time nobody remembers and the invisible work disappears first.',
    useWhen: [
      'I cannot remember what I did six months ago',
      'my review focused on last month and ignored the rest of the year',
      'the work I am proudest of was invisible to my manager',
      'I find it difficult to talk about my own contributions',
    ],
    prompt:
      'Help me build an impact record. Structure each entry as what I did, why it mattered and what changed as a result, with the outcome quantified where possible — the change is the part that matters and the part people omit. Prompt me for the categories that are systematically forgotten: work that prevented a problem rather than fixed one, reviews and mentoring, documentation and tooling that made others faster, and things I stopped or simplified. Then help me phrase contributions factually rather than either inflating or minimising them, and identify where I have a gap against the expectations for my level so it can be addressed rather than discovered at review.',
    why:
      'Prompting specifically for prevention, enablement and simplification captures exactly the work that leaves no artefact and is therefore invisible at review time.',
    watchOut:
      'A list of activities without outcomes reads as busyness. The connection to what changed is what makes an entry worth having.',
    related: ['engineering-levels', 'star-method', 'sbi-feedback', 'developer-experience-metrics'],
    tags: ['career', 'evidence', 'review', 'communication'],
  },
]
