#!/usr/bin/env node
/*
 * GENERATED FILE — do not edit.
 *
 * Built from src/ by `npm run build:skill` in
 * https://github.com/michellemayes/magic-words, so that this skill is one
 * self-contained directory with no install step. Edit the corpus or the
 * ranking there and rebuild; edits made here are lost on the next build.
 */
//#region src/data/concepts/architecture.ts
var architecture = [
	{
		id: "hexagonal-architecture",
		name: "Hexagonal Architecture",
		aka: [
			"ports and adapters",
			"ports & adapters",
			"hexagonal"
		],
		origin: "Alistair Cockburn, 2005",
		domains: ["engineering"],
		intents: ["structure", "reframe"],
		oneLiner: "Put domain logic at the centre and let every external thing — database, HTTP, queues, UI — plug into it through ports the domain itself defines, so the core never depends on the outside.",
		useWhen: [
			"I cannot test my business logic without spinning up a database",
			"swapping our payment provider would mean touching every file",
			"the framework has leaked into code that has nothing to do with the web",
			"every unit test needs six mocks before it can run",
			"I want to change the API layer without endangering the domain rules"
		],
		prompt: "Restructure this using ports and adapters. The direction of the dependency arrow is the entire pattern, so start there: list every place the core currently imports something from the outside — an ORM type, an HTTP request object, a framework annotation, a cloud SDK — because those are the violations, and rank them by how much they block testing. Then define the ports the domain would declare in its own vocabulary rather than the technology's, and say which are driving ports (the outside calls in) versus driven ports (the core calls out). Finally, tell me the smallest first move that gets one piece of logic testable without infrastructure.",
		variants: [{
			label: "Judging whether it is worth the indirection",
			prompt: "Argue both sides of adopting ports and adapters here. For \"yes\", name the specific external thing we are likely to swap or need to test around. For \"no\", count the interfaces we would add that would only ever have one implementation. Then give me a verdict, and if it is yes, tell me which parts of the codebase should stay plain."
		}],
		why: "The pattern is usually taught as a hexagon diagram, so a model asked about it will redraw the diagram. Asking for the actual import violations and for port names in domain vocabulary is what converts it into a refactor plan for your code rather than a picture.",
		watchOut: "For a small CRUD service this is more indirection than it earns. An interface with exactly one implementation and no test double is pure cost.",
		related: [
			"clean-architecture",
			"dependency-inversion",
			"repository-pattern",
			"anti-corruption-layer"
		],
		tags: [
			"architecture",
			"testability",
			"coupling",
			"domain logic",
			"refactoring"
		]
	},
	{
		id: "mvi-architecture",
		name: "Model-View-Intent",
		aka: [
			"MVI",
			"unidirectional data flow",
			"state reducer pattern"
		],
		origin: "André Staltz, 2015; lineage from Elm and Redux",
		domains: ["engineering", "design"],
		intents: ["structure", "diagnose"],
		oneLiner: "Hold the screen in a single immutable state value, render the view purely from it, and route every user action through an intent that produces the next state — one direction, no cycles.",
		useWhen: [
			"the UI gets into states that should not be possible",
			"two parts of the screen disagree about what is happening",
			"I cannot reproduce this interface bug reliably",
			"state gets mutated in five different places",
			"the loading spinner sometimes never goes away",
			"the back button leaves the screen in a weird condition"
		],
		prompt: "Redesign this screen around unidirectional data flow: a single immutable state, a pure render from that state, and intents as the only way state changes. The important step is modelling state as a closed set of cases rather than a bag of nullable flags — if isLoading, error and data can all be set at once, the type is wrong. Enumerate the states that are genuinely possible, then list the combinations the current shape allows that should be unrepresentable, and match each one to a bug we have probably already seen. Then show the intent list, the reducer signature, and where side effects live given they cannot live in the reducer.",
		variants: [{
			label: "Debugging rather than rebuilding",
			prompt: "Do not restructure anything yet. Just enumerate the impossible states the current state shape permits, and for each, the user-visible symptom it would produce. Rank by how closely each matches the bug I am actually chasing."
		}],
		why: "Asked about MVI, a model will describe the loop, which you already understand. The make-impossible-states-unrepresentable instruction is where the defect reduction actually comes from — without it you get the same bug surface with more ceremony.",
		watchOut: "Rigidly applied to a form-heavy screen, every keystroke becomes an intent and the boilerplate outweighs the safety. Local component state is fine for genuinely local things.",
		related: [
			"mvvm-architecture",
			"clean-architecture",
			"hypothesis-driven-debugging",
			"dependency-inversion"
		],
		tags: [
			"architecture",
			"state management",
			"ui",
			"frontend",
			"unidirectional"
		]
	},
	{
		id: "mvvm-architecture",
		name: "Model-View-ViewModel",
		aka: [
			"MVVM",
			"view model pattern",
			"presentation model"
		],
		origin: "John Gossman, Microsoft, 2005; from Fowler's Presentation Model",
		domains: ["engineering", "design"],
		intents: ["structure"],
		oneLiner: "A view model exposes observable state and commands, and the view binds to it — so presentation logic becomes testable without ever rendering a screen.",
		useWhen: [
			"our view controllers are three thousand lines long",
			"I cannot test anything that touches the screen",
			"business logic is tangled into the UI class",
			"the same logic is copy-pasted across two screens",
			"formatting and validation live inside the view"
		],
		prompt: "Restructure this into a view model and a view. Start by stating explicitly what the view model must not know about — no view types, no navigation calls, no framework UI imports, no lifecycle callbacks — and flag every place the current code would violate that, because that boundary is the only thing that makes any of this testable. Then define the view model's exposed state as one observable value rather than a scatter of individual properties that can disagree with each other, list the commands the view can invoke, and show what a unit test of this view model would look like with no screen involved.",
		why: "Most MVVM refactors fail because the view model keeps a reference to the view or to navigation. Making the model state the prohibition list first, then check it, catches that before the structure is built around it.",
		watchOut: "MVVM says nothing about where state changes come from. If your bug is \"the screen got into an impossible state\", MVI is the tighter answer.",
		related: [
			"mvi-architecture",
			"clean-architecture",
			"dependency-inversion",
			"hexagonal-architecture"
		],
		tags: [
			"architecture",
			"ui",
			"testability",
			"frontend",
			"separation of concerns"
		]
	},
	{
		id: "clean-architecture",
		name: "The Dependency Rule",
		aka: [
			"clean architecture",
			"onion architecture",
			"layered architecture"
		],
		origin: "Robert C. Martin, 2012; Jeffrey Palermo's onion architecture",
		domains: ["engineering"],
		intents: ["structure", "critique"],
		oneLiner: "Arrange code in concentric layers where source-code dependencies only ever point inward — toward policy, away from detail — so the things that change fastest depend on the things that change slowest.",
		useWhen: [
			"changing the database forced changes in the business rules",
			"we have layers on paper but everything imports everything",
			"I genuinely do not know which layer this class belongs in",
			"upgrading a library broke logic that had nothing to do with it",
			"the domain code is full of framework annotations"
		],
		prompt: "Audit this against the dependency rule. Assign each module to a layer — entities, use cases, interface adapters, frameworks and drivers — and then trace the actual import graph rather than the intended one. List every dependency that points outward. For each violation, tell me which of three fixes applies: move the interface inward so the inner layer owns it, invert it with an abstraction the inner layer declares, or accept it and write down why. Be concrete that the third option is sometimes correct — flag any violation where the purist fix would add an abstraction with one implementation and no test benefit.",
		why: "Licensing the model to say \"accept this violation\" is what keeps the output usable. Without it you get a doctrinaire list that treats a leaked logging import as equal to a domain class importing the ORM.",
		watchOut: "Layer counts are not the point and copying the four-ring diagram literally is a common failure. The rule is the arrow direction; the number of rings is whatever your system needs.",
		related: [
			"hexagonal-architecture",
			"dependency-inversion",
			"bounded-context",
			"chestertons-fence"
		],
		tags: [
			"architecture",
			"layers",
			"coupling",
			"dependencies",
			"design principles"
		]
	},
	{
		id: "dependency-inversion",
		name: "Dependency Inversion",
		aka: [
			"DIP",
			"depend on abstractions",
			"dependency injection"
		],
		origin: "Robert C. Martin; the D in SOLID",
		domains: ["engineering"],
		intents: ["structure", "reframe"],
		oneLiner: "High-level policy should not depend on low-level detail — both should depend on an abstraction, and the high-level module is the one that owns it.",
		useWhen: [
			"my business logic imports the database driver directly",
			"I cannot test this without a real network call",
			"swapping the implementation means editing every caller",
			"this class constructs the things it depends on",
			"everything is hard to mock and the tests are slow"
		],
		prompt: "Apply dependency inversion here. The part teams get wrong is ownership, so be explicit about it: the interface must be declared by the consumer, in the consumer's module, in the consumer's vocabulary — putting it in the implementation's package is the most common way to do dependency injection and get none of the benefit. For each dependency, tell me where the interface should live, what it should be called from the caller's point of view, and how the concrete implementation gets supplied at the edge. Then flag any dependency that should simply be passed in as data rather than abstracted behind an interface at all.",
		why: "The interface-ownership point is the one that changes code, and it is the one summaries omit. The last clause matters too: models reach for an interface when a plain function argument would do.",
		watchOut: "Not every dependency deserves inversion. Inverting a stable standard-library call buys nothing and costs a layer.",
		related: [
			"hexagonal-architecture",
			"clean-architecture",
			"repository-pattern",
			"first-principles"
		],
		tags: [
			"architecture",
			"solid",
			"testability",
			"coupling",
			"interfaces"
		]
	},
	{
		id: "repository-pattern",
		name: "Repository Pattern",
		aka: [
			"repository",
			"persistence abstraction",
			"data access layer"
		],
		origin: "Martin Fowler, Patterns of Enterprise Application Architecture",
		domains: ["engineering"],
		intents: ["structure"],
		oneLiner: "Give the domain a collection-like interface for retrieving and storing aggregates, so query and persistence detail stays out of business logic.",
		useWhen: [
			"SQL strings are scattered through my service classes",
			"I cannot test business logic without a real database",
			"changing a table means editing a dozen unrelated files",
			"the ORM objects are being passed around the whole application"
		],
		prompt: "Design repositories for this domain. Define them in terms of the domain's language — findActiveSubscribersDueForRenewal, not a generic find with a filter object. Then check the failure mode that makes most repository layers worthless: flag any method that leaks the query language upward (a filter or specification object shaped like SQL), any that returns a lazily-loaded handle whose behaviour depends on an open session, and any that exposes the ORM entity rather than a domain type. For each, show the replacement. Finally, tell me which repositories are thin enough that the abstraction is not paying for itself.",
		why: "Leaked query semantics is the specific way this pattern fails in practice — the interface looks clean while the caller is still writing queries through it. Naming the three leak shapes gets them found.",
		watchOut: "If your ORM already gives you a decent abstraction and you never swap stores, a repository over the top can be a second mapping layer for nothing.",
		related: [
			"dependency-inversion",
			"hexagonal-architecture",
			"anti-corruption-layer",
			"cqrs"
		],
		tags: [
			"architecture",
			"persistence",
			"database",
			"abstraction",
			"testability"
		]
	},
	{
		id: "bounded-context",
		name: "Bounded Context",
		aka: [
			"domain driven design contexts",
			"DDD bounded context",
			"context mapping"
		],
		origin: "Eric Evans, Domain-Driven Design, 2003",
		domains: ["engineering", "product"],
		intents: ["structure", "reframe"],
		oneLiner: "Define the boundary within which a model and its vocabulary stay consistent, and translate explicitly at the edges, instead of chasing one universal model of everything.",
		useWhen: [
			"the word customer means three different things in our system",
			"one giant shared model that nobody can change safely",
			"every team needs a different shape of the same entity",
			"we keep adding nullable fields for one team's use case",
			"how should we split this service up"
		],
		prompt: "Find the context boundaries in this domain. The reliable signal is vocabulary drift, so start there: identify every term that means different things to different teams or in different parts of the workflow, and for each, list the distinct meanings and which part of the business owns which. Resist the urge to reconcile them into one model — the translation between contexts is the design, not a failure of it. Then draw the context map: for each pair of adjacent contexts, name the relationship (shared kernel, customer-supplier, conformist, anti-corruption layer) and what data crosses. Finish by telling me which boundary is currently causing the most pain.",
		why: "Explicitly forbidding reconciliation is what makes this work. A model asked to model a domain will produce one unified schema by default, which is exactly the thing bounded contexts exist to prevent.",
		watchOut: "Context boundaries are not automatically service boundaries. You can have several bounded contexts inside one deployable and often should.",
		related: [
			"anti-corruption-layer",
			"clean-architecture",
			"wardley-mapping",
			"information-architecture"
		],
		tags: [
			"architecture",
			"domain driven design",
			"boundaries",
			"modelling",
			"services"
		]
	},
	{
		id: "anti-corruption-layer",
		name: "Anti-Corruption Layer",
		aka: [
			"ACL",
			"translation layer",
			"adapter against legacy"
		],
		origin: "Eric Evans, Domain-Driven Design",
		domains: ["engineering"],
		intents: ["structure", "plan"],
		oneLiner: "Put a deliberate translation layer between your model and an external or legacy one, so their concepts cannot leak in and deform yours.",
		useWhen: [
			"the vendor data model is spreading through our code",
			"we inherited strange field names from a system nobody owns",
			"integrating with this API is making our own domain ugly",
			"third-party types appear in code that should not know about them",
			"we are migrating off an old system but still have to read from it"
		],
		prompt: "Design an anti-corruption layer between our domain and this external system. First catalogue the specific concepts that would leak without it — their identifiers, their status enums, their null conventions, their idea of what an entity is — and say how each one conflicts with ours. Then define the translation both ways, being explicit about the lossy directions and what we do when their model cannot express something ours can. Put the layer's interface in our vocabulary, not theirs. Finally, tell me where to draw the line: which of their concepts are genuinely ours too and should pass through untranslated, since translating everything is its own kind of waste.",
		why: "The \"what passes through untranslated\" question prevents the usual overbuild, where a team wraps a well-designed API in a pointless mapping layer out of principle.",
		related: [
			"bounded-context",
			"strangler-fig",
			"hexagonal-architecture",
			"repository-pattern"
		],
		tags: [
			"architecture",
			"integration",
			"legacy",
			"third party",
			"boundaries"
		]
	},
	{
		id: "strangler-fig",
		name: "Strangler Fig",
		aka: [
			"strangler application",
			"incremental migration",
			"strangler pattern"
		],
		origin: "Martin Fowler, 2004",
		domains: ["engineering", "strategy"],
		intents: ["plan", "decide"],
		oneLiner: "Route traffic through a facade and migrate functionality piece by piece behind it, letting the new system grow around the old one until the old one can be deleted.",
		useWhen: [
			"the rewrite has taken two years and shipped nothing",
			"we cannot pause feature work long enough to migrate",
			"the old system is too big to replace in one go",
			"the big bang cutover date keeps slipping",
			"management will not fund a rewrite with no interim value"
		],
		prompt: "Plan a strangler fig migration for this system. Identify the interception point where traffic can be routed per-operation, and be honest about whether one exists — if there is no clean seam, the first piece of work is creating one, and say so. Choose the first slice by seam quality rather than by business value: the first migration's job is to prove the interception and rollback path work, so it should be low-risk and genuinely representative. Then sequence the rest, marking which slices share state with the old system, since those are the expensive ones. Finally, name the condition under which we would stop and permanently run both, because a strangler that never finishes is the worst of all outcomes.",
		variants: [{
			label: "Arguing against a full rewrite",
			prompt: "I am being pushed toward a full rewrite. Lay out the incremental alternative concretely enough to compare: what ships in month one under each approach, when the first user-visible benefit lands, and what happens to each plan if the team loses two people or priorities shift in month six."
		}],
		why: "The stopping-condition clause is the one that saves projects. Half-migrated systems are the normal outcome, and a plan that never names the abort criterion produces one by default.",
		watchOut: "Shared mutable state between old and new is where this gets genuinely hard. If everything writes to one database, the seam is much further away than it looks.",
		related: [
			"anti-corruption-layer",
			"branch-by-abstraction",
			"walking-skeleton",
			"chestertons-fence"
		],
		tags: [
			"migration",
			"legacy",
			"rewrite",
			"incremental",
			"architecture"
		]
	},
	{
		id: "branch-by-abstraction",
		name: "Branch by Abstraction",
		aka: [
			"abstraction branch",
			"in-place migration",
			"refactor on trunk"
		],
		origin: "Paul Hammant / Jez Humble, continuous delivery practice",
		domains: ["engineering"],
		intents: ["plan", "structure"],
		oneLiner: "Introduce an abstraction over the thing you are replacing, build the new implementation behind it, switch over, then delete the old — all on the main branch, in small commits.",
		useWhen: [
			"the refactor branch has been open for three months and cannot merge",
			"we cannot make this change without freezing everyone else's work",
			"large changes always end in a week of merge conflicts",
			"the migration is too big for one pull request",
			"we need to be able to abandon this halfway without losing everything"
		],
		prompt: "Plan this change as branch by abstraction rather than a long-lived branch. Define the abstraction that both the current and the replacement implementation can sit behind, and be specific that it must be shaped to fit the *old* implementation first — an abstraction designed around the new one will not admit the old, and the migration stalls at step one. Then give me the commit sequence: introduce the seam, route callers through it, add the new implementation behind a toggle, migrate callers in batches, remove the toggle, delete the old code. Mark which commits are individually shippable and which single step is the actual point of no return.",
		why: "Shaping the abstraction around the old implementation is counterintuitive and is the step that determines whether this works. Everything else is bookkeeping.",
		watchOut: "The abstraction is temporary scaffolding. If the deletion step never happens you have permanently added a layer to avoid a merge conflict.",
		related: [
			"strangler-fig",
			"walking-skeleton",
			"timeboxing",
			"work-breakdown-structure"
		],
		tags: [
			"refactoring",
			"migration",
			"continuous delivery",
			"trunk based",
			"incremental"
		]
	},
	{
		id: "cqrs",
		name: "CQRS",
		aka: ["command query responsibility segregation", "read write split"],
		origin: "Greg Young, from Bertrand Meyer's command-query separation",
		domains: ["engineering", "data"],
		intents: ["structure", "decide"],
		oneLiner: "Separate the model that writes from the models that read, so each can be shaped for its own job instead of one schema compromising for both.",
		useWhen: [
			"reads are slow because the schema is optimised for writing",
			"the same object has to serve twenty different screens badly",
			"reporting queries lock up the transactional tables",
			"our main entity has grown fifty fields for different views",
			"writes need validation that makes every read expensive"
		],
		prompt: "Assess whether CQRS fits here, and be precise about which version. Most teams need separate read and write *models* over one store, and adopt separate *stores*, paying for eventual consistency they never needed — tell me which one this problem actually calls for. If the answer is separate models only, show the read models shaped per use case and where the mapping lives. If it genuinely is separate stores, state the staleness window users would have to tolerate, name every screen where a user would see their own write missing, and describe what we show them in that moment. Then give the simpler alternative — a read replica, a materialised view, a cache — and say why it does or does not suffice.",
		why: "Forcing the model-versus-store distinction, and demanding the \"user does not see their own write\" cases be enumerated, is what stops this becoming an expensive architecture chosen for a problem a materialised view would have solved.",
		watchOut: "CQRS is frequently adopted together with event sourcing as though they are one thing. They are independent choices and you can take either alone.",
		related: [
			"event-sourcing",
			"repository-pattern",
			"cohort-analysis",
			"saga-pattern"
		],
		tags: [
			"architecture",
			"scalability",
			"database",
			"read model",
			"performance"
		]
	},
	{
		id: "event-sourcing",
		name: "Event Sourcing",
		aka: [
			"event store",
			"append only log",
			"events as source of truth"
		],
		origin: "Greg Young / Martin Fowler",
		domains: ["engineering", "data"],
		intents: ["structure", "decide"],
		oneLiner: "Store the sequence of state-changing events as the source of truth and derive current state by replaying them, so history is not something you bolt on afterwards.",
		useWhen: [
			"we need a full audit trail of what changed and why",
			"someone overwrote a value and we cannot tell what it was before",
			"we keep being asked what the state was last Tuesday",
			"the reason a field changed is lost the moment it changes",
			"we need to replay what happened to debug a customer issue"
		],
		prompt: "Evaluate event sourcing for this domain. Skip the introduction — I know what an append-only log is. Go straight to the three things that actually decide whether it survives contact with production. First, schema evolution: what happens in eighteen months when an event's shape must change, and which upcasting or versioning strategy applies. Second, projections: how we rebuild a corrected read model over a large log without downtime, and how long that replay would realistically take at our volume. Third, deletion: how we honour a legal erasure request when the log is immutable, given crypto-shredding and rewriting both have real costs. Then give me a verdict, including whether an ordinary audit table would meet the actual requirement.",
		why: "Every summary of event sourcing sells the upside. Pinning the model to versioning, replay and erasure gets the three problems that make teams regret it, and the audit-table question kills most speculative adoptions honestly.",
		watchOut: "This is a high-commitment choice that is very hard to reverse. Read the one-way-door framing before adopting it.",
		related: [
			"cqrs",
			"timeline-reconstruction",
			"type-1-type-2-decisions",
			"saga-pattern"
		],
		tags: [
			"architecture",
			"audit trail",
			"history",
			"database",
			"events"
		]
	},
	{
		id: "saga-pattern",
		name: "Saga Pattern",
		aka: [
			"distributed transaction",
			"compensating transaction",
			"process manager"
		],
		origin: "Garcia-Molina & Salem, 1987",
		domains: ["engineering"],
		intents: ["structure", "plan"],
		oneLiner: "Coordinate a business transaction across services as a sequence of local steps, each with a compensating action, because you cannot hold a lock across a network.",
		useWhen: [
			"the payment succeeded but the order was never created",
			"we need one transaction spanning three separate services",
			"half-completed operations leave data inconsistent",
			"retrying a failed step charged the customer twice",
			"how do we roll back something another service already did"
		],
		prompt: "Design a saga for this workflow. The critical distinction is that compensations are not rollbacks — some steps genuinely cannot be undone, because an email went out or money moved or a third party was told. So for each step, classify it as compensatable, retryable, or pivot (the point of no return), and then reorder the workflow so that every non-compensatable step comes after the pivot. Specify the compensating action for each compensatable step, and say what a user or operator sees if compensation itself fails. Choose orchestration or choreography and justify it. Finally, tell me which steps must be idempotent and what the idempotency key is, since retries are guaranteed.",
		why: "The compensatable / retryable / pivot classification plus the reordering instruction is the actual design work, and it is what generic saga explanations leave out. The idempotency-key question catches the double-charge bug before it ships.",
		watchOut: "If all the steps are inside one service and one database, you want a database transaction, not a saga.",
		related: [
			"event-sourcing",
			"cqrs",
			"fmea",
			"backend-for-frontend"
		],
		tags: [
			"architecture",
			"distributed systems",
			"microservices",
			"consistency",
			"transactions"
		]
	},
	{
		id: "backend-for-frontend",
		name: "Backend for Frontend",
		aka: [
			"BFF",
			"client specific api",
			"api gateway per client"
		],
		origin: "SoundCloud, popularised by Sam Newman",
		domains: ["engineering"],
		intents: ["structure", "decide"],
		oneLiner: "Give each client its own thin backend that aggregates and shapes data for that client's screens, instead of one general-purpose API serving every client badly.",
		useWhen: [
			"our mobile app makes eleven calls to render one screen",
			"the web and mobile teams keep fighting over API changes",
			"the API is generic so every client over-fetches and then discards",
			"we cannot change the API without coordinating four release trains",
			"mobile needs a different payload shape than the web does"
		],
		prompt: "Assess a backend-for-frontend split here. Start with the ownership question, because it is what makes this work or fail: each BFF must be owned by the client team that consumes it, and if it would be owned by the platform team you get an extra hop and none of the autonomy — say plainly which would happen in our org. Then map what each client actually needs per screen, showing where the current API forces over-fetching or chattiness. Specify what belongs in the BFF (aggregation, shaping, client-specific formatting) and what must not (business rules, authorisation decisions), since duplicated logic across BFFs is the standard way this decays. Then give me the honest cost: how much logic would be duplicated, and whether GraphQL or a per-screen endpoint would solve this more cheaply.",
		why: "The ownership test is the deciding factor and almost never appears in summaries. Asking which team would really own it converts an architecture debate into an org question, which is what it actually is.",
		watchOut: "Every BFF is another deployable to run, secure and monitor. Two clients with similar needs rarely justify two.",
		related: [
			"saga-pattern",
			"bounded-context",
			"twelve-factor-app",
			"hexagonal-architecture"
		],
		tags: [
			"architecture",
			"api design",
			"microservices",
			"mobile",
			"frontend"
		]
	},
	{
		id: "twelve-factor-app",
		name: "Twelve-Factor App",
		aka: [
			"12 factor",
			"cloud native checklist",
			"twelve factors"
		],
		origin: "Adam Wiggins, Heroku, 2011",
		domains: ["engineering"],
		intents: ["critique", "structure"],
		oneLiner: "Twelve constraints — config in the environment, stateless processes, disposability, dev/prod parity — that make a service deployable, scalable and disposable on modern infrastructure.",
		useWhen: [
			"it works on my machine and nowhere else",
			"deploying requires a runbook of manual steps",
			"we cannot run more than one instance of this service",
			"configuration is baked into the build artefact",
			"restarting the service loses data or breaks sessions",
			"staging behaves differently from production for no clear reason"
		],
		prompt: "Audit this service against the twelve factors. Go factor by factor with a pass, partial or fail verdict and the specific evidence in our setup. Then do the part that matters more than the checklist: rank the failures by what they actually prevent us from doing — which ones block horizontal scaling, which block a clean rollback, which cause the environment drift we keep debugging, and which are merely stylistic. Some factors are genuinely optional for a service like ours, so say which ones and why rather than marking everything as a gap. Finish with the single fix that would remove the most operational pain.",
		why: "Scoring twelve factors produces a checklist nobody acts on. Ranking failures by the capability they block turns it into a prioritised list, and licensing the model to call factors optional keeps it credible.",
		watchOut: "Written for stateless twelve-factor web services on a PaaS. Stateful systems, batch jobs and databases legitimately break several of these.",
		related: [
			"backend-for-frontend",
			"observability-triage",
			"definition-of-done",
			"blameless-postmortem"
		],
		tags: [
			"deployment",
			"operations",
			"cloud",
			"configuration",
			"scalability"
		]
	}
];
//#endregion
//#region src/data/concepts/security.ts
var security = [
	{
		id: "least-privilege",
		name: "Principle of Least Privilege",
		aka: [
			"least privilege access",
			"PoLP",
			"minimum necessary access",
			"need to know"
		],
		origin: "Saltzer & Schroeder, 1975",
		domains: ["security", "engineering"],
		intents: ["critique", "structure"],
		oneLiner: "Every user, service and process gets exactly the permissions its job requires, for exactly as long as it requires them, and nothing more.",
		useWhen: [
			"everyone on the team has admin because it was easier",
			"this service account can do far more than it needs to",
			"we granted access for a migration two years ago and never removed it",
			"a compromised key would give an attacker the whole system",
			"our IAM policy is a wildcard and I know that is bad",
			"contractors still have access months after leaving"
		],
		prompt: "Apply least privilege to this. For each identity — human, service account, CI job, third-party integration — list what it can currently do, then what it demonstrably needs for its actual job, and produce the delta. Do this along all four dimensions, not just the first: which actions, on which resources, under which conditions, and for how long. Flag every standing permission that should be time-bound or request-based instead. Then tell me the order to tighten in, prioritised by what a compromise of that identity would currently reach, and mark the changes likely to break something so I can stage them safely.",
		variants: [{
			label: "Reviewing a specific policy or role",
			prompt: "Review this IAM policy against least privilege. For every wildcard in an action or resource, tell me the concrete enumerated list that would replace it, and what would break if I made that substitution today. Rank by blast radius if this credential leaked, and separate the permissions that are merely broad from the ones that allow privilege escalation."
		}, {
			label: "Designing access for something new",
			prompt: "I am about to grant access for a new service. Start from zero rather than from a template: what is the minimum set of permissions it needs for its first task, what should be granted just-in-time instead of standing, and what audit trail should exist for each. Tell me what I would need to add later and why it is better to add it then than now."
		}],
		why: "Asked generically, a model recites the definition. The four dimensions — actions, resources, conditions, duration — are what turn it into an audit, and duration is the one teams skip: most over-permission is standing access that was correct for one afternoon in 2023.",
		watchOut: "Tightened too aggressively without staging, this breaks production at the worst moment. The \"what will break\" column is not optional, and neither is a fast path to grant access back.",
		related: [
			"zero-trust",
			"separation-of-duties",
			"break-glass-access",
			"blast-radius",
			"attack-surface-reduction"
		],
		tags: [
			"security",
			"access control",
			"permissions",
			"iam",
			"hardening"
		]
	},
	{
		id: "defense-in-depth",
		name: "Defence in Depth",
		aka: [
			"layered security",
			"defense in depth",
			"no single point of security failure"
		],
		origin: "Military doctrine; adopted in information security",
		domains: ["security", "engineering"],
		intents: ["structure", "critique"],
		oneLiner: "Assume any single control will eventually fail, and layer independent controls so that no one failure is enough to cause a breach.",
		useWhen: [
			"we have a firewall so we are fine right",
			"everything depends on one check being correct",
			"if someone got past the login they could do anything",
			"how many layers of protection is enough",
			"the whole security model rests on one gateway"
		],
		prompt: "Assess this design for defence in depth. Map the controls an attacker would meet in sequence, then apply the real test: assume each one has already failed, one at a time, and describe what the attacker reaches. Pay particular attention to controls that share a failure mode — two checks that both depend on the same identity service, the same config flag, or the same assumption about network position are one control wearing two hats, not two layers. Then tell me where a genuinely independent layer would add the most, and where an extra layer would only add operational cost.",
		why: "The shared-failure-mode test is the part that matters and the part summaries omit. Teams routinely count correlated controls as separate layers, which is how a single expired certificate or misapplied flag takes down the whole chain.",
		watchOut: "Layers cost latency, complexity and on-call pain. Depth for its own sake produces systems nobody can debug at 3am.",
		related: [
			"least-privilege",
			"blast-radius",
			"fail-closed",
			"threat-modeling-stride",
			"fmea"
		],
		tags: [
			"security",
			"architecture",
			"resilience",
			"controls",
			"hardening"
		]
	},
	{
		id: "threat-modeling-stride",
		name: "Threat Modelling (STRIDE)",
		aka: [
			"STRIDE",
			"threat model",
			"security design review"
		],
		origin: "Loren Kohnfelder & Praerit Garg, Microsoft, 1999",
		domains: ["security", "engineering"],
		intents: ["critique", "plan"],
		oneLiner: "Walk a design against six threat categories — spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege — so coverage comes from a checklist rather than from imagination.",
		useWhen: [
			"we need a security review before launch",
			"I do not know what could go wrong security-wise",
			"how do I even start thinking about attacks on this",
			"the design is done and nobody has looked at it from a security angle",
			"we handle sensitive data and I want to be systematic"
		],
		prompt: "Threat model this using STRIDE. First draw the data flow: the components, the data stores, the external entities, and — most importantly — the trust boundaries where data crosses between differently-trusted parties. Then walk each element against all six STRIDE categories rather than only the ones that feel relevant, since the point of the checklist is to catch what intuition skips. For each threat: how it would be carried out concretely, what it gets the attacker, whether we already mitigate it, and the specific control if we do not. Rank by likelihood multiplied by impact, and explicitly list what we are choosing to accept, because unrecorded accepted risk is indistinguishable from a miss.",
		why: "Insisting on all six categories per element is the whole method — the value of a checklist is precisely that it forces attention onto the categories you would not have thought of. The recorded-acceptance step is what makes the output auditable later.",
		watchOut: "STRIDE is thorough and slow. For a small change, a focused red team pass is a better use of an hour.",
		related: [
			"red-teaming",
			"attack-surface-reduction",
			"trust-boundary",
			"defense-in-depth",
			"pre-mortem"
		],
		tags: [
			"security",
			"threat model",
			"design review",
			"risk",
			"stride"
		]
	},
	{
		id: "zero-trust",
		name: "Zero Trust",
		aka: [
			"never trust always verify",
			"BeyondCorp",
			"perimeterless security"
		],
		origin: "John Kindervag, Forrester, 2010; Google BeyondCorp",
		domains: ["security", "engineering"],
		intents: ["structure", "reframe"],
		oneLiner: "Stop treating network location as evidence of trustworthiness — authenticate and authorise every request on its own merits, wherever it comes from.",
		useWhen: [
			"anything inside our network can talk to anything else",
			"we assume internal traffic is safe",
			"the VPN is the only thing standing between an attacker and everything",
			"services call each other with no authentication at all",
			"once you are on the corporate network you have access to everything"
		],
		prompt: "Evaluate this architecture against zero trust principles. Find every place where trust is currently derived from network position — an internal-only endpoint, an unauthenticated service-to-service call, a \"we are behind the VPN\" assumption, an allowlisted IP range — and state what an attacker who already had a foothold inside that boundary could do. Then, for each, specify what the request should be authenticated and authorised on instead: workload identity, mutual TLS, short-lived tokens, device posture. Sequence the work by exposure rather than by ease, and be honest about which of these are genuinely worth the operational cost for a system of our size.",
		why: "The \"attacker already inside\" framing is what makes the gaps visible. Asked to review network security, a model checks the perimeter; asked what an established foothold reaches, it finds the flat internal network.",
		watchOut: "Zero trust is a direction, not a product, and full adoption is a multi-year programme. Treat the output as a ranked backlog rather than a project plan.",
		related: [
			"least-privilege",
			"defense-in-depth",
			"trust-boundary",
			"blast-radius"
		],
		tags: [
			"security",
			"network",
			"authentication",
			"architecture",
			"identity"
		]
	},
	{
		id: "blast-radius",
		name: "Blast Radius",
		aka: [
			"failure domain",
			"containment boundary",
			"what does this take down with it"
		],
		origin: "Site reliability and security engineering practice",
		domains: ["security", "engineering"],
		intents: ["critique", "estimate"],
		oneLiner: "Ask how far the damage spreads when one component is compromised or fails, and design boundaries that stop it spreading further.",
		useWhen: [
			"one bad deploy took down everything",
			"if this credential leaked how bad would it be",
			"a single database is shared by every service",
			"how do we stop one customer affecting another",
			"we need to contain damage not just prevent it"
		],
		prompt: "Map the blast radius here. Take each component in turn and, assuming it is fully compromised or fully broken, trace exactly what an attacker or a failure reaches from there: which data, which other systems, which customers, and how far laterally. Distinguish the failures that are contained by design from the ones that are contained only by convention or by luck — a shared credential, a shared database, a global config flag, an admin API reachable from anywhere. Then propose containment boundaries in order of reduction per unit of effort, and tell me which single boundary would shrink the worst case most.",
		why: "Prevention and containment are different disciplines and models default to prevention. Forcing the \"assume it is already compromised\" premise produces the containment work, which is what actually limits an incident once prevention has failed.",
		related: [
			"least-privilege",
			"defense-in-depth",
			"zero-trust",
			"fmea",
			"saga-pattern"
		],
		tags: [
			"security",
			"containment",
			"reliability",
			"incident",
			"isolation"
		]
	},
	{
		id: "fail-closed",
		name: "Fail Closed / Secure by Default",
		aka: [
			"fail secure",
			"deny by default",
			"secure defaults",
			"fail safe"
		],
		origin: "Saltzer & Schroeder — fail-safe defaults",
		domains: ["security", "engineering"],
		intents: ["critique", "structure"],
		oneLiner: "When a check errors, times out or is skipped, the safe outcome is denial — and the default configuration should be the locked-down one, not the convenient one.",
		useWhen: [
			"if the auth service is down does everything become public",
			"the permission check throws an exception and I am not sure what happens",
			"new resources are created world-readable by default",
			"someone has to remember to turn on the security setting",
			"what happens when this timeout fires"
		],
		prompt: "Audit this for fail-closed behaviour and secure defaults. Trace every authorisation and validation check and answer one question for each: if it throws, times out, returns null, or is simply not reached, does the system deny or allow? Name every path where an error results in access being granted, because those are the ones that turn an outage into a breach. Separately, review the defaults: for each configurable security control, state what happens when nobody configures anything, and flag any where safety depends on someone remembering to enable it. Then tell me where failing closed would cause an unacceptable availability problem, and what the right compromise is there.",
		why: "The exception path is where this actually bites, and it is invisible in normal review because the happy path looks correct. Asking specifically about throw, timeout, null and not-reached surfaces the four ways a check silently becomes a no-op.",
		watchOut: "Failing closed on a hot path can convert a dependency blip into a full outage. The availability trade-off is real and needs to be a deliberate decision, not a surprise.",
		related: [
			"defense-in-depth",
			"least-privilege",
			"trust-boundary",
			"fmea",
			"observability-triage"
		],
		tags: [
			"security",
			"defaults",
			"error handling",
			"availability",
			"hardening"
		]
	},
	{
		id: "attack-surface-reduction",
		name: "Attack Surface Reduction",
		aka: [
			"minimise attack surface",
			"reduce exposure",
			"turn it off"
		],
		origin: "Michael Howard, Microsoft security engineering",
		domains: ["security", "engineering"],
		intents: ["critique", "prioritize"],
		oneLiner: "The cheapest way to secure something is to not expose it — count the entry points, then remove the ones nobody needs.",
		useWhen: [
			"we have a lot of endpoints and I do not know which are still used",
			"this admin panel is on the public internet",
			"we installed a bunch of things we no longer use",
			"how do we harden this without a big project",
			"debug endpoints are probably still enabled in production"
		],
		prompt: "Inventory and reduce the attack surface here. Enumerate every entry point an untrusted party can reach: network ports, HTTP routes, file uploads, message queue consumers, webhook receivers, deserialisation points, admin interfaces, debug and health endpoints, and third-party integrations that can call in. For each, record who should be able to reach it, who actually can, and whether it is still used at all. Then rank by removal value — anything unused or internal-only that is publicly reachable comes first, since deleting an entry point is strictly cheaper and more reliable than defending one. Flag anything you suspect is a forgotten development affordance left enabled.",
		why: "Explicitly naming the unglamorous categories — debug endpoints, deserialisation, webhook receivers, health checks — is what finds the forgotten exposure. A generic prompt returns the front door, which was never the problem.",
		related: [
			"least-privilege",
			"threat-modeling-stride",
			"blast-radius",
			"chestertons-fence"
		],
		tags: [
			"security",
			"hardening",
			"exposure",
			"endpoints",
			"attack surface"
		]
	},
	{
		id: "separation-of-duties",
		name: "Separation of Duties",
		aka: [
			"segregation of duties",
			"four eyes principle",
			"two person rule",
			"SoD"
		],
		origin: "Accounting and internal control practice",
		domains: ["security", "career"],
		intents: ["structure", "critique"],
		oneLiner: "Split a sensitive operation so no single person can both initiate and approve it, making fraud and catastrophic error require collusion rather than a bad day.",
		useWhen: [
			"one person can push straight to production with nobody looking",
			"the same person requests and approves their own access",
			"we need this for an audit or compliance review",
			"a single mistake by one person could be catastrophic",
			"how do we add a check without slowing everything down"
		],
		prompt: "Review this process for separation of duties. List the sensitive operations, and for each identify who can initiate, who approves, who executes, and who reviews afterwards. Flag every case where one identity holds two of those roles — including the ones people forget: an admin who can grant themselves a role, an engineer who can both change the audit logging and take the action it would record, an automation whose credentials one person fully controls. Then propose the minimum split that removes single-actor risk, and be realistic about team size: if we are too small for true separation, tell me which compensating controls (after-the-fact review, alerting on self-approval, immutable logs) get most of the benefit.",
		why: "The small-team caveat is what makes this usable. Textbook separation of duties assumes an org that can staff it, and without that clause the output is advice a five-person team has to ignore entirely.",
		watchOut: "Overapplied, this becomes approval theatre — a required reviewer who rubber-stamps everything adds latency and no safety.",
		related: [
			"least-privilege",
			"break-glass-access",
			"decision-roles-daci",
			"blameless-postmortem"
		],
		tags: [
			"security",
			"controls",
			"compliance",
			"process",
			"audit"
		]
	},
	{
		id: "break-glass-access",
		name: "Break-Glass Access",
		aka: [
			"emergency access",
			"just in time access",
			"JIT elevation",
			"privileged access request"
		],
		origin: "Operational security practice",
		domains: ["security", "engineering"],
		intents: ["plan", "structure"],
		oneLiner: "Replace standing privileged access with a fast, loud, time-limited elevation path, so the powerful credentials only exist while someone is actually using them.",
		useWhen: [
			"we keep admin access permanently because incidents need it",
			"tightening permissions would slow down our incident response",
			"how do we lock this down without hurting on-call",
			"people have production access they use twice a year",
			"we cannot remove access because of emergencies"
		],
		prompt: "Design a break-glass access path for this. It has to be fast enough that nobody routes around it during an incident, so specify the mechanism and be concrete about how many seconds it takes at 3am with one tired engineer. Cover: what triggers elevation, whether approval is required or it is self-service with notification, what the time limit is and how it expires automatically, what gets logged, and who is alerted in real time — the alert is what makes this safe, not the approval. Then tell me which standing permissions can be removed once this exists, and how we would test the path quarterly so its first real use is not its first use.",
		why: "The speed constraint and the quarterly test are the two things that decide whether break-glass works. A slow path gets bypassed, and an untested one fails exactly when it is needed.",
		related: [
			"least-privilege",
			"separation-of-duties",
			"zero-trust",
			"blameless-postmortem"
		],
		tags: [
			"security",
			"access control",
			"incident response",
			"on call",
			"privileged access"
		]
	},
	{
		id: "trust-boundary",
		name: "Trust Boundary",
		aka: [
			"never trust user input",
			"validate at the boundary",
			"taint tracking"
		],
		origin: "Secure design practice; central to threat modelling",
		domains: ["security", "engineering"],
		intents: ["structure", "diagnose"],
		oneLiner: "Identify exactly where data crosses from a less-trusted party to a more-trusted one, and make that the place validation happens — every time, without exception.",
		useWhen: [
			"where should I validate this input",
			"we sanitise in some places and not others",
			"is this string safe to put in a query",
			"data from another internal service is probably fine right",
			"we keep finding injection bugs in different places"
		],
		prompt: "Map the trust boundaries in this system. Mark every point where data crosses from lower to higher trust — user to server, browser to API, one service to another, third-party webhook to us, database content back into a template. For each crossing, state what validation happens now and what should: validate for shape and range at the boundary, and encode for context at the point of use, since these are different jobs and conflating them is how injection bugs survive. Call out any boundary we are treating as internal-and-therefore-safe. Then identify the crossings where the same data is validated twice inconsistently, because the weaker check is the one that matters.",
		why: "The validate-at-entry versus encode-at-use distinction is the actual lesson, and generic \"sanitise your inputs\" advice obscures it. The inconsistent-double-validation question finds the bugs that survive a codebase-wide sanitisation effort.",
		related: [
			"threat-modeling-stride",
			"fail-closed",
			"zero-trust",
			"anti-corruption-layer"
		],
		tags: [
			"security",
			"input validation",
			"injection",
			"boundaries",
			"appsec"
		]
	},
	{
		id: "secrets-management",
		name: "Secrets Management",
		aka: [
			"credential hygiene",
			"key rotation",
			"no secrets in code",
			"vault"
		],
		origin: "Operational security practice; twelve-factor config",
		domains: ["security", "engineering"],
		intents: ["structure", "critique"],
		oneLiner: "Keep credentials out of code and images, scope them narrowly, rotate them routinely, and make rotation cheap enough that you will actually do it after a leak.",
		useWhen: [
			"there is an API key committed in our repository",
			"we have never rotated this credential",
			"the same password is used by four services",
			"a secret leaked and I do not know what to do first",
			"secrets are in environment variables and I am not sure that is enough"
		],
		prompt: "Audit secrets handling here. Inventory every credential: where it is stored, who and what can read it, how it reaches the running process, when it was last rotated, and what it grants. Then test the property that actually matters — how long would rotating each one take today, end to end, including finding every consumer? Anything that cannot be rotated in under an hour is effectively permanent, so treat it as already compromised and say what that implies. Also check the paths people forget: build logs, CI environment output, error reporting payloads, container image layers, and git history after a file was deleted. Finish with the rotation runbook for the highest-risk credential.",
		why: "Rotation time is the honest health metric, and asking for it converts a tidy inventory into an actionable risk statement. The forgotten-paths list catches leaks that a repository scan never will.",
		watchOut: "Removing a secret from the latest commit does not remove it from git history, and a leaked credential must be assumed used. Rotate first, clean up second.",
		related: [
			"least-privilege",
			"twelve-factor-app",
			"blast-radius",
			"supply-chain-provenance"
		],
		tags: [
			"security",
			"credentials",
			"secrets",
			"rotation",
			"devops"
		]
	},
	{
		id: "data-minimization",
		name: "Data Minimisation",
		aka: [
			"collect less",
			"privacy by design",
			"data you do not hold cannot leak"
		],
		origin: "Privacy engineering; codified in GDPR Article 5",
		domains: [
			"security",
			"data",
			"product"
		],
		intents: ["critique", "decide"],
		oneLiner: "Collect only the data you have a present use for, keep it only as long as that use lasts, and accept that the safest record is the one you never stored.",
		useWhen: [
			"we log everything just in case",
			"do we really need to collect date of birth",
			"we have years of data nobody has ever queried",
			"a breach would expose far more than it needs to",
			"we are trying to reduce our compliance exposure"
		],
		prompt: "Review this against data minimisation. For each field we collect or log, state the specific present use that justifies it — not a hypothetical future one — and flag anything retained on the basis that it might be useful someday. Separately assess: could this field be truncated, hashed, tokenised, or aggregated and still serve its purpose? Could we store a derived answer rather than the raw input, such as an age band instead of a birth date? Then propose retention periods per field with automatic deletion, and identify anything sitting in logs, analytics pipelines, backups or third-party processors that our main retention policy does not actually reach.",
		why: "The could-this-be-derived question is where the real reduction comes from, and it is not what a generic privacy review returns. The secondary-copies question catches the data that policies miss entirely — logs and backups are where retention rules go to be ignored.",
		watchOut: "Deletion policies interact with legal hold, financial record-keeping and fraud investigation requirements. Check those before automating anything irreversible.",
		related: [
			"blast-radius",
			"least-privilege",
			"goodharts-law",
			"cohort-analysis"
		],
		tags: [
			"security",
			"privacy",
			"gdpr",
			"retention",
			"compliance"
		]
	},
	{
		id: "supply-chain-provenance",
		name: "Supply Chain Provenance",
		aka: [
			"dependency risk",
			"SBOM",
			"software bill of materials",
			"build integrity"
		],
		origin: "Post-SolarWinds practice; SLSA framework",
		domains: ["security", "engineering"],
		intents: ["critique", "plan"],
		oneLiner: "Know what is actually in your build, where each piece came from, and who could change it without you noticing.",
		useWhen: [
			"we have two thousand transitive dependencies and no idea what they do",
			"a package we depend on changed hands recently",
			"how would we know if a dependency was compromised",
			"our CI can push to production and anyone can edit the pipeline",
			"we need to answer a customer security questionnaire about dependencies"
		],
		prompt: "Assess supply chain risk for this project. Cover three layers rather than only the first. Dependencies: which are unmaintained, recently transferred to a new owner, or reachable at runtime with high privilege, and whether we pin by version or by hash. Build: who can modify the pipeline, whether the build is reproducible, and whether an artefact could be swapped between build and deploy. Developer environment: what a compromised laptop or a malicious editor extension could inject. For each risk, tell me the detection we would need, since prevention here is partial by nature — then name the single change that would most improve our ability to notice a compromise, as opposed to preventing one.",
		why: "Steering toward detection rather than prevention is the honest framing for supply chain risk, where full prevention is not achievable. Naming the three layers stops the answer being \"run npm audit\", which addresses the least important one.",
		related: [
			"secrets-management",
			"attack-surface-reduction",
			"twelve-factor-app",
			"blast-radius"
		],
		tags: [
			"security",
			"dependencies",
			"supply chain",
			"ci cd",
			"build"
		]
	}
];
//#endregion
//#region src/data/concepts/framing.ts
var framing = [
	{
		id: "abstraction-laddering",
		name: "Abstraction Laddering",
		aka: [
			"abstraction ladder",
			"why-how ladder",
			"zoom out zoom in"
		],
		origin: "Design thinking / Hasso Plattner Institute",
		domains: [
			"product",
			"design",
			"strategy"
		],
		intents: ["reframe", "ideate"],
		oneLiner: "Take a problem statement and move it up the ladder by asking \"why?\" to widen it, or down by asking \"how?\" to make it concrete — then pick the rung with the best solution space.",
		useWhen: [
			"my problem statement feels too narrow",
			"we jumped straight to a solution",
			"the feature request is really a symptom of something bigger",
			"I only have one idea and it feels obvious",
			"the scope is either enormous or trivially small",
			"stakeholders are arguing about the solution instead of the problem",
			"the PRD reads like a spec not a rationale"
		],
		prompt: "Run an abstraction ladder on this problem statement. Go up three rungs by repeatedly asking \"why do we want this?\" and down three rungs by asking \"how could we do this?\". Show the ladder as a list from most abstract to most concrete. Then tell me which rung is the right altitude to solve at and why, and what solution space opens up at that rung that is invisible at the one I started on.",
		variants: [{
			label: "You suspect the ask is too small",
			prompt: "Ladder this feature request up two levels of abstraction. At each level, state the problem in one sentence and name one solution that only becomes visible at that level. End with the level I should actually be writing the PRD against."
		}, {
			label: "You suspect the ask is too vague",
			prompt: "This goal is stated too abstractly to act on. Ladder it down by asking \"how?\" until each leaf is something a team could start on Monday. Show it as a tree, and flag any branch where the \"how\" is actually an unvalidated assumption."
		}],
		why: "Naming the ladder forces the model to generate the intermediate framings rather than answering at whatever altitude your question happened to land on. Most weak AI output is not wrong — it is pitched at the wrong level of abstraction.",
		watchOut: "Laddering up too far produces platitudes (\"we want to delight users\"). Cap it at three rungs and insist each rung stays falsifiable.",
		related: [
			"five-whys",
			"jobs-to-be-done",
			"how-might-we",
			"first-principles"
		],
		tags: [
			"problem framing",
			"altitude",
			"scope",
			"product management",
			"reframing"
		]
	},
	{
		id: "five-whys",
		name: "Five Whys",
		aka: [
			"5 whys",
			"why chain",
			"root cause laddering"
		],
		origin: "Toyota Production System (Sakichi Toyoda)",
		domains: [
			"engineering",
			"product",
			"strategy"
		],
		intents: ["diagnose", "reframe"],
		oneLiner: "Ask \"why did that happen?\" five times in sequence, so each answer becomes the next question, until you reach a cause worth fixing rather than a symptom worth patching.",
		useWhen: [
			"we keep fixing the same thing over and over",
			"the fix worked but the problem came back",
			"the incident report stops at the proximate cause",
			"I want to know the real reason not the surface reason",
			"the bug is fixed but I do not understand why it happened"
		],
		prompt: "Run a Five Whys on this. Each \"why\" must take the previous answer as its subject, not restart from the original problem. Stop early if you hit a cause that is outside our control and say so. At the end, separate the chain into proximate cause, contributing causes, and the systemic cause — and propose one fix at each level, noting which one actually prevents recurrence.",
		variants: [{
			label: "For a process or org problem, not a bug",
			prompt: "Five Whys this, but treat each answer as a system-design question rather than a person-blame question. If any link in the chain reduces to \"someone should have been more careful\", reject it and dig for the structural reason that behaviour was rational at the time."
		}],
		why: "Without the explicit chain instruction, models answer \"why?\" five times against the *original* problem and produce five parallel guesses. Insisting that each why chains off the previous answer is what makes it a root-cause tool.",
		watchOut: "Five Whys yields a single causal line. Real incidents usually have several. Pair it with a fishbone if the failure had multiple contributing factors.",
		related: [
			"root-cause-fishbone",
			"blameless-postmortem",
			"abstraction-laddering",
			"chestertons-fence"
		],
		tags: [
			"root cause",
			"incident",
			"debugging",
			"recurring problem",
			"systems thinking"
		]
	},
	{
		id: "jobs-to-be-done",
		name: "Jobs To Be Done",
		aka: [
			"JTBD",
			"job story",
			"hiring a product",
			"milkshake framework"
		],
		origin: "Clayton Christensen / Tony Ulwick",
		domains: [
			"product",
			"design",
			"strategy"
		],
		intents: [
			"reframe",
			"ideate",
			"communicate"
		],
		oneLiner: "Describe what progress the user is trying to make and in what circumstance, rather than who they are demographically or which feature they asked for.",
		useWhen: [
			"our personas are not helping us build anything",
			"users asked for a feature but I do not know what they actually want",
			"I cannot tell who our real competitor is",
			"the roadmap is a list of features with no throughline",
			"we keep building things people say they want and do not use"
		],
		prompt: "Reframe this as a set of Jobs To Be Done. For each job use the format \"When [situation], I want to [motivation], so I can [expected outcome]\". Focus on the progress the person is trying to make, not their demographics. Then for each job list: what they hire today instead (including non-obvious substitutes and doing nothing), the forces pushing them to switch, and the anxieties holding them back.",
		variants: [{
			label: "Turning a feature request into a job",
			prompt: "A user asked for this specific feature. Work backwards to the job they were hiring it for. Give me three candidate jobs that would explain the request, and for each, a different feature that would serve it better than what they asked for."
		}],
		why: "The \"when / I want to / so I can\" template is a hard structural constraint. It blocks the model from sliding back into demographic personas, which is its default and the least useful answer.",
		watchOut: "JTBD is weak for infrastructure and platform work where the \"user\" is a system. Do not force it.",
		related: [
			"abstraction-laddering",
			"how-might-we",
			"user-journey-mapping",
			"working-backwards"
		],
		tags: [
			"product management",
			"user research",
			"personas",
			"discovery",
			"customer needs"
		]
	},
	{
		id: "how-might-we",
		name: "How Might We",
		aka: ["HMW", "opportunity statement"],
		origin: "Procter & Gamble, popularised by IDEO",
		domains: ["design", "product"],
		intents: ["reframe", "ideate"],
		oneLiner: "Convert a problem or insight into an optimistically-phrased question that is broad enough to invite many solutions but narrow enough to give direction.",
		useWhen: [
			"I have research findings and do not know what to do with them",
			"the problem statement is a complaint not a brief",
			"brainstorms keep going nowhere",
			"the question is so big nobody knows where to start"
		],
		prompt: "Turn this insight into a set of How Might We questions. Give me three at different scopes: one too narrow (solution smuggled in), one too broad (unactionable), and three in the useful middle. For each of the useful ones, explain what kind of solution it invites and what it rules out. Flag any HMW that has a solution hidden inside the question.",
		why: "Asking for the deliberately-too-narrow and too-broad versions gives the model an explicit calibration range, which produces sharper middle options than asking for good ones directly.",
		watchOut: "HMW without a real insight behind it generates pleasant-sounding nonsense. Anchor it to an actual observation.",
		related: [
			"jobs-to-be-done",
			"abstraction-laddering",
			"crazy-eights",
			"design-critique"
		],
		tags: [
			"ideation",
			"design thinking",
			"brainstorming",
			"workshop",
			"problem framing"
		]
	},
	{
		id: "first-principles",
		name: "First Principles Thinking",
		aka: ["reasoning from first principles", "reduction to fundamentals"],
		origin: "Aristotle; modernised by Feynman and Musk",
		domains: [
			"engineering",
			"strategy",
			"product"
		],
		intents: ["reframe", "ideate"],
		oneLiner: "Strip an argument down to the facts that must be true regardless of convention, then rebuild upward — discarding everything inherited by analogy.",
		useWhen: [
			"everyone says this is just how it is done",
			"we are copying a competitor without knowing why",
			"the constraint might not be a real constraint",
			"the cost seems fixed but I suspect it is not",
			"best practice is not working for us"
		],
		prompt: "Reason about this from first principles. First, list every assumption embedded in how it is currently done, and label each one as a law of physics, an economic constraint, a regulatory requirement, or merely a convention. Discard the conventions. Then rebuild the solution using only what survived, and tell me explicitly what becomes possible that the conventional approach forecloses.",
		why: "The label-then-discard step is doing the work. Without it, models restate the conventional approach in more confident language and call it first principles.",
		watchOut: "Conventions often encode hard-won knowledge. Run Chesterton's Fence on anything you are about to discard.",
		related: [
			"chestertons-fence",
			"inversion",
			"abstraction-laddering",
			"theory-of-constraints"
		],
		tags: [
			"fundamentals",
			"assumptions",
			"innovation",
			"constraints",
			"contrarian"
		]
	},
	{
		id: "chestertons-fence",
		name: "Chesterton's Fence",
		aka: ["why is this here", "do not remove what you do not understand"],
		origin: "G.K. Chesterton, 1929",
		domains: [
			"engineering",
			"strategy",
			"product"
		],
		intents: ["critique", "diagnose"],
		oneLiner: "Before removing something that looks pointless, establish why it was put there — the reason is often invisible precisely because the thing is working.",
		useWhen: [
			"this code looks useless and I want to delete it",
			"why does this weird process exist",
			"we want to remove a rule nobody can justify",
			"this seems like obvious tech debt but I am nervous",
			"the previous team did something strange here"
		],
		prompt: "Apply Chesterton's Fence to this before I remove it. Generate the most plausible reasons it was originally added, ranked by likelihood, including reasons that would no longer be visible in the current system (a bug that has since been fixed elsewhere, a customer who has since churned, a platform limitation that has since lifted). For each, tell me the specific evidence I could go look for to confirm or rule it out. Only then give me your recommendation.",
		why: "Models are agreeable and will happily endorse a deletion you propose. Framing it as a fence inverts the burden of proof and forces the generation of counter-evidence before the recommendation.",
		related: [
			"first-principles",
			"pre-mortem",
			"five-whys",
			"assumption-mapping"
		],
		tags: [
			"refactoring",
			"tech debt",
			"legacy code",
			"caution",
			"deletion"
		]
	},
	{
		id: "xy-problem",
		name: "The XY Problem",
		aka: ["asking about the attempted solution", "X Y problem"],
		origin: "Usenet / sysadmin folklore",
		domains: ["engineering", "meta"],
		intents: ["reframe", "diagnose"],
		oneLiner: "You ask about your attempted solution Y instead of your actual problem X, so all the help you get is aimed at the wrong thing.",
		useWhen: [
			"I am fighting the tool instead of solving the problem",
			"the answers I get are technically correct but useless",
			"I have been stuck on this approach for hours",
			"my question keeps getting weird answers",
			"I am asking how to do something awkward"
		],
		prompt: "Before answering, check whether I am asking an XY problem. Restate what I appear to be trying to accomplish at the level above my question. If my actual goal could be reached a different way, tell me that first and answer my literal question second. If my question genuinely is the right question, say so and just answer it.",
		why: "This is the single highest-leverage instruction to keep in a system prompt. It licenses the model to overrule the framing of your question, which it will otherwise almost never do.",
		watchOut: "Sometimes you really do just want the literal answer. The \"answer it second\" clause keeps you from losing it.",
		related: [
			"abstraction-laddering",
			"interview-me-first",
			"rubber-duck-debugging",
			"five-whys"
		],
		tags: [
			"stuck",
			"wrong question",
			"debugging",
			"asking for help",
			"prompting"
		]
	},
	{
		id: "inversion",
		name: "Inversion",
		aka: [
			"via negativa",
			"invert always invert",
			"thinking backwards"
		],
		origin: "Carl Jacobi; popularised by Charlie Munger",
		domains: [
			"strategy",
			"product",
			"engineering"
		],
		intents: ["critique", "ideate"],
		oneLiner: "Instead of asking how to succeed, ask how to guarantee failure — then systematically avoid those things.",
		useWhen: [
			"I cannot see what could go wrong",
			"the plan looks good and that worries me",
			"I want a different angle on this problem",
			"success criteria are fuzzy but failure would be obvious",
			"I need to find the risks nobody has named"
		],
		prompt: "Invert this problem. Instead of asking how to make it succeed, ask: what would I do if I wanted to guarantee this fails badly? Give me the ten most effective ways to sabotage it. Then, for each, tell me honestly whether we are currently doing some version of it — and rank those by how much of the failure risk they account for.",
		why: "\"How do we succeed\" pulls generic best practice out of a model. \"How do we guarantee failure\" pulls specific, concrete, memorable failure modes, because destruction is easier to reason about concretely than construction.",
		related: [
			"pre-mortem",
			"red-teaming",
			"first-principles",
			"fmea"
		],
		tags: [
			"risk",
			"failure modes",
			"mental model",
			"contrarian",
			"planning"
		]
	}
];
//#endregion
//#region src/data/concepts/decisions.ts
var decisions = [
	{
		id: "pre-mortem",
		name: "Pre-mortem",
		aka: [
			"prospective hindsight",
			"imagine it failed",
			"project premortem"
		],
		origin: "Gary Klein, Harvard Business Review 2007",
		domains: [
			"product",
			"engineering",
			"strategy"
		],
		intents: ["critique", "plan"],
		oneLiner: "Assume the project has already failed spectacularly, then work backwards to write the story of how — before you commit.",
		useWhen: [
			"the plan looks solid and nobody is objecting",
			"we are about to commit real money or time",
			"the team is too optimistic",
			"I want risks surfaced before launch not after",
			"everyone agreed too quickly"
		],
		prompt: "Run a pre-mortem. It is twelve months from now and this has failed badly enough that we are writing a postmortem about it. Write that postmortem: the specific narrative of what went wrong, in order, with the moment where it became unrecoverable clearly marked. Then extract the top five failure modes, estimate likelihood and blast radius for each, and give me the cheapest early-warning signal that would tell me each one is starting.",
		variants: [{
			label: "Fast version, mid-meeting",
			prompt: "Pre-mortem this in five bullets. Assume it failed. What is the single most likely cause, and what would we see in the first two weeks that would tell us it is happening?"
		}, {
			label: "When the risk is organisational rather than technical",
			prompt: "Pre-mortem this assuming the technology worked perfectly and it still failed. The failure must come from people, incentives, politics, timing, or attention. Write that story."
		}],
		why: "Prospective hindsight — imagining an outcome as already certain — measurably increases the number and specificity of causes people generate. Models show the same effect: \"what could go wrong\" gives you hedges, \"write the postmortem\" gives you a plot.",
		watchOut: "A pre-mortem produces a long risk list. Without the likelihood-and-blast-radius step you will just feel anxious rather than better prepared.",
		related: [
			"inversion",
			"red-teaming",
			"fmea",
			"assumption-mapping",
			"blameless-postmortem"
		],
		tags: [
			"risk",
			"planning",
			"launch",
			"failure modes",
			"project management"
		]
	},
	{
		id: "type-1-type-2-decisions",
		name: "Type 1 / Type 2 Decisions",
		aka: [
			"one-way door",
			"two-way door",
			"reversible decisions"
		],
		origin: "Jeff Bezos, Amazon shareholder letter 1997",
		domains: [
			"strategy",
			"product",
			"engineering"
		],
		intents: ["decide", "prioritize"],
		oneLiner: "Sort decisions by reversibility: one-way doors deserve deliberation, two-way doors deserve speed, and treating one like the other is the expensive mistake.",
		useWhen: [
			"we are spending too long on this decision",
			"I do not know how much analysis this deserves",
			"the team is deadlocked and the stakes seem low",
			"we keep escalating small decisions",
			"this feels irreversible but I am not sure it is"
		],
		prompt: "Classify this decision as a one-way or two-way door. Be specific about what exactly would be hard to reverse — the code, the data model, the contract, the public commitment, or the org's expectations — and estimate the real cost and time to undo it. If it is mostly two-way with a small one-way component, separate the two and tell me how to move fast on the reversible part while slowing down only on the part that locks us in. Then tell me how much more analysis this decision actually warrants.",
		why: "The decomposition step is what makes this useful. Most decisions that feel irreversible are a fast reversible core with one small locking commitment attached — and the model will find it if you ask it to look.",
		related: [
			"expected-value",
			"reference-class-forecasting",
			"decision-matrix",
			"walking-skeleton"
		],
		tags: [
			"decision making",
			"reversibility",
			"speed",
			"leadership",
			"risk"
		]
	},
	{
		id: "decision-matrix",
		name: "Weighted Decision Matrix",
		aka: [
			"decision matrix",
			"weighted scoring",
			"Pugh matrix",
			"trade-off table"
		],
		origin: "Stuart Pugh, design engineering",
		domains: [
			"product",
			"engineering",
			"strategy"
		],
		intents: ["decide", "structure"],
		oneLiner: "Score each option against explicitly weighted criteria so the trade-off is visible and arguable, rather than buried in a preference.",
		useWhen: [
			"we have several options and keep going in circles",
			"people are comparing options on different criteria",
			"I need to justify a choice to stakeholders",
			"the debate is about vibes not facts",
			"vendor selection or build versus buy"
		],
		prompt: "Build a weighted decision matrix for these options. First propose the criteria and their weights and pause for me to correct them — do not score anything until I confirm the weights. Then score each option 1-5 per criterion with a one-line justification for each score, compute weighted totals, and show the table. Finally, run a sensitivity check: name the single weight I would have to change, and by how much, to flip the winner.",
		variants: [{
			label: "When you suspect the matrix is post-hoc justification",
			prompt: "I think I already know which option I want. Build the weighted decision matrix, then tell me which weights I would have had to choose to make my preferred option lose — and whether those weights are more defensible than mine."
		}],
		why: "The forced pause on weights is essential. If the model picks criteria and scores in one pass, it will reverse-engineer weights that justify whichever option it described most enthusiastically.",
		watchOut: "Matrices launder judgement into arithmetic. The sensitivity check is what keeps them honest.",
		related: [
			"type-1-type-2-decisions",
			"expected-value",
			"rice-scoring",
			"opportunity-cost"
		],
		tags: [
			"trade-offs",
			"evaluation",
			"vendor selection",
			"build vs buy",
			"criteria"
		]
	},
	{
		id: "expected-value",
		name: "Expected Value Framing",
		aka: [
			"EV",
			"decision tree",
			"probability weighted outcome"
		],
		origin: "Decision theory / Pascal",
		domains: [
			"strategy",
			"data",
			"product"
		],
		intents: ["decide", "estimate"],
		oneLiner: "Multiply each outcome by its probability so a low-odds, high-payoff bet can be compared honestly against a safe, modest one.",
		useWhen: [
			"the safe option feels right but I am not sure it is",
			"how do I compare a risky bet to a sure thing",
			"we always pick the predictable option and never grow",
			"I need to justify a speculative investment",
			"the downside scares me more than the upside excites me"
		],
		prompt: "Do an expected-value analysis of these options. For each, enumerate the distinct outcomes, assign a probability and a magnitude to each, and show the EV calculation. State your probability estimates as explicit assumptions I can challenge, and flag any where you are essentially guessing. Then add the part EV misses: which option has a downside we could not survive, regardless of its expected value?",
		why: "Forcing the probabilities into the open converts an argument about feelings into an argument about numbers you can actually disagree with. The survivability question prevents the classic EV failure of accepting a ruinous tail.",
		watchOut: "Model-generated probabilities are anchored guesses, not knowledge. Treat them as a structure for your own estimates.",
		related: [
			"reference-class-forecasting",
			"decision-matrix",
			"fermi-estimation",
			"second-order-thinking"
		],
		tags: [
			"probability",
			"risk",
			"investment",
			"bets",
			"quantitative"
		]
	},
	{
		id: "second-order-thinking",
		name: "Second-Order Thinking",
		aka: [
			"and then what",
			"downstream consequences",
			"second order effects"
		],
		origin: "Howard Marks / systems thinking",
		domains: [
			"strategy",
			"product",
			"engineering"
		],
		intents: ["critique", "decide"],
		oneLiner: "Ask \"and then what happens?\" repeatedly, because the consequences of the consequences are usually where the surprises live.",
		useWhen: [
			"this seems obviously good and I want to check",
			"what are the unintended consequences",
			"the metric will improve but I am worried about side effects",
			"this policy might get gamed",
			"everyone agrees this is a no-brainer"
		],
		prompt: "Do a second- and third-order analysis of this change. First-order: the intended direct effect. Second-order: how people, teams, and systems adapt once they know this is the rule. Third-order: what that adaptation causes six to twelve months out. Pay particular attention to how someone would game it in their own rational self-interest, and to which currently-healthy behaviour this quietly stops rewarding.",
		why: "Models default to first-order analysis because that is what most training text contains. Explicitly numbering the orders and naming the adaptation mechanism is what surfaces the non-obvious effects.",
		related: [
			"inversion",
			"pre-mortem",
			"goodharts-law",
			"theory-of-constraints"
		],
		tags: [
			"consequences",
			"systems thinking",
			"incentives",
			"unintended effects",
			"policy"
		]
	},
	{
		id: "goodharts-law",
		name: "Goodhart's Law Check",
		aka: [
			"metric gaming",
			"when a measure becomes a target",
			"perverse incentives"
		],
		origin: "Charles Goodhart, 1975",
		domains: [
			"product",
			"data",
			"strategy"
		],
		intents: ["critique", "decide"],
		oneLiner: "Once a measure becomes a target it stops measuring what it did — so stress-test any metric by asking how it would be hit without the underlying good happening.",
		useWhen: [
			"we are setting a new KPI or OKR",
			"the metric went up but nothing feels better",
			"I am worried this target will be gamed",
			"the team is optimising the number not the outcome",
			"choosing success metrics for a launch"
		],
		prompt: "Run a Goodhart's Law check on this metric. Assume a smart, well-meaning team is now compensated on it. List the five cheapest ways to move this number without creating any of the underlying value it is supposed to proxy for. Then propose a guardrail or paired counter-metric for each, and tell me which single pair of metrics would be hardest to game together.",
		why: "Framing the gamers as \"smart and well-meaning\" rather than malicious gets much better answers — it surfaces the realistic drift that actually happens rather than cartoon fraud.",
		related: [
			"second-order-thinking",
			"okr-laddering",
			"cohort-analysis",
			"inversion"
		],
		tags: [
			"metrics",
			"kpi",
			"okr",
			"incentives",
			"measurement"
		]
	},
	{
		id: "reference-class-forecasting",
		name: "Reference Class Forecasting",
		aka: [
			"outside view",
			"base rates",
			"what usually happens"
		],
		origin: "Kahneman & Tversky; Bent Flyvbjerg",
		domains: [
			"strategy",
			"data",
			"product"
		],
		intents: ["estimate", "critique"],
		oneLiner: "Estimate by asking how similar projects actually turned out, instead of reasoning forward from the specifics of this one.",
		useWhen: [
			"our estimate feels optimistic",
			"we always run over on time and budget",
			"how long does this kind of thing usually take",
			"I need a sanity check on a forecast",
			"the plan assumes everything goes right"
		],
		prompt: "Give me the outside view on this. Define the reference class — the set of comparable past efforts — as precisely as you can, state the typical outcome and spread for that class, and be explicit about the base rate of failure or overrun. Then, and only then, adjust for what is genuinely different about my case, showing the adjustment as a separate step. If my inside-view estimate differs from the base rate by more than 30%, tell me what would have to be exceptionally true about us to justify the gap.",
		why: "Separating the base rate from the adjustment stops the specifics of your project from dominating the estimate — which is exactly the mechanism behind the planning fallacy.",
		watchOut: "The model may not have reliable base rates for niche domains. Ask it to say when it is inferring rather than recalling.",
		related: [
			"fermi-estimation",
			"expected-value",
			"pre-mortem",
			"critical-path"
		],
		tags: [
			"estimation",
			"forecasting",
			"planning fallacy",
			"base rate",
			"schedule"
		]
	},
	{
		id: "opportunity-cost",
		name: "Opportunity Cost Framing",
		aka: ["what are we not doing", "cost of the road not taken"],
		origin: "Economics",
		domains: [
			"strategy",
			"product",
			"career"
		],
		intents: ["decide", "prioritize"],
		oneLiner: "The real cost of a choice is the best thing you gave up to make it — so evaluate options against the alternative, not against zero.",
		useWhen: [
			"everything on the roadmap looks worth doing",
			"this project is good but is it the best use of the team",
			"we say yes to too much",
			"I need to justify killing something that is working",
			"should I take this job or stay"
		],
		prompt: "Analyse this in terms of opportunity cost rather than absolute value. What is the single best thing this team, budget, or my own time could be doing instead? Compare against that alternative, not against doing nothing. Then tell me what would have to be true for this to beat the alternative, and whether that is the case today.",
		why: "Asked whether something is worth doing, a model compares it to nothing and says yes. Naming the specific alternative changes the comparison set and produces a genuinely different answer.",
		related: [
			"decision-matrix",
			"rice-scoring",
			"cost-of-delay",
			"theory-of-constraints"
		],
		tags: [
			"prioritisation",
			"roadmap",
			"saying no",
			"resource allocation",
			"trade-offs"
		]
	},
	{
		id: "decision-roles-daci",
		name: "Decision Roles (DACI / RAPID)",
		aka: [
			"DACI",
			"RAPID",
			"RACI",
			"who decides"
		],
		origin: "Intuit (DACI) / Bain (RAPID)",
		domains: [
			"strategy",
			"career",
			"product"
		],
		intents: ["decide", "structure"],
		oneLiner: "Name explicitly who drives, who approves, who contributes and who is merely informed, so the decision stops circling.",
		useWhen: [
			"this decision keeps coming back up",
			"nobody knows who actually decides",
			"too many people in the room",
			"we made a decision and someone overturned it later",
			"the meeting ended without a decision again"
		],
		prompt: "Assign DACI roles for this decision: Driver, Approver, Contributors, Informed. For each role, name the specific person or role title and state what they are accountable for. Flag any place where we currently have two approvers, no driver, or contributors who believe they are approvers — those are the reasons this is stuck. Then draft the one-paragraph message the driver should send to lock it in.",
		why: "Decisions that keep reopening are almost always a role ambiguity rather than an information gap. Making the model assign named roles exposes the ambiguity immediately.",
		related: [
			"type-1-type-2-decisions",
			"disagree-and-commit",
			"bluf",
			"decision-matrix"
		],
		tags: [
			"leadership",
			"meetings",
			"accountability",
			"org design",
			"stuck decision"
		]
	},
	{
		id: "disagree-and-commit",
		name: "Disagree and Commit",
		aka: ["commit despite disagreement", "strong opinions loosely held"],
		origin: "Andy Grove / Amazon leadership principle",
		domains: ["career", "strategy"],
		intents: ["decide", "communicate"],
		oneLiner: "Register your objection fully and on the record, then commit to the decision wholeheartedly so the team can move at speed.",
		useWhen: [
			"I lost the argument but still think I am right",
			"the team is relitigating a decision we already made",
			"how do I object without blocking",
			"I need to support a decision I disagree with"
		],
		prompt: "Help me disagree and commit. First, write the strongest possible version of my objection — the one that would actually change a reasonable person's mind — in under 150 words, with the specific evidence that would prove me right. Then write the separate commitment message: unambiguous support, no hedging, no \"as I said\". Finally, name the concrete signal we should agree to watch that would justify reopening this, so my objection has a future without me relitigating it now.",
		why: "Splitting the objection and the commitment into two artefacts is the whole technique. It stops the passive-aggressive blend of the two that undermines both.",
		related: [
			"decision-roles-daci",
			"steelmanning",
			"sbi-feedback",
			"bluf"
		],
		tags: [
			"leadership",
			"conflict",
			"teamwork",
			"communication",
			"alignment"
		]
	}
];
//#endregion
//#region src/data/concepts/prioritization.ts
var prioritization = [
	{
		id: "rice-scoring",
		name: "RICE Scoring",
		aka: ["RICE", "reach impact confidence effort"],
		origin: "Intercom",
		domains: ["product"],
		intents: ["prioritize", "decide"],
		oneLiner: "Score each item as Reach × Impact × Confidence ÷ Effort, so that scale and certainty are priced in rather than argued about.",
		useWhen: [
			"the backlog is a wish list with no order",
			"the loudest stakeholder keeps winning",
			"I need to defend my roadmap ordering",
			"everything is labelled P0",
			"quarterly planning and too many candidates"
		],
		prompt: "Score these items with RICE. For each: Reach as number of users or events per quarter, Impact on the 3 / 2 / 1 / 0.5 / 0.25 scale, Confidence as a percentage with a one-line reason, and Effort in person-months. Show your inputs in a table before the scores so I can argue with the inputs rather than the ranking. Then flag any item whose ranking is driven almost entirely by a Confidence number you had no real basis for.",
		variants: [{
			label: "Lighter weight — impact vs effort only",
			prompt: "Plot these on an impact/effort matrix. Put each item in one of four quadrants — quick wins, big bets, fill-ins, money pits — and for anything you place in \"big bets\", name the one experiment that would cheaply tell us whether the impact is real."
		}],
		why: "Demanding the raw inputs in a table before the arithmetic is what makes this useful. A RICE score presented alone is unfalsifiable; the inputs are where the actual disagreement lives.",
		watchOut: "RICE systematically underrates foundational work with no direct reach. Score platform items against the features they unblock.",
		related: [
			"moscow",
			"cost-of-delay",
			"opportunity-cost",
			"kano-model",
			"eisenhower-matrix"
		],
		tags: [
			"backlog",
			"roadmap",
			"prioritisation",
			"product management",
			"planning"
		]
	},
	{
		id: "moscow",
		name: "MoSCoW Prioritisation",
		aka: ["must should could wont", "MoSCoW method"],
		origin: "Dai Clegg, DSDM",
		domains: ["product", "engineering"],
		intents: ["prioritize", "plan"],
		oneLiner: "Sort scope into Must, Should, Could and Won't-this-time — where \"Won't\" is the category that does the actual work.",
		useWhen: [
			"we need to cut scope to hit a date",
			"the client says everything is essential",
			"defining an MVP and nobody will let go of anything",
			"I need agreement on what we are not building"
		],
		prompt: "Sort this scope into MoSCoW. Apply a hard test to the Must list: if we shipped without it, does the release fail to deliver its core purpose, or is it merely worse? Anything that is merely worse is a Should. Keep Musts under 60% of total effort and tell me if I have blown that budget. Give the Won't-this-time list real entries with a one-line rationale each — an empty Won't list means the exercise did not happen.",
		why: "Naming the Must-list effort budget and demanding a populated Won't list are the two constraints that stop MoSCoW collapsing into \"everything is a Must\", which is its universal failure mode.",
		related: [
			"rice-scoring",
			"mvp-riskiest-assumption",
			"definition-of-done",
			"timeboxing"
		],
		tags: [
			"scope",
			"mvp",
			"deadline",
			"requirements",
			"cutting scope"
		]
	},
	{
		id: "eisenhower-matrix",
		name: "Eisenhower Matrix",
		aka: ["urgent important matrix", "urgency importance grid"],
		origin: "Attributed to Dwight D. Eisenhower; Stephen Covey",
		domains: ["career", "product"],
		intents: ["prioritize", "structure"],
		oneLiner: "Split work by urgent versus important, because the urgent-but-unimportant quadrant is what quietly consumes the week.",
		useWhen: [
			"I am busy all day and get nothing meaningful done",
			"my calendar is full of other peoples priorities",
			"everything feels urgent",
			"I never get to the important work",
			"too many small tasks"
		],
		prompt: "Sort my list into the Eisenhower matrix. Be strict about the difference between urgent and important — urgency is someone else's deadline, importance is my own goals. For the urgent-but-not-important quadrant, propose specifically who to delegate each item to or what would happen if it simply did not get done. Then tell me what percentage of my listed time sits in each quadrant and what that says about my week.",
		why: "The percentage-per-quadrant step converts a sorting exercise into a diagnosis, which is where the actual insight is.",
		related: [
			"moscow",
			"opportunity-cost",
			"rice-scoring",
			"timeboxing"
		],
		tags: [
			"time management",
			"productivity",
			"delegation",
			"focus",
			"personal"
		]
	},
	{
		id: "kano-model",
		name: "Kano Model",
		aka: [
			"kano analysis",
			"delighters and basics",
			"must-be attractive one-dimensional"
		],
		origin: "Noriaki Kano, 1984",
		domains: ["product", "design"],
		intents: ["prioritize", "ideate"],
		oneLiner: "Classify features as basic expectations, linear satisfiers, or delighters — because investment in each category pays back completely differently.",
		useWhen: [
			"which features actually drive satisfaction",
			"we polished something nobody noticed",
			"the product is fine but nobody loves it",
			"deciding what to invest in beyond parity",
			"competitors have features we do not and I do not know if that matters"
		],
		prompt: "Classify these features using the Kano model: Must-be (absence causes anger, presence is unnoticed), One-dimensional (satisfaction scales with quality), Attractive (delighters), and Indifferent. For each, state which category and why. Then apply the decay rule: name which of today's delighters will be must-haves in two years, and which must-haves we are currently over-investing in past the point of diminishing return.",
		why: "The decay rule is the part most Kano analyses skip, and it is the part that changes a roadmap — categories migrate, and investment should migrate ahead of them.",
		related: [
			"rice-scoring",
			"jobs-to-be-done",
			"competitive-teardown",
			"moscow"
		],
		tags: [
			"features",
			"satisfaction",
			"delight",
			"product management",
			"differentiation"
		]
	},
	{
		id: "cost-of-delay",
		name: "Cost of Delay",
		aka: [
			"CD3",
			"WSJF",
			"weighted shortest job first"
		],
		origin: "Don Reinertsen, Principles of Product Development Flow",
		domains: [
			"product",
			"engineering",
			"strategy"
		],
		intents: ["prioritize", "estimate"],
		oneLiner: "Price what each week of delay costs you, then divide by duration — sequencing by that ratio beats sequencing by value alone.",
		useWhen: [
			"two things are both valuable and I cannot sequence them",
			"does it matter if this slips a quarter",
			"justifying why we should do the small thing first",
			"time-sensitive opportunity versus long-term investment",
			"the deadline is arbitrary or is it"
		],
		prompt: "Calculate cost of delay for each of these items. For each, express what one month of delay costs in money, market position, compounding, or risk — and classify its urgency profile as one of: standard decay, fixed-date cliff, or accelerating loss. Then divide cost of delay by duration to get CD3 and give me the resulting sequence. Highlight any item where the sequence flips versus ordering by raw value, and explain why.",
		why: "The urgency-profile classification is what makes deadlines arguable. Most \"hard dates\" turn out to be standard decay, and the few genuine cliffs deserve to dominate the sequence.",
		related: [
			"rice-scoring",
			"opportunity-cost",
			"critical-path",
			"theory-of-constraints"
		],
		tags: [
			"sequencing",
			"economics",
			"deadline",
			"flow",
			"agile"
		]
	},
	{
		id: "opportunity-solution-tree",
		name: "Opportunity Solution Tree",
		aka: [
			"OST",
			"Teresa Torres tree",
			"discovery tree"
		],
		origin: "Teresa Torres, Continuous Discovery Habits",
		domains: ["product", "design"],
		intents: [
			"structure",
			"plan",
			"ideate"
		],
		oneLiner: "Connect one desired outcome to the opportunities that could move it, then to solutions and the experiments that would test them.",
		useWhen: [
			"my roadmap is a feature list not a strategy",
			"I cannot explain how this feature ladders to our goal",
			"we have lots of user research and no structure",
			"connecting discovery work to outcomes",
			"leadership asks why we are building this"
		],
		prompt: "Build an opportunity solution tree. Root it in one measurable outcome. Below that, list the distinct opportunities — customer needs, pain points and desires drawn from evidence, phrased in the customer's language, not as solutions in disguise. Below each opportunity, two or three candidate solutions. Below each solution, the smallest experiment that would test its riskiest assumption. Flag any opportunity that is really a solution wearing a costume, and any branch resting on zero evidence.",
		why: "The \"solution wearing a costume\" check is the workhorse. Opportunity layers collapse into solution layers by default, and the tree becomes a feature list with extra steps unless you police it.",
		related: [
			"jobs-to-be-done",
			"assumption-mapping",
			"okr-laddering",
			"how-might-we"
		],
		tags: [
			"discovery",
			"roadmap",
			"outcomes",
			"product management",
			"experiments"
		]
	},
	{
		id: "theory-of-constraints",
		name: "Theory of Constraints",
		aka: [
			"bottleneck analysis",
			"the goal",
			"constraint thinking"
		],
		origin: "Eliyahu Goldratt, The Goal",
		domains: [
			"engineering",
			"strategy",
			"product"
		],
		intents: ["diagnose", "prioritize"],
		oneLiner: "A system's throughput is set by exactly one bottleneck at a time; improvements anywhere else are illusory.",
		useWhen: [
			"we added people and did not get faster",
			"where is the actual bottleneck",
			"lots of local optimisation with no overall improvement",
			"the pipeline is slow but every stage looks fine",
			"we are busy but not shipping"
		],
		prompt: "Apply the Theory of Constraints to this system. Identify the single binding constraint on throughput and give me the evidence that points at it rather than the alternatives. Then work the five steps: exploit it (get more from it without new resources), subordinate everything else to it, elevate it (spend money), and predict where the constraint will move once this one is relieved. Be explicit about which of my proposed improvements are targeting non-constraints and would therefore produce no throughput gain at all.",
		why: "The last clause is the payoff. Models will happily bless a list of sensible-sounding improvements; asking which ones are aimed at non-constraints kills most of the list and saves the quarter.",
		related: [
			"cost-of-delay",
			"critical-path",
			"root-cause-fishbone",
			"second-order-thinking"
		],
		tags: [
			"bottleneck",
			"throughput",
			"process",
			"efficiency",
			"systems thinking"
		]
	}
];
//#endregion
//#region src/data/concepts/critique.ts
var critique = [
	{
		id: "red-teaming",
		name: "Red Teaming",
		aka: [
			"adversarial review",
			"attack this",
			"devils advocate team"
		],
		origin: "Military wargaming; adopted in security and policy",
		domains: [
			"security",
			"engineering",
			"strategy",
			"product"
		],
		intents: ["critique"],
		oneLiner: "Assign someone the explicit job of attacking the plan as an intelligent adversary, rather than hoping objections surface politely.",
		useWhen: [
			"I want the holes found before my boss finds them",
			"the proposal has had no real pushback",
			"everyone is being too nice about this",
			"security or abuse review",
			"stress-test my argument before I present it"
		],
		prompt: "Red team this. You are a hostile, well-resourced, technically competent critic whose reputation depends on finding the fatal flaw. Attack the weakest assumption first, not the easiest one. Give me your five strongest attacks in descending order of how much damage they do, and for each: the specific failure it causes, how plausible it actually is, and what a competent defender would say in response. Do not soften anything and do not end with encouragement.",
		variants: [{
			label: "For a document about to be reviewed",
			prompt: "Read this as the most skeptical person in the review meeting. List every question you would ask that the document cannot currently answer, ordered by how badly it would derail the meeting. For each, draft the sentence I should add to pre-empt it."
		}, {
			label: "For security or abuse",
			prompt: "Red team this from an abuse perspective. Assume a motivated bad actor with a normal user account and no special access. Walk me through the three most damaging things they could do, step by step, and what control breaks each chain earliest and cheapest."
		}],
		why: "The explicit \"no encouragement\" clause matters more than it looks — models default to a compliment sandwich that dilutes the critique into advice you can comfortably ignore.",
		watchOut: "Red teams generate volume. Insist on the ordering and plausibility rating or you will treat a far-fetched attack as equal to a likely one.",
		related: [
			"threat-modeling-stride",
			"pre-mortem",
			"steelmanning",
			"inversion",
			"assumption-mapping"
		],
		tags: [
			"critique",
			"review",
			"security",
			"stress test",
			"adversarial"
		]
	},
	{
		id: "steelmanning",
		name: "Steelmanning",
		aka: [
			"steel man",
			"strongest version of the argument",
			"opposite of strawman"
		],
		origin: "Rationalist community; contrast with \"straw man\"",
		domains: [
			"strategy",
			"writing",
			"career"
		],
		intents: ["critique", "communicate"],
		oneLiner: "Construct the strongest possible version of the opposing view — stronger than its actual advocates state it — before responding to it.",
		useWhen: [
			"I think the other side is obviously wrong",
			"I need to write a convincing counter-argument",
			"preparing for a debate or a difficult review",
			"I want to check whether I am strawmanning",
			"the disagreement keeps repeating without progress"
		],
		prompt: "Steelman the position I disagree with. Build the strongest, most charitable version — stronger than its actual advocates usually manage — assuming the people who hold it are intelligent and have information I might lack. State what they would have to believe about the world for their position to be clearly correct. Then tell me honestly: which parts of the steelman are actually right, and what is the narrowest remaining point of genuine disagreement?",
		why: "The \"narrowest remaining disagreement\" step is the useful output. Most disputes shrink to a single empirical question once both sides are stated at full strength, and finding that question is what unblocks the conversation.",
		related: [
			"red-teaming",
			"socratic-questioning",
			"disagree-and-commit",
			"falsification-test"
		],
		tags: [
			"argument",
			"debate",
			"persuasion",
			"empathy",
			"critical thinking"
		]
	},
	{
		id: "assumption-mapping",
		name: "Assumption Mapping",
		aka: [
			"riskiest assumption test",
			"RAT",
			"assumption grid"
		],
		origin: "David Bland, Testing Business Ideas",
		domains: [
			"product",
			"design",
			"strategy"
		],
		intents: ["critique", "plan"],
		oneLiner: "Plot every assumption by importance and by evidence, and test the one that is both load-bearing and unevidenced first.",
		useWhen: [
			"what should we validate first",
			"we are about to build something on a guess",
			"the business case rests on numbers we made up",
			"how do we de-risk this cheaply",
			"the plan assumes users will do something they have never done"
		],
		prompt: "Map the assumptions behind this. Extract every assumption, including the ones stated so confidently they no longer look like assumptions, and sort them into desirability, viability, feasibility and usability. Plot each on two axes: how load-bearing it is (does the whole thing collapse if it is false?) and how much evidence we actually have. Give me the top three in the high-importance / low-evidence quadrant, and for each, the cheapest and fastest test that could falsify it in under two weeks.",
		why: "The instruction to catch assumptions \"stated so confidently they no longer look like assumptions\" is what surfaces the dangerous ones. The obvious assumptions are rarely the ones that kill you.",
		related: [
			"pre-mortem",
			"falsification-test",
			"mvp-riskiest-assumption",
			"opportunity-solution-tree"
		],
		tags: [
			"validation",
			"risk",
			"experiments",
			"de-risking",
			"startup"
		]
	},
	{
		id: "falsification-test",
		name: "Falsification Test",
		aka: [
			"what would change my mind",
			"disconfirming evidence",
			"Popper test"
		],
		origin: "Karl Popper",
		domains: [
			"research",
			"data",
			"strategy"
		],
		intents: ["critique", "diagnose"],
		oneLiner: "State in advance what evidence would prove you wrong — a belief with no possible disconfirming evidence is not a belief, it is a commitment.",
		useWhen: [
			"I might be fooling myself about this",
			"everyone on the team already agrees",
			"we keep finding evidence that supports our view",
			"how do I know if my hypothesis is right",
			"is this strategy actually working"
		],
		prompt: "Apply a falsification test to this claim. State precisely what observation would prove it false, with a threshold specific enough that we would agree in advance on what counts. Then tell me whether that evidence is something we could actually go and collect, and by when. If no observation could falsify the claim, say so plainly and tell me what unfalsifiable thing I am actually asserting.",
		why: "Pre-registering the disconfirming threshold is what stops post-hoc reinterpretation. Once the number is written down, a miss is a miss.",
		related: [
			"assumption-mapping",
			"steelmanning",
			"confounders-check",
			"red-teaming"
		],
		tags: [
			"hypothesis",
			"evidence",
			"confirmation bias",
			"science",
			"rigour"
		]
	},
	{
		id: "socratic-questioning",
		name: "Socratic Questioning",
		aka: ["socratic method", "question me instead of answering"],
		origin: "Socrates via Plato",
		domains: [
			"learning",
			"strategy",
			"meta"
		],
		intents: ["explain", "critique"],
		oneLiner: "Progress by disciplined questioning rather than assertion, so the reasoning gets examined instead of the conclusion being handed over.",
		useWhen: [
			"I want to understand this myself not be told the answer",
			"stop giving me answers and make me think",
			"help me find the flaw in my own reasoning",
			"I am studying and want to be tested",
			"coaching someone through a problem"
		],
		prompt: "Use the Socratic method with me on this. Ask one question at a time and wait for my answer before the next. Target the assumption my position most depends on, and follow my answers rather than a script. Do not tell me your conclusion, do not answer your own questions, and do not lead me to a predetermined destination — if my reasoning holds, say so and stop.",
		why: "\"One question at a time and wait\" is the load-bearing instruction. Without it a model produces a list of twelve Socratic questions, which is a quiz, not a dialogue.",
		watchOut: "Slow by design. Use the direct answer when you need the answer.",
		related: [
			"feynman-technique",
			"steelmanning",
			"interview-me-first",
			"five-whys"
		],
		tags: [
			"learning",
			"coaching",
			"questioning",
			"critical thinking",
			"teaching"
		]
	},
	{
		id: "fmea",
		name: "Failure Mode and Effects Analysis",
		aka: [
			"FMEA",
			"failure modes",
			"RPN analysis"
		],
		origin: "US military, 1949; adopted in aerospace and automotive",
		domains: ["engineering", "design"],
		intents: ["critique", "plan"],
		oneLiner: "Enumerate every way each component can fail, score severity, likelihood and detectability, and fix in order of the product.",
		useWhen: [
			"what could break in this system",
			"designing something safety or money critical",
			"we need a systematic reliability review",
			"which failures should we actually guard against",
			"pre-launch readiness review"
		],
		prompt: "Run an FMEA on this design. For each component or step, list the ways it can fail, the effect of each failure on the user or the system, and the cause. Score severity, occurrence and detectability from 1 to 10, and compute the risk priority number. Sort by RPN and give me the top failure modes with a specific mitigation for each. Call out any failure mode with high severity but low detectability separately — those are the ones that hurt most regardless of RPN.",
		why: "The low-detectability callout corrects RPN's known weakness: a rare, severe, silent failure scores mid-table and gets ignored, and that is exactly the outage that ruins a quarter.",
		watchOut: "FMEA is heavy. For a two-week feature, a pre-mortem gets you 80% of the value in 20 minutes.",
		related: [
			"pre-mortem",
			"red-teaming",
			"inversion",
			"observability-triage"
		],
		tags: [
			"reliability",
			"risk",
			"safety",
			"engineering",
			"quality"
		]
	},
	{
		id: "blind-spot-audit",
		name: "Blind Spot Audit",
		aka: [
			"what am I not asking",
			"unknown unknowns",
			"negative space review"
		],
		origin: "Adapted from intelligence analysis practice",
		domains: [
			"strategy",
			"research",
			"meta"
		],
		intents: ["critique", "reframe"],
		oneLiner: "Ask what is conspicuously absent from your own analysis — the questions not asked, the stakeholders not consulted, the data not gathered.",
		useWhen: [
			"what am I missing",
			"I feel like there is something I have not thought of",
			"before I finalise this I want a sanity check",
			"we have analysed this to death and it still feels off",
			"what questions should I be asking"
		],
		prompt: "Audit this for blind spots. Do not critique what I wrote — instead tell me what is conspicuously missing: which stakeholder's perspective never appears, which time horizon I have ignored, which failure mode I have not mentioned, which data I would need but have not gathered, and which question a domain expert would ask in the first two minutes that I have not addressed anywhere. Rank them by how much my conclusion would change if I had that information.",
		why: "Directing the model at absence rather than content is a genuinely different query, and it returns different results. Critique-what-is-there and name-what-is-missing pull from different places.",
		related: [
			"red-teaming",
			"assumption-mapping",
			"triangulation",
			"interview-me-first"
		],
		tags: [
			"gaps",
			"unknown unknowns",
			"review",
			"completeness",
			"perspective"
		]
	},
	{
		id: "design-critique",
		name: "Structured Design Critique",
		aka: [
			"I like I wish what if",
			"crit",
			"feedback protocol"
		],
		origin: "Stanford d.school feedback protocol",
		domains: [
			"design",
			"writing",
			"product"
		],
		intents: ["critique", "communicate"],
		oneLiner: "Separate feedback into what works, what does not, and what could be — so critique stays actionable and does not collapse into taste.",
		useWhen: [
			"I need feedback on a design",
			"the review turned into people restating their preferences",
			"how do I critique someone's work without crushing them",
			"running a design review",
			"feedback keeps being vague"
		],
		prompt: "Critique this using the I Like / I Wish / What If protocol. Under \"I like\", name what is working and the principle that makes it work, not just praise. Under \"I wish\", state each problem in terms of the user's experience rather than your preference, and tie it to a specific heuristic or goal. Under \"What if\", propose alternatives that are genuinely different in approach rather than variations on the same idea. Then rank everything under \"I wish\" by impact on the primary user task.",
		why: "Requiring the *principle* behind each like and the *heuristic* behind each wish is what converts taste into critique. Without it, you get an opinion in a nicer format.",
		related: [
			"heuristic-evaluation",
			"red-teaming",
			"sbi-feedback",
			"rubric-grading"
		],
		tags: [
			"design review",
			"feedback",
			"critique",
			"ux",
			"collaboration"
		]
	}
];
//#endregion
//#region src/data/concepts/diagnosis.ts
var diagnosis = [
	{
		id: "rubber-duck-debugging",
		name: "Rubber Duck Debugging",
		aka: [
			"rubber ducking",
			"explain it line by line",
			"talk it through"
		],
		origin: "The Pragmatic Programmer",
		domains: ["engineering", "learning"],
		intents: ["diagnose", "explain"],
		oneLiner: "Explain the thing line by line to a patient listener; the act of articulating it exposes the gap you were skipping over.",
		useWhen: [
			"I have been staring at this for an hour",
			"the code looks right but does not work",
			"I do not even know what question to ask",
			"I need to talk this through",
			"my logic seems fine and the output is wrong"
		],
		prompt: "Be my rubber duck. I am going to explain this code and what I expect it to do. Do not fix it and do not suggest solutions. Instead, ask me to clarify every step where my explanation skips something, asserts something without evidence, or uses a word like \"obviously\" or \"just\". When my stated expectation and the actual code diverge, point at the exact line and ask me what I think it does — do not tell me.",
		why: "The bug is almost always inside the step you skip when narrating. A model told to fix it will fix it and you will learn nothing; a model told to interrogate the narration finds the gap and it stays found.",
		related: [
			"xy-problem",
			"hypothesis-driven-debugging",
			"socratic-questioning",
			"binary-search-debugging"
		],
		tags: [
			"debugging",
			"stuck",
			"code",
			"explanation",
			"programming"
		]
	},
	{
		id: "hypothesis-driven-debugging",
		name: "Hypothesis-Driven Debugging",
		aka: [
			"scientific debugging",
			"predict then test",
			"debugging by hypothesis"
		],
		origin: "Andreas Zeller, Why Programs Fail",
		domains: ["engineering", "data"],
		intents: ["diagnose"],
		oneLiner: "Write down a specific hypothesis and the observation that would refute it, then run one experiment at a time instead of changing things until it works.",
		useWhen: [
			"I have been changing random things hoping it works",
			"I fixed it but I do not know what fixed it",
			"the bug is intermittent",
			"too many possible causes",
			"shotgun debugging is not working"
		],
		prompt: "Debug this scientifically. Generate a ranked list of hypotheses for the cause, each stated precisely enough to be wrong. For the top hypothesis, tell me the single cheapest observation that would distinguish it from the others — one that gives a different result depending on whether it is true — and what result would refute it. One experiment at a time; wait for my result before proposing the next. Do not suggest fixes until a hypothesis survives a test.",
		why: "Models are strongly biased toward proposing fixes immediately. Withholding fixes until a hypothesis survives a discriminating test is what converts guessing into debugging, especially for intermittent bugs where a random change appears to work.",
		related: [
			"binary-search-debugging",
			"differential-diagnosis",
			"rubber-duck-debugging",
			"five-whys"
		],
		tags: [
			"debugging",
			"scientific method",
			"intermittent bug",
			"engineering",
			"troubleshooting"
		]
	},
	{
		id: "binary-search-debugging",
		name: "Binary Search Debugging",
		aka: [
			"bisection",
			"git bisect",
			"halving the search space",
			"wolf fence"
		],
		origin: "Classic technique; formalised by git bisect",
		domains: ["engineering"],
		intents: ["diagnose"],
		oneLiner: "Halve the search space with each test — in commits, in inputs, or in the pipeline — instead of scanning linearly.",
		useWhen: [
			"it used to work and now it does not",
			"somewhere in this huge pipeline something breaks",
			"which commit broke it",
			"the input file is enormous and one row is bad",
			"the config used to be fine"
		],
		prompt: "Find this by bisection rather than by inspection. Define the search space precisely, confirm a known-good and a known-bad endpoint, and tell me the exact midpoint test to run first and what each outcome would mean. Keep giving me one test at a time based on my results. Warn me up front about anything that would break the monotonicity assumption bisection depends on — flaky tests, unrelated breakage in the middle of the range, or state that carries between runs.",
		why: "The monotonicity warning is what stops a bisection from confidently converging on the wrong commit, which is the standard way this technique fails in practice.",
		related: [
			"hypothesis-driven-debugging",
			"differential-diagnosis",
			"timeline-reconstruction"
		],
		tags: [
			"debugging",
			"bisect",
			"regression",
			"git",
			"search"
		]
	},
	{
		id: "differential-diagnosis",
		name: "Differential Diagnosis",
		aka: [
			"differential",
			"rule out list",
			"what else could it be"
		],
		origin: "Clinical medicine",
		domains: [
			"engineering",
			"data",
			"research"
		],
		intents: ["diagnose"],
		oneLiner: "List every condition consistent with the symptoms, then order tests by how much each one narrows the field.",
		useWhen: [
			"the symptom could have several causes",
			"I keep fixating on one explanation",
			"what else could explain this",
			"the obvious cause turned out not to be it",
			"performance regression with no clear source"
		],
		prompt: "Give me a differential diagnosis for these symptoms. List every plausible cause consistent with all the evidence, including the boring and the rare ones, with a rough prior for each. Explicitly name the ones I appear to have already ruled out and ask whether I actually tested them or just assumed. Then order the diagnostic tests by information gain — which single check eliminates the largest share of the list — not by ease.",
		why: "Ordering by information gain rather than by convenience is the difference between three tests and eleven. The \"ruled out or assumed\" question catches the most common diagnostic failure.",
		related: [
			"hypothesis-driven-debugging",
			"root-cause-fishbone",
			"binary-search-debugging",
			"observability-triage"
		],
		tags: [
			"diagnosis",
			"troubleshooting",
			"root cause",
			"medicine",
			"systematic"
		]
	},
	{
		id: "root-cause-fishbone",
		name: "Fishbone (Ishikawa) Analysis",
		aka: [
			"ishikawa diagram",
			"cause and effect diagram",
			"fishbone",
			"6Ms"
		],
		origin: "Kaoru Ishikawa, quality management",
		domains: [
			"engineering",
			"product",
			"strategy"
		],
		intents: ["diagnose", "structure"],
		oneLiner: "Group candidate causes into categories branching off the problem, so you search the whole space instead of the first branch you thought of.",
		useWhen: [
			"the failure had more than one cause",
			"five whys gave me a single line and that felt incomplete",
			"quality problems keep coming from different directions",
			"we need a structured cause analysis for a review",
			"the team each blame a different thing"
		],
		prompt: "Build a fishbone analysis for this problem. Use the categories People, Process, Tooling, Environment, Data, and Design — adapt them if a better set fits. Under each, list specific candidate causes, going two levels deep where you can. Then mark which causes have supporting evidence, which are speculation, and which combination of causes would have to co-occur to produce exactly the failure we saw. Finish with the three cheapest checks that would confirm or eliminate whole branches.",
		why: "Categories force lateral search. Left unstructured, both people and models elaborate the first plausible branch and never look at the others — which is precisely how multi-cause failures get half-fixed.",
		related: [
			"five-whys",
			"differential-diagnosis",
			"blameless-postmortem",
			"fmea"
		],
		tags: [
			"root cause",
			"quality",
			"structured analysis",
			"multi-cause",
			"incident"
		]
	},
	{
		id: "blameless-postmortem",
		name: "Blameless Postmortem",
		aka: [
			"incident retrospective",
			"postmortem",
			"learning review"
		],
		origin: "Site reliability engineering practice (Google SRE, Etsy)",
		domains: ["engineering", "career"],
		intents: ["diagnose", "communicate"],
		oneLiner: "Reconstruct an incident on the assumption that everyone acted sensibly given what they knew, so the analysis lands on the system rather than a person.",
		useWhen: [
			"we had an outage and need to write it up",
			"the retro turned into finger pointing",
			"how do we stop this happening again",
			"writing an incident report for leadership",
			"someone made a mistake and I do not want to punish them"
		],
		prompt: "Write this as a blameless postmortem. Assume every person acted reasonably given the information available to them at that moment — where a decision looks wrong in hindsight, explain what made it look right at the time. Structure it as: impact in user terms, timeline with what was known at each step, contributing factors, what went well, and action items. Every action item must change a system, a default, an alert, or a piece of documentation. Reject any action item that amounts to \"be more careful\" or \"add a review step\" without a mechanism.",
		why: "The \"looked right at the time\" reconstruction is what makes a postmortem actionable — it identifies the missing signal rather than the missing diligence, and only the former can be fixed.",
		related: [
			"five-whys",
			"root-cause-fishbone",
			"timeline-reconstruction",
			"sbi-feedback"
		],
		tags: [
			"incident",
			"outage",
			"retrospective",
			"sre",
			"culture"
		]
	},
	{
		id: "timeline-reconstruction",
		name: "Timeline Reconstruction",
		aka: [
			"incident timeline",
			"sequence of events",
			"what happened when"
		],
		origin: "Incident response and accident investigation",
		domains: ["engineering", "research"],
		intents: ["diagnose", "structure"],
		oneLiner: "Build a strict chronological record separating what happened from what was observed from what was believed, before attempting explanation.",
		useWhen: [
			"I have logs and alerts and slack messages and no clear story",
			"people disagree about what happened first",
			"the incident is confusing and I need order",
			"writing up a complicated failure",
			"correlating events across systems"
		],
		prompt: "Reconstruct a timeline from this material. Keep three columns strictly separate: what actually happened (with timestamps), what was observed or alerted at that moment, and what the responders believed at that moment. Mark gaps where we have no data rather than smoothing over them, and mark any ordering you inferred rather than observed. Do not offer a causal explanation yet — I want the chronology clean first. Then tell me where the largest gap between reality and belief opened up, because that is where detection failed.",
		why: "Separating happened / observed / believed is the technique. Merged into one narrative, hindsight contaminates the record and the detection gap — usually the real finding — becomes invisible.",
		related: [
			"blameless-postmortem",
			"root-cause-fishbone",
			"binary-search-debugging",
			"observability-triage"
		],
		tags: [
			"incident",
			"timeline",
			"forensics",
			"logs",
			"investigation"
		]
	},
	{
		id: "observability-triage",
		name: "RED / USE Method Triage",
		aka: [
			"RED method",
			"USE method",
			"golden signals",
			"observability triage"
		],
		origin: "Brendan Gregg (USE), Tom Wilkie (RED), Google SRE (golden signals)",
		domains: ["engineering", "data"],
		intents: ["diagnose", "structure"],
		oneLiner: "Check services by Rate, Errors and Duration, and resources by Utilisation, Saturation and Errors — a fixed checklist that finds the layer at fault fast.",
		useWhen: [
			"the site is slow and I do not know where to look",
			"which service is causing this",
			"what dashboards should we even have",
			"production is degraded and I am panicking",
			"we have metrics everywhere and no signal"
		],
		prompt: "Triage this using RED for services and USE for resources. For each service in the path, walk Rate, Errors and Duration; for each resource — CPU, memory, disk, network, connection pools, thread pools — walk Utilisation, Saturation and Errors. Tell me which specific metric to look at first and what value would implicate that layer versus exonerate it. Saturation before utilisation: queue depth and wait time tell you more than a busy percentage. End with the single most likely layer given what I have described.",
		why: "A fixed checklist beats intuition under pressure. It is the same reason pilots use them: the failure mode of an expert in an outage is skipping a layer they are sure is fine.",
		related: [
			"differential-diagnosis",
			"theory-of-constraints",
			"timeline-reconstruction",
			"fmea"
		],
		tags: [
			"observability",
			"performance",
			"production",
			"monitoring",
			"sre"
		]
	}
];
//#endregion
//#region src/data/concepts/planning.ts
var planning = [
	{
		id: "walking-skeleton",
		name: "Walking Skeleton",
		aka: [
			"tracer bullet",
			"thin vertical slice",
			"end to end first"
		],
		origin: "Alistair Cockburn; tracer bullets from The Pragmatic Programmer",
		domains: ["engineering", "product"],
		intents: ["plan", "reframe"],
		oneLiner: "Build the thinnest possible end-to-end path through every layer of the system first, then thicken it — rather than completing one layer at a time.",
		useWhen: [
			"where do I even start on this build",
			"we built the backend for months and integration broke everything",
			"the architecture is unproven",
			"how do I sequence a big technical project",
			"I want to de-risk the integration early"
		],
		prompt: "Design a walking skeleton for this. Define the thinnest end-to-end path that touches every architectural layer and every system boundary while doing something trivially small but real. Specify what is deliberately fake, hardcoded or stubbed in v1 and what must be genuinely real from day one — the rule being that anything carrying integration risk must be real. Then give me the order in which to thicken each slice, riskiest integration first.",
		why: "\"Anything carrying integration risk must be real\" is the discriminator that makes this different from an MVP. It puts the unknowns in week one instead of week ten.",
		related: [
			"mvp-riskiest-assumption",
			"work-breakdown-structure",
			"critical-path",
			"timeboxing"
		],
		tags: [
			"architecture",
			"sequencing",
			"integration",
			"engineering",
			"de-risking"
		]
	},
	{
		id: "mvp-riskiest-assumption",
		name: "Riskiest Assumption First",
		aka: [
			"MVP scoping",
			"RAT over MVP",
			"minimum viable test"
		],
		origin: "Lean startup lineage; refined by Rik Higham",
		domains: ["product", "design"],
		intents: ["plan", "prioritize"],
		oneLiner: "Build the smallest thing that tests your riskiest assumption — which is often not a product at all.",
		useWhen: [
			"what should the MVP actually be",
			"our MVP is turning into a full product",
			"how do we test this cheaply before building",
			"we do not know if anyone wants this",
			"six months of build before any signal"
		],
		prompt: "Scope this by riskiest assumption rather than by minimum feature set. Identify the single assumption that, if false, makes the whole thing pointless. Then design the cheapest test of that specific assumption — and consider tests that are not products at all: a landing page, a concierge service done manually, a sales conversation, an ad, a spreadsheet. Give me three options at different cost levels, what each would actually prove, and the decision threshold that would make me stop.",
		why: "Pushing explicitly for non-product tests is what breaks the reflex to answer \"MVP\" with a smaller version of the thing you already wanted to build.",
		related: [
			"assumption-mapping",
			"walking-skeleton",
			"moscow",
			"opportunity-solution-tree"
		],
		tags: [
			"mvp",
			"lean startup",
			"validation",
			"experiments",
			"scoping"
		]
	},
	{
		id: "work-breakdown-structure",
		name: "Work Breakdown Structure",
		aka: [
			"WBS",
			"task decomposition",
			"break it down"
		],
		origin: "Project management (US DoD, 1960s)",
		domains: ["engineering", "product"],
		intents: [
			"plan",
			"structure",
			"estimate"
		],
		oneLiner: "Decompose deliverables hierarchically until every leaf is small enough to estimate confidently and assign to one owner.",
		useWhen: [
			"this project is too big to think about",
			"I need to estimate something large",
			"where do we start and who does what",
			"the ticket is enormous and needs splitting",
			"planning a quarter of work"
		],
		prompt: "Build a work breakdown structure for this. Decompose by deliverable rather than by activity, and keep going until every leaf is something one person could finish in under three days. Apply the 100% rule: the children of any node must fully account for that node with nothing missing and nothing extra. Then flag the leaves you are least confident about and say whether the uncertainty is scope, technical unknown, or dependency on someone else — and mark which leaves are actually spikes rather than build work.",
		why: "The 100% rule is what catches the missing work. Without it, decomposition produces a plausible-looking tree that quietly omits migration, rollback, and everything that is not the happy path.",
		related: [
			"critical-path",
			"walking-skeleton",
			"definition-of-done",
			"timeboxing"
		],
		tags: [
			"planning",
			"estimation",
			"decomposition",
			"project management",
			"tasks"
		]
	},
	{
		id: "critical-path",
		name: "Critical Path Analysis",
		aka: [
			"CPM",
			"critical path method",
			"dependency chain",
			"longest path"
		],
		origin: "DuPont / Remington Rand, 1957",
		domains: [
			"engineering",
			"product",
			"strategy"
		],
		intents: [
			"plan",
			"prioritize",
			"estimate"
		],
		oneLiner: "Find the longest chain of dependent tasks: it sets the minimum duration, and only shortening it moves the date.",
		useWhen: [
			"can we hit this date",
			"what should we start first",
			"where should I add people to go faster",
			"the schedule keeps slipping and I do not know why",
			"which of these tasks actually matter to the deadline"
		],
		prompt: "Do a critical path analysis. Build the dependency graph, identify the longest chain, and give me the minimum achievable duration. Show which tasks have slack and how much. Then tell me: which single task on the critical path would most shorten the schedule if compressed, which off-path tasks I am currently over-resourcing for no schedule benefit, and where an external dependency — a vendor, an approval, another team — sits on the path, since those are the ones I cannot fix by working harder.",
		why: "The external-dependency callout is where schedules actually die. Internal tasks can be compressed; a legal review or a partner integration cannot, and it needs to be started far earlier than its position in the plan suggests.",
		related: [
			"work-breakdown-structure",
			"theory-of-constraints",
			"cost-of-delay",
			"reference-class-forecasting"
		],
		tags: [
			"schedule",
			"dependencies",
			"deadline",
			"project management",
			"planning"
		]
	},
	{
		id: "definition-of-done",
		name: "Definition of Done / Acceptance Criteria",
		aka: [
			"DoD",
			"acceptance criteria",
			"given when then",
			"gherkin"
		],
		origin: "Scrum; Given-When-Then from BDD (Dan North)",
		domains: ["engineering", "product"],
		intents: ["plan", "structure"],
		oneLiner: "State the observable conditions under which the work is finished, before starting, in terms someone else could verify.",
		useWhen: [
			"the ticket keeps coming back from QA",
			"we thought it was done and it was not",
			"requirements are vague",
			"engineering built something different from what I asked for",
			"writing a ticket or user story"
		],
		prompt: "Write acceptance criteria for this in Given / When / Then form. Cover the happy path, then the edge cases, then the error and empty states, then anything about permissions, and then the non-functional bar — performance, accessibility, and what happens on a slow connection. Every criterion must be checkable by someone who was not in the conversation. Then list what is explicitly out of scope, because that list is what stops the ticket coming back.",
		why: "Sequencing the categories — happy, edge, error, empty, permissions, non-functional — is what produces coverage. Asked for acceptance criteria flat, a model writes three happy-path bullets and stops.",
		related: [
			"moscow",
			"work-breakdown-structure",
			"output-contract",
			"walking-skeleton"
		],
		tags: [
			"requirements",
			"user story",
			"qa",
			"tickets",
			"agile"
		]
	},
	{
		id: "backcasting",
		name: "Backcasting",
		aka: [
			"work backwards from the goal",
			"reverse planning",
			"pre-parade"
		],
		origin: "Futures studies / John B. Robinson",
		domains: [
			"strategy",
			"product",
			"career"
		],
		intents: ["plan", "reframe"],
		oneLiner: "Start from the desired end state and step backwards to now, asking what must be true immediately before each step.",
		useWhen: [
			"we have a big ambitious goal and no path",
			"forward planning keeps producing incrementalism",
			"what would have to be true for this to work",
			"a three year vision with no year one",
			"planning backwards from a launch date"
		],
		prompt: "Backcast from this goal. Start at the end state, described concretely enough that we would know it had happened. Then step backwards: what must have been true immediately before that, and before that, until you reach something we could start this month. At each step state what must be true, not what we would do. Then mark which of those preconditions are outside our control, since those determine whether the plan is a plan or a wish.",
		why: "\"What must be true\" rather than \"what would we do\" is the crucial phrasing — it surfaces the preconditions and dependencies that forward planning hides behind activity.",
		related: [
			"critical-path",
			"working-backwards",
			"okr-laddering",
			"first-principles"
		],
		tags: [
			"vision",
			"roadmap",
			"goals",
			"long term",
			"strategy"
		]
	},
	{
		id: "timeboxing",
		name: "Timeboxing & Spikes",
		aka: [
			"spike",
			"timebox",
			"research spike",
			"fixed time variable scope"
		],
		origin: "Extreme Programming",
		domains: [
			"engineering",
			"product",
			"career"
		],
		intents: ["plan", "estimate"],
		oneLiner: "Fix the time and let the scope vary, especially for work whose size you cannot know until you have started it.",
		useWhen: [
			"we cannot estimate this until we investigate",
			"the research keeps expanding",
			"how long should we spend evaluating options",
			"this task has consumed a week with no end in sight",
			"gold plating and perfectionism"
		],
		prompt: "Turn this into a timeboxed spike. Set a fixed duration proportionate to the decision it feeds. State the specific question the spike must answer, and what artefact it produces — a recommendation, a prototype, a number. Define in advance what we do at the end of the box in each case: answer found, answer not found, or answer found and it is bad news. The point is that the box ends regardless, so tell me what the fallback decision is if we learn nothing.",
		why: "Pre-committing to the \"we learned nothing\" branch is what makes a timebox actually end. Without it the box gets extended, which is the same as not having one.",
		related: [
			"work-breakdown-structure",
			"mvp-riskiest-assumption",
			"eisenhower-matrix",
			"moscow"
		],
		tags: [
			"time management",
			"research",
			"estimation",
			"agile",
			"scope creep"
		]
	},
	{
		id: "working-backwards",
		name: "Working Backwards (PR-FAQ)",
		aka: [
			"press release FAQ",
			"PRFAQ",
			"Amazon working backwards",
			"six pager"
		],
		origin: "Amazon",
		domains: [
			"product",
			"writing",
			"strategy"
		],
		intents: [
			"plan",
			"communicate",
			"reframe"
		],
		oneLiner: "Write the launch press release and customer FAQ before building anything; if the release is not compelling, the product is not either.",
		useWhen: [
			"is this idea actually worth building",
			"I need to pitch a new product internally",
			"we cannot articulate the value clearly",
			"getting alignment on a big bet",
			"writing a product brief"
		],
		prompt: "Write this as a working-backwards PR-FAQ. First the press release: headline, subheading, the problem in the customer's words, our solution, a quote from a customer that would only be true if we got it right, and how to get started — one page, no jargon, no internal terminology. Then the external FAQ (what customers will ask) and the internal FAQ (the hard questions leadership will ask: why us, why now, what breaks at scale, what we are giving up). If the press release is boring, say so plainly rather than polishing it — that is the signal the idea needs work.",
		why: "\"If it is boring, say so\" is the whole point of the exercise. A press release is a forcing function only if it is allowed to fail.",
		related: [
			"jobs-to-be-done",
			"backcasting",
			"pyramid-principle",
			"bluf"
		],
		tags: [
			"product brief",
			"pitch",
			"alignment",
			"launch",
			"amazon"
		]
	}
];
//#endregion
//#region src/data/concepts/communication.ts
var communication = [
	{
		id: "pyramid-principle",
		name: "Pyramid Principle",
		aka: [
			"Minto pyramid",
			"MECE",
			"answer first structure",
			"consulting structure"
		],
		origin: "Barbara Minto, McKinsey",
		domains: [
			"writing",
			"strategy",
			"product"
		],
		intents: ["communicate", "structure"],
		oneLiner: "Lead with the answer, support it with three to five mutually exclusive and collectively exhaustive arguments, and put the evidence beneath each.",
		useWhen: [
			"my document buries the point",
			"executives are not reading past the first page",
			"my writing is a chronology of how I figured it out",
			"the argument is there but the structure is a mess",
			"how do consultants structure recommendations"
		],
		prompt: "Restructure this using the Pyramid Principle. Put the single governing recommendation at the top as one sentence. Beneath it, three to five supporting arguments that are mutually exclusive and collectively exhaustive — check them explicitly for overlap and for gaps and tell me if they fail either test. Beneath each argument, the evidence. Strip out the narrative of how I arrived at the conclusion; the reader wants the conclusion, not my journey. Flag any supporting argument that is actually a restatement of the recommendation.",
		why: "Explicitly testing the MECE property is what distinguishes this from \"add a summary at the top\". Overlapping arguments feel like more support and are actually one argument said three ways — a model will tell you which, if asked.",
		watchOut: "Answer-first fails when the reader is hostile to the conclusion. In that case, lead with the shared premise instead.",
		related: [
			"bluf",
			"scqa",
			"working-backwards",
			"reader-centric-rewrite"
		],
		tags: [
			"writing",
			"structure",
			"executive communication",
			"documents",
			"consulting"
		]
	},
	{
		id: "bluf",
		name: "BLUF (Bottom Line Up Front)",
		aka: [
			"bottom line up front",
			"lead with the ask",
			"TLDR first"
		],
		origin: "US military communication doctrine",
		domains: ["writing", "career"],
		intents: ["communicate"],
		oneLiner: "Open with the conclusion and the specific action required, then supply context — so a reader who stops after one paragraph still has what they need.",
		useWhen: [
			"my emails are too long and get ignored",
			"nobody responds to my slack messages",
			"I need a decision from a busy person",
			"how do I write an update leadership will read",
			"my status updates ramble"
		],
		prompt: "Rewrite this BLUF-style. First line: the bottom line — the decision, the ask, or the status, plus the deadline. Second line: exactly what I need from the reader and by when, or \"no action needed\" if that is true. Then the context, in descending order of importance, so it can be cut from the bottom without losing anything essential. Keep the first two lines readable on a phone lock screen.",
		variants: [{
			label: "Escalating a problem upward",
			prompt: "Rewrite this as a BLUF escalation: what is wrong, what it costs, what I have already tried, what I am asking for specifically, and what happens if the answer is no. Four sentences before any detail. No blame, no throat-clearing, no apologising for the length."
		}],
		why: "The phone-lock-screen constraint is a concrete length test the model can actually satisfy, unlike \"be concise\" — which it will agree to and then ignore.",
		related: [
			"pyramid-principle",
			"scqa",
			"reader-centric-rewrite",
			"decision-roles-daci"
		],
		tags: [
			"email",
			"slack",
			"brevity",
			"executive communication",
			"updates"
		]
	},
	{
		id: "scqa",
		name: "SCQA Framework",
		aka: [
			"situation complication question answer",
			"SCR",
			"setup payoff"
		],
		origin: "Barbara Minto",
		domains: ["writing", "strategy"],
		intents: ["communicate", "structure"],
		oneLiner: "Open with a stable Situation, introduce the Complication that disturbs it, surface the Question that raises, and give the Answer.",
		useWhen: [
			"how do I open this document",
			"the intro is boring and nobody reads on",
			"I need to make the reader care before the recommendation",
			"writing a strategy doc or a proposal",
			"the audience does not yet think there is a problem"
		],
		prompt: "Write the opening using SCQA. Situation: something the reader already accepts as true, stated in their terms — no persuasion yet. Complication: the specific change or tension that makes the situation no longer stable, with evidence. Question: the question the complication forces, stated so plainly the reader would have asked it themselves. Answer: my recommendation in one sentence. Keep the whole thing under 150 words, and make sure the Situation is genuinely uncontroversial — if the reader argues with the first sentence, the rest will not land.",
		why: "Complementary to the Pyramid Principle rather than an alternative: SCQA earns the right to lead with the answer by first establishing that a question exists.",
		related: [
			"pyramid-principle",
			"bluf",
			"story-spine",
			"working-backwards"
		],
		tags: [
			"writing",
			"opening",
			"narrative",
			"proposal",
			"structure"
		]
	},
	{
		id: "reader-centric-rewrite",
		name: "Curse of Knowledge Rewrite",
		aka: [
			"curse of knowledge",
			"reader centric editing",
			"jargon audit"
		],
		origin: "Named by Robin Hogarth; popularised by Chip & Dan Heath and Steven Pinker",
		domains: ["writing", "learning"],
		intents: ["communicate", "explain"],
		oneLiner: "You cannot un-know what you know, so your writing skips the steps that made it make sense — the fix is to audit for assumed context, not for style.",
		useWhen: [
			"people keep misunderstanding my writing",
			"this is clear to me and apparently to nobody else",
			"writing docs for a different audience",
			"too much jargon",
			"my explanation assumes too much"
		],
		prompt: "Audit this for the curse of knowledge. Read it as a specific reader: [describe them — role, seniority, what they already know, what they care about]. Mark every place where I assume context they do not have: undefined jargon, acronyms, implied history, references to systems or decisions they were not part of, and reasoning steps I skipped because they are obvious to me. For each, tell me the minimum I would need to add. Then flag anything I over-explained for this particular reader, because that costs their attention too.",
		why: "The over-explanation pass is what keeps this from turning every document into a tutorial. Clarity is calibration to a specific reader, not maximal explanation.",
		related: [
			"feynman-technique",
			"audience-ladder",
			"plain-language",
			"bluf"
		],
		tags: [
			"clarity",
			"editing",
			"jargon",
			"audience",
			"documentation"
		]
	},
	{
		id: "audience-ladder",
		name: "Audience Ladder",
		aka: [
			"explain at five levels",
			"ELI5 to expert",
			"progressive explanation"
		],
		origin: "Popularised by WIRED's \"5 Levels\" series",
		domains: [
			"writing",
			"learning",
			"meta"
		],
		intents: ["explain", "communicate"],
		oneLiner: "Explain the same idea at several levels of sophistication so you can find the rung your audience is actually on.",
		useWhen: [
			"I do not know how technical to make this",
			"explaining the same thing to engineers and executives",
			"my explanation is either patronising or over their head",
			"writing for a mixed audience",
			"I need an analogy that works for a non-technical stakeholder"
		],
		prompt: "Explain this at four levels: to a curious twelve-year-old, to a smart generalist with no domain background, to a practitioner in an adjacent field, and to an expert in this exact field. Each version must be accurate — simplify by omitting detail, never by saying something false. After the four, tell me which one fits my actual audience [describe them] and which specific sentence from a lower level is worth keeping in the higher-level version as the anchor image.",
		why: "The \"borrow one sentence from a lower rung\" instruction is where the value is. The best expert-level writing keeps exactly one concrete image from the twelve-year-old version.",
		related: [
			"feynman-technique",
			"reader-centric-rewrite",
			"analogical-mapping",
			"plain-language"
		],
		tags: [
			"explanation",
			"teaching",
			"audience",
			"analogy",
			"simplification"
		]
	},
	{
		id: "plain-language",
		name: "Plain Language Pass",
		aka: [
			"plain english",
			"readability edit",
			"de-jargon"
		],
		origin: "Plain Language movement / US Plain Writing Act 2010",
		domains: ["writing", "design"],
		intents: ["communicate"],
		oneLiner: "Cut nominalisations, passive constructions and abstraction until the sentence says who does what.",
		useWhen: [
			"this reads like corporate mush",
			"my writing is full of nominalisations",
			"make this shorter without losing meaning",
			"legal or policy text nobody can parse",
			"error messages and UI copy"
		],
		prompt: "Do a plain language pass. Turn nominalisations back into verbs (\"make a determination\" becomes \"decide\"), give every sentence a clear actor doing a clear thing, and cut hedging that adds no information. Preserve every substantive qualification — do not make it more confident than the original. Show the result, then a short table of the three changes that most improved it and what each one was hiding, since vague writing usually conceals a decision nobody wanted to state.",
		why: "\"Vague writing conceals a decision nobody wanted to state\" turns copy-editing into a diagnostic. The passive voice in a policy doc is usually load-bearing.",
		watchOut: "Do not let it strip necessary hedges from legal, medical, or safety text. The \"preserve qualifications\" clause is not optional there.",
		related: [
			"reader-centric-rewrite",
			"bluf",
			"audience-ladder"
		],
		tags: [
			"editing",
			"clarity",
			"concise",
			"ux writing",
			"style"
		]
	},
	{
		id: "story-spine",
		name: "Story Spine",
		aka: [
			"narrative arc",
			"and then one day",
			"Pixar pitch"
		],
		origin: "Kenn Adams, improvisational theatre",
		domains: [
			"writing",
			"product",
			"strategy"
		],
		intents: ["communicate", "structure"],
		oneLiner: "Once upon a time / every day / but one day / because of that / until finally — a skeleton that makes any change feel inevitable rather than arbitrary.",
		useWhen: [
			"my presentation is a pile of facts",
			"how do I make this memorable",
			"pitching a vision",
			"the demo needs a story around it",
			"writing a case study or customer story"
		],
		prompt: "Structure this as a story spine: \"Once upon a time [stable world] / Every day [the routine and its cost] / But one day [the change or insight] / Because of that [consequence] / Because of that [second consequence] / Until finally [the new state]\". Keep the protagonist as the customer, not us — we are at most the guide. Make the \"every day\" section sting: the cost of the status quo is what makes the rest land. Then tell me which of the beats I currently have no evidence for.",
		why: "Casting the customer as protagonist is the correction most product narratives need, and models will default to making the company the hero unless told otherwise.",
		related: [
			"scqa",
			"jobs-to-be-done",
			"working-backwards",
			"pyramid-principle"
		],
		tags: [
			"storytelling",
			"presentation",
			"pitch",
			"narrative",
			"marketing"
		]
	},
	{
		id: "sbi-feedback",
		name: "Situation-Behaviour-Impact",
		aka: [
			"SBI",
			"feedback model",
			"radical candor in practice"
		],
		origin: "Center for Creative Leadership",
		domains: ["career"],
		intents: ["communicate"],
		oneLiner: "Describe the specific situation, the observable behaviour, and its concrete impact — with no inference about the person's character or intent.",
		useWhen: [
			"I need to give someone difficult feedback",
			"how do I say this without it being personal",
			"a peer keeps doing something that undermines the team",
			"writing a performance review",
			"my feedback keeps landing badly"
		],
		prompt: "Draft this feedback using Situation-Behaviour-Impact. Situation: when and where, specifically. Behaviour: what was observable — what a camera would have recorded — with no interpretation of motive. Impact: the concrete effect on the work, the team, or me, stated as my experience rather than as objective fact. Then strip out every inference about their intent or character, and show me what you removed, because those are the phrases that would have triggered defensiveness. End with a genuine question that opens a conversation rather than closing one.",
		why: "Making the model show what it stripped out teaches the pattern. The inferred-motive phrases are the ones you would not have noticed writing yourself.",
		related: [
			"nonviolent-communication",
			"design-critique",
			"blameless-postmortem",
			"disagree-and-commit"
		],
		tags: [
			"feedback",
			"management",
			"difficult conversation",
			"performance review",
			"leadership"
		]
	},
	{
		id: "nonviolent-communication",
		name: "Nonviolent Communication",
		aka: [
			"NVC",
			"observation feeling need request",
			"compassionate communication"
		],
		origin: "Marshall Rosenberg",
		domains: ["career"],
		intents: ["communicate"],
		oneLiner: "Separate observation from evaluation, name the feeling and the underlying need, then make a specific, refusable request.",
		useWhen: [
			"this conversation keeps turning into a fight",
			"I am frustrated and about to send something I will regret",
			"a conflict with a colleague or a partner",
			"how do I ask for what I need without accusing",
			"the same argument keeps recurring"
		],
		prompt: "Rewrite this using Nonviolent Communication. Observation: what happened, stated so neutrally that the other person would agree with the description. Feeling: what I feel, using an actual emotion rather than a disguised accusation (\"I feel dismissed\" is a judgement, not a feeling). Need: the underlying need that is unmet. Request: something specific, doable and genuinely refusable — not a demand wearing a question mark. Flag anywhere my original wording contained a judgement I had mistaken for an observation.",
		why: "The \"I feel dismissed is not a feeling\" distinction is the one people consistently get wrong, and naming it explicitly in the prompt is what makes the output different from a politeness pass.",
		watchOut: "Full NVC phrasing can read as stilted in a workplace. Use the structure to think, then translate to normal register.",
		related: [
			"sbi-feedback",
			"steelmanning",
			"disagree-and-commit"
		],
		tags: [
			"conflict",
			"communication",
			"relationships",
			"difficult conversation",
			"empathy"
		]
	},
	{
		id: "star-method",
		name: "STAR Method",
		aka: ["situation task action result", "behavioural interview answers"],
		origin: "Structured behavioural interviewing",
		domains: ["career"],
		intents: ["communicate", "structure"],
		oneLiner: "Answer \"tell me about a time when\" as Situation, Task, Action, Result — with the Action in the first person singular.",
		useWhen: [
			"preparing for a job interview",
			"writing my performance self-review",
			"how do I talk about my accomplishments",
			"my interview answers ramble",
			"promotion packet or brag document"
		],
		prompt: "Structure this experience as a STAR answer. Situation and Task in two sentences of context — no more. Action is the bulk of it, and must be in the first person singular: what I specifically did, including the decision points and what I chose against. Result must be quantified, and if I have no number, tell me what number I should go find. Keep the whole thing under 90 seconds spoken. Then flag every \"we\" in the Action section, because that is where interviewers lose track of what I actually did.",
		why: "The \"we\" flag is the single highest-value edit in interview prep. Candidates describe team accomplishments and interviewers cannot score them.",
		related: [
			"bluf",
			"sbi-feedback",
			"pyramid-principle"
		],
		tags: [
			"interview",
			"career",
			"resume",
			"promotion",
			"self review"
		]
	}
];
//#endregion
//#region src/data/concepts/learning.ts
var learning = [
	{
		id: "feynman-technique",
		name: "Feynman Technique",
		aka: [
			"explain it simply",
			"teach it to learn it",
			"gap-finding explanation"
		],
		origin: "Richard Feynman",
		domains: ["learning", "writing"],
		intents: ["explain", "critique"],
		oneLiner: "Explain the concept in plain language as if teaching a beginner; wherever you reach for jargon, that is the gap in your understanding.",
		useWhen: [
			"I think I understand this but I am not sure",
			"I need to actually learn this not just skim it",
			"preparing to teach or present something",
			"I can use it but I cannot explain it",
			"studying for an exam or an interview"
		],
		prompt: "Run the Feynman technique on me for this topic. I will explain it in plain language. Interrupt me every time I use a technical term without having defined it, state something as true without being able to say why, or paper over a step with \"basically\" or \"it just works\". Do not supply the missing piece — tell me precisely which part of my explanation is load-bearing but unsupported, and let me go find it. At the end, list my gaps in the order I should close them.",
		variants: [{
			label: "You want the explanation, not the quiz",
			prompt: "Explain this the way Feynman would: no jargon, one concrete physical analogy, and an honest statement of where the analogy breaks down. Then tell me the one thing most people get wrong about it and why the wrong version is appealing."
		}],
		why: "\"Do not supply the missing piece\" is what makes this learning rather than reading. The gap has to stay open long enough for you to notice it.",
		related: [
			"socratic-questioning",
			"audience-ladder",
			"analogical-mapping",
			"active-recall"
		],
		tags: [
			"learning",
			"understanding",
			"teaching",
			"study",
			"explanation"
		]
	},
	{
		id: "active-recall",
		name: "Active Recall & Spaced Retrieval",
		aka: [
			"retrieval practice",
			"spaced repetition",
			"testing effect",
			"flashcards"
		],
		origin: "Cognitive psychology; Ebbinghaus, Roediger & Karpicke",
		domains: ["learning"],
		intents: ["explain", "plan"],
		oneLiner: "Retrieving information from memory strengthens it far more than reviewing it does — so test yourself instead of re-reading.",
		useWhen: [
			"I read it and forgot it immediately",
			"how do I actually remember this",
			"studying for a certification",
			"onboarding onto a new codebase or domain",
			"I highlight things and it does not help"
		],
		prompt: "Turn this material into a retrieval practice schedule. First, generate questions that require me to reconstruct the idea rather than recognise it — no multiple choice, and no question whose answer is a single word I could guess from context. Mix in questions that connect two separate parts of the material, since those are the ones that build a model rather than a list. Quiz me one question at a time, wait for my answer, and tell me what I got structurally wrong rather than just correcting the fact. At the end, tell me which items to review tomorrow, in three days, and in a week.",
		why: "Specifying \"reconstruct not recognise\" is what stops the model producing recognition-level questions, which feel productive and do almost nothing for retention.",
		related: [
			"feynman-technique",
			"socratic-questioning",
			"worked-example-fading"
		],
		tags: [
			"memory",
			"study",
			"retention",
			"learning",
			"onboarding"
		]
	},
	{
		id: "analogical-mapping",
		name: "Analogical Mapping",
		aka: [
			"bridge from what I know",
			"structural analogy",
			"transfer learning"
		],
		origin: "Dedre Gentner, structure-mapping theory",
		domains: [
			"learning",
			"writing",
			"engineering"
		],
		intents: ["explain", "ideate"],
		oneLiner: "Map an unfamiliar structure onto one you already know deeply, then explicitly mark where the mapping breaks.",
		useWhen: [
			"explain this in terms of something I already understand",
			"I know X well and need to learn Y",
			"learning a new language or framework quickly",
			"the concept is abstract and will not stick",
			"I need a metaphor for a presentation"
		],
		prompt: "Explain this by analogy to [something I already know well]. Map the components one to one and show the correspondence as a table. Then — most importantly — tell me exactly where the analogy breaks down, and what mistake I would make if I pushed it too far. Rank the disanalogies by how likely I am to trip over them in practice.",
		why: "The disanalogy section is the whole value. An unqualified analogy transfers the wrong intuitions along with the right ones, and you only find out later.",
		related: [
			"feynman-technique",
			"audience-ladder",
			"first-principles"
		],
		tags: [
			"analogy",
			"metaphor",
			"learning",
			"transfer",
			"explanation"
		]
	},
	{
		id: "worked-example-fading",
		name: "Worked Examples with Fading",
		aka: [
			"faded practice",
			"scaffolded examples",
			"completion problems"
		],
		origin: "Cognitive load theory, John Sweller",
		domains: ["learning", "engineering"],
		intents: ["explain", "plan"],
		oneLiner: "Start with a fully worked example, then progressively remove steps for the learner to supply, rather than jumping from demonstration to blank page.",
		useWhen: [
			"I watched the tutorial and still cannot do it",
			"the jump from example to exercise is too big",
			"teaching someone a new technique",
			"learning a framework by doing",
			"I understand it when I read it and freeze when I try it"
		],
		prompt: "Teach me this with faded worked examples. Start with one complete example, annotating not just what each step does but why it was chosen over the alternatives. Then give me the same class of problem with the last step removed for me to complete. Then with the last two removed. Keep fading until I am doing it unaided. If I get a step wrong, do not just correct it — tell me which decision in the worked example I failed to transfer, and re-fade from there.",
		why: "Annotating why each step was chosen over alternatives is what makes the example transferable. Steps alone teach imitation; choices teach the skill.",
		related: [
			"active-recall",
			"feynman-technique",
			"few-shot-examples"
		],
		tags: [
			"teaching",
			"tutorial",
			"practice",
			"onboarding",
			"skill building"
		]
	}
];
//#endregion
//#region src/data/concepts/research.ts
var research = [
	{
		id: "fermi-estimation",
		name: "Fermi Estimation",
		aka: [
			"back of the envelope",
			"order of magnitude estimate",
			"guesstimate"
		],
		origin: "Enrico Fermi",
		domains: [
			"data",
			"strategy",
			"engineering"
		],
		intents: ["estimate"],
		oneLiner: "Decompose an unknowable quantity into factors you can each estimate within an order of magnitude, so the errors partly cancel.",
		useWhen: [
			"how big is this market really",
			"I need a rough number and have no data",
			"is this even worth investigating properly",
			"how much traffic or load should we design for",
			"sizing an opportunity from nothing"
		],
		prompt: "Do a Fermi estimate for this. Decompose it into factors, each of which you can estimate within an order of magnitude, and show the chain multiplicatively. State each input as a range rather than a point, and say where each came from — recalled figure, inference, or pure guess. Give me a low, central and high result. Then tell me which single input the answer is most sensitive to, because that is the only one worth researching properly.",
		why: "Labelling each input as recalled / inferred / guessed is what makes a model-generated estimate usable. Without it, a confidently stated fabricated constant sits in the middle of the chain and you cannot tell.",
		watchOut: "Treat the arithmetic as sound and the constants as suspect. Verify the sensitive input before acting on the number.",
		related: [
			"reference-class-forecasting",
			"expected-value",
			"sensitivity-analysis"
		],
		tags: [
			"estimation",
			"market sizing",
			"napkin math",
			"quantitative",
			"capacity planning"
		]
	},
	{
		id: "sensitivity-analysis",
		name: "Sensitivity Analysis",
		aka: [
			"what if analysis",
			"tornado chart",
			"which assumption matters"
		],
		origin: "Operations research / financial modelling",
		domains: ["data", "strategy"],
		intents: ["estimate", "critique"],
		oneLiner: "Vary each input in turn to see which ones actually move the output — most do not, and knowing which do tells you where to spend effort.",
		useWhen: [
			"my model has twenty assumptions and I do not know which matter",
			"the business case is very sensitive to something and I am not sure what",
			"which number should I go and validate",
			"the forecast changes wildly with small tweaks",
			"defending a financial model in a review"
		],
		prompt: "Run a sensitivity analysis on this model. Vary each input across its plausible range while holding the others at their central values, and rank the inputs by how much they move the final output — a tornado ranking. Separate the inputs we can actually influence from the ones we merely observe. Then identify the break-even value of the top driver: the point at which the conclusion flips, and whether that value is inside or outside the plausible range.",
		why: "The break-even framing converts an anxious model into a single testable question: is the driver above or below this number? That is usually a researchable fact.",
		related: [
			"fermi-estimation",
			"expected-value",
			"decision-matrix",
			"falsification-test"
		],
		tags: [
			"modelling",
			"assumptions",
			"financial model",
			"forecast",
			"analysis"
		]
	},
	{
		id: "triangulation",
		name: "Triangulation",
		aka: [
			"multiple methods",
			"converging evidence",
			"cross-validation of sources"
		],
		origin: "Social science methodology (Norman Denzin)",
		domains: [
			"research",
			"data",
			"product"
		],
		intents: ["critique", "diagnose"],
		oneLiner: "Approach a question by several independent methods; agreement is evidence, and disagreement is a finding in itself.",
		useWhen: [
			"the survey says one thing and the analytics say another",
			"how confident should I be in this finding",
			"I only have one source for this",
			"user interviews contradict the usage data",
			"validating a research conclusion"
		],
		prompt: "Triangulate this question. Name three genuinely independent ways to get at it — different in method and in failure mode, not just different datasets — such as behavioural data, direct qualitative evidence, and a market or comparative signal. For each, state what it would show if my hypothesis were true and what it would show if it were false. Then tell me what it means if they disagree: which source is most likely to be biased in which direction, and what the disagreement itself would reveal.",
		why: "Insisting the methods differ in failure mode, not just in dataset, is what makes triangulation real. Three sources sharing one bias is one source.",
		related: [
			"falsification-test",
			"confounders-check",
			"blind-spot-audit",
			"differential-diagnosis"
		],
		tags: [
			"research methods",
			"validation",
			"evidence",
			"user research",
			"confidence"
		]
	},
	{
		id: "confounders-check",
		name: "Confounders & Selection Bias Check",
		aka: [
			"correlation is not causation",
			"selection bias",
			"lurking variable",
			"survivorship bias"
		],
		origin: "Statistics / causal inference",
		domains: [
			"data",
			"research",
			"product"
		],
		intents: ["critique", "diagnose"],
		oneLiner: "Before believing a relationship is causal, hunt for the third variable, the selection effect, and the survivors you never observed.",
		useWhen: [
			"the A/B test shows a lift and I am suspicious",
			"users who do X retain better so should we push X",
			"is this correlation actually causal",
			"our best customers all do this thing",
			"the analysis looks too good"
		],
		prompt: "Stress-test this causal claim. Identify plausible confounders — variables that could cause both the treatment and the outcome. Check for selection effects: who ended up in each group and why, and whether that assignment is related to the outcome. Check for survivorship: whose data is missing entirely because they churned, failed, or never showed up. Check for reverse causation. For each threat you find, tell me the specific check or cut of the data that would rule it out, and rank them by how likely they are to be what is actually happening here.",
		why: "The four named threats form a checklist. Asked generically whether a finding is causal, a model hedges; asked to check four specific mechanisms, it finds the one that applies.",
		related: [
			"triangulation",
			"falsification-test",
			"cohort-analysis",
			"goodharts-law"
		],
		tags: [
			"statistics",
			"causality",
			"ab testing",
			"analytics",
			"bias"
		]
	},
	{
		id: "cohort-analysis",
		name: "Cohort & Segment Decomposition",
		aka: [
			"cohort analysis",
			"segmentation",
			"Simpson's paradox check",
			"slice the metric"
		],
		origin: "Growth analytics practice",
		domains: ["data", "product"],
		intents: ["diagnose", "structure"],
		oneLiner: "Break an aggregate metric into cohorts by join date, segment or behaviour — averages hide the mechanism and sometimes invert the sign.",
		useWhen: [
			"the metric is flat but something must be happening underneath",
			"retention looks stable and I do not believe it",
			"why did the average change",
			"growth is up but revenue is not",
			"the overall number hides two opposite trends"
		],
		prompt: "Decompose this metric into cohorts and segments. Cut it by acquisition period, by segment, and by behavioural tier, and tell me which cut is most likely to be informative given what I have described. Explicitly check for Simpson's paradox — a case where every subgroup moves one way while the aggregate moves the other, usually because the mix shifted. Distinguish mix effects (the composition changed) from rate effects (behaviour changed within groups), since they need completely different responses. Tell me which cut to look at first and what pattern would confirm each explanation.",
		why: "The mix-versus-rate distinction is the actionable output. \"Retention dropped\" has one fix; \"we acquired a worse mix\" has an entirely different one, and the aggregate looks identical.",
		related: [
			"confounders-check",
			"goodharts-law",
			"triangulation",
			"sensitivity-analysis"
		],
		tags: [
			"analytics",
			"metrics",
			"retention",
			"growth",
			"segmentation"
		]
	},
	{
		id: "literature-scan",
		name: "Structured Literature Scan",
		aka: [
			"landscape review",
			"prior art search",
			"has this been solved"
		],
		origin: "Systematic review methodology",
		domains: [
			"research",
			"engineering",
			"strategy"
		],
		intents: ["structure", "explain"],
		oneLiner: "Map what is already known on a question — the consensus, the live disagreements, and the genuine gaps — before adding to it.",
		useWhen: [
			"has someone already solved this",
			"I am new to this field and need the lay of the land",
			"what is the state of the art here",
			"I do not want to reinvent something",
			"preparing a technical evaluation of an unfamiliar area"
		],
		prompt: "Give me a structured landscape of this area. Cover: the settled consensus, the live disagreements and what each camp believes, the standard approaches with their known trade-offs, and the genuine open problems. Separate what is well-established from what is contested from what you are inferring — and mark anything you are not confident is real, including whether a named source might not exist. Then tell me the three things I should read or try first, and what question each would answer.",
		why: "Splitting settled / contested / inferred is essential when a model is the one doing the scan. Without it, a confident summary flattens a live controversy into false consensus.",
		watchOut: "Verify citations independently. Treat this as a map of the terrain, not as sourcing.",
		related: [
			"triangulation",
			"competitive-teardown",
			"analogical-mapping",
			"blind-spot-audit"
		],
		tags: [
			"research",
			"prior art",
			"state of the art",
			"literature",
			"orientation"
		]
	}
];
//#endregion
//#region src/data/concepts/strategy.ts
var strategy = [
	{
		id: "playing-to-win",
		name: "Playing To Win Cascade",
		aka: [
			"strategy choice cascade",
			"where to play how to win",
			"Lafley Martin"
		],
		origin: "A.G. Lafley & Roger Martin",
		domains: ["strategy", "product"],
		intents: ["decide", "structure"],
		oneLiner: "Strategy is five linked choices: winning aspiration, where to play, how to win, capabilities required, and management systems — each constraining the next.",
		useWhen: [
			"our strategy is a list of goals not a strategy",
			"we say we will win by being the best which is not a strategy",
			"writing an annual strategy document",
			"the team cannot explain what we do not do",
			"everything in the plan is a priority"
		],
		prompt: "Put this through the Playing To Win cascade: winning aspiration, where to play, how to win, what capabilities must be in place, and what management systems are required. Apply the hard test at each level — if the opposite of a choice would be absurd, it is not a choice, it is a platitude, and you should call it out and push me to make a real one. \"Where to play\" must name what we are explicitly not playing in. \"How to win\" must explain why we win specifically, in a way a competitor could not simply copy next quarter.",
		why: "The \"if the opposite is absurd it is not a choice\" test is the single most useful strategy heuristic, and models will apply it rigorously when asked — including to their own suggestions.",
		related: [
			"wardley-mapping",
			"okr-laddering",
			"competitive-teardown",
			"opportunity-cost"
		],
		tags: [
			"strategy",
			"positioning",
			"annual planning",
			"choices",
			"leadership"
		]
	},
	{
		id: "wardley-mapping",
		name: "Wardley Mapping",
		aka: [
			"value chain evolution map",
			"Wardley map",
			"genesis to commodity"
		],
		origin: "Simon Wardley",
		domains: ["strategy", "engineering"],
		intents: ["structure", "decide"],
		oneLiner: "Chart your value chain against evolutionary maturity — genesis, custom, product, commodity — to see what to build, buy, or outsource, and where the landscape is moving.",
		useWhen: [
			"should we build this or buy it",
			"where is our actual differentiation",
			"we are building things that should be commodities",
			"the technology landscape is shifting under us",
			"making an architecture decision with strategic implications"
		],
		prompt: "Build a Wardley map for this. Start from the user need at the top and chain down through the components required to meet it. Place each component on the evolution axis: genesis, custom-built, product or rental, or commodity or utility. Then tell me: which components are we custom-building that are actually commodities (waste), which are commodities we should be consuming, and which single component is mid-evolution — because that is where the strategic opportunity and the strategic risk both sit. Note where the map suggests we will be in two years if current evolution continues.",
		why: "The evolution axis is what makes this different from an architecture diagram. It tells you where the landscape moves, not just what exists today.",
		watchOut: "The notation takes a while to click. Ask for a plain-language walkthrough of the map alongside it the first few times.",
		related: [
			"playing-to-win",
			"theory-of-constraints",
			"competitive-teardown",
			"first-principles"
		],
		tags: [
			"strategy",
			"build vs buy",
			"architecture",
			"evolution",
			"value chain"
		]
	},
	{
		id: "okr-laddering",
		name: "OKR Laddering",
		aka: [
			"goal cascade",
			"objectives and key results",
			"line of sight"
		],
		origin: "Andy Grove at Intel; John Doerr",
		domains: [
			"strategy",
			"product",
			"career"
		],
		intents: ["structure", "plan"],
		oneLiner: "Connect a qualitative objective to measurable key results, and verify each level actually ladders to the one above rather than merely sitting under it.",
		useWhen: [
			"our OKRs are just a list of projects",
			"I cannot explain how my team goal connects to the company goal",
			"key results that are really tasks",
			"writing quarterly goals",
			"the team is busy and nothing moves the company metric"
		],
		prompt: "Ladder these OKRs. For each objective, check that it is qualitative, time-bound and genuinely motivating. For each key result, check it measures an outcome rather than the completion of an activity — if it can be satisfied by shipping something regardless of whether anything improved, rewrite it. Then verify the ladder upward: for each key result, state the causal claim that links it to the parent objective, and flag any where that link is a hope rather than a mechanism. Finish by naming which key result would be hardest to hit and whether that is because it is ambitious or because it is outside our control.",
		why: "Forcing the causal claim to be stated explicitly is what exposes goals that merely sit under a parent without moving it — the near-universal OKR failure.",
		related: [
			"playing-to-win",
			"goodharts-law",
			"opportunity-solution-tree",
			"backcasting"
		],
		tags: [
			"okr",
			"goals",
			"alignment",
			"quarterly planning",
			"metrics"
		]
	},
	{
		id: "competitive-teardown",
		name: "Competitive Teardown",
		aka: [
			"competitor analysis",
			"teardown",
			"why did they build it that way"
		],
		origin: "Product and design practice",
		domains: [
			"product",
			"design",
			"strategy"
		],
		intents: ["critique", "ideate"],
		oneLiner: "Analyse a competitor's product for the decisions behind it and the constraints those decisions reveal — not for a feature checklist.",
		useWhen: [
			"what are our competitors doing",
			"they have a feature we do not and I do not know if it matters",
			"evaluating a rival product",
			"we keep copying features without understanding why",
			"preparing a competitive positioning doc"
		],
		prompt: "Tear this competitor down by decision rather than by feature. For each significant choice they made, infer what they must believe about their user, their business model, or their constraints for that choice to be rational. Identify what they have deliberately chosen not to do and what that reveals about their strategy. Then tell me which of their choices are genuinely load-bearing versus cosmetic, and which of their constraints we do not share — because those gaps are where we can do something they cannot follow.",
		why: "Inferring beliefs from choices produces strategy; listing features produces a roadmap of catch-up work. The \"constraints we do not share\" question is where the actual opportunity is.",
		related: [
			"playing-to-win",
			"wardley-mapping",
			"kano-model",
			"blue-ocean-errc"
		],
		tags: [
			"competition",
			"market analysis",
			"positioning",
			"benchmarking",
			"product strategy"
		]
	},
	{
		id: "blue-ocean-errc",
		name: "ERRC Grid (Eliminate-Reduce-Raise-Create)",
		aka: [
			"blue ocean strategy",
			"ERRC",
			"value curve"
		],
		origin: "W. Chan Kim & Renée Mauborgne",
		domains: [
			"strategy",
			"product",
			"design"
		],
		intents: ["ideate", "decide"],
		oneLiner: "Rather than beating competitors on the industry's standard factors, decide which to eliminate, reduce, raise, and which new ones to create.",
		useWhen: [
			"we are competing on the same axes as everyone else",
			"the market is commoditised and margins are dying",
			"how do we differentiate meaningfully",
			"feature parity is a treadmill",
			"looking for a genuinely different angle"
		],
		prompt: "Build an ERRC grid for this. First list the factors the whole industry competes on and rate everyone on them — that is the current value curve. Then: which factors can we eliminate entirely that the industry takes for granted, which can we reduce well below standard, which should we raise well above standard, and which factors that the industry has never offered should we create? Be aggressive about the eliminate column, since it is the one that makes the economics work and the one everyone skips. Then state which customer segment would find the resulting curve compelling and which would defect.",
		why: "The eliminate column is where the differentiation and the margin both come from, and it is the column every team avoids. Naming that avoidance in the prompt is what gets real answers.",
		related: [
			"competitive-teardown",
			"kano-model",
			"inversion",
			"playing-to-win"
		],
		tags: [
			"differentiation",
			"innovation",
			"positioning",
			"strategy",
			"commoditisation"
		]
	}
];
//#endregion
//#region src/data/concepts/design.ts
var design = [
	{
		id: "crazy-eights",
		name: "Crazy Eights",
		aka: [
			"eight ideas in eight minutes",
			"divergent sketching",
			"quantity over quality ideation"
		],
		origin: "Google Ventures Design Sprint",
		domains: ["design", "product"],
		intents: ["ideate"],
		oneLiner: "Force out eight distinct concepts fast, so the obvious first three get out of the way and the interesting ones surface.",
		useWhen: [
			"I only have one idea and it is probably the obvious one",
			"we need more options before we commit",
			"the brainstorm produced variations of the same thing",
			"I am anchored on my first solution",
			"kicking off a design exploration"
		],
		prompt: "Do Crazy Eights on this. Give me eight genuinely distinct approaches — distinct in mechanism, not in styling. Deliberately include one that removes the feature entirely, one that solves it with no interface at all, one that solves it socially or by policy rather than technically, and one that is uncomfortably expensive. For each, one sentence on the approach and one on who it is best for. Then tell me which two are worth developing further and what makes them different from the safe default I would otherwise have picked.",
		why: "The mandated categories — remove it, no interface, non-technical, expensive — are what break anchoring. Asked for eight ideas flat, a model gives you one idea with eight coats of paint.",
		related: [
			"how-might-we",
			"blue-ocean-errc",
			"inversion",
			"design-critique"
		],
		tags: [
			"ideation",
			"brainstorming",
			"design sprint",
			"divergent thinking",
			"options"
		]
	},
	{
		id: "user-journey-mapping",
		name: "User Journey Mapping",
		aka: [
			"journey map",
			"experience map",
			"service blueprint"
		],
		origin: "Service design practice",
		domains: ["design", "product"],
		intents: ["structure", "diagnose"],
		oneLiner: "Lay out the user's full path stage by stage with their actions, thoughts and emotions, so the gaps between the steps become visible.",
		useWhen: [
			"users drop off somewhere and I do not know where",
			"the feature works but the experience is bad",
			"we optimise screens and never the whole flow",
			"onboarding feels broken",
			"handoffs between teams create a disjointed experience"
		],
		prompt: "Map the user journey for this. For each stage give me: what the user is doing, what they are thinking, what they are feeling, which touchpoints they hit, and — behind the line of visibility — what our systems and teams are doing. Pay particular attention to the transitions between stages and to the waiting periods, because that is where journeys break rather than within a single well-designed screen. Then mark the three highest-emotion moments and tell me which one, if fixed, would most change their overall impression.",
		why: "Explicitly directing attention at transitions and waits is what makes this different from a flow diagram. Individual screens are usually fine; the seams are not.",
		related: [
			"jobs-to-be-done",
			"heuristic-evaluation",
			"root-cause-fishbone",
			"cohort-analysis"
		],
		tags: [
			"ux",
			"journey",
			"onboarding",
			"service design",
			"drop off"
		]
	},
	{
		id: "heuristic-evaluation",
		name: "Heuristic Evaluation",
		aka: [
			"Nielsen's heuristics",
			"usability heuristics",
			"expert review"
		],
		origin: "Jakob Nielsen & Rolf Molich, 1990",
		domains: ["design"],
		intents: ["critique"],
		oneLiner: "Assess an interface against ten established usability principles, giving you specific defensible findings rather than opinions.",
		useWhen: [
			"is this interface actually usable",
			"I need a design review and have no users to test with",
			"the design feels wrong and I cannot articulate why",
			"reviewing a flow before it ships",
			"justifying UX changes to stakeholders"
		],
		prompt: "Run a heuristic evaluation using Nielsen's ten heuristics: system status visibility, match to the real world, user control and freedom, consistency and standards, error prevention, recognition over recall, flexibility and efficiency, aesthetic and minimalist design, error recovery, and help and documentation. For each violation: the heuristic breached, the specific element, a severity from 0 to 4, and a concrete fix. Sort by severity. Then say which heuristics this design handles well, so I know what not to break while fixing the rest.",
		why: "A named heuristic converts \"this feels off\" into a finding a stakeholder cannot wave away. The what-not-to-break list prevents the usual regression from a redesign.",
		watchOut: "Heuristic evaluation finds usability problems, not desirability or value problems. It cannot tell you the feature is unwanted.",
		related: [
			"design-critique",
			"accessibility-audit",
			"user-journey-mapping",
			"red-teaming"
		],
		tags: [
			"usability",
			"ux review",
			"nielsen",
			"interface",
			"audit"
		]
	},
	{
		id: "accessibility-audit",
		name: "Accessibility Audit (WCAG)",
		aka: [
			"a11y review",
			"WCAG audit",
			"screen reader check"
		],
		origin: "W3C Web Content Accessibility Guidelines",
		domains: ["design", "engineering"],
		intents: ["critique"],
		oneLiner: "Check an interface against perceivable, operable, understandable and robust criteria, prioritising by who is actually blocked.",
		useWhen: [
			"is this accessible",
			"we need to meet WCAG AA",
			"keyboard navigation is probably broken",
			"colour contrast and screen reader support",
			"accessibility came up in review and we have no plan"
		],
		prompt: "Audit this against WCAG 2.2 AA. Organise findings under Perceivable, Operable, Understandable and Robust. For each issue: the success criterion, what breaks, who it blocks, and the specific code or design fix. Prioritise by whether it fully blocks a user from completing the task versus merely degrading the experience — a missing label on the submit button outranks a decorative contrast issue. Include the things automated checkers miss: focus order, focus visibility, meaningful alt text versus filler, live region announcements, and whether the keyboard path is a reasonable journey rather than merely possible.",
		why: "Naming what automated tools miss is the point. Anything an axe scan catches you did not need a prompt for; the judgement calls are the gap.",
		related: [
			"heuristic-evaluation",
			"design-critique",
			"plain-language"
		],
		tags: [
			"accessibility",
			"a11y",
			"wcag",
			"inclusive design",
			"compliance"
		]
	},
	{
		id: "information-architecture",
		name: "Information Architecture / Card Sort",
		aka: [
			"IA",
			"card sorting",
			"taxonomy design",
			"navigation structure"
		],
		origin: "Library science; Rosenfeld & Morville",
		domains: ["design", "writing"],
		intents: ["structure"],
		oneLiner: "Group and label content the way users think about it rather than the way the organisation is structured.",
		useWhen: [
			"nobody can find anything in our docs",
			"the navigation reflects our org chart",
			"we have too many menu items",
			"organising a knowledge base or settings page",
			"users ask for features that already exist"
		],
		prompt: "Design the information architecture for this. Propose a grouping based on how users would look for things, not on how we are organised internally, and give each group a label using the user's vocabulary rather than ours. Then stress-test it: for each of these tasks [list them], trace the path a first-time user would take and mark where they would hesitate between two plausible groups. Flag any item that legitimately belongs in two places, and say whether to duplicate it, cross-link it, or restructure. Aim for breadth over depth — more top-level items beats more clicks.",
		why: "Tracing specific tasks through the structure is what tests an IA. A taxonomy always looks coherent to the person who wrote it; only the hesitation points reveal it is wrong.",
		related: [
			"user-journey-mapping",
			"pyramid-principle",
			"plain-language",
			"heuristic-evaluation"
		],
		tags: [
			"navigation",
			"taxonomy",
			"documentation",
			"ux",
			"findability"
		]
	}
];
//#endregion
//#region src/data/concepts/steering.ts
var steering = [
	{
		id: "interview-me-first",
		name: "Interview Me First",
		aka: [
			"elicitation before generation",
			"ask before you answer",
			"requirements interview"
		],
		origin: "Prompting practice",
		domains: ["meta"],
		intents: ["steer", "reframe"],
		oneLiner: "Make the model interrogate you before it produces anything, so it works from your actual context rather than a plausible average one.",
		useWhen: [
			"the answer is generic and could apply to anyone",
			"it does not know enough about my situation",
			"I keep having to correct the output",
			"I do not know how to describe what I want",
			"the first draft is always wrong in the same ways"
		],
		prompt: "Before you write anything, interview me. Ask the questions whose answers would most change what you produce — the ones where a different answer means a different artefact, not the ones that merely add colour. One question at a time, and stop as soon as further questions would not change the output. Then tell me what you have assumed about anything I did not cover, before you start.",
		variants: [{
			label: "When you are short on time",
			prompt: "Ask me the three questions whose answers would most change your output, then proceed with explicit assumptions for everything else. Mark the assumptions clearly at the top so I can correct the ones you got wrong."
		}],
		why: "Generic output is almost always an underspecified prompt rather than a model limitation. Handing the elicitation to the model is more reliable than trying to anticipate what it needs, because it knows which of its own degrees of freedom are open.",
		watchOut: "Without the \"stop when questions stop mattering\" clause you will get interrogated for fifteen turns.",
		related: [
			"xy-problem",
			"output-contract",
			"context-priming",
			"socratic-questioning"
		],
		tags: [
			"prompting",
			"context",
			"generic output",
			"requirements",
			"ai"
		]
	},
	{
		id: "output-contract",
		name: "Output Contract",
		aka: [
			"schema first prompting",
			"specify the format",
			"response contract"
		],
		origin: "Prompting practice; structured output",
		domains: ["meta", "engineering"],
		intents: ["steer", "structure"],
		oneLiner: "Specify the exact shape of the answer — sections, field types, length, ordering — before asking for the content.",
		useWhen: [
			"the output is right but in an unusable format",
			"I need consistent structure across many runs",
			"it writes essays when I want a table",
			"I am parsing the output programmatically",
			"the response is too long every time"
		],
		prompt: "Respond in exactly this structure and nothing else: [define your sections, fields and types]. Rules: every field is required; write \"unknown\" rather than guessing; no preamble, no summary, no closing offer to help. If the content does not fit the structure, say so in a field called \"contract_violation\" and explain why rather than silently reshaping it.",
		variants: [{
			label: "When you keep getting essays",
			prompt: "Answer in at most five bullets of under 20 words each. No introduction, no conclusion, no restating my question. If that is genuinely not enough space for a correct answer, give me the five bullets plus one sentence explaining what is being lost."
		}],
		why: "The contract_violation escape hatch is what stops the model silently mangling content to fit a shape you specified badly — which is otherwise the failure mode of rigid formats.",
		related: [
			"constraint-stacking",
			"few-shot-examples",
			"rubric-grading",
			"definition-of-done"
		],
		tags: [
			"prompting",
			"format",
			"structured output",
			"json",
			"consistency"
		]
	},
	{
		id: "role-and-rubric",
		name: "Role and Rubric Priming",
		aka: [
			"persona prompting",
			"act as",
			"expert framing with criteria"
		],
		origin: "Prompting practice",
		domains: ["meta"],
		intents: ["steer"],
		oneLiner: "Assign a specific expert perspective *and* the criteria that expert would judge by — the role alone changes tone, the rubric changes substance.",
		useWhen: [
			"the answer is surface level",
			"act as a prompt did not really help",
			"I want the level of a senior specialist",
			"the response reads like a blog post not an expert",
			"I need domain-specific judgement"
		],
		prompt: "Take the role of [specific expert — not \"an expert\" but e.g. a staff SRE who has run this class of system at scale for a decade]. Before answering, state the four criteria someone in that role would judge this by, and what separates excellent from merely adequate on each. Then answer, and score your own answer against those criteria, calling out where it falls short. Use the vocabulary and the standards of that role, including the trade-offs a generalist would not know to raise.",
		why: "A role by itself mostly changes register. Making the model derive the rubric first — and then grade itself against it — is what changes the substance, because it establishes a standard before it commits to an answer.",
		watchOut: "A role does not add knowledge the model lacks. It focuses what it has, and it can also make a confident answer sound more authoritative than it deserves.",
		related: [
			"rubric-grading",
			"self-critique-loop",
			"output-contract",
			"red-teaming"
		],
		tags: [
			"prompting",
			"persona",
			"expertise",
			"depth",
			"ai"
		]
	},
	{
		id: "self-critique-loop",
		name: "Self-Critique Loop",
		aka: [
			"reflexion",
			"draft critique revise",
			"second pass"
		],
		origin: "Reflexion (Shinn et al.); standard editing practice",
		domains: ["meta", "writing"],
		intents: ["steer", "critique"],
		oneLiner: "Have the model draft, then critique its own draft against explicit criteria, then revise — as three separate steps in one turn.",
		useWhen: [
			"the first draft is always mediocre",
			"I keep asking it to try again",
			"the output has obvious flaws it should have caught",
			"I want a higher quality answer without more back and forth",
			"important document and one shot at it"
		],
		prompt: "Do this in three labelled passes. Pass 1: write the draft. Pass 2: critique your own draft as a hostile expert reviewer would — be specific about weaknesses and name the three biggest, and do not merely praise it. Pass 3: rewrite, fixing what pass 2 identified. Show all three passes. In pass 2, if you cannot find three real weaknesses, say so explicitly rather than inventing filler criticism.",
		why: "Making the passes visible and labelled is what forces genuine revision. Asked to \"write a really good X\", a model produces one draft; asked to critique and revise, it produces measurably different output because the critique is in context when it rewrites.",
		watchOut: "Self-critique catches structural and completeness problems well and factual errors poorly — it cannot check what it does not know.",
		related: [
			"role-and-rubric",
			"rubric-grading",
			"red-teaming",
			"sample-and-compare"
		],
		tags: [
			"prompting",
			"quality",
			"revision",
			"drafting",
			"ai"
		]
	},
	{
		id: "sample-and-compare",
		name: "Sample and Compare",
		aka: [
			"self consistency",
			"generate three then pick",
			"parallel drafts"
		],
		origin: "Self-consistency decoding (Wang et al.)",
		domains: ["meta"],
		intents: ["steer", "ideate"],
		oneLiner: "Generate several independent attempts before evaluating any of them, then synthesise — rather than iterating on the first one.",
		useWhen: [
			"the first answer might be a local optimum",
			"I want to see the range of possible approaches",
			"the answer varies a lot between runs",
			"iterating on the first draft is not getting anywhere",
			"high stakes answer and I want confidence"
		],
		prompt: "Generate three genuinely different approaches to this before evaluating any of them — different in strategy, not in wording. Do not let the first influence the others; if approach two is a variation on approach one, discard it and find a real alternative. Then compare them against the criteria that matter here, name the strongest, and build a final answer from it while grafting in the best specific idea from each of the others.",
		why: "Committing to \"no evaluation until all three exist\" is what prevents anchoring. The graft step is what makes this beat simply picking a winner.",
		related: [
			"self-critique-loop",
			"crazy-eights",
			"decision-matrix",
			"role-and-rubric"
		],
		tags: [
			"prompting",
			"variance",
			"options",
			"quality",
			"ai"
		]
	},
	{
		id: "constraint-stacking",
		name: "Constraint Stacking",
		aka: [
			"add constraints to improve creativity",
			"negative constraints",
			"forbidden list"
		],
		origin: "Creative practice; applied to prompting",
		domains: [
			"meta",
			"writing",
			"design"
		],
		intents: ["steer", "ideate"],
		oneLiner: "Add explicit prohibitions and hard limits — the constraints are what push output off the obvious default path.",
		useWhen: [
			"everything it produces sounds the same",
			"the output is bland and generic",
			"it keeps using the same words and structures",
			"I want something more surprising",
			"the ideas are all safe"
		],
		prompt: "Do this under hard constraints. Forbidden: [the specific words, structures, framings or clichés you keep seeing]. Required: [a specific form, length, or perspective]. Additionally, the answer must not use the most obvious approach, must fit in [limit], and must be defensible to a skeptical expert. If a constraint makes the task impossible rather than merely harder, tell me which one and why instead of quietly breaking it.",
		why: "Bland output is the model taking the highest-probability path. Constraints raise the cost of that path, and negative constraints — a named forbidden list — do more work than positive instructions.",
		related: [
			"output-contract",
			"crazy-eights",
			"negative-space-prompting",
			"sample-and-compare"
		],
		tags: [
			"prompting",
			"creativity",
			"generic output",
			"voice",
			"constraints"
		]
	},
	{
		id: "negative-space-prompting",
		name: "Negative Space Prompting",
		aka: [
			"tell it what not to do",
			"scope exclusion",
			"out of scope list"
		],
		origin: "Prompting practice",
		domains: ["meta"],
		intents: ["steer"],
		oneLiner: "State explicitly what is out of scope, so the model spends its effort on the part you actually care about.",
		useWhen: [
			"it keeps solving a problem I did not ask about",
			"the answer covers everything and commits to nothing",
			"it keeps adding caveats and alternatives I do not want",
			"it rewrites things I asked it to leave alone",
			"too much unnecessary preamble"
		],
		prompt: "Here is what is explicitly out of scope: [list]. Do not address, mention, or hedge about any of it — assume it is handled. Do not restate my question, do not summarise what you are about to do, and do not offer follow-up help at the end. Focus entirely on [the specific thing]. If something out of scope genuinely blocks the in-scope work, say so in one line and stop rather than working around it.",
		why: "Models cover the whole plausible space by default because that is what looks helpful. Explicit exclusions convert breadth into depth, and the \"say so and stop\" clause keeps you from losing a genuine blocker.",
		related: [
			"constraint-stacking",
			"output-contract",
			"moscow",
			"context-priming"
		],
		tags: [
			"prompting",
			"scope",
			"focus",
			"concise",
			"ai"
		]
	},
	{
		id: "context-priming",
		name: "Context Priming",
		aka: [
			"orient before asking",
			"repo tour",
			"load the context first"
		],
		origin: "Agentic coding practice",
		domains: ["meta", "engineering"],
		intents: ["steer", "explain"],
		oneLiner: "Have the model build and state its understanding of the terrain before you ask it to change anything.",
		useWhen: [
			"it made changes that do not fit our conventions",
			"the agent is editing the wrong files",
			"it does not understand our codebase",
			"starting work in an unfamiliar repository",
			"the suggestions ignore how we actually do things"
		],
		prompt: "Before making any changes, orient yourself and report back. Tell me: the architecture in five sentences, the conventions this codebase actually follows (as evidenced by the code, not by any style guide), where the code relevant to my task lives, what the existing tests cover, and what surprised you. Then state what you would change and why, and wait for me to confirm before touching anything.",
		why: "\"Conventions as evidenced by the code, not the style guide\" is the key phrase — it produces the real conventions rather than the aspirational ones, and it is what makes generated code stop looking foreign.",
		related: [
			"interview-me-first",
			"negative-space-prompting",
			"chain-of-thought",
			"literature-scan"
		],
		tags: [
			"agents",
			"coding",
			"codebase",
			"conventions",
			"ai"
		]
	},
	{
		id: "chain-of-thought",
		name: "Reason Before Answering",
		aka: [
			"chain of thought",
			"think step by step",
			"show your working"
		],
		origin: "Wei et al., 2022",
		domains: ["meta"],
		intents: ["steer"],
		oneLiner: "Make the model work through the reasoning before committing to a conclusion, so the conclusion follows from the work rather than the work justifying the conclusion.",
		useWhen: [
			"it gets multi-step problems wrong",
			"the answer is confident and incorrect",
			"I cannot tell how it reached that conclusion",
			"complex calculation or logic puzzle",
			"I need to check its reasoning"
		],
		prompt: "Work through this step by step before giving me an answer. Show the intermediate reasoning, including anything you rule out and why. State any assumption at the point you make it, not retroactively. Give the conclusion only at the end — and if the reasoning does not actually support a confident conclusion, say that instead of producing one anyway.",
		why: "The last clause is the part people leave off. Without it you get careful reasoning followed by a confident answer regardless of whether the reasoning supported one.",
		watchOut: "Reasoning models already do this internally. The value here is making the working *visible and checkable*, not making it happen.",
		related: [
			"self-critique-loop",
			"rubric-grading",
			"sample-and-compare",
			"hypothesis-driven-debugging"
		],
		tags: [
			"prompting",
			"reasoning",
			"accuracy",
			"transparency",
			"ai"
		]
	},
	{
		id: "few-shot-examples",
		name: "Few-Shot Examples",
		aka: [
			"show dont tell prompting",
			"exemplars",
			"match this style"
		],
		origin: "GPT-3 paper (Brown et al.)",
		domains: ["meta", "writing"],
		intents: ["steer"],
		oneLiner: "Show two or three examples of exactly what you want instead of describing it — demonstration transfers what description cannot.",
		useWhen: [
			"I cannot describe the style I want",
			"it does not match our house voice",
			"I keep explaining the format and it keeps getting it wrong",
			"I need consistent output across many items",
			"the tone is close but not right"
		],
		prompt: "Here are three examples of what good looks like: [paste them]. And here is one that is subtly wrong: [paste it]. First, tell me what pattern you infer from the good examples and what specifically makes the fourth one wrong — I want to check you inferred the right rule before you use it. Then produce [your item] following that pattern.",
		why: "The near-miss example plus the check-the-inferred-rule step is what makes this reliable. Positive examples alone are ambiguous — several rules explain them, and the model may pick the wrong one silently.",
		related: [
			"worked-example-fading",
			"output-contract",
			"constraint-stacking",
			"rubric-grading"
		],
		tags: [
			"prompting",
			"style",
			"voice",
			"consistency",
			"examples"
		]
	},
	{
		id: "rubric-grading",
		name: "Rubric-Based Grading",
		aka: [
			"score against criteria",
			"evaluation rubric",
			"grade this"
		],
		origin: "Educational assessment; used in LLM evaluation",
		domains: [
			"meta",
			"writing",
			"learning"
		],
		intents: ["critique", "steer"],
		oneLiner: "Define the criteria and what each score level means, then grade against them — turning \"is this good?\" into something answerable.",
		useWhen: [
			"is this good enough to send",
			"I need consistent evaluation across many items",
			"reviewing candidates or submissions fairly",
			"the feedback I get is vague",
			"I want to know specifically what to improve"
		],
		prompt: "Grade this against a rubric. First propose the criteria that actually matter for this artefact and its purpose, with a concrete description of what a 1, 3 and 5 look like on each — descriptions specific enough that two different reviewers would agree. Let me adjust the rubric before you score. Then score with a one-line justification and a quote or specific reference as evidence for each. Finish with the single highest-leverage change: the one edit that would move the most criteria at once.",
		why: "Defining the score anchors before seeing the artefact is what prevents the rubric from being reverse-engineered to fit the impression the model already formed.",
		related: [
			"role-and-rubric",
			"self-critique-loop",
			"design-critique",
			"output-contract"
		],
		tags: [
			"evaluation",
			"feedback",
			"quality bar",
			"assessment",
			"prompting"
		]
	},
	{
		id: "progressive-disclosure",
		name: "Progressive Disclosure",
		aka: [
			"chunked delivery",
			"outline first",
			"section by section"
		],
		origin: "Interaction design principle, applied to prompting",
		domains: ["meta", "writing"],
		intents: ["steer", "plan"],
		oneLiner: "Get an outline and agree on it before any drafting, then take delivery one section at a time.",
		useWhen: [
			"it produced 3000 words and the structure was wrong",
			"long document and I do not want to waste a full generation",
			"I want to steer as it goes",
			"complex output where early mistakes compound",
			"the answer is too long to check properly"
		],
		prompt: "Do not write the full thing yet. First give me an outline: sections, one line each on what goes in them, and the approximate length of each. Wait for my approval, and flag any section where you think my structure is wrong before we start. Then write one section at a time, stopping after each so I can redirect. Carry forward what I correct in earlier sections without me repeating it.",
		why: "A wrong outline costs one exchange to fix; a wrong 3000-word draft costs a regeneration and usually anchors the second attempt on the first one's mistakes.",
		related: [
			"output-contract",
			"interview-me-first",
			"negative-space-prompting",
			"work-breakdown-structure"
		],
		tags: [
			"prompting",
			"long form",
			"writing",
			"iteration",
			"control"
		]
	}
];
//#endregion
//#region src/data/concepts/index.ts
var CONCEPTS = [
	...framing,
	...architecture,
	...security,
	...decisions,
	...prioritization,
	...critique,
	...diagnosis,
	...planning,
	...communication,
	...learning,
	...research,
	...strategy,
	...design,
	...steering
];
var CONCEPTS_BY_ID = new Map(CONCEPTS.map((c) => [c.id, c]));
function getConcept(id) {
	return CONCEPTS_BY_ID.get(id);
}
//#endregion
//#region src/data/types.ts
var DOMAIN_LABELS = {
	product: "Product",
	engineering: "Engineering",
	security: "Security & privacy",
	design: "Design & UX",
	writing: "Writing",
	research: "Research",
	strategy: "Strategy",
	data: "Data & analysis",
	learning: "Learning",
	career: "People & career",
	meta: "Working with AI"
};
var INTENT_LABELS = {
	reframe: "Reframe the problem",
	ideate: "Generate more options",
	decide: "Make a decision",
	prioritize: "Prioritise / sequence",
	critique: "Pressure-test my thinking",
	plan: "Plan the work",
	diagnose: "Find out what is wrong",
	explain: "Understand or teach it",
	communicate: "Write it up persuasively",
	structure: "Organise a mess",
	estimate: "Size or forecast it",
	steer: "Control how the AI works"
};
Object.keys(DOMAIN_LABELS);
Object.keys(INTENT_LABELS);
//#endregion
//#region src/lib/compose.ts
/** The one line of scaffolding the composed prompt is allowed. */
var INJECTION_HEADER = "Apply these named techniques as you do it:";
/**
* The user's text with the chosen magic words appended, ready to paste into
* Claude. Given nothing to inject it returns the text untouched, which is the
* correct behaviour rather than a degenerate one: a request that already says
* what it wants should be sent as written.
*/
function composePrompt(input, picks) {
	const original = input.trim();
	if (!picks.length) return original;
	return `${original}\n\n${INJECTION_HEADER}\n\n${picks.map((p) => `**${p.concept.name}.** ${p.concept.prompt}`).join("\n\n")}`;
}
//#endregion
//#region src/lib/embeddings.ts
/**
* Dense semantic vectors for the corpus, learned from the corpus itself.
*
* BM25 can only match words that are actually there. Someone typing "nobody
* knows who gets the final say" shares no useful token with a concept written
* about "decision rights" and "accountable owner", so lexical retrieval scores
* it at zero no matter how well the fields are weighted. The hand-maintained
* expansion table in `text.ts` patches the gap one synonym at a time, which
* only ever covers the phrasings somebody thought to write down.
*
* This module closes the rest of it the way retrieval did before hosted models:
* latent semantic analysis. Build the term-document matrix, take its truncated
* SVD, and both documents and queries become vectors in a few dozen dimensions
* where words that keep company across the corpus end up pointing the same way.
* "Rotate", "credential" and "leaked" collapse onto one direction because the
* secrets entry uses all three; a query with only one of them still lands near
* that direction.
*
* Why not a real embedding model: the site has no backend and no API key, and
* the CSP is `connect-src 'self'`, so there is nowhere to send a query to be
* embedded and nothing to download a model from. A transformer would also be
* tens of megabytes for a corpus of 119 documents. LSA fits in a few hundred
* lines, runs in milliseconds, stays entirely in the browser, and — unlike a
* pretrained model — its notion of similarity is derived from this vocabulary
* rather than from the open web.
*
* The maths, briefly. `A` is terms x documents, entries log-damped tf-idf,
* columns L2-normalised. `A = U S V'`. Documents are far fewer than terms, so
* rather than decomposing `A` we decompose the small document gram matrix
* `G = A'A = V S^2 V'`, which is symmetric positive semi-definite and only
* 119x119. Jacobi rotations give `V` and `S` exactly, and `U = A V S^-1`
* recovers the term vectors. Both documents and queries are then projected
* onto `U` — `A'U = V S` for documents, `q'U` for a query — so the two live in
* the same basis and cosine between them means something.
*/
/** Latent dimensions to keep. Past ~50 the tail is corpus noise, not meaning. */
var MAX_DIMS = 48;
/** Eigenvalues below this fraction of the largest are numerical dust. */
var SPECTRUM_FLOOR = 1e-6;
/** Cyclic Jacobi converges well inside this for a matrix of our size. */
var MAX_SWEEPS = 60;
/** Inverse document frequency, matched to the BM25 index so the two agree. */
function idf(df, n) {
	return Math.log(1 + (n - df + .5) / (df + .5));
}
/**
* Symmetric eigendecomposition by cyclic Jacobi rotation.
*
* Chosen over the usual randomised range-finder because it is deterministic:
* identical input gives bit-identical output, so rankings do not drift between
* loads and the tests can assert on them. At n = 119 it costs a few
* milliseconds, which buys nothing back by being approximate.
*
* `a` is mutated. Returns eigenvalues alongside eigenvectors held as columns
* of a row-major n x n matrix.
*/
function jacobiEigen(a, n) {
	const v = new Float64Array(n * n);
	for (let i = 0; i < n; i++) v[i * n + i] = 1;
	for (let sweep = 0; sweep < MAX_SWEEPS; sweep++) {
		let off = 0;
		for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) off += a[p * n + q] * a[p * n + q];
		if (off < 1e-14) break;
		for (let p = 0; p < n - 1; p++) for (let q = p + 1; q < n; q++) {
			const apq = a[p * n + q];
			if (Math.abs(apq) < 1e-15) continue;
			const theta = (a[q * n + q] - a[p * n + p]) / (2 * apq);
			const t = (theta >= 0 ? 1 : -1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
			const c = 1 / Math.sqrt(t * t + 1);
			const s = t * c;
			a[p * n + p] -= t * apq;
			a[q * n + q] += t * apq;
			a[p * n + q] = 0;
			a[q * n + p] = 0;
			for (let k = 0; k < n; k++) {
				if (k === p || k === q) continue;
				const akp = a[k * n + p];
				const akq = a[k * n + q];
				const np = c * akp - s * akq;
				const nq = s * akp + c * akq;
				a[k * n + p] = np;
				a[p * n + k] = np;
				a[k * n + q] = nq;
				a[q * n + k] = nq;
			}
			for (let k = 0; k < n; k++) {
				const vkp = v[k * n + p];
				const vkq = v[k * n + q];
				v[k * n + p] = c * vkp - s * vkq;
				v[k * n + q] = s * vkp + c * vkq;
			}
		}
	}
	const values = new Float64Array(n);
	for (let i = 0; i < n; i++) values[i] = a[i * n + i];
	return {
		values,
		vectors: v
	};
}
function l2Normalise(vec) {
	let sum = 0;
	for (let i = 0; i < vec.length; i++) sum += vec[i] * vec[i];
	const norm = Math.sqrt(sum);
	if (norm > 0) for (let i = 0; i < vec.length; i++) vec[i] /= norm;
	return vec;
}
/**
* Build the latent space from per-document term weights — the same weighted
* frequencies the BM25 index already holds, so the two views of a document
* cannot drift apart.
*/
function buildSemanticSpace(documents, maxDims = MAX_DIMS) {
	const n = documents.length;
	const postings = /* @__PURE__ */ new Map();
	for (let i = 0; i < n; i++) for (const [term, tf] of documents[i]) {
		let list = postings.get(term);
		if (!list) postings.set(term, list = []);
		list.push({
			doc: i,
			weight: 1 + Math.log(tf)
		});
	}
	const vocabulary = [...postings.keys()];
	for (const term of vocabulary) {
		const list = postings.get(term);
		const weight = idf(list.length, n);
		for (const p of list) p.weight *= weight;
	}
	const columnNorms = new Float64Array(n);
	for (const list of postings.values()) for (const p of list) columnNorms[p.doc] += p.weight * p.weight;
	for (let i = 0; i < n; i++) columnNorms[i] = Math.sqrt(columnNorms[i]) || 1;
	for (const list of postings.values()) for (const p of list) p.weight /= columnNorms[p.doc];
	const gram = new Float64Array(n * n);
	for (const list of postings.values()) for (let x = 0; x < list.length; x++) {
		const a = list[x];
		gram[a.doc * n + a.doc] += a.weight * a.weight;
		for (let y = x + 1; y < list.length; y++) {
			const b = list[y];
			const product = a.weight * b.weight;
			gram[a.doc * n + b.doc] += product;
			gram[b.doc * n + a.doc] += product;
		}
	}
	const { values, vectors } = jacobiEigen(gram, n);
	const order = [...values.keys()].sort((a, b) => values[b] - values[a]);
	const largest = values[order[0]] ?? 0;
	const kept = order.filter((j) => values[j] > largest * SPECTRUM_FLOOR).slice(0, Math.min(maxDims, n));
	const dims = kept.length;
	const sigma = new Float64Array(dims);
	for (let j = 0; j < dims; j++) sigma[j] = Math.sqrt(Math.max(values[kept[j]], 0));
	const docVectors = [];
	for (let i = 0; i < n; i++) {
		const vec = new Float64Array(dims);
		for (let j = 0; j < dims; j++) vec[j] = vectors[i * n + kept[j]] * sigma[j];
		docVectors.push(l2Normalise(vec));
	}
	const termVectors = /* @__PURE__ */ new Map();
	for (const [term, list] of postings) {
		const vec = new Float64Array(dims);
		for (const p of list) for (let j = 0; j < dims; j++) vec[j] += p.weight * vectors[p.doc * n + kept[j]];
		for (let j = 0; j < dims; j++) vec[j] /= sigma[j] || 1;
		termVectors.set(term, vec);
	}
	const termIdf = /* @__PURE__ */ new Map();
	for (const [term, list] of postings) termIdf.set(term, idf(list.length, n));
	return {
		dims,
		size: n,
		fold(terms) {
			const counts = /* @__PURE__ */ new Map();
			for (const term of terms) {
				if (!termVectors.has(term)) continue;
				counts.set(term, (counts.get(term) ?? 0) + 1);
			}
			if (!counts.size) return null;
			const vec = new Float64Array(dims);
			for (const [term, count] of counts) {
				const termVector = termVectors.get(term);
				const weight = (1 + Math.log(count)) * (termIdf.get(term) ?? 0);
				for (let j = 0; j < dims; j++) vec[j] += weight * termVector[j];
			}
			let sum = 0;
			for (let j = 0; j < dims; j++) sum += vec[j] * vec[j];
			if (sum <= 0) return null;
			return l2Normalise(vec);
		},
		similarity(vector, i) {
			const doc = docVectors[i];
			if (!doc) return 0;
			let dot = 0;
			for (let j = 0; j < dims; j++) dot += vector[j] * doc[j];
			return dot;
		},
		neighbours(term, k = 8) {
			const target = termVectors.get(term);
			if (!target) return [];
			const targetNorm = Math.sqrt(target.reduce((s, x) => s + x * x, 0));
			if (!targetNorm) return [];
			const out = [];
			for (const [other, vec] of termVectors) {
				if (other === term) continue;
				let dot = 0;
				let norm = 0;
				for (let j = 0; j < dims; j++) {
					dot += target[j] * vec[j];
					norm += vec[j] * vec[j];
				}
				norm = Math.sqrt(norm);
				if (!norm) continue;
				out.push({
					term: other,
					score: dot / (targetNorm * norm)
				});
			}
			return out.sort((a, b) => b.score - a.score).slice(0, k);
		}
	};
}
//#endregion
//#region src/lib/text.ts
/**
* Tokenisation, normalisation and query expansion.
*
* The corpus is written in expert vocabulary; people describe their problems in
* ordinary words. Almost all of the retrieval quality lives in bridging that gap,
* which is what EXPANSIONS below is for.
*/
var STOPWORDS = /* @__PURE__ */ new Set([
	"a",
	"about",
	"am",
	"an",
	"and",
	"any",
	"are",
	"as",
	"at",
	"be",
	"been",
	"being",
	"but",
	"by",
	"can",
	"could",
	"did",
	"do",
	"does",
	"doing",
	"done",
	"for",
	"from",
	"get",
	"getting",
	"had",
	"has",
	"have",
	"having",
	"he",
	"her",
	"here",
	"him",
	"his",
	"how",
	"i",
	"if",
	"in",
	"into",
	"is",
	"it",
	"its",
	"just",
	"me",
	"my",
	"of",
	"on",
	"or",
	"our",
	"out",
	"over",
	"own",
	"she",
	"so",
	"some",
	"such",
	"than",
	"that",
	"the",
	"their",
	"them",
	"then",
	"there",
	"these",
	"they",
	"this",
	"those",
	"to",
	"too",
	"up",
	"us",
	"very",
	"was",
	"we",
	"were",
	"what",
	"when",
	"where",
	"which",
	"while",
	"who",
	"will",
	"with",
	"would",
	"you",
	"your"
]);
/**
* British/American and other spelling variants, normalised to one form so a
* search for "prioritise" hits a corpus entry written as "prioritize".
*/
var SPELLING = {
	prioritise: "prioritize",
	prioritisation: "prioritization",
	prioritised: "prioritized",
	organise: "organize",
	organisation: "organization",
	organised: "organized",
	optimise: "optimize",
	optimisation: "optimization",
	optimised: "optimized",
	summarise: "summarize",
	categorise: "categorize",
	minimise: "minimize",
	maximise: "maximize",
	realise: "realize",
	recognise: "recognize",
	emphasise: "emphasize",
	standardise: "standardize",
	visualise: "visualize",
	generalise: "generalize",
	specialise: "specialize",
	utilise: "utilize",
	analyse: "analyze",
	analysed: "analyzed",
	analysing: "analyzing",
	behaviour: "behavior",
	behavioural: "behavioral",
	colour: "color",
	favour: "favor",
	honour: "honor",
	labour: "labor",
	rumour: "rumor",
	humour: "humor",
	endeavour: "endeavor",
	defence: "defense",
	licence: "license",
	practise: "practice",
	judgement: "judgment",
	modelling: "modeling",
	modelled: "modeled",
	cancelled: "canceled",
	travelling: "traveling"
};
/**
* Colloquial term -> corpus vocabulary. Expansion terms are scored at a reduced
* weight so a literal match always outranks an inferred one.
*
* Keys are ordinary words, not stems. They used to be stems, written by hand to
* match what the stemmer produces — and fourteen of them were wrong, so they sat
* in the table looking maintained while matching nothing. `estim` never fired
* because "estimate" stems to `estimat`; `hallucin` never fired because
* "hallucinating" stems to `hallucinat`. The keys are now stemmed by the same
* function as the corpus and the query (see EXPANSION_INDEX below), which makes
* that whole class of silent failure impossible rather than merely tested for.
*
* Where several spellings of an idea stem apart — "flaky" and "flakiness" do —
* list them both. Duplicate keys landing on one stem merge their targets.
*/
var EXPANSIONS = {
	stuck: [
		"blocked",
		"impasse",
		"unclear",
		"debug"
	],
	blocked: [
		"stuck",
		"constraint",
		"bottleneck"
	],
	blocker: [
		"stuck",
		"constraint",
		"bottleneck"
	],
	lost: [
		"unclear",
		"orient",
		"stuck"
	],
	overwhelmed: [
		"prioritize",
		"scope",
		"structure"
	],
	confused: [
		"unclear",
		"ambiguous",
		"structure"
	],
	confusing: [
		"unclear",
		"ambiguous",
		"structure"
	],
	mess: [
		"structure",
		"unclear",
		"organize"
	],
	vague: [
		"ambiguous",
		"unclear",
		"abstract",
		"altitude"
	],
	fuzzy: [
		"ambiguous",
		"unclear",
		"abstract"
	],
	fuzziness: [
		"ambiguous",
		"unclear",
		"abstract"
	],
	generic: [
		"generic",
		"bland",
		"obvious",
		"default"
	],
	general: [
		"generic",
		"bland",
		"obvious",
		"default"
	],
	bland: [
		"generic",
		"obvious",
		"creativity"
	],
	obvious: [
		"generic",
		"default",
		"anchor"
	],
	broad: [
		"abstract",
		"scope",
		"altitude"
	],
	abstract: [
		"altitude",
		"concrete",
		"ladder"
	],
	ai: [
		"prompt",
		"model",
		"llm"
	],
	llm: [
		"prompt",
		"model",
		"ai"
	],
	claude: [
		"prompt",
		"model",
		"ai"
	],
	chatgpt: [
		"prompt",
		"model",
		"ai"
	],
	gpt: [
		"prompt",
		"model",
		"ai"
	],
	agent: [
		"prompt",
		"model",
		"ai",
		"coding"
	],
	chatbot: [
		"prompt",
		"model",
		"ai"
	],
	prompt: [
		"steer",
		"model",
		"ai"
	],
	output: [
		"format",
		"response",
		"answer"
	],
	hallucinate: [
		"accuracy",
		"evidence",
		"verify",
		"confident"
	],
	hallucination: [
		"accuracy",
		"evidence",
		"verify",
		"confident"
	],
	bug: [
		"debug",
		"failure",
		"defect",
		"troubleshoot"
	],
	crash: [
		"failure",
		"debug",
		"incident"
	],
	error: [
		"failure",
		"debug",
		"incident"
	],
	broken: [
		"failure",
		"debug",
		"incident"
	],
	fail: [
		"failure",
		"debug",
		"risk"
	],
	outage: [
		"incident",
		"postmortem",
		"failure",
		"production"
	],
	slow: [
		"performance",
		"latency",
		"bottleneck",
		"throughput"
	],
	flaky: [
		"intermittent",
		"debug",
		"reliability"
	],
	flakiness: [
		"intermittent",
		"debug",
		"reliability"
	],
	regressed: [
		"bisect",
		"debug",
		"broke"
	],
	regression: [
		"bisect",
		"debug",
		"broke"
	],
	roadmap: [
		"prioritization",
		"planning",
		"sequencing"
	],
	backlog: [
		"prioritization",
		"planning",
		"scope"
	],
	feature: [
		"product",
		"scope",
		"prioritization"
	],
	ticket: [
		"requirements",
		"acceptance",
		"scope"
	],
	sprint: [
		"planning",
		"scope",
		"agile"
	],
	estimate: [
		"estimation",
		"forecast",
		"sizing"
	],
	estimation: [
		"estimation",
		"forecast",
		"sizing"
	],
	deadline: [
		"schedule",
		"date",
		"sequencing",
		"scope"
	],
	late: [
		"schedule",
		"estimation",
		"slip"
	],
	scope: [
		"requirements",
		"prioritization",
		"cutting"
	],
	launch: [
		"release",
		"risk",
		"readiness"
	],
	mvp: [
		"scope",
		"validation",
		"minimum"
	],
	boss: [
		"leadership",
		"executive",
		"stakeholder"
	],
	manager: [
		"leadership",
		"stakeholder",
		"feedback"
	],
	managing: [
		"leadership",
		"stakeholder",
		"feedback"
	],
	management: [
		"leadership",
		"stakeholder",
		"feedback"
	],
	exec: [
		"leadership",
		"executive",
		"stakeholder"
	],
	executive: [
		"leadership",
		"executive",
		"stakeholder"
	],
	leadership: [
		"executive",
		"stakeholder",
		"alignment"
	],
	stakeholder: [
		"leadership",
		"alignment",
		"communication"
	],
	team: [
		"collaboration",
		"alignment",
		"leadership"
	],
	meeting: [
		"decision",
		"alignment",
		"facilitation"
	],
	arguing: [
		"disagreement",
		"conflict",
		"debate"
	],
	argument: [
		"disagreement",
		"conflict",
		"debate"
	],
	disagree: [
		"conflict",
		"debate",
		"alignment"
	],
	disagreement: [
		"conflict",
		"debate",
		"alignment"
	],
	conflict: [
		"disagreement",
		"feedback",
		"communication"
	],
	coworker: [
		"colleague",
		"feedback",
		"conflict"
	],
	colleague: [
		"feedback",
		"conflict",
		"communication"
	],
	hiring: [
		"interview",
		"career",
		"evaluation"
	],
	promoted: [
		"career",
		"interview",
		"review"
	],
	promotion: [
		"career",
		"interview",
		"review"
	],
	interview: [
		"career",
		"interview",
		"evaluation"
	],
	email: [
		"writing",
		"communication",
		"brevity"
	],
	slack: [
		"writing",
		"communication",
		"brevity"
	],
	doc: [
		"writing",
		"document",
		"structure"
	],
	writing: [
		"writing",
		"communication",
		"clarity"
	],
	present: [
		"communication",
		"narrative",
		"audience"
	],
	deck: [
		"presentation",
		"narrative",
		"communication"
	],
	pitch: [
		"narrative",
		"persuasion",
		"communication"
	],
	explain: [
		"explanation",
		"clarity",
		"audience",
		"teaching"
	],
	jargon: [
		"clarity",
		"audience",
		"plain"
	],
	ramble: [
		"brevity",
		"structure",
		"concise"
	],
	rambling: [
		"brevity",
		"structure",
		"concise"
	],
	long: [
		"brevity",
		"concise",
		"structure"
	],
	boring: [
		"narrative",
		"engagement",
		"story"
	],
	decide: [
		"decision",
		"choice",
		"trade-off"
	],
	decision: [
		"choice",
		"trade-off",
		"criteria"
	],
	choose: [
		"decision",
		"choice",
		"criteria"
	],
	option: [
		"alternative",
		"choice",
		"decision"
	],
	tradeoff: [
		"trade-off",
		"criteria",
		"decision"
	],
	risk: [
		"failure",
		"uncertainty",
		"mitigation"
	],
	wrong: [
		"failure",
		"mistake",
		"critique"
	],
	learn: [
		"learning",
		"understanding",
		"study"
	],
	understand: [
		"understanding",
		"explanation",
		"learning"
	],
	remember: [
		"memory",
		"retention",
		"recall"
	],
	forget: [
		"memory",
		"retention",
		"recall"
	],
	study: [
		"learning",
		"retention",
		"practice"
	],
	studying: [
		"learning",
		"retention",
		"practice"
	],
	teach: [
		"teaching",
		"explanation",
		"learning"
	],
	onboard: [
		"learning",
		"orientation",
		"documentation"
	],
	metric: [
		"measurement",
		"kpi",
		"analytics"
	],
	kpi: [
		"metric",
		"measurement",
		"goal"
	],
	data: [
		"analytics",
		"evidence",
		"measurement"
	],
	chart: ["analytics", "measurement"],
	test: [
		"experiment",
		"validation",
		"evidence"
	],
	experiment: [
		"experiment",
		"validation",
		"test"
	],
	churn: [
		"retention",
		"cohort",
		"analytics"
	],
	retention: [
		"cohort",
		"analytics",
		"churn"
	],
	conversion: [
		"funnel",
		"analytics",
		"journey"
	],
	funnel: [
		"journey",
		"analytics",
		"dropoff"
	],
	legacy: [
		"migration",
		"refactoring",
		"modernization",
		"old"
	],
	monolith: [
		"architecture",
		"service",
		"decomposition"
	],
	monolithic: [
		"architecture",
		"service",
		"decomposition"
	],
	microservice: [
		"architecture",
		"service",
		"boundaries",
		"distributed"
	],
	coupled: [
		"dependency",
		"architecture",
		"modularity",
		"boundaries"
	],
	coupling: [
		"dependency",
		"architecture",
		"modularity",
		"boundaries"
	],
	refactor: [
		"restructure",
		"architecture",
		"cleanup",
		"migration"
	],
	spaghetti: [
		"coupling",
		"structure",
		"architecture",
		"tangled"
	],
	testable: [
		"testing",
		"dependency",
		"isolation",
		"architecture"
	],
	testability: [
		"testing",
		"dependency",
		"isolation",
		"architecture"
	],
	mock: [
		"testing",
		"dependency",
		"isolation"
	],
	rewrite: [
		"migration",
		"legacy",
		"incremental",
		"architecture"
	],
	boilerplate: [
		"abstraction",
		"structure",
		"ceremony"
	],
	framework: [
		"architecture",
		"dependency",
		"coupling"
	],
	database: [
		"persistence",
		"data",
		"schema"
	],
	sql: [
		"persistence",
		"database",
		"query"
	],
	orm: [
		"persistence",
		"database",
		"entity"
	],
	schema: [
		"model",
		"data",
		"structure"
	],
	api: [
		"interface",
		"contract",
		"boundaries"
	],
	apis: [
		"interface",
		"contract",
		"boundaries"
	],
	endpoint: [
		"api",
		"interface",
		"client"
	],
	layer: [
		"architecture",
		"boundaries",
		"structure"
	],
	module: [
		"architecture",
		"boundaries",
		"structure"
	],
	modular: [
		"architecture",
		"boundaries",
		"structure"
	],
	interface: [
		"abstraction",
		"contract",
		"boundaries"
	],
	deploy: [
		"operations",
		"release",
		"environment"
	],
	config: [
		"environment",
		"deployment",
		"operations"
	],
	configuration: [
		"environment",
		"deployment",
		"operations"
	],
	scale: [
		"scalability",
		"performance",
		"throughput"
	],
	scaling: [
		"scalability",
		"performance",
		"throughput"
	],
	frontend: [
		"ui",
		"client",
		"interface"
	],
	backend: [
		"service",
		"api",
		"server"
	],
	secure: [
		"security",
		"hardening",
		"threat",
		"access"
	],
	security: [
		"hardening",
		"threat",
		"access",
		"protection"
	],
	insecure: [
		"security",
		"vulnerability",
		"hardening"
	],
	permission: [
		"access control",
		"privilege",
		"authorization"
	],
	privilege: [
		"access control",
		"permissions",
		"escalation"
	],
	admin: [
		"privilege",
		"access control",
		"permissions"
	],
	access: [
		"permissions",
		"privilege",
		"authorization"
	],
	auth: [
		"authentication",
		"authorization",
		"identity"
	],
	login: [
		"authentication",
		"identity",
		"access"
	],
	password: [
		"credentials",
		"secrets",
		"authentication"
	],
	credential: [
		"secrets",
		"rotation",
		"authentication"
	],
	secret: [
		"credentials",
		"rotation",
		"key"
	],
	token: [
		"credentials",
		"authentication",
		"secrets"
	],
	key: [
		"credentials",
		"secrets",
		"rotation"
	],
	leak: [
		"exposure",
		"breach",
		"secrets",
		"disclosure"
	],
	breach: [
		"incident",
		"exposure",
		"compromise"
	],
	hack: [
		"attack",
		"compromise",
		"threat"
	],
	attack: [
		"threat",
		"adversary",
		"exploit"
	],
	exploit: [
		"attack",
		"vulnerability",
		"threat"
	],
	vulnerable: [
		"weakness",
		"exploit",
		"security"
	],
	vulnerability: [
		"weakness",
		"exploit",
		"security"
	],
	compromise: [
		"breach",
		"attack",
		"containment"
	],
	malicious: [
		"attack",
		"adversary",
		"abuse"
	],
	abuse: [
		"attack",
		"adversary",
		"misuse"
	],
	inject: [
		"validation",
		"input",
		"boundaries"
	],
	injection: [
		"validation",
		"input",
		"boundaries"
	],
	sanitise: [
		"validation",
		"input",
		"encoding"
	],
	sanitize: [
		"validation",
		"input",
		"encoding"
	],
	encrypt: [
		"confidentiality",
		"security",
		"data"
	],
	encryption: [
		"confidentiality",
		"security",
		"data"
	],
	audit: [
		"compliance",
		"logging",
		"controls"
	],
	compliance: [
		"audit",
		"controls",
		"regulation"
	],
	gdpr: [
		"privacy",
		"retention",
		"data"
	],
	privacy: [
		"data",
		"retention",
		"minimization"
	],
	pii: [
		"privacy",
		"data",
		"sensitive"
	],
	firewall: [
		"network",
		"perimeter",
		"security"
	],
	vpn: [
		"network",
		"perimeter",
		"access"
	],
	dependency: [
		"supply chain",
		"package",
		"library"
	],
	package: [
		"dependency",
		"supply chain",
		"library"
	],
	ux: [
		"usability",
		"design",
		"experience"
	],
	ui: [
		"interface",
		"design",
		"usability"
	],
	usable: [
		"usability",
		"heuristic",
		"interface"
	],
	usability: [
		"usability",
		"heuristic",
		"interface"
	],
	design: [
		"interface",
		"usability",
		"critique"
	],
	wireframe: [
		"design",
		"interface",
		"prototype"
	],
	anxious: [
		"risk",
		"uncertainty",
		"pre-mortem"
	],
	worried: [
		"risk",
		"uncertainty",
		"failure"
	],
	nervous: [
		"risk",
		"uncertainty",
		"caution"
	],
	frustrated: [
		"stuck",
		"conflict",
		"friction"
	],
	procrastinate: [
		"prioritization",
		"timebox",
		"focus"
	],
	procrastination: [
		"prioritization",
		"timebox",
		"focus"
	],
	busy: [
		"prioritization",
		"focus",
		"delegation"
	],
	business: [
		"prioritization",
		"focus",
		"delegation"
	],
	circles: [
		"stuck",
		"decision",
		"relitigate"
	],
	repeat: [
		"recurring",
		"root",
		"systemic"
	],
	again: [
		"recurring",
		"root",
		"systemic"
	]
};
/**
* The table above, re-keyed by stem so lookups can be done on the same tokens
* the query produces. Built once at load; several words may share a stem, in
* which case their targets merge.
*/
var EXPANSION_INDEX = (() => {
	const index = /* @__PURE__ */ new Map();
	for (const [word, targets] of Object.entries(EXPANSIONS)) {
		const key = stem(SPELLING[word] ?? word);
		const existing = index.get(key);
		if (existing) {
			for (const t of targets) if (!existing.includes(t)) existing.push(t);
		} else index.set(key, [...targets]);
	}
	return index;
})();
/** Split raw text into normalised, stopword-filtered, stemmed tokens. */
function tokenizeDetailed(input) {
	const out = [];
	for (const word of input.toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/)) {
		if (!word) continue;
		const normalized = SPELLING[word] ?? word;
		if (normalized.length < 2 || STOPWORDS.has(normalized)) continue;
		const term = stem(normalized);
		if (term) out.push({
			term,
			original: word
		});
	}
	return out;
}
function tokenize(input) {
	return tokenizeDetailed(input).map((t) => t.term);
}
/**
* Deliberately light suffix stripping. Precision matters less than applying the
* exact same transformation to the query and the corpus.
*/
function stem(word) {
	let w = word;
	if (w.length <= 3) return w;
	if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
	if (w.endsWith("sses")) return w.slice(0, -2);
	if (w.endsWith("ness") && w.length > 6) w = w.slice(0, -4);
	else if (w.endsWith("ment") && w.length > 7) w = w.slice(0, -4);
	else if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
	else if (w.endsWith("edly") && w.length > 6) w = w.slice(0, -4);
	else if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);
	else if (w.endsWith("ly") && w.length > 4) w = w.slice(0, -2);
	else if (w.endsWith("es") && w.length > 4 && !/[aeiou]es$/.test(w)) w = w.slice(0, -2);
	else if (w.endsWith("s") && !/(ss|us|is|as)$/.test(w) && w.length > 3) w = w.slice(0, -1);
	else if (w.endsWith("e")) w = w.slice(0, -1);
	if (/([bdfglmnprt])\1$/.test(w)) w = w.slice(0, -1);
	return w;
}
/**
* Terms implied by, but not present in, the user's wording. Returned separately
* so the caller can score them below literal matches.
*/
function expand(tokens) {
	const out = /* @__PURE__ */ new Set();
	const literal = new Set(tokens);
	for (const t of tokens) {
		const extra = EXPANSION_INDEX.get(t);
		if (!extra) continue;
		for (const e of extra) for (const st of tokenize(e)) if (!literal.has(st)) out.add(st);
	}
	return [...out];
}
Object.keys(EXPANSIONS);
//#endregion
//#region src/lib/search.ts
/**
* Field weights for the latent space, which are deliberately not the BM25
* weights below.
*
* Reusing one weighted bag for both looked like the tidy choice and cost a
* third of the semantic ranking. BM25 wants `name` at weight 7, because
* someone typing "Chesterton's fence" means that concept and nothing else. The
* SVD reads the same table as a claim about what the corpus is *about*, so the
* loudest signal in every latent dimension becomes a set of proper nouns that
* no user describing a problem will ever type. Dropping names, aliases and
* prompt text from the semantic corpus — leaving the symptom phrases and the
* plain-language description — took held-out recall@1 from 46.6% to 60.3%.
*
* The name is not lost. It is what BM25 is for.
*/
var SEMANTIC_FIELD_WEIGHTS = {
	useWhen: 4,
	tags: 3,
	oneLiner: 2.2,
	why: 1,
	watchOut: .5
};
/** Field weights. `useWhen` carries the symptom language people actually type. */
var FIELD_WEIGHTS = {
	name: 7,
	aka: 5.5,
	useWhen: 4,
	tags: 3,
	oneLiner: 2.2,
	facets: 1.6,
	variantLabels: 1.2,
	why: 1,
	origin: .9,
	prompt: .6,
	watchOut: .5
};
var K1 = 1.2;
var B = .6;
/** Expansion terms are inferred, not stated, so they score lower. */
var EXPANSION_WEIGHT = .4;
/**
* Scores below are on a normalised scale where 1.0 is the best lexical match
* in this particular query, so the constants read as multiples of "as good as
* the top BM25 hit".
*/
var PHRASE_BONUS = 3.5;
var ALIAS_PHRASE_BONUS = 2.5;
var DEFAULT_TUNING = {
	semanticDims: 96,
	lexicalWeight: 1,
	semanticWeight: 2.5,
	semanticFloor: .1,
	diversityStrength: .2,
	relatedDiffusion: .25
};
/**
* What fraction of the query a name has to account for before matching it
* counts as "the user asked for this concept by name".
*
* Several aliases are written as conversational questions, and stopword
* stripping can reduce one to a single ordinary word: "what are we not doing"
* became `[not]`, "what happened when" became `[happen]`, "what else could it
* be" became `[els]`. Each was pinning its concept to rank one on any query
* containing that word, and Opportunity Cost Framing was the top result for a
* third of the held-out queries purely because they contained "not". Alone it
* cost more held-out accuracy than the entire semantic half contributes.
*
* Distinctiveness cannot separate these from real names: "Jobs To Be Done"
* reduces to `[job]` and "Five Whys" is reachable only as `[why]`, both of
* which are commoner in this corpus than `[els]`. What separates them is how
* much of the query is left over. Someone naming a concept types little else,
* so the name is most of what they typed; someone describing a problem in
* fifteen words who happens to say "not" is at one token in eight. So the
* bonus scales with coverage, and only a query that is mostly a name pins.
*/
var PHRASE_PIN_COVERAGE = .5;
/**
* Below this share of a perfect lexical match, a result is flagged as loose.
* See `Result.looseMatch` for where the number comes from.
*/
var LOOSE_MATCH_LEXICAL = .2;
function addField(tf, text, weight) {
	let added = 0;
	for (const term of tokenize(text)) {
		tf.set(term, (tf.get(term) ?? 0) + weight);
		added += weight;
	}
	return added;
}
function buildDoc(concept) {
	const tf = /* @__PURE__ */ new Map();
	let length = 0;
	length += addField(tf, concept.name, FIELD_WEIGHTS.name);
	for (const a of concept.aka ?? []) length += addField(tf, a, FIELD_WEIGHTS.aka);
	for (const u of concept.useWhen) length += addField(tf, u, FIELD_WEIGHTS.useWhen);
	for (const t of concept.tags) length += addField(tf, t, FIELD_WEIGHTS.tags);
	length += addField(tf, concept.oneLiner, FIELD_WEIGHTS.oneLiner);
	for (const d of concept.domains) length += addField(tf, DOMAIN_LABELS[d], FIELD_WEIGHTS.facets);
	for (const i of concept.intents) length += addField(tf, INTENT_LABELS[i], FIELD_WEIGHTS.facets);
	for (const v of concept.variants ?? []) length += addField(tf, v.label, FIELD_WEIGHTS.variantLabels);
	length += addField(tf, concept.why, FIELD_WEIGHTS.why);
	if (concept.origin) length += addField(tf, concept.origin, FIELD_WEIGHTS.origin);
	length += addField(tf, concept.prompt, FIELD_WEIGHTS.prompt);
	if (concept.watchOut) length += addField(tf, concept.watchOut, FIELD_WEIGHTS.watchOut);
	const semanticTf = /* @__PURE__ */ new Map();
	for (const u of concept.useWhen) addField(semanticTf, u, SEMANTIC_FIELD_WEIGHTS.useWhen);
	for (const t of concept.tags) addField(semanticTf, t, SEMANTIC_FIELD_WEIGHTS.tags);
	addField(semanticTf, concept.oneLiner, SEMANTIC_FIELD_WEIGHTS.oneLiner);
	addField(semanticTf, concept.why, SEMANTIC_FIELD_WEIGHTS.why);
	if (concept.watchOut) addField(semanticTf, concept.watchOut, SEMANTIC_FIELD_WEIGHTS.watchOut);
	return {
		concept,
		tf,
		semanticTf,
		length,
		phrases: [concept.name, ...concept.aka ?? []].map((p, i) => ({
			tokens: tokenize(p),
			isName: i === 0
		})).filter((p) => p.tokens.length > 0),
		tagSet: new Set(concept.tags)
	};
}
var Index = class {
	docs;
	df = /* @__PURE__ */ new Map();
	avgLength;
	constructor(concepts) {
		this.docs = concepts.map(buildDoc);
		for (const doc of this.docs) for (const term of doc.tf.keys()) this.df.set(term, (this.df.get(term) ?? 0) + 1);
		const total = this.docs.reduce((sum, d) => sum + d.length, 0);
		this.avgLength = this.docs.length ? total / this.docs.length : 1;
	}
	idf(term) {
		const n = this.docs.length;
		const df = this.df.get(term) ?? 0;
		return Math.log(1 + (n - df + .5) / (df + .5));
	}
	/** BM25 contribution of one term to one document. */
	termScore(doc, term) {
		const f = doc.tf.get(term);
		if (!f) return 0;
		const norm = .4 + B * doc.length / this.avgLength;
		return this.idf(term) * (f * 2.2 / (f + K1 * norm));
	}
};
var INDEX = new Index(CONCEPTS);
/**
* The latent space costs ~40ms to build — worth paying, but not while someone
* is waiting to see the home page. It is built on first use instead, and
* `warmSemanticSpace` lets the app do that in idle time after first paint, so
* by the time anyone has finished typing a problem description it is ready.
* A deep link straight into a search pays the 40ms once.
*/
var SPACES = /* @__PURE__ */ new Map();
function semanticSpace(dims) {
	let space = SPACES.get(dims);
	if (!space) {
		space = buildSemanticSpace(INDEX.docs.map((d) => d.semanticTf), dims);
		SPACES.set(dims, space);
	}
	return space;
}
/**
* Undirected neighbour map from the `related` links each entry's author wrote.
*
* These are the best signal in the corpus and until now only fed the "if that
* is not quite it" chips. A query that lands squarely on Pre-mortem is very
* often a query that wanted Red Teaming, and the corpus already knows the two
* are neighbours — so a fraction of each concept's score flows to the ones it
* is linked to. It rescues the near-miss without ever displacing a direct hit,
* because the direct hit keeps its own score and gains from its neighbours too.
*/
var NEIGHBOURS = (() => {
	const indexOfId = /* @__PURE__ */ new Map();
	CONCEPTS.forEach((c, i) => indexOfId.set(c.id, i));
	const adjacency = CONCEPTS.map(() => /* @__PURE__ */ new Set());
	CONCEPTS.forEach((c, i) => {
		for (const id of c.related) {
			const j = indexOfId.get(id);
			if (j === void 0 || j === i) continue;
			adjacency[i].add(j);
			adjacency[j].add(i);
		}
	});
	return adjacency.map((s) => [...s]);
})();
/** Facet agreement multiplier. Absent facets neither help nor hurt. */
function facetMultiplier(concept, query) {
	let m = 1;
	if (query.domains?.length) m *= query.domains.some((d) => concept.domains.includes(d)) ? 1.5 : .82;
	if (query.intents?.length) m *= query.intents.some((i) => concept.intents.includes(i)) ? 1.45 : .84;
	return m;
}
/** True when `needle` appears as a contiguous run of tokens inside `haystack`. */
function containsSequence(haystack, needle) {
	if (!needle.length || needle.length > haystack.length) return false;
	outer: for (let i = 0; i <= haystack.length - needle.length; i++) {
		for (let j = 0; j < needle.length; j++) if (haystack[i + j] !== needle[j]) continue outer;
		return true;
	}
	return false;
}
function jaccard(a, b) {
	if (!a.size || !b.size) return 0;
	let shared = 0;
	for (const x of a) if (b.has(x)) shared++;
	return shared / (a.size + b.size - shared);
}
/**
* Reorder by relevance discounted by similarity to already-picked results, so
* the list spans approaches rather than repeating one family.
*/
function diversify(scored, limit, strength) {
	const picked = [];
	const pool = [...scored];
	while (picked.length < limit && pool.length) {
		let bestIdx = 0;
		let bestValue = -Infinity;
		for (let i = 0; i < pool.length; i++) {
			const overlap = picked.reduce((max, p) => Math.max(max, jaccard(pool[i].doc.tagSet, p.doc.tagSet)), 0);
			const value = pool[i].score * (1 - strength * overlap);
			if (value > bestValue) {
				bestValue = value;
				bestIdx = i;
			}
		}
		picked.push(pool.splice(bestIdx, 1)[0]);
	}
	return picked;
}
function search(query) {
	const limit = query.limit ?? 8;
	const detailed = tokenizeDetailed(query.text);
	const literal = detailed.map((t) => t.term);
	const expanded = expand(literal);
	const hasText = literal.length > 0;
	const spoken = /* @__PURE__ */ new Map();
	for (const t of detailed) if (!spoken.has(t.term)) spoken.set(t.term, t.original);
	const tuning = {
		...DEFAULT_TUNING,
		...query.tuning
	};
	const space = hasText && tuning.semanticWeight > 0 ? semanticSpace(tuning.semanticDims) : null;
	const queryVector = space ? space.fold(literal) : null;
	const lexicalPass = INDEX.docs.map((doc) => {
		let value = 0;
		const contributions = [];
		for (const term of literal) {
			const termValue = INDEX.termScore(doc, term);
			if (termValue > 0) contributions.push({
				term,
				value: termValue
			});
			value += termValue;
		}
		for (const term of expanded) value += INDEX.termScore(doc, term) * EXPANSION_WEIGHT;
		contributions.sort((a, b) => b.value - a.value);
		return {
			value,
			contributions
		};
	});
	/**
	* Normalise against what a perfect lexical match would have scored, not
	* against the best match this query happened to find.
	*
	* Dividing by the observed maximum was the single worst thing in this
	* ranking. It guarantees some document scores exactly 1.0 no matter how
	* badly the query matched, so on a query with no real lexical signal the
	* loudest piece of noise arrives with full confidence and buries the
	* semantic half. Against the theoretical ceiling — every query term present
	* and saturated — a query the corpus has no words for correctly scores
	* everyone near zero, and the latent space gets to lead.
	*/
	const idealLexical = literal.reduce((sum, term) => sum + INDEX.idf(term) * 2.2, 0);
	const evidence = INDEX.docs.map((_doc, i) => {
		const lexical = idealLexical > 0 ? lexicalPass[i].value / idealLexical : 0;
		let semantic = 0;
		if (queryVector && space) {
			const cosine = space.similarity(queryVector, i);
			if (cosine > tuning.semanticFloor) semantic = cosine;
		}
		return {
			lexical,
			semantic,
			base: tuning.lexicalWeight * lexical + tuning.semanticWeight * semantic
		};
	});
	const ranked = INDEX.docs.map((doc, i) => {
		const { contributions } = lexicalPass[i];
		const { lexical, semantic, base } = evidence[i];
		let vouched = 0;
		for (const j of NEIGHBOURS[i]) vouched = Math.max(vouched, evidence[j].base);
		let score = base + tuning.relatedDiffusion * vouched;
		let exactNameMatch = false;
		for (const phrase of doc.phrases) {
			if (!containsSequence(literal, phrase.tokens)) continue;
			const coverage = Math.min(1, phrase.tokens.length / literal.length);
			score += (phrase.isName ? PHRASE_BONUS : ALIAS_PHRASE_BONUS) * coverage;
			exactNameMatch = coverage >= PHRASE_PIN_COVERAGE;
			break;
		}
		if (!hasText) score = 1;
		score *= facetMultiplier(doc.concept, query);
		const cutoff = (contributions[0]?.value ?? 0) * .3;
		return {
			doc,
			score,
			exactNameMatch,
			lexical,
			semantic,
			looseMatch: hasText && lexical < LOOSE_MATCH_LEXICAL && !exactNameMatch,
			matchedTerms: contributions.filter((c) => c.value >= cutoff).slice(0, 4).map((c) => spoken.get(c.term) ?? c.term)
		};
	}).filter((s) => s.score > .01).sort((a, b) => b.score - a.score || a.doc.concept.name.localeCompare(b.doc.concept.name));
	const pinned = ranked.filter((r) => r.exactNameMatch).slice(0, 1);
	const diversified = diversify(ranked.filter((r) => !pinned.includes(r)), Math.max(0, limit - pinned.length), tuning.diversityStrength);
	return [...pinned, ...diversified].map((s) => ({
		concept: s.doc.concept,
		score: s.score,
		matchedTerms: s.matchedTerms,
		exactNameMatch: s.exactNameMatch,
		lexical: s.lexical,
		semantic: s.semantic,
		looseMatch: s.looseMatch
	}));
}
/** Every concept, for the browse-everything view. */
function allConcepts() {
	return [...CONCEPTS].sort((a, b) => a.name.localeCompare(b.name));
}
//#endregion
//#region src/lib/triage.ts
/**
* Three, and the default is not arbitrary.
*
* The failure mode of this whole idea is not missing a concept, it is burying
* the request under six of them. Every injected phrase competes with the user's
* own instructions for the model's attention, and the fourth-best match for a
* paragraph is nearly always a thematic neighbour of the first rather than a
* new problem. Two or three named techniques is what a knowledgeable colleague
* would say; a numbered list of eight is what a search engine would say.
*/
var DEFAULT_LIMIT = 3;
/** Below this a result is noise from a thread with nothing much in it. */
var FLOOR_SCORE = .35;
/**
* A thread must have at least this many content tokens to be searched alone.
*
* Scores are comparable across queries because both halves are normalised —
* BM25 against a perfect match for *that* query, the semantic half being a
* cosine — but that same normalisation makes a two-word fragment cheap to
* satisfy: "it is slow" matches something perfectly and means almost nothing.
* Short fragments are merged into their neighbour rather than searched.
*/
var MIN_THREAD_TOKENS = 3;
/** More threads than this and we are dicing, not splitting. */
var MAX_THREADS = 6;
/**
* A single strand longer than this is a run-on rather than one thought, and
* only then is it worth splitting on bare "and" / "but". Doing that eagerly
* breaks real single problems in half — "the payment went through but the order
* was never created" is one bug, not two — so it is the fallback, not the rule.
*/
var RUN_ON_TOKENS = 16;
/**
* Boundaries that reliably mean "new thought": punctuation, line breaks, spaced
* dashes, and the handful of spoken connectives people use to change subject.
* Deliberately excludes bare "and" and "but", which join clauses within one
* problem far more often than they separate problems.
*/
var HARD_BOUNDARY = /(?:[.!?;]+\s+|\n+|\s+[—–]\s+|\s+(?:and then|and also|and now|and separately|oh and|another thing|on top of that|at the same time|meanwhile|separately|anyway|also|plus)\s+)/i;
var RUN_ON_BOUNDARY = /(?:\s+(?:and|but|although|whereas|while)\s+)/i;
/**
* Discourse markers stripped from the front of a thread once it has been cut
* out. They carry no problem — "ok so the deploy fell over" is about a deploy —
* and two of them cause real damage rather than mere untidiness.
*
* Where two boundaries overlap, splitting consumes the outer one and strands
* the inner: "on time — and separately I cannot tell" cuts at the dash and
* again at "separately", leaving a thread whose entire content is the word
* "and", which then gets folded onto the end of its neighbour. And because the
* site quotes threads back at the user as the reason a word arrived, a thread
* that begins "and also then" reads as though the splitter is guessing.
*
* Applied repeatedly, since they stack: "ok so anyway…".
*/
var LEADING_FILLER = /^(?:ok|okay|so|and|but|then|also|plus|oh|well|anyway|basically|honestly|um|uh|yeah|separately|meanwhile)[,]?(?:\s+|$)/i;
function stripFiller(text) {
	let out = text;
	while (LEADING_FILLER.test(out)) out = out.replace(LEADING_FILLER, "");
	return out;
}
function contentTokens(text) {
	return tokenize(text).length;
}
/** Split on a regex while keeping the pieces, since JS `split` needs a global. */
function splitAll(text, boundary) {
	const global = new RegExp(boundary.source, boundary.flags.includes("g") ? boundary.flags : boundary.flags + "g");
	return text.split(global).filter((p) => p != null);
}
/**
* Cut a ramble into the problems it contains.
*
* Exported because it is the part most worth testing directly, and because the
* site quotes its output back at the user, so its mistakes are visible ones.
*/
function splitThreads(input) {
	const trimmed = input.trim();
	if (!trimmed) return [];
	let parts = splitAll(trimmed, HARD_BOUNDARY).map((p) => p.trim()).filter(Boolean);
	parts = parts.flatMap((part) => contentTokens(part) > RUN_ON_TOKENS ? splitAll(part, RUN_ON_BOUNDARY).map((p) => p.trim()).filter(Boolean) : [part]);
	parts = parts.map(stripFiller).filter((p) => p.length > 0);
	const merged = [];
	for (const part of parts) if (contentTokens(part) < MIN_THREAD_TOKENS && merged.length) merged[merged.length - 1] = `${merged[merged.length - 1]} ${part}`;
	else merged.push(part);
	if (merged.length > 1 && contentTokens(merged[0]) < MIN_THREAD_TOKENS) {
		const [first, second, ...rest] = merged;
		return capThreads([`${first} ${second}`, ...rest]);
	}
	return capThreads(merged.length ? merged : [trimmed]);
}
/** Keep the meatiest threads, in the order they were said. */
function capThreads(threads) {
	if (threads.length <= MAX_THREADS) return threads;
	const keep = new Set(threads.map((text, index) => ({
		index,
		weight: contentTokens(text)
	})).sort((a, b) => b.weight - a.weight).slice(0, MAX_THREADS).map((t) => t.index));
	return threads.filter((_, i) => keep.has(i));
}
var DEFAULT_TRIAGE_TUNING = { wholeInputWeight: 1 };
function triage(input, options = {}) {
	const limit = options.limit ?? DEFAULT_LIMIT;
	const tuning = {
		...DEFAULT_TRIAGE_TUNING,
		...options.tuning
	};
	const threads = splitThreads(input);
	const facets = {
		domains: options.domains,
		intents: options.intents
	};
	const whole = search({
		text: input,
		...facets,
		limit: 8
	});
	if (!contentTokens(input)) return {
		threads: [],
		picks: [],
		others: whole
	};
	/** Best evidence seen for each concept, and what produced it. */
	const best = /* @__PURE__ */ new Map();
	const offer = (result, score, because, fromWholeInput) => {
		const existing = best.get(result.concept.id);
		if (existing && existing.score >= score) return;
		best.set(result.concept.id, {
			result,
			score,
			because,
			fromWholeInput
		});
	};
	for (const r of whole) offer(r, r.score * tuning.wholeInputWeight, input.trim(), true);
	if (threads.length > 1) for (const thread of threads) {
		const [top] = search({
			text: thread,
			...facets,
			limit: 1
		});
		if (top) offer(top, top.score, thread, false);
	}
	const picks = [...best.values()].sort((a, b) => b.score - a.score).filter((r) => r.score >= FLOOR_SCORE).slice(0, limit).map((r) => ({
		concept: r.result.concept,
		because: r.because,
		fromWholeInput: r.fromWholeInput && threads.length > 1,
		score: r.score,
		matchedTerms: r.result.matchedTerms,
		confidence: r.result.looseMatch ? "tentative" : "strong"
	}));
	const picked = new Set(picks.map((p) => p.concept.id));
	return {
		threads,
		picks,
		others: whole.filter((r) => !picked.has(r.concept.id))
	};
}
//#endregion
//#region src/skill/cli.ts
/**
* The command line behind the Claude Code skill.
*
* Bundled to `plugins/magic-words/skills/magic-words/magic-words.mjs` by
* `npm run build:skill` — one file, no dependencies, no network, so the plugin
* is a directory that works the moment it is copied into place, whether that
* is by `/plugin install` or by hand into `~/.claude/skills/`.
*
* The output is written to be *read by a model* rather than by a person, which
* mostly means being explicit where a human interface would be tasteful. Every
* pick states the strand of input it came from, whether the evidence is strong
* or thin, and where the technique misfires — because the caller's job is to
* decide which of these to apply, and a list of confident-looking names with no
* provenance would be decided by whichever sounded best.
*/
var USAGE = `magic-words — find the phrase that steers Claude at your actual problem

  magic-words "<what you are trying to do, however it comes out>"
  … | magic-words                     read the text from stdin instead

Options
  --limit <n>     how many magic words to return (default 3)
  --json          structured output
  --show <id>     print one concept in full
  --list [text]   every concept in the index, optionally filtered
  --help

Nothing is sent anywhere. The whole index and its ranking are in this file.`;
function parseArgs(argv) {
	const args = {
		text: "",
		limit: 3,
		json: false,
		help: false
	};
	const rest = [];
	for (let i = 0; i < argv.length; i++) {
		const arg = argv[i];
		if (arg === "--help" || arg === "-h") args.help = true;
		else if (arg === "--json") args.json = true;
		else if (arg === "--limit") args.limit = Math.max(1, Number(argv[++i]) || 3);
		else if (arg === "--show") args.show = argv[++i];
		else if (arg === "--list") {
			args.list = argv.slice(i + 1).filter((a) => !a.startsWith("--")).join(" ");
			i = argv.length;
		} else if (!arg.startsWith("--")) rest.push(arg);
	}
	args.text = rest.join(" ");
	return args;
}
async function readStdin() {
	if (process.stdin.isTTY) return "";
	const chunks = [];
	for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
	return Buffer.concat(chunks).toString("utf8");
}
function wrap(text, width, indent) {
	const words = text.split(/\s+/);
	const lines = [];
	let line = "";
	for (const word of words) if (line && line.length + word.length + 1 > width) {
		lines.push(line);
		line = word;
	} else line = line ? `${line} ${word}` : word;
	if (line) lines.push(line);
	return lines.map((l) => indent + l).join("\n");
}
var WIDTH = 88;
function renderPick(pick, index) {
	const c = pick.concept;
	const out = [];
	const flag = pick.confidence === "strong" ? "" : "  [thin evidence — offer it, do not assume it]";
	out.push(`${index}. ${c.name}${flag}`);
	if (pick.fromWholeInput) out.push(`   from: the request as a whole`);
	else out.push(wrap(`from: "${pick.because}"`, WIDTH, "   "));
	out.push(wrap(c.oneLiner, WIDTH, "   "));
	out.push("");
	out.push(wrap(c.prompt, WIDTH, "   → "));
	out.push("");
	out.push(wrap(`why it works: ${c.why}`, WIDTH, "   "));
	if (c.watchOut) out.push(wrap(`watch out: ${c.watchOut}`, WIDTH, "   "));
	const alternatives = c.related.map(getConcept).filter(Boolean).slice(0, 3);
	if (alternatives.length) out.push(wrap(`if that is not it: ${alternatives.map((a) => a.name).join(", ")}`, WIDTH, "   "));
	return out.join("\n");
}
function renderConcept(id) {
	const c = getConcept(id);
	if (!c) {
		const near = CONCEPTS.filter((x) => x.id.includes(id) || x.name.toLowerCase().includes(id.toLowerCase()));
		return `No concept with the id "${id}".${near.length ? `\nDid you mean: ${near.map((n) => n.id).join(", ")}` : ""}`;
	}
	const out = [
		c.name,
		c.origin ? `${c.origin}${c.aka?.length ? ` · also called ${c.aka.join(", ")}` : ""}` : "",
		c.domains.map((d) => DOMAIN_LABELS[d]).join(" · "),
		"",
		wrap(c.oneLiner, WIDTH, ""),
		"",
		"The magic words:",
		wrap(c.prompt, WIDTH, "  "),
		"",
		wrap(`Why it works: ${c.why}`, WIDTH, "")
	];
	if (c.watchOut) out.push(wrap(`Watch out: ${c.watchOut}`, WIDTH, ""));
	for (const v of c.variants ?? []) out.push("", `Variant — ${v.label}:`, wrap(v.prompt, WIDTH, "  "));
	out.push("", `Use when: ${c.useWhen.join("; ")}`);
	out.push(`Related: ${c.related.join(", ")}`);
	return out.filter((l) => l !== void 0).join("\n");
}
function main(text, args) {
	if (args.help) return USAGE;
	if (args.show) return renderConcept(args.show);
	if (args.list !== void 0) {
		const needle = args.list.trim().toLowerCase();
		const matches = allConcepts().filter((c) => !needle || c.name.toLowerCase().includes(needle) || c.oneLiner.toLowerCase().includes(needle) || c.tags.some((t) => t.includes(needle)) || (c.aka ?? []).some((a) => a.toLowerCase().includes(needle)));
		return [
			...matches.map((c) => `${c.id.padEnd(30)} ${c.name} — ${c.oneLiner}`),
			"",
			`${matches.length} of ${CONCEPTS.length} concepts. --show <id> for the prompt.`
		].join("\n");
	}
	if (!text.trim()) return USAGE;
	const { threads, picks } = triage(text, { limit: args.limit });
	if (args.json) return JSON.stringify({
		threads,
		picks: picks.map((p) => ({
			id: p.concept.id,
			name: p.concept.name,
			confidence: p.confidence,
			because: p.because,
			fromWholeInput: p.fromWholeInput,
			oneLiner: p.concept.oneLiner,
			prompt: p.concept.prompt,
			why: p.concept.why,
			watchOut: p.concept.watchOut ?? null,
			related: p.concept.related
		})),
		composed: composePrompt(text, picks.filter((p) => p.confidence === "strong"))
	}, null, 2);
	if (!picks.length) return [
		"Nothing in the index matches that.",
		"",
		"This is a corpus of named techniques for getting unstuck, not a general",
		"search engine — a request that is already specific has nothing to gain here.",
		"Proceed with the work as asked."
	].join("\n");
	const strong = picks.filter((p) => p.confidence === "strong");
	const out = [
		"✦ Magic Words",
		"",
		threads.length > 1 ? `${threads.length} separate problems in what was said; ${picks.length} magic ${picks.length === 1 ? "word" : "words"} for them:` : `${picks.length} magic ${picks.length === 1 ? "word" : "words"} for this:`,
		"",
		...picks.map((p, i) => renderPick(p, i + 1)).join("\n\n").split("\n")
	];
	if (strong.length) out.push("", "─".repeat(WIDTH), "The request with those phrases folded in — use this as the working brief,", "and tell the user which techniques you applied and why:", "", composePrompt(text, strong));
	return out.join("\n");
}
var args = parseArgs(process.argv.slice(2));
var wantsText = !args.help && !args.show && args.list === void 0;
var text = args.text || (wantsText ? await readStdin() : "");
process.stdout.write(main(text, args) + "\n");
//#endregion
