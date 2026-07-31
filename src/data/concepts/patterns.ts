import type { Concept } from '../types'

export const patterns: Concept[] = [
  {
    id: 'strategy-pattern',
    name: 'Strategy Pattern',
    aka: ['policy pattern', 'pluggable algorithm'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Pull each variant of an algorithm behind a common interface so the choice becomes data the caller supplies rather than a branch buried in the code.',
    useWhen: [
      'there is a giant switch statement on customer type and it keeps growing',
      'adding a new payment method means editing six unrelated files',
      'the same if-else chain appears in four places',
      'I cannot test one pricing rule without setting up all of them',
    ],
    prompt:
      'Refactor this conditional into interchangeable implementations behind one interface. Before writing any code, define the interface from the caller\'s point of view — what it needs, not what the current branches happen to do — because an interface shaped by the existing branches inherits their coupling. List what each variant needs that the others do not, and say honestly whether those differences fit one signature or are telling you these are not variants of the same thing. Then show how a variant is selected, and where that selection now lives, since moving the branch to a registry is only progress if the registry is smaller than the switch.',
    why:
      'The refactor is mechanical and the trap is producing an interface with a union of every variant\'s parameters. Forcing the caller-first definition catches it.',
    watchOut:
      'Two branches that will never grow do not need this. You have traded a visible conditional for indirection that a reader has to chase across files.',
    related: ['open-closed-principle', 'state-pattern', 'plugin-architecture', 'template-method'],
    tags: ['design patterns', 'polymorphism', 'conditionals', 'extensibility'],
  },

  {
    id: 'state-pattern',
    name: 'State Pattern',
    aka: ['objects for states', 'state as a class'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Give each lifecycle state its own object holding the behaviour legal in that state, so illegal operations become impossible rather than guarded.',
    useWhen: [
      'every method starts by checking the status field',
      'we shipped a bug where a cancelled order still got fulfilled',
      'the status enum has nine values and the rules between them are implicit',
      'nobody can tell me which operations are allowed when',
    ],
    prompt:
      'Convert this status-flag logic into per-state behaviour. Start by extracting the transition table from the existing guard clauses, including the ones that are missing — a state where the code never checks is a state where anything is permitted, and that is the finding. Then define one type per state exposing only the operations legal there, so calling an illegal one fails at compile time rather than at runtime. Show what happens to persistence, since the state must serialise back to something the database already holds, and show the single place transitions are performed so the rules cannot be bypassed.',
    why:
      'Most implementations forget persistence and the round trip is where the pattern falls over in real systems. Extracting the implicit table first is what surfaces the unguarded transitions.',
    watchOut:
      'For three states with almost identical behaviour this is a lot of classes for one enum. Reach for it when the behavioural difference between states is real.',
    related: ['state-transition-testing', 'illegal-states-unrepresentable', 'strategy-pattern', 'aggregate-root'],
    tags: ['design patterns', 'state machines', 'invalid states', 'lifecycle'],
  },

  {
    id: 'decorator-pattern',
    name: 'Decorator Pattern',
    aka: ['wrapper', 'middleware chain'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Wrap an object in another with the same interface to add behaviour — logging, caching, retries, authorisation — without touching the thing being wrapped.',
    useWhen: [
      'I want to add caching without editing the class that does the work',
      'retry logic is copy-pasted into every client method',
      'the same cross-cutting concern appears in twenty places',
      'the class does its job plus timing plus logging plus metrics',
    ],
    prompt:
      'Extract these cross-cutting concerns into wrappers around the core object. Give me the composition order explicitly and justify it, because order is the whole design here: authorisation outside caching or a user sees another user\'s cached data; retry outside or inside the timeout changes what the timeout means. Show the stack for our case with the reasoning per layer. Then address debuggability, which is the real cost — describe how a stack trace looks through six wrappers, and what naming or context-passing keeps it readable. Flag any wrapper that needs to know something the interface does not expose, since that one does not belong here.',
    why:
      'Composition order bugs in decorator stacks are subtle and expensive. Demanding the ordering rationale per layer is where the correctness lives.',
    watchOut:
      'Deep wrapper stacks make stack traces and profiling almost unreadable. Beyond three or four layers, an explicit pipeline you can inspect is kinder.',
    related: ['facade-pattern', 'adapter-pattern', 'retry-with-backoff', 'composition-over-inheritance'],
    tags: ['design patterns', 'cross-cutting concerns', 'composition', 'middleware'],
  },

  {
    id: 'adapter-pattern',
    name: 'Adapter Pattern',
    aka: ['wrapper adapter', 'translation layer'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Translate one interface into another so two components that were never designed for each other can work together without either changing.',
    useWhen: [
      'the library we want to use has a completely different shape to our code',
      'we are migrating and need old and new to coexist for a while',
      'a third-party SDK has leaked its types into our domain',
      'two teams built interfaces that almost but not quite match',
    ],
    prompt:
      'Design an adapter between these two interfaces. The interesting part is the impedance mismatch, so enumerate it rather than glossing: fields on one side with no counterpart, different error models, sync versus async, different null and empty semantics, different units or time zones, and different transactional guarantees. For each, state the translation and what information is lost. Then decide which side the adapter belongs to — it should live with the consumer and speak the consumer\'s language — and show what happens when the foreign side introduces a new error case the adapter has never seen.',
    why:
      'Adapters that quietly discard information cause bugs far from the adapter. The explicit loss inventory is what makes those decisions visible and reviewable.',
    watchOut:
      'An adapter that grows business logic is no longer an adapter. If translation requires domain decisions, that is a service, and it needs its own tests.',
    related: ['anti-corruption-layer', 'facade-pattern', 'decorator-pattern', 'hexagonal-architecture'],
    tags: ['design patterns', 'integration', 'translation', 'third party'],
  },

  {
    id: 'facade-pattern',
    name: 'Facade Pattern',
    aka: ['simplified interface', 'coarse-grained API'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Offer one simple entry point over a complicated subsystem so ordinary callers do not have to learn the whole thing to do the common task.',
    useWhen: [
      'using our own module requires knowing six classes and a call order',
      'new developers get the initialisation sequence wrong every time',
      'the same four-step dance is repeated all over the codebase',
      'callers have to know internal details they should not care about',
    ],
    prompt:
      'Design a facade over this subsystem. Base it on the actual call sites: find every place callers use it today, cluster them into the two or three things people are really trying to do, and design the entry points around those clusters rather than around the subsystem\'s structure. Then answer the question that decides whether a facade helps or hurts — is the underlying subsystem still reachable? State explicitly which advanced cases must bypass the facade and how, because a facade that seals off necessary capability gets worked around and then you have two APIs.',
    why:
      'Facades designed from the subsystem outward reproduce its complexity with new names. Deriving them from real call sites is what makes them simplify anything.',
    watchOut:
      'A facade hides complexity, it does not remove it. If the subsystem is genuinely confusing, the facade eventually leaks and now there are two things to understand.',
    related: ['adapter-pattern', 'api-ergonomics', 'progressive-disclosure', 'backend-for-frontend'],
    tags: ['design patterns', 'api design', 'simplification', 'usability'],
  },

  {
    id: 'observer-pattern',
    name: 'Observer Pattern',
    aka: ['publish-subscribe in process', 'listeners', 'event emitter'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Let interested parties register for notifications instead of the source knowing them, decoupling the publisher at the cost of an invisible call graph.',
    useWhen: [
      'this class has to notify five other things and knows about all of them',
      'I cannot tell what happens when this event fires without grepping',
      'adding a new side effect means editing the core flow again',
      'the listener list has a memory leak and I cannot find the leaker',
    ],
    prompt:
      'Design event notification for this component and be honest about the costs alongside the decoupling. Specify the four things that make emitters go wrong: whether handlers run synchronously or are queued, what happens when one handler throws (does the rest still run, does the publisher see it), the ordering guarantee between handlers, and the unsubscribe path including who owns it. Then give me the discoverability answer — how a future reader finds every handler for an event — because an untraceable call graph is the real price of this pattern and it should be paid deliberately.',
    why:
      'Handler exceptions and forgotten unsubscribes are the standard production failures, and neither shows up in the textbook diagram. Making them part of the design spec prevents both.',
    watchOut:
      'In-process observers give decoupling without durability. If a missed notification means lost work, you need a queue and an outbox, not a listener list.',
    related: ['domain-events', 'transactional-outbox', 'event-driven-choreography', 'memory-leak-diagnosis'],
    tags: ['design patterns', 'events', 'decoupling', 'callbacks'],
  },

  {
    id: 'command-pattern',
    name: 'Command Pattern',
    aka: ['action object', 'undoable operation', 'request as object'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Turn an operation into a first-class object so it can be queued, logged, retried, undone or authorised without the caller executing it immediately.',
    useWhen: [
      'we need undo and the logic is scattered through the UI handlers',
      'I want to queue these operations and run them later',
      'every action needs an audit record and we keep forgetting some',
      'retrying a failed operation means re-running a whole request path',
    ],
    prompt:
      'Model these operations as command objects. Make each command self-contained enough to be executed later by something that has no access to the original context — that constraint is what makes queuing, replay and audit work, and it means resolving ambient state at construction time rather than at execution. List every piece of context the current code reads implicitly and decide for each whether it is captured or looked up fresh, with the consequence stated. Then, if undo is needed, show whether it is inverse-operation or state-snapshot based, and which operations cannot be undone at all.',
    why:
      'Commands that read ambient state at execution time silently break the moment they are deferred, and that is exactly why they were made commands. Forcing the capture decision prevents it.',
    watchOut:
      'A command class per trivial operation is boilerplate that buys nothing. Use it where deferral, audit or undo is actually required.',
    related: ['cqrs', 'transactional-outbox', 'idempotency-keys', 'event-sourcing'],
    tags: ['design patterns', 'undo', 'queueing', 'audit'],
  },

  {
    id: 'template-method',
    name: 'Template Method',
    aka: ['hook methods', 'skeleton algorithm'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Fix the shape of an algorithm in a base class and let subclasses fill in named steps — powerful for genuine variation, notorious for inheritance tangles.',
    useWhen: [
      'four importers follow the same steps with different details',
      'I copied a class and changed two methods in the middle',
      'the shared code is duplicated but the differences are scattered through it',
      'the base class keeps growing hooks nobody uses',
    ],
    prompt:
      'These implementations share a shape with varying steps. Show me both structural options and make me choose deliberately: an inheritance-based skeleton with overridable steps, and a composition-based version where the shape is a function taking the varying steps as parameters. Compare them on three specific things — how easy each is to test in isolation, what happens when one variant needs to skip a step entirely, and what happens when two variants need to share one of the steps but not the others. Recommend one for this case and say what would change your answer.',
    why:
      'The inheritance version is the one everyone reaches for and the one that ossifies. Comparing on skip-a-step and share-one-step is what predicts which will hurt in a year.',
    watchOut:
      'Base classes with many optional hooks become impossible to reason about, because behaviour is assembled from a class hierarchy rather than written down anywhere.',
    related: ['composition-over-inheritance', 'strategy-pattern', 'open-closed-principle', 'plugin-architecture'],
    tags: ['design patterns', 'inheritance', 'duplication', 'extensibility'],
  },

  {
    id: 'visitor-pattern',
    name: 'Visitor Pattern',
    aka: ['double dispatch', 'operations over a structure'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Move operations out of a stable type hierarchy into separate visitors, making it easy to add operations and hard to add types — the exact opposite trade to inheritance.',
    useWhen: [
      'I keep adding methods to every node class in my syntax tree',
      'the same recursive walk is written five times slightly differently',
      'adding a new report means touching every model class',
      'the type hierarchy is stable but the things we do with it keep growing',
    ],
    prompt:
      'Assess whether visitors fit this hierarchy using the expression problem as the frame: how often do we add new types versus new operations? Count both from our commit history rather than guessing. If operations dominate, design the visitor including the parts that get skipped — traversal control (who decides to recurse), accumulating results without shared mutable state, and what happens when a new type is added later and existing visitors do not handle it. If types dominate, say so and recommend keeping the operations on the types instead.',
    why:
      'This pattern is either exactly right or a disaster, and the deciding evidence is in the commit history. Making the model count instead of theorise is what makes the recommendation trustworthy.',
    watchOut:
      'In languages with pattern matching or multiple dispatch, the whole ceremony is unnecessary. Check the language before importing the structure.',
    related: ['composite-pattern', 'open-closed-principle', 'strategy-pattern', 'domain-events'],
    tags: ['design patterns', 'traversal', 'extensibility', 'type hierarchy'],
  },

  {
    id: 'composite-pattern',
    name: 'Composite Pattern',
    aka: ['part-whole hierarchy', 'tree of uniform nodes'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Treat a single item and a group of items through the same interface so callers can operate on a tree without asking what kind of node they hold.',
    useWhen: [
      'the code is full of checks for whether this is a folder or a file',
      'nested groups need the same operations as single items',
      'permissions have to roll up through a hierarchy and it is all special cases',
      'the recursive logic is duplicated wherever we walk the structure',
    ],
    prompt:
      'Model this part-whole structure so leaves and groups share an interface. Confront the standard tension directly: operations that only make sense on a group, such as adding a child. Show both resolutions — a uniform interface where leaves throw or no-op, versus a safe interface where callers must narrow the type — and pick one with an argument about which errors we would rather have. Then cover the practical hazards: cycle detection, depth limits on recursion, and how an aggregate operation over a large tree avoids the N+1 problem if nodes are loaded lazily.',
    why:
      'The uniform-versus-safe choice is the actual design decision and models present the pattern as though it does not exist. Cycles and lazy loading are where real implementations break.',
    watchOut:
      'Deep recursive structures blow stacks and hide performance costs. If the tree can be large, plan for an iterative traversal from the start.',
    related: ['visitor-pattern', 'n-plus-one-queries', 'illegal-states-unrepresentable', 'information-architecture'],
    tags: ['design patterns', 'trees', 'recursion', 'hierarchy'],
  },

  {
    id: 'builder-pattern',
    name: 'Builder Pattern',
    aka: ['fluent construction', 'step builder'],
    origin: 'Gang of Four, 1994; refined by Joshua Bloch, Effective Java',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Assemble a complex object through named steps that validate as they go, instead of a constructor with eleven positional arguments nobody can read.',
    useWhen: [
      'the constructor takes nine parameters and four of them are booleans',
      'I passed the arguments in the wrong order and it compiled fine',
      'there are five constructors and I cannot tell which to use',
      'half the fields are optional and the object can be built invalid',
    ],
    prompt:
      'Replace this construction with a builder, and make invalid construction unrepresentable rather than merely validated. Show where each required field is enforced: if the language allows it, use a staged interface so the terminal build method is only reachable once the mandatory fields are set, which beats a runtime check. Handle the cases that decide whether this is worth it — mutually exclusive options, fields whose validity depends on another field, and defaults that should be explicit rather than silent. Then show the resulting call site and confirm it reads as a description of the object rather than a sequence of setters.',
    why:
      'A builder that just moves runtime validation later is barely better than a long constructor. Pushing enforcement into the type is the version that eliminates a class of bugs.',
    watchOut:
      'Builders make objects look mutable during construction and can leak half-built instances. Keep the built result immutable and never hand out the builder.',
    related: ['test-data-builder', 'illegal-states-unrepresentable', 'immutability-by-default', 'value-object'],
    tags: ['design patterns', 'construction', 'api design', 'validation'],
  },

  {
    id: 'factory-method',
    name: 'Factory Method',
    aka: ['creation method', 'named constructor', 'abstract factory'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Put object creation behind a named method so the caller states intent rather than choosing a concrete class, and construction rules live in one place.',
    useWhen: [
      'the same object gets constructed slightly differently in each caller',
      'callers have to know which subclass to instantiate',
      'we cannot swap the implementation in tests because it is created inline',
      'the constructor cannot express the two different ways to make this thing',
    ],
    prompt:
      'Introduce creation methods for this type. Name them for the situation they serve rather than the parameters they take — fromCsvRow and forNewCustomer, not createWithArgs — since intent-revealing names are the main benefit over a constructor. Say where the factory lives and why: a static method on the type when the rules are local, a separate factory when creation needs collaborators or configuration. Then flag any place where the factory is really hiding a decision that the caller should be making explicitly, because a factory that guesses is worse than a constructor that asks.',
    why:
      'Factories multiply into layers of indirection with no clear ownership. The name-for-intent rule and the factory-hiding-a-decision check are what keep them useful.',
    watchOut:
      'A factory whose only job is to call new adds a file and buys nothing. Wait until there is a genuine choice, configuration or invariant to enforce.',
    related: ['builder-pattern', 'dependency-injection', 'value-object', 'strategy-pattern'],
    tags: ['design patterns', 'construction', 'naming', 'indirection'],
  },

  {
    id: 'singleton-tradeoffs',
    name: 'Singleton Trade-offs',
    aka: ['global instance', 'shared mutable state'],
    origin: 'Gang of Four, 1994; widely reconsidered since',
    domains: ['engineering'],
    intents: ['critique', 'decide'],
    oneLiner:
      'A single shared instance is really global state with a polite name — evaluate it on testability, lifecycle and concurrency rather than on whether one instance is enough.',
    useWhen: [
      'the tests interfere with each other through a shared instance',
      'we need two configurations at once and the design assumes one',
      'nobody can tell when this gets initialised',
      'it works until two threads touch it at the same time',
    ],
    prompt:
      'Evaluate this shared instance honestly. Separate two questions that always get conflated: does the system need exactly one of these at runtime, and must the code be unable to obtain a second one? Almost always the answer to the first is yes and the second is no, which points to a single instance wired in at the top rather than enforced by the type. Then list the concrete costs we are paying today — tests that must run in sequence, hidden initialisation order, thread safety, inability to scope per request or per tenant — and give the smallest change that removes the ones that are actually hurting.',
    why:
      'The debate is usually doctrinal. Splitting need-one from enforce-one makes it a wiring decision, which is both correct and easy to act on.',
    watchOut:
      'Removing a shared instance wholesale can be a huge refactor. Wiring it as a parameter at the boundary often captures most of the benefit for a fraction of the work.',
    related: ['dependency-injection', 'test-isolation', 'immutability-by-default', 'hermetic-tests'],
    tags: ['design patterns', 'global state', 'testability', 'lifecycle'],
  },

  {
    id: 'null-object-pattern',
    name: 'Null Object',
    aka: ['special case object', 'do-nothing implementation'],
    origin: 'Bobby Woolf, 1996; Fowler\'s Special Case pattern',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Supply a harmless implementation of an interface for the absent case so callers stop guarding against nothing on every line.',
    useWhen: [
      'every method starts with three lines of checking for missing values',
      'we get null pointer errors in production every week',
      'the anonymous user case is special-cased everywhere',
      'half this function is defensive checks and half is logic',
    ],
    prompt:
      'Replace these absence checks with an explicit representation of the empty case. First list what the caller does today when the value is missing, because the answers differ — sometimes skip, sometimes default, sometimes error — and only the skip-or-default cases are candidates. For those, define the object and state its behaviour for every method, especially the ones where doing nothing is wrong. Then be strict about the boundary: where absence is genuinely an error the code must not swallow it, so name the call sites that must keep failing loudly and explain how a reader tells the two categories apart.',
    why:
      'The failure mode is a silent no-op where an error was needed. Sorting call sites by what they do today is what keeps the pattern from hiding real faults.',
    watchOut:
      'A null object that silently absorbs mistakes turns a crash into wrong data, which is worse. Only use it where doing nothing is genuinely correct.',
    related: ['parse-dont-validate', 'illegal-states-unrepresentable', 'result-error-handling', 'defensive-programming-limits'],
    tags: ['design patterns', 'null handling', 'defensive code', 'readability'],
  },

  {
    id: 'value-object',
    name: 'Value Object',
    aka: ['whole value', 'domain primitive', 'tiny types'],
    origin: 'Ward Cunningham, Whole Value, 1994; Eric Evans, Domain-Driven Design',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Wrap a meaningful quantity — money, email address, quantity, identifier — in its own immutable type carrying its rules, instead of passing raw strings and numbers.',
    useWhen: [
      'we swapped two string parameters and nothing complained',
      'the same validation is repeated at every boundary',
      'a currency mix-up got into production',
      'ids are strings and we passed a user id where an order id belonged',
    ],
    prompt:
      'Identify the primitives in this code that are really domain concepts and wrap them. For each, define construction that cannot produce an invalid instance, equality by value not identity, and the operations that make sense on it — including the ones that must be forbidden, since preventing money from being added to money in another currency is most of the value here. Show the boundaries where raw input is converted in and out, and count how many scattered validations disappear. Then rank the candidates by how many bugs the type would have prevented, and recommend only the top few rather than wrapping everything.',
    why:
      'The technique is often applied indiscriminately until the codebase drowns in tiny classes. Ranking by prevented bugs and naming forbidden operations keeps it to the ones that pay.',
    watchOut:
      'Serialisation, database mapping and API boundaries all need conversions. If your stack makes that painful, the tax may exceed the benefit for minor concepts.',
    related: ['parse-dont-validate', 'immutability-by-default', 'illegal-states-unrepresentable', 'ubiquitous-language'],
    tags: ['domain modelling', 'types', 'validation', 'primitives'],
  },

  {
    id: 'aggregate-root',
    name: 'Aggregate Root',
    aka: ['consistency boundary', 'aggregate design', 'transactional boundary'],
    origin: 'Eric Evans, Domain-Driven Design, 2003; Vaughn Vernon on aggregate sizing',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Group the objects that must stay consistent together behind one entry point, and make that group the unit of transaction and of concurrency control.',
    useWhen: [
      'two users edited related records and the totals no longer add up',
      'a transaction locks half the database and everything queues behind it',
      'I do not know which objects should be saved together',
      'we load an enormous object graph to change one field',
    ],
    prompt:
      'Design the consistency boundaries for this model. Drive it from invariants, not from the object graph: list every rule that must never be violated even momentarily, and let each rule pull the objects it constrains into one boundary. Rules that can tolerate brief inconsistency belong across boundaries and are handled by events instead — say which of ours those are. Then size the result: name any boundary that would be modified by many users at once or that would load hundreds of children, since those are the ones that cause contention. Finish with how one boundary references another, which should be by identity only.',
    why:
      'Aggregates drawn from the entity-relationship diagram are always too big. Deriving them from invariants and then checking for contention is what produces workable sizes.',
    watchOut:
      'Small aggregates push you into eventual consistency between them, which the business has to accept. Get agreement on the tolerated staleness before designing around it.',
    related: ['bounded-context', 'domain-events', 'optimistic-concurrency', 'saga-pattern'],
    tags: ['domain-driven design', 'consistency', 'transactions', 'modelling'],
  },

  {
    id: 'domain-events',
    name: 'Domain Events',
    aka: ['business events', 'something happened records'],
    origin: 'Eric Evans and Martin Fowler; central to event-driven DDD',
    domains: ['engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Record the meaningful things that happened in the business as named past-tense facts, and let reactions subscribe rather than being wired into the action.',
    useWhen: [
      'placing an order now triggers seven side effects inside one function',
      'adding a new notification means editing core business logic again',
      'the audit trail is reconstructed from database timestamps',
      'nobody can list what happens when a customer cancels',
    ],
    prompt:
      'Model the meaningful business occurrences here as named past-tense facts. Name them in the language the business uses, and be strict that an event describes what happened rather than what should happen next — OrderPlaced, not SendConfirmationEmail — because command-shaped events recreate the coupling you are removing. For each, define the payload using the rule that consumers should not need to call back for basic context, but the event must not become a copy of the whole record. Then state which reactions must happen inside the original transaction and which may be eventual, since that split is the real design decision.',
    why:
      'The naming rule and the in-transaction-versus-eventual split are the two places this goes wrong, and both are invisible until something is missing in production.',
    watchOut:
      'Events published before the transaction commits can describe things that never happened. That is what an outbox is for.',
    related: ['transactional-outbox', 'event-driven-choreography', 'aggregate-root', 'event-sourcing'],
    tags: ['domain-driven design', 'events', 'decoupling', 'audit'],
  },

  {
    id: 'specification-pattern',
    name: 'Specification Pattern',
    aka: ['composable business rules', 'predicate objects'],
    origin: 'Eric Evans and Martin Fowler, 2002',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Express each business rule as a small composable predicate that can be combined with and, or and not, and reused for validation, selection and construction.',
    useWhen: [
      'the eligibility rules are duplicated in the query and in the validation',
      'the same condition is written in SQL and again in code and they disagree',
      'the where clause has eleven conditions and nobody knows why',
      'a rule changed and we only updated it in one of the three places',
    ],
    prompt:
      'Extract these business rules into composable predicates. The design problem is the two execution contexts — in memory over an object, and pushed down into a database query — so address it directly: show which of our rules can be translated to a query and which can only run in memory, and what the code does when a combination mixes both. Name each predicate after the business rule rather than the field it inspects. Then show a combination reading like the policy statement it implements, and identify the rules currently duplicated between query and validation that this would unify.',
    why:
      'Everyone builds the in-memory version and then discovers it cannot be used for querying. Forcing the translation question up front decides whether the pattern is worth it here.',
    watchOut:
      'A composition of ten predicates can be far slower than one hand-written query. Keep an eye on what the abstraction generates.',
    related: ['ubiquitous-language', 'value-object', 'decision-table-testing', 'query-plan-reading'],
    tags: ['domain modelling', 'business rules', 'composition', 'validation'],
  },

  {
    id: 'ubiquitous-language',
    name: 'Ubiquitous Language',
    aka: ['shared domain vocabulary', 'domain glossary'],
    origin: 'Eric Evans, Domain-Driven Design, 2003',
    domains: ['engineering', 'product'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Use one vocabulary across conversation, documentation and code, so the translation step where meaning gets lost simply does not exist.',
    useWhen: [
      'support calls it a subscription and the code calls it a plan',
      'every conversation starts with clarifying what a word means',
      'the database columns are named after a process we stopped doing years ago',
      'requirements get misimplemented because a word meant something else',
    ],
    prompt:
      'Build a glossary from this material and then use it as an audit. First extract every term with its business definition, marking synonyms and near-synonyms explicitly. Then compare against the code: list every place a term in the code differs from the business word, and every place one business word maps to several code names or the reverse. The many-to-one cases are the interesting ones because they usually mean two different concepts are being conflated. Recommend the renames, in order of how often the confused terms appear in defect reports, and say which are safe mechanical changes.',
    why:
      'A glossary alone changes nothing. Using it as a diff against the codebase turns vocabulary work into a concrete rename list with an evidence-based order.',
    watchOut:
      'The same word legitimately means different things in different parts of the business. Forcing one definition across them is what bounded contexts exist to avoid.',
    related: ['bounded-context', 'naming-as-design', 'value-object', 'event-storming'],
    tags: ['domain-driven design', 'naming', 'communication', 'glossary'],
  },

  {
    id: 'event-storming',
    name: 'Event Storming',
    aka: ['big picture modelling', 'sticky note domain workshop'],
    origin: 'Alberto Brandolini, 2013',
    domains: ['engineering', 'product'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Map a business process as a timeline of events, then layer on commands, actors, policies and systems until the boundaries and the confusion both become visible.',
    useWhen: [
      'nobody has the whole picture of how this process works end to end',
      'we are about to split a system and do not know where to cut',
      'each team knows their part and the handoffs are a mystery',
      'the process documentation is five years out of date',
    ],
    prompt:
      'Facilitate this as a written event storm. Start with the timeline of business occurrences in past tense, unordered at first, then sequence them. Layer on what triggers each — a user command, a policy reacting to a previous event, or an external system — and who performs it. The output that matters most is the hot spots: every place where the participants would disagree, where a term means two things, or where nobody knows what happens. Surface those explicitly as a list. Then propose candidate boundaries where the event flow is thin and the vocabulary shifts, and say which are confident and which are guesses.',
    why:
      'The value is in the disagreements surfaced, not in the tidy diagram. Explicitly asking for hot spots and marking boundary confidence is what makes the output actionable.',
    watchOut:
      'A storm run without the people who actually know the process produces a confident fiction. The technique is a facilitation structure, not a substitute for domain knowledge.',
    related: ['bounded-context', 'ubiquitous-language', 'domain-events', 'aggregate-root'],
    tags: ['domain-driven design', 'workshop', 'process mapping', 'boundaries'],
  },

  {
    id: 'tell-dont-ask',
    name: 'Tell, Don\'t Ask',
    aka: ['behaviour with data', 'avoid feature envy'],
    origin: 'Alec Sharp, 1997; popularised by the Pragmatic Programmers',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Send an object a request rather than pulling out its data and deciding for it, so the rules live next to the state they constrain.',
    useWhen: [
      'the service class reads six fields off the model and then decides',
      'the same calculation is done by every caller slightly differently',
      'our objects are just bags of getters and setters',
      'business rules are spread across the callers instead of the thing they govern',
    ],
    prompt:
      'Find the places here where a caller extracts state and makes a decision that belongs to the object it took the state from. For each, show the move: the method that should exist on the object, and what it returns. Then apply the discriminator that stops this becoming dogma — the logic belongs to the object only if it depends on that object\'s internals; logic that coordinates several objects or depends on external policy belongs in a service and should stay there. Sort the findings into those two piles and only refactor the first. Finish with what stops being possible once the fields are private.',
    why:
      'Applied without the discriminator, this principle inflates domain objects with orchestration logic. Splitting internal-state logic from coordination logic is what makes it safe to apply.',
    watchOut:
      'Data transfer objects at boundaries are supposed to be dumb. Do not push behaviour into serialisation shapes.',
    related: ['law-of-demeter', 'single-responsibility', 'value-object', 'aggregate-root'],
    tags: ['design principles', 'encapsulation', 'object design', 'refactoring'],
  },

  {
    id: 'law-of-demeter',
    name: 'Law of Demeter',
    aka: ['principle of least knowledge', 'one dot rule', 'train wreck code'],
    origin: 'Ian Holland, Northeastern University, 1987',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Talk only to your immediate collaborators, because every chained call through an object graph is a dependency on a structure you do not own.',
    useWhen: [
      'a change to a nested class broke code three levels away',
      'the code is full of long chains of dot calls',
      'testing this needs a mock returning a mock returning a mock',
      'renaming a field on an inner object broke six unrelated modules',
    ],
    prompt:
      'Find the chained navigations through object structure in this code and assess each. Distinguish real violations — where we reach through one object to reason about another\'s internals — from fluent interfaces and collection pipelines that are chained by design and are not violations at all. For the real ones, propose the delegating method that would remove the chain, and then apply the check that keeps this from generating dozens of pass-through methods: does the intermediate object have a reason to expose this as behaviour of its own? If not, the right fix is usually to pass the inner object directly rather than to delegate.',
    why:
      'Naive application produces a wall of forwarding methods that is worse than the chains. Distinguishing fluent chains from real reach-through, and preferring direct passing, is the corrective.',
    watchOut:
      'Configuration objects, builders and query DSLs chain intentionally. Enforcing this by lint rule punishes them for no benefit.',
    related: ['tell-dont-ask', 'interface-segregation', 'test-doubles-taxonomy', 'coupling-metrics'],
    tags: ['design principles', 'coupling', 'encapsulation', 'refactoring'],
  },

  {
    id: 'single-responsibility',
    name: 'Single Responsibility Principle',
    aka: ['SRP', 'one reason to change', 'axis of change'],
    origin: 'Robert C. Martin, SOLID principles, early 2000s',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'A module should answer to one stakeholder or one reason to change — the useful reading is about who requests the change, not about how many methods it has.',
    useWhen: [
      'this class is two thousand lines and does everything',
      'a reporting change forces us to retest the billing path',
      'two teams keep colliding in the same file',
      'I cannot name this class without using the word manager',
    ],
    prompt:
      'Assess this module against the stakeholder reading of single responsibility rather than the size reading. For each method, name the role or business function that would request a change to it — finance, operations, compliance, the mobile client — and group by that. If the groups are disjoint, that is the split, and it is a much better argument than the class being long. Then check the counter-evidence: pieces that different stakeholders would both want changed together should stay together. Recommend a split only where the commit history shows those groups actually changing at different times.',
    why:
      'The line-count reading of this principle produces pointless fragmentation. The stakeholder reading plus commit-history evidence turns it into a defensible boundary argument.',
    watchOut:
      'Splitting by responsibility can raise coupling if the pieces need constant coordination. Cohesion and coupling have to be judged together.',
    related: ['package-by-feature', 'coupling-metrics', 'bounded-context', 'tell-dont-ask'],
    tags: ['design principles', 'cohesion', 'modularity', 'refactoring'],
  },

  {
    id: 'open-closed-principle',
    name: 'Open-Closed Principle',
    aka: ['OCP', 'open for extension closed for modification'],
    origin: 'Bertrand Meyer, 1988; reframed by Robert C. Martin',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Design so that new behaviour arrives as new code rather than edits to working code — but only along the axis where variation actually happens.',
    useWhen: [
      'adding the tenth report type means editing the same file again',
      'every new country requires changes in eleven places',
      'we broke an existing feature while adding a new one',
      'the switch statement grows with every customer request',
    ],
    prompt:
      'Identify the axis of variation in this code from evidence rather than speculation: look at what has actually been added repeatedly — new types, new formats, new regions — and design the extension point along that axis only. Show what adding the next variant would look like as pure addition. Then state clearly what is now hard: extension points make one axis cheap and every other axis more expensive, so name the change we would find harder after this refactor. If the history shows variation along two axes, say so and recommend which one to make cheap, because you cannot have both.',
    why:
      'Speculative extension points are the main cost of this principle. Anchoring the axis to actual history and naming what gets harder is what prevents over-engineering.',
    watchOut:
      'Guessing the axis wrong is worse than not abstracting at all, because the abstraction now blocks the change you do need. Wait for the third instance.',
    related: ['strategy-pattern', 'plugin-architecture', 'yagni', 'rule-of-three-duplication'],
    tags: ['design principles', 'extensibility', 'abstraction', 'variation'],
  },

  {
    id: 'liskov-substitution',
    name: 'Liskov Substitution Principle',
    aka: ['LSP', 'behavioural subtyping', 'substitutability'],
    origin: 'Barbara Liskov, 1987; formalised with Jeannette Wing, 1994',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'A subtype must be usable anywhere its parent is without the caller noticing — which constrains preconditions, postconditions and exceptions, not just signatures.',
    useWhen: [
      'the subclass throws not-implemented for half the interface',
      'code that works for one implementation breaks for another',
      'we had to add a check for which subclass we actually have',
      'the read-only version of this type still has a save method',
    ],
    prompt:
      'Check these implementations for substitutability using the three rules that matter beyond signatures: a subtype may not strengthen what it demands of callers, may not weaken what it promises, and may not throw exceptions the parent did not declare. Test each implementation against every documented and undocumented expectation of the parent, including things like ordering, idempotence, thread safety and performance class — the last one matters because a hundredfold slower implementation breaks callers just as effectively. For each violation, say whether the fix is to change the subtype, split the interface, or admit these are not the same abstraction.',
    why:
      'Signature-level checking passes trivially and misses every real violation. Including implicit contracts like ordering and cost is where the actual breakage lives.',
    watchOut:
      'Type checkers cannot see behavioural contracts. A shared test suite run against every implementation is the only enforcement that works.',
    related: ['interface-segregation', 'contract-testing', 'composition-over-inheritance', 'null-object-pattern'],
    tags: ['design principles', 'inheritance', 'contracts', 'polymorphism'],
  },

  {
    id: 'interface-segregation',
    name: 'Interface Segregation Principle',
    aka: ['ISP', 'role interfaces', 'fat interface'],
    origin: 'Robert C. Martin, SOLID principles',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Clients should not be forced to depend on methods they never call — split wide interfaces into the roles that consumers actually need.',
    useWhen: [
      'implementing this interface means writing eight methods I do not need',
      'a change to a method nobody uses forced a rebuild everywhere',
      'the test double has to stub twelve methods to test one',
      'our repository interface has forty methods on it',
    ],
    prompt:
      'Split this interface by consumer need. Build the usage matrix first — every consumer against every method — because the clusters in that matrix are the interfaces, and they are usually not the ones you would guess. Define role interfaces from the clusters, named for the role rather than the type, and show the one implementation that still implements several of them. Then note the cost side: more interfaces means more names to learn and more places to look, so recommend the split only where the matrix shows genuinely disjoint clusters rather than splitting on principle.',
    why:
      'The usage matrix converts an aesthetic argument into evidence, and it routinely reveals that the natural split is by role rather than by the type\'s own structure.',
    watchOut:
      'Excessive segregation scatters a concept across many tiny names. If every consumer uses a different subset, the interface may be fine and the consumers may be doing too much.',
    related: ['law-of-demeter', 'single-responsibility', 'liskov-substitution', 'api-ergonomics'],
    tags: ['design principles', 'interfaces', 'coupling', 'modularity'],
  },

  {
    id: 'composition-over-inheritance',
    name: 'Composition Over Inheritance',
    aka: ['favour composition', 'has-a over is-a', 'delegation'],
    origin: 'Gang of Four, Design Patterns, 1994',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Assemble behaviour by holding collaborators rather than by extending a base class, because inheritance couples you to a hierarchy you cannot change later.',
    useWhen: [
      'the class hierarchy is five levels deep and nobody understands it',
      'I need behaviour from two different base classes',
      'a change in the base class broke six subclasses in different ways',
      'the subclass overrides half the parent to disable it',
    ],
    prompt:
      'Rework this hierarchy into composition. For each subclass, list what it inherits and reuses, what it inherits and overrides, and what it inherits and ignores — the second and third categories are the evidence the hierarchy is wrong. Then design the collaborator objects that would supply the varying behaviour, and show the wiring for each former subclass. Be explicit about what gets worse: more objects to construct, more indirection at the call site, and the loss of the compiler enforcing that every variant implements a step. Say whether that trade is worth it here or whether the hierarchy is actually fine.',
    why:
      'The inherit-and-ignore audit gives an objective read on whether a hierarchy is modelling an is-a relationship or being used as code reuse, which is the actual question.',
    watchOut:
      'Composition can scatter behaviour across many small objects with no single place that describes the whole. Shallow inheritance for genuine specialisation is not a sin.',
    related: ['template-method', 'liskov-substitution', 'decorator-pattern', 'plugin-architecture'],
    tags: ['design principles', 'inheritance', 'composition', 'refactoring'],
  },

  {
    id: 'yagni',
    name: 'You Aren\'t Gonna Need It',
    aka: ['YAGNI', 'build it when you need it'],
    origin: 'Ron Jeffries, Extreme Programming, late 1990s',
    domains: ['engineering'],
    intents: ['decide', 'prioritize'],
    oneLiner:
      'Do not build for a requirement you only imagine, because the cost is paid now, the guess is usually wrong, and the wrong abstraction is harder to remove than to add.',
    useWhen: [
      'we are adding configuration for a case nobody has asked for',
      'the design supports four backends and we have one',
      'someone said we might need this later so it is in the plan',
      'the generic version is taking three times as long as the specific one',
    ],
    prompt:
      'Review this design for speculative generality. For each configurable option, extension point and abstraction, ask three questions: is there a committed requirement for it today, what does it cost us now in code and cognitive load, and how expensive would it be to add later if we skipped it? The third question is the one that decides — cheap-to-add-later means cut it now, expensive-to-retrofit means it may be worth keeping. Name the small number of decisions that are genuinely hard to reverse, such as data model and public interface shape, and treat only those as worth designing ahead for.',
    why:
      'Applied bluntly this principle also argues against necessary foresight. Sorting by reversibility separates speculative generality from the decisions that really are one-way.',
    watchOut:
      'Data formats, public interfaces and stored records are much harder to change later than internal code. Applying this uniformly to them is how you end up with a schema you cannot migrate.',
    related: ['rule-of-three-duplication', 'open-closed-principle', 'type-1-type-2-decisions', 'walking-skeleton'],
    tags: ['design principles', 'simplicity', 'scope', 'over-engineering'],
  },

  {
    id: 'rule-of-three-duplication',
    name: 'Rule of Three',
    aka: ['wait for the third instance', 'duplication before abstraction'],
    origin: 'Don Roberts, quoted in Fowler\'s Refactoring, 1999',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Tolerate the second copy and abstract on the third, because two examples rarely show you which parts vary and which are essential.',
    useWhen: [
      'I have written something similar twice and want to extract it',
      'the shared helper now has five boolean flags to serve its callers',
      'we deduplicated early and the abstraction fights us constantly',
      'two things look identical but I suspect they will diverge',
    ],
    prompt:
      'Assess whether these similar pieces should be unified. Apply the test that matters more than counting: are they the same because they express the same rule, or the same by coincidence? Coincidental duplication that gets merged creates a shared component that must change for two unrelated reasons — the worst kind of coupling. For each candidate, name the rule both instances implement, and if you cannot name one, recommend leaving them separate. If you can, show the abstraction and predict what the third caller would need, and check whether that need fits without adding a flag.',
    why:
      'Counting occurrences is the weak version of this heuristic. The same-rule-versus-same-shape test is what separates helpful deduplication from coupling unrelated code together.',
    watchOut:
      'Duplication of security-critical or correctness-critical logic should be unified immediately regardless of count, because divergence there is a defect rather than an inconvenience.',
    related: ['yagni', 'open-closed-principle', 'single-responsibility', 'refactoring-catalog'],
    tags: ['design principles', 'duplication', 'abstraction', 'coupling'],
  },

  {
    id: 'principle-of-least-astonishment',
    name: 'Principle of Least Astonishment',
    aka: ['least surprise', 'POLA'],
    origin: 'Long-standing in interface design; formalised in language design literature',
    domains: ['engineering', 'design'],
    intents: ['critique', 'structure'],
    oneLiner:
      'A component should behave the way a competent user of it would guess, because surprising behaviour is a defect even when it is documented.',
    useWhen: [
      'people keep using this function wrong and the docs say it clearly',
      'the getter has a side effect and it bit somebody',
      'the flag is called enable but it disables things in one mode',
      'every new hire makes the same mistake with this API',
    ],
    prompt:
      'Audit this interface for surprise. For each element, state what a competent user would predict from the name and signature alone, then what it actually does, and flag every gap. Pay particular attention to the classic surprises: a read that mutates, an operation that is not idempotent when the name implies it is, silent truncation or coercion, an argument order that differs from the neighbouring function, a default that differs from the platform convention, and an error case that returns success. For each gap, recommend either changing the behaviour or renaming, and say which is cheaper given existing callers.',
    why:
      'Named surprise categories — read-that-mutates, inconsistent argument order, silent coercion — turn a subjective complaint into a checklist that catches specific defects.',
    watchOut:
      'Expectations are shaped by the surrounding ecosystem. What is astonishing in one language is idiomatic in another, so judge against the conventions your users actually have.',
    related: ['api-ergonomics', 'naming-as-design', 'error-message-design', 'idempotency-keys'],
    tags: ['design principles', 'api design', 'usability', 'naming'],
  },

  {
    id: 'immutability-by-default',
    name: 'Immutability by Default',
    aka: ['persistent data structures', 'value semantics', 'no shared mutable state'],
    origin: 'Functional programming tradition; mainstreamed via Rich Hickey and Rust',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Make data unchangeable after construction so aliasing bugs, concurrent corruption and impossible-to-trace mutations stop being possible.',
    useWhen: [
      'something changed this list and I cannot find what',
      'we passed an object to a function and it came back different',
      'two threads corrupted the same structure',
      'a cached value got mutated by a caller and poisoned everything downstream',
    ],
    prompt:
      'Identify the mutable state in this code and propose making it immutable. Sort by what the mutation is actually for: accumulation in a loop (fine, keep it local), caching (needs a different mechanism), and shared state that outlives a single call (the dangerous kind). For the last category, show the immutable version and the copy-on-write or structural sharing that keeps it affordable. Then quantify the cost rather than hand-waving: where we would copy large structures frequently, say so and propose the localised exception. Finish with the aliasing bugs the change would have prevented in our defect history.',
    why:
      'Blanket immutability advice ignores allocation cost and gets rejected. Sorting mutation by purpose and pricing the copies is what makes the recommendation adoptable.',
    watchOut:
      'Deep copies on a hot path can dominate runtime. Immutability at boundaries with controlled mutation inside a scope is often the right compromise.',
    related: ['value-object', 'functional-core-imperative-shell', 'singleton-tradeoffs', 'data-race-diagnosis'],
    tags: ['design principles', 'state', 'concurrency', 'correctness'],
  },

  {
    id: 'illegal-states-unrepresentable',
    name: 'Make Illegal States Unrepresentable',
    aka: ['type-driven design', 'algebraic data modelling'],
    origin: 'Yaron Minsky, Jane Street, 2011',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Choose types such that the invalid combinations cannot be written down, moving whole categories of bug from runtime checks to compile errors.',
    useWhen: [
      'we have three nullable fields and only certain combinations are valid',
      'there is a comment saying these two fields must never both be set',
      'validation is duplicated everywhere because the type allows nonsense',
      'the record has a status field and fields that only apply to some statuses',
    ],
    prompt:
      'Redesign these types so the invalid states cannot be constructed. Start by enumerating the combinations the current type permits and marking which are meaningful — the ratio of legal to representable is the size of the problem. Then propose the replacement using sum types or the nearest equivalent in our language, where each case carries exactly the fields that case needs. Show what happens at the edges where data arrives from a database or an API in the loose shape, since that conversion is where the remaining validation must live. Finally, list the runtime checks that become unnecessary.',
    why:
      'The legal-to-representable ratio makes an abstract modelling argument concrete, and the boundary conversion is the part that decides whether the design survives contact with persistence.',
    watchOut:
      'Languages without sum types can only approximate this, and the workaround can be more confusing than a validated record. Judge against what your type system can actually express.',
    related: ['parse-dont-validate', 'value-object', 'state-pattern', 'mvi-architecture'],
    tags: ['design principles', 'types', 'validation', 'correctness'],
  },

  {
    id: 'parse-dont-validate',
    name: 'Parse, Don\'t Validate',
    aka: ['parsing over validation', 'validation at the boundary'],
    origin: 'Alexis King, 2019',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Convert untrusted input into a type that proves it was checked, so downstream code cannot forget the check because the type already carries the evidence.',
    useWhen: [
      'we validate the same input at four different layers',
      'somebody added a code path that skipped validation',
      'the function checks its arguments even though the caller already did',
      'we cannot tell from the type whether this string has been sanitised',
    ],
    prompt:
      'Restructure this validation into a parse at the boundary. Define the type that can only exist if the check passed, and show the single conversion function that produces it, returning a result rather than throwing. Then trace downstream and delete every re-check that is now impossible to fail — that deletion is the measurable payoff, so count them. Identify the places where input enters the system that currently bypass this path, since one unparsed entry point defeats the design. Finish with the error reporting: parsing must accumulate all the problems in the input, not stop at the first.',
    why:
      'The idea is easy to agree with and rarely completed. Counting the deleted re-checks and hunting for bypass entry points is what turns it from a nicer shape into fewer defects.',
    watchOut:
      'This works best where the type system can enforce it. In dynamic languages the discipline has to be maintained by convention and review, which is weaker.',
    related: ['illegal-states-unrepresentable', 'value-object', 'input-validation-boundary', 'result-error-handling'],
    tags: ['design principles', 'validation', 'types', 'boundaries'],
  },

  {
    id: 'railway-oriented-programming',
    name: 'Railway-Oriented Programming',
    aka: ['result chaining', 'error track', 'monadic error handling'],
    origin: 'Scott Wlaschin, F# for Fun and Profit, 2013',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Model a pipeline as two tracks — success and failure — so each step either continues or diverts, and the error path stops being a maze of nested conditionals.',
    useWhen: [
      'the function is a pyramid of if-error-return blocks',
      'every step needs the same error handling and it is copy-pasted',
      'the happy path is invisible under error checking',
      'an error in step three has to be reported with context from step one',
    ],
    prompt:
      'Restructure this sequence of fallible steps into a chain where each step either continues or short-circuits. Define the error type first, and make it carry enough to produce a good message at the end — which step failed, with what input, and whether it is retryable — because a chain that collapses everything to a single opaque error is worse than nested conditionals. Show the composition, then handle the two awkward cases explicitly: a step that must run regardless of earlier failure (cleanup), and a set of independent validations where we want all failures rather than the first.',
    why:
      'Collapsing errors into one type loses diagnostic information, and cleanup steps break naive chains. Requiring both up front produces a design that survives real error handling.',
    watchOut:
      'In languages without good sum types or syntax support, this reads as unfamiliar machinery. The readability gain has to outweigh the idiom cost for your team.',
    related: ['result-error-handling', 'parse-dont-validate', 'functional-core-imperative-shell', 'error-message-design'],
    tags: ['error handling', 'composition', 'functional', 'pipelines'],
  },

  {
    id: 'functional-core-imperative-shell',
    name: 'Functional Core, Imperative Shell',
    aka: ['pure core', 'effects at the edge'],
    origin: 'Gary Bernhardt, 2012',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Concentrate decisions in pure functions with no input or output, and keep all the effects in a thin outer layer that mostly just moves data.',
    useWhen: [
      'testing our logic requires a database and a network call',
      'the business rules are tangled with the code that saves and sends',
      'I want fast unit tests but everything touches infrastructure',
      'the same logic has to run in a job and in a request handler',
    ],
    prompt:
      'Split this code into a decision-making core with no effects and a thin shell that performs them. The technique is to make the core return descriptions of what should happen rather than performing it — a list of commands, not a set of calls — so start by defining that return shape. Then show the shell interpreting it. Confront the hard case honestly: logic that needs to fetch more data based on what it found. Show how to restructure so all the data is gathered before the decision, and say where that is genuinely impossible and what compromise you would accept there.',
    why:
      'The read-then-decide-then-write shape is what makes the split work, and the interleaved-fetch case is where teams give up. Naming it as the hard case and addressing it is the difference.',
    watchOut:
      'Gathering all possible data up front can be far more expensive than fetching lazily. Where the data is large or rarely needed, the pure core becomes a performance problem.',
    related: ['immutability-by-default', 'hexagonal-architecture', 'railway-oriented-programming', 'testing-trophy'],
    tags: ['architecture', 'purity', 'testability', 'side effects'],
  },

  {
    id: 'dependency-injection',
    name: 'Dependency Injection',
    aka: ['inversion of control', 'constructor injection', 'wiring'],
    origin: 'Martin Fowler, 2004; named from the inversion of control literature',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Hand a component its collaborators rather than letting it construct or locate them, so composition happens in one place you can see.',
    useWhen: [
      'the class creates its own database connection inside the constructor',
      'I cannot substitute anything in tests without patching globals',
      'configuration is read from the environment deep inside business logic',
      'nobody can tell what this component actually depends on',
    ],
    prompt:
      'Make this component\'s dependencies explicit. List everything it currently reaches for — constructed objects, static calls, environment variables, service locators, ambient context — and convert them into things it is handed. Then confront the two failure modes: a constructor with fifteen parameters, which usually signals the class does too much rather than that injection is wrong, and a container configuration so dynamic that nobody can trace what is wired to what. Recommend plain manual wiring at the entry point if the graph is small enough, and say at what size a container starts paying for itself.',
    why:
      'The pattern is usually conflated with the container. Separating the principle from the framework, and treating a huge constructor as a design smell, is what makes the advice actionable.',
    watchOut:
      'Reflection-based containers turn wiring errors from compile-time into startup-time or worse, request-time. That trade is often not worth it for a small service.',
    related: ['dependency-inversion', 'singleton-tradeoffs', 'factory-method', 'test-seams'],
    tags: ['design principles', 'wiring', 'testability', 'inversion of control'],
  },

  {
    id: 'vertical-slice-architecture',
    name: 'Vertical Slice Architecture',
    aka: ['feature slices', 'slice by use case'],
    origin: 'Jimmy Bogard, 2018',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Organise code by use case end to end rather than by technical layer, so a change touches one slice instead of a controller, a service, a mapper and a repository.',
    useWhen: [
      'a simple change means editing five files in five folders',
      'the layers all mirror each other and the mapping code is enormous',
      'two features share a service class and keep interfering',
      'I cannot find everything involved in one feature',
    ],
    prompt:
      'Reorganise this by use case rather than by layer. For one representative feature, show every file it currently touches and what the co-located version would look like. Then address the objection that decides whether this works: duplication between slices. State the rule for when logic is promoted out of a slice into shared code — genuinely shared domain rules yes, incidentally similar code no — and show how a slice depends on shared code without slices depending on each other. Finish with what gets worse: cross-cutting changes such as adding a field to every response now touch many slices.',
    why:
      'This trades one kind of change cost for another, and the honest version of the argument names both. The promotion rule is what stops slices from either duplicating everything or collapsing back into layers.',
    watchOut:
      'Slices work best where features are genuinely independent. A system whose features all manipulate the same rich domain model may be better served by shared domain code.',
    related: ['package-by-feature', 'clean-architecture', 'bounded-context', 'single-responsibility'],
    tags: ['architecture', 'code organisation', 'features', 'layers'],
  },

  {
    id: 'package-by-feature',
    name: 'Package by Feature',
    aka: ['screaming architecture', 'organise by domain not by type'],
    origin: 'Robert C. Martin, Screaming Architecture, 2011',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Top-level directories should name what the system does, not what framework it uses — controllers and models are a filing system, not an architecture.',
    useWhen: [
      'the repository root tells you the framework but not the business',
      'related code is scattered across folders named after patterns',
      'we have a models directory with two hundred files in it',
      'deleting a feature means hunting through every layer folder',
    ],
    prompt:
      'Reorganise this repository so the top level names business capabilities. Propose the structure, then validate it with two tests: could a new engineer guess which directory a given feature lives in without asking, and could an entire capability be deleted by removing one directory plus a small number of known references? Report where the second test fails, because those are the real coupling points and they are worth knowing regardless of whether we do the move. Then give the migration order, starting with the capability that has the fewest inbound references.',
    why:
      'The delete-a-capability test is a precise measure of modularity and produces a coupling report as a by-product, which is useful even if the reorganisation never happens.',
    watchOut:
      'Directory structure is cosmetic if the dependencies still run everywhere. Moving files without fixing the import graph produces a nicer-looking tangle.',
    related: ['vertical-slice-architecture', 'bounded-context', 'single-responsibility', 'coupling-metrics'],
    tags: ['architecture', 'code organisation', 'modularity', 'naming'],
  },

  {
    id: 'plugin-architecture',
    name: 'Plugin Architecture',
    aka: ['extension points', 'microkernel architecture', 'hook system'],
    origin: 'Microkernel pattern; Buschmann and colleagues, POSA, 1996',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'A small stable core plus registered extensions, where the core knows the contract and nothing about the extensions themselves.',
    useWhen: [
      'every customer needs a slightly different variation of the workflow',
      'we keep forking the codebase per client',
      'third parties want to extend the product and we have no story',
      'the core is full of conditionals for special cases',
    ],
    prompt:
      'Design an extension mechanism for this system. The contract is the whole product, so specify it precisely: the exact hook points, what data an extension receives, what it may return, whether extensions can veto or only observe, ordering when several register for the same point, and what happens when one throws or hangs. Then define the versioning and isolation policy — how the core changes without breaking extensions, and what an extension cannot do such as blocking the main path or reading other extensions\' state. Finally, name the flexibility we are deliberately not offering, since an unbounded hook system becomes ungovernable.',
    why:
      'Plugin systems fail on the operational details — error handling, ordering, versioning — rather than on the concept. Specifying the refusals is what keeps the core changeable.',
    watchOut:
      'Every hook point is a public interface you must support forever. Start with fewer than you think you need; adding one later is easy, removing one is not.',
    related: ['open-closed-principle', 'strategy-pattern', 'api-versioning-strategy', 'feature-flag-hygiene'],
    tags: ['architecture', 'extensibility', 'contracts', 'customisation'],
  },

  {
    id: 'object-calisthenics',
    name: 'Object Calisthenics',
    aka: ['nine rules exercise', 'design constraints practice'],
    origin: 'Jeff Bay, The ThoughtWorks Anthology, 2008',
    domains: ['engineering', 'learning'],
    intents: ['critique', 'explain'],
    oneLiner:
      'A set of deliberately extreme rules — one level of indentation, no else, wrap primitives, no getters — used as an exercise to feel where a design is tangled.',
    useWhen: [
      'I know this code is bad but I cannot articulate why',
      'our team writes code that works and reads badly',
      'I want a concrete exercise rather than general advice about clean code',
      'reviews keep producing vague comments about complexity',
    ],
    prompt:
      'Apply the nine constraints to this code as an exercise, not as a policy: one level of indentation per method, no else keyword, wrap primitives and strings in types, first-class collections, one dot per line, no abbreviations, keep classes small, no more than two instance variables, no getters or setters. Rewrite the code obeying all nine, then — and this is the actual output — tell me which constraints were painful and what that pain revealed about the design. Recommend which two or three are worth keeping permanently in this codebase and which were only useful as diagnostics.',
    why:
      'Taken as rules these are impractical; taken as diagnostics they are excellent. Asking which constraints hurt and why converts the exercise into a specific design finding.',
    watchOut:
      'Enforcing these in review or lint produces contorted code and resentment. The value is entirely in the noticing, not in the compliance.',
    related: ['tell-dont-ask', 'value-object', 'cyclomatic-complexity', 'code-review-checklist'],
    tags: ['learning', 'code quality', 'exercise', 'design principles'],
  },
]
