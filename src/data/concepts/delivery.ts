import type { Concept } from '../types'

export const delivery: Concept[] = [
  {
    id: 'trunk-based-development',
    name: 'Trunk-Based Development',
    aka: ['mainline development', 'short-lived branches'],
    origin: 'Continuous delivery practice; Paul Hammant and the DORA research',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Everyone integrates to one mainline at least daily behind flags, so merge conflicts stay small and the branch never diverges far enough to be scary.',
    useWhen: [
      'the feature branch has been open for six weeks and merging terrifies everyone',
      'we spend days resolving conflicts at the end of every project',
      'two people refactored the same area and neither knew',
      'the release branch and main have diverged and nobody can reconcile them',
    ],
    prompt:
      'Assess moving this team to daily integration. The blocker is always the same, so address it directly: how does unfinished work reach the mainline safely? Give the specific techniques — feature flags for user-visible behaviour, branch by abstraction for structural change, and keeping the new code path unreachable until complete — and map each of our current long branches to one. Then state the prerequisites honestly: a fast reliable pipeline, a review process that turns around in hours not days, and the discipline that mainline is always releasable. Say which prerequisite we lack, because adopting this without it makes things worse.',
    why:
      'Teams fail at this because they remove long branches without adding the mechanisms for hiding incomplete work. Mapping each existing branch to a technique makes the transition concrete.',
    watchOut:
      'Frequent integration into a mainline with a slow or flaky pipeline blocks everyone at once. Fix the pipeline first.',
    related: ['branching-strategy', 'feature-flag-hygiene', 'branch-by-abstraction', 'small-batch-releases'],
    tags: ['delivery', 'version control', 'integration', 'workflow'],
  },

  {
    id: 'branching-strategy',
    name: 'Branching Strategy',
    aka: ['git flow versus trunk', 'release branches', 'merge policy'],
    origin: 'Version control practice; Vincent Driessen\'s git-flow, 2010, and the reaction to it',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose a branching model from how you release and how many versions you must support, not from what is fashionable — the two constraints differ enormously by product.',
    useWhen: [
      'our branching model has five branch types and nobody follows it',
      'we support three released versions and need to patch all of them',
      'hotfixes have to be applied to four branches by hand',
      'we copied a diagram from a blog post and it does not fit us',
    ],
    prompt:
      'Recommend a branching model for our situation. Derive it from three facts: how often we release, whether customers run versions we must patch, and whether releases require a formal approval gate. A continuously deployed web service and shipped on-premises software with three supported versions need genuinely different answers, so state ours. Then specify the mechanics that cause pain — how a fix reaches every branch that needs it and how we verify it did, since forgotten backports are the recurring failure — plus the merge policy, the protection rules, and the naming conventions. Keep the number of long-lived branches to the minimum the release model requires.',
    why:
      'Anchoring the choice to release cadence and supported versions is what makes it defensible, and backport tracking is the operational detail every model handles badly by default.',
    watchOut:
      'A complex model adopted for a simple release process becomes ceremony everyone routes around, which is worse than a simple model imperfectly applied.',
    related: ['trunk-based-development', 'release-train-vs-continuous', 'semantic-versioning', 'promotion-pipeline'],
    tags: ['delivery', 'version control', 'process', 'releases'],
  },

  {
    id: 'continuous-integration-discipline',
    name: 'Continuous Integration Discipline',
    aka: ['keep the build green', 'stop the line', 'integration hygiene'],
    origin: 'Extreme Programming; Martin Fowler\'s continuous integration article',
    domains: ['engineering'],
    intents: ['plan', 'steer'],
    oneLiner:
      'The practice is not the tool: it is that everyone integrates frequently, the build is verified automatically, and a broken build is fixed before anything else.',
    useWhen: [
      'the build has been red for two days and people keep pushing',
      'we have a CI server but the discipline is missing',
      'people build up work locally for days before pushing',
      'nobody feels responsible for a failure they did not cause',
    ],
    prompt:
      'Assess our integration practice against the behaviours rather than the tooling. Check each: does everyone push to the shared mainline at least daily, does every push trigger a build that would catch a real defect, is a red build fixed within minutes, and is fixing it prioritised over new work. Measure the current state — average time to green after a break, and frequency of pushes per person — rather than asking people. Then propose the smallest set of changes that would move the weakest measure, and define the social rule explicitly, including what happens when someone leaves for the day with the build broken.',
    why:
      'Measuring time-to-green and push frequency turns a cultural conversation into two numbers, and the leaving-with-a-red-build rule is the one that actually gets negotiated.',
    watchOut:
      'A pipeline slow enough that people batch their work destroys the practice regardless of policy. Speed is a prerequisite, not an optimisation.',
    related: ['ci-signal-hygiene', 'trunk-based-development', 'build-time-reduction', 'flaky-test-quarantine'],
    tags: ['delivery', 'ci', 'practice', 'culture'],
  },

  {
    id: 'small-batch-releases',
    name: 'Small Batch Releases',
    aka: ['reduce batch size', 'ship smaller', 'deploy frequency'],
    origin: 'Lean manufacturing; applied to software by the continuous delivery movement',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Smaller releases are safer per release and easier to diagnose, because the search space when something breaks is the size of the change.',
    useWhen: [
      'we release monthly and every release is an ordeal',
      'when something breaks we cannot tell which of eighty changes caused it',
      'the rollback reverts fifty unrelated features',
      'testing a release takes longer than building the features in it',
    ],
    prompt:
      'Analyse our release batch size and its consequences. Quantify the current batch — number of changes, number of contributors, and elapsed time since the earliest change — then connect it to the observable costs: diagnosis time when a release fails, rollback blast radius, and the coordination overhead before each release. Then find what forces batching, since that is what must change: manual verification steps, a scarce environment, an approval gate, or a dependency on another team\'s schedule. Address the top constraint specifically. Finish with the target cadence and the first step toward it that does not require solving everything.',
    why:
      'Batch size is a symptom, not a choice, so identifying the specific constraint that forces batching is what makes an improvement plan realistic.',
    watchOut:
      'Increasing frequency without reducing per-release overhead just multiplies the overhead. The manual steps have to go first.',
    related: ['trunk-based-development', 'dora-metrics', 'deployment-rollback-plan', 'lead-time-analysis'],
    tags: ['delivery', 'releases', 'risk', 'flow'],
  },

  {
    id: 'ci-signal-hygiene',
    name: 'CI Signal Hygiene',
    aka: ['trustworthy pipeline', 'red build discipline', 'required checks'],
    origin: 'Continuous integration practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'A pipeline is only useful if a failure means something — flaky, slow or advisory checks train everyone to ignore red, and then real failures pass through.',
    useWhen: [
      'people merge with failing checks because they are always failing',
      'half our checks are advisory and nobody looks at them',
      'the pipeline takes fifty minutes and blocks everything',
      'a genuine failure was ignored because it looked like the usual noise',
    ],
    prompt:
      'Audit our pipeline for signal quality. For each check, pull the last month of results and compute the failure rate and the proportion of failures that were genuine defects rather than flakes or infrastructure problems — that ratio determines whether the check is trusted. Then classify each as blocking, informational or delete, and be strict: an informational check nobody acts on is noise with a maintenance cost. Order the blocking checks so the fastest and most likely to fail run first, giving a fail-fast signal. Finish with the policy for overriding a blocked merge, who may do it, and what gets recorded.',
    why:
      'The genuine-defect ratio per check is the number that justifies keeping or deleting it, and it converts a debate about trust into evidence.',
    watchOut:
      'Deleting a noisy check removes the noise and the coverage. Confirm what it was protecting before removing rather than fixing it.',
    related: ['flaky-test-quarantine', 'continuous-integration-discipline', 'build-time-reduction', 'coverage-ratchet'],
    tags: ['delivery', 'ci', 'quality gates', 'trust'],
  },

  {
    id: 'ci-parallelization',
    name: 'Pipeline Parallelisation',
    aka: ['test sharding', 'fan-out CI', 'parallel jobs'],
    origin: 'Continuous integration scaling practice',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Split the pipeline across machines by measured duration rather than by file count, and shape the graph so independent work starts immediately.',
    useWhen: [
      'our test suite takes forty minutes on one machine',
      'we split the tests evenly and one shard still takes twice as long',
      'the pipeline is sequential even though the stages are independent',
      'we pay for a big machine that is idle most of the run',
    ],
    prompt:
      'Parallelise this pipeline. Balance shards using recorded per-test durations rather than counts, since a naive split leaves one shard dominating, and specify how those timings are collected and kept current. Then restructure the stage graph so anything independent runs concurrently rather than in a fixed sequence, and identify the true critical path — the longest chain of genuinely dependent stages — because that is the floor no amount of parallelism goes below. Finally account for the costs: per-job startup and checkout overhead, which can dominate at high shard counts, and shared resources like a test database that serialise the shards anyway.',
    why:
      'Duration-balanced sharding and the critical path calculation are what turn parallelisation from guesswork into a predictable target, and per-job overhead is what limits how far it pays.',
    watchOut:
      'Beyond a point, adding shards costs more in setup than it saves in execution. Measure the total machine time as well as the wall clock.',
    related: ['build-time-reduction', 'test-impact-analysis', 'build-cache-strategy', 'test-isolation'],
    tags: ['delivery', 'ci', 'performance', 'testing'],
  },

  {
    id: 'build-time-reduction',
    name: 'Build Time Reduction',
    aka: ['fast feedback loop', 'pipeline latency', 'developer wait time'],
    origin: 'Continuous delivery practice; DORA research on lead time',
    domains: ['engineering'],
    intents: ['prioritize', 'diagnose'],
    oneLiner:
      'Every minute of pipeline time is multiplied by the number of runs per day, and past a threshold it changes behaviour: people batch work and stop running checks locally.',
    useWhen: [
      'the pipeline takes an hour and people context-switch away',
      'developers push and go do something else and come back tomorrow',
      'we have grown the suite steadily and nobody noticed the cost',
      'someone is asking whether faster builds are worth the investment',
    ],
    prompt:
      'Attack our pipeline duration systematically. Break the total into stages with wall-clock and queue time for each, including the time waiting for a runner, which is often the largest and least visible component. Then order the interventions by expected saving against effort: caching dependencies and build outputs, running only affected work, parallelising, removing redundant stages, and moving slow non-blocking checks off the critical path into an asynchronous run. Quantify the payoff in engineer-hours per week using our run frequency, since that is the number that justifies the work. Finish with a target and the monitoring that catches regression.',
    why:
      'Queue time is usually the hidden dominant cost, and expressing the payoff in engineer-hours per week is what gets this prioritised against feature work.',
    watchOut:
      'Moving checks off the critical path only helps if someone acts on the asynchronous results. Otherwise you have made the pipeline faster and weaker.',
    related: ['ci-parallelization', 'build-cache-strategy', 'test-impact-analysis', 'ci-signal-hygiene'],
    tags: ['delivery', 'ci', 'productivity', 'feedback'],
  },

  {
    id: 'build-cache-strategy',
    name: 'Build Caching',
    aka: ['incremental builds', 'remote cache', 'layer caching'],
    origin: 'Build system practice; Bazel and similar tools',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Reuse the output of work whose inputs have not changed — which requires knowing the inputs exactly, and that is where caching gets subtle.',
    useWhen: [
      'every build recompiles everything from scratch',
      'the cache is never hit and we do not know why',
      'a stale cache produced a broken artefact',
      'container image builds re-download dependencies every time',
    ],
    prompt:
      'Design caching for this build. The cache key must include every input that affects the output, so enumerate them: source files, dependency versions, toolchain and compiler version, build flags, environment variables and the operating system image. Then find the hidden inputs that break correctness or hit rate — timestamps, absolute paths, network fetches without pinned versions, and anything reading the current time — since each either poisons the cache or prevents a hit. Order container layers so rarely-changing dependencies come before frequently-changing source. Finish with the hit rate measurement and what a miss on an unchanged input would indicate.',
    why:
      'Cache correctness and hit rate are both determined by the completeness of the input set, and hidden inputs like timestamps are what quietly make caching useless or dangerous.',
    watchOut:
      'A cache that can produce a wrong artefact is worse than no cache, because the failure appears far from the build. Prefer under-caching to unsound keys.',
    related: ['reproducible-builds', 'build-time-reduction', 'ci-parallelization', 'dependency-pinning'],
    tags: ['delivery', 'build', 'caching', 'performance'],
  },

  {
    id: 'reproducible-builds',
    name: 'Reproducible Builds',
    aka: ['deterministic builds', 'bit-for-bit reproducibility', 'hermetic build'],
    origin: 'Debian Reproducible Builds project, 2013; supply chain security practice',
    domains: ['engineering', 'security'],
    intents: ['structure', 'critique'],
    oneLiner:
      'The same source should produce byte-identical output on any machine at any time, which makes builds verifiable and caching sound.',
    useWhen: [
      'the build works on my machine and fails in the pipeline',
      'we cannot verify that the deployed artefact came from this commit',
      'two builds of the same commit produced different binaries',
      'the build pulls whatever version is latest at the time it runs',
    ],
    prompt:
      'Audit this build for determinism. Enumerate the sources of variation: unpinned dependency versions, embedded timestamps and build identifiers, absolute paths, locale and timezone, filesystem ordering, parallel build nondeterminism, and network fetches. For each, give the remedy — full version pinning with a lockfile, fixed source date, path normalisation, sorted inputs, and a pinned toolchain image. Then state what reproducibility buys us specifically: sound caching, the ability to verify a deployed artefact matches its source, and a much smaller supply chain trust surface. Finish with how we verify it: build twice in different environments and compare.',
    why:
      'The build-twice-and-compare verification is what turns this from an aspiration into a checked property, and filesystem ordering is the variation source people never suspect.',
    watchOut:
      'Full bit-for-bit reproducibility can be expensive to reach in some ecosystems. Pinning inputs and fixing timestamps gets most of the benefit for a fraction of the effort.',
    related: ['build-cache-strategy', 'dependency-pinning', 'supply-chain-provenance', 'sbom-generation'],
    tags: ['delivery', 'build', 'security', 'determinism'],
  },

  {
    id: 'monorepo-vs-polyrepo',
    name: 'Monorepo versus Many Repos',
    aka: ['repository strategy', 'single repository', 'code organisation at scale'],
    origin: 'Practice at Google and Facebook versus the microservices repo-per-service norm',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'One repository makes cross-cutting change atomic and requires tooling investment; many repositories make each simple and make coordinated change hard.',
    useWhen: [
      'a change across four services needs four pull requests in a careful order',
      'our single repository takes ten minutes to clone and the pipeline runs everything',
      'shared library versions have drifted across twelve services',
      'we are splitting up and need to decide the repository layout',
    ],
    prompt:
      'Recommend a repository structure for us. Decide from the evidence in our commit history: how often changes span more than one component, and how much coordination each currently costs. Then price the tooling each option demands — a single repository needs affected-target detection, ownership rules and possibly sparse checkouts, while many repositories need dependency version management, cross-repository change tracking and release coordination — because both options have a tax and choosing is picking which tax. Finish with the hybrid, grouping tightly coupled components together while keeping genuinely independent ones separate, and where our boundary should fall.',
    why:
      'Measuring how many changes actually span components makes this decidable, and framing both options as taxes stops the discussion becoming ideological.',
    watchOut:
      'A single repository without affected-target detection means every change runs every test, which destroys pipeline time as the codebase grows.',
    related: ['test-impact-analysis', 'package-by-feature', 'dependency-pinning', 'build-cache-strategy'],
    tags: ['delivery', 'version control', 'scaling', 'tooling'],
  },

  {
    id: 'pipeline-as-code',
    name: 'Pipeline as Code',
    aka: ['declarative pipelines', 'versioned CI configuration'],
    origin: 'Continuous delivery practice; Jenkinsfile and successors',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Define the build and deploy process in version-controlled files alongside the code, so it is reviewable, reproducible and changes with the branch it belongs to.',
    useWhen: [
      'the deployment steps live in a web interface nobody can review',
      'somebody changed the pipeline and broke everything with no record',
      'the pipeline works on main and not on branches',
      'only one person knows how the deployment is actually configured',
    ],
    prompt:
      'Move this process into version-controlled definitions. Specify what is defined in code — stages, steps, triggers, environment configuration and required secrets by reference — and what necessarily remains outside, such as the secret values themselves and platform-level permissions, so the boundary is explicit. Then address the testability problem, since pipeline changes are usually only testable by running them: propose how a change is validated before it reaches the mainline, whether by branch execution, a linter, or extracting logic into scripts that can be tested locally. Finish with the shared-template question and how a common template is versioned so it does not break every project at once.',
    why:
      'Pipelines are the least tested code in most organisations, so making validation-before-merge an explicit requirement is the part that changes outcomes.',
    watchOut:
      'Complex logic inside pipeline configuration is untestable and hard to debug. Push anything non-trivial into scripts the pipeline invokes.',
    related: ['infrastructure-as-code', 'ci-signal-hygiene', 'secrets-in-ci', 'promotion-pipeline'],
    tags: ['delivery', 'ci', 'configuration', 'version control'],
  },

  {
    id: 'artifact-immutability',
    name: 'Build Once, Deploy Many',
    aka: ['immutable artefacts', 'promote the same binary', 'no rebuild per environment'],
    origin: 'Continuous Delivery, Humble and Farley, 2010',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Build the artefact once and promote that exact artefact through environments, so what you tested is what you release.',
    useWhen: [
      'we rebuild for each environment and staging passed but production failed',
      'the production build pulled a newer dependency than the tested one',
      'we cannot prove which commit is running in production',
      'the same version number refers to two different binaries',
    ],
    prompt:
      'Establish artefact promotion for this pipeline. Specify that one build produces an immutable artefact with a unique identifier tied to the commit, and that every environment deploys that same artefact — then find everything currently preventing it, which is usually environment-specific configuration compiled in at build time. For each, show how to externalise it into runtime configuration. Then specify the metadata the artefact carries: commit, build time, dependency versions and the pipeline run that produced it, so a running instance can report exactly what it is. Finish with the storage and retention policy so an old version can always be redeployed for rollback.',
    why:
      'Baked-in environment configuration is the specific thing that forces rebuilds, and externalising it is the concrete work that makes promotion possible.',
    watchOut:
      'Immutable artefacts are only meaningful if the configuration they run with is also versioned. Otherwise you have a reproducible binary in an irreproducible environment.',
    related: ['promotion-pipeline', 'configuration-management', 'reproducible-builds', 'deployment-rollback-plan'],
    tags: ['delivery', 'artefacts', 'deployment', 'reliability'],
  },

  {
    id: 'promotion-pipeline',
    name: 'Environment Promotion',
    aka: ['staged rollout through environments', 'promotion gates'],
    origin: 'Continuous delivery practice',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Each environment a build passes through should answer a different question, otherwise it is a delay that adds no information.',
    useWhen: [
      'we have four environments and nobody can say what each is for',
      'staging finds nothing that the pipeline did not already find',
      'the release sits in an environment for three days waiting for someone',
      'we skip environments when we are in a hurry, which is when it matters',
    ],
    prompt:
      'Define the promotion path for our releases. For each environment, state the specific question it answers that no earlier stage could — integration with real dependencies, performance under load, data migration against production-shaped volumes, or acceptance by a human — and the gate criteria to move on, automated where possible. Delete any environment that cannot justify itself, since an environment with no unique question is pure lead time. Then specify what promotion means mechanically: the same artefact with different configuration, who or what approves it, and how an emergency fix moves faster without skipping the checks that matter.',
    why:
      'Requiring a unique question per environment eliminates the stages that exist only by habit, which is usually where most of the lead time is.',
    watchOut:
      'An environment that differs materially from production produces false confidence in both directions. Know the differences and what they invalidate.',
    related: ['artifact-immutability', 'environment-parity', 'ephemeral-environments', 'small-batch-releases'],
    tags: ['delivery', 'environments', 'releases', 'process'],
  },

  {
    id: 'semantic-versioning',
    name: 'Semantic Versioning',
    aka: ['semver', 'major minor patch', 'version contracts'],
    origin: 'Tom Preston-Werner, 2011',
    domains: ['engineering'],
    intents: ['communicate', 'decide'],
    oneLiner:
      'Version numbers communicate compatibility — a major bump means consumers must do work, which makes what counts as breaking the crucial question.',
    useWhen: [
      'a patch release broke our build',
      'we bump the major version for every release and it means nothing',
      'nobody agrees whether this change is breaking',
      'consumers pin exact versions because they do not trust our numbering',
    ],
    prompt:
      'Define our versioning policy and what constitutes each kind of change. The hard part is the boundary of breaking, so write it explicitly for our library: changing a signature obviously counts, but so do tightening validation, changing observable timing or ordering, altering error types, changing default behaviour, and raising a minimum runtime version — while adding an optional parameter usually does not. Then say how we detect breaking changes rather than relying on judgement, whether by an API diff tool or contract tests. Finish with the deprecation path preceding a major change and the support commitment for the previous major version.',
    why:
      'Behavioural and error-type changes break consumers while looking non-breaking by signature, and writing the boundary down is what makes the numbers trustworthy.',
    watchOut:
      'Semantic versioning describes intent, not a guarantee. Consumers still need lockfiles because an unintentional break is indistinguishable from a patch.',
    related: ['api-versioning-strategy', 'dependency-pinning', 'deprecation-policy', 'release-notes-changelog'],
    tags: ['delivery', 'versioning', 'libraries', 'compatibility'],
  },

  {
    id: 'dependency-pinning',
    name: 'Dependency Pinning',
    aka: ['lockfiles', 'version ranges', 'transitive dependency control'],
    origin: 'Package management practice across ecosystems',
    domains: ['engineering', 'security'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Lock the exact versions of every direct and transitive dependency so builds are reproducible and an upstream release cannot change your software without a commit.',
    useWhen: [
      'the build broke and nothing in our code changed',
      'production has a different dependency version from our test run',
      'a transitive dependency updated itself and introduced a bug',
      'we cannot tell which versions are actually deployed',
    ],
    prompt:
      'Review our dependency management. Confirm that a lockfile exists, is committed, covers transitive dependencies, and is actually used by the pipeline rather than being regenerated — a build that resolves versions fresh has an unlocked dependency graph regardless of the file. Then address the trade-off: pinned versions are reproducible and go stale, so specify the update cadence and automation. Cover integrity verification so a published version cannot be swapped for different content, and the vendoring or mirroring question for critical dependencies given that public registries can remove packages. Finish with the policy for direct versus transitive version constraints.',
    why:
      'A lockfile the pipeline ignores is the common failure, and it makes reproducibility claims false while looking correct in the repository.',
    watchOut:
      'Pinning without an update process means running known-vulnerable versions indefinitely. Pinning and updating are two halves of one practice.',
    related: ['dependency-update-automation', 'reproducible-builds', 'supply-chain-provenance', 'sbom-generation'],
    tags: ['delivery', 'dependencies', 'security', 'reproducibility'],
  },

  {
    id: 'dependency-update-automation',
    name: 'Dependency Update Automation',
    aka: ['automated upgrade pull requests', 'staying current', 'update fatigue'],
    origin: 'Practice around tools such as Dependabot and Renovate',
    domains: ['engineering', 'security'],
    intents: ['plan', 'prioritize'],
    oneLiner:
      'Small frequent upgrades are far cheaper than a big-bang catch-up years later, but only if the flow of update pull requests is filtered and grouped so people act on it.',
    useWhen: [
      'we are four major versions behind on everything',
      'we get thirty update pull requests a week and merge none',
      'a security advisory means upgrading through six breaking versions',
      'nobody has time to review dependency bumps',
    ],
    prompt:
      'Design an update policy that people will actually follow. Differentiate by risk and effort: security patches and patch-level updates should merge automatically when the pipeline is green, minor updates should be grouped into a periodic batch, and major updates should become deliberate scheduled work with an owner. Specify the grouping and cadence so the notification volume is manageable, since volume is what kills these programmes. Then state the prerequisite plainly — automatic merging requires a test suite you trust to catch a regression — and if we do not have that, say what must be true first. Finish with the metric: the age distribution of our dependencies.',
    why:
      'Tying automatic merging to trust in the suite is the honest prerequisite, and grouping by risk class is what keeps the pull request volume from being ignored.',
    watchOut:
      'Automatically merging updates you do not test is how a compromised or broken package reaches production unnoticed. The suite is the whole control.',
    related: ['dependency-pinning', 'supply-chain-provenance', 'ci-signal-hygiene', 'technical-debt-register'],
    tags: ['delivery', 'dependencies', 'maintenance', 'security'],
  },

  {
    id: 'sbom-generation',
    name: 'Software Bill of Materials',
    aka: ['SBOM', 'dependency inventory', 'component transparency'],
    origin: 'Supply chain security practice; formats such as SPDX and CycloneDX',
    domains: ['security', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'A machine-readable inventory of every component in a build, so that when a vulnerability is announced you can answer within minutes whether you are affected.',
    useWhen: [
      'a major vulnerability was announced and it took us days to check',
      'we do not know what is inside our container images',
      'a customer is asking for a list of components and licences',
      'we cannot tell which deployed versions contain the affected library',
    ],
    prompt:
      'Set up component inventory for our artefacts. Specify what is captured — direct and transitive dependencies with versions and hashes, and components inside the base image, which is the part most inventories miss — plus when it is generated, which must be at build time from the actual artefact rather than reconstructed from manifests. Then design for the question it exists to answer: given a vulnerable component and version range, which of our deployed artefacts contain it and where are they running. That requires linking inventory to deployment records, so specify that link. Finish with storage, retention and who may query it.',
    why:
      'An inventory not linked to what is currently deployed cannot answer the only question that matters during an advisory, and base image contents are the usual blind spot.',
    watchOut:
      'Generating inventories nobody queries is compliance theatre. Rehearse the lookup against a real recent advisory to check it works.',
    related: ['supply-chain-provenance', 'dependency-pinning', 'reproducible-builds', 'vulnerability-triage'],
    tags: ['security', 'supply chain', 'dependencies', 'compliance'],
  },

  {
    id: 'secrets-in-ci',
    name: 'Secrets in Pipelines',
    aka: ['build credentials', 'pipeline secret handling', 'OIDC federation'],
    origin: 'DevOps security practice',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Pipelines hold credentials to everything they deploy to, which makes them a high-value target and their secret handling a first-order security control.',
    useWhen: [
      'our deploy credentials are long-lived and stored in the CI settings',
      'a secret was printed in a build log',
      'a pull request from a fork could access our secrets',
      'we do not know which pipelines can deploy to production',
    ],
    prompt:
      'Audit secret handling in our pipelines. Prefer short-lived federated credentials over stored long-lived ones and state whether our platform supports that, since eliminating standing secrets is worth more than protecting them better. Then check the specific exposures: secrets available to builds triggered from forks or untrusted branches, secrets visible to arbitrary build scripts including those of dependencies, values reaching logs or error output, and secrets that persist in caches or artefacts. For each, give the control. Finish with scoping — a pipeline should hold only the credentials for its own targets — and the rotation procedure with a defined frequency.',
    why:
      'Fork-triggered builds and dependency-executed scripts are the two paths by which pipeline secrets actually leak, and both are invisible in a review of the configuration alone.',
    watchOut:
      'Any code the pipeline runs, including a build script from a dependency, can read the environment. Scoping matters more than masking.',
    related: ['secrets-management', 'supply-chain-provenance', 'pipeline-as-code', 'deployment-permissions'],
    tags: ['security', 'ci', 'credentials', 'supply chain'],
  },

  {
    id: 'infrastructure-as-code',
    name: 'Infrastructure as Code',
    aka: ['declarative infrastructure', 'Terraform practice', 'drift detection'],
    origin: 'DevOps practice; Kief Morris\'s book and the configuration management lineage',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Define infrastructure in version-controlled declarations applied by automation, so environments are reviewable, reproducible and recoverable.',
    useWhen: [
      'someone changed a setting in the console and nobody knows what or when',
      'we cannot rebuild this environment if we lose it',
      'the environments have drifted apart in ways nobody can enumerate',
      'infrastructure changes have no review and no history',
    ],
    prompt:
      'Plan the move to declared infrastructure. Start with state and drift, since those determine whether this works: where the state is stored, how it is locked against concurrent applies, and how manual changes are detected and reconciled rather than silently overwritten. Then define the change workflow — plan output reviewed before apply, and who may apply to production. Address the parts that are genuinely awkward: resources that cannot be recreated without data loss, secrets that must not be in the declaration, and the blast radius of a single apply. Finish with the adoption order, importing existing resources gradually rather than recreating them.',
    why:
      'State management and drift reconciliation are what make this practice safe or dangerous, and the not-recreatable resources are where a careless apply destroys production data.',
    watchOut:
      'A declaration that has diverged from reality will do something unexpected on the next apply. Continuous drift detection is not optional at scale.',
    related: ['configuration-management', 'environment-parity', 'pipeline-as-code', 'ephemeral-environments'],
    tags: ['delivery', 'infrastructure', 'automation', 'operations'],
  },

  {
    id: 'configuration-management',
    name: 'Configuration Management',
    aka: ['config versus code', 'environment variables', 'dynamic configuration'],
    origin: 'Twelve-factor app methodology and operational practice',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Separate what varies by environment from the code, and decide deliberately which settings may change at runtime versus requiring a deployment.',
    useWhen: [
      'a config change took down production and there was no review',
      'we have settings in four places and cannot tell which wins',
      'changing a timeout requires a full release',
      'nobody knows what this environment variable does or who set it',
    ],
    prompt:
      'Design the configuration model for this service. Classify every setting into three groups with different handling: build-time constants that belong in code, deploy-time environment settings that are versioned alongside the deployment, and runtime-adjustable values that can change without a release. Be strict about the third group, since anything changeable at runtime is effectively a production change with no pipeline — so specify its review, audit and rollback. Then define precedence between sources unambiguously, validation of configuration at startup so a bad value fails fast rather than at first use, and how a setting is discovered and documented.',
    why:
      'Runtime-adjustable configuration is production change management with no controls, and treating it as a deployment mechanism rather than a settings file is what prevents the outage.',
    watchOut:
      'Validating configuration lazily means an error surfaces on the first request that uses it, often hours after the deploy that caused it.',
    related: ['feature-flag-hygiene', 'artifact-immutability', 'twelve-factor-app', 'infrastructure-as-code'],
    tags: ['delivery', 'configuration', 'deployment', 'operations'],
  },

  {
    id: 'environment-parity',
    name: 'Environment Parity',
    aka: ['dev-prod parity', 'it works on my machine', 'environment drift'],
    origin: 'Twelve-factor app methodology',
    domains: ['engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'The more your test environments differ from production, the less their results mean — and the differences are usually undocumented.',
    useWhen: [
      'it passed in staging and failed in production',
      'staging runs a different database version and nobody noticed',
      'production data volumes are a thousand times larger than our test data',
      'the bug only appears with real traffic patterns',
    ],
    prompt:
      'Produce a difference inventory between our environments and production. Cover the dimensions that actually cause divergent behaviour: runtime and dependency versions, data volume and distribution, concurrency and traffic shape, network topology and latency, resource limits, configuration and feature flag state, and which external dependencies are real versus stubbed. For each difference, state what class of defect it could hide. Then rank by risk and recommend which to close given cost — some, like production data volume, are better addressed with representative synthetic data than with a copy. Finish with the differences we accept and how we compensate, usually by shifting that verification into production with controls.',
    why:
      'Naming what each specific difference could hide converts an unbounded parity goal into a ranked list, and it justifies deliberately accepting some gaps.',
    watchOut:
      'Copying production data into lower environments creates a serious privacy exposure. Parity of shape and volume matters more than parity of content.',
    related: ['ephemeral-environments', 'testing-in-production', 'promotion-pipeline', 'anonymization-techniques'],
    tags: ['delivery', 'environments', 'testing', 'risk'],
  },

  {
    id: 'ephemeral-environments',
    name: 'Ephemeral Environments',
    aka: ['preview environments', 'per-pull-request environments', 'on-demand stacks'],
    origin: 'Cloud-native delivery practice',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Create a full environment per change on demand and destroy it afterwards, removing the queue for a shared environment and the drift that comes with long-lived ones.',
    useWhen: [
      'everyone is queuing to use the one staging environment',
      'someone left broken code in staging and blocked the team',
      'reviewers cannot try the change without checking it out',
      'our shared environments have drifted and nobody rebuilds them',
    ],
    prompt:
      'Design on-demand environments for this system. The hard parts are data and dependencies, so lead with them: how each environment gets a usable data set — seeded, sampled, anonymised or synthetic — and how it handles dependencies that cannot be duplicated per environment, such as third-party services with limited sandbox accounts. Then specify creation time, since anything over a few minutes means people stop using them, plus the automatic destruction policy and cost controls. Finish with the honest scope: what these can verify and what still requires a shared environment with production-like scale.',
    why:
      'Test data provisioning and unduplicatable third-party dependencies are what make or break this, and both are usually discovered after the infrastructure is built.',
    watchOut:
      'Environments that are not destroyed automatically become a large cost line and a set of forgotten, unpatched deployments.',
    related: ['environment-parity', 'infrastructure-as-code', 'hermetic-tests', 'cloud-cost-attribution'],
    tags: ['delivery', 'environments', 'testing', 'automation'],
  },

  {
    id: 'zero-downtime-deployment',
    name: 'Zero-Downtime Deployment',
    aka: ['rolling deploy', 'no maintenance window', 'in-place upgrade'],
    origin: 'Continuous delivery and orchestration practice',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Replacing running instances without dropping requests requires readiness signalling, connection draining, and old and new versions coexisting correctly.',
    useWhen: [
      'we see errors during every deployment',
      'deploying requires a maintenance window customers hate',
      'the new version cannot run alongside the old one',
      'requests fail for thirty seconds after each rollout',
    ],
    prompt:
      'Design deployment without user-visible errors for this service. The requirement that drives everything is version coexistence, so start there: during a rolling update both versions serve traffic simultaneously, which means the database schema, the cache format, the message formats and any shared state must be compatible in both directions. Audit our change for that. Then specify the mechanics: readiness gating so an instance takes traffic only when warm, connection draining with the correct wait for load balancer propagation, surge and unavailable settings, and the pace of the rollout. Finish with what makes a change genuinely require downtime and how we would recognise one in advance.',
    why:
      'Version coexistence is the constraint that decides whether a change can roll out safely at all, and it is a property of the change rather than of the deployment mechanism.',
    watchOut:
      'A rollout that is faster than the health checks can detect failure will replace every instance with a broken version before anything notices.',
    related: ['graceful-shutdown', 'health-check-design', 'expand-and-contract-migration', 'canary-release'],
    tags: ['delivery', 'deployment', 'availability', 'rollout'],
  },

  {
    id: 'blue-green-deployment',
    name: 'Blue-Green Deployment',
    aka: ['red-black deployment', 'environment swap', 'instant cutover'],
    origin: 'Continuous Delivery, Humble and Farley; earlier operational practice',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Run a complete second environment with the new version, verify it, then switch traffic across — giving an instant cutover and an instant rollback.',
    useWhen: [
      'we need the ability to revert a release in seconds',
      'a rolling deploy leaves us in a mixed state we cannot reason about',
      'we want to verify the new version fully before any user reaches it',
      'rollback currently means a full redeploy that takes twenty minutes',
    ],
    prompt:
      'Assess a full environment swap for this service. The rollback promise is what justifies the cost, so test whether it survives our reality: shared state that both environments use, chiefly the database, means the schema must work for both versions and any write made by the new version must remain valid after reverting — state whether that holds for this change. Then cover the switch mechanism and its propagation delay, in-flight requests and sessions at cutover, warm-up of the idle environment before it takes traffic, and the cost of running double capacity. Finish with how long the old environment is retained and what would make us abandon the rollback option.',
    why:
      'Shared data is what breaks the instant-rollback promise, and asking whether new-version writes survive a revert is the check that determines if this is real.',
    watchOut:
      'Rollback is only instant if the data written since the switch is compatible. Otherwise you are reverting code and keeping incompatible data.',
    related: ['canary-release', 'deployment-rollback-plan', 'expand-and-contract-migration', 'zero-downtime-deployment'],
    tags: ['delivery', 'deployment', 'rollback', 'releases'],
  },

  {
    id: 'canary-release',
    name: 'Canary Release',
    aka: ['gradual rollout', 'percentage rollout', 'automated canary analysis'],
    origin: 'Continuous delivery practice; automated analysis pioneered at Netflix',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Expose the new version to a small slice of traffic, compare its behaviour against the old, and continue or abort based on evidence rather than hope.',
    useWhen: [
      'a bad release reached every customer before we noticed',
      'we deploy to everyone at once and find out from support',
      'we roll out gradually but nobody watches the metrics',
      'the problem only appeared with real production traffic',
    ],
    prompt:
      'Design a gradual rollout for this change. The comparison is the whole mechanism, so specify it properly: which metrics are compared between the new and the existing version, over what duration, and with what threshold for a statistically meaningful difference at our traffic volume — a one percent canary on a low-traffic endpoint may never gather enough data to conclude anything, and that is worth knowing before relying on it. Then define the traffic slice and whether it is sticky per user, the progression steps with a bake time at each, and the automatic abort criteria. Finish with the failure classes this cannot catch, such as slow leaks and effects that only appear at full load.',
    why:
      'The statistical power question determines whether canary analysis can conclude anything at all, and it is routinely assumed rather than calculated.',
    watchOut:
      'A canary that receives unrepresentative traffic, such as only one region or only healthy sessions, will pass while the change is broken for others.',
    related: ['blue-green-deployment', 'ring-deployment', 'deploy-verification', 'feature-flag-hygiene'],
    tags: ['delivery', 'deployment', 'rollout', 'risk'],
  },

  {
    id: 'ring-deployment',
    name: 'Ring Deployment',
    aka: ['deployment rings', 'staged audience rollout', 'dogfooding rings'],
    origin: 'Microsoft engineering practice; common in shipped-software release management',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Roll out through successive audience rings — internal, early adopters, general — so each ring provides a longer soak with more diverse usage before the next.',
    useWhen: [
      'a percentage-based rollout does not match how our customers differ',
      'we want internal users to hit problems before customers do',
      'some enterprise customers require advance notice of changes',
      'issues only appear with certain customer configurations',
    ],
    prompt:
      'Define deployment rings for our product. Compose each ring by the diversity of usage it adds rather than by size alone, since a large homogeneous ring exercises less than a small varied one — state what each ring covers that the previous did not. Specify the soak time per ring and the criteria to advance, including the qualitative signal from internal users which is usually the point of the first ring. Then handle the operational reality: customers who must be in a late ring contractually, customers who want the earliest, and how a fix is expedited across rings during an incident without abandoning the structure.',
    why:
      'Composing rings for usage diversity rather than headcount is what makes early rings informative, and the expedited-fix path is what keeps the structure from being bypassed under pressure.',
    watchOut:
      'Long ring progressions mean several versions in the field at once, which multiplies the support and compatibility surface.',
    related: ['canary-release', 'feature-flag-hygiene', 'release-train-vs-continuous', 'deploy-verification'],
    tags: ['delivery', 'rollout', 'releases', 'risk'],
  },

  {
    id: 'shadow-traffic',
    name: 'Shadow Traffic',
    aka: ['traffic mirroring', 'dark traffic', 'dual running'],
    origin: 'Migration and performance validation practice',
    domains: ['engineering'],
    intents: ['plan', 'critique'],
    oneLiner:
      'Send a copy of real production requests to the new system without using its responses, so you can compare correctness and performance under genuine load.',
    useWhen: [
      'we are replacing a service and cannot risk switching blind',
      'synthetic load tests do not resemble real traffic',
      'we need to know the new implementation returns the same answers',
      'we want production-scale evidence before committing to a cutover',
    ],
    prompt:
      'Design shadow running for this migration. The safety constraint dominates, so lead with it: the shadow path must not produce side effects — no writes to shared systems, no emails, no third-party calls that cost money or change state — so enumerate every side effect in the request path and state how each is neutralised. Then design the comparison: which parts of the response are compared, how expected differences such as identifiers and timestamps are normalised, and how discrepancies are sampled and reported. Cover the load implication, since we are now doubling traffic to shared dependencies. Finish with the exit criteria that would justify cutting over.',
    why:
      'Unneutralised side effects in a shadow path cause real customer harm from a supposedly safe experiment, and the enumeration is the only reliable way to find them.',
    watchOut:
      'Mirrored traffic doubles load on anything both paths share, including databases and third parties. That is a capacity change, not a free observation.',
    related: ['testing-in-production', 'strangler-fig', 'canary-release', 'reconciliation-jobs'],
    tags: ['delivery', 'migration', 'validation', 'production'],
  },

  {
    id: 'feature-flag-hygiene',
    name: 'Feature Flag Hygiene',
    aka: ['toggle debt', 'flag lifecycle', 'kill switches'],
    origin: 'Continuous delivery practice; Pete Hodgson\'s feature toggle taxonomy',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Flags are how you separate deploy from release, and they become a combinatorial mess unless each has a type, an owner and a removal date from the moment it is created.',
    useWhen: [
      'we have two hundred flags and nobody knows which are still needed',
      'a stale flag turned a feature off for a customer for a year',
      'the code has so many conditionals nobody can follow the logic',
      'two flags interacted and produced a state we never tested',
    ],
    prompt:
      'Bring order to our flags. Classify each by type, because the types have completely different lifetimes: release toggles that must be removed within weeks, experiment toggles that end with the experiment, operational kill switches that live indefinitely, and permission toggles that are really product configuration. Then assign an owner and an expiry to every temporary flag, and propose the mechanism that enforces removal, such as a build failure past the expiry date. Address the testing problem: we cannot test every combination, so define which flag states are supported and tested, and how a flag defaults if the flag service is unreachable.',
    why:
      'Classifying by type gives each flag a correct lifetime, and defining the fallback when the flag service is unavailable prevents a flag system outage becoming a product outage.',
    watchOut:
      'Every flag doubles the number of code paths in principle. The combinations you never test are where the surprising bugs live.',
    related: ['trunk-based-development', 'canary-release', 'configuration-management', 'technical-debt-register'],
    tags: ['delivery', 'feature flags', 'release', 'maintenance'],
  },

  {
    id: 'migration-deploy-ordering',
    name: 'Migration and Deploy Ordering',
    aka: ['schema change sequencing', 'migrate before or after deploy'],
    origin: 'Continuous delivery practice for stateful applications',
    domains: ['engineering', 'data'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Code and schema change at different moments and both versions run during a rollout, so the ordering has to be chosen deliberately per change.',
    useWhen: [
      'the migration ran and the old instances started erroring',
      'we rolled back the code and the schema stayed changed',
      'deploying requires a precise manual sequence somebody has to remember',
      'a column was dropped while old instances were still selecting it',
    ],
    prompt:
      'Sequence this change safely. Determine whether the migration is additive and therefore safe before the code, or destructive and therefore only safe after every old instance is gone, and state the rule you applied. Then check the mixed-version window explicitly: during the rollout, old code runs against the new schema and possibly new code against the old schema — walk through both and confirm each works or say what breaks. Handle rollback: if we revert the code after migrating, does the old version still function. Finish with the migrations that must never run automatically as part of a deploy, such as anything long-running or locking, and how those are executed instead.',
    why:
      'Walking both mixed-version directions is the check that catches the failure, and separating long-running migrations from the deploy is what prevents a deploy hanging on a table lock.',
    watchOut:
      'Automatic migrations on startup mean several instances may run them simultaneously. Without locking, that is a race with unpredictable results.',
    related: ['expand-and-contract-migration', 'zero-downtime-deployment', 'backfill-strategy', 'deployment-rollback-plan'],
    tags: ['delivery', 'database', 'deployment', 'migration'],
  },

  {
    id: 'deployment-rollback-plan',
    name: 'Rollback Plan',
    aka: ['revert strategy', 'roll forward versus back', 'undo a release'],
    origin: 'Release engineering practice',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Decide before deploying how this change is undone, how long that takes, and at what point it stops being possible.',
    useWhen: [
      'something broke and we spent an hour deciding whether to revert',
      'the rollback failed because the database had already changed',
      'we always roll forward because rolling back has never worked',
      'nobody knows how long a revert would take',
    ],
    prompt:
      'Write the rollback plan for this release. State the mechanism and its measured duration, then identify the point of no return — the first irreversible action, usually a destructive migration, a message published to consumers, or a third-party call — since after that the honest plan is fixing forward. Then define the decision criteria in advance: the specific signals that trigger a revert, who may make the call without convening a meeting, and the time limit on investigating before reverting anyway. Finish by verifying the plan is real: when did we last successfully revert, and what would we do about data written by the new version.',
    why:
      'Pre-deciding the revert criteria and authority is what prevents the hour of debate during an incident, and naming the point of no return sets expectations honestly.',
    watchOut:
      'A rollback path never exercised will not work when needed. Practise reverting a harmless change so the mechanism is known to function.',
    related: ['blue-green-deployment', 'migration-deploy-ordering', 'incident-command', 'mttr-decomposition'],
    tags: ['delivery', 'rollback', 'incident response', 'risk'],
  },

  {
    id: 'deploy-verification',
    name: 'Deploy Verification',
    aka: ['post-deploy checks', 'deployment markers', 'release validation'],
    origin: 'Continuous delivery and observability practice',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'A deployment is not finished when the rollout completes; it is finished when evidence shows the new version is behaving, and that evidence should be automatic.',
    useWhen: [
      'we deploy and hope, then find out from customers',
      'the rollout succeeded and the application was broken',
      'when something breaks we cannot tell whether a deploy caused it',
      'nobody watches anything after pressing deploy',
    ],
    prompt:
      'Define what proves this deployment succeeded. Specify the checks in order of speed: the process is running and healthy, a smoke test of the critical paths passes, and then the comparison signals over a bake period — error rate, latency percentiles, and the key business metric compared against the previous version and against the same time yesterday. Set the abort criteria and whether the abort is automatic. Then make deploys visible in observability by emitting a deployment marker with version and commit onto the dashboards, since correlating a metric change with a release is the most common diagnostic question and is trivial to enable.',
    why:
      'Deployment markers on dashboards make the did-a-deploy-cause-this question answerable in seconds, and a bake period with defined abort criteria is what turns deployment into a verified step.',
    watchOut:
      'Verifying only technical signals misses changes that work perfectly and harm the business metric. Include at least one outcome measure.',
    related: ['smoke-test-suite', 'canary-release', 'deployment-rollback-plan', 'observability-instrumentation'],
    tags: ['delivery', 'deployment', 'monitoring', 'verification'],
  },

  {
    id: 'deployment-permissions',
    name: 'Deployment Permissions',
    aka: ['who can deploy', 'production access control', 'break-glass deploys'],
    origin: 'Operational governance practice',
    domains: ['engineering', 'security'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Decide who may deploy what, where, and under which conditions — with the goal of enabling safe frequent deployment rather than restricting it.',
    useWhen: [
      'only two people can deploy and both are on holiday',
      'anyone can push to production with no record',
      'an emergency fix was blocked by an approval nobody could give at 2am',
      'the auditor asked who deployed this and we could not say',
    ],
    prompt:
      'Design deployment access for our team. Start from the two goals in tension — anyone on the team should be able to ship safely, and every production change should be attributable and reviewable — and note that automation satisfies both better than gatekeeping does, since a pipeline that enforces checks makes broad access safe. Specify what the pipeline enforces, what a human approves and why that approval adds information, and the emergency path with its own controls: who may use it, what it skips, what is logged, and the mandatory review afterwards. Finish with the audit record: what is captured for each deployment.',
    why:
      'Framing approval as needing to add information kills the rubber-stamp gates, and designing the emergency path deliberately stops it becoming an undocumented back door.',
    watchOut:
      'Restricting deployment to a few people creates a bottleneck and reduces safety, because those people deploy changes they did not write and cannot verify.',
    related: ['separation-of-duties', 'break-glass-access', 'change-management-lightweight', 'audit-logging'],
    tags: ['delivery', 'access control', 'governance', 'security'],
  },

  {
    id: 'change-freeze-policy',
    name: 'Change Freeze Policy',
    aka: ['code freeze', 'deployment blackout', 'peak period lockdown'],
    origin: 'Release management practice, particularly in retail and finance',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Halting changes during a critical period reduces the rate of new problems and increases the size and risk of the release that follows it.',
    useWhen: [
      'we freeze every December and January is chaos',
      'the freeze means a month of accumulated changes ship at once',
      'urgent fixes during the freeze go through an unclear exception process',
      'someone is proposing a freeze and I want to argue it properly',
    ],
    prompt:
      'Evaluate a freeze for this period. State the risk it addresses and the risk it creates, quantifying the second: how many changes will accumulate, how much larger the post-freeze release will be, and what that does to diagnosis when something breaks. Then propose the alternative that usually serves the same goal better — allowing small, well-tested, individually reversible changes while blocking large or risky ones — with the criteria that distinguish them. If a freeze is genuinely warranted, define its scope precisely by system rather than blanket, the exception process with a named approver, and the plan for the resumption, which is the actually dangerous moment.',
    why:
      'Quantifying the accumulated batch shows the freeze moves risk rather than removing it, and the resumption is where the incidents actually happen.',
    watchOut:
      'Freezes stop routine deployment and not the things that break systems: traffic spikes, expiring certificates and third-party changes carry on regardless.',
    related: ['small-batch-releases', 'change-management-lightweight', 'deployment-rollback-plan', 'dora-metrics'],
    tags: ['delivery', 'risk', 'policy', 'releases'],
  },

  {
    id: 'change-management-lightweight',
    name: 'Lightweight Change Management',
    aka: ['change advisory board alternatives', 'peer review as approval'],
    origin: 'DORA research showing external approval correlates poorly with stability',
    domains: ['engineering'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Approval by people distant from the change slows delivery without improving stability; peer review and automated verification do better on both.',
    useWhen: [
      'every change waits a week for a board that always approves it',
      'our process is heavy and our failure rate is still high',
      'the approver cannot possibly evaluate what they are approving',
      'we need an auditable process and want it not to be theatre',
    ],
    prompt:
      'Redesign our change approval so it improves outcomes rather than only creating records. Classify changes by risk with objective criteria, and route standard low-risk changes to a pre-authorised path where peer review and the pipeline are the control. For the genuinely high-risk minority, define what the reviewer must actually verify — a rollback plan, a blast radius assessment, a communication plan — so approval is substantive. Then satisfy the audit requirement from artefacts that already exist: the review record, pipeline results, deployment log and verification evidence. Finish with the measure that tells us whether the process is working, which is change failure rate rather than approval count.',
    why:
      'Deriving the audit trail from artefacts the delivery process already produces is what makes lightweight governance defensible to an auditor rather than merely faster.',
    watchOut:
      'Regulated environments may mandate specific approval structures. Work out what the regulation actually requires before assuming the heavy process is necessary.',
    related: ['deployment-permissions', 'dora-metrics', 'change-freeze-policy', 'separation-of-duties'],
    tags: ['delivery', 'governance', 'process', 'compliance'],
  },

  {
    id: 'dora-metrics',
    name: 'DORA Metrics',
    aka: ['four key metrics', 'deployment frequency and lead time', 'accelerate metrics'],
    origin: 'DevOps Research and Assessment; Forsgren, Humble and Kim, Accelerate, 2018',
    domains: ['engineering'],
    intents: ['estimate', 'diagnose'],
    oneLiner:
      'Deployment frequency, lead time for change, change failure rate and time to restore, measured together because any one alone is trivially gameable.',
    useWhen: [
      'we want to know whether our delivery is improving',
      'someone wants a productivity metric and I want a defensible one',
      'we deploy more often now and I cannot show it is better',
      'leadership is asking for engineering metrics',
    ],
    prompt:
      'Define these four measures for our context and how each is captured from existing systems rather than self-reported. Be precise about the boundaries: lead time from commit to running in production, not from ticket creation, and failure rate as deployments causing degraded service, with the definition of degraded stated. Then insist on reading them as a set, since throughput without stability is recklessness and stability without throughput is stagnation. Finish with the anti-patterns: using them to compare teams with different contexts, or setting them as targets, which converts them from a diagnostic into something people optimise directly.',
    why:
      'These are diagnostics, and the moment they become targets they are gamed by splitting deployments and redefining failures. Saying so explicitly is part of implementing them.',
    watchOut:
      'They measure delivery capability and say nothing about whether you are building the right thing. A team can excel on all four while shipping products nobody wants.',
    related: ['lead-time-analysis', 'small-batch-releases', 'mttr-decomposition', 'goodharts-law'],
    tags: ['delivery', 'metrics', 'measurement', 'improvement'],
  },

  {
    id: 'lead-time-analysis',
    name: 'Lead Time Analysis',
    aka: ['value stream mapping', 'cycle time breakdown', 'wait time versus work time'],
    origin: 'Lean value stream mapping applied to software delivery',
    domains: ['engineering'],
    intents: ['diagnose', 'prioritize'],
    oneLiner:
      'Break the journey from idea to production into stages and measure waiting separately from working — the waiting is usually most of it.',
    useWhen: [
      'everything takes weeks and nobody can say why',
      'we hired more engineers and delivery did not speed up',
      'the work takes two days and the change takes three weeks to ship',
      'we optimise coding speed and it changes nothing',
    ],
    prompt:
      'Map the flow of a change through our process with timestamps from our actual tools. For each stage, separate active work time from queue time — waiting for review, waiting for an environment, waiting for approval, waiting for a release window — and compute the ratio, because a process where most of the elapsed time is waiting will not improve by making people code faster. Identify the largest queue and what causes it: a scarce resource, a batching policy, or a handoff between teams. Then propose the intervention for that specific queue and estimate the effect on total lead time. Finish with what to measure to confirm the improvement.',
    why:
      'The work-to-wait ratio redirects improvement effort from productivity to flow, which is where the time actually goes, and it is measurable from existing tool timestamps.',
    watchOut:
      'Optimising a stage that is not the constraint changes nothing overall. Find the biggest queue before improving anything.',
    related: ['dora-metrics', 'theory-of-constraints', 'small-batch-releases', 'wip-limits'],
    tags: ['delivery', 'flow', 'metrics', 'process'],
  },

  {
    id: 'release-notes-changelog',
    name: 'Release Notes and Changelog',
    aka: ['keep a changelog', 'user-facing release communication'],
    origin: 'Software release practice; the Keep a Changelog convention',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Write for the person deciding whether to upgrade and what they must do — which is a different document from a list of commit messages.',
    useWhen: [
      'our release notes are auto-generated commit messages nobody reads',
      'customers upgraded and were surprised by a behaviour change',
      'nobody can tell from the notes whether they need to act',
      'the breaking change was mentioned in the middle of forty bullet points',
    ],
    prompt:
      'Write release notes for this version aimed at the upgrade decision. Lead with anything requiring action — breaking changes, required migrations, deprecations with their removal date — before the improvements, since burying a required action is the failure that costs people. Group by audience impact rather than by component, describe each change in terms of what it means for the reader rather than what was modified internally, and link to migration instructions for anything that needs them. Then propose how this is produced sustainably: what authors record at the time of the change so notes are not reconstructed from history at release time.',
    why:
      'Ordering by required action rather than chronology is what makes notes useful, and capturing the entry at change time is what stops them degrading into commit dumps.',
    watchOut:
      'Fully automated notes from commits describe implementation, not impact. They are a starting point for a human, not a substitute.',
    related: ['semantic-versioning', 'deprecation-policy', 'bluf', 'status-page-communication'],
    tags: ['delivery', 'communication', 'documentation', 'releases'],
  },

  {
    id: 'release-train-vs-continuous',
    name: 'Release Train versus Continuous',
    aka: ['scheduled releases', 'cadence versus flow', 'ship when ready'],
    origin: 'Release management practice; train model from large-scale product organisations',
    domains: ['engineering', 'product'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Either changes ship as they are ready, or they board a scheduled release — the trade is coordination cost against per-change latency.',
    useWhen: [
      'features wait weeks for the next release slot',
      'coordinating a release across five teams is chaos',
      'our mobile app has a store review cycle and the backend does not',
      'marketing needs to know when things ship and we cannot tell them',
    ],
    prompt:
      'Choose a release model for this product. Identify what genuinely forces batching — app store review, customer change windows, coordinated marketing, or hardware — versus what is habit, since only the former justifies a schedule. If a train is required, define the cadence, the cut-off, and the rule that a change missing the train waits for the next one rather than delaying it, because a train that waits stops being a train. Then decouple what can be decoupled: deploy continuously behind flags and release features on the schedule, which gives both. Finish with the exception path for urgent fixes and who authorises it.',
    why:
      'Separating deployment cadence from release cadence via flags dissolves most of this dilemma, and it is the option teams rarely consider when arguing about the schedule.',
    watchOut:
      'A train that departs late once will depart late always, because every team learns that pressure works. The cut-off has to be enforced from the start.',
    related: ['feature-flag-hygiene', 'small-batch-releases', 'branching-strategy', 'ring-deployment'],
    tags: ['delivery', 'releases', 'planning', 'coordination'],
  },
]
