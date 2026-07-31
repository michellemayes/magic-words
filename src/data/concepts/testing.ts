import type { Concept } from '../types'

export const testing: Concept[] = [
  {
    id: 'test-pyramid',
    name: 'Test Pyramid',
    aka: ['testing pyramid', 'test distribution'],
    origin: 'Mike Cohn, Succeeding with Agile, 2009',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Shape a suite so that most checks are fast and narrow, fewer are integrated, and only a handful drive the whole system end to end.',
    useWhen: [
      'our automated checks take forty minutes and everyone skips them',
      'we have hundreds of browser scripts and they break constantly',
      'a one-line change makes twenty unrelated checks go red',
      'I do not know what level to write this check at',
      'the suite is slow but I am scared to delete anything from it',
    ],
    prompt:
      'Audit the shape of this test suite. Count what exists at each level, then report the two numbers that actually matter: wall-clock time per level, and failures per level that turned out to be genuine defects rather than environment noise. A level that is slow and mostly noisy is the one to shrink regardless of what the ideal shape says. Then, for each broad end-to-end case, tell me whether the behaviour it protects could be covered by a narrower test plus one integration check, and name the ones that genuinely cannot be pushed down because the risk lives in the wiring itself.',
    why:
      'Asked about the pyramid, a model will restate the shape you already know. Making it compute cost and signal per level turns the diagram into a specific list of tests to move or delete.',
    watchOut:
      'The shape is a consequence, not a target. A system whose risk really is in integration deserves a fatter middle, and forcing a pyramid on it just moves bugs to production.',
    related: ['testing-trophy', 'hermetic-tests', 'risk-based-testing', 'test-impact-analysis'],
    tags: ['testing', 'test strategy', 'suite design', 'feedback speed'],
  },

  {
    id: 'testing-trophy',
    name: 'Testing Trophy',
    aka: ['integration-heavy testing', 'write tests, not too many, mostly integration'],
    origin: 'Kent C. Dodds, 2018',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Weight the suite toward integration-level checks that exercise real collaborators, because that is where confidence per test is highest in code that is mostly glue.',
    useWhen: [
      'all our checks pass but the feature is broken when I click it',
      'every refactor breaks tests even though behaviour did not change',
      'we mock so much that the tests only prove the mocks work',
      'I keep writing checks for code that is just wiring',
    ],
    prompt:
      'Rebalance this suite toward tests that exercise real collaborators. Start by identifying which of our modules contain genuine logic and which are glue, because glue is exactly where isolated tests prove nothing. For each existing isolated test, tell me whether it would still fail if the module it tests were rewired incorrectly; if not, it is measuring implementation rather than behaviour. Then propose the integration-level tests that would replace groups of them, and be specific about which real dependencies stay real and which stay faked, with the reason for each.',
    why:
      'The refactor-resistance argument is the useful half of this idea and models skip it. Asking whether a test would fail on a miswiring is a concrete test for whether it is coupled to implementation.',
    watchOut:
      'Integration tests are slower and diagnose worse. If your codebase has a dense algorithmic core, isolated tests there are worth far more than this framing suggests.',
    related: ['test-pyramid', 'test-doubles-taxonomy', 'london-chicago-tdd', 'hermetic-tests'],
    tags: ['testing', 'test strategy', 'integration', 'mocking'],
  },

  {
    id: 'arrange-act-assert',
    name: 'Arrange-Act-Assert',
    aka: ['AAA', 'triple A test structure'],
    origin: 'Bill Wake, 2001',
    domains: ['engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Give every test three visible phases — set up the world, perform exactly one action, then check the outcome — so a failure reads as a sentence instead of a puzzle.',
    useWhen: [
      'I cannot tell what a failing check was actually trying to prove',
      'our tests are forty lines of setup and one buried assertion',
      'each test does five things and I do not know which one broke',
      'reading the suite tells me nothing about how the system behaves',
    ],
    prompt:
      'Restructure these tests into three explicit phases with exactly one action per test. The rule that does the real work is that no assertion may appear before the action, and no new setup may appear after it — if a test violates that, it is testing two behaviours and should be split. Apply that check first and list the tests it splits. Then rewrite the names so each states the behaviour and the condition rather than the method being called, and show me the failure message each rewritten test would print, because that message is the actual deliverable.',
    why:
      'The three-phase idea is trivially known; the ordering rule and the failure-message framing are what change the tests. Asking for the printed failure output forces names and assertions to carry diagnostic content.',
    watchOut:
      'Some tests genuinely need interleaved steps, such as protocol handshakes. Forcing them into three blocks makes them less readable, not more.',
    related: ['given-when-then', 'assertion-roulette', 'test-smell-audit', 'test-data-builder'],
    tags: ['testing', 'readability', 'test structure', 'naming'],
  },

  {
    id: 'given-when-then',
    name: 'Given-When-Then',
    aka: ['Gherkin', 'BDD scenarios', 'behaviour specification'],
    origin: 'Dan North, behaviour-driven development, 2006',
    domains: ['engineering', 'product'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Write behaviour as a precondition, a triggering event and an observable outcome, in domain language a non-engineer can check.',
    useWhen: [
      'the ticket says what to build but not how we know it works',
      'product and engineering disagree about what done means',
      'requirements arrive as a paragraph and I have to guess the edge cases',
      'nobody can tell from the acceptance criteria whether we shipped it',
    ],
    prompt:
      'Turn this requirement into scenarios stated as precondition, event and observable outcome. Use only vocabulary the business already uses — if a step mentions a button, an endpoint or a table, rewrite it, because implementation words are what make these rot. After the happy path, generate the scenarios nobody wrote down: the precondition that is absent, the event that arrives twice, the event that arrives out of order, and the outcome observed by a second actor. Mark each scenario as agreed, assumed or unknown, and put the unknowns at the top as questions for the requester.',
    why:
      'The format is easy and the coverage is the hard part. Forcing the absent, duplicated and out-of-order variants generates exactly the acceptance criteria that get discovered in production instead.',
    watchOut:
      'The syntax has a heavy tooling gravity. If no non-engineer will ever read these, plain test names are cheaper and just as clear.',
    related: ['specification-by-example', 'three-amigos', 'arrange-act-assert', 'decision-table-testing'],
    tags: ['testing', 'requirements', 'acceptance criteria', 'bdd'],
  },

  {
    id: 'red-green-refactor',
    name: 'Red-Green-Refactor',
    aka: ['TDD', 'test-first development', 'test-driven development'],
    origin: 'Kent Beck, Test-Driven Development by Example, 2002',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Write a failing check first, make it pass with the least code that could work, then clean up while the check holds you safe.',
    useWhen: [
      'I start coding and end up somewhere I did not intend',
      'I write the code then bolt on checks that only confirm what I already did',
      'my functions end up doing far more than the ticket asked for',
      'I am not sure what this function is even supposed to return yet',
    ],
    prompt:
      'Drive this feature test-first. Before writing any implementation, show me the first failing test and — this is the part that matters — tell me what the failure message says, because if it fails for the wrong reason the cycle is already broken. Then write the most embarrassing implementation that makes it pass, even a hardcoded return, and only generalise when a second test forces you to. At each step state which of the three phases you are in and what would make you move on. Do not refactor while anything is red.',
    why:
      'Models asked for TDD tend to produce the finished implementation with tests attached. Demanding the failure message and licensing a hardcoded first pass is what actually produces the increments.',
    watchOut:
      'When you do not yet know the shape of the answer, a spike first and tests after is faster and honest. Test-first suits known problems with unclear design, not unknown problems.',
    related: ['london-chicago-tdd', 'arrange-act-assert', 'walking-skeleton', 'test-data-builder'],
    tags: ['testing', 'workflow', 'design', 'incremental development'],
  },

  {
    id: 'property-based-testing',
    name: 'Property-Based Testing',
    aka: ['generative testing', 'QuickCheck-style testing'],
    origin: 'Koen Claessen and John Hughes, QuickCheck, 2000',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'State an invariant that must hold for all inputs and let a generator hunt for the counterexample, then shrink it to the smallest case that still fails.',
    useWhen: [
      'my examples all pass but I keep finding weird inputs in production',
      'I only ever test the three cases I happened to think of',
      'the parser breaks on strings nobody imagined',
      'I want to check the round trip really is lossless',
    ],
    prompt:
      'Design properties for this function rather than examples. Give me the four classic families explicitly: round-trip (encode then decode is identity), invariant (something true of every output regardless of input), oracle (agrees with a slower obviously-correct version), and metamorphic (a known change to the input produces a known change to the output). For each property, describe the generator including the nasty inputs it must be able to produce — empty, huge, duplicated, unicode, boundary numerics — and say what a shrunk counterexample would look like so I can tell a real defect from a bad property.',
    why:
      'Left open, a model writes one weak property and a default generator. Naming the four families and demanding the generator description is what surfaces properties you would not have thought of.',
    watchOut:
      'Properties that restate the implementation catch nothing. If you cannot express the rule without calling the function under test, you probably need an oracle instead.',
    related: ['metamorphic-testing', 'fuzz-testing', 'equivalence-partitioning', 'boundary-value-analysis'],
    tags: ['testing', 'invariants', 'generative', 'edge cases'],
  },

  {
    id: 'metamorphic-testing',
    name: 'Metamorphic Testing',
    aka: ['metamorphic relations', 'relational testing'],
    origin: 'T. Y. Chen and colleagues, 1998',
    domains: ['engineering', 'data'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'When you cannot say what the right answer is, assert how the answer must change when you change the input in a known way.',
    useWhen: [
      'I have no way to know the correct output for this input',
      'the results look plausible and I cannot verify any of them',
      'checking this by hand would take longer than writing the code',
      'the model output changes and I cannot tell if that is a regression',
    ],
    prompt:
      'I cannot write an oracle for this, so derive relations instead: pairs of inputs where I know how the outputs must relate even though I do not know either output. Cover permutation (reordering inputs should not change an aggregate), scaling (doubling every weight should not change a ranking), inclusion (adding an irrelevant record should not change a filtered result), and negation. For each relation, say which real defect class it would catch and which it is blind to. Then flag any relation that is only approximately true because of floating point or tie-breaking, and give the tolerance it needs.',
    why:
      'This is the technique for untestable outputs — search ranking, simulations, model inference — and it is rarely reached for because the relations feel hard to invent. Enumerating relation families does the inventing.',
    watchOut:
      'A relation that holds by construction proves nothing. Check that a plausible bug could actually break it before you rely on it.',
    related: ['property-based-testing', 'approval-testing', 'test-oracle-problem', 'fuzz-testing'],
    tags: ['testing', 'invariants', 'verification', 'machine learning'],
  },

  {
    id: 'test-oracle-problem',
    name: 'Test Oracle Problem',
    aka: ['oracle problem', 'how do you know it is right'],
    origin: 'Elaine Weyuker, 1982',
    domains: ['engineering'],
    intents: ['diagnose', 'reframe'],
    oneLiner:
      'Name the mechanism that decides whether an output is correct, because a test without a defensible oracle only proves the code does what it does.',
    useWhen: [
      'the check just asserts the output equals what the code returned today',
      'we froze the current behaviour and now call it correct',
      'nobody can say what the right answer would be',
      'the expected values in this file came from running the code',
    ],
    prompt:
      'For each assertion here, name the oracle: where does the expected value come from? Classify each as specified (a document or standard says so), derived (computed independently by a different method), consistent (must agree with another part of the system), statistical (a distribution rather than a value), or circular (it came from running this code). Circular oracles are not worthless but they only detect change, not error, so list them separately and tell me for each whether change detection is genuinely all we need here or whether we are papering over not knowing the answer.',
    why:
      'This is the question that makes a whole class of confident-looking suites collapse. Forcing the classification exposes which tests are regression alarms and which actually check correctness.',
    watchOut:
      'Change detection is legitimately useful for legacy code. The failure is not having circular oracles, it is believing they verify behaviour.',
    related: ['approval-testing', 'metamorphic-testing', 'characterization-tests', 'snapshot-testing'],
    tags: ['testing', 'correctness', 'verification', 'assertions'],
  },

  {
    id: 'mutation-testing',
    name: 'Mutation Testing',
    aka: ['mutation score', 'mutants', 'fault injection into code'],
    origin: 'Richard Lipton, 1971; DeMillo, Lipton and Sayward, 1978',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Deliberately break the code in small ways and see whether the suite notices — the tests that never go red are the ones not doing any work.',
    useWhen: [
      'we have ninety percent coverage and bugs still ship',
      'I want to know whether these checks would actually catch anything',
      'the coverage number went up but I do not trust it',
      'I suspect half our assertions are decorative',
    ],
    prompt:
      'Evaluate this suite by mutation rather than coverage. Propose the specific mutants worth trying on this code — flipped comparisons, off-by-one boundaries, removed guard clauses, swapped operands, replaced return values — and for each, predict whether any existing test would fail and name it. Surviving mutants are the finding, so for each survivor tell me whether it represents a real behaviour nobody checks, an equivalent mutant that cannot be detected, or dead code. Rank surviving mutants by the severity of the bug they stand for, not by count.',
    why:
      'Coverage measures execution, not verification, and everyone knows it while still using coverage. Predicting which mutants survive turns that vague complaint into a specific list of missing assertions.',
    watchOut:
      'Full mutation runs are expensive and equivalent mutants generate noise. Run it on the modules where a defect would hurt most, not the whole repository.',
    related: ['branch-coverage-criteria', 'coverage-ratchet', 'assertion-roulette', 'test-smell-audit'],
    tags: ['testing', 'test quality', 'coverage', 'fault injection'],
  },

  {
    id: 'approval-testing',
    name: 'Approval Testing',
    aka: ['golden master testing', 'locking tests', 'gold standard'],
    origin: 'Llewellyn Falco, ApprovalTests; Michael Feathers on golden masters',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Capture the whole output of a complicated operation as a reviewed artefact and fail on any diff, so a rewrite has to prove it changed nothing.',
    useWhen: [
      'I need to refactor this report generator and it has no tests at all',
      'the output is a huge blob and asserting field by field is hopeless',
      'I want to swap the implementation without changing what customers see',
      'writing individual assertions for this would take a week',
    ],
    prompt:
      'Set up approval tests around this code before I refactor it. The design problem is nondeterminism, so start there: list every part of the output that varies between runs — timestamps, ids, ordering, floating point tails, locale — and give the scrubbing rule for each, because an unscrubbed field makes the whole approach useless. Then choose inputs that maximise coverage of the branches rather than realistic-looking data, show what the approved artefact looks like, and tell me the review discipline for the moment a diff appears and someone has to decide whether it is a bug or an intended change.',
    why:
      'The technique fails almost entirely on nondeterminism and on people rubber-stamping diffs. Making the scrubbing list and the review rule explicit is what makes it survive contact with a real codebase.',
    watchOut:
      'These lock in behaviour including current bugs, and they say nothing about whether the output is right. They are scaffolding for a change, not a permanent specification.',
    related: ['characterization-tests', 'snapshot-testing', 'test-oracle-problem', 'sprout-and-wrap'],
    tags: ['testing', 'legacy code', 'refactoring', 'regression'],
  },

  {
    id: 'characterization-tests',
    name: 'Characterisation Tests',
    aka: ['pinning tests', 'legacy code safety net'],
    origin: 'Michael Feathers, Working Effectively with Legacy Code, 2004',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Write tests that document what untested legacy code currently does — bugs included — so you can change its structure without changing its behaviour.',
    useWhen: [
      'I have to change code nobody understands and there are no tests',
      'the original author left and the behaviour is the only specification',
      'I am afraid to touch this because I cannot tell what depends on it',
      'the requirements document does not match what the system does',
    ],
    prompt:
      'Build a safety net around this legacy code before I change it. Work outside-in: find the largest seam where I can call in and observe out without refactoring first, since needing a refactor to test is the trap. Then propose inputs chosen to reveal behaviour rather than to look realistic, and for each, state what you expect to happen and flag where you are guessing. Where the current behaviour is obviously wrong, still pin it and mark it as a known defect to fix separately, because fixing it in the same change destroys my ability to tell a regression from an intended fix.',
    why:
      'The instinct is to fix bugs while you are in there, and that instinct is what makes legacy refactors unverifiable. Separating pin-now from fix-later is the entire discipline.',
    watchOut:
      'These tests are deliberately not a specification. Leaving them in place forever means future readers mistake accidental behaviour for intended behaviour.',
    related: ['approval-testing', 'test-seams', 'sprout-and-wrap', 'strangler-fig'],
    tags: ['testing', 'legacy code', 'refactoring', 'safety net'],
  },

  {
    id: 'contract-testing',
    name: 'Consumer-Driven Contract Testing',
    aka: ['Pact testing', 'CDC testing', 'API contract tests'],
    origin: 'Ian Robinson, 2006; popularised by the Pact toolset',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Each consumer records exactly what it needs from a provider, and the provider verifies every recorded expectation in its own build.',
    useWhen: [
      'a backend change broke a client team and nobody noticed until release',
      'we need every service running just to test one of them',
      'our stubs drifted from what the real service returns',
      'I do not know who depends on this field so I cannot remove it',
    ],
    prompt:
      'Design contract tests between this consumer and provider. The value comes from being specific about what the consumer actually uses, so start by listing the fields it reads and the ones it merely receives — expectations that cover unused fields freeze the provider for no reason. Then write the interactions as request-response pairs including the error shapes, not just the happy path. Finally describe the verification step in the provider pipeline and what happens when it fails: who is blocked, how a provider ships a breaking change deliberately, and how a contract for a retired consumer gets deleted.',
    why:
      'Most contract-testing attempts fail on process rather than tooling. Asking who gets blocked and how a contract is retired is what turns it into something a team can actually run.',
    watchOut:
      'Contracts verify shape and semantics of an exchange, not that the two systems together do the right thing. You still need a few real end-to-end paths.',
    related: ['api-versioning-strategy', 'test-doubles-taxonomy', 'test-pyramid', 'schema-evolution'],
    tags: ['testing', 'microservices', 'api', 'integration'],
  },

  {
    id: 'test-doubles-taxonomy',
    name: 'Test Doubles Taxonomy',
    aka: ['mocks stubs fakes spies', 'test double types'],
    origin: 'Gerard Meszaros, xUnit Test Patterns, 2007',
    domains: ['engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Distinguish dummies, stubs, spies, mocks and fakes, and pick the weakest one that still exercises the behaviour you care about.',
    useWhen: [
      'our tests break whenever we change a method signature',
      'I mock everything and the tests never catch real problems',
      'the setup asserts on calls rather than on results',
      'I cannot tell what this test is actually verifying anymore',
    ],
    prompt:
      'Review the doubles in these tests and classify each as dummy, stub, spy, mock or fake. Then apply the rule that does the work: a double should only be a mock when the interaction itself is the behaviour under test — sending the email is the point — and otherwise should be the weakest thing that lets the test run. List every place we assert on calls where we could assert on resulting state instead, since those assertions are what make the suite fragile under refactoring. Where a fake would be better than repeated stubbing, sketch it and say what invariants it must preserve to stay honest.',
    why:
      'Overuse of interaction assertions is the single biggest cause of tests that break on refactors, and it never looks wrong locally. Forcing the classification exposes it at scale.',
    watchOut:
      'Hand-written fakes drift from the real implementation. If you build one, it needs its own contract test against the thing it stands in for.',
    related: ['london-chicago-tdd', 'testing-trophy', 'contract-testing', 'hermetic-tests'],
    tags: ['testing', 'mocking', 'isolation', 'coupling'],
  },

  {
    id: 'london-chicago-tdd',
    name: 'London and Chicago Schools',
    aka: ['mockist vs classicist', 'outside-in vs inside-out TDD'],
    origin: 'Steve Freeman and Nat Pryce vs Kent Beck lineage; named by Jason Gorman',
    domains: ['engineering'],
    intents: ['decide', 'explain'],
    oneLiner:
      'Choose between driving design outside-in with mocked collaborators and building inside-out from real objects, knowing what each buys and costs.',
    useWhen: [
      'two people on the team write completely different styles of check',
      'I cannot decide whether to start at the entry point or the core',
      'the reviewer says I have too many mocks and I disagree',
      'our tests are either brittle or slow and never neither',
    ],
    prompt:
      'Given this component, compare the two approaches concretely rather than abstractly. Show me the first test each school would write and what design pressure it applies — the mockist version forces me to name collaborators before they exist, the classicist version forces me to have a working core first. Then judge which fits this specific case using one criterion: is the design risk in the collaboration protocol or in the algorithm? Recommend one, and say which parts of the codebase should use the other, because a single style across an entire system is usually the wrong answer.',
    why:
      'This is usually argued as a tribal identity rather than a per-module judgement. Tying the choice to where the design risk sits makes it decidable.',
    watchOut:
      'Neither school is a licence to skip integration coverage. Both can produce suites that are green while the assembled system is broken.',
    related: ['test-doubles-taxonomy', 'red-green-refactor', 'testing-trophy', 'hexagonal-architecture'],
    tags: ['testing', 'design', 'mocking', 'methodology'],
  },

  {
    id: 'flaky-test-quarantine',
    name: 'Flaky Test Quarantine',
    aka: ['flake budget', 'test quarantine policy'],
    origin: 'Google Testing Blog and large-scale CI practice',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Move intermittently failing checks out of the blocking path under an explicit owner and deadline, so the signal survives while they get fixed.',
    useWhen: [
      'the build fails randomly and everyone just hits retry',
      'nobody believes a red pipeline anymore',
      'we added an automatic retry and now real failures hide too',
      'the same three checks fail once a week and nothing happens',
    ],
    prompt:
      'Design a quarantine policy for our intermittent failures. Include the three parts that make it work rather than rot: an objective entry rule based on measured failure rate over a window instead of somebody being annoyed, a named owner and expiry date per quarantined test, and an exit rule requiring a run of consecutive passes before it blocks again. Then add the part everyone forgets — a cap on total quarantined tests, and what the team does when the cap is hit — because without it quarantine becomes a graveyard. Finally, list the usual root causes to check first: shared state, real clocks, network, ordering and unawaited work.',
    why:
      'Retry-on-failure is the default response and it silently destroys the value of the suite. Making the cap and expiry explicit is the difference between a policy and a permanent hiding place.',
    watchOut:
      'Quarantine is a holding pen, not a fix. A test that has been quarantined twice is telling you the code under it is nondeterministic, not the test.',
    related: ['deterministic-clock', 'hermetic-tests', 'test-isolation', 'ci-signal-hygiene'],
    tags: ['testing', 'ci', 'flakiness', 'reliability'],
  },

  {
    id: 'deterministic-clock',
    name: 'Injected Clock',
    aka: ['controllable time', 'fake clock', 'time as a dependency'],
    origin: 'Common in xUnit patterns; Feathers-style dependency breaking',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Treat now as a dependency the code is handed rather than a global it reaches for, so time-dependent behaviour becomes testable and reproducible.',
    useWhen: [
      'this check fails only when it runs near midnight',
      'the suite breaks twice a year when the clocks change',
      'testing the expiry logic means literally waiting an hour',
      'we sprinkle sleeps in the tests and hope',
    ],
    prompt:
      'Make time explicit in this code. Find every direct read of the current time, every timer, and every sleep, and route them through a single injected source. Then use the seam to write the cases we cannot currently reach: exactly at the boundary, one unit either side, across a daylight saving transition in a zone that has one, across a leap day, and with a clock that jumps backwards because of an NTP correction. For each, tell me what the code does today. Say explicitly which durations should use a monotonic source instead of wall-clock, because that distinction is where the subtle bugs live.',
    why:
      'The refactor is easy and the value is in the case list. Monotonic-versus-wall-clock in particular is the thing nobody tests and everybody eventually gets bitten by.',
    watchOut:
      'Injecting a clock into every constructor is noisy. A module-level source you can swap in tests is often the better trade in small codebases.',
    related: ['hermetic-tests', 'flaky-test-quarantine', 'test-isolation', 'idempotency-keys'],
    tags: ['testing', 'determinism', 'time', 'dependency injection'],
  },

  {
    id: 'hermetic-tests',
    name: 'Hermetic Tests',
    aka: ['sealed tests', 'self-contained test environment'],
    origin: 'Google engineering practice',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'A test brings its own world — no shared database, no network, no ambient configuration — so its result depends only on the code under test.',
    useWhen: [
      'the checks pass locally and fail in the pipeline',
      'two people running the suite at once break each other',
      'someone changed a row in the shared test database and everything went red',
      'the results depend on which order things ran in',
    ],
    prompt:
      'Make these tests self-contained. Enumerate every piece of shared or ambient state they currently depend on: databases, message brokers, filesystem paths, environment variables, DNS, wall-clock, locale, random seeds, and any fixture created by a different test. For each, give the isolation move — in-process fake, per-test container, temporary directory, injected value, seeded generator — and its cost in runtime. Then name the ones that genuinely cannot be sealed and describe how to detect when they misbehave, so those failures are legible as environment problems rather than looking like product defects.',
    why:
      'The failure mode is always something ambient nobody listed. An exhaustive dependency inventory, including locale and random seeds, is what makes the difference.',
    watchOut:
      'Per-test containers are hermetic and slow. Sealing everything can trade a flaky ten-minute suite for a reliable fifty-minute one nobody runs.',
    related: ['test-isolation', 'deterministic-clock', 'flaky-test-quarantine', 'ephemeral-environments'],
    tags: ['testing', 'isolation', 'ci', 'determinism'],
  },

  {
    id: 'test-isolation',
    name: 'Test Isolation',
    aka: ['independent tests', 'order independence', 'no shared fixtures'],
    origin: 'xUnit test patterns; standard CI practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Each check must pass alone, in any order, and in parallel with the others — anything else means the suite is testing execution order.',
    useWhen: [
      'it passes on its own but fails as part of the whole run',
      'we cannot turn on parallel execution without red everywhere',
      'a check depends on data another check created first',
      'reordering the files changed which tests fail',
    ],
    prompt:
      'Diagnose the order dependence in this suite. Rather than guessing, give me the bisection procedure: run the failing test alone to confirm it passes, then find the minimal prefix of other tests that reproduces the failure, and identify what state that prefix leaves behind. Then classify the leak — global variable, database row, cached singleton, module-level registry, temp file, environment variable, unawaited background work from a previous test — and give the fix per class. Say which fixes require a teardown and which are better solved by never sharing the resource, and be specific that teardown-based fixes break under parallel execution.',
    why:
      'People try to fix order dependence by sorting or pinning the order, which hides it. The bisection-to-minimal-prefix procedure finds the actual leaking state.',
    watchOut:
      'Perfect isolation can be genuinely expensive for tests that need a populated database. A shared read-only fixture that nothing writes to is a reasonable middle ground.',
    related: ['hermetic-tests', 'flaky-test-quarantine', 'deterministic-clock', 'ephemeral-test-fixtures'],
    tags: ['testing', 'isolation', 'parallelism', 'flakiness'],
  },

  {
    id: 'equivalence-partitioning',
    name: 'Equivalence Partitioning',
    aka: ['equivalence classes', 'input partitioning'],
    origin: 'Glenford Myers, The Art of Software Testing, 1979',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Split the input space into classes the code should treat identically, then test one representative from each instead of thrashing at random.',
    useWhen: [
      'I have written twenty checks that all exercise the same path',
      'I do not know how many cases are enough here',
      'we test lots of values but keep missing whole categories',
      'the case list was written by whoever felt creative that day',
    ],
    prompt:
      'Partition the input space for this function. Do it from the code as well as the specification, because a partition the implementation makes that the spec does not mention is exactly where defects hide — list any branch that splits a class the spec treats as uniform. Give me valid classes, invalid classes, and the classes that are only distinguishable by their effect on output rather than their form. Then pick one representative per class, state the expected result, and tell me which classes are unreachable given upstream validation so I can stop testing them here and test the validation instead.',
    why:
      'The technique is old and dry, and the interesting move — comparing the spec partition to the implementation partition — is the one models omit unless asked.',
    watchOut:
      'Assuming a class is uniform is exactly the assumption that fails. Pair this with boundary cases, which are where uniformity actually breaks.',
    related: ['boundary-value-analysis', 'pairwise-testing', 'decision-table-testing', 'property-based-testing'],
    tags: ['testing', 'test design', 'coverage', 'inputs'],
  },

  {
    id: 'boundary-value-analysis',
    name: 'Boundary Value Analysis',
    aka: ['edge case analysis', 'off-by-one testing'],
    origin: 'Glenford Myers, The Art of Software Testing, 1979',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Test at the edges of every range and one step either side, because that is where comparison operators and allocation sizes go wrong.',
    useWhen: [
      'we shipped an off-by-one that made it through review',
      'it breaks on the first item or the last item',
      'the empty list case crashed in production',
      'the limit works at ten but not at exactly eleven',
    ],
    prompt:
      'Enumerate the boundaries for this code and give me the three-point set at each: just below, exactly at, just above. Cover the non-obvious boundaries as well as the numeric ones — empty and single-element collections, the first and last element, maximum length strings, zero and negative durations, the integer type limits, the point where a value crosses from one storage representation to another, and the first request after a window resets. For each boundary, state which side the specification says is inclusive and whether the code agrees, because a spec that is silent about inclusivity is the defect.',
    why:
      'Everyone knows to test edges and still tests only numeric ranges. The inclusivity check against the spec is what turns this from ritual into a defect-finding pass.',
    watchOut:
      'Boundaries multiply. On a function with six parameters this generates more cases than anyone will maintain, so combine it with a combinatorial reduction.',
    related: ['equivalence-partitioning', 'pairwise-testing', 'property-based-testing', 'fuzz-testing'],
    tags: ['testing', 'edge cases', 'off-by-one', 'test design'],
  },

  {
    id: 'pairwise-testing',
    name: 'Pairwise Testing',
    aka: ['all-pairs testing', 'combinatorial test design', 'orthogonal arrays'],
    origin: 'Mandl, 1985; Cohen and colleagues on combinatorial design, 1996',
    domains: ['engineering'],
    intents: ['prioritize', 'plan'],
    oneLiner:
      'Cover every pair of parameter values in a small set of cases, on the evidence that most defects are triggered by one or two factors interacting rather than five.',
    useWhen: [
      'the full matrix of options is thousands of combinations',
      'we support four browsers three plans and two currencies and cannot test all of it',
      'the config flags interact and we only ever test the defaults',
      'the regression run takes all night and still misses things',
    ],
    prompt:
      'Reduce this combination space using all-pairs coverage. First list the parameters and their genuinely distinct values, collapsing values the system cannot distinguish, because inflated value sets are what make the reduced set useless. Then generate a covering set and tell me its size against the full cross product. Crucially, list the constraints — combinations that are impossible or forbidden — and any interaction we already know is three-way, because those must be added as explicit cases; pairwise coverage is blind to them by construction. Finish with the specific defect classes this set would not catch.',
    why:
      'The reduction is easy to generate and easy to over-trust. Demanding the known three-way interactions and the blind spots is what keeps it honest.',
    watchOut:
      'The empirical claim behind this is about typical systems, not yours. A configuration engine whose whole purpose is interaction needs higher-strength coverage.',
    related: ['equivalence-partitioning', 'decision-table-testing', 'risk-based-testing', 'feature-flag-hygiene'],
    tags: ['testing', 'combinatorics', 'configuration', 'test design'],
  },

  {
    id: 'decision-table-testing',
    name: 'Decision Table Testing',
    aka: ['cause-effect table', 'condition-action matrix'],
    origin: 'Classic structured analysis; formalised in ISTQB practice',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Lay every condition and every resulting action into a grid, so contradictory, duplicated and missing rules become visible rather than argued about.',
    useWhen: [
      'the pricing rules are a nest of nested conditionals nobody can follow',
      'two rules in the policy seem to contradict each other',
      'I keep finding cases the requirements never mention',
      'the eligibility logic has been patched so many times it is unreadable',
    ],
    prompt:
      'Build a decision table for this logic. Extract the conditions and the actions, enumerate the combinations, and fill in the outcome for each. Then run the three checks that make this worth doing: find rows where no rule applies (a gap), rows where two rules disagree (a conflict), and rows that are unreachable given the other conditions (dead logic). Report each with the concrete inputs that reach it. Finally, collapse rows where a condition genuinely does not affect the outcome, and tell me whether the code agrees that it does not — a condition the table says is irrelevant but the code still branches on is a defect.',
    why:
      'The gap-conflict-dead-row triple is the whole value and models produce the grid without it. Comparing the collapsed table against the code branches catches logic nobody knows is there.',
    watchOut:
      'Condition counts explode exponentially. Beyond six or seven conditions you need to partition the table first or the exercise defeats itself.',
    related: ['equivalence-partitioning', 'state-transition-testing', 'given-when-then', 'pairwise-testing'],
    tags: ['testing', 'business rules', 'logic', 'requirements'],
  },

  {
    id: 'state-transition-testing',
    name: 'State Transition Testing',
    aka: ['state machine testing', 'transition coverage'],
    origin: 'Finite state machine testing; Chow, 1978',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Model the object as states and events, then test not only the legal transitions but every event arriving in every state it should be refused in.',
    useWhen: [
      'the order got cancelled after it shipped and nothing stopped it',
      'a status field can apparently hold combinations that make no sense',
      'the webhook arrived twice and the record went backwards',
      'users hit the back button and the workflow got confused',
    ],
    prompt:
      'Model this workflow as states and events and derive tests from it. Give me the transition table with every state on one axis and every event on the other, then fill in all cells — including the illegal ones, because the whole value is in specifying what happens when an event arrives in a state that should refuse it. For each illegal cell say whether the code today ignores it, errors, or silently corrupts state. Then cover the sequences: shortest path to each state, every transition at least once, and the loops. Flag any state reachable by two paths that leaves different data behind.',
    why:
      'Teams test the happy transitions and leave the illegal cells undefined, which is where duplicate webhooks and back-button bugs come from. Filling in the whole matrix is the point.',
    watchOut:
      'If the real state lives across several fields and services, the tidy machine is a fiction. Model what the system actually stores, not what the diagram claims.',
    related: ['decision-table-testing', 'idempotency-keys', 'mvi-architecture', 'saga-pattern'],
    tags: ['testing', 'state machines', 'workflow', 'invalid states'],
  },

  {
    id: 'exploratory-testing-charter',
    name: 'Exploratory Testing Charter',
    aka: ['session-based test management', 'charter and timebox'],
    origin: 'James and Jonathan Bach, session-based test management, 2000',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Give unscripted testing a written mission, a timebox and a debrief, so poking at the product produces evidence instead of vibes.',
    useWhen: [
      'the scripted checks all pass but the feature feels wrong to use',
      'we only ever find the bugs we thought to write down',
      'manual testing here means clicking around for a while',
      'nobody can say what was actually tested before release',
    ],
    prompt:
      'Write exploratory charters for this feature. Each charter should name a target area, a resource or tool to use, and the information it seeks — the classic explore-with-to-discover shape — and be scoped to about ninety minutes. Generate charters along the axes people forget: interruption and resumption, concurrent use by two accounts, data that arrived from an older version of the product, permissions boundaries, and the recovery path after an error. For each charter, say what evidence would count as a finding and what note-taking the session needs so the debrief produces a reproducible report rather than an anecdote.',
    why:
      'Unscripted testing is dismissed as unrigorous because it usually is. The mission plus evidence-standard structure is what makes the output defensible next to automated results.',
    watchOut:
      'Charters are not a substitute for automation of things you already know. Use them where the risk is unknown-unknowns, not to re-verify settled behaviour.',
    related: ['risk-based-testing', 'minimal-reproducible-example', 'testing-in-production', 'defect-triage-matrix'],
    tags: ['testing', 'exploratory', 'manual testing', 'session management'],
  },

  {
    id: 'risk-based-testing',
    name: 'Risk-Based Test Prioritisation',
    aka: ['risk-based testing', 'test effort allocation'],
    origin: 'Standard practice in risk management-driven QA; Bach, 1999',
    domains: ['engineering'],
    intents: ['prioritize', 'plan'],
    oneLiner:
      'Allocate testing effort by likelihood of failure multiplied by cost of that failure, so the deepest coverage sits where a defect would actually hurt.',
    useWhen: [
      'we do not have time to test everything before the release',
      'we test the easy parts thoroughly and the scary parts barely',
      'someone wants a number for how much testing is enough',
      'coverage is even across the codebase but the risk is not',
    ],
    prompt:
      'Rank these areas by testing risk. Score likelihood using observable proxies rather than intuition — recent change rate, defect history, number of authors, cyclomatic complexity, age of the last test — and score impact by what a failure costs in money, data loss, safety or reputation. Multiply, then allocate effort. The instruction that matters: for each high-risk area name the specific failure you are worried about, because an area rated high with no concrete failure in mind gets tested shallowly and widely, which is the least useful shape. Finish with what you consciously decided not to test and the risk accepted.',
    why:
      'Risk ratings drift into vague colour-coding. Requiring a named failure per high-risk item and an explicit not-testing list keeps it decision-shaped.',
    watchOut:
      'History-based likelihood is blind to brand new code with no defect record. Weight novelty explicitly or you will systematically under-test the newest work.',
    related: ['test-impact-analysis', 'exploratory-testing-charter', 'defect-triage-matrix', 'fmea'],
    tags: ['testing', 'prioritisation', 'risk', 'release readiness'],
  },

  {
    id: 'branch-coverage-criteria',
    name: 'Branch and Condition Coverage',
    aka: ['MC/DC', 'decision coverage', 'coverage criteria'],
    origin: 'Structural testing literature; MC/DC from DO-178B avionics standard',
    domains: ['engineering'],
    intents: ['explain', 'critique'],
    oneLiner:
      'Distinguish which lines ran from which decisions were exercised both ways, and from whether each sub-condition was shown to independently change the outcome.',
    useWhen: [
      'our coverage number is high and I do not know what it means',
      'every line is covered but a whole branch has never run',
      'the compound if statement is covered by one test',
      'someone is asking for a coverage target and I need to give a real answer',
    ],
    prompt:
      'Explain what our coverage figure does and does not guarantee, using this code as the example. Show a case that reaches full statement coverage while leaving a branch untaken, and a case with full branch coverage where a sub-condition in a compound predicate has never independently determined the result. Then tell me which criterion is worth paying for here given the cost of a defect in this module, and write the extra tests that would lift the weakest predicate to independent-condition coverage. Do not recommend a percentage target; recommend which specific decisions must be fully exercised.',
    why:
      'Coverage debates are conducted in percentages and resolved by argument. Producing the concrete example of a hole inside a high number reframes it as a criterion choice.',
    watchOut:
      'Coverage criteria say nothing about assertions. Code can be fully exercised by tests that assert nothing at all, which is why mutation testing is the better follow-up.',
    related: ['mutation-testing', 'coverage-ratchet', 'equivalence-partitioning', 'assertion-roulette'],
    tags: ['testing', 'coverage', 'metrics', 'verification'],
  },

  {
    id: 'coverage-ratchet',
    name: 'Coverage Ratchet',
    aka: ['coverage floor', 'no-worse-than rule', 'ratcheting quality gate'],
    origin: 'Common continuous integration practice; related to the boy scout rule',
    domains: ['engineering'],
    intents: ['plan', 'steer'],
    oneLiner:
      'Instead of demanding a target today, block any change that lowers the current number, so quality improves monotonically without a big-bang project.',
    useWhen: [
      'coverage is at thirty percent and mandating eighty would stop all work',
      'every quality initiative dies after two weeks',
      'the untested legacy area keeps growing',
      'we set a target and people wrote worthless checks to hit it',
    ],
    prompt:
      'Design a ratchet for this metric. Specify what is measured on new and changed lines rather than the whole repository, because a whole-repo threshold punishes people for touching legacy code and that is the failure mode. Give the enforcement point, the exact failure message a developer sees, and the escape hatch — who can override it and what they must write down. Then name the gaming behaviours this creates, such as assertion-free tests or excluded files, and the counter-check for each. Finally, apply the same pattern to two other metrics where a floor would help more than a target.',
    why:
      'Absolute thresholds fail on legacy code and targets invite gaming. Scoping to changed lines and pre-naming the gaming behaviours is what makes a gate survive.',
    watchOut:
      'A ratchet on a bad metric locks in the bad metric. Make sure the number you are freezing is one you would defend on its own.',
    related: ['branch-coverage-criteria', 'mutation-testing', 'ci-signal-hygiene', 'goodharts-law'],
    tags: ['testing', 'ci', 'quality gates', 'metrics'],
  },

  {
    id: 'assertion-roulette',
    name: 'Assertion Roulette',
    aka: ['unnamed assertions', 'which assert failed'],
    origin: 'Gerard Meszaros, xUnit Test Patterns test smells, 2007',
    domains: ['engineering'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'When a test carries many undifferentiated assertions, a failure tells you the test broke but not what broke — the diagnosis cost lands on every future reader.',
    useWhen: [
      'the failure says expected true got false and nothing else',
      'I have to add print statements to find out which line failed',
      'one test has fifteen asserts and the output is useless',
      'debugging a red build takes longer than fixing the bug',
    ],
    prompt:
      'Improve the diagnostic value of these tests. For each assertion, show the exact message that prints on failure today, then rewrite so the message alone identifies the behaviour, the expected value, the actual value and the input that produced it. Where a test carries several assertions about different behaviours, split it; where the assertions are all facets of one outcome, combine them into a single structural comparison so the diff is shown once. The measure of success is that I could triage a failure from the log alone without opening the test file — verify each rewritten test against that bar.',
    why:
      'Test readability is usually argued aesthetically. Setting the bar at triage-from-the-log-alone makes it a checkable property rather than taste.',
    watchOut:
      'Splitting every assertion into its own test multiplies setup cost and slows the suite. Split by behaviour, not by assertion count.',
    related: ['test-smell-audit', 'arrange-act-assert', 'branch-coverage-criteria', 'error-message-design'],
    tags: ['testing', 'diagnostics', 'test smells', 'readability'],
  },

  {
    id: 'test-smell-audit',
    name: 'Test Smell Audit',
    aka: ['xUnit test smells', 'test code quality review'],
    origin: 'Gerard Meszaros, xUnit Test Patterns, 2007',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Apply the catalogue of known test pathologies — mystery guest, eager test, fragile fixture, conditional logic, erratic behaviour — to a suite that is technically green but hated.',
    useWhen: [
      'the tests are harder to change than the code they test',
      'nobody wants to touch the test file',
      'we spend more time fixing tests than writing features',
      'the checks are green but nobody trusts them',
    ],
    prompt:
      'Audit these tests against the known smell catalogue. Look specifically for: a mystery guest (data from an external file or shared fixture whose relevance is invisible in the test), an eager test (one test verifying a whole workflow), conditional logic inside a test, a fragile fixture (setup coupled to fields the test does not use), and erratic tests that depend on order or timing. For each hit, name the smell, quote the lines, and give the refactoring. Then rank the findings by maintenance cost — how often that file has been edited — rather than by how bad the smell sounds.',
    why:
      'Naming the specific catalogue produces a much sharper review than asking for improvements, and ranking by edit frequency stops the output being a hundred equally-weighted nits.',
    watchOut:
      'Test code is allowed more duplication than production code; explicitness beats reuse when a test must be readable in isolation. Do not deduplicate a suite into unreadability.',
    related: ['assertion-roulette', 'test-data-builder', 'arrange-act-assert', 'ephemeral-test-fixtures'],
    tags: ['testing', 'code smells', 'maintainability', 'review'],
  },

  {
    id: 'object-mother',
    name: 'Object Mother',
    aka: ['test fixture factory', 'canonical test objects'],
    origin: 'Peter Schuh and Stephanie Punke, ThoughtWorks, 2001',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Centralise named, meaningful example objects — a delinquent account, a lapsed subscription — so tests read in domain terms instead of twelve lines of construction.',
    useWhen: [
      'every test starts with twenty lines of building a valid object',
      'adding a required field broke four hundred tests',
      'I cannot tell from the setup what makes this case special',
      'we have five slightly different ways to build the same fixture',
    ],
    prompt:
      'Introduce named example objects for these tests. Name them for the domain situation they represent rather than their shape — a customer past their trial, an order awaiting payment — because names like validUser are what turn this into a dumping ground. For each, show which fields carry meaning for the scenario and which are just filler, and make the filler invisible at the call site. Then state the rule for when a new named example is justified versus when a caller should tweak an existing one, and show how a test signals that a specific field is the thing under test rather than incidental.',
    why:
      'The pattern degenerates into a god-module of near-identical builders. The naming rule and the meaningful-versus-filler distinction are the guardrails that prevent it.',
    watchOut:
      'A shared fixture edited to suit one test can silently change the meaning of dozens of others. Builders that produce fresh instances are safer at scale.',
    related: ['test-data-builder', 'ephemeral-test-fixtures', 'test-smell-audit', 'arrange-act-assert'],
    tags: ['testing', 'fixtures', 'test data', 'readability'],
  },

  {
    id: 'test-data-builder',
    name: 'Test Data Builder',
    aka: ['builder pattern for tests', 'fluent fixture builder'],
    origin: 'Nat Pryce; Growing Object-Oriented Software Guided by Tests, 2009',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Construct fixtures through a builder with sensible defaults, so each test states only the fields that matter to it and stays readable as the type grows.',
    useWhen: [
      'adding a constructor parameter meant editing hundreds of test files',
      'the setup obscures what the test is actually about',
      'I keep copying a huge object literal and changing one field',
      'the fixtures drifted and now some are invalid',
    ],
    prompt:
      'Design builders for these fixtures. Defaults should be valid but deliberately boring, and any field that influences the behaviour under test must be set explicitly at the call site even when the default would do — otherwise a later change to the default silently changes what the test means. Show the builder, a test before and after, and the rule for nested objects so callers do not have to know the graph. Then add the sharp edge: builders that mutate shared default instances leak state between tests, so show how yours produces an independent object every time.',
    why:
      'Default-driven fixtures create tests whose meaning depends on a value defined far away. The explicit-if-relevant rule is what keeps them honest as the schema evolves.',
    watchOut:
      'A builder for a type with three fields is ceremony. Reach for this when the type is wide or the construction is fiddly, not by default.',
    related: ['object-mother', 'ephemeral-test-fixtures', 'test-smell-audit', 'red-green-refactor'],
    tags: ['testing', 'fixtures', 'test data', 'maintainability'],
  },

  {
    id: 'ephemeral-test-fixtures',
    name: 'Fresh Fixture',
    aka: ['ephemeral fixtures', 'per-test setup and teardown', 'transactional rollback tests'],
    origin: 'Gerard Meszaros, xUnit Test Patterns, 2007',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Build the world for each test and tear it down after, rather than sharing a prepared environment that accumulates whatever previous tests left behind.',
    useWhen: [
      'the seeded database has drifted and nobody knows what is in it',
      'a test only passes if the seed script ran first',
      'cleanup is missing when a test fails midway',
      'two suites fight over the same records',
    ],
    prompt:
      'Convert this shared setup into per-test state. Compare three mechanisms for us specifically: transactional rollback per test, truncate-and-reseed, and a fresh schema or namespace per worker — and score each on speed, on whether it survives code that manages its own transactions, and on parallel safety. Then handle the case everyone gets wrong: teardown when the test throws, and teardown when the process is killed. Recommend one, and identify the read-only reference data that genuinely can be shared because nothing writes to it, since rebuilding that per test is where the time goes.',
    why:
      'The mechanism choice is the whole decision and it hinges on details — self-managed transactions, parallel workers — that a generic answer skips.',
    watchOut:
      'Rollback-based isolation hides bugs involving commit behaviour, triggers or connection state. If your code depends on those, it needs a heavier mechanism.',
    related: ['test-isolation', 'hermetic-tests', 'test-data-builder', 'object-mother'],
    tags: ['testing', 'fixtures', 'database', 'isolation'],
  },

  {
    id: 'snapshot-testing',
    name: 'Snapshot Testing',
    aka: ['inline snapshots', 'serialised output tests'],
    origin: 'Jest, Facebook, 2016; lineage from approval testing',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Serialise a component or output tree to a checked-in file and fail on change, trading precision of intent for near-zero cost of coverage.',
    useWhen: [
      'writing assertions for this rendered output is tedious',
      'the snapshot file changed and everyone just pressed update',
      'we have huge generated files in the repository nobody reads',
      'I want to know if this markup changed but not assert every attribute',
    ],
    prompt:
      'Review our use of serialised output tests. Split them into two groups: those where the snapshot is small enough that a reviewer will genuinely read the diff, and those where it is not — the second group only detects change and should be described that way, not counted as verification. For the large ones, propose narrowing to the specific properties that carry meaning. Then set the update policy: what a reviewer must do before accepting a diff, and why blanket-updating is equivalent to deleting the test. Flag every snapshot containing volatile values that will churn without meaning anything.',
    why:
      'These tests are cheap to add and quietly become noise. Sorting them by whether a human will actually read the diff is the distinction that decides which to keep.',
    watchOut:
      'A snapshot approved without reading it is worse than no test, because it produces a green tick and trains the team to click update.',
    related: ['approval-testing', 'visual-regression-testing', 'test-oracle-problem', 'test-smell-audit'],
    tags: ['testing', 'frontend', 'regression', 'review'],
  },

  {
    id: 'visual-regression-testing',
    name: 'Visual Regression Testing',
    aka: ['screenshot diffing', 'perceptual diff testing'],
    origin: 'Widespread frontend practice; tools such as BackstopJS and Percy',
    domains: ['engineering', 'design'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Compare rendered screenshots against approved baselines so unintended layout and styling changes are caught before a human notices them in production.',
    useWhen: [
      'a CSS change broke the layout on a page nobody looked at',
      'the design system upgrade shifted spacing everywhere',
      'we only find visual bugs when a customer sends a screenshot',
      'the same page looks different on two browsers and we did not know',
    ],
    prompt:
      'Design visual regression coverage for this interface. The engineering problem is noise, so lead with it: enumerate the sources of pixel churn — font loading, animations, scrollbars, cursor blink, dynamic content, device pixel ratio, GPU differences between local and CI — and give the stabilisation for each. Then choose the comparison method and threshold, explaining why a raw pixel count is the wrong metric and what perceptual or region-based alternative to use. Finally, select which viewports and states to capture based on where our layout actually branches, rather than capturing every page at every size.',
    why:
      'Visual diffing is abandoned almost always because of false positives, not because of missed bugs. Front-loading the noise sources is what determines whether it survives.',
    watchOut:
      'Baselines that get bulk-approved after a redesign lose all value. Treat baseline updates as a reviewed change, not a chore.',
    related: ['snapshot-testing', 'accessibility-audit', 'design-system-governance', 'smoke-test-suite'],
    tags: ['testing', 'frontend', 'ui', 'regression'],
  },

  {
    id: 'smoke-test-suite',
    name: 'Smoke Test Suite',
    aka: ['build verification test', 'sanity suite', 'canary checks'],
    origin: 'Hardware testing origin; Microsoft daily build practice, 1990s',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'A short set of checks proving the system is alive and its critical paths work, run after every deploy to answer one question fast: is this catastrophically broken?',
    useWhen: [
      'we deployed and only found out it was broken an hour later',
      'the full suite takes too long to run after a release',
      'the health check returns ok while the site is down',
      'I need something to run against production right after a rollout',
    ],
    prompt:
      'Define a post-deploy smoke suite for this system. Constrain it hard: under two minutes total, and every check must map to a user-visible failure worth an automatic rollback — anything else belongs in the main suite. Cover the paths that break on deployment specifically, which is different from the paths that break on code change: configuration missing, migration not applied, dependency unreachable, credentials expired, static assets not published, and the first request after a cold start. For each check, give the failure signal, whether it should trigger rollback or page a human, and how to run it safely against production data.',
    why:
      'Smoke suites bloat into slow half-regression runs. Tying every check to an automatic rollback decision is the constraint that keeps the set small and meaningful.',
    watchOut:
      'Passing smoke tests are weak evidence of correctness. They prove the system is up, not that the change did what it was supposed to.',
    related: ['synthetic-monitoring', 'canary-release', 'testing-in-production', 'deployment-rollback-plan'],
    tags: ['testing', 'deployment', 'release', 'monitoring'],
  },

  {
    id: 'test-seams',
    name: 'Test Seams',
    aka: ['seams', 'enabling points', 'dependency breaking'],
    origin: 'Michael Feathers, Working Effectively with Legacy Code, 2004',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'A seam is a place you can change behaviour without editing the code there — find one and untestable code becomes testable without a rewrite.',
    useWhen: [
      'I cannot instantiate this class without half the system',
      'the constructor connects to a database on line one',
      'to test this I would have to refactor it and I cannot test the refactor',
      'everything is static methods and globals',
    ],
    prompt:
      'Find the seams in this code. Identify object seams (a method I can override in a subclass), link seams (a dependency I can substitute at build or load time), and preprocessing seams, and rank them by how little I have to change to use them. Then propose the smallest dependency-breaking move for the top one — extract and override, parameterise the constructor, introduce an instance delegator, or wrap the static — naming the specific technique and showing the diff. Be explicit about which of these changes are safe to make without tests because they are mechanical, and which are not.',
    why:
      'The chicken-and-egg problem of legacy code — needing tests to refactor safely and refactoring to make tests possible — is solved specifically by ranking changes by mechanical safety.',
    watchOut:
      'Seams introduced purely for testing can outlive their purpose and become confusing indirection. Note which ones to remove once real tests exist.',
    related: ['characterization-tests', 'sprout-and-wrap', 'dependency-inversion', 'approval-testing'],
    tags: ['testing', 'legacy code', 'refactoring', 'dependencies'],
  },

  {
    id: 'sprout-and-wrap',
    name: 'Sprout and Wrap Method',
    aka: ['sprout method', 'wrap method', 'sprout class'],
    origin: 'Michael Feathers, Working Effectively with Legacy Code, 2004',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Add new behaviour in a fresh tested unit and call it from the old code, or wrap the old call, rather than editing an untested method you cannot verify.',
    useWhen: [
      'I have to add a feature to a method that is nine hundred lines long',
      'there is no way I can test the function I need to change',
      'I do not have time to refactor this whole file first',
      'the safest change still means touching code nobody dares to touch',
    ],
    prompt:
      'I need to add behaviour to this untested method. Give me both options concretely. For sprout: the new tested unit, the single line inserted into the old method, and what makes that insertion safe to eyeball. For wrap: the renamed original, the new method taking its name, and where the new behaviour sits relative to the old call. Then pick one, and justify it by whether the new behaviour is conditional on the old code running — that is the actual deciding factor. Finish with the note to leave behind saying what remains untested, so the next person is not misled by the new tests.',
    why:
      'Both moves are simple; the decision between them is the part people get wrong. Anchoring it to whether the new behaviour depends on the old outcome makes it mechanical.',
    watchOut:
      'This accumulates structure around a rotten core. It is a way to ship safely today, not a substitute for eventually cleaning up the method.',
    related: ['test-seams', 'characterization-tests', 'strangler-fig', 'branch-by-abstraction'],
    tags: ['legacy code', 'testing', 'refactoring', 'incremental change'],
  },

  {
    id: 'fuzz-testing',
    name: 'Fuzz Testing',
    aka: ['fuzzing', 'coverage-guided fuzzing', 'random input testing'],
    origin: 'Barton Miller, University of Wisconsin, 1988; AFL and libFuzzer later',
    domains: ['engineering', 'security'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'Feed the program malformed and mutated input at high volume, guided by code coverage, and watch for crashes, hangs and assertion failures.',
    useWhen: [
      'we parse untrusted input and I have no idea how robust it is',
      'a malformed upload took down the service',
      'I want to find the crash before someone else does',
      'the input format has a spec and we accept things it does not allow',
    ],
    prompt:
      'Set up fuzzing for this input-handling code. Start with the target function and the harness: it must take a byte array, be deterministic, and fail loudly — so list every place the code currently swallows an error, because a swallowed error is invisible to a fuzzer. Then define the corpus seeds from real valid inputs, the structural mutations worth teaching it about, and the oracles beyond crashes: assertion violations, memory limits, timeouts, and round-trip properties. Finally say how a discovered input gets minimised and turned into a permanent regression test, and how the corpus is stored so runs build on each other.',
    why:
      'Fuzzing fails silently when the harness catches exceptions or the run starts from nothing. The swallowed-error inventory and corpus persistence are what make it find anything.',
    watchOut:
      'Coverage-guided fuzzing explores shallow branches well and deep stateful protocols badly. For those you need a structure-aware generator, not raw bytes.',
    related: ['property-based-testing', 'boundary-value-analysis', 'attack-surface-reduction', 'input-validation-boundary'],
    tags: ['testing', 'security', 'robustness', 'crashes'],
  },

  {
    id: 'regression-test-selection',
    name: 'Regression Test Selection',
    aka: ['safe test selection', 'change-based test subsetting'],
    origin: 'Rothermel and Harrold, regression testing research, 1996',
    domains: ['engineering'],
    intents: ['prioritize', 'plan'],
    oneLiner:
      'Run only the tests that could possibly be affected by a change, derived from a dependency graph rather than from folder names or intuition.',
    useWhen: [
      'the pipeline takes an hour for a one-line change',
      'we run everything every time because nobody knows what is related',
      'developers wait so long they start batching changes',
      'the cost of CI is now a line item somebody is asking about',
    ],
    prompt:
      'Design change-based test selection for this repository. Explain what the dependency graph must include to be safe, and be exhaustive about the edges people miss: reflection, dynamic imports, configuration files, database migrations, generated code, container images and test fixtures. For each unmodellable edge, give the fallback rule that forces a full run. Then specify the safety net — periodic full runs, and what happens when selection misses a failure — plus the measurement that tells us whether this is paying for itself, comparing time saved against defects that reached later stages.',
    why:
      'Unsafe selection is worse than no selection because it produces confident green results. Forcing an explicit list of unmodellable edges and their fallbacks is the safety argument.',
    watchOut:
      'Maintaining the graph is real work, and it silently degrades as the build system changes. Without periodic full runs you will not notice it has stopped being safe.',
    related: ['test-impact-analysis', 'test-pyramid', 'build-cache-strategy', 'ci-signal-hygiene'],
    tags: ['testing', 'ci', 'build time', 'dependency analysis'],
  },

  {
    id: 'test-impact-analysis',
    name: 'Test Impact Analysis',
    aka: ['coverage-based test targeting', 'per-test coverage mapping'],
    origin: 'Microsoft Visual Studio TIA; adopted broadly in large monorepos',
    domains: ['engineering'],
    intents: ['prioritize', 'diagnose'],
    oneLiner:
      'Record which code each test actually executed, then use that map to order or select tests when that code changes — and to find the code no test touches.',
    useWhen: [
      'I want the tests most likely to fail to run first',
      'we cannot tell which tests cover this module',
      'a critical file has coverage but I do not know from which test',
      'developers get feedback thirty minutes into the run',
    ],
    prompt:
      'Build a per-test coverage map for this codebase and tell me what to do with it. Beyond selecting tests for a change, extract the three findings the map gives you for free: code executed by no test at all, code executed by many tests (a change there is high risk), and tests that execute almost nothing (candidates for deletion). Then define failure-ordering: run the tests whose covered lines changed most recently first, so the pipeline fails fast. Say how often the map must be regenerated and what makes it stale, since a stale map is the failure mode nobody notices.',
    why:
      'The map is usually built for selection and its diagnostic uses are more valuable. Asking for the many-tests-cover-this signal identifies the riskiest code to change.',
    watchOut:
      'Coverage-based mapping misses effects that are not executions — configuration, data, ordering. It is a prioritisation aid, not a proof of independence.',
    related: ['regression-test-selection', 'branch-coverage-criteria', 'risk-based-testing', 'ci-signal-hygiene'],
    tags: ['testing', 'ci', 'coverage', 'prioritisation'],
  },

  {
    id: 'specification-by-example',
    name: 'Specification by Example',
    aka: ['living documentation', 'executable specifications'],
    origin: 'Gojko Adzic, Specification by Example, 2011',
    domains: ['engineering', 'product'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Replace abstract requirements with concrete worked examples agreed by business and engineering, then automate them so the examples cannot go stale.',
    useWhen: [
      'the spec is ambiguous and everyone read it differently',
      'the documentation says one thing and the code does another',
      'we discover the real requirements during code review',
      'requirements arrive as adjectives like fast and simple',
    ],
    prompt:
      'Turn this requirement into concrete examples with real values instead of descriptions. For each rule, give the illustrative example, then the counter-example that shows where the rule stops applying, because a rule without its boundary is what gets implemented wrong. Push back on any input specified as a category rather than a value — write the actual number, the actual string, the actual date. Then mark which examples are business-critical enough to automate and which are conversation aids only, and say what part of this specification is still unknown and needs a decision from a named person.',
    why:
      'Ambiguity survives in abstractions and dies on concrete values. Demanding real values and a counter-example per rule is what exposes the disagreement before the code is written.',
    watchOut:
      'Automating every example produces a slow, over-specified suite that resists legitimate change. Automate the rules, illustrate the rest.',
    related: ['three-amigos', 'given-when-then', 'decision-table-testing', 'definition-of-done'],
    tags: ['testing', 'requirements', 'documentation', 'collaboration'],
  },

  {
    id: 'three-amigos',
    name: 'Three Amigos',
    aka: ['specification workshop', 'example mapping session'],
    origin: 'George Dinwiddie, 2011; Matt Wynne on example mapping',
    domains: ['engineering', 'product'],
    intents: ['plan', 'communicate'],
    oneLiner:
      'Before building, get the business, development and testing perspectives into the same short conversation about one story, and leave with rules, examples and open questions.',
    useWhen: [
      'we built the wrong thing and everyone had understood it differently',
      'the tester finds the requirement gaps only after the code is done',
      'stories come back from review needing rework every time',
      'the developer had questions and asked them three days in',
    ],
    prompt:
      'Run this story through a three-perspective review and produce the four outputs of an example mapping session: the story, the business rules under it, an example per rule, and — most importantly — the questions nobody in the room can answer. Play each role explicitly: business asking what outcome this serves, development asking what is technically implied and what it touches, testing asking how it fails and what happens at the edges. If the question list is longer than the rule list, say so and recommend the story is not ready. Keep the whole thing to what could be covered in twenty-five minutes.',
    why:
      'The valuable artefact is the question list, and unstructured refinement meetings do not produce it. Forcing the three roles and the readiness signal is what makes the session decide something.',
    watchOut:
      'This is a short conversation, not a design committee. If it regularly runs long, the stories are too big rather than the meeting being too short.',
    related: ['specification-by-example', 'given-when-then', 'definition-of-done', 'exploratory-testing-charter'],
    tags: ['requirements', 'collaboration', 'refinement', 'testing'],
  },

  {
    id: 'minimal-reproducible-example',
    name: 'Minimal Reproducible Example',
    aka: ['MRE', 'MCVE', 'reduced test case'],
    origin: 'Long-standing open-source and Stack Overflow practice',
    domains: ['engineering'],
    intents: ['diagnose', 'communicate'],
    oneLiner:
      'Strip a failure down to the smallest self-contained case that still fails — the reduction itself usually finds the cause before anyone else reads it.',
    useWhen: [
      'I need to file a bug against a library and cannot show them our codebase',
      'the bug only happens in our full application',
      'the maintainer asked for a repro and I do not know where to start',
      'I have a failure and no idea which part of the setup matters',
    ],
    prompt:
      'Reduce this failure to a minimal case. Work by systematic elimination rather than intuition: at each step remove or inline one dependency, one configuration option, or half the data, and re-check that the failure persists in exactly the same form — a failure that changes shape means you have found a second bug and should note it separately. Keep a log of what was removed and what could not be, because the irreducible set is the diagnosis. Finish with the report: environment and versions, the reduced code, the observed behaviour, the expected behaviour, and what you already ruled out.',
    why:
      'Reduction is usually done by guessing which parts matter. The stop-when-the-failure-changes-shape rule is what prevents chasing a different bug halfway through.',
    watchOut:
      'Some bugs only appear under load, timing or scale and genuinely cannot be minimised. Say so explicitly rather than producing a small case that does not reproduce.',
    related: ['binary-search-debugging', 'hypothesis-driven-debugging', 'defect-triage-matrix', 'exploratory-testing-charter'],
    tags: ['debugging', 'bug reports', 'reduction', 'communication'],
  },

  {
    id: 'defect-triage-matrix',
    name: 'Defect Triage Matrix',
    aka: ['severity versus priority', 'bug triage rubric'],
    origin: 'Standard QA and incident management practice',
    domains: ['engineering'],
    intents: ['prioritize', 'decide'],
    oneLiner:
      'Separate how bad a defect is when it happens from how soon it should be fixed, and make both a written rubric rather than a negotiation.',
    useWhen: [
      'every bug in the tracker is marked critical',
      'we argue about priority in every triage meeting',
      'a cosmetic issue got fixed before a data corruption bug',
      'nobody can explain why this bug has been open for a year',
    ],
    prompt:
      'Write a triage rubric for our defects. Define severity purely by impact when it occurs — data loss, security exposure, blocked workflow, degraded experience, cosmetic — with an observable test for each level, then define priority separately using frequency, affected population, workaround availability and business timing. Show why a high-severity, never-observed bug can rightly sit below a medium-severity daily annoyance. Then add the decision rules: what gets fixed in the current work, what becomes scheduled work, and what gets closed as will-not-fix, including who is allowed to make that call.',
    why:
      'Conflating severity with priority is why every bug ends up critical. Separating them with observable tests turns triage into classification instead of advocacy.',
    watchOut:
      'A rubric that nobody can apply without a debate is just a longer argument. Test it against twenty existing bugs before adopting it.',
    related: ['risk-based-testing', 'incident-severity-levels', 'minimal-reproducible-example', 'eisenhower-matrix'],
    tags: ['testing', 'triage', 'prioritisation', 'process'],
  },

  {
    id: 'testing-in-production',
    name: 'Testing in Production',
    aka: ['production verification', 'shift right testing'],
    origin: 'Charity Majors and the observability community, mid-2010s',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Accept that some behaviour only exists under real traffic and data, and build the controls — flags, cohorts, observability, kill switches — that make verifying there safe.',
    useWhen: [
      'the staging environment is nothing like production and never will be',
      'the bug only appears with real customer data volumes',
      'we spend a fortune maintaining an environment that still misses things',
      'we cannot reproduce it anywhere except live',
    ],
    prompt:
      'Design safe verification in production for this change. The prerequisites are the deliverable, so list them before any technique: the flag that scopes exposure, the cohort definition, the kill switch and who can pull it, the metric that says stop, and the data-safety rule for anything written during the test. Then choose among shadow traffic, dark launch, canary cohort and synthetic transactions, saying what each can and cannot verify here. Finally state what must never be tested this way — irreversible writes, money movement, anything affecting a third party — and why.',
    why:
      'The idea is usually taken as permission to be reckless. Leading with the control list, and with an explicit never-this-way category, is what makes it a practice rather than a slogan.',
    watchOut:
      'This requires observability that many teams do not have. Without the metric that says stop, you are not testing in production, you are just deploying and hoping.',
    related: ['canary-release', 'feature-flag-hygiene', 'synthetic-monitoring', 'smoke-test-suite'],
    tags: ['testing', 'production', 'observability', 'release'],
  },
]
