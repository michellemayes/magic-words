import type { Concept } from '../types'

export const concurrency: Concept[] = [
  {
    id: 'parallelism-vs-concurrency',
    name: 'Concurrency versus Parallelism',
    aka: ['dealing with many things at once', 'doing many things at once'],
    origin: 'Rob Pike, Concurrency Is Not Parallelism, 2012',
    domains: ['engineering'],
    intents: ['explain', 'reframe'],
    oneLiner:
      'Concurrency is a way of structuring work so parts can progress independently; parallelism is executing them simultaneously — you can have either without the other.',
    useWhen: [
      'we added threads and it got slower',
      'someone says make it concurrent and I do not know what they want',
      'the work is all waiting on the network and we bought more cores',
      'I cannot tell whether our bottleneck needs more workers or a different structure',
    ],
    prompt:
      'Clarify what this workload actually needs. Determine whether the goal is throughput on compute, responsiveness while waiting, or independent progress of unrelated tasks, since those want different mechanisms — more cores, non-blocking waiting, and independent task structure respectively. Then examine our current design and say which we have. Be specific about where the limit sits: cores, blocked threads, a shared lock, or a downstream service that will not go faster no matter what we do locally. Finish with the restructuring that would help and the one that would not, with the reason each.',
    why:
      'Adding threads to a workload limited by a downstream service or a lock makes it worse. Separating the three goals is what stops that reflex.',
    watchOut:
      'Concurrency always adds a correctness burden. If the workload is neither latency-bound nor parallelisable, the simplest sequential version is the right answer.',
    related: ['async-io-model', 'thread-pool-sizing', 'amdahls-law', 'cpu-vs-io-bound'],
    tags: ['concurrency', 'architecture', 'performance', 'fundamentals'],
  },

  {
    id: 'race-condition-diagnosis',
    name: 'Race Condition Diagnosis',
    aka: ['check-then-act', 'time-of-check to time-of-use', 'interleaving bugs'],
    origin: 'Concurrent programming fundamentals; TOCTOU from security literature',
    domains: ['engineering'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'A logical race is a check followed by an action where the world can change in between — find them by looking for the gap, not by staring at threads.',
    useWhen: [
      'it works ninety-nine times and fails on the hundredth',
      'we checked whether the record existed and then created it and got a duplicate',
      'the bug only appears under load and never in testing',
      'two requests at the same moment produced an impossible state',
    ],
    prompt:
      'Find the check-then-act sequences in this code. For each, describe the window between the check and the action, what another actor could do in that window, and the resulting incorrect state — that concrete interleaving is the proof, and without it a suspected race is speculation. Look beyond obvious threads: separate processes, retries, background jobs, and the user\'s own second browser tab all count. Then give the fix per case in order of preference: make the operation atomic at the storage layer with a constraint or conditional write, hold a lock across the window, or restructure so the check is unnecessary. Finish with the test that would reproduce it.',
    why:
      'Writing the specific interleaving distinguishes real races from paranoia, and preferring a database constraint over a lock produces fixes that survive multiple processes.',
    watchOut:
      'A lock in application memory does not protect against a second instance of the application. Verify the scope of the protection matches the scope of the concurrency.',
    related: ['data-race-diagnosis', 'transaction-isolation-levels', 'optimistic-concurrency', 'idempotency-keys'],
    tags: ['concurrency', 'debugging', 'correctness', 'races'],
  },

  {
    id: 'data-race-diagnosis',
    name: 'Data Race Diagnosis',
    aka: ['unsynchronised access', 'race detector', 'torn reads'],
    origin: 'Memory model literature; ThreadSanitizer and race detector tooling',
    domains: ['engineering'],
    intents: ['diagnose', 'critique'],
    oneLiner:
      'Two threads touching the same memory without synchronisation, at least one writing, is undefined behaviour — not merely a value that might be stale.',
    useWhen: [
      'the value is occasionally garbage rather than merely old',
      'it works in debug builds and fails when optimised',
      'a field is read by one thread and written by another with no lock',
      'the crash makes no sense given the code as written',
    ],
    prompt:
      'Audit this code for unsynchronised shared access. List every piece of mutable state reachable from more than one thread, and for each say what establishes ordering — a lock, an atomic, a channel handoff, or nothing. Then explain why unsynchronised access is worse than stale values: without ordering, the compiler and processor may reorder, cache, split or eliminate the access entirely, so the observed behaviour need not correspond to any interleaving of the source. Recommend the fix per case, preferring confinement to one thread or immutability over adding a lock. Finish with how to run a race detector against our tests and what workload will actually exercise these paths.',
    why:
      'Treating this as a staleness problem leads to fixes that appear to work and remain undefined. Explaining reordering and elimination is what forces a real synchronisation decision.',
    watchOut:
      'Race detectors only report races on paths that actually execute concurrently during the run. A clean report means your test did not exercise it, not that the code is safe.',
    related: ['memory-visibility', 'atomic-operations', 'immutability-by-default', 'concurrency-testing'],
    tags: ['concurrency', 'memory model', 'debugging', 'correctness'],
  },

  {
    id: 'memory-visibility',
    name: 'Memory Visibility',
    aka: ['happens-before', 'volatile semantics', 'memory barriers'],
    origin: 'Java Memory Model, JSR-133, 2004; C++11 memory model',
    domains: ['engineering'],
    intents: ['explain', 'structure'],
    oneLiner:
      'A write by one thread is not guaranteed visible to another without an ordering relationship — locks and atomics provide it, ordinary variables do not.',
    useWhen: [
      'the flag was set and the other thread never noticed',
      'the loop waiting on a boolean spins forever',
      'we published an object and another thread saw it half-initialised',
      'adding a print statement made the bug disappear',
    ],
    prompt:
      'Explain the ordering guarantees this code relies on and whether it has them. For each cross-thread communication, identify the pair of operations that must establish ordering — the release on the writing side and the acquire on the reading side — and confirm the language construct used actually provides it. Pay attention to safe publication: an object whose fields are written before it is stored into a shared reference can still be observed partially constructed without a proper release. Then recommend the minimal correct construct rather than the strongest, and say which of our uses genuinely need ordering versus only atomicity.',
    why:
      'Safe publication of a fully-constructed object is the subtle failure that produces impossible-looking states, and it is invisible when reading code sequentially.',
    watchOut:
      'A variable marked for visibility gives ordering, not atomicity. Increment on such a variable is still a lost-update race.',
    related: ['data-race-diagnosis', 'atomic-operations', 'immutability-by-default', 'compare-and-swap'],
    tags: ['concurrency', 'memory model', 'fundamentals', 'correctness'],
  },

  {
    id: 'atomic-operations',
    name: 'Atomic Operations',
    aka: ['atomics', 'lock-free counters', 'fetch and add'],
    origin: 'Hardware primitives; exposed in language standard libraries',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Single operations the hardware guarantees indivisible — useful for counters and flags, and a trap when several of them are combined and assumed atomic together.',
    useWhen: [
      'the counter is wrong under load even though each increment looks fine',
      'we replaced a lock with atomics and now the state is inconsistent',
      'we need a fast counter and a lock feels heavy',
      'two atomic reads in a row gave a contradictory picture',
    ],
    prompt:
      'Assess where atomic operations fit in this code. Identify the state that genuinely fits a single atomic word and the state that does not, and be explicit about the compositional trap: two atomic operations performed in sequence are not atomic together, so any invariant spanning two variables needs a lock or a single combined value. Then, for the cases that do fit, choose the operation and the ordering strength, defaulting to the strongest and relaxing only with a stated reason. Finish with contention: a single hot atomic counter across many cores can be slower than a lock plus batching, so recommend sharded or thread-local accumulation where the value is only read occasionally.',
    why:
      'The two-atomics-are-not-atomic trap is the standard way lock-free code becomes subtly wrong, and hot-counter contention is why the fast option is sometimes slower.',
    watchOut:
      'Relaxed memory orderings are extremely difficult to reason about and rarely justified outside hot paths measured to matter. Use the default unless proven.',
    related: ['memory-visibility', 'compare-and-swap', 'false-sharing', 'lock-contention'],
    tags: ['concurrency', 'atomics', 'lock-free', 'performance'],
  },

  {
    id: 'compare-and-swap',
    name: 'Compare-and-Swap Loops',
    aka: ['CAS', 'optimistic retry loop', 'lock-free update'],
    origin: 'Hardware primitive; foundational to lock-free algorithms',
    domains: ['engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Read a value, compute the new one, and swap it in only if nothing changed meanwhile — retrying on failure gives lock-free updates without blocking.',
    useWhen: [
      'a lock around this tiny update is dominating the profile',
      'threads block on a shared counter under heavy contention',
      'I want an update that never blocks other threads',
      'the retry loop spins forever under load',
    ],
    prompt:
      'Design this update as a compare-and-swap loop and be honest about when it is worth it. Show the read, compute, swap and retry structure, and specify what happens under sustained contention where a thread may retry many times — including whether progress is guaranteed for any individual thread, which lock-free structures do not promise. Then flag the classic hazard where a value changes from A to B and back to A between the read and the swap, so the comparison succeeds although the state moved; say whether our case is vulnerable and if so use a version-tagged value. Finish by comparing against a plain lock at our measured contention level.',
    why:
      'The value-changed-and-changed-back hazard invalidates otherwise correct-looking lock-free code, and comparing against a plain lock at measured contention usually favours the lock.',
    watchOut:
      'Lock-free is not wait-free. Under heavy contention an unlucky thread can retry indefinitely while others make progress.',
    related: ['atomic-operations', 'optimistic-concurrency', 'lock-contention', 'memory-visibility'],
    tags: ['concurrency', 'lock-free', 'atomics', 'algorithms'],
  },

  {
    id: 'lock-contention',
    name: 'Lock Contention',
    aka: ['mutex contention', 'lock convoy', 'critical section width'],
    origin: 'Concurrent systems performance practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'When many threads want the same lock, throughput collapses to the width of the critical section — the fix is usually to shrink or split it, not to switch lock types.',
    useWhen: [
      'adding threads stopped helping and then started hurting',
      'the profile shows everything waiting on one lock',
      'CPU is idle and throughput is flat',
      'one slow operation inside a lock blocks everyone else',
    ],
    prompt:
      'Diagnose contention in this code. Measure hold time and wait time per lock rather than guessing which is hot. Then work through the remedies in order of effect: remove work from inside the critical section, especially any I/O or allocation, since a single blocking call inside a lock serialises the whole system; split one lock into several covering independent state; shard by key so different items use different locks; or eliminate sharing entirely with per-thread state and periodic merging. Only after those consider a different lock implementation. Finish with the expected throughput change derived from the reduced critical section width.',
    why:
      'I/O inside a critical section is the single most common cause and the easiest fix, and it is invisible in a CPU profile because the threads are blocked rather than running.',
    watchOut:
      'Splitting one lock into many introduces ordering requirements and therefore deadlock potential. Establish an acquisition order before you split.',
    related: ['database-deadlocks', 'universal-scalability-law', 'thread-pool-sizing', 'false-sharing'],
    tags: ['concurrency', 'performance', 'locks', 'scaling'],
  },

  {
    id: 'false-sharing',
    name: 'False Sharing',
    aka: ['cache line ping-pong', 'padding for contention'],
    origin: 'Computer architecture; widely discussed in mechanical sympathy practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Two threads writing to different variables that happen to share a cache line contend at the hardware level, even though the code shares nothing.',
    useWhen: [
      'per-thread counters scale terribly despite being independent',
      'adding a core made a parallel loop slower',
      'the profile blames a line of code that does almost nothing',
      'padding a struct mysteriously fixed performance',
    ],
    prompt:
      'Check this parallel code for hardware-level contention. Identify variables written by different threads that could sit within the same cache line — adjacent fields in a struct, adjacent elements of an array indexed by thread, and counters in a shared object are the usual cases. Then propose the fix: padding or alignment so each thread\'s written data occupies its own line, or restructuring to thread-local accumulation merged at the end, which is usually better because it also removes the coherence traffic entirely. Finish with how to confirm it, since this hypothesis needs measurement rather than reasoning — name the counter or experiment that would demonstrate it.',
    why:
      'This is invisible in source code and produces scaling behaviour that looks inexplicable. Naming the confirmation experiment prevents padding things speculatively.',
    watchOut:
      'Padding everything wastes memory and hurts locality elsewhere. Apply it to demonstrated hot spots only.',
    related: ['cache-hierarchy-locality', 'atomic-operations', 'lock-contention', 'universal-scalability-law'],
    tags: ['concurrency', 'performance', 'hardware', 'scaling'],
  },

  {
    id: 'read-write-locks',
    name: 'Read-Write Locks',
    aka: ['shared exclusive locks', 'reader preference', 'writer starvation'],
    origin: 'Concurrent programming primitives',
    domains: ['engineering'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Allowing many concurrent readers or one writer helps read-heavy workloads, and costs more than a plain lock when critical sections are short.',
    useWhen: [
      'reads massively outnumber writes and they block each other',
      'we switched to a reader-writer lock and it got slower',
      'the writer never gets a turn under constant read load',
      'a reader tried to upgrade to a writer and deadlocked',
    ],
    prompt:
      'Decide whether a shared-exclusive lock suits this data. It pays only when critical sections are long enough for concurrent reads to matter, since the bookkeeping costs more than a simple lock for very short sections — so measure the section length first. Then address the two failure modes: writer starvation under continuous reads, which requires a fairness policy, and upgrade deadlock where two readers both attempt to become writers. State our policy on both. Finally compare against the alternatives that avoid the problem entirely — an immutable snapshot readers use without locking, or copy-on-write — which are often better for read-dominated data.',
    why:
      'Immutable snapshots frequently beat reader-writer locks outright for read-heavy data, and that alternative is skipped when the question is framed as which lock to use.',
    watchOut:
      'Recursive acquisition and upgrade semantics differ by platform and are a common source of hangs. Check the exact behaviour of your implementation.',
    related: ['copy-on-write', 'lock-contention', 'immutability-by-default', 'livelock-and-starvation'],
    tags: ['concurrency', 'locks', 'performance', 'design'],
  },

  {
    id: 'livelock-and-starvation',
    name: 'Livelock and Starvation',
    aka: ['fairness', 'no progress despite activity', 'retry storms'],
    origin: 'Concurrent systems theory',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'A system can be fully busy and making no progress — threads retrying against each other, or one participant never getting its turn.',
    useWhen: [
      'the CPU is pinned and nothing is completing',
      'one worker never gets any work while the others are busy',
      'transactions keep aborting and retrying forever',
      'the system is active but the queue is not draining',
    ],
    prompt:
      'Diagnose whether this is deadlock, livelock or starvation, since the symptoms differ and the fixes are unrelated. Deadlock means everyone is blocked; livelock means everyone is running and nobody progresses; starvation means the system progresses but some participant never does. Determine which from thread states and completion counts rather than from the CPU graph. Then apply the matching remedy: for livelock, randomised backoff so retrying actors stop synchronising; for starvation, an explicit fairness policy such as queueing or ageing so waiting participants gain priority. Finish with the metric that would detect recurrence — per-participant progress, not aggregate throughput.',
    why:
      'Aggregate throughput hides starvation completely, and distinguishing the three states from thread state plus completion counts is what selects the right fix.',
    watchOut:
      'Fairness costs throughput. A strictly fair queue is slower than an unfair one, and sometimes the unfairness is acceptable if bounded.',
    related: ['lock-contention', 'read-write-locks', 'retry-with-backoff', 'priority-inversion'],
    tags: ['concurrency', 'fairness', 'diagnosis', 'liveness'],
  },

  {
    id: 'priority-inversion',
    name: 'Priority Inversion',
    aka: ['priority inheritance', 'low priority holding a lock'],
    origin: 'Real-time systems; famously diagnosed on the Mars Pathfinder, 1997',
    domains: ['engineering'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'A high-priority task blocked on a resource held by a low-priority one can be delayed indefinitely by medium-priority work that preempts the holder.',
    useWhen: [
      'the urgent request waits behind background work',
      'our critical path is delayed by something that should never block it',
      'the batch job starves the interactive traffic',
      'latency spikes exactly when the maintenance job runs',
    ],
    prompt:
      'Look for priority inversion in this system, including the distributed analogues that most systems have without using thread priorities at all: a background job holding a database lock that user requests need, a bulk export consuming the shared connection pool, or a low-value request occupying a worker while a paying customer queues. Identify every shared resource where work of different importance contends. Then apply the remedies: separate resource pools per class so they cannot block each other, priority-aware queueing, or bounding the time any low-priority holder may keep a shared resource. Say which of ours is the biggest exposure.',
    why:
      'Framing this beyond thread priorities into shared pools and locks is what makes it applicable to ordinary services, where the same dynamic causes unexplained latency spikes.',
    watchOut:
      'Simply raising the priority of the important work does not help if it still has to wait for the same lock. The resource must be separated or the holding time bounded.',
    related: ['bulkhead-isolation', 'livelock-and-starvation', 'lock-contention', 'load-shedding'],
    tags: ['concurrency', 'scheduling', 'latency', 'diagnosis'],
  },

  {
    id: 'thread-pool-sizing',
    name: 'Thread Pool Sizing',
    aka: ['worker count', 'pool tuning', 'unbounded pools'],
    origin: 'Concurrent programming practice; Brian Goetz\'s guidance on pool sizing',
    domains: ['engineering'],
    intents: ['estimate', 'structure'],
    oneLiner:
      'Size a pool from the work it does — roughly core count for computation, much higher for waiting — and never leave it unbounded.',
    useWhen: [
      'we set the pool to two hundred threads because it seemed safer',
      'the service runs out of memory under load',
      'increasing workers made throughput worse',
      'tasks queue up while threads sit idle waiting on the network',
    ],
    prompt:
      'Size these pools from the workload. For compute-bound work, derive from available cores and show the arithmetic; for work that spends most of its time waiting, derive from the target throughput and the wait duration using the concurrency relationship, then check the result against the downstream capacity so we do not simply move the queue. Then insist on bounds: a bounded queue with a defined rejection policy, because an unbounded queue converts overload into memory exhaustion and unbounded latency. Finally recommend separate pools for work of different character, since mixing blocking and compute tasks in one pool makes both behave badly.',
    why:
      'Deriving the waiting-work pool size from throughput and wait time gives a defensible number, and separating pools by task character prevents one slow dependency from consuming everything.',
    watchOut:
      'A pool larger than the downstream service can handle just relocates the queue. The correct size depends on someone else\'s capacity, not only yours.',
    related: ['queueing-theory-basics', 'connection-pooling', 'bulkhead-isolation', 'backpressure'],
    tags: ['concurrency', 'tuning', 'capacity', 'threads'],
  },

  {
    id: 'semaphore-limiting',
    name: 'Concurrency Limiting',
    aka: ['semaphores', 'in-flight caps', 'admission limits'],
    origin: 'Dijkstra\'s semaphores, 1965; modern use in client-side limiting',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Cap how many operations of a kind may be in flight at once, so one workload cannot consume all of a shared resource.',
    useWhen: [
      'a burst of parallel calls overwhelmed a downstream service',
      'the batch job opened five hundred connections at once',
      'we need to be a good citizen against a rate-limited third party',
      'memory spikes because too many large operations run together',
    ],
    prompt:
      'Add explicit in-flight limits to these operations. Identify each shared or external resource and set a cap derived from what that resource can serve rather than from what we can generate. Then specify the behaviour when the limit is reached — queue with a bounded wait, or reject immediately — and tie the wait timeout to the caller\'s remaining deadline so waiting does not consume the entire budget. Consider an adaptive limit that adjusts to observed latency and errors, since a static number is wrong whenever the downstream changes. Finish with the telemetry: time spent waiting for a permit is the signal that the limit is too tight or the dependency is degraded.',
    why:
      'Wait-for-permit time is a uniquely diagnostic metric that distinguishes our own throttling from downstream slowness, and it is almost never instrumented.',
    watchOut:
      'A limit that is too low silently caps throughput and looks like a slow dependency. Without the wait metric you will investigate the wrong system.',
    related: ['thread-pool-sizing', 'bulkhead-isolation', 'backpressure', 'rate-limiting-algorithms'],
    tags: ['concurrency', 'limits', 'resilience', 'resources'],
  },

  {
    id: 'producer-consumer-queue',
    name: 'Producer-Consumer Queues',
    aka: ['bounded buffer', 'work queue', 'in-process pipeline'],
    origin: 'Classic concurrency pattern; Dijkstra-era origins',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Decouple producing work from consuming it through a bounded queue, which is also where backpressure, ordering and shutdown semantics have to be decided.',
    useWhen: [
      'the fast producer overwhelms the slow consumer',
      'work is lost when the process shuts down',
      'the in-memory queue grew until the process died',
      'we need to process items in the background without blocking the request',
    ],
    prompt:
      'Design this in-process pipeline. Specify the queue bound derived from acceptable latency and memory, and the producer\'s behaviour when it is full — block, drop, or reject — chosen deliberately rather than by default. Then handle the properties that determine correctness: whether ordering matters and therefore whether consumers may run in parallel, how a consumer failure is handled without losing the item, and shutdown, where in-flight and queued work must either drain within a deadline or be persisted. Be explicit that anything held only in memory is lost on crash, and say whether that is acceptable or whether this needs a durable queue instead.',
    why:
      'The in-memory queue and crash-loss question is the one that decides whether this pattern is appropriate at all, and it is usually assumed rather than decided.',
    watchOut:
      'An in-process queue makes a request look fast while the work has not happened. If the user believes it is done, a crash breaks a promise you made.',
    related: ['backpressure', 'graceful-shutdown', 'delivery-semantics', 'thread-pool-sizing'],
    tags: ['concurrency', 'queues', 'pipelines', 'reliability'],
  },

  {
    id: 'work-stealing',
    name: 'Work Stealing',
    aka: ['fork-join scheduling', 'load balancing between workers'],
    origin: 'Blumofe and Leiserson, Cilk, 1994',
    domains: ['engineering'],
    intents: ['explain', 'structure'],
    oneLiner:
      'Idle workers take tasks from busy workers\' queues, which balances uneven workloads automatically without a central dispatcher.',
    useWhen: [
      'some workers finish early and sit idle while others are swamped',
      'the tasks vary enormously in size and we cannot predict which',
      'partitioning the work evenly up front is impossible',
      'our parallel loop is limited by its slowest chunk',
    ],
    prompt:
      'Assess whether a stealing scheduler suits this workload. It pays when task durations are unpredictable and tasks are independent, so state whether ours are. Explain the mechanism — per-worker queues with stealing from the opposite end to reduce contention — and what it implies for task granularity: too fine and scheduling overhead dominates, too coarse and stealing cannot balance anything, so recommend a granularity for our case. Then flag the constraints people violate: a blocking call inside a task starves its worker, and tasks that depend on thread-local state break when stolen. Identify where our code would violate either.',
    why:
      'Blocking inside a task and reliance on thread-local state are the two things that silently defeat these schedulers, and both are common in code written for a plain pool.',
    watchOut:
      'A stealing pool shared across the application means one workload\'s blocking tasks degrade everyone else\'s. Separate pools for blocking work.',
    related: ['thread-pool-sizing', 'parallelism-vs-concurrency', 'amdahls-law', 'event-loop-blocking'],
    tags: ['concurrency', 'scheduling', 'parallelism', 'performance'],
  },

  {
    id: 'copy-on-write',
    name: 'Copy-on-Write',
    aka: ['COW', 'persistent snapshots', 'immutable swap'],
    origin: 'Operating systems memory management; adopted in concurrent collections',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Readers work on an immutable snapshot while a writer builds a new version and swaps it in, giving lock-free reads at the cost of copying on write.',
    useWhen: [
      'configuration is read constantly and updated rarely',
      'readers block on a lock that writers hold for a moment a day',
      'iterating this collection while it changes throws exceptions',
      'we need a consistent view of shared state without stopping readers',
    ],
    prompt:
      'Evaluate copy-on-write for this shared state. Confirm the read-to-write ratio makes copying affordable and state the copy cost at our data size. Then design the swap: readers hold a reference to an immutable version and are unaffected by the writer, and the new version becomes visible by a single reference assignment with the appropriate publication guarantee. Address the two consequences: readers that took a snapshot may act on data that is now stale, so say whether that is acceptable per use case, and concurrent writers must be serialised among themselves. Finish with memory behaviour, since old versions live until the last reader releases them.',
    why:
      'The staleness acceptance per use case and the writer serialisation are the two decisions this pattern requires, and both are easy to skip because reads look effortless.',
    watchOut:
      'Copying a large structure for a small change is wasteful. Persistent data structures with structural sharing give the same semantics without full copies.',
    related: ['immutability-by-default', 'read-write-locks', 'memory-visibility', 'crdt'],
    tags: ['concurrency', 'immutability', 'snapshots', 'performance'],
  },

  {
    id: 'shared-nothing-design',
    name: 'Shared-Nothing Design',
    aka: ['thread confinement', 'partition by key', 'no shared mutable state'],
    origin: 'Database architecture term, Michael Stonebraker, 1986; applied broadly',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Eliminate concurrency problems by ensuring no two workers touch the same state — partition the data instead of protecting it.',
    useWhen: [
      'our locking is getting complicated and we keep finding races',
      'every fix adds another lock',
      'contention limits throughput no matter how we tune',
      'the state is naturally per-customer but we share one structure',
    ],
    prompt:
      'Restructure this to remove sharing rather than to synchronise it. Find the natural partition key in the domain — customer, session, document, region — and design so each partition is owned by exactly one worker at a time, making synchronisation within a partition unnecessary. Then confront what remains genuinely shared: global counters, caches, and cross-partition operations. For each, say whether it can be made eventually consistent through periodic merging, or whether it truly needs coordination. Finish with the rebalancing question: how ownership moves when a worker fails or the partition count changes, since that handover is where the sharing sneaks back in.',
    why:
      'Ownership handover on failure or rescaling is where shared-nothing designs reintroduce races, and it needs designing at the start rather than discovering later.',
    watchOut:
      'Partitioning by a skewed key concentrates work on one owner. The concurrency problem becomes a hot partition problem instead.',
    related: ['partitioning-strategy', 'actor-model', 'immutability-by-default', 'consistent-hashing'],
    tags: ['concurrency', 'architecture', 'partitioning', 'scaling'],
  },

  {
    id: 'actor-model',
    name: 'Actor Model',
    aka: ['message-passing concurrency', 'actors and mailboxes'],
    origin: 'Carl Hewitt, 1973; popularised by Erlang and Akka',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Independent entities with private state that communicate only by asynchronous messages, processing one at a time — concurrency without shared memory.',
    useWhen: [
      'we have thousands of independent stateful entities and locking is a nightmare',
      'each connection or session has its own state and lifecycle',
      'we want failures of one entity not to affect others',
      'shared state between our components keeps causing races',
    ],
    prompt:
      'Model this system as message-passing entities. Define the actors from the domain — one per independent stateful thing rather than one per component — the messages each accepts, and its private state. Then address the consequences that determine whether this works: everything becomes asynchronous so request-response requires correlation and timeouts, mailboxes are queues that need bounds, and a message accepted does not mean processed. Specify supervision: what happens when an actor fails, whether its state is recoverable, and who restarts it. Finish with the state durability question, since actor state held only in memory disappears on a crash.',
    why:
      'Mailbox bounds and the accepted-versus-processed distinction are where actor systems fail operationally, and supervision is the part that makes failures survivable.',
    watchOut:
      'Actors serialise per entity, so a single hot actor becomes a bottleneck no amount of parallelism fixes. Model granularity accordingly.',
    related: ['shared-nothing-design', 'csp-channels', 'producer-consumer-queue', 'graceful-degradation'],
    tags: ['concurrency', 'architecture', 'message passing', 'state'],
  },

  {
    id: 'csp-channels',
    name: 'Channels and CSP',
    aka: ['communicating sequential processes', 'share memory by communicating'],
    origin: 'Tony Hoare, 1978; popularised in Go',
    domains: ['engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Independent sequential processes coordinate by passing values over channels, where the handoff itself provides the synchronisation.',
    useWhen: [
      'coordinating these goroutines with mutexes is getting confusing',
      'I do not know whether this channel should be buffered',
      'the program hangs and I cannot tell which side is waiting',
      'we leak workers that are blocked sending to a channel nobody reads',
    ],
    prompt:
      'Design the channel topology for this concurrent code. For each channel, specify direction, whether it is buffered and why that buffer size, and — most importantly — who closes it and when, since closing is where these designs go wrong: closing a channel with multiple senders panics, and never closing leaks every receiver. Then trace every blocking operation and identify what guarantees it will not block forever, including the case where the consumer has abandoned the work. Recommend cancellation via a context or done channel on every blocking operation. Finish with the deadlock analysis: any cycle of blocking dependencies among these processes.',
    why:
      'Ownership of channel closing and unbounded blocking on abandoned work are the two specific bugs that make channel code leak, and they are invisible in the happy path.',
    watchOut:
      'Buffered channels hide backpressure and turn a coordination problem into a memory one. Prefer unbuffered until you have a reason.',
    related: ['actor-model', 'cancellation-propagation', 'producer-consumer-queue', 'structured-concurrency'],
    tags: ['concurrency', 'channels', 'coordination', 'go'],
  },

  {
    id: 'structured-concurrency',
    name: 'Structured Concurrency',
    aka: ['nurseries', 'scoped tasks', 'no orphan tasks'],
    origin: 'Martin Sústrik and Nathaniel Smith, 2018; adopted in several languages',
    domains: ['engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Concurrent tasks live within a lexical scope that cannot exit until they complete, so no task outlives the code that started it or loses its errors.',
    useWhen: [
      'a background task threw an exception and nobody ever saw it',
      'we start tasks and have no idea whether they finished',
      'cancelling an operation leaves work running in the background',
      'a request completed but its spawned work is still consuming resources',
    ],
    prompt:
      'Restructure this concurrent code so every task has an owning scope. Identify each place we start work without keeping a handle on it — the fire-and-forget calls — and state what happens today to its errors, its cancellation and its resources. Then propose the scoped structure where the parent waits for all children and collects their outcomes, so an error in any child surfaces rather than vanishing. Specify the failure policy: whether the first failure cancels the siblings or all are awaited and errors aggregated. Finish with the genuinely long-lived background work that should not be scoped to a request, and where its ownership belongs instead.',
    why:
      'Fire-and-forget tasks silently swallow errors and outlive their context, and enumerating them with their current error behaviour is what makes the problem visible.',
    watchOut:
      'Not all work should be scoped to the request that triggered it. Genuinely asynchronous work needs an owner with a longer life, not a detached task.',
    related: ['cancellation-propagation', 'csp-channels', 'graceful-shutdown', 'async-await-pitfalls'],
    tags: ['concurrency', 'structure', 'error handling', 'lifecycle'],
  },

  {
    id: 'cancellation-propagation',
    name: 'Cancellation Propagation',
    aka: ['context cancellation', 'cooperative cancellation', 'abort signals'],
    origin: 'Concurrent programming practice; Go contexts and cancellation tokens',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Cancellation is cooperative: work stops only if every layer checks and passes the signal along, so an unpropagated cancellation means the work continues invisibly.',
    useWhen: [
      'the user navigated away and the server kept processing',
      'a timed-out request still holds a database connection',
      'cancelling the operation does nothing until it finishes anyway',
      'we waste capacity on work whose result is discarded',
    ],
    prompt:
      'Trace cancellation through this call path. Identify every function that should accept and honour a cancellation signal and every place the chain is currently broken — a helper that does not take one, a library call with no cancellation support, a queue handoff that loses it, or a loop that never checks. Then specify what each layer does on cancellation: stop early, release resources, and importantly whether partial work is rolled back or left. Cover the operations that cannot be cancelled once started, such as a committed write or a sent message, and say where the point of no return is so callers know what cancelling actually guarantees.',
    why:
      'Naming the point of no return is what makes cancellation semantics honest, and the broken-chain audit finds the layers that quietly ignore the signal.',
    watchOut:
      'Cancellation that leaves partial state is worse than no cancellation. If the operation is not atomic, cancelling mid-way needs a defined cleanup.',
    related: ['structured-concurrency', 'deadline-propagation', 'timeout-budgets', 'graceful-shutdown'],
    tags: ['concurrency', 'cancellation', 'resources', 'correctness'],
  },

  {
    id: 'async-io-model',
    name: 'Asynchronous I/O',
    aka: ['non-blocking IO', 'event-driven concurrency', 'reactor pattern'],
    origin: 'Operating systems event notification; popularised by Node.js and epoll-based servers',
    domains: ['engineering'],
    intents: ['explain', 'decide'],
    oneLiner:
      'Instead of a thread per waiting operation, register interest and be notified when ready — high concurrency for waiting workloads with a different set of hazards.',
    useWhen: [
      'we need to hold many thousands of connections open',
      'threads are mostly blocked waiting on the network',
      'memory is consumed by thread stacks doing nothing',
      'someone proposed rewriting to be non-blocking and I need to weigh it',
    ],
    prompt:
      'Assess the concurrency model for this workload. Compare thread-per-request against event-driven on the numbers: memory per unit of concurrency, context switching cost at our connection count, and where each model breaks. Then state the hazards of going event-driven honestly — any blocking call or long computation stalls everything on that loop, stack traces become harder to read, and every library in the path must also be non-blocking. Audit our dependencies for blocking calls. Finish with the middle option: lightweight threads if our platform offers them, which give the same scaling with sequential-looking code.',
    why:
      'Lightweight threads make the classic trade obsolete on several platforms, and auditing dependencies for blocking calls is the step that predicts whether a migration will actually work.',
    watchOut:
      'One blocking call inside an event loop degrades every connection on it, and the symptom is diffuse latency rather than an obvious error.',
    related: ['event-loop-blocking', 'green-threads', 'thread-pool-sizing', 'cpu-vs-io-bound'],
    tags: ['concurrency', 'io', 'architecture', 'scaling'],
  },

  {
    id: 'event-loop-blocking',
    name: 'Event Loop Blocking',
    aka: ['blocking the loop', 'starving the reactor', 'long task on the main thread'],
    origin: 'Event-driven runtime practice; Node.js and browser main-thread guidance',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'In a single-threaded event loop, any synchronous work delays every other pending operation — so a CPU-heavy function becomes a service-wide latency spike.',
    useWhen: [
      'latency spikes across all requests at the same moment',
      'the interface freezes while processing a large response',
      'one endpoint makes every other endpoint slow',
      'health checks time out while the process is busy',
    ],
    prompt:
      'Find what blocks the loop in this code. Look for the specific offenders: synchronous file or crypto calls, large JSON parsing and serialisation, regular expressions with catastrophic backtracking, big array operations, and tight loops over large collections. Instrument to measure loop delay rather than inferring it, and say how. Then give the remedies per case: move computation to a worker, chunk long loops so control returns between slices, stream rather than parse whole payloads, and cap input sizes so a large request cannot monopolise the process. Finish with the guardrail — a loop-delay metric with an alert, since this degrades silently.',
    why:
      'Loop delay is the direct measurement of this problem and is rarely instrumented, so teams diagnose it as a mysterious global latency issue instead.',
    watchOut:
      'Input size limits are the most effective fix and the most often missing. Any parsing cost proportional to attacker-controlled input is a denial-of-service vector.',
    related: ['async-io-model', 'work-stealing', 'tail-latency', 'input-validation-boundary'],
    tags: ['concurrency', 'latency', 'event loop', 'diagnosis'],
  },

  {
    id: 'async-await-pitfalls',
    name: 'Async/Await Pitfalls',
    aka: ['unawaited promises', 'sync over async', 'accidental serialisation'],
    origin: 'Practice across languages with async syntax; C# and JavaScript especially',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Asynchronous syntax hides real behaviour: forgotten awaits swallow errors, sequential awaits serialise independent work, and blocking on async code deadlocks.',
    useWhen: [
      'three independent calls take the sum of their durations',
      'an error disappeared and we only found out from a customer',
      'the code deadlocks when we call it from a synchronous method',
      'an exception surfaced as an unhandled rejection with no stack',
    ],
    prompt:
      'Review this asynchronous code for the standard defects. Find independent operations awaited one after another that should run concurrently, and show the corrected version with the latency saved. Find calls whose result is never awaited, and state what happens to their errors and their completion ordering. Find any place synchronous code blocks on an asynchronous result, which deadlocks on some runtimes and wastes a thread on all. Then check loops that await inside an iteration, which serialise everything and are the most common cause of slow batch processing. Finish with concurrency limits, since converting a serial loop to fully parallel can overwhelm a downstream service.',
    why:
      'The await-inside-a-loop serialisation is the highest-value finding and looks completely idiomatic, and the fix needs a concurrency cap or it swaps a slow bug for an outage.',
    watchOut:
      'Making everything concurrent removes the implicit rate limiting that sequential code provided. Add an explicit limit when you parallelise a loop.',
    related: ['structured-concurrency', 'semaphore-limiting', 'cancellation-propagation', 'event-loop-blocking'],
    tags: ['concurrency', 'async', 'bugs', 'code review'],
  },

  {
    id: 'green-threads',
    name: 'Lightweight Threads',
    aka: ['virtual threads', 'goroutines', 'coroutines', 'fibers'],
    origin: 'Long history; recent mainstream revival via Go and Java virtual threads',
    domains: ['engineering'],
    intents: ['explain', 'decide'],
    oneLiner:
      'Runtime-scheduled threads cheap enough to have millions of, letting you write blocking sequential code that scales like an event loop.',
    useWhen: [
      'we want high concurrency without rewriting everything as callbacks',
      'thread stacks consume all our memory',
      'the async version of our code is much harder to read',
      'someone is asking whether we should adopt virtual threads',
    ],
    prompt:
      'Evaluate lightweight threads for this workload. Explain how they achieve high concurrency — many of them multiplexed onto few carrier threads, with blocking operations yielding rather than occupying a carrier — and therefore what makes them fail: operations that block the carrier without yielding, such as native calls, synchronised sections in some runtimes, and CPU-bound loops. Audit our code and dependencies for those. Then address pooling, since pooling lightweight threads is counterproductive and existing pool-based code needs restructuring, and thread-local state, which becomes memory per task rather than per pool thread.',
    why:
      'The carrier-pinning cases and the now-harmful thread pooling are the two things that make migrations disappointing, and both are specific and checkable.',
    watchOut:
      'Cheap threads remove the implicit concurrency limit a pool provided. Downstream services that coped because you had two hundred threads will now receive twenty thousand requests.',
    related: ['async-io-model', 'thread-pool-sizing', 'semaphore-limiting', 'structured-concurrency'],
    tags: ['concurrency', 'runtime', 'scaling', 'threads'],
  },

  {
    id: 'thread-safety-contracts',
    name: 'Thread-Safety Contracts',
    aka: ['documenting thread safety', 'confinement policy', 'is this class safe'],
    origin: 'Brian Goetz, Java Concurrency in Practice, 2006',
    domains: ['engineering'],
    intents: ['communicate', 'structure'],
    oneLiner:
      'Every class shared between threads has a synchronisation policy — write it down, because a caller cannot infer it and will guess wrong.',
    useWhen: [
      'I do not know whether it is safe to share this object between threads',
      'someone used a library class concurrently and it corrupted state',
      'the class is safe for some methods and not others and nobody documented it',
      'we added a field and quietly broke a class that was thread-safe',
    ],
    prompt:
      'Document the synchronisation policy for these classes. For each, state the category explicitly — immutable, thread-safe, conditionally thread-safe with the caller responsible for compound operations, or not safe and confined to one thread — and for the safe ones name what guards each mutable field. The conditionally-safe category is the one that causes bugs, so make it explicit where a caller must add external synchronisation for a sequence of calls. Then audit our usage against the documented policy and flag violations. Finish with the classes that should simply be made immutable instead, which usually removes the question entirely.',
    why:
      'Conditionally thread-safe classes are used incorrectly because the contract is invisible, and making callers responsible for compound operations explicit is what prevents it.',
    watchOut:
      'A thread-safe collection does not make a sequence of operations on it atomic. Iterate-then-modify is still a race regardless of the collection\'s guarantees.',
    related: ['immutability-by-default', 'race-condition-diagnosis', 'memory-visibility', 'liskov-substitution'],
    tags: ['concurrency', 'documentation', 'contracts', 'api design'],
  },

  {
    id: 'concurrency-testing',
    name: 'Concurrency Testing',
    aka: ['stress testing for races', 'interleaving exploration', 'race detectors'],
    origin: 'Concurrent testing research; tools such as ThreadSanitizer and Lincheck',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Ordinary tests exercise one interleaving out of many, so concurrency bugs need techniques that deliberately explore or force the unlikely orderings.',
    useWhen: [
      'the race only shows up in production once a week',
      'our tests pass consistently and the bug is definitely there',
      'we cannot reproduce it locally no matter how many times we run',
      'the fix seems to work but I cannot prove it',
    ],
    prompt:
      'Design tests that can actually catch this concurrency defect. Combine the techniques rather than picking one: run under a race detector to catch unsynchronised access on executed paths, use stress tests with many threads and randomised delays inserted at the suspect points to widen the window, and where the state is small, use a systematic checker that explores interleavings exhaustively. Then make the failing case deterministic once found, by injecting a barrier or a controllable scheduling point so the test reliably reproduces it. Finish by stating which interleavings each technique cannot reach, so we know what remains unverified.',
    why:
      'Turning a probabilistic failure into a deterministic one with injected scheduling points is what makes a concurrency fix verifiable rather than hopeful.',
    watchOut:
      'Passing stress tests prove very little. Absence of failure under randomised scheduling is weak evidence compared with a systematic check or a proof of confinement.',
    related: ['data-race-diagnosis', 'deterministic-simulation-testing', 'race-condition-diagnosis', 'flaky-test-quarantine'],
    tags: ['concurrency', 'testing', 'races', 'verification'],
  },

  {
    id: 'deterministic-simulation-testing',
    name: 'Deterministic Simulation Testing',
    aka: ['simulation testing', 'FoundationDB-style testing', 'controlled scheduling'],
    origin: 'FoundationDB, 2012; adopted by several distributed database teams',
    domains: ['engineering'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Run the whole system on a simulated clock, network and scheduler seeded by a random number, so any bug found can be replayed exactly.',
    useWhen: [
      'our distributed bugs are impossible to reproduce',
      'we find correctness problems only under real production conditions',
      'each rare failure takes days to investigate and cannot be re-run',
      'we want confidence in failure handling we cannot get from unit tests',
    ],
    prompt:
      'Assess deterministic simulation for this system and be honest about the investment. The prerequisite is that all sources of nondeterminism go through injectable interfaces — clock, network, disk, scheduling, randomness — so start by auditing where our code touches those directly, since that refactor is most of the cost. Then describe the simulation: fault injection of message loss, reordering, delays, partitions and process crashes, all driven by a seed that makes any failure replayable. Specify the invariants checked continuously during the run, since a simulation without assertions only proves it did not crash. Finish with a smaller intermediate step worth taking if full simulation is too much.',
    why:
      'Exact replayability from a seed is what makes rare distributed bugs tractable, and the continuously-checked invariants are what convert a fuzz run into a correctness test.',
    watchOut:
      'The simulation is only as faithful as your model of the world. Bugs that depend on real hardware, real clock behaviour or real dependencies will not appear.',
    related: ['concurrency-testing', 'chaos-engineering', 'property-based-testing', 'deterministic-clock'],
    tags: ['concurrency', 'testing', 'distributed systems', 'verification'],
  },
]
