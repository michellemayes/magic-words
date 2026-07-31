import type { Concept } from '../types'

export const distributed: Concept[] = [
  {
    id: 'fallacies-of-distributed-computing',
    name: 'Fallacies of Distributed Computing',
    aka: ['eight fallacies', 'network assumptions'],
    origin: 'Peter Deutsch and James Gosling, Sun Microsystems, 1994',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'The eight assumptions every distributed system quietly makes — reliable network, zero latency, infinite bandwidth, secure, unchanging topology, one administrator, zero transport cost, homogeneous network — and each one is false.',
    useWhen: [
      'it works perfectly on my machine and falls over between services',
      'we never thought about what happens if that call just hangs',
      'the design assumes the other service is always there',
      'everything is fine until the network has a bad ten minutes',
    ],
    prompt:
      'Audit this design against the eight classic false assumptions. For each, do not just note it — find the specific line or call where we depend on it being true and state the observable failure when it is not. The network is reliable becomes what happens when this call never returns; latency is zero becomes what our page load looks like at the ninety-ninth percentile of this dependency; topology does not change becomes what happens when this host is replaced mid-request. Rank the findings by how likely the assumption is to break in our actual environment and what it costs when it does.',
    why:
      'The list is famous and rarely applied concretely. Tying each fallacy to a specific line and an observable failure turns a poster into a defect list.',
    watchOut:
      'Applied maximally this justifies infinite defensive engineering. Use it to find the handful of dependencies where failure is both likely and expensive.',
    related: ['partial-failure-handling', 'timeout-budgets', 'circuit-breaker', 'graceful-degradation'],
    tags: ['distributed systems', 'assumptions', 'failure modes', 'design review'],
  },

  {
    id: 'cap-theorem',
    name: 'CAP Theorem',
    aka: ['Brewer\'s theorem', 'consistency availability partition tolerance', 'PACELC'],
    origin: 'Eric Brewer, 2000; proved by Gilbert and Lynch, 2002; PACELC by Daniel Abadi, 2010',
    domains: ['engineering', 'data'],
    intents: ['decide', 'explain'],
    oneLiner:
      'When the network splits you must choose between refusing requests and serving possibly stale data — and the more useful question is what you trade when it has not split.',
    useWhen: [
      'we cannot decide whether to keep serving during a network problem',
      'the two regions disagreed and we do not know which one was right',
      'someone says our database is highly available and I do not know what that costs',
      'the read replica served old data and a customer noticed',
    ],
    prompt:
      'Apply this trade-off to our system, per operation rather than globally, because a single system-wide answer is always wrong. For each significant operation, state what should happen during a partition — refuse, serve stale, or accept writes that may conflict — and justify from the business consequence, not from a preference for consistency. Then extend to the normal case with no partition, where the real trade is latency against consistency, and say which operations may read from a replica. Finish by naming, for each stale-tolerant operation, the maximum staleness the business would accept and how we would know if we exceeded it.',
    why:
      'The theorem gets used as a label for a database rather than a per-operation design decision. Forcing the operation-level table and the staleness budget is what makes it actionable.',
    watchOut:
      'Partitions are rarer than slow networks. The everyday version of this trade is latency versus consistency, which the classic framing does not cover.',
    related: ['eventual-consistency', 'quorum-consistency', 'read-your-writes', 'multi-region-failover'],
    tags: ['distributed systems', 'consistency', 'availability', 'trade-offs'],
  },

  {
    id: 'eventual-consistency',
    name: 'Eventual Consistency',
    aka: ['convergence', 'BASE', 'weak consistency'],
    origin: 'Werner Vogels, Amazon Dynamo lineage, 2007',
    domains: ['engineering', 'data'],
    intents: ['explain', 'decide'],
    oneLiner:
      'Replicas converge to the same value if updates stop — which means correctness has to be defined in terms of what a user may observe during the window before they do.',
    useWhen: [
      'the user updated their profile and it still shows the old name',
      'two services report different totals for the same thing',
      'the count is off by a few for a while and then corrects itself',
      'support keeps getting tickets about data that fixes itself',
    ],
    prompt:
      'Specify the consistency behaviour our users will actually experience. For each read path, state what anomaly is possible — reading your own stale write, seeing updates out of order, two users seeing different values simultaneously, a total that does not match its parts — and whether that anomaly is acceptable, with the business reason. Then design around the unacceptable ones with the cheapest available mechanism rather than a global upgrade: sticky routing, read-after-write from the primary, client-side echo of the pending change, or a version token. Finally, define the convergence time we promise and how it is measured.',
    why:
      'Teams adopt this and then treat every symptom as a bug. Enumerating the specific anomalies and deciding acceptability per read path is what makes it a design rather than a surprise.',
    watchOut:
      'Convergence assumes updates stop and conflicts resolve. If two writers can update the same field concurrently, you also need a merge rule, and last-write-wins silently loses data.',
    related: ['cap-theorem', 'read-your-writes', 'crdt', 'compensating-transactions'],
    tags: ['distributed systems', 'consistency', 'replication', 'user experience'],
  },

  {
    id: 'read-your-writes',
    name: 'Read-Your-Writes Consistency',
    aka: ['session consistency', 'monotonic reads', 'sticky reads'],
    origin: 'Session guarantees literature; Terry and colleagues, 1994',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Guarantee that a user always sees at least their own most recent change, which is the specific weak-consistency promise that makes an interface feel correct.',
    useWhen: [
      'I saved the form and the next page showed the old value',
      'the item I just created does not appear in the list',
      'refreshing twice shows different answers',
      'it only happens sometimes depending on which server you hit',
    ],
    prompt:
      'Diagnose and fix this stale-read symptom. First confirm the mechanism: replica lag, a cache, a search index, or a CDN — each has a different fix and they are routinely confused. Then choose the guarantee mechanism: route this session to the primary for a bounded window, pass a version or log position the read must wait for, or have the client merge its own pending write into what it displays. Compare those on load impact and complexity for our case. Also cover the neighbouring guarantee, monotonic reads, so a second refresh never goes backwards, since fixing only the first symptom leaves that one visible.',
    why:
      'People reach for full strong consistency when a session-scoped guarantee is enough and far cheaper. Naming the mechanisms and the sibling guarantee gets the right size of fix.',
    watchOut:
      'Pinning sessions to the primary undoes the point of replicas if the window is generous. Bound it by lag measurement rather than a fixed guess.',
    related: ['eventual-consistency', 'cache-invalidation-strategy', 'session-affinity', 'cap-theorem'],
    tags: ['distributed systems', 'consistency', 'caching', 'replication'],
  },

  {
    id: 'idempotency-keys',
    name: 'Idempotency Keys',
    aka: ['request deduplication', 'safe retries', 'exactly-once effects'],
    origin: 'Payments API practice; Stripe\'s implementation is the reference',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Let the caller supply a unique key so a retried request is recognised as the same request, turning an unreliable network into a safe one for writes.',
    useWhen: [
      'the customer got charged twice because they clicked twice',
      'our retry created a duplicate record',
      'the timeout fired but the operation had actually succeeded',
      'the webhook arrived three times and we processed all three',
    ],
    prompt:
      'Design safe retries for this write operation. Specify who generates the key and from what — a client-supplied identifier, or a hash of the meaningful request content — and be explicit that hashing must exclude fields like timestamps that vary between identical retries. Then handle the concurrency case properly: two identical requests arriving at once, where the second must wait for or reflect the first rather than both proceeding. State how long keys are retained, what happens when the same key arrives with a different body, and whether the stored response is replayed or the operation is re-executed. Finish with the failure case where the operation partially completed.',
    why:
      'Most implementations handle the sequential retry and break on the concurrent one. Making concurrency and key-reuse-with-different-body explicit is what produces a correct design.',
    watchOut:
      'This gives idempotent effects, not exactly-once delivery, which does not exist. Downstream systems still need their own protection.',
    related: ['delivery-semantics', 'retry-with-backoff', 'transactional-outbox', 'state-transition-testing'],
    tags: ['distributed systems', 'retries', 'duplicates', 'api design'],
  },

  {
    id: 'delivery-semantics',
    name: 'Delivery Semantics',
    aka: ['at-least-once', 'at-most-once', 'exactly-once processing'],
    origin: 'Messaging systems literature; sharpened by Kafka and Flink design discussions',
    domains: ['engineering'],
    intents: ['decide', 'explain'],
    oneLiner:
      'Choose between possibly losing a message and possibly processing it twice, and know that exactly-once is only ever achieved by making duplicate processing harmless.',
    useWhen: [
      'the queue redelivered a message and we did the work again',
      'a message vanished during a restart and nobody noticed',
      'the vendor promises exactly-once and I do not believe it',
      'I do not know whether to acknowledge before or after processing',
    ],
    prompt:
      'Determine the delivery guarantee this consumer needs and what it currently has. Trace the acknowledgement point precisely — before processing gives at-most-once and loses messages on crash, after gives at-least-once and duplicates on crash — and say which our code does today, including on the paths where an exception is caught. Then, since at-least-once is almost always the right choice, design the deduplication or idempotent effect that makes redelivery harmless, naming the specific side effects that are not naturally repeatable, such as sending email or charging a card. Finish with what happens to a message that fails permanently.',
    why:
      'The acknowledgement point is the whole guarantee and it is usually implicit in a framework default. Making the model locate it in our code is what reveals the actual semantics.',
    watchOut:
      'Broker-level exactly-once covers the broker\'s own state, not your side effects. If processing calls an external API, the guarantee stops at the boundary.',
    related: ['idempotency-keys', 'dead-letter-queue', 'transactional-outbox', 'message-ordering-guarantees'],
    tags: ['distributed systems', 'messaging', 'queues', 'reliability'],
  },

  {
    id: 'transactional-outbox',
    name: 'Transactional Outbox',
    aka: ['outbox pattern', 'reliable event publishing', 'dual write problem'],
    origin: 'Chris Richardson, microservices patterns; widely used with change data capture',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Write the event into the same database transaction as the state change and publish it from there, instead of writing to the database and the broker separately and hoping both succeed.',
    useWhen: [
      'we saved the order but the event never got published',
      'the message went out and then the transaction rolled back',
      'downstream systems are missing some records and we cannot explain it',
      'we publish then commit and it usually works',
    ],
    prompt:
      'Fix this dual-write with an outbox. Show the table, the write inside the existing transaction, and the relay that publishes and marks rows sent. Then cover the details that decide whether it works: ordering guarantees if events for one entity must stay in order, the at-least-once nature of the relay and therefore the need for consumer-side deduplication, what happens if the relay crashes between publishing and marking, and how the table is pruned so it does not grow forever. Compare against change data capture reading the transaction log directly, and say which suits us given our operational appetite.',
    why:
      'The concept is simple; the relay crash window, ordering and pruning are where implementations break. Requiring them up front produces something that survives production.',
    watchOut:
      'The outbox adds write load and a background process to operate. For a system where a lost event is merely annoying, a simpler retry may be enough.',
    related: ['delivery-semantics', 'domain-events', 'idempotency-keys', 'change-data-capture'],
    tags: ['distributed systems', 'messaging', 'consistency', 'events'],
  },

  {
    id: 'dead-letter-queue',
    name: 'Dead Letter Queue',
    aka: ['DLQ', 'poison message handling', 'parking lot queue'],
    origin: 'Enterprise messaging practice; IBM MQ lineage',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Move messages that repeatedly fail into a separate queue so one bad record cannot block the stream, and so failures become a visible, workable list.',
    useWhen: [
      'one malformed message is blocking the whole queue',
      'the consumer crashes on the same record forever',
      'we found ten thousand failed messages nobody had looked at',
      'a bad deploy poisoned the stream and we had to purge everything',
    ],
    prompt:
      'Design failure handling for this consumer. Distinguish the three failure classes and treat them differently: transient (retry with backoff), poison (this message will never succeed, park it), and systemic (everything is failing, so stop consuming rather than draining the whole queue into the dead letter store). That third case is the one most designs miss — specify the detection rule and the circuit that halts consumption. Then define what a parked message carries so it can be diagnosed and replayed, who is alerted, the alert threshold, and the replay procedure including how to avoid re-parking the same message forever.',
    why:
      'A dead letter queue with no owner is a silent data loss mechanism. Separating systemic failure from poison messages, and specifying the alert and replay path, is what makes it a safety net.',
    watchOut:
      'Parked messages are unprocessed work with a business meaning. If they represent orders or payments, an unattended queue is a customer-facing outage nobody has noticed.',
    related: ['delivery-semantics', 'retry-with-backoff', 'circuit-breaker', 'alert-fatigue'],
    tags: ['distributed systems', 'messaging', 'error handling', 'operations'],
  },

  {
    id: 'message-ordering-guarantees',
    name: 'Message Ordering Guarantees',
    aka: ['partition ordering', 'ordered delivery', 'per-key ordering'],
    origin: 'Log-based messaging design; Kafka partitioning model',
    domains: ['engineering'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Global ordering is expensive and rarely needed; per-key ordering with a well-chosen partition key gives correctness plus parallelism.',
    useWhen: [
      'the update was applied before the create and the record broke',
      'events for one customer arrive out of order',
      'we made it single-threaded to keep order and now it is too slow',
      'a retry pushed one message behind a later one',
    ],
    prompt:
      'Determine what ordering this stream actually requires. Identify the entity whose events must be ordered relative to each other, and check whether the current partition key matches it — a mismatch here is the usual root cause. Then design for the cases ordering alone will not save you: a retry that reorders relative to newer messages, a consumer restart that reprocesses, and a rebalance that moves a partition mid-flight. Recommend making handlers order-insensitive where possible using version numbers or last-write-wins on a timestamp the producer sets, since that is more robust than relying on transport ordering.',
    why:
      'Transport-level ordering is fragile under retries and rebalances. Pushing toward version-carrying, order-insensitive handlers is the design that actually holds.',
    watchOut:
      'A partition key with skew — one enormous customer — serialises most of your traffic behind one consumer. Check key distribution before committing to it.',
    related: ['delivery-semantics', 'logical-clocks', 'idempotency-keys', 'partitioning-strategy'],
    tags: ['distributed systems', 'messaging', 'ordering', 'partitioning'],
  },

  {
    id: 'event-driven-choreography',
    name: 'Choreography vs Orchestration',
    aka: ['event choreography', 'central coordinator', 'process manager'],
    origin: 'Service-oriented architecture literature; sharpened in microservices practice',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Decide whether a multi-service process is driven by each service reacting to events, or by one coordinator that knows the whole flow and calls each step.',
    useWhen: [
      'nobody can draw the end-to-end flow of our checkout',
      'a step failed halfway and we do not know what state we are in',
      'adding a step means changing three services that publish events',
      'the process is implicit in a chain of subscriptions',
    ],
    prompt:
      'Choose between event choreography and a central coordinator for this process, and decide with these criteria rather than preference: how many people need to understand the whole flow, whether we need to answer where is this order right now, how failure compensation is triggered, and how a new step is added. Show the same process both ways, then recommend one. Whichever you pick, specify the observability requirement — with choreography, the flow exists nowhere, so say what tracing or process log makes it visible; with a coordinator, say what stops it becoming a monolith that owns all the logic.',
    why:
      'The choice is usually made by architectural fashion. Anchoring it to where-is-my-order and how-compensation-fires makes it a decision about operability.',
    watchOut:
      'Choreography looks decoupled and creates a hidden coupling in event schemas plus a process nobody can see. Its cost lands on operations, not development.',
    related: ['saga-pattern', 'workflow-orchestration', 'domain-events', 'distributed-tracing'],
    tags: ['distributed systems', 'workflow', 'events', 'coordination'],
  },

  {
    id: 'workflow-orchestration',
    name: 'Durable Workflow Orchestration',
    aka: ['process manager', 'durable execution', 'state machine engine'],
    origin: 'Workflow engines; Temporal, Cadence and AWS Step Functions lineage',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Run long-lived multi-step processes on an engine that persists progress, so a crash resumes where it left off instead of losing the process.',
    useWhen: [
      'the multi-step job died halfway and we had to fix it by hand',
      'this process takes three days and lives in cron jobs and database flags',
      'retrying the whole thing would re-send the emails',
      'nobody can tell which step a given case is stuck on',
    ],
    prompt:
      'Model this long-running process as a durable workflow. Separate the deterministic coordination logic from the side-effecting steps, and be strict about it: the coordinator may not read the clock, generate randomness, or call services directly, because replay-based recovery requires determinism. List every place our current code would violate that. Then define each step\'s retry policy, timeout and compensation, the human-intervention points, and how a workflow is queried for its current position. Finish with versioning: what happens to processes already running when the definition changes, since that is the operational cliff.',
    why:
      'Determinism constraints and in-flight versioning are the two things that break workflow adoption, and both are invisible until you are committed.',
    watchOut:
      'These engines are significant operational dependencies. For a process with three steps and a short lifetime, a state column and a retry loop is less to run.',
    related: ['saga-pattern', 'event-driven-choreography', 'compensating-transactions', 'idempotency-keys'],
    tags: ['distributed systems', 'workflow', 'reliability', 'long-running processes'],
  },

  {
    id: 'retry-with-backoff',
    name: 'Exponential Backoff with Jitter',
    aka: ['retry policy', 'backoff and jitter', 'retry storms'],
    origin: 'Ethernet collision backoff; AWS Architecture Blog on jitter, 2015',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Space retries out exponentially and randomise the delay, so a struggling dependency is not hit by every client at the same synchronised moment.',
    useWhen: [
      'the service recovered and immediately fell over again',
      'everything retried at once and made the outage worse',
      'we retry three times in a tight loop and call that resilience',
      'a brief blip turned into a twenty minute incident',
    ],
    prompt:
      'Design the retry policy for this dependency. Start with what must not be retried: anything non-idempotent without a deduplication key, and any error class where retrying cannot help — authentication failures, validation errors, not-found. Then set base delay, multiplier, jitter and maximum attempts, and derive them from the caller\'s own deadline rather than picking round numbers, showing the arithmetic. Add the two multiplication traps: retries at several layers of the stack compounding into hundreds of attempts, and a retry budget that caps total retries across the client rather than per request. Finish with what the caller does when retries are exhausted.',
    why:
      'Retry policies are usually copied without checking the layer interaction, which is how three layers of triple-retry becomes twenty-seven attempts. Deriving from the deadline and adding a budget prevents it.',
    watchOut:
      'Retrying into a saturated dependency is how brownouts become outages. Retries need to be paired with a circuit breaker or a budget, not used alone.',
    related: ['circuit-breaker', 'timeout-budgets', 'thundering-herd', 'idempotency-keys'],
    tags: ['distributed systems', 'resilience', 'retries', 'failure handling'],
  },

  {
    id: 'thundering-herd',
    name: 'Thundering Herd',
    aka: ['cache stampede', 'dogpile effect', 'synchronised load spike'],
    origin: 'Operating systems scheduling term; adapted to caching and web practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'When many clients wake or expire at the same instant, the correlated burst can be far larger than the steady load the system was sized for.',
    useWhen: [
      'the database melts every hour exactly on the hour',
      'when the cache entry expires a thousand requests hit the origin',
      'after a restart everything reconnects simultaneously and dies',
      'load is fine on average but has enormous spikes at regular intervals',
    ],
    prompt:
      'Find the synchronisation in this load pattern. Look for every source of correlated timing — cache entries created together and therefore expiring together, cron jobs on the hour, clients reconnecting after a deploy, tokens with identical lifetimes, and retry timers without randomisation — and for each, state the burst size relative to steady state. Then apply the fixes per source: randomised expiry spread, single-flight so one request populates a cache while others wait, serving stale while refreshing in the background, and startup jitter. Say which of these change correctness or freshness guarantees and by how much.',
    why:
      'People treat these spikes as a capacity problem and buy more machines. Identifying the specific correlation source is what turns it into a small code change.',
    watchOut:
      'Serving stale content during refresh has a business meaning. Confirm the staleness is acceptable before adopting it as a load-shedding mechanism.',
    related: ['retry-with-backoff', 'request-coalescing', 'cache-invalidation-strategy', 'load-shedding'],
    tags: ['distributed systems', 'load', 'caching', 'performance'],
  },

  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    aka: ['fail fast breaker', 'trip switch', 'half-open state'],
    origin: 'Michael Nygard, Release It!, 2007',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Stop calling a dependency that is clearly failing, fail fast instead, and probe occasionally to see whether it has recovered.',
    useWhen: [
      'one slow dependency took down our whole service',
      'all our threads are stuck waiting on a service that is down',
      'we keep hammering a system that is obviously struggling',
      'the timeout is thirty seconds and users wait the full thirty',
    ],
    prompt:
      'Design a breaker for this dependency. Specify the trip condition using a rate over a window rather than a raw count, and be precise about which failures count — timeouts and connection errors yes, business-level rejections no, since counting the latter trips the breaker during normal operation. Define the open duration, the half-open probe policy including how many requests are admitted and what happens if the probe fails, and the granularity: per host, per endpoint or per dependency, because the wrong granularity either trips constantly or never. Then specify what callers do while it is open, since fail-fast is only useful if there is a fallback or a clear error.',
    why:
      'Breakers that count the wrong errors or sit at the wrong granularity are the common failure, and both are invisible until an incident. Making them explicit is the design.',
    watchOut:
      'A breaker converts a slow failure into a fast one; it does not make the feature work. Without a fallback you have improved your latency graph and not your users\' experience.',
    related: ['retry-with-backoff', 'bulkhead-isolation', 'timeout-budgets', 'graceful-degradation'],
    tags: ['distributed systems', 'resilience', 'failure isolation', 'dependencies'],
  },

  {
    id: 'bulkhead-isolation',
    name: 'Bulkhead Isolation',
    aka: ['resource partitioning', 'thread pool isolation', 'blast compartment'],
    origin: 'Michael Nygard, Release It!, 2007; naval architecture metaphor',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Partition resources so that one failing consumer, tenant or dependency exhausts only its own share and the rest of the system stays up.',
    useWhen: [
      'one customer\'s huge job consumed every worker',
      'a slow third-party call starved the connection pool',
      'the reporting queries took down the transactional path',
      'one bad tenant degraded service for everyone',
    ],
    prompt:
      'Design resource partitioning for this system. Find the shared resources that create the coupling first — thread pools, connection pools, memory, queue consumers, rate limit allowances — and for each identify the noisy neighbour that could exhaust it. Then propose the partition boundary, choosing between per-dependency, per-tenant and per-workload, and size each partition including the reserve for the critical path. State what happens when a partition is exhausted: queue, shed or degrade. Finish with the cost, which is utilisation — partitioned resources are idle when their partition is quiet — and say whether that is acceptable here.',
    why:
      'The utilisation cost is the reason this gets rejected, so pricing it explicitly alongside the isolation benefit is what makes the decision honest.',
    watchOut:
      'Too many small partitions make the system inefficient and hard to size. Partition along the dimension where failures actually correlate, not on every dimension.',
    related: ['circuit-breaker', 'cell-based-architecture', 'rate-limiting-algorithms', 'load-shedding'],
    tags: ['distributed systems', 'isolation', 'resilience', 'multi-tenancy'],
  },

  {
    id: 'backpressure',
    name: 'Backpressure',
    aka: ['flow control', 'pushback', 'bounded queues'],
    origin: 'Reactive Streams specification; long-standing in networking',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Let a slow consumer tell its producer to slow down, instead of buffering the difference until memory or latency collapses.',
    useWhen: [
      'the queue grows without limit until the process runs out of memory',
      'the producer is faster than the consumer and nothing pushes back',
      'latency creeps up for hours and then everything falls over',
      'we added a bigger buffer and the problem got worse later',
    ],
    prompt:
      'Add flow control to this pipeline. Find every unbounded buffer — explicit queues, channels, in-memory lists, connection backlogs, and the implicit buffering in async frameworks — and give each a bound derived from the latency we are willing to accept, showing the arithmetic from throughput and queue depth. Then choose the behaviour when a bound is reached: block the producer, drop oldest, drop newest, or reject with an error, and justify per stage. Explain how the signal propagates all the way to the original client, because backpressure that stops at an internal boundary just moves the unbounded buffer upstream.',
    why:
      'Sizing queues by latency budget rather than by memory is the move that makes them meaningful, and end-to-end propagation is what people miss.',
    watchOut:
      'A big buffer feels like resilience and is really latency you have not measured yet. Queueing theory says the queue length is the delay.',
    related: ['load-shedding', 'timeout-budgets', 'queueing-theory-basics', 'rate-limiting-algorithms'],
    tags: ['distributed systems', 'flow control', 'queues', 'stability'],
  },

  {
    id: 'rate-limiting-algorithms',
    name: 'Rate Limiting Algorithms',
    aka: ['token bucket', 'leaky bucket', 'sliding window limiter'],
    origin: 'Network traffic shaping; standard in API gateway design',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose among fixed window, sliding window, token bucket and leaky bucket by whether you need to allow bursts, smooth output, or enforce a hard ceiling.',
    useWhen: [
      'one client is hammering our API and degrading it for everyone',
      'our limiter allows double the rate at the window boundary',
      'legitimate bursty clients keep getting blocked',
      'we need to protect a downstream system with a hard capacity limit',
    ],
    prompt:
      'Design rate limiting for this API. Pick the algorithm from the requirement, and show why the alternatives fail here — fixed windows permit a double burst across the boundary, token buckets allow accumulated bursts which may be exactly right or exactly wrong, leaky buckets smooth output at the cost of queuing. Then handle the distributed problem: where the counter lives, its consistency, and what happens when that store is unavailable, since failing open defeats the limiter and failing closed causes an outage. Finish with the client contract: the response status, the retry-after header, and how a client discovers its limit before hitting it.',
    why:
      'Algorithm choice is usually copied from a blog post, and the distributed counter plus the client contract are where real implementations are weak.',
    watchOut:
      'Limiting by IP address punishes users behind shared networks and misses distributed abuse. Limit by the identity that maps to cost.',
    related: ['load-shedding', 'backpressure', 'bulkhead-isolation', 'api-quota-design'],
    tags: ['distributed systems', 'rate limiting', 'api', 'protection'],
  },

  {
    id: 'load-shedding',
    name: 'Load Shedding',
    aka: ['brownout', 'admission control', 'graceful overload'],
    origin: 'Power grid term; adopted in service reliability practice',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'When demand exceeds capacity, deliberately reject some work early so the rest completes, rather than accepting everything and failing all of it slowly.',
    useWhen: [
      'under heavy load every request times out and none succeed',
      'we accept everything and then fall over completely',
      'the system spends all its time on requests that will time out anyway',
      'a traffic spike turned into a total outage instead of a slow site',
    ],
    prompt:
      'Design overload behaviour for this service. Define the signal that says we are overloaded, preferring an internal one like queue depth or request latency over CPU, since CPU saturates late. Then define the shedding policy by priority: which traffic is dropped first, with the business ranking stated — health checks and paying customers survive, bulk exports do not. The critical detail is shedding early, before expensive work is done, so name the exact point in the request path where the decision is made. Finally, specify the client-visible behaviour and how shedding is distinguished from a failure in monitoring, since these must not look like the same thing.',
    why:
      'Shedding after the expensive work is done costs almost as much as serving. Fixing the decision point and the priority order is what turns overload into degradation instead of collapse.',
    watchOut:
      'A shedding policy that has never been exercised will not work when needed. It has to be tested under synthetic overload or it is theatre.',
    related: ['backpressure', 'rate-limiting-algorithms', 'graceful-degradation', 'capacity-planning'],
    tags: ['distributed systems', 'overload', 'reliability', 'availability'],
  },

  {
    id: 'timeout-budgets',
    name: 'Timeout Budgets',
    aka: ['latency budget', 'timeout hierarchy', 'call tree timeouts'],
    origin: 'Distributed systems operations practice; Google SRE lineage',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Derive every timeout from the end-to-end deadline the user experiences, so inner calls always give up before the outer one does.',
    useWhen: [
      'the client gave up but our servers kept working on the request',
      'our timeouts are all thirty seconds because that was the default',
      'the outer call times out before the retries even finish',
      'nobody can say what our total worst-case latency actually is',
    ],
    prompt:
      'Construct the timeout hierarchy for this request path. Start from the user-facing deadline and allocate downward, showing every hop with its share and the arithmetic — including retries, because a three-attempt retry inside a one-second budget cannot use a one-second timeout. Flag every place where an inner timeout exceeds its parent, since that is wasted work and a source of phantom load. Then cover cancellation: when the outer call gives up, what actually stops the inner work, and what continues running and consuming resources. Finish with the timeouts that are currently absent entirely, which are usually the dangerous ones.',
    why:
      'Timeouts are set independently at each layer and then contradict each other. Deriving them from one budget, and asking what actually gets cancelled, exposes the phantom load.',
    watchOut:
      'Aggressive timeouts turn slow successes into failures and can amplify load through retries. Set them from the observed latency distribution, not from a round number.',
    related: ['deadline-propagation', 'retry-with-backoff', 'circuit-breaker', 'tail-latency'],
    tags: ['distributed systems', 'latency', 'timeouts', 'resource management'],
  },

  {
    id: 'deadline-propagation',
    name: 'Deadline Propagation',
    aka: ['request deadlines', 'context cancellation', 'time budget passing'],
    origin: 'Google internal RPC practice; exposed via gRPC deadlines and context',
    domains: ['engineering'],
    intents: ['structure'],
    oneLiner:
      'Pass the absolute deadline along with the request so every downstream hop knows how much time is genuinely left and can refuse work that cannot finish in time.',
    useWhen: [
      'services keep doing work for requests the caller abandoned',
      'each service has its own timeout and the total makes no sense',
      'a cancelled request still ran an expensive database query',
      'we waste capacity on responses nobody will ever receive',
    ],
    prompt:
      'Introduce end-to-end deadlines through this call chain. Specify the representation — an absolute time rather than a remaining duration, so clock skew is the only correction needed — and how it travels across each transport we use, including queues where the message may sit before being picked up. Then define the behaviour on receipt: reject immediately if the remaining time is below the minimum needed, and cancel in-flight work when the deadline passes, naming which of our operations can actually be cancelled and which cannot. Finish with what we log when work is rejected on arrival, since that signal is how you find the real bottleneck.',
    why:
      'Deadline propagation is mostly a plumbing exercise, and its value comes from the reject-on-arrival behaviour that stops doomed work early. Naming what cannot be cancelled is the honest part.',
    watchOut:
      'Absolute deadlines depend on reasonably synchronised clocks. Where skew is significant, you need a duration plus a hop-count correction instead.',
    related: ['timeout-budgets', 'load-shedding', 'distributed-tracing', 'logical-clocks'],
    tags: ['distributed systems', 'latency', 'cancellation', 'rpc'],
  },

  {
    id: 'hedged-requests',
    name: 'Hedged Requests',
    aka: ['tied requests', 'speculative retry', 'request hedging'],
    origin: 'Jeff Dean and Luiz Barroso, The Tail at Scale, 2013',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Send a second copy of a request to another replica once the first is slower than usual, and take whichever answers first, trading a little extra load for a much better tail.',
    useWhen: [
      'most requests are fast but the slowest one percent ruins the page',
      'one slow replica drags down our overall latency',
      'the average looks fine and users still complain about waiting',
      'a garbage collection pause on one node hurts every request that hits it',
    ],
    prompt:
      'Evaluate hedging for this read path. Set the trigger at a high percentile of the observed latency distribution rather than a fixed delay, and show the extra load that implies — hedging at the ninety-fifth percentile costs about five percent more requests, which is the number that makes this decision. Then handle the safety conditions: only for idempotent operations, with cancellation of the loser so we do not pay twice downstream, and with a cap so hedging cannot amplify an overload. Model what happens when the whole system is slow rather than one replica, because that is when hedging turns a brownout into an outage.',
    why:
      'The overload interaction is the part that gets people hurt, and the load cost is directly derivable from the trigger percentile. Both are usually left implicit.',
    watchOut:
      'Hedging masks a slow replica rather than fixing it. Keep alerting on per-replica latency or you will silently run degraded capacity forever.',
    related: ['tail-latency', 'timeout-budgets', 'load-shedding', 'retry-with-backoff'],
    tags: ['distributed systems', 'latency', 'tail latency', 'replication'],
  },

  {
    id: 'graceful-degradation',
    name: 'Graceful Degradation',
    aka: ['fallback behaviour', 'degraded mode', 'static stability'],
    origin: 'Fault-tolerant systems design; AWS static stability writing',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Decide in advance which features may be turned off or served stale so that a dependency failure removes a capability instead of the whole product.',
    useWhen: [
      'the recommendations service went down and the entire page failed',
      'a non-essential feature took the checkout with it',
      'everything is treated as critical so any failure is total',
      'we have no plan for running without that dependency',
    ],
    prompt:
      'Design degraded operating modes for this system. Classify every dependency as critical, degradable or optional from the user\'s perspective, and for each degradable one specify exactly what the user sees instead — cached data with an age indicator, a generic default, or the feature hidden entirely — plus how the system decides to enter and leave that mode. Prefer static stability where possible, meaning the fallback path does not itself require a new call to something that might be down. Then say how each mode is tested and how anyone knows we are currently degraded, because unnoticed degradation becomes permanent.',
    why:
      'Fallbacks that call another service to find the fallback fail together with the original. Naming static stability and the entry-exit conditions is what makes degradation real.',
    watchOut:
      'Degraded modes that nobody exercises rot silently. If you cannot demonstrate the fallback on demand, assume it does not work.',
    related: ['circuit-breaker', 'feature-flag-hygiene', 'load-shedding', 'chaos-engineering'],
    tags: ['distributed systems', 'resilience', 'fallbacks', 'availability'],
  },

  {
    id: 'consistent-hashing',
    name: 'Consistent Hashing',
    aka: ['ring hashing', 'virtual nodes', 'rendezvous hashing'],
    origin: 'Karger and colleagues, MIT, 1997; used in Dynamo and Memcached clients',
    domains: ['engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Map keys to nodes so that adding or removing a node moves only a small fraction of keys, instead of remapping everything as a modulo scheme does.',
    useWhen: [
      'adding a cache node invalidated the entire cache',
      'scaling the cluster means every key moves to a different server',
      'one shard is much hotter than the others',
      'a node failure caused a total cache miss storm',
    ],
    prompt:
      'Design key distribution for this cluster. Explain what fraction of keys move when a node joins or leaves under our current scheme versus a ring, with the numbers. Then cover the two practical requirements: virtual nodes to smooth the distribution, with a recommended count and its memory cost, and the handling of hot keys, since a well-distributed ring still concentrates a single popular key on one node. Say what happens during a membership change — do requests for moved keys miss, fall back, or get forwarded — and how nodes agree on membership, because inconsistent views of the ring are the failure that produces mystifying cache behaviour.',
    why:
      'The ring is easy and the operational parts — membership agreement and hot keys — are where systems actually break. Rendezvous hashing is often simpler and rarely considered.',
    watchOut:
      'This solves distribution, not popularity. A single celebrity key needs replication or client-side caching, which the hashing scheme cannot provide.',
    related: ['partitioning-strategy', 'cache-invalidation-strategy', 'session-affinity', 'thundering-herd'],
    tags: ['distributed systems', 'sharding', 'caching', 'scaling'],
  },

  {
    id: 'quorum-consistency',
    name: 'Quorum Reads and Writes',
    aka: ['R plus W greater than N', 'majority quorum', 'tunable consistency'],
    origin: 'Quorum systems literature; popularised by Amazon Dynamo, 2007',
    domains: ['engineering', 'data'],
    intents: ['decide', 'explain'],
    oneLiner:
      'Tune how many replicas must acknowledge a read and a write so their overlap guarantees you see the latest value — and see what that costs in latency and availability.',
    useWhen: [
      'we set the replication factor and do not know what consistency we get',
      'a read returned an old value even though the write succeeded',
      'writes fail whenever one node is down',
      'someone asked whether we can lose data on failover and I could not answer',
    ],
    prompt:
      'Work out the quorum settings for this data. Show the overlap arithmetic and what each configuration guarantees, then translate to operational consequences: how many nodes can fail while writes still succeed, what the write latency becomes given it is bounded by the slowest required acknowledgement, and what happens on a partition. Then state the guarantees quorums do not give — no ordering across keys, no atomicity across records, and the possibility of a write acknowledged by a minority still existing afterwards. Recommend the settings per operation class and name the ones where a stale read is genuinely harmless.',
    why:
      'Quorum settings are usually inherited from a default. Deriving them from tolerated failures and stating what they still do not guarantee is what prevents false confidence.',
    watchOut:
      'Quorum overlap without read repair or anti-entropy still leaves replicas divergent over time. The repair mechanism is part of the design, not an optimisation.',
    related: ['cap-theorem', 'eventual-consistency', 'leader-election', 'split-brain'],
    tags: ['distributed systems', 'consistency', 'replication', 'databases'],
  },

  {
    id: 'leader-election',
    name: 'Leader Election',
    aka: ['consensus', 'Raft', 'Paxos', 'primary selection'],
    origin: 'Lamport\'s Paxos, 1998; Ongaro and Ousterhout\'s Raft, 2014',
    domains: ['engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'A consensus protocol lets a group agree on one coordinator despite failures — and the guarantee is only as good as the fencing that stops a deposed leader from still acting.',
    useWhen: [
      'we need exactly one instance running this job and sometimes two do',
      'after a failover the old node kept writing',
      'two nodes both think they are in charge',
      'we decide who is in charge using a database row and a timestamp',
    ],
    prompt:
      'Design coordinator selection for this workload. First challenge the requirement: does the work truly need a single actor, or would partitioning it by key give the same safety with no consensus at all? If a leader is genuinely needed, specify the term or epoch number and how it fences every side effect the leader performs, because a leader that has lost its lease but not noticed is the actual failure mode and a lease alone does not prevent it. Then define lease duration against detection time, what the leader does when it cannot renew, and what happens to in-flight work during a handover.',
    why:
      'Homegrown election almost always omits fencing, so a paused-then-resumed old leader corrupts state. Making fencing tokens the centre of the design is what makes it correct.',
    watchOut:
      'Building consensus yourself is a research-grade mistake. Use a proven implementation, and remember the guarantee ends where your side effects begin.',
    related: ['split-brain', 'distributed-locking-pitfalls', 'quorum-consistency', 'multi-region-failover'],
    tags: ['distributed systems', 'consensus', 'coordination', 'failover'],
  },

  {
    id: 'split-brain',
    name: 'Split Brain',
    aka: ['dual primary', 'partition divergence', 'fencing'],
    origin: 'Cluster management literature; standard in HA database operations',
    domains: ['engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'When a partition leaves two halves each believing they are in charge, both accept writes and the reconciliation afterwards is the expensive part.',
    useWhen: [
      'both data centres accepted writes during the network outage',
      'after the network healed the two copies disagreed',
      'the failover promoted a replica while the primary was still alive',
      'we lost data during a failover and cannot explain which writes',
    ],
    prompt:
      'Analyse this cluster for divergence risk during a partition. Identify every component that could be promoted while the original is still running, and for each state the fencing mechanism — a majority requirement, a shared-storage lock, an epoch token rejected by downstream systems, or physically disabling the old node. If a component has no fencing, the failover is unsafe and should be said so plainly. Then define the reconciliation plan for the divergence we could not prevent: how conflicts are detected, which side wins, and how the losing writes are recovered rather than silently discarded, since that recovery is what the business will ask for.',
    why:
      'Automatic failover is usually configured without fencing, which is the difference between availability and data loss. Demanding the reconciliation plan makes the residual risk visible.',
    watchOut:
      'Requiring a majority makes an even-numbered cluster across two sites unsafe by construction. A third witness location is not optional.',
    related: ['leader-election', 'quorum-consistency', 'multi-region-failover', 'distributed-locking-pitfalls'],
    tags: ['distributed systems', 'failover', 'data loss', 'high availability'],
  },

  {
    id: 'distributed-locking-pitfalls',
    name: 'Distributed Lock Pitfalls',
    aka: ['lock leases', 'fencing tokens', 'Redlock debate'],
    origin: 'Martin Kleppmann\'s critique of Redlock, 2016',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'A lock with a timeout does not prevent two holders, because the first can be paused past expiry and resume believing it still holds — only a fencing token at the resource stops it.',
    useWhen: [
      'we use a cached lock key to stop duplicate processing',
      'two workers processed the same job despite the lock',
      'a long garbage collection pause caused a mystery duplicate',
      'the lock expired mid-operation and something else grabbed it',
    ],
    prompt:
      'Review this locking scheme for correctness. Walk the failure sequence explicitly: holder acquires, holder is paused by a garbage collection or scheduling stall longer than the lease, lock expires, second holder acquires, first holder resumes and writes. Ask what in our design stops that final write, and if the answer is nothing, then the lock provides efficiency but not correctness. Say which of our uses need only efficiency — avoiding duplicate work — and which need correctness. For the latter, design a monotonically increasing token checked and rejected by the resource itself, or restructure so the operation is idempotent and the lock is unnecessary.',
    why:
      'The pause-past-expiry sequence is unintuitive and is the actual mechanism behind rare duplicate-processing bugs. Splitting efficiency uses from correctness uses is the practical resolution.',
    watchOut:
      'Locks in a system without a fencing-capable resource cannot be made safe by a better lock service. The safety has to be enforced where the write lands.',
    related: ['leader-election', 'idempotency-keys', 'optimistic-concurrency', 'split-brain'],
    tags: ['distributed systems', 'locking', 'correctness', 'concurrency'],
  },

  {
    id: 'logical-clocks',
    name: 'Logical Clocks',
    aka: ['Lamport timestamps', 'vector clocks', 'happens-before'],
    origin: 'Leslie Lamport, Time, Clocks and the Ordering of Events, 1978',
    domains: ['engineering'],
    intents: ['explain', 'structure'],
    oneLiner:
      'Order events by causality rather than by wall-clock time, because machine clocks disagree and a later timestamp does not mean a later event.',
    useWhen: [
      'we order events by timestamp and sometimes they are wrong',
      'two servers disagreed about which update came first',
      'the log shows the response before the request',
      'clock drift caused a record to be overwritten by an older version',
    ],
    prompt:
      'Fix the ordering in this system. First show where wall-clock comparison is currently used to decide precedence and what breaks under a few hundred milliseconds of skew — a realistic amount. Then choose the mechanism: a simple counter per record for detecting concurrent modification, a Lamport counter for a total order that respects causality, or vector clocks when we must distinguish concurrent from sequential and are willing to pay the size. Explain the storage and comparison cost of each. Where wall-clock time must be kept for business reasons, keep it separate from the ordering value so the two are never confused.',
    why:
      'Timestamp ordering fails rarely and expensively, and the fix is often just a version counter. Separating business time from ordering is the distinction that prevents recurrence.',
    watchOut:
      'Logical clocks give ordering, not time. Anything a human reads still needs wall-clock timestamps, so both usually have to exist.',
    related: ['message-ordering-guarantees', 'optimistic-concurrency', 'crdt', 'deadline-propagation'],
    tags: ['distributed systems', 'ordering', 'causality', 'clocks'],
  },

  {
    id: 'two-phase-commit-limits',
    name: 'Two-Phase Commit and Its Limits',
    aka: ['2PC', 'distributed transactions', 'XA transactions'],
    origin: 'Jim Gray, transaction processing literature, 1978',
    domains: ['engineering', 'data'],
    intents: ['decide', 'explain'],
    oneLiner:
      'A coordinator can make several systems commit atomically, at the cost of blocking every participant if the coordinator dies at the wrong moment.',
    useWhen: [
      'we need to update two databases and both must succeed',
      'someone suggested distributed transactions and I do not know the cost',
      'a partial failure left the two systems disagreeing',
      'the transaction spans a database and a message broker',
    ],
    prompt:
      'Assess whether we need an atomic commit across these systems. Describe the protocol and then the blocking window precisely: after participants vote to commit and before they learn the outcome, they hold locks and cannot decide alone, so a coordinator failure freezes them until it recovers. Quantify what that means for us given our lock scope and traffic. Then present the alternatives that most systems should prefer — an outbox making one system authoritative, a saga with compensations, or restructuring so the two updates land in one store — and recommend one with the specific business consistency requirement that justifies it.',
    why:
      'Distributed transactions are either dismissed reflexively or adopted without understanding the blocking window. Quantifying the window against our own locking makes the choice concrete.',
    watchOut:
      'Many systems people want to enrol in a transaction, such as HTTP APIs and message brokers, cannot participate at all. That usually settles the decision.',
    related: ['saga-pattern', 'transactional-outbox', 'compensating-transactions', 'aggregate-root'],
    tags: ['distributed systems', 'transactions', 'consistency', 'trade-offs'],
  },

  {
    id: 'crdt',
    name: 'Conflict-Free Replicated Data Types',
    aka: ['CRDT', 'mergeable replicas', 'operational transformation alternative'],
    origin: 'Shapiro, Preguiça, Baquero and Zawirski, 2011',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Data types whose concurrent updates merge deterministically without coordination, so replicas converge without a central arbiter or user-visible conflict.',
    useWhen: [
      'two people edited offline and we have to merge their changes',
      'our last-write-wins rule silently loses one person\'s work',
      'the mobile app needs to work offline and sync later',
      'the counter is wrong when two servers increment at once',
    ],
    prompt:
      'Evaluate conflict-free merge types for this data. Map each field to the closest available type — grow-only or positive-negative counters, add-wins or remove-wins sets, last-writer-wins registers, sequence types for text — and state the merge semantics each gives in business terms, because add-wins versus remove-wins is a product decision about whether a deletion can be resurrected. Then price the costs honestly: metadata that grows with the number of replicas and operations, tombstones that must be retained, and the compaction strategy. Finish with the fields where these types cannot express the rule and coordination is genuinely required.',
    why:
      'The merge semantics are a product decision disguised as a data structure choice, and metadata growth is the reason implementations get abandoned. Both need to be surfaced early.',
    watchOut:
      'Convergence is not correctness. Two replicas can converge on a state that violates a business invariant, such as a balance below zero, because no type enforces cross-field rules.',
    related: ['eventual-consistency', 'logical-clocks', 'offline-first-sync', 'compensating-transactions'],
    tags: ['distributed systems', 'replication', 'merge', 'offline'],
  },

  {
    id: 'gossip-protocol',
    name: 'Gossip Protocol',
    aka: ['epidemic protocol', 'anti-entropy', 'SWIM membership'],
    origin: 'Demers and colleagues, Xerox PARC, 1987; SWIM by Das and colleagues, 2002',
    domains: ['engineering'],
    intents: ['explain', 'structure'],
    oneLiner:
      'Nodes exchange state with a few random peers periodically, spreading information through the cluster reliably without any central coordinator.',
    useWhen: [
      'our service registry is a single point of failure',
      'nodes need to know about each other without a central list',
      'the cluster is too large for everyone to talk to everyone',
      'we need failure detection that survives losing the coordinator',
    ],
    prompt:
      'Assess gossip for our membership and state propagation. Give the convergence time from fanout, interval and cluster size with the actual arithmetic for our numbers, and the resulting background bandwidth per node — that bandwidth is what decides feasibility. Then handle failure detection specifically: distinguishing a slow node from a dead one, the suspicion mechanism that reduces false positives, and what happens during a partition when each side declares the other dead. Say what state is appropriate to spread this way, which is small and eventually consistent, and what absolutely is not.',
    why:
      'Convergence and bandwidth are directly computable and rarely computed, and the false-positive-under-load problem is the reason naive failure detection causes outages.',
    watchOut:
      'Gossip gives eventual membership knowledge. Anything requiring agreement rather than awareness still needs consensus.',
    related: ['service-discovery', 'leader-election', 'eventual-consistency', 'cell-based-architecture'],
    tags: ['distributed systems', 'membership', 'failure detection', 'clustering'],
  },

  {
    id: 'service-discovery',
    name: 'Service Discovery',
    aka: ['service registry', 'client-side discovery', 'DNS-based discovery'],
    origin: 'Service-oriented architecture practice; Consul, Eureka, Kubernetes services',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'How a caller finds a healthy instance of a service — via a registry, DNS, or a proxy — and how quickly it learns that an instance is gone.',
    useWhen: [
      'we hardcoded the host and now the deploy moved it',
      'traffic kept going to an instance that was already terminated',
      'scaling up did not distribute load until we restarted callers',
      'the config file with all the endpoints is out of date again',
    ],
    prompt:
      'Choose a discovery mechanism for this environment and pay attention to the timings, since that is where the failures live. For each option — DNS, a registry with client-side lookup, a proxy or mesh — state how long a terminated instance can still receive traffic given registration lag, health check interval and any caching including DNS resolver behaviour that ignores short lifetimes. Then specify the connection draining and deregistration sequence for a normal shutdown, since most stale-endpoint errors happen during ordinary deploys rather than failures. Finish with the fallback when the discovery system itself is unavailable.',
    why:
      'The staleness window is a compound of several timings people never add up, and it explains the errors that appear on every deploy.',
    watchOut:
      'Caching resolvers and connection pools hold on to old addresses far longer than your registry thinks. Verify empirically rather than trusting the configured lifetime.',
    related: ['service-mesh', 'sidecar-pattern', 'gossip-protocol', 'zero-downtime-deployment'],
    tags: ['distributed systems', 'networking', 'discovery', 'deployment'],
  },

  {
    id: 'sidecar-pattern',
    name: 'Sidecar Pattern',
    aka: ['ambassador container', 'co-process', 'out-of-process helper'],
    origin: 'Container orchestration practice; formalised in cloud-native patterns',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Run cross-cutting infrastructure — proxying, telemetry, secret rotation, log shipping — as a separate process beside the application rather than as a library inside it.',
    useWhen: [
      'we have to upgrade the same client library in twelve services in four languages',
      'adding telemetry means changing every application',
      'services in different languages need identical networking behaviour',
      'the shared library upgrade is blocked on one team for months',
    ],
    prompt:
      'Assess moving this cross-cutting concern out of the application into a co-located process. Compare against a shared library on the axes that decide it: how upgrades roll out, what happens with multiple languages, resource overhead per instance, added latency per hop, and — the one that gets missed — startup and shutdown ordering, since an application that starts before its helper or outlives it produces confusing failures. Specify that ordering explicitly for both directions. Then say what must stay in the application because it needs business context the helper cannot see.',
    why:
      'Startup and shutdown ordering is the recurring operational bug with this pattern, and per-instance overhead is what makes it expensive at scale. Both are usually discovered late.',
    watchOut:
      'One helper per instance multiplies memory and CPU across the fleet. At high instance counts this is a real cost line, not a rounding error.',
    related: ['service-mesh', 'service-discovery', 'container-resource-limits', 'observability-instrumentation'],
    tags: ['distributed systems', 'containers', 'cross-cutting concerns', 'infrastructure'],
  },

  {
    id: 'service-mesh',
    name: 'Service Mesh',
    aka: ['data plane and control plane', 'Istio', 'Linkerd'],
    origin: 'Buoyant and Linkerd, 2016; term coined by William Morgan',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Move retries, timeouts, mutual TLS, traffic splitting and telemetry into a proxy layer configured centrally, so services stop implementing them individually.',
    useWhen: [
      'every service implements retries slightly differently',
      'we cannot get consistent traces without editing every codebase',
      'securing service-to-service traffic means touching every application',
      'someone is proposing a mesh and I do not know if we need one',
    ],
    prompt:
      'Decide whether a mesh is justified here. List the specific capabilities we need — mutual TLS, uniform retry and timeout policy, traffic shifting for releases, request-level telemetry, authorisation between services — and for each, name the simpler alternative and what it would cost to do without a mesh. Then price the mesh honestly: proxy resource overhead, added latency per hop, an extra control plane to operate and upgrade, and the debugging cost when a request fails inside the proxy layer rather than in code. Recommend adopt, partially adopt, or not yet, with the service count where the answer would change.',
    why:
      'Meshes are adopted for a single capability and then owned forever. Forcing per-capability alternatives and a service-count threshold turns it into a sizing decision.',
    watchOut:
      'A mesh adds a highly privileged, cluster-wide component to your critical path. Its failure modes are less familiar than the problems it solves.',
    related: ['sidecar-pattern', 'service-discovery', 'circuit-breaker', 'distributed-tracing'],
    tags: ['distributed systems', 'infrastructure', 'networking', 'platform'],
  },

  {
    id: 'cell-based-architecture',
    name: 'Cell-Based Architecture',
    aka: ['cells', 'shuffle sharding', 'blast radius partitioning'],
    origin: 'AWS and Salesforce operational practice; shuffle sharding from AWS',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Run many complete, independent copies of the stack and assign each customer to one, so a failure or bad deploy affects one cell rather than everybody.',
    useWhen: [
      'any incident affects one hundred percent of customers',
      'a bad deploy took down the entire platform at once',
      'one enormous tenant destabilises the shared system',
      'we cannot test a change on a small slice of real traffic',
    ],
    prompt:
      'Design cell partitioning for this platform. Choose the assignment key and the cell size, and justify size from two directions: small enough that losing one is tolerable, large enough that the per-cell fixed cost is affordable — show that arithmetic. Then identify everything that cannot be cellular, such as global identity, billing, DNS and the routing layer itself, since those remain the true single points of failure and should be listed as the residual risk. Specify how a customer is routed to their cell, how they are migrated between cells, and how deployments proceed cell by cell with what verification between.',
    why:
      'The residual global components are what determine your real availability, and cell diagrams usually omit them. Making the router and identity layer explicit is the honest version.',
    watchOut:
      'Cells multiply operational surface — more environments, more deploys, more monitoring. Without strong automation the fleet becomes unmanageable before it becomes safe.',
    related: ['bulkhead-isolation', 'multi-region-failover', 'blast-radius', 'canary-release'],
    tags: ['distributed systems', 'isolation', 'multi-tenancy', 'availability'],
  },

  {
    id: 'multi-region-failover',
    name: 'Multi-Region Failover',
    aka: ['disaster recovery', 'active-active', 'RTO and RPO'],
    origin: 'Business continuity planning; standard cloud architecture practice',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Decide how much downtime and how much data loss are acceptable, then build only the topology those two numbers require — and rehearse it.',
    useWhen: [
      'someone asked what happens if the region goes down and nobody knew',
      'we have a standby that has never been tested',
      'the compliance team wants a disaster recovery plan',
      'we do not know how much data we would lose in a failover',
    ],
    prompt:
      'Design regional resilience from the two numbers rather than from a topology preference: the recovery time objective and the recovery point objective, agreed with the business in writing. Derive what those require — backup restore, warm standby with asynchronous replication, or active-active with all the consistency consequences — and price each. Then focus on the parts that fail in real events: DNS and its cached lifetimes, data replication lag at the moment of failure, dependencies that exist in only one region including third parties, capacity in the surviving region for full load, and how failback works. Finish with the rehearsal schedule and what a game day would actually exercise.',
    why:
      'Untested standbys are the norm and they do not work when needed. Deriving from stated objectives and demanding a rehearsal plan is what separates a design from a document.',
    watchOut:
      'Active-active means accepting write conflicts and cross-region latency in your data model. Most teams want the availability without acknowledging that consequence.',
    related: ['split-brain', 'cell-based-architecture', 'chaos-engineering', 'backup-restore-testing'],
    tags: ['distributed systems', 'disaster recovery', 'availability', 'planning'],
  },

  {
    id: 'fan-out-fan-in',
    name: 'Fan-Out Fan-In',
    aka: ['scatter-gather', 'parallel aggregation', 'request amplification'],
    origin: 'Parallel computing pattern; common in search and aggregation services',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Split a request across many workers and combine the results — which means your latency is the slowest of them and your load is multiplied by the fan-out factor.',
    useWhen: [
      'one incoming request becomes two hundred downstream calls',
      'the aggregation waits for the slowest shard every time',
      'a modest traffic increase caused a huge spike downstream',
      'one failing partition makes the whole response fail',
    ],
    prompt:
      'Analyse this scatter-gather path. Compute the amplification factor and the resulting downstream load per incoming request, then show why the combined latency tracks the slowest branch rather than the average, using our own percentile numbers to demonstrate how quickly that degrades with fan-out width. Then design the partial-result policy: how long we wait, what we return when some branches fail or time out, and how the response indicates it is incomplete. Add the protections — concurrency caps so a burst does not overwhelm the downstream tier, and per-branch timeouts derived from the overall budget rather than set independently.',
    why:
      'The percentile arithmetic is the part that surprises people: a rare slow branch becomes a common slow request once you fan out widely. Making it explicit drives the partial-result design.',
    watchOut:
      'Returning partial results silently is a correctness bug for anything that looks like a total or a count. The incompleteness has to reach the caller.',
    related: ['tail-latency', 'timeout-budgets', 'hedged-requests', 'n-plus-one-queries'],
    tags: ['distributed systems', 'latency', 'parallelism', 'aggregation'],
  },

  {
    id: 'request-coalescing',
    name: 'Request Coalescing',
    aka: ['single flight', 'request collapsing', 'batching in flight'],
    origin: 'Caching practice; the singleflight package in Go is the reference implementation',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'When many identical requests arrive at once, let one do the work and have the rest wait for its result rather than duplicating it.',
    useWhen: [
      'a popular item causes hundreds of identical queries at the same moment',
      'a cache miss on a hot key floods the database',
      'we compute the same expensive result concurrently many times',
      'a burst of duplicate requests overwhelms the origin',
    ],
    prompt:
      'Add in-flight deduplication to this path. Define the key that determines identity, being careful to include anything that changes the result such as tenant, permissions and locale, since collapsing requests that are not truly identical leaks data between callers. Then specify the sharing semantics: what happens to all the waiters when the leader fails or times out, whether they retry individually or all receive the error, and whether the leader\'s deadline is its own or the earliest waiter\'s. Finish with the observability — the collapse ratio is the metric that shows whether this is doing anything.',
    why:
      'Key selection is a security question as much as a performance one, and error propagation to waiters is the part that produces cascading confusion. Both need specifying.',
    watchOut:
      'Coalescing couples the fate of many requests to one execution. A single slow leader now makes every waiter slow, so it needs its own timeout discipline.',
    related: ['thundering-herd', 'cache-invalidation-strategy', 'backpressure', 'batch-vs-stream'],
    tags: ['distributed systems', 'caching', 'performance', 'deduplication'],
  },

  {
    id: 'partial-failure-handling',
    name: 'Partial Failure Handling',
    aka: ['half-success', 'unknown outcome', 'ambiguous result'],
    origin: 'Distributed systems fundamentals; central to Waldo and colleagues, 1994',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'The defining problem of distributed systems is not failure but ambiguity — a timed-out call may have succeeded, and the caller cannot tell which.',
    useWhen: [
      'the call timed out and I do not know if it went through',
      'the payment may or may not have been taken',
      'three of the five updates succeeded and now what',
      'the response was lost but the work was done',
    ],
    prompt:
      'Enumerate the ambiguous outcomes in this operation. For every remote call, list the three results — clear success, clear failure, and unknown — and specify what our code does in the unknown case today, because that branch is usually missing entirely. Then design for it: an idempotent retry, a query-the-status operation so the caller can find out what happened, or a reconciliation process that repairs the discrepancy later. Where the operation spans several systems, define the order that leaves the least harmful partial state, and say which partial states are detectable and which would be silent, since the silent ones need active reconciliation.',
    why:
      'Code is written for success and failure and almost never for unknown, which is the case that produces double charges and orphaned records. Forcing the third branch is the whole exercise.',
    watchOut:
      'Reconciliation processes that nobody monitors accumulate discrepancies quietly. The repair job needs its own alerting on the number of items it fixes.',
    related: ['idempotency-keys', 'compensating-transactions', 'fallacies-of-distributed-computing', 'reconciliation-jobs'],
    tags: ['distributed systems', 'failure modes', 'correctness', 'error handling'],
  },

  {
    id: 'compensating-transactions',
    name: 'Compensating Transactions',
    aka: ['semantic rollback', 'undo actions', 'business-level compensation'],
    origin: 'Sagas paper, Garcia-Molina and Salem, 1987',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'When you cannot roll back across systems, define a business action that counteracts each completed step — a refund rather than an unwritten charge.',
    useWhen: [
      'we booked the flight and the hotel failed and now what',
      'we cannot undo the email that was already sent',
      'the multi-step process failed at step four and left a mess',
      'rolling back means calling a third party that has no undo',
    ],
    prompt:
      'Define compensation for each step of this process. For every step, write the compensating action and then classify it honestly: perfectly reversible, partially reversible with a residue such as a fee or a visible record, or irreversible such as a sent notification. The irreversible ones determine the design, so order the steps to put them as late as possible and say which cannot be moved. Then specify what happens when a compensation itself fails, since that needs retry and eventually a human queue rather than silent abandonment, and how the user is told what state their request ended in.',
    why:
      'Compensation is usually specified only for the convenient steps. Classifying reversibility and reordering around the irreversible ones is the design decision that actually reduces harm.',
    watchOut:
      'Compensation is visible to users and often to auditors. A refund is not the same as a charge that never happened, and the business needs to accept that difference.',
    related: ['saga-pattern', 'workflow-orchestration', 'partial-failure-handling', 'two-phase-commit-limits'],
    tags: ['distributed systems', 'transactions', 'rollback', 'business process'],
  },
]
