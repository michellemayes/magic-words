import type { Concept } from '../types'

export const performance: Concept[] = [
  {
    id: 'profiling-before-optimizing',
    name: 'Measure Before Optimising',
    aka: ['profile first', 'premature optimisation', 'guess-free tuning'],
    origin: 'Donald Knuth, 1974; Rob Pike\'s rules of programming',
    domains: ['engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'Find where the time actually goes before changing anything, because intuition about bottlenecks is wrong far more often than it is right.',
    useWhen: [
      'the app is slow and I have a theory about why',
      'we rewrote the algorithm and it made no difference',
      'everyone has a different opinion about what is slow',
      'I optimised the function that looked worst and nothing changed',
    ],
    prompt:
      'Set up measurement before we change anything here. Define the workload to profile, and make it representative — production-shaped data volumes and distribution, warm caches or cold as appropriate, and concurrency, since a single-request profile of a system that queues tells you nothing. Then choose the tool by bottleneck class: a sampling CPU profiler, a wall-clock profiler for blocked time, allocation profiling, or query-level tracing, and say which we need given the symptom. Establish a baseline with variance across repeated runs, since without variance we cannot tell a real improvement from noise. Finally state the target and the point at which we stop.',
    why:
      'The unrepresentative workload and the missing variance baseline are why measured optimisations so often fail to show up in production. Both need fixing before any tuning.',
    watchOut:
      'CPU profilers show where time is spent running, not where it is spent waiting. If the system is I/O or lock bound, that profile will look flat and mislead you.',
    related: ['hot-path-identification', 'flame-graph-reading', 'benchmark-methodology', 'cpu-vs-io-bound'],
    tags: ['performance', 'profiling', 'measurement', 'optimisation'],
  },

  {
    id: 'hot-path-identification',
    name: 'Hot Path Identification',
    aka: ['critical path in code', 'the eighty twenty of latency'],
    origin: 'Performance engineering practice; Pareto analysis applied to code',
    domains: ['engineering'],
    intents: ['prioritize', 'diagnose'],
    oneLiner:
      'Find the small fraction of code that accounts for most of the time or cost, and confine optimisation effort — and complexity — to it.',
    useWhen: [
      'the whole codebase is slow and I do not know where to start',
      'we micro-optimised code that runs once a day',
      'I want to know which endpoint is worth the effort',
      'the profile is flat and nothing obviously dominates',
    ],
    prompt:
      'Rank this system by where time and cost actually accumulate, weighting each code path by its call frequency in production rather than by how slow a single call is — a five millisecond function called ten thousand times per request beats a two second function called hourly. Produce a ranked list with the share of total time each accounts for. Then, for the top few, state the theoretical best case if that path took zero time, so we know the ceiling on the improvement before investing. If the profile is genuinely flat, say so and recommend the architectural change instead, since flat profiles do not respond to local optimisation.',
    why:
      'Weighting by production frequency and computing the zero-time ceiling are what prevent effort going into work that cannot pay off, which flat-profile systems invite.',
    watchOut:
      'Hot paths shift when you fix one. Re-profile after each change instead of working through the original list.',
    related: ['profiling-before-optimizing', 'amdahls-law', 'flame-graph-reading', 'theory-of-constraints'],
    tags: ['performance', 'prioritisation', 'profiling', 'optimisation'],
  },

  {
    id: 'flame-graph-reading',
    name: 'Flame Graph Reading',
    aka: ['stack sampling visualisation', 'icicle graph', 'differential flame graph'],
    origin: 'Brendan Gregg, 2011',
    domains: ['engineering'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'Aggregate sampled stacks into a picture where width is time and depth is call nesting, so the expensive paths stand out without reading numbers.',
    useWhen: [
      'I have a profile and cannot interpret it',
      'the top functions are all framework internals and mean nothing to me',
      'I need to compare performance before and after a change',
      'the profiler output is thousands of lines of stacks',
    ],
    prompt:
      'Interpret this profile as a flame graph. Explain how to read it — width is total samples not call count, and depth is nesting rather than significance — and identify the widest frames that represent our own code rather than the runtime beneath it. Distinguish frames that are wide because they are slow themselves from frames that are wide because their children are, since that determines whether to optimise here or below. Then recommend the differential view against a baseline, which is what shows a regression clearly, and name the common misreadings: inlined frames that vanish, and time spent blocked which a CPU profile does not show at all.',
    why:
      'Self-time versus total-time and the invisibility of blocked time are the two misreadings that send people optimising the wrong frame, and both are invisible in the picture itself.',
    watchOut:
      'Sampling profilers miss short-lived spikes and can be biased by safepoint placement in managed runtimes. A flat graph is not proof that nothing is slow.',
    related: ['profiling-before-optimizing', 'continuous-profiling', 'cpu-vs-io-bound', 'hot-path-identification'],
    tags: ['performance', 'profiling', 'visualisation', 'diagnosis'],
  },

  {
    id: 'continuous-profiling',
    name: 'Continuous Profiling',
    aka: ['always-on profiling', 'production profiling', 'profile in situ'],
    origin: 'Google-Wide Profiling paper, 2010; commercial tools since',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Sample profiles continuously in production at low overhead, so you can answer why yesterday was slow instead of trying to reproduce it.',
    useWhen: [
      'the slowness only happens in production under real load',
      'by the time we attach a profiler the problem is gone',
      'we cannot reproduce the memory growth locally',
      'we want to know what changed between last week and this week',
    ],
    prompt:
      'Plan continuous profiling for this service. Specify the profile types worth collecting — CPU, allocation, and blocked or wall-clock time — and the sampling rate against measured overhead, since the overhead budget determines what is feasible. Then define the labels attached to each profile: version, region, instance, endpoint and tenant class, because the ability to compare profiles across those dimensions is where the value is. Show the two workflows this enables: differential comparison across deploys to catch regressions, and drilling into a specific slow period. Finish with the retention and cost, plus the privacy consideration of stack data.',
    why:
      'Labelled profiles that support differential comparison are what make this useful; unlabelled always-on profiling just adds cost. Naming the two workflows drives the label design.',
    watchOut:
      'Profiling overhead is not uniform — allocation profiling in particular can be expensive in allocation-heavy code. Measure it on your own workload before enabling fleet-wide.',
    related: ['flame-graph-reading', 'regression-benchmarking', 'observability-cost-control', 'profiling-before-optimizing'],
    tags: ['performance', 'profiling', 'production', 'observability'],
  },

  {
    id: 'benchmark-methodology',
    name: 'Benchmark Methodology',
    aka: ['microbenchmark pitfalls', 'fair measurement', 'benchmarking hygiene'],
    origin: 'Performance engineering practice; JMH documentation is a standard reference',
    domains: ['engineering', 'data'],
    intents: ['critique', 'estimate'],
    oneLiner:
      'A benchmark that ignores warm-up, dead code elimination, caching and variance produces confident numbers that mean nothing.',
    useWhen: [
      'our benchmark says this is a hundred times faster and I do not believe it',
      'two people measured the same thing and got different answers',
      'the improvement disappeared in production',
      'the numbers change every time I run it',
    ],
    prompt:
      'Review this benchmark for validity. Check the standard invalidators one by one: has the compiler or runtime eliminated the work because the result is unused, has the measurement included warm-up and compilation, does the input fit entirely in cache in a way production data would not, is there measurement overhead comparable to the thing measured, and is the system otherwise idle in a way it will not be in production. Then require statistics rather than a single number — repeated runs, a distribution, and a stated confidence that the difference is real. Finish with what this benchmark can and cannot support as a claim.',
    why:
      'Dead code elimination and cache-resident inputs are the two failures that produce the impossible speedups, and neither is visible in the result. Enumerating invalidators catches them.',
    watchOut:
      'Microbenchmarks measure a component in isolation and routinely disagree with end-to-end results. Confirm any decision at the system level before adopting it.',
    related: ['regression-benchmarking', 'profiling-before-optimizing', 'load-testing-strategy', 'sensitivity-analysis'],
    tags: ['performance', 'benchmarking', 'measurement', 'statistics'],
  },

  {
    id: 'regression-benchmarking',
    name: 'Performance Regression Testing',
    aka: ['perf CI', 'benchmark gating', 'continuous performance testing'],
    origin: 'Continuous integration practice extended to performance',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Run performance checks in the pipeline against a stable baseline so a regression is attributed to one change instead of discovered a quarter later.',
    useWhen: [
      'the system got slower over six months and nobody knows which change did it',
      'we only find performance problems after release',
      'our benchmark results are too noisy to gate on',
      'a dependency upgrade quietly doubled our latency',
    ],
    prompt:
      'Design performance regression detection for our pipeline. Noise is the whole problem, so start there: specify the isolation measures — dedicated hardware or pinned instances, repeated runs, comparing against a baseline run in the same session rather than a stored number — and give the detection rule as a statistical test with an acceptable false alarm rate rather than a fixed percentage threshold. Then decide the response: block the merge, or record and alert on a trend, since blocking on a noisy signal will be disabled within a month. Finish with which few benchmarks are worth gating on and what the rest are for.',
    why:
      'These systems are almost always abandoned because of false alarms. Making noise control and the statistical rule the centre of the design is what keeps them alive.',
    watchOut:
      'Gating on microbenchmarks encourages optimising the benchmark. Include at least one end-to-end scenario that matches how the system is really used.',
    related: ['benchmark-methodology', 'continuous-profiling', 'performance-budget', 'ci-signal-hygiene'],
    tags: ['performance', 'ci', 'regression', 'testing'],
  },

  {
    id: 'performance-budget',
    name: 'Performance Budget',
    aka: ['latency budget', 'page weight budget', 'speed target'],
    origin: 'Web performance practice; Tim Kadlec and Alex Russell popularised the term',
    domains: ['engineering', 'product'],
    intents: ['decide', 'prioritize'],
    oneLiner:
      'Agree a numeric ceiling on latency, size or resource use per feature, so performance is a constraint on new work rather than a cleanup project later.',
    useWhen: [
      'every feature adds a little and now the page takes eight seconds',
      'performance work only happens when someone complains',
      'we have no basis for saying no to another script tag',
      'the app got slower with every release and nobody noticed at the time',
    ],
    prompt:
      'Set performance budgets for this product. Derive the top-level number from user behaviour or business evidence rather than convention — the point where abandonment rises for our audience and device profile — then allocate it across the contributors: server time, network, payload, rendering, third-party scripts. Specify the enforcement point and the consequence when a change would exceed a budget, including who may approve an exception and what they must trade in return, since a budget with no trade is a wish. Finish with the measurement location, which must be the field rather than a developer machine.',
    why:
      'Budgets fail when there is no defined exception path, because the first legitimate overrun kills the whole scheme. Making the trade explicit is what keeps it enforceable.',
    watchOut:
      'A single global budget hides which team consumed it. Allocate per feature or per team, or the shared budget becomes a tragedy of the commons.',
    related: ['core-web-vitals', 'payload-size-reduction', 'regression-benchmarking', 'percentile-latency'],
    tags: ['performance', 'budgets', 'governance', 'frontend'],
  },

  {
    id: 'load-testing-strategy',
    name: 'Load Testing Strategy',
    aka: ['stress testing', 'soak testing', 'spike testing'],
    origin: 'Performance engineering practice',
    domains: ['engineering'],
    intents: ['plan', 'estimate'],
    oneLiner:
      'Distinguish the four questions — what capacity do we have, what breaks first, what happens under a spike, what degrades over hours — and design a different test for each.',
    useWhen: [
      'we ran a load test and it passed and we still fell over in production',
      'nobody knows how much traffic we can take',
      'the memory grew slowly over two days and then it crashed',
      'the sale traffic spike broke things the load test never showed',
    ],
    prompt:
      'Design load testing for this service, one test per question. For capacity, ramp until the latency objective is violated and report the throughput at that point rather than at failure. For stress, continue past it and report what breaks first and whether the system recovers when load is removed — recovery behaviour is the most valuable and least tested property. For spike, apply a step change with no ramp to test autoscaling and cold caches. For soak, run for hours to expose leaks and fragmentation. For each, specify the realistic workload mix, data volume, and think time, and name what a test on synthetic uniform traffic would fail to reveal.',
    why:
      'Most teams run one ramp test and call it load testing. Separating the four questions, especially recovery after overload, is what makes the results predictive.',
    watchOut:
      'Load generated from one machine against a warmed cache with identical requests tests almost nothing. Data diversity matters as much as request rate.',
    related: ['capacity-planning', 'saturation-monitoring', 'benchmark-methodology', 'load-shedding'],
    tags: ['performance', 'testing', 'capacity', 'reliability'],
  },

  {
    id: 'percentile-latency',
    name: 'Percentile Latency',
    aka: ['p99', 'why averages lie', 'latency distribution'],
    origin: 'Performance measurement practice; Gil Tene\'s coordinated omission work',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'Report latency as a distribution with high percentiles, because the mean describes an experience almost nobody has and hides the failures.',
    useWhen: [
      'the average response time is fine and users complain constantly',
      'someone asked for our p99 and I only have an average',
      'the graph is smooth and the complaints are not',
      'our numbers look better after we added a fast health check endpoint',
    ],
    prompt:
      'Fix how we measure and report latency here. Explain why the mean is misleading for a right-skewed distribution and what the high percentiles represent in terms of affected users per hour, given our request volume — that translation is what makes the number land. Then check for the two measurement errors that make percentiles optimistic: averaging percentiles across instances or time buckets, which is mathematically meaningless, and coordinated omission, where a load generator stops sending during a stall and never records the worst latencies. Finish with what to report: percentiles per endpoint, plus the maximum, plus the count of requests exceeding the objective.',
    why:
      'Averaged percentiles and coordinated omission both produce numbers that look rigorous and are wrong, and neither is widely known outside performance specialists.',
    watchOut:
      'A user session involves many requests, so per-request percentiles understate how many users hit at least one slow one. Session-level measurement is harsher and more honest.',
    related: ['tail-latency', 'real-user-monitoring', 'sli-selection', 'load-testing-strategy'],
    tags: ['performance', 'metrics', 'latency', 'statistics'],
  },

  {
    id: 'tail-latency',
    name: 'Tail Latency Amplification',
    aka: ['the tail at scale', 'p99 amplification', 'slow tail'],
    origin: 'Jeff Dean and Luiz Barroso, The Tail at Scale, 2013',
    domains: ['engineering'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'When a request depends on many services, the rare slow response becomes common — a one percent tail across a hundred calls means most requests hit one.',
    useWhen: [
      'each service is fast and the overall request is slow',
      'our page depends on many backends and is unpredictably slow',
      'the slow requests seem random with no pattern',
      'we improved the average everywhere and the worst case did not move',
    ],
    prompt:
      'Analyse tail amplification along this request path. Compute the probability that a request encounters at least one slow dependency given the fan-out and each dependency\'s tail, and show how quickly that grows with the number of calls. Then attack the causes of individual tails rather than only the symptom: garbage collection pauses, cold caches, queueing behind a large request, background maintenance tasks, contended locks, and noisy neighbours on shared hardware. For each, say how to detect it in our telemetry. Finish with the mitigations — hedged requests, reduced fan-out, and prioritising small requests ahead of large ones.',
    why:
      'The multiplication is counterintuitive and explains why per-service optimisation does not fix end-to-end tails. Listing detectable causes turns it into an investigation plan.',
    watchOut:
      'Mitigations like hedging hide the tail rather than remove it, and cost capacity. Find the cause first where you can.',
    related: ['hedged-requests', 'percentile-latency', 'fan-out-fan-in', 'garbage-collection-tuning'],
    tags: ['performance', 'latency', 'distributed systems', 'diagnosis'],
  },

  {
    id: 'throughput-vs-latency',
    name: 'Throughput versus Latency',
    aka: ['bandwidth versus response time', 'batching trade-off'],
    origin: 'Systems performance fundamentals',
    domains: ['engineering'],
    intents: ['decide', 'explain'],
    oneLiner:
      'Optimisations that raise total work per second — batching, queueing, buffering — usually raise individual response time, and the right answer depends on which the user feels.',
    useWhen: [
      'we batched the writes and now the UI feels laggy',
      'someone says the system is faster and someone else says slower',
      'we increased concurrency and throughput went up but users complained',
      'I do not know whether to optimise for requests per second or response time',
    ],
    prompt:
      'Clarify which measure matters for each workload in this system and show the trade explicitly. For each path, state whether a human is waiting, and therefore which quantity is the constraint. Then examine our current tuning — batch sizes, buffer sizes, worker counts, connection limits — and say which direction each currently favours and whether that matches the requirement. Show the specific arithmetic for one batching decision: how much throughput a larger batch buys and how much latency it adds at our arrival rate. Finish with the settings that should differ between interactive and background paths, since one setting for both is usually wrong.',
    why:
      'Systems are frequently tuned with one set of parameters for both interactive and batch work. Separating them by whether a human waits is the decision that resolves it.',
    watchOut:
      'Under load these stop being a trade-off and become the same thing: insufficient throughput causes queueing, which destroys latency. Below saturation they trade, above it they align.',
    related: ['queueing-theory-basics', 'batching-amortization', 'backpressure', 'percentile-latency'],
    tags: ['performance', 'trade-offs', 'throughput', 'latency'],
  },

  {
    id: 'queueing-theory-basics',
    name: 'Queueing Theory Basics',
    aka: ['Little\'s law', 'utilisation knee', 'M/M/1 intuition'],
    origin: 'Agner Erlang, 1909; John Little\'s law, 1961',
    domains: ['engineering', 'data'],
    intents: ['estimate', 'explain'],
    oneLiner:
      'Two results carry most of the practical value: items in system equals arrival rate times time in system, and waiting time explodes as utilisation approaches one.',
    useWhen: [
      'latency went up sharply with only a small traffic increase',
      'we want to know how many workers we need',
      'the queue depth is growing and I do not know what that implies',
      'someone wants to run the system at ninety percent utilisation',
    ],
    prompt:
      'Apply queueing relationships to this system. Use the concurrency relationship to derive the missing quantity from the two we can measure — arrival rate, concurrency in flight, and time in system — and show the arithmetic, including what it implies for pool and worker sizing. Then show how waiting time behaves as utilisation rises toward capacity, and identify the utilisation at which our latency objective breaks, which is the real operating limit. Finish with the assumptions being violated in our case — bursty arrivals, variable service times, priority effects — and say in which direction each makes the real behaviour worse than the model.',
    why:
      'The relationships are simple and rarely applied to actual numbers. Naming the violated assumptions keeps the estimate honest rather than falsely precise.',
    watchOut:
      'These models assume steady state. During a spike or a recovery, transient behaviour is far worse than the equilibrium calculation suggests.',
    related: ['saturation-monitoring', 'throughput-vs-latency', 'capacity-planning', 'backpressure'],
    tags: ['performance', 'queueing', 'estimation', 'capacity'],
  },

  {
    id: 'amdahls-law',
    name: 'Amdahl\'s Law',
    aka: ['speedup limit', 'serial fraction', 'parallelisation ceiling'],
    origin: 'Gene Amdahl, 1967',
    domains: ['engineering'],
    intents: ['estimate', 'decide'],
    oneLiner:
      'The maximum speedup from optimising or parallelising part of a system is capped by the part you did not touch — often far lower than intuition suggests.',
    useWhen: [
      'we doubled the workers and it got barely faster',
      'is it worth parallelising this or not',
      'we optimised the slow function and gained ten percent',
      'someone wants to add more machines to fix the response time',
    ],
    prompt:
      'Compute the achievable speedup here before we invest. Establish the fraction of total time spent in the part we would improve, and calculate the best case if that part became instantaneous — that ceiling usually settles the question. Then apply it to the parallelisation decision specifically: with our measured serial fraction, show the speedup at two, four, eight and sixteen times the workers, and where adding more stops mattering. Finally, identify what the serial fraction actually consists of in our code — startup, coordination, a lock, a shared counter, final aggregation — since shrinking that is the only way to raise the ceiling.',
    why:
      'Computing the ceiling first prevents whole projects that could not have succeeded, and decomposing the serial fraction points at the work that would actually help.',
    watchOut:
      'This assumes a fixed problem size. When the workload grows with resources, the scaling picture is more optimistic than this law suggests.',
    related: ['universal-scalability-law', 'hot-path-identification', 'theory-of-constraints', 'parallelism-vs-concurrency'],
    tags: ['performance', 'scaling', 'parallelism', 'estimation'],
  },

  {
    id: 'universal-scalability-law',
    name: 'Universal Scalability Law',
    aka: ['USL', 'coherency penalty', 'negative returns to scale'],
    origin: 'Neil Gunther, 1993',
    domains: ['engineering'],
    intents: ['estimate', 'diagnose'],
    oneLiner:
      'Adding capacity is limited not only by serialisation but by the cost of keeping components consistent, which eventually makes throughput fall as you add more.',
    useWhen: [
      'adding servers made the system slower rather than faster',
      'throughput peaked at eight nodes and then declined',
      'more database connections made everything worse',
      'we scaled out and the coordination overhead ate the gains',
    ],
    prompt:
      'Model the scaling behaviour of this system with both penalties: contention for shared resources and the crosstalk cost of keeping state coherent. Fit the shape to our measured throughput at several concurrency levels and identify the peak — the point beyond which more capacity reduces throughput — since operating past it is a common and expensive mistake. Then attribute the coherency cost to specific mechanisms in our system: cache invalidation between nodes, distributed locks, replication acknowledgements, session synchronisation, or a shared counter. Recommend the change that removes the largest term rather than adding more capacity.',
    why:
      'The retrograde region is real and surprises people who expect flat returns at worst. Attributing the coherency term to concrete mechanisms turns the model into an action.',
    watchOut:
      'Fitting the curve needs measurements across a real range of concurrency. Two data points will fit anything and predict nothing.',
    related: ['amdahls-law', 'queueing-theory-basics', 'capacity-planning', 'lock-contention'],
    tags: ['performance', 'scaling', 'concurrency', 'modelling'],
  },

  {
    id: 'latency-numbers',
    name: 'Latency Numbers Everyone Should Know',
    aka: ['orders of magnitude', 'back-of-envelope system estimates'],
    origin: 'Jeff Dean, Google; widely circulated table',
    domains: ['engineering'],
    intents: ['estimate', 'explain'],
    oneLiner:
      'Keep the rough costs in mind — cache reference, memory access, disk seek, network round trip, cross-continent hop — so design choices are sanity-checked before implementation.',
    useWhen: [
      'is this design even feasible at the latency we promised',
      'we did not realise that call crosses an ocean',
      'someone proposed reading a million rows per request',
      'I need to sanity check a design without building it',
    ],
    prompt:
      'Estimate the latency and cost of this design from first principles using order-of-magnitude figures. Walk the request path and attribute time to each class of operation: in-memory work, cache lookups, local disk, same-datacentre network calls, cross-region calls, and any serialisation of large payloads. Multiply by the number of each per request, including the ones hidden inside loops and ORM calls. Compare the resulting floor against our target and say whether the design can possibly meet it. Where it cannot, name which term dominates and what structural change — batching, caching, colocation, precomputation — would remove it.',
    why:
      'A floor computed before implementation kills infeasible designs cheaply, and the dominating-term analysis points directly at the structural fix rather than at micro-optimisation.',
    watchOut:
      'The published figures date quickly and vary by an order of magnitude between environments. Use them for ratios and feasibility, not for precise prediction.',
    related: ['fermi-estimation', 'queueing-theory-basics', 'n-plus-one-queries', 'cache-hierarchy-locality'],
    tags: ['performance', 'estimation', 'design', 'system design'],
  },

  {
    id: 'cpu-vs-io-bound',
    name: 'CPU-Bound versus I/O-Bound',
    aka: ['what is it waiting on', 'bottleneck classification'],
    origin: 'Systems performance fundamentals',
    domains: ['engineering'],
    intents: ['diagnose', 'reframe'],
    oneLiner:
      'Determine whether the work is limited by computation or by waiting, because the two respond to completely opposite remedies.',
    useWhen: [
      'we added more threads and nothing improved',
      'the CPU is idle and everything is slow',
      'we bought bigger machines and the throughput did not change',
      'I do not know whether to optimise the code or the queries',
    ],
    prompt:
      'Classify the bottleneck in this workload from evidence. Compare CPU time consumed against wall-clock time elapsed for a representative unit of work — a large gap means waiting, and the next question is waiting on what: disk, network, a lock, or a downstream service. Give the specific measurement for each of those. Then state the remedy class implied, noting that adding concurrency helps a waiting workload and mostly hurts a compute-bound one already using all cores. Finally check for the mixed case where different phases have different characters, since a single classification for a pipeline with both is what makes tuning ineffective.',
    why:
      'The CPU-time-versus-wall-time comparison is a decisive, easily obtained measurement that most people never make, and it immediately rules out half the possible remedies.',
    watchOut:
      'Managed runtimes attribute garbage collection time in confusing ways, and can look compute-bound when they are really allocation-bound. Check allocation rate too.',
    related: ['use-method', 'profiling-before-optimizing', 'async-io-model', 'allocation-reduction'],
    tags: ['performance', 'diagnosis', 'bottlenecks', 'concurrency'],
  },

  {
    id: 'data-structure-selection',
    name: 'Data Structure Selection',
    aka: ['choosing the right container', 'access pattern fit'],
    origin: 'Core computer science practice; Sedgewick and Knuth lineage',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose the container from the operation mix and the size, not from habit — the right structure often removes the performance problem entirely.',
    useWhen: [
      'we scan a list to find things and it is called constantly',
      'the code checks membership by looping over an array',
      'insertion in the middle is killing us',
      'this map lookup is in the hot path and I wonder if it can be faster',
    ],
    prompt:
      'Choose the right structure for this usage. Start from the operation mix with actual frequencies — lookups by key, iteration in order, membership tests, insertions, deletions, range queries — and the expected size, because at small sizes a linear scan over contiguous memory beats a hash table despite the complexity class. Give the shortlist with the cost of each operation and the memory overhead. Then include the factors that complexity notation hides: cache locality, allocation per element, pointer chasing, and resizing behaviour. Recommend one and state the size at which the answer would change.',
    why:
      'Asymptotic reasoning alone gives the wrong answer at small sizes and ignores locality, which frequently dominates. Requiring the crossover size makes the recommendation concrete.',
    watchOut:
      'Swapping a structure changes iteration order and equality semantics, which code elsewhere may silently depend on. Check for that before changing it.',
    related: ['big-o-vs-constants', 'cache-hierarchy-locality', 'allocation-reduction', 'hot-path-identification'],
    tags: ['performance', 'data structures', 'algorithms', 'design'],
  },

  {
    id: 'big-o-vs-constants',
    name: 'Complexity versus Constants',
    aka: ['asymptotic analysis limits', 'n is small'],
    origin: 'Algorithm analysis practice; the constant-factor critique is longstanding',
    domains: ['engineering'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Complexity class decides what happens as input grows; constants decide what happens at the size you actually have, and most systems live at small sizes.',
    useWhen: [
      'we replaced the loop with a clever algorithm and it got slower',
      'someone is objecting to a nested loop over ten items',
      'the theoretically better structure performs worse in practice',
      'the code is optimised for a scale we will never reach',
    ],
    prompt:
      'Analyse this code for both scaling and constants. State the complexity, then the realistic input size distribution from production data rather than from the worst case anyone can imagine. Compute where the crossover lies between the simple approach and the sophisticated one, and say which side of it we are on. Then account for the constants that the notation discards — allocation, indirection, branch prediction, cache misses — and whether they favour the simpler version at our size. Recommend accordingly, and state the input size at which we should revisit, so the decision has a documented expiry rather than being permanent.',
    why:
      'A documented revisit threshold is what makes choosing the simple option safe, and it is the piece that turns this from an argument into a decision.',
    watchOut:
      'Adversarial or accidental worst cases matter even when typical size is small. A quadratic path reachable by user-supplied input is a denial-of-service risk regardless of averages.',
    related: ['data-structure-selection', 'yagni', 'latency-numbers', 'cache-hierarchy-locality'],
    tags: ['performance', 'algorithms', 'complexity', 'trade-offs'],
  },

  {
    id: 'cache-hierarchy-locality',
    name: 'Cache Locality',
    aka: ['mechanical sympathy', 'data-oriented design', 'cache lines'],
    origin: 'Computer architecture fundamentals; Martin Thompson\'s mechanical sympathy writing',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Memory access cost depends overwhelmingly on whether the data is already in cache, so layout and traversal order often matter more than instruction count.',
    useWhen: [
      'the loop does very little work per item and is still slow',
      'iterating this structure is much slower than the same number of operations elsewhere',
      'we halved the instructions and gained nothing',
      'performance falls off a cliff when the data set gets slightly larger',
    ],
    prompt:
      'Analyse the memory access pattern in this hot loop. Identify whether we traverse contiguous memory or chase pointers, how many cache lines are touched per element, and how much of each fetched line we actually use — a structure where we read one field out of a large object wastes most of every line fetched. Then propose the layout change: grouping the fields actually used together, using arrays of values rather than arrays of references, and ordering traversal to match layout. Estimate the improvement from the reduction in lines touched, and say what readability or flexibility we give up, since this style has a real maintenance cost.',
    why:
      'Counting cache lines touched per element gives a concrete predicted improvement, which is what distinguishes this from vague advice about being cache-friendly.',
    watchOut:
      'These techniques trade clarity for speed and only pay in genuinely hot loops. Applied broadly they make a codebase harder to change for no measurable gain.',
    related: ['data-structure-selection', 'allocation-reduction', 'big-o-vs-constants', 'false-sharing'],
    tags: ['performance', 'memory', 'hardware', 'optimisation'],
  },

  {
    id: 'allocation-reduction',
    name: 'Allocation Reduction',
    aka: ['garbage reduction', 'object pooling', 'zero-allocation paths'],
    origin: 'Managed runtime performance practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'In a garbage-collected runtime, the cheapest object is the one never created — allocation rate drives collection frequency and therefore pause frequency.',
    useWhen: [
      'the service pauses regularly and the pauses correlate with load',
      'garbage collection is using a third of our CPU',
      'memory churn is enormous even though usage is stable',
      'latency spikes every few seconds with no external cause',
    ],
    prompt:
      'Profile allocation in this hot path and reduce it. Rank allocation sites by bytes and by object count, since many small short-lived objects and a few large ones cause different problems. Then apply the reductions in order of safety: avoiding boxing and unnecessary string building, reusing buffers with clear ownership, using value types or stack allocation where the language allows, and pooling only as a last resort. Be explicit about pooling\'s hazards — objects returned while still referenced, and pools that keep memory permanently high. Finish by predicting the change in collection frequency from the reduced allocation rate.',
    why:
      'Ordering the techniques by safety keeps people away from pooling, which is where correctness bugs come from, and connecting allocation rate to collection frequency makes the payoff predictable.',
    watchOut:
      'Modern collectors handle short-lived objects extremely cheaply. Reducing allocations that never survive a young collection may cost readability for no gain.',
    related: ['garbage-collection-tuning', 'cache-hierarchy-locality', 'memory-leak-diagnosis', 'profiling-before-optimizing'],
    tags: ['performance', 'memory', 'garbage collection', 'optimisation'],
  },

  {
    id: 'garbage-collection-tuning',
    name: 'Garbage Collection Tuning',
    aka: ['GC pauses', 'collector selection', 'heap sizing'],
    origin: 'Managed runtime operations practice; JVM and .NET tuning literature',
    domains: ['engineering'],
    intents: ['diagnose', 'decide'],
    oneLiner:
      'Choose the collector and heap settings from your latency and throughput requirements, then verify against pause distribution rather than average overhead.',
    useWhen: [
      'we get multi-second pauses at the worst possible moments',
      'the p99 latency spikes and the application code is idle',
      'someone increased the heap and the pauses got longer',
      'the service is fine for hours and then stalls',
    ],
    prompt:
      'Diagnose our collection behaviour before changing any flag. Establish from logs the frequency and duration distribution of pauses, the proportion of objects surviving young collection, and whether pauses correlate with allocation rate or with heap occupancy — those point at different fixes. Then choose settings by requirement: a low-pause collector trades throughput for predictability, a larger heap reduces frequency and can increase duration. Change one thing at a time and state the expected effect first. Also cover the non-flag fixes that usually matter more: reducing allocation, avoiding a large long-lived cache in the heap, and shrinking object lifetimes.',
    why:
      'Flag tuning without the survival-rate and correlation evidence is guesswork, and the real fix is usually application-level. Requiring a predicted effect per change keeps it disciplined.',
    watchOut:
      'Container memory limits interact badly with heap settings — the runtime may size itself from the host rather than the limit and get killed. Check that first.',
    related: ['allocation-reduction', 'memory-leak-diagnosis', 'tail-latency', 'container-resource-limits'],
    tags: ['performance', 'garbage collection', 'latency', 'tuning'],
  },

  {
    id: 'memory-leak-diagnosis',
    name: 'Memory Leak Diagnosis',
    aka: ['heap growth investigation', 'retention path analysis'],
    origin: 'Debugging practice; heap dump analysis tooling',
    domains: ['engineering'],
    intents: ['diagnose'],
    oneLiner:
      'Find what is still referencing objects that should be dead, by comparing heap snapshots over time and following the retention path back to a root.',
    useWhen: [
      'memory grows steadily until the process is killed',
      'we restart the service nightly to keep it healthy',
      'usage climbs after every deploy and never comes back down',
      'the leak only appears in production after several days',
    ],
    prompt:
      'Give me a procedure for this growth. Start by distinguishing a genuine leak from expected growth — caches without bounds, buffers sized to peak load, and fragmentation all look like leaks and are fixed differently. Then take snapshots at intervals under steady load, compare by object type and by retained size rather than shallow size, and follow the retention path from the largest growing set back to the root that holds it. Name the usual culprits to check against that path: unbounded caches, listeners never removed, thread-local storage on pooled threads, static collections, and closures capturing more than intended.',
    why:
      'Retained size and the retention path are the two things that identify the holder, and the leak-versus-unbounded-cache distinction changes the fix entirely.',
    watchOut:
      'Native memory used by libraries, buffers and thread stacks will not appear in a managed heap dump at all. If the heap looks stable and the process still grows, look outside it.',
    related: ['allocation-reduction', 'garbage-collection-tuning', 'observability-triage', 'container-resource-limits'],
    tags: ['performance', 'memory', 'debugging', 'diagnosis'],
  },

  {
    id: 'jit-warmup',
    name: 'Warm-Up Effects',
    aka: ['JIT compilation', 'cold start', 'first-request latency'],
    origin: 'Managed runtime and serverless performance practice',
    domains: ['engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'The first requests after a start are slow for reasons that vanish later — compilation, cold caches, lazy initialisation, empty connection pools — and they land on real users during every deploy.',
    useWhen: [
      'the first few requests after a deploy time out',
      'our benchmark is fast and production is slow for the first minute',
      'autoscaling adds an instance and users get errors',
      'the serverless function is fast when warm and terrible when cold',
    ],
    prompt:
      'Diagnose the warm-up profile of this service. Enumerate every cost paid only at the start: just-in-time compilation of hot methods, class or module loading, lazy singletons and configuration fetches, empty connection pools, cold local caches, and cold downstream caches. Measure how long each takes and when it is paid. Then choose the mitigations per cause — pre-warming with synthetic traffic before joining the load balancer, ahead-of-time compilation, eager initialisation at startup, and pool pre-filling — and specify how readiness is delayed until warm-up completes, so an instance never takes traffic it cannot serve.',
    why:
      'Tying warm-up to the readiness signal is the fix that stops the deploy-time error spike, and it is a different intervention from making startup faster.',
    watchOut:
      'Pre-warming with unrepresentative traffic compiles the wrong paths and fills caches with the wrong data. It needs to look like real usage.',
    related: ['graceful-shutdown', 'health-check-design', 'cold-start-optimization', 'zero-downtime-deployment'],
    tags: ['performance', 'startup', 'deployment', 'latency'],
  },

  {
    id: 'zero-copy-io',
    name: 'Zero-Copy I/O',
    aka: ['avoiding buffer copies', 'sendfile', 'memory-mapped transfer'],
    origin: 'Operating systems practice; sendfile and splice system calls',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Move data between file, socket and memory without copying it through user space repeatedly, which matters once payloads are large.',
    useWhen: [
      'serving large files saturates the CPU before the network',
      'we copy the same buffer four times on the way out',
      'proxying data uses far more CPU than it should',
      'throughput is limited by memory bandwidth rather than by the link',
    ],
    prompt:
      'Trace this data path and count the copies and the user-kernel transitions per byte served, from source to socket. For each copy, say whether it exists because we transform the data, because of an API boundary, or by accident — the accidental ones are the target. Then propose the reduction: platform transfer calls, memory mapping, buffer slicing rather than concatenation, and streaming instead of materialising the whole payload. Be explicit about what we give up, since zero-copy paths usually preclude transformation, compression or encryption in our process. Estimate the CPU saving per gigabyte served.',
    why:
      'Counting copies per byte turns a vague inefficiency into a number, and naming the transformation constraint prevents adopting a technique that our pipeline cannot actually use.',
    watchOut:
      'These paths are platform specific and interact badly with TLS termination in-process. If you must encrypt, most of the benefit disappears unless the network stack offloads it.',
    related: ['streaming-vs-buffering', 'payload-size-reduction', 'compression-tradeoffs', 'cpu-vs-io-bound'],
    tags: ['performance', 'io', 'networking', 'systems'],
  },

  {
    id: 'batching-amortization',
    name: 'Batching and Amortisation',
    aka: ['bulk operations', 'group commit', 'chunking'],
    origin: 'Systems performance practice; group commit from database engineering',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Spread a fixed per-operation cost across many items by grouping them, trading a bounded amount of latency for a large gain in throughput.',
    useWhen: [
      'we make one network call per item in a loop',
      'the database round trip dominates and the query itself is trivial',
      'writing one row at a time cannot keep up with the incoming rate',
      'we pay the same setup cost thousands of times per second',
    ],
    prompt:
      'Introduce batching on this path. Identify the fixed cost per operation and the variable cost per item, then derive the batch size where the fixed cost is adequately amortised without exceeding our latency budget — show that arithmetic rather than choosing a round number. Specify both triggers, size and time, since a size-only trigger stalls forever at low traffic. Then handle the consequences: partial failure within a batch and whether we retry the whole thing or isolate the failure, memory held by pending items, ordering, and what happens to buffered items on shutdown. Finish with the observability needed to tune it later.',
    why:
      'Partial batch failure and the shutdown case are where batching implementations lose data, and the dual trigger is what keeps latency bounded at low volume.',
    watchOut:
      'Batching couples the fate of unrelated items. One poison record can now fail hundreds of others unless the failure path isolates it.',
    related: ['n-plus-one-queries', 'throughput-vs-latency', 'graceful-shutdown', 'request-coalescing'],
    tags: ['performance', 'throughput', 'batching', 'io'],
  },

  {
    id: 'n-plus-one-queries',
    name: 'N+1 Query Problem',
    aka: ['select N plus 1', 'lazy loading in a loop', 'chatty data access'],
    origin: 'Object-relational mapping practice; named in the Hibernate community',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Fetching a list and then fetching each item\'s relations one by one turns a single query into hundreds, usually invisibly through lazy loading.',
    useWhen: [
      'the page makes four hundred database queries to render a list',
      'it is fast with ten records and unusable with a thousand',
      'the query log shows the same statement repeated with different ids',
      'adding a field to the response made everything slow',
    ],
    prompt:
      'Find and fix the repeated-query patterns on this path. Detect them by counting queries per request rather than by reading code, since lazy loading hides the calls — say how to instrument that count and how to assert on it in tests, which is the durable fix. For each occurrence, give the remedy: eager loading with a join, a separate batched query keyed by the parent ids, or a data loader that coalesces within a request. Compare join-based fetching against two-query fetching on row multiplication, since a join across two collections can return far more rows than either approach alone. Finish with the guardrail that prevents recurrence.',
    why:
      'A per-request query-count assertion in tests is the fix that survives, because the pattern reappears whenever someone adds a field. Detection-by-counting is more reliable than review.',
    watchOut:
      'Eager loading everything creates the opposite problem: enormous result sets fetched for pages that use one field. The fix is per-use-case fetching, not a global setting.',
    related: ['batching-amortization', 'lazy-vs-eager-loading', 'query-plan-reading', 'fan-out-fan-in'],
    tags: ['performance', 'database', 'orm', 'queries'],
  },

  {
    id: 'lazy-vs-eager-loading',
    name: 'Lazy versus Eager Loading',
    aka: ['deferred initialisation', 'prefetching', 'load on demand'],
    origin: 'Object-relational mapping and UI performance practice',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Decide per use case whether to fetch data when asked or in advance, trading unnecessary work against latency at the moment of need.',
    useWhen: [
      'we load everything up front and most of it is never used',
      'the first interaction is slow because nothing was prepared',
      'the object graph loads half the database when touched',
      'startup takes ages because everything initialises eagerly',
    ],
    prompt:
      'Decide the loading strategy for each of these resources using two measurements: the probability it is actually used in a given request, and the latency cost if it must be fetched at the moment of need. High probability or high fetch cost means load in advance; low probability and cheap fetch means defer. Present the table with our real usage rates. Then handle the hazards of each: deferred loading that escapes its transaction or session and fails at render time, and eager loading that pulls a graph far larger than expected. Recommend per use case rather than as a global default, since one setting for all callers is what causes both problems.',
    why:
      'Framing it as probability times cost per use case, rather than as a global framework setting, is what resolves the argument and prevents both failure modes.',
    watchOut:
      'Deferred loading inside a template or serialiser executes queries at render time, far from any error handling. That is where the mysterious production failures come from.',
    related: ['n-plus-one-queries', 'precomputation-materialization', 'batching-amortization', 'jit-warmup'],
    tags: ['performance', 'data access', 'trade-offs', 'latency'],
  },

  {
    id: 'precomputation-materialization',
    name: 'Precomputation',
    aka: ['materialised views', 'denormalised read models', 'write-time computation'],
    origin: 'Database and data warehousing practice; central to CQRS read models',
    domains: ['engineering', 'data'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Move expensive work from read time to write time when reads outnumber writes, accepting staleness and extra storage in exchange for fast queries.',
    useWhen: [
      'the dashboard query aggregates millions of rows on every load',
      'the same expensive calculation runs for every visitor',
      'reads outnumber writes by a thousand to one and we compute on read',
      'the report takes two minutes and everyone runs it every morning',
    ],
    prompt:
      'Design precomputation for this expensive read. Establish the read-to-write ratio and the acceptable staleness first, because those two numbers determine both whether this is worth it and which refresh mechanism fits — recompute on write, incremental update, or scheduled rebuild. Then design the invalidation and refresh path, including what happens when the precomputed data is wrong or missing, since a stale derived value with no repair path becomes a permanent data quality problem. Specify how we detect divergence between derived and source data, and the reconciliation job that fixes it.',
    why:
      'Divergence detection and repair are what make derived data trustworthy over years, and they are almost always omitted from the initial design.',
    watchOut:
      'Every precomputed view is a second copy of the truth that can drift. The maintenance cost is ongoing, not a one-off build.',
    related: ['cqrs', 'cache-invalidation-strategy', 'reconciliation-jobs', 'lazy-vs-eager-loading'],
    tags: ['performance', 'caching', 'data modelling', 'read optimisation'],
  },

  {
    id: 'cache-invalidation-strategy',
    name: 'Cache Invalidation Strategy',
    aka: ['expiry versus invalidation', 'stale data control', 'TTL design'],
    origin: 'Caching practice; the classic hard problem of computer science',
    domains: ['engineering'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Decide how cached data becomes wrong and how it gets corrected — by expiry, by explicit invalidation, or by versioning the key — before you decide where to cache.',
    useWhen: [
      'users see old data after an update and we cannot tell for how long',
      'we cleared the cache manually to fix a customer complaint',
      'nobody knows which caches hold a copy of this record',
      'the invalidation works locally and not across instances',
    ],
    prompt:
      'Design invalidation for this cached data. First inventory every layer holding a copy — client, CDN, reverse proxy, application memory, shared cache, database buffer — because partial invalidation is the usual cause of mystifying staleness. Then choose the mechanism per layer: time-based expiry with a lifetime derived from tolerable staleness, event-driven invalidation on write, or key versioning where the key changes and old entries age out on their own. Recommend key versioning where possible since it avoids the distributed delete problem entirely. Finish with the behaviour on a miss storm and how we verify invalidation actually happened.',
    why:
      'Key versioning sidesteps the hardest part of the problem and is routinely overlooked in favour of fragile explicit deletes across many nodes.',
    watchOut:
      'Client and CDN caches you cannot reach make some staleness unavoidable. Set those lifetimes conservatively because you cannot recall them.',
    related: ['cache-key-design', 'caching-read-write-patterns', 'thundering-herd', 'cdn-edge-caching'],
    tags: ['performance', 'caching', 'consistency', 'design'],
  },

  {
    id: 'cache-key-design',
    name: 'Cache Key Design',
    aka: ['cache key hygiene', 'vary headers', 'key namespacing'],
    origin: 'Web caching and application caching practice',
    domains: ['engineering', 'security'],
    intents: ['structure', 'critique'],
    oneLiner:
      'The key must include every input that changes the value — omit one and different users share a cached answer, which is a correctness and sometimes a security failure.',
    useWhen: [
      'a customer saw another customer\'s data on a cached page',
      'the cache returns the wrong variant for logged-in users',
      'our hit rate is terrible because every key is unique',
      'changing the response format did not invalidate anything',
    ],
    prompt:
      'Audit the cache keys on this path. For each cached value, enumerate every input that can change it — identity, tenant, permissions, locale, currency, device class, feature flags, API version, and the serialisation format itself — and confirm each is either in the key or provably irrelevant. Any omission that mixes tenants is a security finding, so report those separately and first. Then look at the opposite failure: inputs in the key that do not affect the value, such as request ids or timestamps, which destroy the hit rate. Finish with a namespacing and versioning scheme so a format change invalidates cleanly.',
    why:
      'Missing key components produce cross-tenant leaks that look like caching bugs, and the audit is the only reliable way to find them before a customer does.',
    watchOut:
      'Caching anything downstream of an authorisation decision is dangerous by default. Prefer caching before authorisation, or key on the permission set itself.',
    related: ['cache-invalidation-strategy', 'cdn-edge-caching', 'trust-boundary', 'caching-read-write-patterns'],
    tags: ['performance', 'caching', 'security', 'correctness'],
  },

  {
    id: 'caching-read-write-patterns',
    name: 'Cache Read and Write Patterns',
    aka: ['cache-aside', 'read-through', 'write-through', 'write-behind'],
    origin: 'Caching architecture practice; standard in distributed systems texts',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose who populates the cache and when writes reach the store — aside, through, or behind — since each has different consistency and failure behaviour.',
    useWhen: [
      'a write updated the database and the cache still has the old value',
      'we cache in five places with five different conventions',
      'the cache went down and took the application with it',
      'a race between two writers left the cache permanently wrong',
    ],
    prompt:
      'Choose a caching pattern for this data and specify its failure behaviour. Compare cache-aside, read-through, write-through and write-behind on four things: consistency after a write, what happens when the cache is unavailable, what happens when the store write fails after the cache write, and the race where a concurrent read repopulates a stale value between a delete and a write. That last race is the one that leaves caches permanently wrong, so show explicitly how the chosen pattern handles it. Then state whether the cache is an optimisation we can lose or a load-bearing component, because that determines the failure design.',
    why:
      'The delete-then-repopulate race is the classic silent corruption, and the optional-versus-load-bearing question determines whether a cache outage is a slowdown or an outage.',
    watchOut:
      'Write-behind can lose acknowledged writes if the cache dies before flushing. That is a data durability decision, not a performance tuning knob.',
    related: ['cache-invalidation-strategy', 'cache-key-design', 'thundering-herd', 'precomputation-materialization'],
    tags: ['performance', 'caching', 'consistency', 'architecture'],
  },

  {
    id: 'cdn-edge-caching',
    name: 'Edge Caching',
    aka: ['CDN strategy', 'cache-control headers', 'stale-while-revalidate'],
    origin: 'Content delivery network practice; HTTP caching specifications',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Serve content from a location near the user and control it with explicit cache directives, so most requests never reach your origin at all.',
    useWhen: [
      'users far from our region have a much worse experience',
      'our origin serves the same static response millions of times',
      'we deployed and users kept getting the old JavaScript for days',
      'nobody understands our cache-control headers',
    ],
    prompt:
      'Design edge caching for these responses. For each, specify the directives explicitly — maximum age, whether shared caches may store it, revalidation requirements, and the variation dimensions — and justify each rather than copying a template. Use content-hashed filenames with long lifetimes for immutable assets and short lifetimes for the documents that reference them, which is the pattern that makes deploys propagate correctly. Then add resilience: serving stale content while revalidating and while the origin is erroring, so a brief origin outage is invisible. Finish with purge capability, its propagation delay, and what to do for anything user-specific that must never be cached at the edge.',
    why:
      'The immutable-asset plus short-lived-document pairing is what makes deploys propagate correctly, and stale-if-error converts origin outages into non-events. Both are commonly missed.',
    watchOut:
      'A misconfigured directive on a personalised response caches one user\'s page for everyone. Anything authenticated needs explicit no-store unless keyed carefully.',
    related: ['cache-key-design', 'cache-invalidation-strategy', 'payload-size-reduction', 'zero-downtime-deployment'],
    tags: ['performance', 'caching', 'cdn', 'web'],
  },

  {
    id: 'compression-tradeoffs',
    name: 'Compression Trade-offs',
    aka: ['gzip versus brotli', 'compression level tuning', 'CPU for bandwidth'],
    origin: 'Network and storage engineering practice',
    domains: ['engineering'],
    intents: ['decide', 'estimate'],
    oneLiner:
      'Compression trades CPU for bytes, and the right level depends on whether the content is compressed once and served often or compressed on every response.',
    useWhen: [
      'our responses are large and the network is the bottleneck',
      'we turned on maximum compression and the CPU went up sharply',
      'we compress tiny responses and it makes them bigger',
      'storage costs are dominated by repetitive data',
    ],
    prompt:
      'Decide compression settings for this content. Separate the cases: static assets compressed once at build time deserve the highest level available, while dynamically generated responses compressed per request need a level chosen from the CPU cost per byte at our request rate — show that calculation. Set a minimum size threshold below which compression is skipped, since small payloads can grow. Then check the interactions: content already compressed such as images and video, and the security consideration of compressing responses that mix secret and attacker-influenced data. Finish with what to measure to confirm the setting is right.',
    why:
      'The build-time versus request-time split is the decision that matters and is usually collapsed into one global setting, and the compression-with-secrets hazard is genuinely obscure.',
    watchOut:
      'Compressing a response that contains both a secret and attacker-controlled input can leak the secret through size observation. Where that applies, disable it.',
    related: ['payload-size-reduction', 'cdn-edge-caching', 'zero-copy-io', 'cpu-vs-io-bound'],
    tags: ['performance', 'compression', 'bandwidth', 'trade-offs'],
  },

  {
    id: 'connection-pooling',
    name: 'Connection Pooling',
    aka: ['pool sizing', 'connection reuse', 'pool exhaustion'],
    origin: 'Database and network client practice; sizing guidance from HikariCP and PgBouncer',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Reuse expensive connections from a bounded pool, and size the pool from downstream capacity rather than from application concurrency.',
    useWhen: [
      'the application hangs waiting for a database connection',
      'we increased the pool size and the database got slower',
      'the database hit its connection limit and refused everyone',
      'each instance opens its own pool and we now have thousands of connections',
    ],
    prompt:
      'Size and configure this pool. Start from the downstream limit and divide across all clients including background jobs and other services, then check that against what the database can actually serve concurrently — a pool larger than the downstream can handle converts a fast queue in your process into a slow queue in theirs, which is worse. Show the arithmetic and the resulting per-instance number given autoscaling maximums. Then set the behaviour on exhaustion: wait with a timeout short enough to fail fast, never wait forever. Finish with the leak detection for connections not returned, and the validation that avoids handing out a dead connection.',
    why:
      'Pools are usually sized upward until the symptom moves, which pushes queueing into the database. Deriving from downstream capacity including autoscaled instance count is the correct direction.',
    watchOut:
      'A connection held across an external API call is a connection not doing database work. Long-held connections make a correctly sized pool look too small.',
    related: ['queueing-theory-basics', 'backpressure', 'saturation-monitoring', 'timeout-budgets'],
    tags: ['performance', 'database', 'resources', 'configuration'],
  },

  {
    id: 'payload-size-reduction',
    name: 'Payload Size Reduction',
    aka: ['response trimming', 'over-fetching', 'field selection'],
    origin: 'Web and mobile performance practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Send less: most responses contain fields nobody reads, duplicated structure, and precision no consumer needs.',
    useWhen: [
      'our API response is two megabytes for a list view',
      'the mobile app is slow on poor networks',
      'we return the whole object because it was easier',
      'bandwidth costs are climbing faster than usage',
    ],
    prompt:
      'Reduce the size of this response. Analyse the actual payload: which fields do known consumers read, what proportion of bytes is field names repeated per row, what precision are we sending that nobody uses, and what nested objects are included wholesale for one attribute. Propose the reductions in order of safety — removing unused fields, flattening repeated keys, reducing numeric and timestamp precision, and paginating or streaming large collections — and for each say how we verify no consumer depends on it, since that verification is what blocks these changes. Finish with the measured before and after, compressed and uncompressed.',
    why:
      'The blocker on trimming responses is never technical, it is not knowing who consumes what. Making the verification method part of the task is what unblocks it.',
    watchOut:
      'Removing a field is a breaking change even if you believe nobody uses it. Measure consumption from logs before removing, and version if uncertain.',
    related: ['compression-tradeoffs', 'api-pagination', 'over-fetching-graphql', 'performance-budget'],
    tags: ['performance', 'api', 'bandwidth', 'mobile'],
  },

  {
    id: 'streaming-vs-buffering',
    name: 'Streaming versus Buffering',
    aka: ['chunked responses', 'incremental processing', 'memory-bounded IO'],
    origin: 'Systems and web engineering practice',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Process and emit data incrementally rather than materialising it all, which bounds memory and lets the consumer start work before you finish.',
    useWhen: [
      'exporting a large file uses gigabytes of memory',
      'the user stares at a blank page until the whole response is ready',
      'we load the entire result set to transform it',
      'the process dies on the biggest customer\'s data',
    ],
    prompt:
      'Convert this operation to incremental processing. Identify where the whole data set is currently materialised — a query result read fully, a document built in memory, a list mapped before writing — and show the streaming equivalent with bounded memory. Then handle the parts that make streaming harder and are usually discovered late: error handling after the response has already begun and headers are sent, resource cleanup on client disconnect, transactions or cursors held open for the duration, and back pressure when the consumer is slower than the producer. Finish with the memory ceiling the streaming version guarantees regardless of data size.',
    why:
      'Errors after the first byte is sent is the problem that makes streaming implementations wrong, and holding a cursor open for a slow consumer is the one that hurts the database.',
    watchOut:
      'Streaming makes retries and idempotency harder, since a partially delivered response may need to be regenerated from the start. Decide how the consumer resumes.',
    related: ['zero-copy-io', 'backpressure', 'api-pagination', 'batching-amortization'],
    tags: ['performance', 'memory', 'io', 'api'],
  },
]
