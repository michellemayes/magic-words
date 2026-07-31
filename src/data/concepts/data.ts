import type { Concept } from '../types'

export const dataSystems: Concept[] = [
  {
    id: 'schema-evolution',
    name: 'Schema Evolution',
    aka: ['backward and forward compatibility', 'message schema versioning'],
    origin: 'Data serialisation practice; Protocol Buffers and Avro compatibility rules',
    domains: ['engineering', 'data'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Change a data format so that old readers survive new writers and new readers survive old data, because in a distributed system both exist at once.',
    useWhen: [
      'adding a field broke every consumer that had not been updated',
      'we cannot deploy the producer and consumers at the same moment',
      'old messages sitting in the queue no longer parse',
      'renaming a column meant a coordinated release across four teams',
    ],
    prompt:
      'Plan this format change for compatibility in both directions. Classify the change: adding an optional field, adding a required field, removing, renaming, changing a type, or changing the meaning of an existing field — the last is the dangerous one because it is invisible to any compatibility checker. For each, state whether old readers can handle new data and new readers can handle old data, and give the safe multi-step sequence where it is not directly compatible. Then specify what enforces this going forward: a schema registry with a compatibility mode, and the rule for how long old versions must be readable given our message retention.',
    why:
      'Semantic changes that keep the same field and type pass every automated check and break consumers silently. Naming that category explicitly is what catches it in review.',
    watchOut:
      'Compatibility rules only cover the encoding. A field whose units or nullability convention changes is a breaking change no registry will catch.',
    related: ['expand-and-contract-migration', 'data-contracts', 'api-versioning-strategy', 'contract-testing'],
    tags: ['data', 'schemas', 'compatibility', 'versioning'],
  },

  {
    id: 'expand-and-contract-migration',
    name: 'Expand and Contract',
    aka: ['parallel change', 'four-phase migration', 'zero-downtime schema change'],
    origin: 'Danilo Sato, parallel change pattern, 2014',
    domains: ['engineering', 'data'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Add the new shape alongside the old, migrate readers and writers across, then remove the old — so no single deploy has to be atomic.',
    useWhen: [
      'renaming this column would require downtime',
      'the migration and the code deploy cannot happen at the same instant',
      'we need to roll back a release after the schema already changed',
      'old and new application versions run simultaneously during a rollout',
    ],
    prompt:
      'Sequence this schema change as a series of independently deployable and reversible steps. Give the phases explicitly: add the new structure without removing the old, write to both, backfill historic rows, switch reads to the new, stop writing the old, then drop it. For each step, state whether it is safe to roll back and what happens if the application version and schema version are mismatched in either direction, since that mismatch exists during every rollout. Then flag the steps that are irreversible once taken and where the point of no return sits. Finish with how we verify the two representations agree before switching reads.',
    why:
      'The safety of this pattern comes from the rollback analysis per step and the agreement check before switching reads, which is what catches a broken backfill before it becomes user-visible.',
    watchOut:
      'The contract phase gets forgotten and systems accumulate dual-write code forever. Schedule the cleanup as committed work with a date.',
    related: ['backfill-strategy', 'schema-evolution', 'branch-by-abstraction', 'zero-downtime-deployment'],
    tags: ['data', 'migration', 'deployment', 'schema'],
  },

  {
    id: 'backfill-strategy',
    name: 'Backfill Strategy',
    aka: ['historic data migration', 'batched backfill', 'data catch-up'],
    origin: 'Operational data engineering practice',
    domains: ['engineering', 'data'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Populate a new column, index or store for existing rows without locking the table, saturating the database, or losing track of where you got to.',
    useWhen: [
      'the migration script has been running for six hours and nobody knows how far it got',
      'the backfill locked the table and took the site down',
      'we need to update forty million rows without downtime',
      'the backfill fell over halfway and we cannot tell what was done',
    ],
    prompt:
      'Design the backfill for this change. Process in bounded batches with a durable cursor so it can stop and resume, and make each batch idempotent so re-running a batch is harmless — those two properties are what make the job survivable. Specify the throttle and the feedback signal it responds to, such as replication lag or database load, rather than a fixed sleep. Then handle the interaction with live traffic: rows written or deleted while the backfill runs, and how the new and old values are reconciled at the end. Finish with the progress reporting and the verification query that proves completeness before we depend on the new data.',
    why:
      'Resumability, idempotence and a load-responsive throttle are the three properties that separate a backfill you can run on a busy system from one that causes an incident.',
    watchOut:
      'A backfill that races with live writes can overwrite newer values with older ones. The write path must win, and that has to be enforced rather than assumed.',
    related: ['expand-and-contract-migration', 'idempotent-pipelines', 'bulk-load-strategy', 'reconciliation-jobs'],
    tags: ['data', 'migration', 'operations', 'databases'],
  },

  {
    id: 'index-selection',
    name: 'Index Selection',
    aka: ['covering index', 'composite index order', 'index tuning'],
    origin: 'Database performance practice; Markus Winand\'s work on index design',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'decide'],
    oneLiner:
      'Design indexes from the query predicates and ordering, remembering that column order in a composite index determines which queries it can serve.',
    useWhen: [
      'the query is slow and I do not know what index to add',
      'we added an index and nothing improved',
      'we have twenty indexes and writes have become slow',
      'the query is fast in one direction and slow with a different filter',
    ],
    prompt:
      'Recommend indexes for these queries. For each query, list the equality predicates, range predicates and sort order, then derive the composite column order using the rule that equality columns come first, then the range or sort column — and explain why a different order makes the index unusable for that query. Identify where adding the selected columns would make the index covering and remove the table lookup entirely. Then look at the cost side: list existing indexes that would become redundant, the write and storage overhead per index, and any index that no query uses. Recommend additions and deletions together.',
    why:
      'Composite column ordering is the rule that decides whether an index is used at all, and pairing additions with deletions keeps write cost from creeping up unnoticed.',
    watchOut:
      'Indexes on low-selectivity columns are usually ignored by the planner and cost writes for nothing. Check selectivity before adding.',
    related: ['query-plan-reading', 'n-plus-one-queries', 'partitioning-strategy', 'normalization-tradeoffs'],
    tags: ['data', 'databases', 'performance', 'indexing'],
  },

  {
    id: 'query-plan-reading',
    name: 'Query Plan Reading',
    aka: ['explain analyze', 'execution plan analysis', 'planner estimates'],
    origin: 'Relational database practice',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'explain'],
    oneLiner:
      'Read what the database actually did rather than guessing — and pay particular attention to where its row estimates diverge from reality.',
    useWhen: [
      'the query is slow and I do not know why',
      'it was fast yesterday and slow today with the same data',
      'the index exists and the database is not using it',
      'the plan changed after we loaded more data',
    ],
    prompt:
      'Analyse this execution plan. Walk it from the innermost nodes outward, and at each step compare the estimated rows against the actual rows — a large divergence is the root cause of most bad plans, and it points at stale statistics, a correlated predicate the planner cannot model, or an expression it cannot estimate through. Identify the node consuming the most time and whether it is a scan, a sort spilling to disk, or a nested loop over far more rows than expected. Then give the remedies in order: refresh statistics, rewrite the predicate to be estimable, add or reorder an index, or restructure the query. Say which we should try first and what evidence would confirm it worked.',
    why:
      'Estimate-versus-actual divergence is the single most diagnostic thing in a plan and the thing least often looked at. Ordering remedies by cost prevents jumping straight to hints.',
    watchOut:
      'Plans depend on data distribution and parameters, so a plan captured for one value may not be the plan used for another. Check the parameterised case too.',
    related: ['index-selection', 'n-plus-one-queries', 'partitioning-strategy', 'profiling-before-optimizing'],
    tags: ['data', 'databases', 'performance', 'diagnosis'],
  },

  {
    id: 'normalization-tradeoffs',
    name: 'Normalisation Trade-offs',
    aka: ['third normal form', 'denormalisation', 'redundancy versus joins'],
    origin: 'Edgar Codd, relational model, 1970',
    domains: ['engineering', 'data'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Normalised schemas prevent contradictory data and cost joins; denormalised ones read fast and require you to keep copies in agreement.',
    useWhen: [
      'the same customer address is stored in four tables and they disagree',
      'every read joins seven tables and it is slow',
      'we copied the price into the order and now I am not sure that was wrong',
      'someone wants to denormalise and I cannot articulate the risk',
    ],
    prompt:
      'Evaluate the normalisation of this model. First separate genuine denormalisation from historical snapshotting, because they look identical and are opposites: copying a price into an order is correct since the order must record what was charged, while copying a customer name for convenience is a duplication risk. Classify each duplicated field into those two categories. For the convenience copies, state the update anomaly they permit and how it would be detected. Then, where denormalisation is justified by read performance, specify the mechanism that keeps copies in agreement and how divergence is monitored, since unmonitored derived data drifts.',
    why:
      'The snapshot-versus-duplication distinction resolves most normalisation arguments, and it is invisible from the schema alone. Separating them makes the rest of the analysis straightforward.',
    watchOut:
      'Normalising to the last degree produces schemas nobody can query and joins the planner handles badly. Model for the questions the data must answer.',
    related: ['precomputation-materialization', 'index-selection', 'temporal-data-modeling', 'dimensional-modeling'],
    tags: ['data', 'modelling', 'databases', 'trade-offs'],
  },

  {
    id: 'partitioning-strategy',
    name: 'Partitioning Strategy',
    aka: ['sharding key selection', 'table partitioning', 'horizontal split'],
    origin: 'Database scaling practice',
    domains: ['engineering', 'data'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Split data across partitions by a key chosen so that common queries touch one partition and no single partition becomes disproportionately hot.',
    useWhen: [
      'the table has grown to a billion rows and everything is slow',
      'one customer is a hundred times bigger than the rest',
      'every query has to check every shard',
      'deleting old data takes hours and locks everything',
    ],
    prompt:
      'Choose a partition key for this data. Evaluate candidates against four criteria with our actual data: how evenly they distribute volume, whether the most frequent queries can be routed to a single partition, whether related records that must be updated together land together, and how the distribution changes as we grow. Explicitly model the largest tenant or hottest key, since skew is what breaks these schemes. Then cover operations: how a partition is split when it outgrows its host, how cross-partition queries and transactions behave, and how time-based partitioning could make deletion an instant drop rather than a mass delete.',
    why:
      'Skew analysis against real data and the cross-partition query cost are what determine whether a key works, and both are usually skipped in favour of an intuitive-looking choice.',
    watchOut:
      'Choosing a partition key is close to irreversible — repartitioning a large live data set is a project. Model the growth case before committing.',
    related: ['consistent-hashing', 'index-selection', 'multi-tenancy-data-isolation', 'read-replica-strategy'],
    tags: ['data', 'sharding', 'scaling', 'databases'],
  },

  {
    id: 'read-replica-strategy',
    name: 'Read Replica Strategy',
    aka: ['read scaling', 'replica routing', 'replication lag management'],
    origin: 'Database scaling practice',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Send reads to replicas to relieve the primary, and decide explicitly which reads can tolerate lag — because some cannot and will produce visible bugs.',
    useWhen: [
      'the primary database is at capacity and mostly serving reads',
      'the user updated something and the next page showed old data',
      'reporting queries are slowing down the transactional workload',
      'we added replicas and now we get intermittent stale reads',
    ],
    prompt:
      'Design replica routing for this application. Classify every read as must-be-current, tolerates-seconds, or tolerates-minutes, and route accordingly rather than choosing a single global default. For the must-be-current reads, specify the mechanism — primary routing for a bounded window after a write, or waiting for a replication position. Then handle the operational side: monitoring lag per replica with alerting, automatically removing a lagging replica from rotation, and what happens to routing during a failover. Finish with the reporting workload, which should probably have its own replica so a heavy query cannot lag the ones serving users.',
    why:
      'Per-read classification is the decision that prevents stale-read bugs, and isolating analytics onto their own replica is what stops one report from degrading everything.',
    watchOut:
      'Replication lag is not constant; it spikes during bulk operations and backfills. A routing rule tuned for normal lag will misbehave exactly when you are running a migration.',
    related: ['read-your-writes', 'partitioning-strategy', 'olap-oltp-separation', 'eventual-consistency'],
    tags: ['data', 'replication', 'scaling', 'consistency'],
  },

  {
    id: 'transaction-isolation-levels',
    name: 'Transaction Isolation Levels',
    aka: ['read committed', 'repeatable read', 'serializable', 'phantom reads'],
    origin: 'ANSI SQL standard; refined by Berenson and colleagues, 1995',
    domains: ['engineering', 'data'],
    intents: ['explain', 'decide'],
    oneLiner:
      'Each isolation level permits specific anomalies — knowing which ones your default allows is the difference between a correct system and an intermittently wrong one.',
    useWhen: [
      'two concurrent updates produced a total that is wrong',
      'a check passed and then the condition it checked changed before the write',
      'the same query inside one transaction returned different results',
      'we assumed transactions made this safe and apparently they did not',
    ],
    prompt:
      'Analyse this transaction for concurrency anomalies at our actual isolation level, which you should confirm rather than assume since defaults differ by database. Walk through the anomalies the level permits — dirty reads, non-repeatable reads, phantoms, lost updates and write skew — and for each, construct the concrete interleaving in our code that would produce a wrong result. Write skew deserves particular attention because it survives at levels people consider safe: two transactions each check a condition, both pass, and together they violate it. Then give the remedy per case: raising the level, explicit locking, a uniqueness constraint, or restructuring so the check and the write are one operation.',
    why:
      'Write skew is invisible at the level most systems run at and is the mechanism behind whole classes of rare data bugs. Constructing the interleaving makes it undeniable.',
    watchOut:
      'Serializable isolation makes anomalies impossible and transaction aborts common. The application must be able to retry, which is a code change, not a configuration one.',
    related: ['optimistic-concurrency', 'database-deadlocks', 'aggregate-root', 'race-condition-diagnosis'],
    tags: ['data', 'transactions', 'concurrency', 'correctness'],
  },

  {
    id: 'optimistic-concurrency',
    name: 'Optimistic Concurrency Control',
    aka: ['version column', 'compare and swap', 'lost update prevention'],
    origin: 'Kung and Robinson, 1981; ubiquitous in ORMs and HTTP ETags',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Let concurrent edits proceed and detect the conflict at write time using a version, rather than locking the record while a user thinks.',
    useWhen: [
      'two users edited the same record and one change silently vanished',
      'we hold a database lock while a form is open on someone\'s screen',
      'the last save wins and users are losing work',
      'the counter is wrong when two requests arrive together',
    ],
    prompt:
      'Add conflict detection to this update path. Specify the version token, where it is carried through the user interaction, and the conditional write that fails if the version has moved — including that the check and the write must be one atomic statement, since checking then writing reintroduces the race. Then design the human side, which is the part that decides whether this works: what the user sees on conflict, whether we can merge non-overlapping field changes automatically, and how their unsaved work is preserved. Finish with the retry policy for machine-driven updates and how often we expect conflicts, since a high conflict rate means the record is modelled too coarsely.',
    why:
      'Conflict rate as a signal that the aggregate is too coarse is a genuinely useful diagnostic, and the check-and-write atomicity is where naive implementations still lose updates.',
    watchOut:
      'Under high contention, optimistic control degenerates into a retry storm that is slower than a lock. Measure the conflict rate before choosing it.',
    related: ['transaction-isolation-levels', 'distributed-locking-pitfalls', 'aggregate-root', 'logical-clocks'],
    tags: ['data', 'concurrency', 'conflicts', 'transactions'],
  },

  {
    id: 'database-deadlocks',
    name: 'Deadlock Diagnosis',
    aka: ['lock ordering', 'deadlock graph', 'lock wait analysis'],
    origin: 'Database and operating systems concurrency practice',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Deadlocks come from transactions taking the same locks in different orders — the fix is almost always a consistent ordering, not a bigger timeout.',
    useWhen: [
      'we get deadlock errors under load and they seem random',
      'two batch jobs deadlock against each other every night',
      'the error rate spikes exactly when traffic does',
      'we increased the lock timeout and it just failed more slowly',
    ],
    prompt:
      'Diagnose these deadlocks from the database\'s own deadlock report rather than from theory. For each, identify the two transactions, the resources each held and wanted, and the statement that closed the cycle. Then find the ordering violation: two code paths that touch the same rows in different sequences, often because one iterates a collection in an unspecified order. Give the fixes in order of preference — deterministic ordering of lock acquisition, shortening transactions so the window is small, avoiding lock escalation by touching fewer rows, and only then retry logic. Also check whether an index is missing, since scans lock more rows than lookups do.',
    why:
      'The missing-index cause is non-obvious and common: without an index the engine locks far more rows than the query logically touches, creating conflicts that vanish once the index exists.',
    watchOut:
      'Retrying on deadlock is legitimate and necessary, but it hides the frequency. Track the retry rate or you will not notice it becoming a throughput problem.',
    related: ['transaction-isolation-levels', 'lock-contention', 'index-selection', 'optimistic-concurrency'],
    tags: ['data', 'databases', 'concurrency', 'diagnosis'],
  },

  {
    id: 'surrogate-vs-natural-keys',
    name: 'Surrogate versus Natural Keys',
    aka: ['primary key choice', 'business key', 'synthetic identifier'],
    origin: 'Relational database design practice',
    domains: ['engineering', 'data'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Use a meaningless generated identifier as the primary key and enforce business identifiers as separate unique constraints, because business identity changes and duplicates.',
    useWhen: [
      'we keyed on email address and now someone wants to change theirs',
      'the supplier reused a product code and our data broke',
      'the natural key turned out not to be unique after all',
      'changing an identifier means updating a dozen foreign keys',
    ],
    prompt:
      'Decide the key structure for this entity. Test any proposed natural key against the four questions that break them: can it change, can it be reused by the source system, is it genuinely unique across all our sources, and is it available at the moment we need to create the row. Then recommend a generated primary key with the business identifier as a unique constraint, and be specific about where the business key should still be used — in external interfaces and for deduplication on import. Finally state how a change of business identifier is handled, including whether the old value must remain resolvable for existing links.',
    why:
      'Testing candidate keys against change, reuse, cross-source uniqueness and availability-at-insert is what surfaces the failure before it is embedded in foreign keys everywhere.',
    watchOut:
      'A surrogate key without a unique constraint on the business key lets duplicates in silently, which is a worse problem than the one you avoided.',
    related: ['identifier-generation', 'normalization-tradeoffs', 'data-quality-checks', 'idempotent-pipelines'],
    tags: ['data', 'modelling', 'keys', 'databases'],
  },

  {
    id: 'identifier-generation',
    name: 'Identifier Generation',
    aka: ['UUID versus auto-increment', 'ULID', 'Snowflake ids'],
    origin: 'Distributed systems practice; Twitter Snowflake and ULID specifications',
    domains: ['engineering', 'data'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose identifiers by weighing index locality, sortability, guessability and the ability to generate them without a coordinator.',
    useWhen: [
      'our sequential ids let anyone guess how many customers we have',
      'random identifiers made insert performance fall off a cliff',
      'we need ids before the row is written and the database assigns them',
      'merging data from two systems produced id collisions',
    ],
    prompt:
      'Choose an identifier scheme for this entity. Compare the options against five criteria: whether it can be generated client-side without a round trip, index locality on insert since fully random values scatter writes across the index, sortability by creation time, information leakage from guessable sequences, and size in storage and in every foreign key referencing it. Time-ordered random identifiers usually win, so say specifically whether they fit here. Then separate internal from external identity: an efficient internal key with an opaque public identifier is often the right answer, and if so, define the mapping and where translation happens.',
    why:
      'The internal-versus-external identifier split resolves the conflict between index performance and not leaking business volume, and it is rarely considered as an option.',
    watchOut:
      'Fully random primary keys on a clustered index cause page splits and write amplification that only appear at scale. By then the choice is expensive to reverse.',
    related: ['surrogate-vs-natural-keys', 'index-selection', 'idempotency-keys', 'attack-surface-reduction'],
    tags: ['data', 'identifiers', 'databases', 'design'],
  },

  {
    id: 'soft-delete-tradeoffs',
    name: 'Soft Delete Trade-offs',
    aka: ['logical delete', 'deleted_at flag', 'tombstones'],
    origin: 'Application database practice',
    domains: ['engineering', 'data'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Marking rows deleted instead of removing them preserves history and breaks uniqueness, foreign keys, queries and privacy obligations in ways that accumulate.',
    useWhen: [
      'a deleted record reappeared in a report',
      'we cannot re-register an email address because the old row still holds it',
      'every query needs a not-deleted filter and someone always forgets one',
      'legal asked us to actually delete data and it is everywhere',
    ],
    prompt:
      'Assess whether soft deletion is right for this entity and specify the consequences either way. Start with the requirement it is meant to serve — undo, audit, referential integrity, or accidental-deletion recovery — because each has a better dedicated solution. If we keep it, address the four standard breakages: unique constraints that must now be partial, foreign keys pointing at deleted parents, every query needing the filter and the enforcement that catches omissions, and the erasure obligation where a mark is not a deletion. Recommend the alternative where one fits better, such as an archive table or an event log.',
    why:
      'Tying the pattern back to the requirement it serves usually reveals a cleaner mechanism, and the four breakages are the ones that show up months later in production data.',
    watchOut:
      'Soft deletion does not satisfy a legal erasure request. If you are subject to one, you need real deletion or irreversible anonymisation regardless of the flag.',
    related: ['right-to-erasure-design', 'data-retention-policy', 'temporal-data-modeling', 'audit-logging'],
    tags: ['data', 'modelling', 'deletion', 'privacy'],
  },

  {
    id: 'temporal-data-modeling',
    name: 'Temporal Data Modelling',
    aka: ['bitemporal data', 'valid time and transaction time', 'as-of queries'],
    origin: 'Richard Snodgrass, temporal database research; Martin Fowler\'s temporal patterns',
    domains: ['engineering', 'data'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Distinguish when something was true in the world from when the system learned it, so you can reproduce both what happened and what you believed at the time.',
    useWhen: [
      'we need to know what the price was on the date of that order',
      'a correction arrived late and now historic reports have changed',
      'the auditor asked what we knew at the time and we cannot answer',
      'someone backdated a change and it silently rewrote history',
    ],
    prompt:
      'Model the time dimensions for this data. Separate valid time — the period the fact was true in the real world — from transaction time, when we recorded it, and show why a single timestamp cannot answer both the what-was-true-then and the what-did-we-know-then questions. Design the table structure for the dimensions we actually need, since full bitemporal modelling is heavy and often only one dimension is required. Then specify the query patterns: as-of-a-date lookups, the current view, and reproducing a historic report exactly. Finish with the corrections workflow, since a late correction is precisely the case this modelling exists to handle.',
    why:
      'Most schemas conflate the two time dimensions into one updated-at column, which makes historic reports irreproducible after any correction. Separating them is the whole insight.',
    watchOut:
      'Bitemporal modelling makes every query harder and every index bigger. Apply it to the few entities where history genuinely matters, not to everything.',
    related: ['slowly-changing-dimensions', 'event-sourcing', 'soft-delete-tradeoffs', 'audit-logging'],
    tags: ['data', 'modelling', 'history', 'auditing'],
  },

  {
    id: 'slowly-changing-dimensions',
    name: 'Slowly Changing Dimensions',
    aka: ['SCD type 2', 'dimension history', 'warehouse history tracking'],
    origin: 'Ralph Kimball, data warehouse toolkit',
    domains: ['data', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Choose per attribute whether a change overwrites the old value, creates a new versioned row, or is kept alongside it — the choice determines which historic questions you can answer.',
    useWhen: [
      'the customer moved region and last year\'s regional report changed',
      'we overwrote the sales rep on the account and lost attribution history',
      'reports are inconsistent depending on when they were run',
      'someone asked for revenue by the territory as it was at the time',
    ],
    prompt:
      'Decide the history treatment per attribute in this dimension rather than for the table as a whole. For each, ask whether historical facts should be attributed to the old value or the new — that business question is the entire decision — and assign the appropriate type: overwrite where the old value is simply wrong, versioned rows where history must be preserved, or a parallel current-and-original pair where both views are needed. Then specify the surrogate key and how facts reference the correct version, the effective date columns, and how a late-arriving change is applied. Finish with the queries each choice makes possible or impossible.',
    why:
      'Framing it as which value should own the historic fact converts a modelling debate into a business question with a definite answer, and it is decided per attribute rather than per table.',
    watchOut:
      'Versioning every attribute inflates the dimension enormously and slows every join. Restrict it to attributes that reporting actually slices by.',
    related: ['dimensional-modeling', 'temporal-data-modeling', 'normalization-tradeoffs', 'data-lineage'],
    tags: ['data', 'warehouse', 'history', 'modelling'],
  },

  {
    id: 'dimensional-modeling',
    name: 'Dimensional Modelling',
    aka: ['star schema', 'facts and dimensions', 'Kimball modelling'],
    origin: 'Ralph Kimball, The Data Warehouse Toolkit, 1996',
    domains: ['data', 'engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Organise analytic data as measurable events surrounded by the descriptive attributes you filter and group by, at one clearly stated level of detail.',
    useWhen: [
      'every analyst writes a different query and gets a different number',
      'our reporting queries join fifteen normalised tables',
      'nobody can explain what one row in this table means',
      'the same metric has three definitions across the business',
    ],
    prompt:
      'Design a dimensional model for this analytic area. Start by stating the grain — exactly what one row represents — in a single sentence, because an ambiguous grain is the root of double counting and disagreeing numbers. Then identify the measures that live at that grain and the descriptive attributes used to filter and group. Flag any measure that is not additive across all dimensions, such as a balance or a rate, and say how it must be aggregated instead. Finish with the conformed attributes shared across subject areas so that two reports can be compared, since inconsistent shared dimensions are what make numbers irreconcilable.',
    why:
      'Stating the grain in one sentence and flagging non-additive measures are the two steps that prevent the double-counting bugs that make analytic systems untrusted.',
    watchOut:
      'This shape suits analytic querying, not transactional writing. Applying it to an operational database produces update anomalies and poor write performance.',
    related: ['slowly-changing-dimensions', 'olap-oltp-separation', 'normalization-tradeoffs', 'data-contracts'],
    tags: ['data', 'warehouse', 'analytics', 'modelling'],
  },

  {
    id: 'olap-oltp-separation',
    name: 'Analytical and Transactional Separation',
    aka: ['OLTP versus OLAP', 'reporting off the primary', 'workload isolation'],
    origin: 'Data warehousing practice; the distinction dates to the 1990s',
    domains: ['data', 'engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Transactional and analytical workloads want opposite storage layouts, indexes and isolation — running both on one system makes each worse.',
    useWhen: [
      'the monthly report query locks up the application database',
      'analysts run heavy queries on production and everyone suffers',
      'our indexes are tuned for reports and writes have slowed',
      'someone wants a dashboard on live data and I am nervous',
    ],
    prompt:
      'Assess separating these workloads. Characterise each concretely: transactional work is many small indexed reads and writes with strict consistency, analytical work is few queries scanning enormous ranges with tolerance for staleness. Show where they conflict in our system — competing for buffer cache, indexes that serve one and burden the other, long-running queries holding snapshots. Then choose the separation mechanism by required freshness and volume: a read replica, a change-data-capture pipeline into a columnar store, or scheduled extracts. Say what latency each gives and what operational burden each adds, and recommend one for our stated freshness requirement.',
    why:
      'Driving the mechanism choice from a stated freshness requirement prevents building a streaming pipeline for a report that is read once a day.',
    watchOut:
      'A replica shares the same storage layout and index design, so it relieves contention without fixing the fundamental mismatch. Heavy analytics still need a different engine.',
    related: ['read-replica-strategy', 'columnar-storage', 'change-data-capture', 'dimensional-modeling'],
    tags: ['data', 'analytics', 'architecture', 'workloads'],
  },

  {
    id: 'columnar-storage',
    name: 'Columnar Storage',
    aka: ['column-oriented format', 'Parquet', 'vectorised execution'],
    origin: 'C-Store and MonetDB research; mainstream via Parquet and cloud warehouses',
    domains: ['data', 'engineering'],
    intents: ['explain', 'decide'],
    oneLiner:
      'Storing values by column rather than by row lets a query read only the columns it needs and compress each one aggressively, which is why analytic engines are fast.',
    useWhen: [
      'the analytic query reads two columns out of two hundred and takes minutes',
      'our data lake files are enormous and slow to scan',
      'the same data is much faster in the warehouse than in our database',
      'I do not know which file format to write these exports in',
    ],
    prompt:
      'Explain the storage layout choice for this data and recommend one. Cover why reading a few columns from a columnar file touches a fraction of the bytes, and why per-column compression and encoding work so much better when values of the same type sit together. Then apply it to our access patterns: which queries benefit, and which — point lookups and row-at-a-time updates — get worse. Cover the practical file-layout decisions that determine whether it actually performs: row group sizing, sort order within files, partitioning by the common filter column, and column statistics that let a reader skip entire blocks.',
    why:
      'The performance of these formats comes mostly from file layout choices — sorting and partitioning for predicate skipping — rather than from the format itself, which is where teams leave most of the gain unclaimed.',
    watchOut:
      'Columnar formats are poor for frequent small updates and for retrieving whole rows. Mixed workloads usually need both representations.',
    related: ['olap-oltp-separation', 'compression-tradeoffs', 'partitioning-strategy', 'batch-vs-stream'],
    tags: ['data', 'storage', 'analytics', 'formats'],
  },

  {
    id: 'change-data-capture',
    name: 'Change Data Capture',
    aka: ['CDC', 'log-based replication', 'database streaming'],
    origin: 'Database replication practice; popularised by Debezium and Kafka Connect',
    domains: ['data', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Read the database transaction log to emit every insert, update and delete as a stream, so downstream systems stay current without polling or dual writes.',
    useWhen: [
      'we poll the database every minute and it is expensive and still late',
      'the search index drifts out of sync with the database',
      'we want events from a legacy application we cannot modify',
      'the dual write to the queue sometimes fails and data diverges',
    ],
    prompt:
      'Design a change stream from this database. Cover the parts that determine whether it works in practice: the initial snapshot and how it hands over to streaming without gaps or duplicates, delete handling including whether the log carries the old row values, schema changes flowing through mid-stream, and transaction boundaries if consumers need to see related changes together. Then address the operational risks specifically — the log retention window that bounds how long a consumer may be down, and the load the connector places on the primary. Finish with what downstream consumers must handle: at-least-once delivery and events describing rows rather than business intent.',
    why:
      'Row-level change events lack business intent, and the log retention window is a silent time bomb for any consumer that goes down. Both shape the consumer design and are usually discovered late.',
    watchOut:
      'A change stream couples consumers to your internal schema. Every column rename becomes a downstream breaking change unless you transform to a stable contract in between.',
    related: ['transactional-outbox', 'data-contracts', 'olap-oltp-separation', 'schema-evolution'],
    tags: ['data', 'streaming', 'replication', 'integration'],
  },

  {
    id: 'batch-vs-stream',
    name: 'Batch versus Stream Processing',
    aka: ['micro-batching', 'continuous processing', 'freshness requirement'],
    origin: 'Data engineering practice; the lambda and kappa architecture debate',
    domains: ['data', 'engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Choose between periodic bulk processing and continuous processing based on the freshness the business actually needs, not on which is more modern.',
    useWhen: [
      'someone wants everything to be real time and I am not sure why',
      'our nightly job is no longer fast enough',
      'we built a streaming pipeline and it is much harder to operate',
      'the dashboard updates hourly and stakeholders keep asking for live',
    ],
    prompt:
      'Decide the processing model for this pipeline. Establish the freshness requirement by asking what decision is made from this data and how quickly acting on it changes the outcome — that usually reveals a requirement measured in hours rather than seconds. Then compare batch and streaming honestly on the operational dimensions: reprocessing after a bug, which is trivial in batch and hard in streaming; correctness with late-arriving data; cost at our volume; and the skills needed to run it at three in the morning. If streaming is warranted for part of the pipeline only, say which part and keep the rest batch.',
    why:
      'Reprocessing after a logic bug is the operational reality that decides this, and it is almost never in the comparison. Deriving freshness from the decision being made deflates most real-time requests.',
    watchOut:
      'Hybrid architectures that maintain the same logic in two engines drift apart. If you build both paths, they need shared code or shared tests.',
    related: ['stream-windowing', 'change-data-capture', 'idempotent-pipelines', 'precomputation-materialization'],
    tags: ['data', 'pipelines', 'streaming', 'architecture'],
  },

  {
    id: 'stream-windowing',
    name: 'Stream Windowing',
    aka: ['tumbling and sliding windows', 'session windows', 'event time processing'],
    origin: 'Dataflow model, Akidau and colleagues, Google, 2015',
    domains: ['data', 'engineering'],
    intents: ['structure', 'explain'],
    oneLiner:
      'Aggregating an unbounded stream requires deciding what a window is, and whether it is bounded by when events happened or when you received them.',
    useWhen: [
      'our hourly counts do not match when we recompute them',
      'events arrive late and land in the wrong bucket',
      'the mobile app was offline and sent yesterday\'s events today',
      'the same aggregation gives different answers on each run',
    ],
    prompt:
      'Design the windowing for this aggregation. Choose event time or processing time explicitly and state the consequence — processing time is simple and gives irreproducible results, event time is reproducible and requires handling late arrivals. Then pick the window type from the business question: fixed intervals, overlapping windows for moving averages, or activity-bounded sessions with a gap parameter. Specify how long a window stays open for late data, what happens to data arriving after it closes, and whether results are emitted once when complete or updated as more arrives. Finish with the state size implied and how it is bounded.',
    why:
      'The event-time versus processing-time choice determines whether recomputation reproduces the original numbers, and that reproducibility question is what makes the pipeline trustworthy.',
    watchOut:
      'Long allowed lateness means keeping window state for that entire period, which can dominate memory. The correctness and cost knobs are the same knob.',
    related: ['late-data-watermarks', 'batch-vs-stream', 'idempotent-pipelines', 'logical-clocks'],
    tags: ['data', 'streaming', 'aggregation', 'time'],
  },

  {
    id: 'late-data-watermarks',
    name: 'Watermarks and Late Data',
    aka: ['completeness estimation', 'allowed lateness', 'out-of-order events'],
    origin: 'Google Dataflow model; implemented in Beam and Flink',
    domains: ['data', 'engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'A watermark is the system\'s estimate that no more events older than a given time will arrive — a guess that trades result latency against completeness.',
    useWhen: [
      'yesterday\'s totals changed after we published them',
      'we cannot tell whether a low count means low activity or missing data',
      'one slow producer holds up every aggregation',
      'events from one region arrive minutes behind the rest',
    ],
    prompt:
      'Design completeness handling for this pipeline. Measure the actual distribution of the delay between event time and arrival time per source, since the tail of that distribution is what the lateness setting must accommodate — and one lagging source will otherwise hold back everything. Then set the trade explicitly: how long we wait before emitting a result, and what happens to data that arrives after that. Choose between discarding it, emitting a correction, or accumulating and restating, and say what each means for consumers who already saw the earlier number. Finish with the metric that tells us how much data we are dropping as late.',
    why:
      'Measuring the real arrival delay distribution per source is what turns lateness settings from guesses into decisions, and the dropped-as-late metric is the safety net nobody builds.',
    watchOut:
      'A single stalled partition can freeze the watermark and stall every downstream aggregation. That failure looks like nothing happening rather than an error.',
    related: ['stream-windowing', 'batch-vs-stream', 'data-quality-checks', 'message-ordering-guarantees'],
    tags: ['data', 'streaming', 'completeness', 'correctness'],
  },

  {
    id: 'data-contracts',
    name: 'Data Contracts',
    aka: ['producer-consumer data agreement', 'schema ownership'],
    origin: 'Data engineering practice, circa 2022; Chad Sanderson and others',
    domains: ['data', 'engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Make the interface between a data producer and its consumers explicit and owned, so an upstream refactor stops silently breaking analytics.',
    useWhen: [
      'a backend team renamed a column and every dashboard broke',
      'analytics depends on tables nobody knows are being consumed',
      'we discover schema changes when the pipeline fails at 4am',
      'nobody owns the data quality of this table',
    ],
    prompt:
      'Define a contract for this data interface. Specify what is guaranteed beyond field names and types: semantic definitions in business terms, nullability, value ranges and allowed enumerations, freshness, completeness expectations, and the deprecation notice period. Then specify what is deliberately not guaranteed, which is what keeps the contract affordable to the producer. Cover enforcement — validation at the producer boundary and monitoring at the consumer — and the change process including who must be notified. Finally, name the owner on both sides, since an unowned contract is a document rather than an agreement.',
    why:
      'Semantics and freshness, not field types, are where data pipelines break. Requiring explicit non-guarantees is what makes producers willing to sign up.',
    watchOut:
      'Contracts on internal tables that were never meant as interfaces just freeze someone\'s implementation. Publish a deliberate interface instead of promoting an accident.',
    related: ['schema-evolution', 'data-quality-checks', 'change-data-capture', 'contract-testing'],
    tags: ['data', 'contracts', 'ownership', 'governance'],
  },

  {
    id: 'data-quality-checks',
    name: 'Data Quality Checks',
    aka: ['pipeline assertions', 'data validation tests', 'freshness and volume checks'],
    origin: 'Data engineering practice; Great Expectations and dbt tests popularised it',
    domains: ['data', 'engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Assert properties of the data itself — volume, freshness, uniqueness, distribution — because a pipeline that runs successfully on wrong data reports success.',
    useWhen: [
      'the job succeeded and the numbers were nonsense',
      'we found out about the broken feed from a customer three weeks later',
      'a source silently started sending nulls in a key field',
      'the row count halved and nothing alerted',
    ],
    prompt:
      'Design quality checks for this dataset across four families: freshness (the newest record is not older than expected), volume (row count within a range derived from history rather than a fixed number), schema and constraints (uniqueness, nullability, referential integrity, allowed values), and distribution (a numeric mean or category mix that has not shifted beyond a threshold). For each check, specify whether a failure should stop the pipeline or raise a warning, because blocking on distribution drift will produce false stops. Then name the checks that must run before publishing versus after, and where a failed batch is quarantined so downstream consumers see the last good data rather than bad data.',
    why:
      'The block-versus-warn decision per check and the quarantine mechanism are what determine whether these checks help or become an ignored alert stream.',
    watchOut:
      'Thresholds set from a quiet period will fire constantly during seasonal peaks. Derive expectations from a window that includes the variation you actually have.',
    related: ['data-contracts', 'reconciliation-jobs', 'anomaly-detection-alerting', 'data-lineage'],
    tags: ['data', 'quality', 'monitoring', 'pipelines'],
  },

  {
    id: 'data-lineage',
    name: 'Data Lineage',
    aka: ['provenance tracking', 'impact analysis', 'downstream dependency graph'],
    origin: 'Data governance practice; column-level lineage tooling since the 2010s',
    domains: ['data', 'engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Track where each dataset and column comes from and who consumes it, so you can answer both what broke this number and what will break if I change this.',
    useWhen: [
      'this figure looks wrong and I cannot trace where it came from',
      'we want to delete an unused table and cannot prove it is unused',
      'a source outage happened and we do not know which reports are affected',
      'nobody can say which dashboards depend on this column',
    ],
    prompt:
      'Establish lineage for this data platform and state what each level of granularity buys. Table-level lineage answers impact questions coarsely; column-level answers them precisely and is what lets you retire a field safely. Then define the two workflows it must serve: downstream impact analysis before a change, and upstream root cause tracing when a number is wrong. Specify how lineage is captured — parsed from queries, emitted by the orchestrator, or declared — and how staleness is prevented, since manually maintained lineage is wrong within a month. Finish with the consumption side, including dashboards and exports, which is usually the missing half of the graph.',
    why:
      'Lineage that stops at the warehouse boundary cannot answer the question people actually ask, which is about reports and consumers. Naming that gap is what makes the graph useful.',
    watchOut:
      'Lineage shows structural dependency, not semantic dependency. A downstream metric can be broken by a change in meaning that leaves the graph untouched.',
    related: ['data-contracts', 'data-quality-checks', 'dimensional-modeling', 'right-to-erasure-design'],
    tags: ['data', 'governance', 'dependencies', 'impact analysis'],
  },

  {
    id: 'reconciliation-jobs',
    name: 'Reconciliation Jobs',
    aka: ['drift detection', 'consistency sweep', 'audit and repair'],
    origin: 'Financial systems practice; standard in eventually consistent architectures',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Periodically compare two systems that should agree, report the differences, and repair them — because in any distributed system they will diverge.',
    useWhen: [
      'the search index and the database disagree and we only find out from users',
      'our totals do not match the payment provider\'s',
      'a failed event left two systems inconsistent and nobody noticed',
      'we fix these discrepancies manually every month',
    ],
    prompt:
      'Design a reconciliation process between these two systems. Define the comparison: which is authoritative for each field, the key used to match records, and the tolerance for legitimate timing differences so a record in flight is not reported as a discrepancy. Then split detection from repair, and be conservative about automatic repair — specify which discrepancy classes may be fixed automatically and which must be reviewed, since an automatic repair running the wrong direction destroys data at scale. Finish with the metric that matters: the count and age of unresolved discrepancies, alerting on trend rather than on any single one.',
    why:
      'Separating detection from repair, and alerting on the trend in discrepancy count, is what turns reconciliation into an early warning system rather than a monthly chore.',
    watchOut:
      'A reconciliation job that always finds a few discrepancies trains everyone to ignore it. Drive the steady-state count to zero or the signal is worthless.',
    related: ['partial-failure-handling', 'data-quality-checks', 'idempotent-pipelines', 'eventual-consistency'],
    tags: ['data', 'consistency', 'operations', 'repair'],
  },

  {
    id: 'idempotent-pipelines',
    name: 'Idempotent Pipelines',
    aka: ['rerunnable jobs', 'overwrite semantics', 'deterministic reprocessing'],
    origin: 'Data engineering practice; central to Airflow-style orchestration',
    domains: ['data', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'A job should produce the same result whether it runs once or five times, so recovery is simply re-running rather than a bespoke repair.',
    useWhen: [
      'rerunning the failed job double counted everything',
      'we have to write manual cleanup scripts every time a pipeline fails',
      'backfilling a week means being very careful about what already ran',
      'the retry created duplicate rows',
    ],
    prompt:
      'Make this pipeline safe to re-run. The key move is replacing append semantics with replace-partition semantics: each run should overwrite a deterministic slice of output keyed by the period it processes, rather than adding to whatever is there. Show that structure for our job. Then remove the sources of non-determinism that break it — reading the current time inside the job, depending on late-arriving data without a defined cut-off, and generating random identifiers rather than deriving them from input. Finish with the parameterisation that lets us reprocess an arbitrary historic period with one command, since that capability is the point of the whole exercise.',
    why:
      'Replace-by-partition is the concrete structural change that makes re-running safe, and non-determinism from reading the clock inside the job is the usual thing that defeats it.',
    watchOut:
      'Idempotence at the job level does not help if downstream consumers already read the earlier output. Reprocessing must account for what has already been published.',
    related: ['backfill-strategy', 'batch-vs-stream', 'idempotency-keys', 'reconciliation-jobs'],
    tags: ['data', 'pipelines', 'recovery', 'determinism'],
  },

  {
    id: 'bulk-load-strategy',
    name: 'Bulk Load Strategy',
    aka: ['mass insert', 'ETL loading', 'index rebuild during load'],
    origin: 'Database administration practice',
    domains: ['data', 'engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Loading large volumes row by row through the normal write path is orders of magnitude slower than the bulk mechanisms every database provides.',
    useWhen: [
      'importing the customer file takes eleven hours',
      'the nightly load is now overlapping with the morning traffic',
      'we insert a million rows one statement at a time',
      'the load competes with live traffic and slows everything down',
    ],
    prompt:
      'Design a fast, safe bulk load for this data. Compare the mechanisms available to us — native bulk copy, multi-row inserts, staging table then merge, and partition swap — on speed, on locking impact against live traffic, and on whether they are transactional. Then cover the surrounding decisions that dominate total time: dropping and rebuilding secondary indexes versus maintaining them during load, constraint checking, and batch sizing against transaction log growth. Specify the atomicity requirement: whether readers may see a partially loaded state, and if not, use a staging table with an atomic swap. Finish with resumability after a mid-load failure.',
    why:
      'Index maintenance and transaction log growth usually dominate load time, and the atomic swap is what lets a large load happen without exposing partial data to readers.',
    watchOut:
      'Bulk paths often bypass triggers, constraints and change capture. Anything depending on those will silently miss the loaded rows.',
    related: ['backfill-strategy', 'index-selection', 'batching-amortization', 'change-data-capture'],
    tags: ['data', 'databases', 'performance', 'etl'],
  },

  {
    id: 'backup-restore-testing',
    name: 'Restore Testing',
    aka: ['backup verification', 'recovery drill', 'untested backups'],
    origin: 'Operational practice; the maxim that you do not have backups until you have restored one',
    domains: ['engineering', 'data'],
    intents: ['critique', 'plan'],
    oneLiner:
      'A backup is a hypothesis until you restore it — test the restore path, its duration, and whether the restored data is actually usable.',
    useWhen: [
      'we have backups but have never restored one',
      'nobody knows how long a full restore would take',
      'the backup job reports success and I do not know what it contains',
      'we discovered the backup was missing a critical table during an incident',
    ],
    prompt:
      'Design restore verification for our data. Specify the drill: restore to an isolated environment on a schedule, and verify not just that it completed but that the data is correct — row counts against source, referential integrity, a sample of records checked in detail, and the application starting successfully against it. Record the wall-clock duration, since that is the recovery time nobody knows until they need it. Then check coverage explicitly: every database, but also object storage, secrets, configuration, message queues and anything created by hand that is not in version control. Finish with the scenarios beyond total loss — restoring a single table, and recovering from a corruption discovered a week later.',
    why:
      'The single-table restore and the week-old-corruption case are the ones that actually happen, and a backup strategy designed only for total loss handles neither well.',
    watchOut:
      'Backups that share credentials, account or region with production can be destroyed by the same event or actor. Isolation is part of the design, not a refinement.',
    related: ['point-in-time-recovery', 'data-retention-policy', 'single-point-of-failure-audit', 'game-day-exercise'],
    tags: ['data', 'backups', 'recovery', 'reliability'],
  },

  {
    id: 'point-in-time-recovery',
    name: 'Point-in-Time Recovery',
    aka: ['PITR', 'transaction log replay', 'recovery window'],
    origin: 'Database administration practice',
    domains: ['engineering', 'data'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Combine a base backup with continuous transaction logs so you can restore to any moment — specifically the moment before the bad migration ran.',
    useWhen: [
      'a bad script deleted rows and the nightly backup is twelve hours old',
      'we need to recover to just before the deploy',
      'someone dropped a table at 2pm and the backup is from midnight',
      'we cannot afford to lose a day of transactions',
    ],
    prompt:
      'Design recovery to an arbitrary moment for this database. State the achievable data-loss window from our log shipping interval, and how far back recovery is possible given retention — those two numbers are the actual guarantee, so verify them rather than assuming the defaults. Then walk the procedure for the common case, which is not total loss but a logical error: identifying the exact moment before the damage, restoring aside rather than in place, extracting only the affected records, and merging them back without discarding legitimate changes made since. Finish with how long the whole procedure takes and what is unavailable during it.',
    why:
      'Restoring aside and merging is the procedure that fits real incidents, where good data has accumulated since the damage. Restoring in place would discard it, and that is the mistake made under pressure.',
    watchOut:
      'Damage discovered late may already be replicated into every downstream system and analytic copy. The recovery plan has to include those, not just the primary.',
    related: ['backup-restore-testing', 'data-retention-policy', 'reconciliation-jobs', 'incident-command'],
    tags: ['data', 'recovery', 'backups', 'operations'],
  },

  {
    id: 'data-retention-policy',
    name: 'Data Retention Policy',
    aka: ['deletion schedule', 'storage lifecycle', 'keep-forever problem'],
    origin: 'Records management and privacy compliance practice',
    domains: ['data', 'security'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Decide per data category how long it is kept and what happens at the end, because storing everything forever is both a cost line and a liability.',
    useWhen: [
      'we keep every log and every record forever because storage is cheap',
      'the privacy assessment asked how long we retain this and nobody knew',
      'our oldest data is from a product we discontinued',
      'a breach would expose ten years of records we did not need',
    ],
    prompt:
      'Write a retention policy for our data categories. For each, state the retention period and the justification — legal requirement, operational need, or analytic value — with the specific rule cited rather than a guess, and be clear that a legal minimum is not a maximum. Then define the end-of-life action per category: hard deletion, anonymisation, or archival to cold storage, and where derived copies live that must be handled too, since retention enforced only on the primary store is not enforced. Finish with the enforcement mechanism, its verification, and how a legal hold suspends deletion for specific records without disabling the whole process.',
    why:
      'Derived copies and backups are where retention policies fail, and the legal hold exception is the one that has to be designed in rather than bolted on.',
    watchOut:
      'Deletion from a system with backups is not complete until the backups age out. State that window explicitly rather than claiming immediate erasure.',
    related: ['right-to-erasure-design', 'data-classification', 'data-minimization', 'audit-logging'],
    tags: ['data', 'privacy', 'compliance', 'storage'],
  },

  {
    id: 'data-classification',
    name: 'Data Classification',
    aka: ['sensitivity tiers', 'PII inventory', 'data tagging'],
    origin: 'Information security practice; required by most privacy regimes',
    domains: ['security', 'data'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Label data by sensitivity so that access rules, encryption, retention and logging follow automatically from the label rather than from case-by-case judgement.',
    useWhen: [
      'we do not actually know where personal data lives in our systems',
      'every access decision is argued individually',
      'the privacy review keeps discovering new stores of sensitive data',
      'a developer copied production data into a test environment',
    ],
    prompt:
      'Build a classification scheme for our data. Keep the tiers few and behaviourally distinct — each tier must imply different concrete controls for encryption, access approval, logging, retention, and whether it may exist outside production, or the tier is not earning its place. Then apply it at the field level for our main stores, flagging the categories people miss: free-text fields that will contain personal data regardless of intent, identifiers that are personal in combination, and derived or inferred attributes. Finish with how classification is kept current as schemas change, and how it is enforced in the pipeline that copies data to lower environments.',
    why:
      'Tiers that do not imply different controls are decoration. Anchoring each tier to specific mechanical consequences is what makes classification change behaviour.',
    watchOut:
      'Free-text fields defeat field-level classification because users paste anything into them. Treat them as sensitive by default rather than by inspection.',
    related: ['data-retention-policy', 'anonymization-techniques', 'data-minimization', 'row-level-security'],
    tags: ['security', 'privacy', 'data governance', 'classification'],
  },

  {
    id: 'anonymization-techniques',
    name: 'Anonymisation and Pseudonymisation',
    aka: ['de-identification', 'k-anonymity', 'masking test data'],
    origin: 'Privacy engineering; Sweeney\'s k-anonymity work, 2002',
    domains: ['security', 'data'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Removing names does not anonymise data — re-identification usually comes from combinations of quasi-identifiers, and reversible pseudonymisation is not anonymisation at all.',
    useWhen: [
      'we want to use production data in testing safely',
      'we removed the names so it is anonymous now',
      'the analytics team wants access to customer records',
      'someone asked whether this dataset still counts as personal data',
    ],
    prompt:
      'Assess this dataset for re-identification risk and design the treatment. Identify direct identifiers and then the quasi-identifiers whose combination narrows to an individual — postcode, birth date, job title, timestamps of activity, device characteristics — since that combination is how re-identification actually happens. Distinguish pseudonymisation, which is reversible and remains personal data, from anonymisation, which must be irreversible. Then choose techniques per field: suppression, generalisation, aggregation with a minimum group size, or noise. Finish by testing the result: pick a plausible attacker with an auxiliary dataset and show whether they could single someone out.',
    why:
      'Testing against a specific attacker with auxiliary data is what exposes weak de-identification, and the reversibility distinction determines the entire legal status of the result.',
    watchOut:
      'Masked test data that preserves referential structure and rare values can still identify people. High-cardinality outliers are the ones that leak.',
    related: ['data-classification', 'data-minimization', 'right-to-erasure-design', 'synthetic-test-data'],
    tags: ['security', 'privacy', 'data', 'compliance'],
  },

  {
    id: 'right-to-erasure-design',
    name: 'Designing for Erasure',
    aka: ['right to be forgotten', 'deletion propagation', 'GDPR deletion'],
    origin: 'Privacy regulation; GDPR Article 17 and equivalents',
    domains: ['security', 'data'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Being able to delete one person\'s data everywhere is an architectural property that has to be designed in, not a query you write when the first request arrives.',
    useWhen: [
      'we got a deletion request and cannot find all the copies',
      'personal data is in logs, backups, analytics and three vendors',
      'deleting the row breaks foreign keys and historic reports',
      'we say we delete data within thirty days and I am not sure we do',
    ],
    prompt:
      'Design the erasure capability for this system. Inventory every location personal data reaches — primary stores, replicas, caches, search indexes, logs, analytic warehouses, backups, and third-party processors — and give the deletion or expiry mechanism for each, noting where the honest answer is that data ages out rather than being deleted immediately. Then resolve the conflicts: records that must be retained for legal or financial reasons, and aggregates that would break. Anonymisation in place is usually the answer for those, so specify what is stripped and what remains. Finish with the tracking that proves each request was completed within the deadline.',
    why:
      'Enumerating every location and admitting where deletion is really expiry is what makes the compliance claim truthful, and the retain-versus-erase conflict needs deciding before a request arrives.',
    watchOut:
      'Deleting a user record while leaving their identifier in event logs and analytics does not satisfy the obligation. The identifier itself is personal data.',
    related: ['data-retention-policy', 'anonymization-techniques', 'data-lineage', 'data-minimization'],
    tags: ['privacy', 'compliance', 'data', 'deletion'],
  },

  {
    id: 'multi-tenancy-data-isolation',
    name: 'Tenant Data Isolation',
    aka: ['shared versus separate database', 'tenant boundary', 'silo versus pool'],
    origin: 'Software-as-a-service architecture practice',
    domains: ['engineering', 'security'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose between a shared schema with a tenant column, a schema per tenant, and a database per tenant, trading isolation strength against operational cost.',
    useWhen: [
      'one customer saw another customer\'s data',
      'an enterprise prospect is demanding their data be physically separate',
      'a large tenant is degrading performance for everyone',
      'migrating one tenant means touching a shared table with a billion rows',
    ],
    prompt:
      'Choose an isolation model for this platform. Compare the three levels on six dimensions: the strength of the guarantee against a coding error leaking data, per-tenant restore and export, noisy neighbour containment, schema migration cost as tenant count grows, per-tenant cost, and what enterprise customers will accept contractually. Recommend one, and if it is a shared schema, specify the enforcement that does not depend on developers remembering the filter — row-level security in the database or a mandatory query layer — since a forgotten predicate is the leak that actually happens. Finish with how a tenant could later be promoted to stronger isolation.',
    why:
      'The forgotten tenant predicate is the realistic failure mode, so pushing enforcement below the application is the decision that matters more than the storage layout.',
    watchOut:
      'Database-per-tenant looks safest and makes schema migrations and cross-tenant reporting genuinely hard at scale. That cost arrives later than the decision.',
    related: ['row-level-security', 'partitioning-strategy', 'bulkhead-isolation', 'cell-based-architecture'],
    tags: ['data', 'multi-tenancy', 'security', 'architecture'],
  },

  {
    id: 'row-level-security',
    name: 'Row-Level Security',
    aka: ['policy-based data access', 'database-enforced authorisation'],
    origin: 'Database security features; Oracle VPD, PostgreSQL RLS',
    domains: ['security', 'data'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Enforce which rows a caller may see in the database itself, so an application bug or an ad hoc query cannot bypass the rule.',
    useWhen: [
      'every query has to remember to filter by tenant and one did not',
      'a support tool queried the database directly and saw everything',
      'authorisation logic is duplicated across services',
      'we cannot prove that no code path can read another customer\'s rows',
    ],
    prompt:
      'Design database-enforced row filtering for this schema. Specify how caller identity reaches the database given we use connection pooling, since pooled connections share a session and that is the detail that makes or breaks this. Write the policies for read and for write separately — a policy that filters reads but permits writing a row into another tenant is a common gap. Then address the operational consequences: how policies interact with the query planner and indexes, how administrative and migration access is handled, and how a bypass for legitimate cross-tenant reporting is granted and audited. Finish with the tests that prove a leak is impossible rather than unlikely.',
    why:
      'Identity propagation through a connection pool and the write-side policy are the two implementation details that determine whether the control is real, and both are easy to get wrong invisibly.',
    watchOut:
      'Policies that reference other tables can make the planner ignore indexes and turn fast queries slow. Measure before rolling it out broadly.',
    related: ['multi-tenancy-data-isolation', 'least-privilege', 'audit-logging', 'trust-boundary'],
    tags: ['security', 'databases', 'authorisation', 'multi-tenancy'],
  },

  {
    id: 'database-per-service',
    name: 'Database per Service',
    aka: ['private data ownership', 'no shared database', 'data autonomy'],
    origin: 'Microservices practice; Chris Richardson\'s pattern catalogue',
    domains: ['engineering', 'data'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Each service owns its data privately and others must go through its interface, which buys independent evolution and costs you joins and transactions.',
    useWhen: [
      'three services write to the same table and nobody can change it',
      'a schema change requires coordinating four teams',
      'we split the services but they all still share one database',
      'one service\'s query load is hurting another\'s writes',
    ],
    prompt:
      'Assess private data ownership for these services. Identify the tables currently written by more than one service, since those are the boundary violations that block independent deployment, and propose which service should own each. Then confront what breaks: queries that currently join across the proposed boundary, and transactions that span it. For each, give the replacement — an interface call, a replicated read model kept current by events, or a redesign that moves the data to where it is used — with the consistency consequence stated. Finish with the migration sequence and how joins are handled in the intermediate state.',
    why:
      'Identifying multi-writer tables gives an objective boundary map, and forcing a replacement for every cross-boundary join is where the real cost of the pattern becomes visible.',
    watchOut:
      'Splitting the database without splitting ownership produces distributed coupling with none of the benefit. The organisational change is the harder half.',
    related: ['bounded-context', 'polyglot-persistence', 'saga-pattern', 'change-data-capture'],
    tags: ['data', 'microservices', 'ownership', 'architecture'],
  },

  {
    id: 'polyglot-persistence',
    name: 'Polyglot Persistence',
    aka: ['right tool for the data', 'multiple database types'],
    origin: 'Martin Fowler and Pramod Sadalage, NoSQL Distilled, 2012',
    domains: ['engineering', 'data'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Use different storage technologies for different access patterns — and count the operational cost of each additional one honestly before adopting it.',
    useWhen: [
      'someone wants to add a graph database for one feature',
      'we are running six different data stores and cannot staff them',
      'relational queries for this hierarchical data are horrible',
      'full-text search on the primary database is slow and crude',
    ],
    prompt:
      'Evaluate whether this workload justifies a different storage technology. First test whether our existing store can do it acceptably — modern relational databases handle documents, full text, queues and time series adequately, and the honest comparison is against a tuned version of what we already run, not the naive one. If a new store is still warranted, price the full cost: operational expertise, backup and restore, monitoring, security review, the synchronisation pipeline keeping it current, and the consistency gap that creates. Then state the exit plan, since data stores adopted for one feature are hard to remove later.',
    why:
      'Comparing against a tuned incumbent rather than the naive implementation eliminates most proposals, and pricing the synchronisation pipeline exposes the real ongoing cost.',
    watchOut:
      'Each additional store is another thing to secure, back up and be woken by. The marginal operational cost usually exceeds the estimate by a wide margin.',
    related: ['database-per-service', 'full-text-search-design', 'reconciliation-jobs', 'olap-oltp-separation'],
    tags: ['data', 'architecture', 'databases', 'trade-offs'],
  },

  {
    id: 'full-text-search-design',
    name: 'Full-Text Search Design',
    aka: ['relevance tuning', 'inverted index', 'analyzers and tokenisation'],
    origin: 'Information retrieval practice; Lucene-family search engines',
    domains: ['engineering', 'data'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Search quality comes from how text is analysed and how relevance is scored, not from the engine — and the failures are usually in tokenisation.',
    useWhen: [
      'searching for the exact product name does not return it',
      'results are technically matching and obviously useless to users',
      'search works in English and badly in every other language',
      'nobody can explain why this result ranks first',
    ],
    prompt:
      'Design search for this content. Start with analysis, since that is where most failures live: tokenisation for our content including identifiers and hyphenated terms, case and accent folding, stemming, stopwords, and synonyms — and show how a specific failing query is transformed at index time and at query time, because a mismatch between the two is the classic cause of a document that exists but cannot be found. Then design relevance: which fields are boosted, how recency and popularity are combined with text score, and how exact matches beat fuzzy ones. Finish with evaluation — a judged query set and a metric — so tuning is measurable rather than anecdotal.',
    why:
      'Index-time versus query-time analysis mismatch explains most missing results, and without a judged query set every relevance change is an unfalsifiable opinion.',
    watchOut:
      'Relevance tuning to satisfy one loud complaint usually degrades the aggregate. Measure against the judged set before and after every change.',
    related: ['polyglot-persistence', 'reconciliation-jobs', 'cache-invalidation-strategy', 'ranking-evaluation'],
    tags: ['data', 'search', 'relevance', 'information retrieval'],
  },

  {
    id: 'sql-injection-prevention',
    name: 'Parameterised Queries',
    aka: ['SQL injection prevention', 'prepared statements', 'query binding'],
    origin: 'Application security practice; OWASP guidance',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Separate the query structure from the values so user input can never be parsed as part of the statement — escaping is a workaround, binding is the fix.',
    useWhen: [
      'we build queries by concatenating strings with user input',
      'a penetration test found injection in a search filter',
      'we escape quotes and I am told that is not sufficient',
      'the dynamic sort parameter goes straight into the query',
    ],
    prompt:
      'Audit database access here for injection. Trace every query construction and classify it: fully parameterised, escaped by hand, or concatenated. Then address the case that defeats binding, which is the one worth your attention: identifiers such as table and column names, sort fields and directions cannot be bound as parameters, so those must be validated against an allowlist of permitted values rather than escaped — find every dynamic identifier in our code and give the allowlist. Then check the surrounding controls: the database account\'s privileges, stored procedures that build dynamic statements internally, and any query built inside a reporting or admin tool. Finish with the detection we could add.',
    why:
      'Dynamic identifiers are where parameterisation cannot help and where injection persists after the obvious cases are fixed, so the allowlist requirement is the finding that matters.',
    watchOut:
      'Object-relational mappers protect the values they bind and not the raw fragments people pass into them. Any raw expression is back to the concatenation problem.',
    related: ['input-validation-boundary', 'least-privilege', 'row-level-security', 'xss-prevention'],
    tags: ['security', 'databases', 'injection', 'validation'],
  },
]
