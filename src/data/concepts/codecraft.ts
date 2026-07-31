import type { Concept } from '../types'

export const codecraft: Concept[] = [
  {
    id: 'naming-as-design',
    name: 'Naming as Design',
    aka: ['intention-revealing names', 'if you cannot name it', 'renaming as refactoring'],
    origin: 'Kent Beck and Ward Cunningham; central to Clean Code and Refactoring',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Difficulty naming something is evidence about the design, not about vocabulary — a thing that resists a name usually does more than one job.',
    useWhen: [
      'I cannot think of a name for this function that is not manager or handler',
      'the name has and in it and I know that is bad',
      'reviewers keep asking what this variable actually holds',
      'the class is called util and does eleven things',
    ],
    prompt:
      'Review the names in this code as a design diagnostic. For each poorly named element, first try to name it precisely; where you cannot without a conjunction or a vague noun like manager, processor or data, report that as a cohesion finding rather than a naming one and say what the split would be. Then apply the specific tests: does the name state what it is rather than how it is implemented, does it use the domain\'s vocabulary rather than ours, is the abstraction level consistent with its neighbours, and does a boolean read positively. Rank the renames by how often the name appears in code and conversation.',
    why:
      'Treating an unnameable thing as a cohesion problem is what turns naming review from bikeshedding into design work, and it finds classes that should be split.',
    watchOut:
      'Renaming widely touches a lot of code and creates review noise. Do it as its own change so the real change stays reviewable.',
    related: ['ubiquitous-language', 'single-responsibility', 'readability-over-cleverness', 'api-naming-conventions'],
    tags: ['code quality', 'naming', 'design', 'refactoring'],
  },

  {
    id: 'readability-over-cleverness',
    name: 'Readability Over Cleverness',
    aka: ['write for the reader', 'code is read more than written', 'obvious code'],
    origin: 'Long-standing programming maxim; Brian Kernighan\'s debugging observation',
    domains: ['engineering'],
    intents: ['critique', 'communicate'],
    oneLiner:
      'Code is read far more often than written, and debugging is harder than writing — so code at the limit of your cleverness is code you cannot debug.',
    useWhen: [
      'this one-liner is impressive and nobody can explain it',
      'the reviewer asked what this does and the author had to think',
      'we saved four lines and lost an hour of comprehension',
      'the clever solution broke and nobody could fix it',
    ],
    prompt:
      'Review this code for comprehension cost. For each dense section, state what a competent reader unfamiliar with it must hold in their head simultaneously, and rewrite the worst offenders in the most boring form that does the same thing. Then compare honestly: sometimes the dense version is genuinely better because the boring one is longer and repetitive, so judge each case rather than applying a rule. Where the clever version wins, require a comment explaining the trick and why it is worth it. Finish with the places where cleverness was justified by a measured performance need and the places where it was habit.',
    why:
      'Making the comparison explicit rather than assuming boring is better keeps this from becoming dogma, and requiring justification for retained cleverness leaves a record for the next reader.',
    watchOut:
      'Verbose code is not automatically readable. Ten obvious lines can obscure intent that one well-named function call would have conveyed.',
    related: ['naming-as-design', 'cyclomatic-complexity', 'comment-why-not-what', 'code-review-checklist'],
    tags: ['code quality', 'readability', 'maintainability', 'review'],
  },

  {
    id: 'comment-why-not-what',
    name: 'Comment Why, Not What',
    aka: ['intent comments', 'self-documenting code', 'comment rot'],
    origin: 'Widely held convention; articulated in Clean Code and A Philosophy of Software Design',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'Comments should carry what the code cannot — the reason, the rejected alternative, the external constraint — because restating the code just creates something that goes stale.',
    useWhen: [
      'the comment says increment counter above counter plus plus',
      'the comment describes behaviour the code no longer has',
      'someone removed a strange line and broke production',
      'nobody knows why this sleep is here',
    ],
    prompt:
      'Audit the comments in this code. Delete those restating the code, since they add maintenance cost and will eventually lie. Then find the far more important gap: places where the code cannot express the reason and there is no comment — a workaround for a third-party bug with its issue reference, a deliberately unusual ordering, a value derived from a measurement, a legal or contractual constraint, or a rejected simpler approach that does not work. Write those comments. Finish with the invariants that are assumed but unstated, since a comment asserting an invariant is the most valuable kind and often signals where an assertion belongs.',
    why:
      'Hunting for missing why-comments is far more valuable than removing redundant ones, and workarounds without a reference are what make future readers delete necessary code.',
    watchOut:
      'A comment explaining confusing code is often a plaster over a naming or structure problem. Try fixing the code first.',
    related: ['naming-as-design', 'chestertons-fence', 'assertions-and-invariants', 'documentation-freshness'],
    tags: ['code quality', 'comments', 'documentation', 'maintainability'],
  },

  {
    id: 'magic-numbers-constants',
    name: 'Magic Numbers',
    aka: ['named constants', 'unexplained literals', 'configuration values in code'],
    origin: 'Long-standing code quality convention',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'An unexplained literal hides both its meaning and its relationship to the other literals that must change with it.',
    useWhen: [
      'there are three different timeout values and I do not know which to change',
      'someone changed a buffer size and something unrelated broke',
      'the number 86400 appears in six files',
      'nobody knows where this threshold came from',
    ],
    prompt:
      'Find the unexplained literals here and treat the relationships as the main finding. For each, give it a name that states its meaning, and then identify which other values must change with it — a buffer size that must exceed a message size, a timeout that must be shorter than its caller\'s, a retry count that multiplies with a delay to fit a budget — and express those as derivations rather than as separate literals, since independent constants drift apart. Then decide which belong in code as fixed constants and which are operational settings that should be configurable. Note any value nobody can justify, since that is a finding in itself.',
    why:
      'Expressing dependent values as derivations rather than separate named constants is what prevents the drift that causes subtle failures, and it is a step past simply naming things.',
    watchOut:
      'Naming a literal used once at its point of use can add indirection without adding meaning. The win is in relationships and repetition.',
    related: ['configuration-management', 'timeout-budgets', 'naming-as-design', 'comment-why-not-what'],
    tags: ['code quality', 'constants', 'maintainability', 'configuration'],
  },

  {
    id: 'guard-clauses',
    name: 'Guard Clauses',
    aka: ['early return', 'flattening nesting', 'bouncer pattern'],
    origin: 'Refactoring catalogue; replace nested conditional with guard clauses',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Handle the exceptional and invalid cases immediately and return, so the main path runs at one indentation level and reads as the intent.',
    useWhen: [
      'the function is six levels of nested if statements',
      'the happy path is buried in the middle of the function',
      'I cannot tell which condition leads to which outcome',
      'the else branches are far from their conditions',
    ],
    prompt:
      'Restructure this nesting into early exits. Identify the preconditions and error cases, handle each at the top with an immediate return or raise, and leave the main path unindented. Then check the two things this refactor can break: cleanup that was previously guaranteed by the single exit point, which now needs a scoped mechanism, and conditions whose evaluation order matters. Confirm neither is affected. Finish by looking at what the guards reveal — a long list of preconditions usually means validation belongs at a boundary rather than in this function, and repeated identical guards across functions mean the type should make them unnecessary.',
    why:
      'The cleanup-on-single-exit hazard is the real risk in this refactor, and reading the guard list as evidence of misplaced validation turns a formatting change into a design insight.',
    watchOut:
      'Many scattered return points in a long function can be harder to follow than nesting. This works best on functions short enough to see at once.',
    related: ['parse-dont-validate', 'cyclomatic-complexity', 'input-validation-boundary', 'readability-over-cleverness'],
    tags: ['code quality', 'control flow', 'readability', 'refactoring'],
  },

  {
    id: 'cyclomatic-complexity',
    name: 'Cyclomatic Complexity',
    aka: ['branch count', 'cognitive complexity', 'complexity metrics'],
    origin: 'Thomas McCabe, 1976; cognitive complexity from SonarSource',
    domains: ['engineering'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'Counting independent paths through a function gives a rough measure of how hard it is to test and to hold in your head — useful as a signal, harmful as a target.',
    useWhen: [
      'this function has too many branches to test properly',
      'we need an objective way to find the worst code',
      'someone set a complexity limit and people are gaming it',
      'the function is short and still incomprehensible',
    ],
    prompt:
      'Use complexity metrics to find the code most worth attention, and use them properly. Rank functions by branch count, then weight by change frequency from the history, because a complex function nobody touches is a much smaller problem than a moderately complex one edited weekly. For the top items, explain what the number means concretely: how many test cases full branch coverage would require. Then note where the metric misleads — a long flat switch scores high and reads easily, while deeply nested conditions score similarly and read terribly — and recommend the cognitive variant where that distinction matters. Recommend specific decompositions rather than a threshold.',
    why:
      'Weighting by change frequency is what makes the metric actionable, and distinguishing flat branching from nesting is why the raw number alone produces bad refactors.',
    watchOut:
      'Enforced as a hard limit, this is trivially gamed by extracting arbitrary fragments into badly named helpers, which is worse than the original.',
    related: ['code-smells-catalog', 'guard-clauses', 'hot-path-identification', 'goodharts-law'],
    tags: ['code quality', 'metrics', 'complexity', 'testing'],
  },

  {
    id: 'code-smells-catalog',
    name: 'Code Smells',
    aka: ['refactoring smells', 'feature envy', 'shotgun surgery', 'primitive obsession'],
    origin: 'Kent Beck and Martin Fowler, Refactoring, 1999',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'A vocabulary of recurring structural problems — each with a name, a diagnosis and a known refactoring — that turns vague unease into a specific finding.',
    useWhen: [
      'this code feels wrong and I cannot say why',
      'reviews produce vague comments about the code being messy',
      'I want to justify a refactor to someone who wants features',
      'the same kind of problem keeps appearing and we have no name for it',
    ],
    prompt:
      'Diagnose this code against the smell catalogue, naming each finding explicitly. Look for the ones with the highest cost: shotgun surgery, where one conceptual change requires edits in many places; divergent change, where one module changes for many unrelated reasons; feature envy, where a method is more interested in another object\'s data than its own; primitive obsession; long parameter lists; and message chains. For each, quote the code, name the smell, give the standard refactoring and estimate the effort. Then rank by evidence rather than severity — how often the affected code has been edited, and how many defects it has carried.',
    why:
      'Naming the smell connects an observation to a known remedy, and ranking by edit and defect history is what makes the refactoring case fundable rather than aesthetic.',
    watchOut:
      'A smell is a hint, not a verdict. Some are the right trade in context, and refactoring on the strength of the name alone can make things worse.',
    related: ['refactoring-catalog', 'god-object', 'connascence', 'single-responsibility'],
    tags: ['code quality', 'refactoring', 'diagnosis', 'review'],
  },

  {
    id: 'god-object',
    name: 'God Object',
    aka: ['blob class', 'the everything file', 'kitchen sink module'],
    origin: 'Anti-pattern literature; AntiPatterns, Brown and colleagues, 1998',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'One class or file accumulates most of the system\'s knowledge and becomes the thing every change touches and nobody dares restructure.',
    useWhen: [
      'this file is eight thousand lines and every pull request touches it',
      'merge conflicts always happen in the same class',
      'everything depends on this one module',
      'nobody understands the whole of it and everyone edits parts',
    ],
    prompt:
      'Plan the decomposition of this oversized module. Do it from evidence rather than intuition: cluster its methods by which fields they touch and by which callers use them, since disjoint clusters are the natural seams, and cross-reference with the commit history to see which parts change together. Then propose an extraction order starting with the cluster having the fewest inbound dependencies, so the first step is small and independently mergeable. For each extraction, state what breaks and how callers are updated. Finish with the guardrail preventing regrowth, since these reform quickly unless something makes adding to them uncomfortable.',
    why:
      'Clustering by field access and co-change history finds real seams, and starting with the least-depended-upon cluster is what makes the first step shippable rather than a six-month branch.',
    watchOut:
      'Splitting a large class into pieces that all still need each other produces the same coupling with more files. Verify the clusters are genuinely disjoint first.',
    related: ['code-smells-catalog', 'single-responsibility', 'coupling-metrics', 'package-by-feature'],
    tags: ['code quality', 'anti-patterns', 'refactoring', 'modularity'],
  },

  {
    id: 'connascence',
    name: 'Connascence',
    aka: ['forms of coupling', 'connascence of name and position', 'coupling taxonomy'],
    origin: 'Meilir Page-Jones, 1992; revived by Jim Weirich',
    domains: ['engineering'],
    intents: ['critique', 'explain'],
    oneLiner:
      'A precise vocabulary for coupling: two pieces of code are connascent if changing one requires changing the other, and the kinds range from harmless to dangerous.',
    useWhen: [
      'these two modules are coupled and I cannot explain how badly',
      'reviews argue about coupling with no shared vocabulary',
      'a change here always requires a change there and nobody knows why',
      'I want to compare two designs on coupling rather than by feel',
    ],
    prompt:
      'Analyse the coupling between these components using the connascence taxonomy. Identify each form present — name, type, meaning where a magic value is agreed, position where argument order matters, algorithm where two places must implement the same rule identically, timing, and execution order — and note that the later forms are progressively harder to detect and to change safely. Then apply the two axes that make this useful: strength, since weaker forms are preferable, and locality, since strong coupling inside one small module is fine while the same coupling across a service boundary is dangerous. Recommend conversions from stronger to weaker forms, prioritising the least local instances.',
    why:
      'The strength-times-distance framing explains why the same coupling is fine locally and unacceptable across a boundary, which is the judgement most coupling arguments are missing.',
    watchOut:
      'Connascence of algorithm — two places implementing the same rule — is invisible to every tool and is the one that produces silent divergence.',
    related: ['coupling-metrics', 'code-smells-catalog', 'law-of-demeter', 'rule-of-three-duplication'],
    tags: ['code quality', 'coupling', 'design', 'vocabulary'],
  },

  {
    id: 'coupling-metrics',
    name: 'Coupling and Cohesion Metrics',
    aka: ['afferent and efferent coupling', 'instability metric', 'dependency structure matrix'],
    origin: 'Robert C. Martin\'s package metrics; structured design lineage',
    domains: ['engineering'],
    intents: ['diagnose', 'estimate'],
    oneLiner:
      'Measure how many things depend on a module and how many it depends on, to find the components that are hard to change and the ones that are risky to change.',
    useWhen: [
      'I do not know which modules are safe to modify',
      'a small change caused failures in unrelated areas',
      'we want to split the system and do not know where',
      'someone claims the architecture is layered and I want to check',
    ],
    prompt:
      'Compute the dependency structure of this codebase. For each module, count inbound and outbound dependencies and identify three categories: highly depended upon, where a change is risky and the interface should be stable; highly dependent, where the module is fragile to others\' changes; and cyclic groups, which cannot be understood, tested or deployed independently and should be reported first. Then compare the actual dependency graph against the intended architecture and list every violation. Finish with the modules that are both heavily depended upon and frequently changed, since that combination is the highest-risk code in the system.',
    why:
      'Cycles and the depended-upon-yet-frequently-changing intersection are the two findings that predict where breakage happens, and both fall straight out of the graph.',
    watchOut:
      'Static dependency graphs miss runtime coupling through configuration, events and shared data. A clean graph does not prove modules are independent.',
    related: ['connascence', 'god-object', 'package-by-feature', 'single-responsibility'],
    tags: ['code quality', 'coupling', 'metrics', 'architecture'],
  },

  {
    id: 'refactoring-catalog',
    name: 'Refactoring Catalogue',
    aka: ['named refactorings', 'extract method', 'behaviour-preserving change'],
    origin: 'Martin Fowler, Refactoring, 1999 and 2018',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'A set of named, small, behaviour-preserving transformations with known mechanics — applying them one at a time is what makes large restructuring safe.',
    useWhen: [
      'the refactor turned into a rewrite and broke things',
      'we changed the structure and the behaviour at the same time and cannot tell what broke',
      'I know this needs restructuring but not how to get there in steps',
      'the refactoring branch has been open for three weeks',
    ],
    prompt:
      'Plan this restructuring as a sequence of named refactorings, each small enough to complete and verify in minutes. For each step, give the transformation, the mechanics, and confirm it preserves behaviour so the tests should pass unchanged at every step — any step where they must change is not a refactoring and should be separated and labelled as a behaviour change. Then order the steps so the code compiles and passes at every point and each is independently mergeable, since that is what prevents a long-lived branch. Finish with the point at which we could stop and still be better off than we started, because most refactorings are abandoned partway.',
    why:
      'The stop-and-still-be-better checkpoint is what makes incremental restructuring survive changing priorities, and separating behaviour changes from structural ones is what keeps the tests meaningful.',
    watchOut:
      'Refactoring without adequate tests is editing and hoping. Establish the safety net first even if that means characterisation tests you throw away later.',
    related: ['preparatory-refactoring', 'characterization-tests', 'branch-by-abstraction', 'code-smells-catalog'],
    tags: ['code quality', 'refactoring', 'process', 'safety'],
  },

  {
    id: 'preparatory-refactoring',
    name: 'Preparatory Refactoring',
    aka: ['make the change easy then make the easy change', 'two-hat refactoring'],
    origin: 'Kent Beck, 2012',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Before adding a feature, reshape the code so the feature becomes a simple addition — and keep the two commits separate so both are reviewable.',
    useWhen: [
      'adding this feature means threading a parameter through eleven functions',
      'the change is small in principle and horrible in this code',
      'the pull request mixes a refactor and a feature and nobody can review it',
      'we always say we will clean up afterwards and never do',
    ],
    prompt:
      'Plan this feature as preparation followed by addition. First describe the shape the code would need for the feature to be a small local change, then give the behaviour-preserving steps to reach that shape, keeping them as separate commits with tests passing throughout. Then show the feature as the addition it becomes. The reviewability argument matters, so state it: a reviewer can verify a structural change is behaviour-preserving and verify a small feature, and cannot do either when they are mixed. Finish by scoping the preparation to what this feature actually needs, since the temptation is to fix everything you notice on the way.',
    why:
      'Separating the commits is what makes both halves reviewable, and scoping preparation to the feature at hand is what stops it becoming an open-ended cleanup.',
    watchOut:
      'Preparation that turns out to be unnecessary is speculative design. If the feature would have been fine without it, you refactored for taste rather than need.',
    related: ['refactoring-catalog', 'review-size-limits', 'commit-hygiene', 'boy-scout-rule'],
    tags: ['code quality', 'refactoring', 'workflow', 'review'],
  },

  {
    id: 'boy-scout-rule',
    name: 'Boy Scout Rule',
    aka: ['leave it better than you found it', 'opportunistic refactoring'],
    origin: 'Robert C. Martin, adapting the scouting maxim',
    domains: ['engineering'],
    intents: ['plan', 'steer'],
    oneLiner:
      'Improve something small in every area you touch, so quality rises continuously in exactly the code that gets used rather than through cleanup projects.',
    useWhen: [
      'quality work never gets prioritised as its own project',
      'the codebase degrades a little with every change',
      'we plan big cleanups that never happen',
      'the worst code is also the code we edit most',
    ],
    prompt:
      'Apply an improve-as-you-go practice to this change. Identify the small improvements available in the code being touched — a clarifying rename, a missing test, an extracted function, a deleted dead branch, a comment recording why — and pick the one or two with the best value for the review cost. Then state the boundary explicitly, because that is what makes this sustainable: improvements stay within the area already being modified and never expand the review beyond what a reviewer can hold, and anything larger becomes a separate ticket. Finish by noting that this concentrates improvement in frequently edited code, which is exactly where it pays.',
    why:
      'Bounding the improvement to the area already touched is what keeps this from producing unreviewable pull requests, which is how the practice usually dies.',
    watchOut:
      'Unbounded cleanup mixed into a feature change makes review harder and can hide a real defect among the noise of formatting.',
    related: ['preparatory-refactoring', 'review-size-limits', 'broken-windows', 'technical-debt-register'],
    tags: ['code quality', 'refactoring', 'practice', 'incremental'],
  },

  {
    id: 'broken-windows',
    name: 'Broken Windows',
    aka: ['entropy in codebases', 'quality norms', 'first crack'],
    origin: 'Wilson and Kelling\'s criminology theory; applied to software by the Pragmatic Programmers',
    domains: ['engineering'],
    intents: ['diagnose', 'steer'],
    oneLiner:
      'Visible neglect licenses more neglect — once a codebase looks uncared-for, the standard for what is acceptable falls quickly.',
    useWhen: [
      'the new code is as messy as the old code',
      'people copy the existing bad pattern because it is what is there',
      'the failing test has been commented out for months and nobody minds',
      'standards slipped and I cannot point to a single decision',
    ],
    prompt:
      'Identify the visible signals of neglect in this codebase that are shaping what people think is acceptable: disabled tests, ignored warnings, stale to-do comments, commented-out code, an unformatted file, an unfixed lint rule, an outdated readme. Rank them by visibility rather than by technical severity, since the argument here is about norms and the most-seen ones do the most damage. Then propose the smallest set of fixes that would visibly reset the standard, and the automation that keeps each fixed — a norm maintained by discipline decays, one enforced by tooling does not. Finish with what the team should agree is now unacceptable.',
    why:
      'Ranking by visibility rather than severity is the right ordering for a norms problem, and pairing each fix with automation is what makes the reset last.',
    watchOut:
      'A tidy codebase is not a correct one. Do not let visible neatness substitute for the harder work on structure and tests.',
    related: ['boy-scout-rule', 'linting-and-formatting', 'ci-signal-hygiene', 'technical-debt-register'],
    tags: ['code quality', 'culture', 'norms', 'maintenance'],
  },

  {
    id: 'dead-code-removal',
    name: 'Dead Code Removal',
    aka: ['unused code deletion', 'unreachable branches', 'code archaeology'],
    origin: 'Standard maintenance practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Unused code costs comprehension, review time, build time and security surface, and every reader has to work out whether it matters.',
    useWhen: [
      'half this file is commented out and I do not know if it is needed',
      'we maintain a feature nobody has used in two years',
      'there are three implementations and I cannot tell which is live',
      'the dependency is only used by code that never runs',
    ],
    prompt:
      'Identify code that can be deleted here, using evidence rather than reading. Combine static analysis for unreferenced symbols with runtime evidence — instrumentation showing a path was never executed over a meaningful window — because static analysis misses reflection, dynamic dispatch and configuration-driven paths, and runtime data misses rare but legitimate uses. State the confidence for each candidate and the window observed. Then propose the safe removal sequence: instrument first, then log-and-warn, then remove, with the observation period before each step. Finish by noting that version control is the archive, so nothing needs commenting out.',
    why:
      'Combining static and runtime evidence with a stated observation window is what makes deletion safe, and the instrument-then-remove sequence catches the rare legitimate caller.',
    watchOut:
      'Public interfaces and library exports may be used by consumers you cannot see. Internal-only code is much safer to delete than anything published.',
    related: ['chestertons-fence', 'api-usage-analytics', 'copy-paste-detection', 'technical-debt-register'],
    tags: ['code quality', 'maintenance', 'deletion', 'simplification'],
  },

  {
    id: 'copy-paste-detection',
    name: 'Duplication Detection',
    aka: ['clone detection', 'copy-paste analysis', 'duplicate blocks'],
    origin: 'Static analysis practice; clone detection research',
    domains: ['engineering'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'Automated detection finds where the same logic exists in several places — then judgement decides which duplicates are a risk and which are coincidence.',
    useWhen: [
      'we fixed a bug and the same bug exists in three other places',
      'a security fix was applied in one copy and not the others',
      'the same function has been copied across five services',
      'I suspect there is duplication and want to know where',
    ],
    prompt:
      'Run duplication analysis over this codebase and interpret the results properly. Report the clone groups, then classify each: duplication of a rule where divergence is a defect, which must be unified; duplication of shape where the instances serve different purposes and unifying would couple them wrongly; and generated or boilerplate code, which is noise. Prioritise by risk rather than by size — a duplicated authorisation check or validation rule is far more dangerous than a long duplicated data structure. Then check the history: for each risky clone, has a change ever been applied to one copy and not the others, since that is direct evidence of the harm.',
    why:
      'Finding a past fix applied to one copy but not others is the evidence that converts a duplication report into an urgent correctness issue.',
    watchOut:
      'Aggressively unifying coincidental duplication creates shared components that must change for unrelated reasons, which is worse than the duplication.',
    related: ['rule-of-three-duplication', 'code-smells-catalog', 'dead-code-removal', 'static-analysis-adoption'],
    tags: ['code quality', 'duplication', 'static analysis', 'risk'],
  },

  {
    id: 'technical-debt-register',
    name: 'Technical Debt Register',
    aka: ['debt inventory', 'deliberate versus inadvertent debt', 'debt quadrants'],
    origin: 'Ward Cunningham\'s debt metaphor, 1992; Fowler\'s technical debt quadrant',
    domains: ['engineering'],
    intents: ['prioritize', 'communicate'],
    oneLiner:
      'Make the shortcuts explicit with their cost and the interest they accrue, so paying them down competes for priority on evidence rather than on complaint.',
    useWhen: [
      'everyone says the codebase is full of debt and nobody can point at it',
      'we cannot justify cleanup work to stakeholders',
      'the same complaints recur in every retrospective with no action',
      'we took a shortcut and nobody remembers why or where',
    ],
    prompt:
      'Build a debt register for this codebase. For each item, record what was traded and why, which is often a legitimate deliberate decision rather than a mistake, plus the interest it charges — specifically, what it makes slower or riskier today, expressed in something measurable like time added per change or defects attributable to it. That interest figure is what allows prioritisation against feature work, so estimate it rather than leaving it qualitative. Then rank by interest rather than by principal, since large ugly code nobody touches costs nothing. Finish with the items to accept permanently and stop discussing.',
    why:
      'Ranking by interest rather than by how bad the code looks is what directs effort to the debt actually costing money, and it makes the case in terms leadership can weigh.',
    watchOut:
      'A register that becomes a dumping ground for every complaint loses signal. Require an interest estimate as the entry price.',
    related: ['boy-scout-rule', 'code-smells-catalog', 'cost-of-delay', 'lead-time-analysis'],
    tags: ['code quality', 'technical debt', 'prioritisation', 'communication'],
  },

  {
    id: 'cargo-cult-code',
    name: 'Cargo Cult Code',
    aka: ['copied without understanding', 'ritual configuration', 'superstitious code'],
    origin: 'Richard Feynman\'s cargo cult science; applied to programming practice',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Code and configuration copied because it appeared alongside something that worked, without anyone knowing which parts are load-bearing.',
    useWhen: [
      'this configuration block is in every service and nobody knows what it does',
      'we always add these three lines because the template has them',
      'someone said we needed this flag years ago',
      'the setup includes steps from a tutorial for a different framework',
    ],
    prompt:
      'Identify the parts of this code or configuration that nobody can currently justify. For each, try to establish what it does and whether it is required, then classify: load-bearing and should be documented with its reason, harmless but pointless and should be removed, or actively harmful. Then design the safe test for the uncertain ones — remove in an environment where the consequence is observable, with a defined observation window and a specific signal, rather than removing and hoping. Be explicit that not knowing what something does is a reason to investigate rather than to keep or to delete, since both reflexes are wrong.',
    why:
      'Framing the unknown as neither keep nor delete but investigate, with a designed removal test, is what breaks the standoff between superstition and recklessness.',
    watchOut:
      'Some copied code protects against a failure that has not occurred recently precisely because it works. Establish what it defends before removing it.',
    related: ['chestertons-fence', 'dead-code-removal', 'comment-why-not-what', 'configuration-management'],
    tags: ['code quality', 'understanding', 'configuration', 'maintenance'],
  },

  {
    id: 'defensive-programming-limits',
    name: 'Limits of Defensive Programming',
    aka: ['paranoid checks', 'over-validation', 'trust boundaries in code'],
    origin: 'Software construction practice; discussed in Code Complete and A Philosophy of Software Design',
    domains: ['engineering'],
    intents: ['critique', 'decide'],
    oneLiner:
      'Checking everything everywhere hides bugs behind fallbacks and doubles the code — defend at boundaries and assert internally instead.',
    useWhen: [
      'every function checks its arguments even when the caller already did',
      'the code swallows errors and returns a default and nobody notices failures',
      'half of every function is null checks',
      'a bug survived for months because a fallback quietly hid it',
    ],
    prompt:
      'Review the defensive checks in this code and classify each by where it sits. At a trust boundary, where input comes from outside, validation is required and must produce a clear error. Inside the trusted core, a check for something that should be impossible is an assertion — it should crash loudly rather than fall back to a default, because a silent fallback converts a detectable bug into corrupted data. Find every place we currently return a default or swallow an exception for an impossible condition and say what damage that hides. Then delete the redundant checks that duplicate boundary validation and show what the types could enforce instead.',
    why:
      'Distinguishing boundary validation from internal assertion is the whole discipline, and the silent-fallback audit finds the checks that actively hide defects.',
    watchOut:
      'Crashing loudly is right in a service that restarts and wrong in software running on a customer\'s device. The correct response depends on what recovery is available.',
    related: ['assertions-and-invariants', 'input-validation-boundary', 'fail-fast-vs-fault-tolerance', 'parse-dont-validate'],
    tags: ['code quality', 'error handling', 'validation', 'design'],
  },

  {
    id: 'assertions-and-invariants',
    name: 'Assertions and Invariants',
    aka: ['executable assumptions', 'internal consistency checks', 'crash early'],
    origin: 'Design by contract lineage; Pragmatic Programmer practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Write down the conditions that must always hold as executable checks, so a violated assumption is caught where it happens rather than three layers away.',
    useWhen: [
      'the error surfaces far from where the data went wrong',
      'we have comments saying this must never be null',
      'a corrupted value propagated through the system before anyone noticed',
      'debugging takes hours because the failure is remote from the cause',
    ],
    prompt:
      'Identify the invariants in this code and make them executable. Look for assumptions currently held in comments, in variable names, or in nobody\'s head: relationships between fields, ordering guarantees, non-empty collections, ranges, and state machine constraints. For each, write the check and place it where the invariant could first be violated rather than where it is later relied upon. Then decide behaviour in production per assertion — crash, log and continue, or emit a metric — based on what happens if we proceed with a violated invariant, since for anything touching money or user data proceeding is usually worse than stopping. Note which should also become type-level guarantees.',
    why:
      'Placing the check where the invariant could first break, rather than where it is used, is what collapses the distance between cause and symptom during debugging.',
    watchOut:
      'Assertions compiled out in production give you checks exactly where you do not need them. Decide deliberately which must remain live.',
    related: ['design-by-contract', 'defensive-programming-limits', 'illegal-states-unrepresentable', 'comment-why-not-what'],
    tags: ['code quality', 'debugging', 'correctness', 'invariants'],
  },

  {
    id: 'design-by-contract',
    name: 'Design by Contract',
    aka: ['preconditions and postconditions', 'Eiffel contracts', 'obligations and benefits'],
    origin: 'Bertrand Meyer, Eiffel, 1986',
    domains: ['engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'State what a routine requires of its caller, what it guarantees in return, and what it keeps true throughout — and make violation the caller\'s bug, not a case to handle.',
    useWhen: [
      'nobody knows whose job it is to check this argument',
      'both caller and callee validate the same thing defensively',
      'the documentation says what it does but not what it needs',
      'a subclass quietly demands more than its parent did',
    ],
    prompt:
      'Write contracts for these routines. For each, state the precondition the caller must satisfy, the postcondition guaranteed if the precondition holds, and any invariant preserved. Then use them to settle the redundant-checking question: with a stated precondition, the caller is responsible and the callee may assert rather than validate, which removes duplicated checks. Say which of our current checks that eliminates. Cover the inheritance rule too, since a subtype may only weaken preconditions and strengthen postconditions, and flag any override that violates it. Finish with which contracts should be enforced at runtime and which are documentation.',
    why:
      'Contracts assign responsibility, which is what eliminates duplicated validation, and the inheritance rule catches substitutability violations that no type checker sees.',
    watchOut:
      'Contracts on interfaces crossing a trust boundary are not enough. Untrusted input needs real validation regardless of what the contract says.',
    related: ['assertions-and-invariants', 'liskov-substitution', 'defensive-programming-limits', 'thread-safety-contracts'],
    tags: ['code quality', 'contracts', 'correctness', 'documentation'],
  },

  {
    id: 'fail-fast-vs-fault-tolerance',
    name: 'Fail Fast versus Fault Tolerance',
    aka: ['crash early', 'let it crash', 'graceful degradation in code'],
    origin: 'Erlang\'s let-it-crash philosophy versus defensive traditions',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Decide per failure whether stopping immediately or continuing degraded does less harm, because applying one policy everywhere is wrong in both directions.',
    useWhen: [
      'the service kept running with corrupt state and made it worse',
      'one bad record stopped a job that could have skipped it',
      'we catch everything at the top and log it and carry on',
      'the process crashes on a problem it could have worked around',
    ],
    prompt:
      'Classify the failure modes in this code and assign a policy to each. Stopping immediately is right when continuing would corrupt data, produce wrong results, or hide a defect; continuing degraded is right when the failure is expected, isolated to one item or one optional feature, and the rest of the work is still correct. Apply that test to each of our current catch blocks and report the ones that are wrong. Then specify the supervision around fail-fast components — what restarts them, with what backoff, and how a crash loop is detected — since stopping fast is only safe when something reliably brings the system back.',
    why:
      'Crash-fast is only a strategy when supervision and restart behaviour exist, and specifying that alongside the policy is what makes it safe rather than merely brave.',
    watchOut:
      'Catch-all handlers at the top of a request path convert every unexpected failure into a degraded success. That is a policy decision made by accident.',
    related: ['defensive-programming-limits', 'graceful-degradation', 'dead-letter-queue', 'assertions-and-invariants'],
    tags: ['code quality', 'error handling', 'reliability', 'design'],
  },

  {
    id: 'result-error-handling',
    name: 'Errors as Values',
    aka: ['result types', 'either type', 'checked versus unchecked errors'],
    origin: 'Functional programming tradition; mainstream via Rust, Go and modern type systems',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Return failures as part of the type rather than as an out-of-band throw, so the compiler and the reader can see which calls can fail and force a decision.',
    useWhen: [
      'I cannot tell from a signature which calls can fail',
      'an exception from three layers down surfaced somewhere unexpected',
      'we catch and rethrow with no added information at every layer',
      'a failure was silently swallowed and nobody knew',
    ],
    prompt:
      'Redesign error handling for this module around explicit outcomes. Separate expected failures, which are ordinary results the caller must handle — not found, invalid, conflict, unavailable — from genuine defects, which should not be modelled as values at all. Show the types for the first category. Then address the ergonomics honestly, because verbose propagation is what makes teams abandon this: show the composition or propagation mechanism our language offers. Finish with the boundary policy, since interoperating with exception-based libraries means converting at the edge, and specify exactly where that conversion happens so both styles do not spread through the codebase.',
    why:
      'Separating expected failures from defects is what keeps the result type from becoming a catch-all, and fixing the conversion boundary prevents two error styles interleaving everywhere.',
    watchOut:
      'Wrapping every possible failure in a result type, including programming errors, produces enormous ceremony and hides the failures that matter.',
    related: ['railway-oriented-programming', 'exception-hierarchy-design', 'parse-dont-validate', 'error-message-design'],
    tags: ['code quality', 'error handling', 'types', 'design'],
  },

  {
    id: 'exception-hierarchy-design',
    name: 'Exception Hierarchy Design',
    aka: ['error taxonomy', 'catchable categories', 'wrapping exceptions'],
    origin: 'Object-oriented error handling practice; Effective Java guidance',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Design exception types around how callers will handle them, not around where they were thrown, and preserve the original cause when wrapping.',
    useWhen: [
      'callers catch the base exception type because they cannot distinguish cases',
      'the stack trace stops at a layer boundary and the real cause is gone',
      'we have forty exception classes and callers catch three',
      'the same failure arrives as a different type depending on the path',
    ],
    prompt:
      'Design the exception taxonomy for this component from the caller\'s perspective. Enumerate the distinct handling strategies a caller could reasonably take — retry, fall back, report to the user, abort — and define one type per strategy rather than one per throw site, since types callers cannot act on differently do not need to be distinct. Then set the rules for crossing layers: wrap lower-level exceptions in domain terms while always preserving the cause chain, and never catch a broad type only to log and rethrow unchanged. Finish with the information each exception must carry so a handler and a log reader can both act on it.',
    why:
      'Deriving types from caller handling strategies is what stops the proliferation of unusable exception classes, and cause-chain preservation is what keeps the trace diagnostic across boundaries.',
    watchOut:
      'Wrapping without preserving the cause destroys the only evidence of what actually failed, and it is invisible until you need it during an incident.',
    related: ['result-error-handling', 'error-message-design', 'error-response-design', 'fail-fast-vs-fault-tolerance'],
    tags: ['code quality', 'error handling', 'design', 'diagnostics'],
  },

  {
    id: 'error-message-design',
    name: 'Error Message Design',
    aka: ['diagnostic messages', 'actionable errors', 'what went wrong and what to do'],
    origin: 'Usability and developer experience practice; compiler error message research',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'A good error names what failed, gives the specific values involved, and says what to do next — the reader is stuck, and the message is your only chance to help.',
    useWhen: [
      'the error says operation failed and nothing else',
      'support tickets all say it did not work with no detail',
      'the message tells us what happened but not what to do',
      'users see a stack trace and a raw exception name',
    ],
    prompt:
      'Rewrite these error messages for the person who will read them. Each should carry four things: what was attempted, what went wrong, the specific values involved including the offending input, and the next action. Then separate audiences deliberately — the end user needs plain language and a next step, while the log needs identifiers, context and correlation — and design both rather than showing one to the other. Check each rewritten message against the test that matters: could someone act on this without opening the code. Finally, audit for the information that must not appear, such as secrets, other users\' data, or details that would help an attacker.',
    why:
      'The could-you-act-without-the-source test is a concrete bar, and separating user-facing from log-facing content prevents the usual compromise that serves neither.',
    watchOut:
      'Including the offending input in the message can echo untrusted data into logs and interfaces. Truncate and escape it.',
    related: ['error-response-design', 'exception-hierarchy-design', 'assertion-roulette', 'structured-logging'],
    tags: ['code quality', 'errors', 'usability', 'writing'],
  },

  {
    id: 'delta-debugging',
    name: 'Delta Debugging',
    aka: ['automated input minimisation', 'ddmin', 'systematic reduction'],
    origin: 'Andreas Zeller, 1999',
    domains: ['engineering'],
    intents: ['diagnose'],
    oneLiner:
      'Automatically shrink a failing input or change set by systematically removing parts and re-testing, converging on the minimal thing that still fails.',
    useWhen: [
      'the failing input is a ten megabyte file and I cannot read it',
      'the regression is somewhere in a hundred commits',
      'the configuration that breaks it has two hundred settings',
      'reducing this by hand would take days',
    ],
    prompt:
      'Set up systematic reduction for this failure. Define the three pieces precisely: the input space and how it can be split, the test that classifies an attempt as failing, passing or invalid — that third category matters because most reduced inputs will be malformed rather than informative — and the granularity to stop at. Then run the reduction conceptually and explain how the algorithm narrows, so the result is understood rather than magic. Apply the same technique to change sets as well as inputs, since bisecting a set of configuration differences or commits uses the same procedure. Finish with what the minimal case tells us about the cause.',
    why:
      'Explicitly handling the invalid-input category is what makes automated reduction converge instead of wandering, and it is the part hand-rolled reductions get wrong.',
    watchOut:
      'A minimal input for a nondeterministic failure is meaningless, since the test result varies independently of the reduction. Establish reliable reproduction first.',
    related: ['minimal-reproducible-example', 'binary-search-debugging', 'fuzz-testing', 'hypothesis-driven-debugging'],
    tags: ['debugging', 'automation', 'reduction', 'diagnosis'],
  },

  {
    id: 'print-debugging-discipline',
    name: 'Instrumented Debugging',
    aka: ['printf debugging done well', 'trace statements', 'debugger versus logging'],
    origin: 'Universal practice; discipline articulated in debugging literature',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Adding output to understand a running program works well when the additions are chosen to discriminate between hypotheses rather than sprinkled hopefully.',
    useWhen: [
      'I have added twenty print statements and learned nothing',
      'the debugger changes the timing and the bug disappears',
      'I cannot attach a debugger to this environment',
      'the output is so noisy I cannot find what I added',
    ],
    prompt:
      'Turn this into a disciplined instrumentation exercise. State the competing hypotheses first, then place output at the points that would distinguish between them — a value at a boundary that is correct under one hypothesis and wrong under another — rather than at every step. Each statement should print an identifier, the values involved and enough context to correlate across concurrent activity. Then say when to use the debugger instead: interactive stepping is superior for a reproducible single-threaded failure and useless for a timing-dependent or production-only one. Finish with what happens to the instrumentation afterwards — deleted, or promoted into permanent structured telemetry if it proved valuable.',
    why:
      'Placing output where hypotheses diverge, rather than where the code looks interesting, is the difference between a two-minute diagnosis and an afternoon, and promoting good instrumentation makes the next bug cheaper.',
    watchOut:
      'Debug output containing user data can land in logs and violate privacy commitments. Treat temporary instrumentation as if it will ship, because sometimes it does.',
    related: ['hypothesis-driven-debugging', 'observability-instrumentation', 'structured-logging', 'delta-debugging'],
    tags: ['debugging', 'instrumentation', 'diagnosis', 'practice'],
  },

  {
    id: 'commit-hygiene',
    name: 'Commit Hygiene',
    aka: ['atomic commits', 'commit messages', 'clean history'],
    origin: 'Version control practice; conventions such as Conventional Commits',
    domains: ['engineering', 'writing'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Each commit should be one coherent change with a message explaining why, because history is the only documentation guaranteed to still exist.',
    useWhen: [
      'the commit message says fixes and nothing else',
      'I cannot revert one change because it is mixed with four others',
      'bisecting is impossible because half the commits do not build',
      'I found the line that caused the bug and the commit explains nothing',
    ],
    prompt:
      'Improve the commit structure and messages for this work. Split the changes so each commit is independently buildable and revertible and does one thing — a refactor, a feature, a formatting pass — which is what makes both reverting and bisecting possible. Then write messages with a short imperative summary and a body explaining why the change was needed, what alternatives were rejected, and any consequence a future reader should know, since the what is already in the diff. Include references to the issue or incident that prompted it. Finish with the policy on rewriting history before review and the rule for shared branches.',
    why:
      'Independently buildable commits are what make bisecting work, and the why-and-rejected-alternatives body is the documentation that survives when everything else is deleted.',
    watchOut:
      'A pristine history is not worth blocking work over. The value is in revertibility and explanation, not in aesthetics.',
    related: ['review-size-limits', 'preparatory-refactoring', 'binary-search-debugging', 'pull-request-description'],
    tags: ['version control', 'documentation', 'workflow', 'history'],
  },

  {
    id: 'pull-request-description',
    name: 'Pull Request Description',
    aka: ['change summary for reviewers', 'review context', 'PR template'],
    origin: 'Code review practice',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Give reviewers the context they cannot get from the diff — why this change, what alternatives you rejected, what you are unsure about, and how to verify it.',
    useWhen: [
      'reviewers ask questions I could have answered up front',
      'the review focuses on style because nobody understands the intent',
      'nobody knows how to test this change',
      'the pull request title is update code',
    ],
    prompt:
      'Write the description for this change. Include what a reviewer cannot derive from the diff: the problem being solved, the approach and why, the alternatives considered and rejected, the areas where you specifically want scrutiny, and how the change was verified. That request-for-scrutiny section is the highest-value part, so be specific about which parts you are least confident in rather than asking for general review. Then add the practical context: how to test it, risk and rollback, and anything that must be done at deploy time. Keep it short enough that reviewers actually read it, and note where the diff itself is self-explanatory.',
    why:
      'Explicitly naming the parts you are unsure about directs reviewer attention where defects are most likely, which is the single change that most improves review effectiveness.',
    watchOut:
      'A long description compensating for an unreviewable diff is treating the symptom. If it needs an essay, the change is probably too large.',
    related: ['review-size-limits', 'code-review-checklist', 'commit-hygiene', 'architecture-decision-records'],
    tags: ['code review', 'communication', 'writing', 'workflow'],
  },

  {
    id: 'code-review-checklist',
    name: 'Code Review Focus',
    aka: ['what reviewers should look for', 'review checklist', 'review priorities'],
    origin: 'Code review research; Google\'s engineering practices documentation',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Reviewers should spend their attention on what tools cannot check — correctness, design, security and missing cases — not on formatting a linter should own.',
    useWhen: [
      'reviews are full of style comments and miss real bugs',
      'a serious defect got approved by two reviewers',
      'reviews take days and produce nothing substantive',
      'nobody knows what they are supposed to be looking for',
    ],
    prompt:
      'Define what our reviews should focus on, ordered by what only a human can do. Start with correctness against intent, including the cases the change does not handle, then design fit with the surrounding code, then security and privacy implications, then test adequacy, then readability for the next reader. Automate everything below that line and say so explicitly, since style comments crowd out substantive ones. Then set the norms that determine whether review works: turnaround expectation, how comments are phrased as questions rather than instructions, which comments block approval versus are suggestions, and how disagreement is resolved without stalling.',
    why:
      'Drawing the line between human review and automation is what recovers reviewer attention for defects, and marking blocking versus non-blocking comments is what stops reviews stalling on preferences.',
    watchOut:
      'Approving because the author is experienced defeats the purpose. Review effort should scale with risk, not with trust in the author.',
    related: ['review-size-limits', 'pull-request-description', 'linting-and-formatting', 'security-review-triggers'],
    tags: ['code review', 'quality', 'process', 'collaboration'],
  },

  {
    id: 'review-size-limits',
    name: 'Review Size Limits',
    aka: ['small pull requests', 'reviewable chunks', 'defect detection falls with size'],
    origin: 'Code review research; SmartBear study on review effectiveness',
    domains: ['engineering'],
    intents: ['plan', 'critique'],
    oneLiner:
      'Defect detection falls sharply as a change grows, so a huge pull request is not reviewed more thoroughly, it is reviewed less.',
    useWhen: [
      'the pull request has ninety files and got approved in four minutes',
      'reviews sit for days because nobody wants to start them',
      'we cannot split this change without it being broken in between',
      'the review found nothing and production found plenty',
    ],
    prompt:
      'Break this large change into reviewable pieces. The obstacle is usually that intermediate states must work, so use the techniques that allow it: introduce the new path behind a flag, add the new code before removing the old, and separate mechanical changes such as renames and moves from behavioural ones so the reviewer can skim the first and concentrate on the second. Give the sequence with each piece independently mergeable. Then state the practical limits for us — a size beyond which we split, and a review turnaround target — and acknowledge the changes that genuinely cannot be split, where the response is a walkthrough rather than an asynchronous review.',
    why:
      'Separating mechanical from behavioural changes is what makes a large change reviewable, and admitting that some changes need a live walkthrough is more honest than pretending a huge diff got reviewed.',
    watchOut:
      'Splitting into pieces that individually make no sense shifts the burden to the reviewer to reassemble them. Each piece must be coherent on its own.',
    related: ['code-review-checklist', 'commit-hygiene', 'preparatory-refactoring', 'small-batch-releases'],
    tags: ['code review', 'process', 'quality', 'workflow'],
  },

  {
    id: 'code-ownership',
    name: 'Code Ownership Models',
    aka: ['strong versus collective ownership', 'CODEOWNERS', 'maintainer model'],
    origin: 'Martin Fowler\'s ownership taxonomy; open source maintainer practice',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose between one team owning each area, anyone changing anything, and a middle model where owners review but do not gate — each trades speed against coherence.',
    useWhen: [
      'nobody feels responsible for this module and it has rotted',
      'every change needs approval from a team that is always busy',
      'two teams changed the same area in incompatible ways',
      'the owner left and nobody knows the code',
    ],
    prompt:
      'Recommend an ownership model for this codebase. Compare strong ownership, collective ownership and the review-but-not-gate middle on the outcomes that matter: how quickly a change outside your area can ship, how consistent the design stays, how knowledge spreads, and what happens when an owner is unavailable. Recommend one, likely differing by area — a shared platform library warrants stricter ownership than a feature module. Then specify the mechanics: how ownership is recorded, the response time owners commit to, the path when an owner is unresponsive, and how ownership is transferred rather than lapsing silently when someone leaves.',
    why:
      'The unresponsive-owner escape path and explicit transfer are what keep ownership from becoming a bottleneck or an orphan, and both are missing from most ownership files.',
    watchOut:
      'Strong ownership with no bus factor plan is a single point of failure in people form. Pair it with deliberate knowledge sharing.',
    related: ['bus-factor', 'code-review-checklist', 'package-by-feature', 'documentation-freshness'],
    tags: ['code review', 'ownership', 'team', 'process'],
  },

  {
    id: 'linting-and-formatting',
    name: 'Linting and Formatting',
    aka: ['automated style', 'formatter as arbiter', 'lint rule selection'],
    origin: 'Tooling practice; gofmt and Prettier established the auto-format norm',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Delegate every mechanical style question to a tool so that human review never spends attention on it, and choose lint rules by the defects they prevent.',
    useWhen: [
      'reviews are full of arguments about formatting',
      'the diff is unreadable because someone reformatted the file',
      'we have three hundred lint warnings and ignore all of them',
      'style discussions consume more time than design discussions',
    ],
    prompt:
      'Set up automated style enforcement for this codebase. Choose a formatter with minimal configuration and apply it to everything in one commit, recorded so it can be excluded from blame — that single step ends the formatting debate permanently. Then select lint rules by evidence: enable those catching classes of defect we have actually experienced, and disable stylistic rules that produce noise without preventing bugs, since a warning list nobody reads is worse than none. Set the enforcement point so violations cannot be merged, and provide the automatic fix locally so it costs nothing. Finish with the process for changing a rule, including who decides.',
    why:
      'Selecting rules by defects actually experienced is what keeps the warning list at zero and therefore meaningful, and the blame-excluded formatting commit removes the main objection to adopting a formatter.',
    watchOut:
      'Applying a formatter across a codebase invalidates open branches and obscures history. Do it once, at a quiet moment, and communicate it.',
    related: ['static-analysis-adoption', 'code-review-checklist', 'broken-windows', 'ci-signal-hygiene'],
    tags: ['code quality', 'tooling', 'automation', 'style'],
  },

  {
    id: 'static-analysis-adoption',
    name: 'Static Analysis Adoption',
    aka: ['introducing a linter to legacy code', 'baseline suppression', 'zero-warning policy'],
    origin: 'Static analysis tooling practice',
    domains: ['engineering', 'security'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Turning a serious analyser on an existing codebase produces thousands of findings — the adoption strategy matters more than the tool choice.',
    useWhen: [
      'we enabled the analyser and got four thousand warnings',
      'the security scanner output is ignored by everyone',
      'we cannot fix everything and cannot decide what to fix',
      'the tool has a high false positive rate and people stopped looking',
    ],
    prompt:
      'Plan the adoption of this analyser. Take a baseline of existing findings and suppress it explicitly, then enforce zero new findings from the moment of adoption — that ratchet is what makes adoption possible without a cleanup project. Then prioritise the baseline by rule severity and by whether the code is actively changed, and burn it down gradually. Address false positives directly: measure the rate per rule, disable rules whose noise exceeds their value, and define how an individual finding is suppressed with a required justification. Finish with the ownership question — who triages findings, and how a security finding is routed differently from a style one.',
    why:
      'Baseline-and-ratchet is what makes adoption feasible on a large codebase, and per-rule false positive measurement is what prevents the tool being ignored within a month.',
    watchOut:
      'A suppression with no justification is indistinguishable from a missed bug. Require a reason in the annotation or the suppressions become permanent.',
    related: ['coverage-ratchet', 'linting-and-formatting', 'vulnerability-triage', 'type-system-leverage'],
    tags: ['code quality', 'static analysis', 'security', 'adoption'],
  },

  {
    id: 'type-system-leverage',
    name: 'Type System Leverage',
    aka: ['gradual typing adoption', 'types as documentation', 'strictness settings'],
    origin: 'Practice around TypeScript, mypy, Sorbet and similar gradual type systems',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Types prevent whole categories of defect and document intent, but only where they are precise — a codebase full of permissive escape hatches gets neither benefit.',
    useWhen: [
      'we added types and still get the same runtime errors',
      'half the codebase is typed as any and nobody notices',
      'the type checker passes and the field is undefined at runtime',
      'we want stricter settings and cannot turn them on without breaking everything',
    ],
    prompt:
      'Plan strengthening the types in this codebase. Measure the current state first — how much of the code is genuinely typed versus escaping through permissive types, and where those escapes cluster — because the escapes concentrate at boundaries and that is exactly where errors enter. Prioritise typing the boundaries: external inputs, database results and third-party responses, since types asserted rather than validated at those points are a lie the checker cannot detect. Then sequence the strictness settings from lowest to highest cost, with an estimate for each. Finish with the enforcement that prevents new escapes appearing.',
    why:
      'Types asserted at an unvalidated boundary give false confidence, so directing effort at boundaries first is what converts type coverage into actual defect reduction.',
    watchOut:
      'A type checker only constrains what it can see. Data crossing a serialisation boundary needs runtime validation regardless of how it is declared.',
    related: ['parse-dont-validate', 'illegal-states-unrepresentable', 'static-analysis-adoption', 'input-validation-boundary'],
    tags: ['code quality', 'types', 'adoption', 'correctness'],
  },

  {
    id: 'architecture-decision-records',
    name: 'Architecture Decision Records',
    aka: ['ADR', 'decision log', 'lightweight design documents'],
    origin: 'Michael Nygard, 2011',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Record each significant decision with its context, the options considered and the consequences accepted, so future readers know why rather than guessing.',
    useWhen: [
      'nobody remembers why we chose this database',
      'we keep revisiting a decision that was settled two years ago',
      'a new joiner asks why and the answer is historical and lost',
      'someone wants to change something without knowing what it was solving',
    ],
    prompt:
      'Write a decision record for this choice. Keep it to the structure that makes these sustainable: the context and forces at play, the decision, the options considered with why each was rejected, and the consequences accepted including the negative ones — that last part is what makes the record honest and useful when someone later hits the downside. Write it in the present tense as of the decision, and mark it immutable: a later change supersedes it with a new record rather than editing the old one, so the history of reasoning survives. Then say what qualifies as significant enough to record, since recording everything means nobody reads any of them.',
    why:
      'Immutability plus recorded negative consequences is what distinguishes these from design documents that get edited into uselessness, and the significance threshold keeps the set readable.',
    watchOut:
      'Records nobody reads are wasted effort. Link them from the code and the readme where the decision manifests, or they will not be found when needed.',
    related: ['chestertons-fence', 'documentation-freshness', 'pull-request-description', 'type-1-type-2-decisions'],
    tags: ['documentation', 'architecture', 'decisions', 'writing'],
  },

  {
    id: 'todo-hygiene',
    name: 'TODO Hygiene',
    aka: ['comment markers', 'FIXME rot', 'deferred work in code'],
    origin: 'Code maintenance practice',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'A marker with no owner, no date and no ticket is a note to nobody — either the work matters and belongs in the backlog, or it does not and the note should go.',
    useWhen: [
      'there are four hundred markers in the codebase and none have been actioned',
      'this note says fix before launch and we launched three years ago',
      'nobody knows whether these remaining notes still apply',
      'a marker described a known bug nobody had recorded anywhere',
    ],
    prompt:
      'Audit the deferred-work markers in this codebase. Categorise each: notes describing a real defect or risk, which should become tracked issues; notes describing an intended improvement, which should either be recorded or deleted; and notes that are actually explanations, which should be rewritten as ordinary comments. Report any marker describing a security or correctness problem separately and first, since those are undocumented known defects. Then set the convention going forward — a marker must carry an owner and an issue reference — and the automated check that enforces it. Finish by deleting everything that no longer applies, which will be most of them.',
    why:
      'Markers describing known security or correctness defects that exist nowhere in the tracker are the finding that justifies the audit, and requiring an issue reference prevents recurrence.',
    watchOut:
      'Deleting a marker without understanding it can remove the only record of a real problem. Read each before removing.',
    related: ['technical-debt-register', 'comment-why-not-what', 'dead-code-removal', 'broken-windows'],
    tags: ['code quality', 'maintenance', 'comments', 'tracking'],
  },

  {
    id: 'inline-vs-extract',
    name: 'Inline versus Extract',
    aka: ['abstraction altitude', 'too many tiny functions', 'right-sizing units'],
    origin: 'Refactoring practice; John Ousterhout\'s argument for deeper modules',
    domains: ['engineering'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Both a thousand-line function and fifty three-line functions are hard to read — judge by whether each unit hides meaningful complexity behind a simple interface.',
    useWhen: [
      'following this logic means jumping through nine files',
      'every function is three lines and I still cannot see what happens',
      'we extracted everything and it got harder to understand',
      'the helper is called once and its name explains less than its body',
    ],
    prompt:
      'Assess the decomposition here using interface simplicity against hidden complexity. A unit earns its existence when its interface is much simpler than its implementation; one whose name and signature are as complex as its body is pure indirection and should be inlined. Apply that test to each extracted function and report both directions — things to extract and things to inline — since the second direction is almost never considered. Then check the sequence a reader must follow to understand one behaviour, and count the jumps; a high count with shallow units is the specific problem. Recommend the target shape and the ordering rule for related units.',
    why:
      'Explicitly looking for things to inline is the missing half of decomposition review, and the interface-versus-implementation depth test gives an objective criterion for both directions.',
    watchOut:
      'Extraction driven by a line-count rule produces shallow units with awkward names. The measure is complexity hidden, not lines moved.',
    related: ['cyclomatic-complexity', 'naming-as-design', 'code-smells-catalog', 'readability-over-cleverness'],
    tags: ['code quality', 'abstraction', 'refactoring', 'readability'],
  },

  {
    id: 'synthetic-test-data',
    name: 'Synthetic Test Data',
    aka: ['generated fixtures', 'production-shaped data', 'data generation for testing'],
    origin: 'Testing and privacy engineering practice',
    domains: ['engineering', 'data'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Generate data that matches production in shape, scale and awkwardness without containing anyone\'s real information.',
    useWhen: [
      'our test data is ten tidy rows and production is millions of messy ones',
      'we copy production data into development and that is a privacy problem',
      'performance testing uses uniform data and production is skewed',
      'the bug involved a name with an apostrophe and we never test those',
    ],
    prompt:
      'Design synthetic data generation for this system. Characterise production first along the dimensions that affect behaviour: volume, distribution and skew, cardinality of key fields, null and missing rates, and the awkward values that occur in reality — unusual scripts, very long strings, emoji, historic records with retired formats, and the single enormous account. Then specify generation that reproduces those characteristics without copying real records, plus referential integrity across related tables so the data is usable. Finish with how the generator stays current as the schema evolves and how a specific production-shaped scenario can be reproduced deterministically from a seed.',
    why:
      'Reproducing skew and the awkward-value tail is what makes synthetic data catch real defects, and deterministic seeding is what makes a failure reproducible.',
    watchOut:
      'Generated data that is too uniform makes performance results optimistic and hides the hot-key problems that dominate production.',
    related: ['anonymization-techniques', 'test-data-builder', 'environment-parity', 'load-testing-strategy'],
    tags: ['testing', 'data', 'privacy', 'fixtures'],
  },

  {
    id: 'documentation-freshness',
    name: 'Documentation Freshness',
    aka: ['docs rot', 'documentation ownership', 'executable documentation'],
    origin: 'Technical writing and developer experience practice',
    domains: ['engineering', 'writing'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Documentation decays silently, and the only reliable defences are keeping it close to the code, making it executable, or deleting what nobody maintains.',
    useWhen: [
      'the setup instructions have not worked for a year',
      'the architecture diagram shows services we removed',
      'new joiners follow the guide and get stuck at step three',
      'we have a wiki full of pages nobody trusts',
    ],
    prompt:
      'Assess our documentation for decay and propose a maintenance model. Classify each document by how it can be kept true: generated from the source, executable and therefore verified by the pipeline such as a setup script or a runnable tutorial, or manually maintained and therefore requiring an owner and a review trigger. Convert what can be converted, since executable documentation cannot silently rot. Then apply the deletion test: for each manually maintained document, if nobody will own it, delete it, because wrong documentation costs more than none. Finish with the review triggers tied to code changes rather than to a calendar, since calendar reviews get skipped.',
    why:
      'Sorting documents by how they can be kept true, and deleting the unownable ones, is what stops a documentation set from becoming uniformly untrusted.',
    watchOut:
      'Deleting documentation removes knowledge that may exist nowhere else. Check whether it is wrong or merely unloved before removing it.',
    related: ['architecture-decision-records', 'api-documentation-quality', 'runbook-writing', 'code-ownership'],
    tags: ['documentation', 'maintenance', 'writing', 'process'],
  },

  {
    id: 'floating-point-money',
    name: 'Money and Floating Point',
    aka: ['decimal arithmetic', 'minor units', 'rounding rules'],
    origin: 'Numerical computing practice; IEEE 754 behaviour',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Binary floating point cannot represent most decimal fractions exactly, so monetary arithmetic needs integers of the smallest unit or a decimal type, plus explicit rounding.',
    useWhen: [
      'the invoice total is off by a penny and nobody can explain it',
      'the sum of the lines does not equal the total we display',
      'a comparison between two amounts that should be equal returns false',
      'the tax calculation rounds differently in two places',
    ],
    prompt:
      'Audit monetary handling in this code. Identify every amount stored or computed as a binary floating point value and show the representation error concretely for one of our real values, since that is what makes the argument land. Then specify the replacement: integer minor units or a decimal type, with the currency travelling alongside the amount so the two cannot be separated. Then handle the part that causes disputes rather than crashes — rounding: state where it happens, which rule applies, and how remainders are distributed when splitting an amount, because inconsistent rounding is what makes the lines fail to sum to the total. Finish with the comparison and serialisation rules.',
    why:
      'Rounding policy and remainder distribution cause the reconciliation disputes, and they remain wrong even after the storage type is fixed unless they are specified explicitly.',
    watchOut:
      'Currencies differ in their smallest unit, and some have none. A hardcoded two-decimal assumption breaks the moment you trade in another currency.',
    related: ['value-object', 'assertions-and-invariants', 'reconciliation-jobs', 'boundary-value-analysis'],
    tags: ['correctness', 'money', 'numerics', 'data'],
  },

  {
    id: 'character-encoding-issues',
    name: 'Character Encoding and Unicode',
    aka: ['mojibake', 'normalisation forms', 'string length is not character count'],
    origin: 'Unicode standard; Joel Spolsky\'s minimum every developer must know, 2003',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Text is bytes plus an encoding, and a string\'s length, comparison and truncation all behave differently from what English-only intuition expects.',
    useWhen: [
      'names with accents display as garbled symbols',
      'the emoji broke our database column',
      'two strings that look identical do not compare as equal',
      'truncating a field cut a character in half',
    ],
    prompt:
      'Audit text handling along this data path. Identify the encoding at every boundary — database column and connection, file reads and writes, HTTP headers and bodies, terminal output — and find where a conversion happens implicitly using a platform default, since that is where the corruption enters. Then address the semantics: comparing strings that are visually identical but differently composed requires normalisation before comparison or storage, case folding is locale-dependent, and truncating by bytes or by code units can split a character or a grapheme cluster. Specify the normalisation form we use and where it is applied. Finish with the validation rules for identifiers where lookalike characters matter.',
    why:
      'Normalisation before comparison and storage is the fix for the equal-looking-but-unequal problem, and identifying the implicit default-encoding conversions is what stops corruption at the source.',
    watchOut:
      'A column declared with an encoding that does not cover the full range will silently truncate or reject characters users legitimately have in their names.',
    related: ['input-validation-boundary', 'internationalization', 'boundary-value-analysis', 'data-quality-checks'],
    tags: ['correctness', 'text', 'unicode', 'internationalisation'],
  },
]
