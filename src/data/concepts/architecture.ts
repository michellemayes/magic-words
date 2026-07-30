import type { Concept } from '../types'

export const architecture: Concept[] = [
  {
    id: 'hexagonal-architecture',
    name: 'Hexagonal Architecture',
    aka: ['ports and adapters', 'ports & adapters', 'hexagonal'],
    origin: 'Alistair Cockburn, 2005',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Put domain logic at the centre and let every external thing — database, HTTP, queues, UI — plug into it through ports the domain itself defines, so the core never depends on the outside.',
    useWhen: [
      'I cannot test my business logic without spinning up a database',
      'swapping our payment provider would mean touching every file',
      'the framework has leaked into code that has nothing to do with the web',
      'every unit test needs six mocks before it can run',
      'I want to change the API layer without endangering the domain rules',
    ],
    prompt:
      'Restructure this using ports and adapters. The direction of the dependency arrow is the entire pattern, so start there: list every place the core currently imports something from the outside — an ORM type, an HTTP request object, a framework annotation, a cloud SDK — because those are the violations, and rank them by how much they block testing. Then define the ports the domain would declare in its own vocabulary rather than the technology\'s, and say which are driving ports (the outside calls in) versus driven ports (the core calls out). Finally, tell me the smallest first move that gets one piece of logic testable without infrastructure.',
    variants: [
      {
        label: 'Judging whether it is worth the indirection',
        prompt:
          'Argue both sides of adopting ports and adapters here. For "yes", name the specific external thing we are likely to swap or need to test around. For "no", count the interfaces we would add that would only ever have one implementation. Then give me a verdict, and if it is yes, tell me which parts of the codebase should stay plain.',
      },
    ],
    why:
      'The pattern is usually taught as a hexagon diagram, so a model asked about it will redraw the diagram. Asking for the actual import violations and for port names in domain vocabulary is what converts it into a refactor plan for your code rather than a picture.',
    watchOut:
      'For a small CRUD service this is more indirection than it earns. An interface with exactly one implementation and no test double is pure cost.',
    related: ['clean-architecture', 'dependency-inversion', 'repository-pattern', 'anti-corruption-layer'],
    tags: ['architecture', 'testability', 'coupling', 'domain logic', 'refactoring'],
  },

  {
    id: 'mvi-architecture',
    name: 'Model-View-Intent',
    aka: ['MVI', 'unidirectional data flow', 'state reducer pattern'],
    origin: 'André Staltz, 2015; lineage from Elm and Redux',
    domains: ['engineering', 'design'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Hold the screen in a single immutable state value, render the view purely from it, and route every user action through an intent that produces the next state — one direction, no cycles.',
    useWhen: [
      'the UI gets into states that should not be possible',
      'two parts of the screen disagree about what is happening',
      'I cannot reproduce this interface bug reliably',
      'state gets mutated in five different places',
      'the loading spinner sometimes never goes away',
      'the back button leaves the screen in a weird condition',
    ],
    prompt:
      'Redesign this screen around unidirectional data flow: a single immutable state, a pure render from that state, and intents as the only way state changes. The important step is modelling state as a closed set of cases rather than a bag of nullable flags — if isLoading, error and data can all be set at once, the type is wrong. Enumerate the states that are genuinely possible, then list the combinations the current shape allows that should be unrepresentable, and match each one to a bug we have probably already seen. Then show the intent list, the reducer signature, and where side effects live given they cannot live in the reducer.',
    variants: [
      {
        label: 'Debugging rather than rebuilding',
        prompt:
          'Do not restructure anything yet. Just enumerate the impossible states the current state shape permits, and for each, the user-visible symptom it would produce. Rank by how closely each matches the bug I am actually chasing.',
      },
    ],
    why:
      'Asked about MVI, a model will describe the loop, which you already understand. The make-impossible-states-unrepresentable instruction is where the defect reduction actually comes from — without it you get the same bug surface with more ceremony.',
    watchOut:
      'Rigidly applied to a form-heavy screen, every keystroke becomes an intent and the boilerplate outweighs the safety. Local component state is fine for genuinely local things.',
    related: ['mvvm-architecture', 'clean-architecture', 'hypothesis-driven-debugging', 'dependency-inversion'],
    tags: ['architecture', 'state management', 'ui', 'frontend', 'unidirectional'],
  },

  {
    id: 'mvvm-architecture',
    name: 'Model-View-ViewModel',
    aka: ['MVVM', 'view model pattern', 'presentation model'],
    origin: 'John Gossman, Microsoft, 2005; from Fowler\'s Presentation Model',
    domains: ['engineering', 'design'],
    intents: ['structure'],
    oneLiner:
      'A view model exposes observable state and commands, and the view binds to it — so presentation logic becomes testable without ever rendering a screen.',
    useWhen: [
      'our view controllers are three thousand lines long',
      'I cannot test anything that touches the screen',
      'business logic is tangled into the UI class',
      'the same logic is copy-pasted across two screens',
      'formatting and validation live inside the view',
    ],
    prompt:
      'Restructure this into a view model and a view. Start by stating explicitly what the view model must not know about — no view types, no navigation calls, no framework UI imports, no lifecycle callbacks — and flag every place the current code would violate that, because that boundary is the only thing that makes any of this testable. Then define the view model\'s exposed state as one observable value rather than a scatter of individual properties that can disagree with each other, list the commands the view can invoke, and show what a unit test of this view model would look like with no screen involved.',
    why:
      'Most MVVM refactors fail because the view model keeps a reference to the view or to navigation. Making the model state the prohibition list first, then check it, catches that before the structure is built around it.',
    watchOut:
      'MVVM says nothing about where state changes come from. If your bug is "the screen got into an impossible state", MVI is the tighter answer.',
    related: ['mvi-architecture', 'clean-architecture', 'dependency-inversion', 'hexagonal-architecture'],
    tags: ['architecture', 'ui', 'testability', 'frontend', 'separation of concerns'],
  },

  {
    id: 'clean-architecture',
    name: 'The Dependency Rule',
    aka: ['clean architecture', 'onion architecture', 'layered architecture'],
    origin: 'Robert C. Martin, 2012; Jeffrey Palermo\'s onion architecture',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Arrange code in concentric layers where source-code dependencies only ever point inward — toward policy, away from detail — so the things that change fastest depend on the things that change slowest.',
    useWhen: [
      'changing the database forced changes in the business rules',
      'we have layers on paper but everything imports everything',
      'I genuinely do not know which layer this class belongs in',
      'upgrading a library broke logic that had nothing to do with it',
      'the domain code is full of framework annotations',
    ],
    prompt:
      'Audit this against the dependency rule. Assign each module to a layer — entities, use cases, interface adapters, frameworks and drivers — and then trace the actual import graph rather than the intended one. List every dependency that points outward. For each violation, tell me which of three fixes applies: move the interface inward so the inner layer owns it, invert it with an abstraction the inner layer declares, or accept it and write down why. Be concrete that the third option is sometimes correct — flag any violation where the purist fix would add an abstraction with one implementation and no test benefit.',
    why:
      'Licensing the model to say "accept this violation" is what keeps the output usable. Without it you get a doctrinaire list that treats a leaked logging import as equal to a domain class importing the ORM.',
    watchOut:
      'Layer counts are not the point and copying the four-ring diagram literally is a common failure. The rule is the arrow direction; the number of rings is whatever your system needs.',
    related: ['hexagonal-architecture', 'dependency-inversion', 'bounded-context', 'chestertons-fence'],
    tags: ['architecture', 'layers', 'coupling', 'dependencies', 'design principles'],
  },

  {
    id: 'dependency-inversion',
    name: 'Dependency Inversion',
    aka: ['DIP', 'depend on abstractions', 'dependency injection'],
    origin: 'Robert C. Martin; the D in SOLID',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'High-level policy should not depend on low-level detail — both should depend on an abstraction, and the high-level module is the one that owns it.',
    useWhen: [
      'my business logic imports the database driver directly',
      'I cannot test this without a real network call',
      'swapping the implementation means editing every caller',
      'this class constructs the things it depends on',
      'everything is hard to mock and the tests are slow',
    ],
    prompt:
      'Apply dependency inversion here. The part teams get wrong is ownership, so be explicit about it: the interface must be declared by the consumer, in the consumer\'s module, in the consumer\'s vocabulary — putting it in the implementation\'s package is the most common way to do dependency injection and get none of the benefit. For each dependency, tell me where the interface should live, what it should be called from the caller\'s point of view, and how the concrete implementation gets supplied at the edge. Then flag any dependency that should simply be passed in as data rather than abstracted behind an interface at all.',
    why:
      'The interface-ownership point is the one that changes code, and it is the one summaries omit. The last clause matters too: models reach for an interface when a plain function argument would do.',
    watchOut:
      'Not every dependency deserves inversion. Inverting a stable standard-library call buys nothing and costs a layer.',
    related: ['hexagonal-architecture', 'clean-architecture', 'repository-pattern', 'first-principles'],
    tags: ['architecture', 'solid', 'testability', 'coupling', 'interfaces'],
  },

  {
    id: 'repository-pattern',
    name: 'Repository Pattern',
    aka: ['repository', 'persistence abstraction', 'data access layer'],
    origin: 'Martin Fowler, Patterns of Enterprise Application Architecture',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Give the domain a collection-like interface for retrieving and storing aggregates, so query and persistence detail stays out of business logic.',
    useWhen: [
      'SQL strings are scattered through my service classes',
      'I cannot test business logic without a real database',
      'changing a table means editing a dozen unrelated files',
      'the ORM objects are being passed around the whole application',
    ],
    prompt:
      'Design repositories for this domain. Define them in terms of the domain\'s language — findActiveSubscribersDueForRenewal, not a generic find with a filter object. Then check the failure mode that makes most repository layers worthless: flag any method that leaks the query language upward (a filter or specification object shaped like SQL), any that returns a lazily-loaded handle whose behaviour depends on an open session, and any that exposes the ORM entity rather than a domain type. For each, show the replacement. Finally, tell me which repositories are thin enough that the abstraction is not paying for itself.',
    why:
      'Leaked query semantics is the specific way this pattern fails in practice — the interface looks clean while the caller is still writing queries through it. Naming the three leak shapes gets them found.',
    watchOut:
      'If your ORM already gives you a decent abstraction and you never swap stores, a repository over the top can be a second mapping layer for nothing.',
    related: ['dependency-inversion', 'hexagonal-architecture', 'anti-corruption-layer', 'cqrs'],
    tags: ['architecture', 'persistence', 'database', 'abstraction', 'testability'],
  },

  {
    id: 'bounded-context',
    name: 'Bounded Context',
    aka: ['domain driven design contexts', 'DDD bounded context', 'context mapping'],
    origin: 'Eric Evans, Domain-Driven Design, 2003',
    domains: ['engineering', 'product'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Define the boundary within which a model and its vocabulary stay consistent, and translate explicitly at the edges, instead of chasing one universal model of everything.',
    useWhen: [
      'the word customer means three different things in our system',
      'one giant shared model that nobody can change safely',
      'every team needs a different shape of the same entity',
      'we keep adding nullable fields for one team\'s use case',
      'how should we split this service up',
    ],
    prompt:
      'Find the context boundaries in this domain. The reliable signal is vocabulary drift, so start there: identify every term that means different things to different teams or in different parts of the workflow, and for each, list the distinct meanings and which part of the business owns which. Resist the urge to reconcile them into one model — the translation between contexts is the design, not a failure of it. Then draw the context map: for each pair of adjacent contexts, name the relationship (shared kernel, customer-supplier, conformist, anti-corruption layer) and what data crosses. Finish by telling me which boundary is currently causing the most pain.',
    why:
      'Explicitly forbidding reconciliation is what makes this work. A model asked to model a domain will produce one unified schema by default, which is exactly the thing bounded contexts exist to prevent.',
    watchOut:
      'Context boundaries are not automatically service boundaries. You can have several bounded contexts inside one deployable and often should.',
    related: ['anti-corruption-layer', 'clean-architecture', 'wardley-mapping', 'information-architecture'],
    tags: ['architecture', 'domain driven design', 'boundaries', 'modelling', 'services'],
  },

  {
    id: 'anti-corruption-layer',
    name: 'Anti-Corruption Layer',
    aka: ['ACL', 'translation layer', 'adapter against legacy'],
    origin: 'Eric Evans, Domain-Driven Design',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Put a deliberate translation layer between your model and an external or legacy one, so their concepts cannot leak in and deform yours.',
    useWhen: [
      'the vendor data model is spreading through our code',
      'we inherited strange field names from a system nobody owns',
      'integrating with this API is making our own domain ugly',
      'third-party types appear in code that should not know about them',
      'we are migrating off an old system but still have to read from it',
    ],
    prompt:
      'Design an anti-corruption layer between our domain and this external system. First catalogue the specific concepts that would leak without it — their identifiers, their status enums, their null conventions, their idea of what an entity is — and say how each one conflicts with ours. Then define the translation both ways, being explicit about the lossy directions and what we do when their model cannot express something ours can. Put the layer\'s interface in our vocabulary, not theirs. Finally, tell me where to draw the line: which of their concepts are genuinely ours too and should pass through untranslated, since translating everything is its own kind of waste.',
    why:
      'The "what passes through untranslated" question prevents the usual overbuild, where a team wraps a well-designed API in a pointless mapping layer out of principle.',
    related: ['bounded-context', 'strangler-fig', 'hexagonal-architecture', 'repository-pattern'],
    tags: ['architecture', 'integration', 'legacy', 'third party', 'boundaries'],
  },

  {
    id: 'strangler-fig',
    name: 'Strangler Fig',
    aka: ['strangler application', 'incremental migration', 'strangler pattern'],
    origin: 'Martin Fowler, 2004',
    domains: ['engineering', 'strategy'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Route traffic through a facade and migrate functionality piece by piece behind it, letting the new system grow around the old one until the old one can be deleted.',
    useWhen: [
      'the rewrite has taken two years and shipped nothing',
      'we cannot pause feature work long enough to migrate',
      'the old system is too big to replace in one go',
      'the big bang cutover date keeps slipping',
      'management will not fund a rewrite with no interim value',
    ],
    prompt:
      'Plan a strangler fig migration for this system. Identify the interception point where traffic can be routed per-operation, and be honest about whether one exists — if there is no clean seam, the first piece of work is creating one, and say so. Choose the first slice by seam quality rather than by business value: the first migration\'s job is to prove the interception and rollback path work, so it should be low-risk and genuinely representative. Then sequence the rest, marking which slices share state with the old system, since those are the expensive ones. Finally, name the condition under which we would stop and permanently run both, because a strangler that never finishes is the worst of all outcomes.',
    variants: [
      {
        label: 'Arguing against a full rewrite',
        prompt:
          'I am being pushed toward a full rewrite. Lay out the incremental alternative concretely enough to compare: what ships in month one under each approach, when the first user-visible benefit lands, and what happens to each plan if the team loses two people or priorities shift in month six.',
      },
    ],
    why:
      'The stopping-condition clause is the one that saves projects. Half-migrated systems are the normal outcome, and a plan that never names the abort criterion produces one by default.',
    watchOut:
      'Shared mutable state between old and new is where this gets genuinely hard. If everything writes to one database, the seam is much further away than it looks.',
    related: ['anti-corruption-layer', 'branch-by-abstraction', 'walking-skeleton', 'chestertons-fence'],
    tags: ['migration', 'legacy', 'rewrite', 'incremental', 'architecture'],
  },

  {
    id: 'branch-by-abstraction',
    name: 'Branch by Abstraction',
    aka: ['abstraction branch', 'in-place migration', 'refactor on trunk'],
    origin: 'Paul Hammant / Jez Humble, continuous delivery practice',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Introduce an abstraction over the thing you are replacing, build the new implementation behind it, switch over, then delete the old — all on the main branch, in small commits.',
    useWhen: [
      'the refactor branch has been open for three months and cannot merge',
      'we cannot make this change without freezing everyone else\'s work',
      'large changes always end in a week of merge conflicts',
      'the migration is too big for one pull request',
      'we need to be able to abandon this halfway without losing everything',
    ],
    prompt:
      'Plan this change as branch by abstraction rather than a long-lived branch. Define the abstraction that both the current and the replacement implementation can sit behind, and be specific that it must be shaped to fit the *old* implementation first — an abstraction designed around the new one will not admit the old, and the migration stalls at step one. Then give me the commit sequence: introduce the seam, route callers through it, add the new implementation behind a toggle, migrate callers in batches, remove the toggle, delete the old code. Mark which commits are individually shippable and which single step is the actual point of no return.',
    why:
      'Shaping the abstraction around the old implementation is counterintuitive and is the step that determines whether this works. Everything else is bookkeeping.',
    watchOut:
      'The abstraction is temporary scaffolding. If the deletion step never happens you have permanently added a layer to avoid a merge conflict.',
    related: ['strangler-fig', 'walking-skeleton', 'timeboxing', 'work-breakdown-structure'],
    tags: ['refactoring', 'migration', 'continuous delivery', 'trunk based', 'incremental'],
  },

  {
    id: 'cqrs',
    name: 'CQRS',
    aka: ['command query responsibility segregation', 'read write split'],
    origin: 'Greg Young, from Bertrand Meyer\'s command-query separation',
    domains: ['engineering', 'data'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Separate the model that writes from the models that read, so each can be shaped for its own job instead of one schema compromising for both.',
    useWhen: [
      'reads are slow because the schema is optimised for writing',
      'the same object has to serve twenty different screens badly',
      'reporting queries lock up the transactional tables',
      'our main entity has grown fifty fields for different views',
      'writes need validation that makes every read expensive',
    ],
    prompt:
      'Assess whether CQRS fits here, and be precise about which version. Most teams need separate read and write *models* over one store, and adopt separate *stores*, paying for eventual consistency they never needed — tell me which one this problem actually calls for. If the answer is separate models only, show the read models shaped per use case and where the mapping lives. If it genuinely is separate stores, state the staleness window users would have to tolerate, name every screen where a user would see their own write missing, and describe what we show them in that moment. Then give the simpler alternative — a read replica, a materialised view, a cache — and say why it does or does not suffice.',
    why:
      'Forcing the model-versus-store distinction, and demanding the "user does not see their own write" cases be enumerated, is what stops this becoming an expensive architecture chosen for a problem a materialised view would have solved.',
    watchOut:
      'CQRS is frequently adopted together with event sourcing as though they are one thing. They are independent choices and you can take either alone.',
    related: ['event-sourcing', 'repository-pattern', 'cohort-analysis', 'saga-pattern'],
    tags: ['architecture', 'scalability', 'database', 'read model', 'performance'],
  },

  {
    id: 'event-sourcing',
    name: 'Event Sourcing',
    aka: ['event store', 'append only log', 'events as source of truth'],
    origin: 'Greg Young / Martin Fowler',
    domains: ['engineering', 'data'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Store the sequence of state-changing events as the source of truth and derive current state by replaying them, so history is not something you bolt on afterwards.',
    useWhen: [
      'we need a full audit trail of what changed and why',
      'someone overwrote a value and we cannot tell what it was before',
      'we keep being asked what the state was last Tuesday',
      'the reason a field changed is lost the moment it changes',
      'we need to replay what happened to debug a customer issue',
    ],
    prompt:
      'Evaluate event sourcing for this domain. Skip the introduction — I know what an append-only log is. Go straight to the three things that actually decide whether it survives contact with production. First, schema evolution: what happens in eighteen months when an event\'s shape must change, and which upcasting or versioning strategy applies. Second, projections: how we rebuild a corrected read model over a large log without downtime, and how long that replay would realistically take at our volume. Third, deletion: how we honour a legal erasure request when the log is immutable, given crypto-shredding and rewriting both have real costs. Then give me a verdict, including whether an ordinary audit table would meet the actual requirement.',
    why:
      'Every summary of event sourcing sells the upside. Pinning the model to versioning, replay and erasure gets the three problems that make teams regret it, and the audit-table question kills most speculative adoptions honestly.',
    watchOut:
      'This is a high-commitment choice that is very hard to reverse. Read the one-way-door framing before adopting it.',
    related: ['cqrs', 'timeline-reconstruction', 'type-1-type-2-decisions', 'saga-pattern'],
    tags: ['architecture', 'audit trail', 'history', 'database', 'events'],
  },

  {
    id: 'saga-pattern',
    name: 'Saga Pattern',
    aka: ['distributed transaction', 'compensating transaction', 'process manager'],
    origin: 'Garcia-Molina & Salem, 1987',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Coordinate a business transaction across services as a sequence of local steps, each with a compensating action, because you cannot hold a lock across a network.',
    useWhen: [
      'the payment succeeded but the order was never created',
      'we need one transaction spanning three separate services',
      'half-completed operations leave data inconsistent',
      'retrying a failed step charged the customer twice',
      'how do we roll back something another service already did',
    ],
    prompt:
      'Design a saga for this workflow. The critical distinction is that compensations are not rollbacks — some steps genuinely cannot be undone, because an email went out or money moved or a third party was told. So for each step, classify it as compensatable, retryable, or pivot (the point of no return), and then reorder the workflow so that every non-compensatable step comes after the pivot. Specify the compensating action for each compensatable step, and say what a user or operator sees if compensation itself fails. Choose orchestration or choreography and justify it. Finally, tell me which steps must be idempotent and what the idempotency key is, since retries are guaranteed.',
    why:
      'The compensatable / retryable / pivot classification plus the reordering instruction is the actual design work, and it is what generic saga explanations leave out. The idempotency-key question catches the double-charge bug before it ships.',
    watchOut:
      'If all the steps are inside one service and one database, you want a database transaction, not a saga.',
    related: ['event-sourcing', 'cqrs', 'fmea', 'backend-for-frontend'],
    tags: ['architecture', 'distributed systems', 'microservices', 'consistency', 'transactions'],
  },

  {
    id: 'backend-for-frontend',
    name: 'Backend for Frontend',
    aka: ['BFF', 'client specific api', 'api gateway per client'],
    origin: 'SoundCloud, popularised by Sam Newman',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Give each client its own thin backend that aggregates and shapes data for that client\'s screens, instead of one general-purpose API serving every client badly.',
    useWhen: [
      'our mobile app makes eleven calls to render one screen',
      'the web and mobile teams keep fighting over API changes',
      'the API is generic so every client over-fetches and then discards',
      'we cannot change the API without coordinating four release trains',
      'mobile needs a different payload shape than the web does',
    ],
    prompt:
      'Assess a backend-for-frontend split here. Start with the ownership question, because it is what makes this work or fail: each BFF must be owned by the client team that consumes it, and if it would be owned by the platform team you get an extra hop and none of the autonomy — say plainly which would happen in our org. Then map what each client actually needs per screen, showing where the current API forces over-fetching or chattiness. Specify what belongs in the BFF (aggregation, shaping, client-specific formatting) and what must not (business rules, authorisation decisions), since duplicated logic across BFFs is the standard way this decays. Then give me the honest cost: how much logic would be duplicated, and whether GraphQL or a per-screen endpoint would solve this more cheaply.',
    why:
      'The ownership test is the deciding factor and almost never appears in summaries. Asking which team would really own it converts an architecture debate into an org question, which is what it actually is.',
    watchOut:
      'Every BFF is another deployable to run, secure and monitor. Two clients with similar needs rarely justify two.',
    related: ['saga-pattern', 'bounded-context', 'twelve-factor-app', 'hexagonal-architecture'],
    tags: ['architecture', 'api design', 'microservices', 'mobile', 'frontend'],
  },

  {
    id: 'twelve-factor-app',
    name: 'Twelve-Factor App',
    aka: ['12 factor', 'cloud native checklist', 'twelve factors'],
    origin: 'Adam Wiggins, Heroku, 2011',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Twelve constraints — config in the environment, stateless processes, disposability, dev/prod parity — that make a service deployable, scalable and disposable on modern infrastructure.',
    useWhen: [
      'it works on my machine and nowhere else',
      'deploying requires a runbook of manual steps',
      'we cannot run more than one instance of this service',
      'configuration is baked into the build artefact',
      'restarting the service loses data or breaks sessions',
      'staging behaves differently from production for no clear reason',
    ],
    prompt:
      'Audit this service against the twelve factors. Go factor by factor with a pass, partial or fail verdict and the specific evidence in our setup. Then do the part that matters more than the checklist: rank the failures by what they actually prevent us from doing — which ones block horizontal scaling, which block a clean rollback, which cause the environment drift we keep debugging, and which are merely stylistic. Some factors are genuinely optional for a service like ours, so say which ones and why rather than marking everything as a gap. Finish with the single fix that would remove the most operational pain.',
    why:
      'Scoring twelve factors produces a checklist nobody acts on. Ranking failures by the capability they block turns it into a prioritised list, and licensing the model to call factors optional keeps it credible.',
    watchOut:
      'Written for stateless twelve-factor web services on a PaaS. Stateful systems, batch jobs and databases legitimately break several of these.',
    related: ['backend-for-frontend', 'observability-triage', 'definition-of-done', 'blameless-postmortem'],
    tags: ['deployment', 'operations', 'cloud', 'configuration', 'scalability'],
  },
]
