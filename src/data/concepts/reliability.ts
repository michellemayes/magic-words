import type { Concept } from '../types'

export const reliability: Concept[] = [
  {
    id: 'service-level-objectives',
    name: 'Service Level Objectives',
    aka: ['SLO', 'reliability target', 'SLA versus SLO'],
    origin: 'Google Site Reliability Engineering, 2016',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Set an explicit numeric reliability target for a user-visible behaviour, so reliability becomes a budget to spend rather than an argument to win.',
    useWhen: [
      'we argue about whether the system is reliable enough and never resolve it',
      'every incident triggers a demand for more hardening',
      'nobody can say how much downtime is actually acceptable',
      'the contract promises uptime and we do not measure the same thing',
    ],
    prompt:
      'Define objectives for this service. Start from the user journey rather than the infrastructure: what does a user do, and what makes that experience unacceptable. Write each objective as a measurable proportion of good events over total events, with the window stated, and be explicit about what counts as an event — because the denominator choice quietly determines whether one big customer\'s outage even registers. Propose a target based on what users would notice rather than on how many nines sound impressive, and state what the target implies operationally: the allowed downtime per month, and what we would have to stop doing to make it stricter.',
    why:
      'Targets picked as round numbers of nines are unmoored from user impact and unaffordable to defend. Deriving from journeys and stating the cost of one more nine makes it a real decision.',
    watchOut:
      'An objective nobody is willing to act on is worse than none, because it teaches the organisation that the number is decorative. Agree the consequence before the target.',
    related: ['sli-selection', 'error-budget-policy', 'availability-math', 'burn-rate-alerting'],
    tags: ['reliability', 'slo', 'measurement', 'operations'],
  },

  {
    id: 'sli-selection',
    name: 'Indicator Selection',
    aka: ['SLI', 'choosing the right metric', 'user-centred measurement'],
    origin: 'Google Site Reliability Engineering; the SRE Workbook',
    domains: ['engineering', 'data'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Pick the small number of measurements that actually track user happiness, and measure them where the user is rather than where it is convenient.',
    useWhen: [
      'all our dashboards are green and customers are complaining',
      'we measure server errors but users see timeouts at the edge',
      'the average response time hides the requests that failed',
      'we have four hundred metrics and no idea which matter',
    ],
    prompt:
      'Choose the indicators for this service. For each candidate, state the measurement point and what it misses — server-side latency misses network and client render time, success rate at the load balancer misses errors rendered as a valid page with an error message inside it. Prefer a ratio of good events to valid events, and define precisely which events are excluded and why, since exclusions are where these get gamed. Then check the proposed set against three past incidents: would each indicator have moved? An indicator that stayed flat during a real outage is not measuring what we care about.',
    why:
      'Testing candidate indicators against past incidents is the check that separates measurable from meaningful, and it is almost never done.',
    watchOut:
      'Every additional indicator dilutes attention. Three that map to user journeys beat twenty that map to components.',
    related: ['service-level-objectives', 'golden-signals', 'real-user-monitoring', 'dashboard-design'],
    tags: ['reliability', 'metrics', 'measurement', 'monitoring'],
  },

  {
    id: 'error-budget-policy',
    name: 'Error Budget Policy',
    aka: ['error budget', 'reliability budget', 'freeze policy'],
    origin: 'Google Site Reliability Engineering, 2016',
    domains: ['engineering'],
    intents: ['decide', 'prioritize'],
    oneLiner:
      'The allowed unreliability under an objective is a budget, and the policy says what changes when it is spent — that policy, not the number, is the mechanism.',
    useWhen: [
      'reliability work always loses to feature work until there is an outage',
      'we have targets but nothing happens when we miss them',
      'the team wants to ship and operations wants to stabilise and neither wins',
      'every outage produces a promise to do better and nothing changes',
    ],
    prompt:
      'Write the policy for what happens as this budget depletes. Define graduated responses rather than a single cliff: at fifty percent consumed, at seventy-five, and at exhausted — with each response being a concrete change in what the team does, such as reliability work taking priority over the roadmap or risky changes requiring additional review. Name who has authority to invoke and to override, and what an override must record. Then handle the case that breaks these policies: budget consumed by a single large incident outside the team\'s control, versus steady erosion, which deserve different responses. Say which of ours is which historically.',
    why:
      'A budget without a pre-agreed consequence is a number on a dashboard. Graduated responses and named authority are what let the policy fire without a negotiation during a bad week.',
    watchOut:
      'Freezing all feature work is a blunt response that breeds resentment and gaming of the measurement. Prefer changing what work is prioritised over stopping work entirely.',
    related: ['service-level-objectives', 'burn-rate-alerting', 'toil-reduction', 'corrective-action-tracking'],
    tags: ['reliability', 'prioritisation', 'policy', 'operations'],
  },

  {
    id: 'burn-rate-alerting',
    name: 'Burn Rate Alerting',
    aka: ['multi-window multi-burn-rate alerts', 'budget consumption alerts'],
    origin: 'Google SRE Workbook, 2018',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Alert on how fast the reliability budget is being consumed over several time windows at once, so fast outages page immediately and slow erosion still gets noticed.',
    useWhen: [
      'our alert fires on a brief blip that fixed itself',
      'a slow degradation ran for a week before anyone noticed',
      'we alert on a threshold and it is either too noisy or too late',
      'the page fired after the outage was already over',
    ],
    prompt:
      'Design budget-consumption alerts for this objective. Give at least two windows — a short one for fast burn that pages, and a long one for slow burn that opens a ticket — with the burn rate multiplier and the fraction of the budget consumed before firing for each, shown as arithmetic rather than assertion. Include the short secondary window that stops an alert from staying fired long after recovery. Then state the detection time and the minimum outage size each configuration can see, so we know what we are choosing not to detect, and map each alert to whether it pages a human or creates work for later.',
    why:
      'Threshold alerts on error rate are either noisy or slow, and the multi-window construction is the standard fix that most teams have never seen laid out numerically.',
    watchOut:
      'This requires a well-defined objective with a trustworthy denominator. Applied to a poorly chosen indicator it produces confident alerts about the wrong thing.',
    related: ['error-budget-policy', 'alert-fatigue', 'symptom-based-alerting', 'service-level-objectives'],
    tags: ['reliability', 'alerting', 'slo', 'monitoring'],
  },

  {
    id: 'availability-math',
    name: 'Availability Arithmetic',
    aka: ['nines', 'dependency availability multiplication', 'serial and parallel reliability'],
    origin: 'Reliability engineering; standard in system design practice',
    domains: ['engineering'],
    intents: ['estimate', 'explain'],
    oneLiner:
      'Availability of dependencies in series multiplies downward and redundancy multiplies failure probabilities — which usually shows a target is impossible before you build it.',
    useWhen: [
      'we promised four nines and I have no idea if that is achievable',
      'each service is reliable but the whole path is not',
      'someone wants a guarantee that exceeds what our vendors provide',
      'we added redundancy and availability barely improved',
    ],
    prompt:
      'Compute the achievable availability of this request path. List every dependency in series including the ones people forget — DNS, the load balancer, the identity provider, the certificate authority, the payment processor — with each one\'s published or observed availability, and multiply. Compare the result against our target and state the gap plainly. Then evaluate redundancy for the weakest links, and be rigorous about correlated failure: two instances sharing a control plane, a region, or a configuration deployment do not multiply independently. Finish with the achievable target given the dependencies we cannot change.',
    why:
      'The serial multiplication almost always shows the promised target is unattainable, and the correlated-failure correction is what stops redundancy being over-credited.',
    watchOut:
      'Vendor availability numbers describe their control plane, often exclude planned maintenance, and are measured differently from your users\' experience. Treat them as optimistic.',
    related: ['service-level-objectives', 'single-point-of-failure-audit', 'dependency-failure-matrix', 'multi-region-failover'],
    tags: ['reliability', 'estimation', 'dependencies', 'availability'],
  },

  {
    id: 'golden-signals',
    name: 'Four Golden Signals',
    aka: ['latency traffic errors saturation', 'monitoring basics'],
    origin: 'Google Site Reliability Engineering, 2016',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'If you can only watch four things per service, watch latency, traffic, errors and saturation — and watch latency of failures separately from successes.',
    useWhen: [
      'we do not know what to put on the dashboard for a new service',
      'we monitor CPU and disk but not whether users are being served',
      'the graphs look fine and something is clearly wrong',
      'a new service went live with no monitoring at all',
    ],
    prompt:
      'Instrument this service against the four signals, and apply the refinements that make them useful. Split latency by outcome, since fast failures otherwise flatter the distribution and hide an outage. Report latency as a distribution with high percentiles rather than a mean. Define saturation against the resource that will actually run out first for this workload — often a connection pool or a queue rather than CPU — and state how you determined that. For each signal, give the alerting threshold and whether it pages, and note what class of problem this set is blind to, which is usually correctness.',
    why:
      'Splitting latency by outcome and choosing the right saturation resource are the two refinements that turn a generic dashboard into one that catches real incidents.',
    watchOut:
      'These four say nothing about whether the answers are correct. A service happily returning wrong data at low latency looks perfect here.',
    related: ['red-method', 'use-method', 'sli-selection', 'saturation-monitoring'],
    tags: ['reliability', 'monitoring', 'metrics', 'observability'],
  },

  {
    id: 'red-method',
    name: 'RED Method',
    aka: ['rate errors duration', 'request-centric monitoring'],
    origin: 'Tom Wilkie, Weaveworks, 2015',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'For anything that serves requests, track rate, errors and duration per endpoint — a uniform shape that makes every service comparable on one dashboard.',
    useWhen: [
      'every team built a different dashboard and none of them are comparable',
      'during an incident we cannot tell which service is the problem',
      'we have metrics per service but no consistent way to read them',
      'onboarding to a new service means learning a new dashboard',
    ],
    prompt:
      'Apply a uniform request-centric metric shape across our services. Define the three measures with consistent naming and labels so one dashboard template works everywhere, and specify the label set carefully — enough to identify an endpoint, not so much that cardinality explodes. Then define errors precisely, because that definition is where consistency breaks: does a rejection due to invalid input count, does a rate limit response count, does a client cancellation count? Write the rule and apply it identically everywhere. Finish with the template dashboard and how a responder would use it to narrow from symptom to service in under a minute.',
    why:
      'The value is entirely in uniformity, and uniformity dies on inconsistent error definitions and label sets. Nailing both is the actual work.',
    watchOut:
      'This covers request-driven services only. Batch jobs, stream processors and queue consumers need a different shape based on lag and throughput.',
    related: ['use-method', 'golden-signals', 'metric-cardinality', 'dashboard-design'],
    tags: ['reliability', 'monitoring', 'metrics', 'standardisation'],
  },

  {
    id: 'use-method',
    name: 'USE Method',
    aka: ['utilisation saturation errors', 'resource-centric analysis'],
    origin: 'Brendan Gregg, 2012',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'For every resource, check utilisation, saturation and errors — a checklist that finds the constrained resource quickly instead of guessing.',
    useWhen: [
      'the machine looks fine but everything is slow',
      'I do not know which resource is the bottleneck',
      'CPU is at forty percent so it cannot be a capacity problem',
      'the performance problem moves around and I keep chasing it',
    ],
    prompt:
      'Walk this system resource by resource with a utilisation, saturation and error reading for each. Enumerate the resources completely, including the ones without obvious gauges: CPU, memory, storage capacity and throughput, network, but also file descriptors, thread pools, connection pools, lock contention and any fixed-size queue. Saturation is the column that finds most problems, so for each resource say specifically what queueing looks like and how to observe it. Then produce a ranked shortlist of suspects with the exact command or query that would confirm each, so this becomes a procedure rather than a description.',
    why:
      'Utilisation-only monitoring misses the resources that queue rather than saturate visibly. Demanding a saturation observation per resource is what surfaces the real constraint.',
    watchOut:
      'This finds resource bottlenecks and not logical ones. An inefficient algorithm or a lock convoy will show as saturation somewhere without telling you the cause.',
    related: ['golden-signals', 'saturation-monitoring', 'queueing-theory-basics', 'observability-triage'],
    tags: ['reliability', 'performance', 'diagnosis', 'resources'],
  },

  {
    id: 'saturation-monitoring',
    name: 'Saturation and Headroom',
    aka: ['headroom monitoring', 'queue depth', 'utilisation limits'],
    origin: 'Queueing theory applied to operations; Google SRE practice',
    domains: ['engineering'],
    intents: ['diagnose', 'estimate'],
    oneLiner:
      'Watch how much work is waiting rather than how busy things are, because latency rises sharply well before utilisation reaches one hundred percent.',
    useWhen: [
      'the system fell over at seventy percent CPU and we did not expect it',
      'latency doubled with no change in traffic',
      'we plan capacity from average utilisation and keep getting surprised',
      'everything is fine until suddenly it is not, with no warning',
    ],
    prompt:
      'Identify the saturation signals for this system and derive the operating limit. Explain, with the relevant queueing relationship, why waiting time climbs non-linearly as utilisation approaches capacity, and compute the utilisation at which our latency objective would be violated — that number, not one hundred percent, is our ceiling. Then list the observable queues: run queue, connection pool wait time, thread pool queue depth, disk request queue, message backlog. For each, give the healthy range and the alerting threshold, set so we get warning before the knee of the curve rather than after it.',
    why:
      'Sizing to a percentage of capacity without the queueing relationship is why systems fall over below full utilisation. Deriving the ceiling from the latency objective is the correction.',
    watchOut:
      'Bursty arrivals push you over the knee at much lower average utilisation than smooth arrivals. Average utilisation is a poor guide when traffic is spiky.',
    related: ['use-method', 'queueing-theory-basics', 'capacity-planning', 'backpressure'],
    tags: ['reliability', 'performance', 'capacity', 'queueing'],
  },

  {
    id: 'observability-instrumentation',
    name: 'Wide Structured Events',
    aka: ['observability instrumentation', 'canonical log lines', 'high cardinality events'],
    origin: 'Charity Majors, Honeycomb; Stripe\'s canonical log line practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Emit one rich event per unit of work carrying every dimension you might slice by, instead of scattered log lines and pre-aggregated counters.',
    useWhen: [
      'the dashboard shows a spike and I cannot find which requests caused it',
      'the problem only affects one customer and our metrics are aggregated',
      'I have to grep across five services to reconstruct one request',
      'every new question needs a code change and a deploy to answer',
    ],
    prompt:
      'Design a single wide event per request for this service. List the fields it should carry, covering identity (user, tenant, request id, trace id), routing (endpoint, version, region, instance, feature flags active), outcome (status, error class, retry count), and cost (duration, database time, external call time, rows examined, bytes returned). The design test is unknown-unknowns: name three questions we cannot answer today and show which fields make each answerable without a deploy. Then state the sampling strategy, keeping all errors and slow requests while sampling the fast successful ones, and the resulting volume.',
    why:
      'Pre-aggregated metrics can only answer questions you thought of first. Designing against three currently-unanswerable questions is the test that produces the right field set.',
    watchOut:
      'Wide events are expensive to store and easy to fill with personal data. Sampling and field-level redaction have to be part of the design, not an afterthought.',
    related: ['structured-logging', 'distributed-tracing', 'metric-cardinality', 'observability-cost-control'],
    tags: ['observability', 'logging', 'instrumentation', 'debugging'],
  },

  {
    id: 'distributed-tracing',
    name: 'Distributed Tracing',
    aka: ['spans and traces', 'OpenTelemetry', 'request tracing'],
    origin: 'Google Dapper, 2010; standardised by OpenTelemetry',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Propagate a trace identifier through every hop so one request\'s path across services becomes a single timeline you can read.',
    useWhen: [
      'the request is slow and I cannot tell which service is responsible',
      'a request touches nine services and I have nine separate logs',
      'we found the error but not what called it',
      'nobody can explain why this endpoint got slower last month',
    ],
    prompt:
      'Plan tracing for this system. Context propagation is the whole battle, so enumerate every boundary the trace context must cross — synchronous calls, message queues where it has to ride in headers, background jobs, thread and coroutine handoffs, and third-party callbacks — and identify where it would be lost today, since a broken trace is worse than none. Then define span naming and the attributes carried, keeping them low cardinality on the span name and rich in attributes. Specify the sampling decision, where it is made, and how it stays consistent across services so traces are not half-captured.',
    why:
      'Traces break at asynchronous boundaries and inconsistent sampling, and both produce a system that looks instrumented while giving unusable data. Auditing the boundaries first prevents that.',
    watchOut:
      'Head-based sampling decides before knowing whether the request was interesting, so it usually discards the errors you needed. Tail-based sampling costs more and captures them.',
    related: ['observability-instrumentation', 'deadline-propagation', 'observability-triage', 'tail-latency'],
    tags: ['observability', 'tracing', 'microservices', 'latency'],
  },

  {
    id: 'structured-logging',
    name: 'Structured Logging',
    aka: ['machine-readable logs', 'key-value logging', 'JSON logs'],
    origin: 'Widespread operational practice; formalised in twelve-factor logging',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Log events as fields rather than sentences, so they can be filtered, aggregated and joined instead of grepped with increasingly desperate regular expressions.',
    useWhen: [
      'finding anything in the logs means writing a regular expression',
      'the same event is logged in three different formats',
      'I cannot count how often this happened without parsing free text',
      'the log message changed and our alerting silently stopped working',
    ],
    prompt:
      'Convert this logging to structured events. Define the standard field set every log line carries — timestamp, level, service, version, trace id, request id, tenant — and the rule that variable data goes in fields while the message stays a stable constant, because interpolated messages are exactly what breaks downstream queries. Then audit our existing lines for the two failure modes: personal or secret data being logged, and messages that embed values in the text. Finish with the retention and volume implication, and the small number of lines that should be treated as an audit record with stricter retention rather than as an operational log.',
    why:
      'The stable-message-plus-fields rule is what makes logs queryable, and separating audit records from operational logs is the distinction that prevents both being wrong.',
    watchOut:
      'Structured logs are more verbose and more expensive. Without sampling and level discipline the bill grows faster than the usefulness.',
    related: ['log-level-discipline', 'log-sampling', 'observability-instrumentation', 'audit-logging'],
    tags: ['observability', 'logging', 'operations', 'debugging'],
  },

  {
    id: 'log-level-discipline',
    name: 'Log Level Discipline',
    aka: ['severity levels', 'when to use warn', 'logging policy'],
    origin: 'Long-standing operational convention; syslog severity lineage',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Give each level an operational meaning — who acts, and when — rather than a vague sense of importance, so filtering by level actually means something.',
    useWhen: [
      'everything is logged at info and the signal is buried',
      'we get thousands of warnings a day and ignore all of them',
      'errors are logged for things that are handled fine',
      'turning on debug in production is the only way to understand anything',
    ],
    prompt:
      'Define what each level means here in terms of action rather than severity: error means a human must eventually look and something did not work for a user, warn means the system handled it but a pattern of these matters, info means a record of normal significant transitions, debug means detail useful when investigating. Then audit our current usage against those definitions and report the two common errors — handled situations logged as errors, which is why nobody trusts the error count, and genuine failures logged as warnings. Finish with the mechanism for raising verbosity in production for one request or one tenant without a deploy.',
    why:
      'Defining levels by required action rather than by adjective makes the audit mechanical and directly reduces alert noise driven by log-based alerts.',
    watchOut:
      'A library that logs errors for conditions the caller handles will pollute your signal regardless of your policy. Those need suppressing at the boundary.',
    related: ['structured-logging', 'alert-fatigue', 'log-sampling', 'error-message-design'],
    tags: ['observability', 'logging', 'noise', 'operations'],
  },

  {
    id: 'log-sampling',
    name: 'Log Sampling',
    aka: ['adaptive sampling', 'telemetry volume control', 'head and tail sampling'],
    origin: 'High-volume observability practice; Honeycomb and Google sampling designs',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Keep a representative fraction of routine telemetry and all of the interesting parts, so you can afford the volume without losing the events that matter.',
    useWhen: [
      'our logging bill is larger than our compute bill',
      'we turned off debug logging and now we are blind',
      'one noisy endpoint generates ninety percent of our log volume',
      'we cannot keep everything and do not know what to drop',
    ],
    prompt:
      'Design a sampling policy for this telemetry. Define the retention rules by class: keep every error, every slow request and every event for a small always-on set of traced tenants, then sample successful fast requests at a rate derived from the volume we can afford. Include the sampling rate as a field on every retained event so downstream aggregations can reweight correctly — omitting this is what makes sampled data lie about volumes. Then specify dynamic behaviour: increase retention automatically when error rates rise, and allow per-tenant or per-endpoint overrides during an investigation without a deploy.',
    why:
      'Sampled telemetry without a stored sample rate produces silently wrong counts, and that mistake survives for years. Making it a required field is the fix.',
    watchOut:
      'Sampling destroys your ability to answer questions about rare events after the fact. Decide in advance which rare things are always kept.',
    related: ['observability-cost-control', 'structured-logging', 'distributed-tracing', 'observability-instrumentation'],
    tags: ['observability', 'cost', 'logging', 'sampling'],
  },

  {
    id: 'metric-cardinality',
    name: 'Metric Cardinality',
    aka: ['label explosion', 'time series cardinality', 'high cardinality metrics'],
    origin: 'Prometheus and time-series database operational practice',
    domains: ['engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'Every distinct combination of label values is a separate stored series, so one unbounded label can multiply your monitoring cost by thousands overnight.',
    useWhen: [
      'our monitoring system fell over after a deploy',
      'someone added a user id as a metric label',
      'queries that used to be instant now time out',
      'the metrics bill jumped and nobody knows why',
    ],
    prompt:
      'Audit these metrics for cardinality. For each label, state its expected distinct values and multiply across labels per metric to get the series count — then flag any label that is unbounded by nature: user id, request id, full URL path with identifiers, error message text, container id in an autoscaling group. For each, give the alternative: bucket it, strip the variable segment, or move that dimension to a wide event or a trace where high cardinality belongs. Then propose a guardrail that stops a future deploy from doing this again, and say what it costs to enforce.',
    why:
      'The multiplication is what people fail to do, and the correct fix is usually to move the dimension into events rather than to delete the question. Naming both is the useful output.',
    watchOut:
      'Aggressive label stripping removes the ability to answer per-tenant questions during an incident. Move those dimensions elsewhere rather than losing them.',
    related: ['observability-cost-control', 'observability-instrumentation', 'red-method', 'dashboard-design'],
    tags: ['observability', 'metrics', 'cost', 'scaling'],
  },

  {
    id: 'dashboard-design',
    name: 'Dashboard Design',
    aka: ['operational dashboards', 'incident dashboards', 'graph hygiene'],
    origin: 'Operational practice; influenced by Tufte and by SRE dashboard conventions',
    domains: ['engineering', 'design'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'A dashboard should answer a specific question for a specific reader in seconds — most are a wall of graphs that answer nothing under pressure.',
    useWhen: [
      'during an incident nobody knows which dashboard to open',
      'we have sixty panels and read none of them',
      'the graphs look alarming and we cannot tell if that is normal',
      'each dashboard was built by one person for one investigation',
    ],
    prompt:
      'Redesign this dashboard around a stated question and reader. Structure it top-down: user-visible symptoms first, then the service-level signals, then the resource detail — so a responder moves from is-it-broken to what-is-broken without switching pages. For every panel, state the question it answers and what a bad value looks like; delete any panel that fails that test. Add the context that makes graphs readable under stress: the objective threshold drawn on the panel, the comparison to the same time last week, and deployment markers. Finish with the one-sentence summary at the top that says whether we are currently healthy.',
    why:
      'Requiring a question and a bad-value definition per panel is a ruthless filter, and comparison-to-last-week is what makes an unfamiliar graph interpretable during an incident.',
    watchOut:
      'Dashboards are for exploring known failure shapes. Novel incidents need ad hoc querying, so do not let dashboard building substitute for queryable telemetry.',
    related: ['sli-selection', 'red-method', 'observability-triage', 'alert-fatigue'],
    tags: ['observability', 'dashboards', 'incident response', 'visualisation'],
  },

  {
    id: 'alert-fatigue',
    name: 'Alert Fatigue',
    aka: ['pager noise', 'alarm fatigue', 'alert hygiene'],
    origin: 'Clinical alarm fatigue research; adapted in operations practice',
    domains: ['engineering'],
    intents: ['diagnose', 'prioritize'],
    oneLiner:
      'When most alerts are not actionable, responders stop reading them — so noise is not merely annoying, it is the mechanism by which real alerts get missed.',
    useWhen: [
      'we get forty pages a night and most are nothing',
      'the on-call engineer acknowledges alerts without reading them',
      'we missed a real incident because it looked like the usual noise',
      'nobody wants to be on call anymore',
    ],
    prompt:
      'Audit our alerts using the actionability test: for each, what would a responder do at three in the morning, and would that action be different from doing nothing? Classify every alert as page (a human must act now), ticket (act during working hours) or delete. Then measure rather than assume — for each alert, pull how many times it fired in the last month and how many resulted in a corrective action, and delete or downgrade anything with a poor ratio. Finish with the two structural fixes: alerts that fire per instance rather than per service, and alerts on causes that should be alerts on symptoms.',
    why:
      'Firing-versus-action ratios turn a subjective complaint into a delete list, and the page-ticket-delete triage is the decision most alerting setups have never made.',
    watchOut:
      'Deleting a noisy alert without addressing the underlying instability just removes the evidence. Track whether the condition still occurs after you stop paging on it.',
    related: ['symptom-based-alerting', 'runbook-writing', 'on-call-health', 'burn-rate-alerting'],
    tags: ['reliability', 'alerting', 'on-call', 'noise'],
  },

  {
    id: 'symptom-based-alerting',
    name: 'Symptom-Based Alerting',
    aka: ['alert on symptoms not causes', 'user-facing alerting'],
    origin: 'Rob Ewaschuk, My Philosophy on Alerting, Google, 2013',
    domains: ['engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Page on what users are experiencing, not on the many internal conditions that might one day cause it — causes belong in the investigation, not the pager.',
    useWhen: [
      'we page on high CPU and it usually means nothing',
      'we have an alert for every possible failure cause and still miss outages',
      'the disk filled up and the alert fired but users were fine',
      'each alert tells us a component is unhappy but not whether anyone is affected',
    ],
    prompt:
      'Restructure these alerts around user-visible symptoms. For each existing alert, decide whether it describes something a user would notice or an internal condition, and for the internal ones ask whether the symptom it predicts is already covered — if so, delete it. Keep cause-based alerts only in the specific case where the cause gives useful lead time before harm, such as a resource that will exhaust in hours, and treat those as tickets not pages. Then check coverage the other way: for each way this service could fail a user, name the alert that would fire, and list the failure modes with no alert at all.',
    why:
      'The both-directions audit is what makes this work — removing cause alerts without checking symptom coverage leaves gaps, and that is the fear that keeps the noise around.',
    watchOut:
      'Symptom alerts arrive later than cause alerts by construction. That is acceptable only if your diagnosis tooling is good enough to close the gap.',
    related: ['alert-fatigue', 'burn-rate-alerting', 'runbook-writing', 'sli-selection'],
    tags: ['reliability', 'alerting', 'monitoring', 'on-call'],
  },

  {
    id: 'anomaly-detection-alerting',
    name: 'Anomaly Detection Alerting',
    aka: ['dynamic thresholds', 'seasonality-aware alerting', 'baseline deviation'],
    origin: 'Statistical process control applied to monitoring',
    domains: ['engineering', 'data'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Alert on deviation from expected behaviour rather than a fixed threshold — useful where load varies wildly, treacherous where the baseline drifts wrong.',
    useWhen: [
      'traffic varies so much that any fixed threshold is wrong',
      'the seasonal pattern means our alert fires every weekend',
      'we want to catch a drop in orders that is not zero but is clearly wrong',
      'a slow degradation never crosses the threshold we set',
    ],
    prompt:
      'Assess dynamic thresholds for this metric. Characterise the signal first: daily and weekly seasonality, trend, known scheduled events, and how noisy it is at the resolution we alert on — because a signal this method cannot model will produce alerts nobody can interpret. Then choose the approach, from a simple comparison against the same period last week through to a fitted model, and prefer the simplest that works. Define behaviour around the known failure cases: holidays and marketing pushes, a gradual regression that the baseline learns as normal, and the cold start after a deploy changes the pattern legitimately.',
    why:
      'The baseline-learns-the-regression failure is the fundamental weakness of these methods, and naming it forces a static floor alongside the dynamic one.',
    watchOut:
      'An anomaly alert nobody can explain gets ignored faster than a noisy threshold. If the responder cannot see why it fired, it will not be acted on.',
    related: ['symptom-based-alerting', 'burn-rate-alerting', 'alert-fatigue', 'metric-cardinality'],
    tags: ['reliability', 'alerting', 'statistics', 'monitoring'],
  },

  {
    id: 'runbook-writing',
    name: 'Runbook Writing',
    aka: ['playbook', 'operational procedure', 'alert response guide'],
    origin: 'Operations practice; formalised in SRE and ITIL traditions',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'plan'],
    oneLiner:
      'Write the procedure for a known failure so that a tired responder who has never seen it can act correctly without waking the expert.',
    useWhen: [
      'the same person gets called every time because only they know the fix',
      'the alert fires and the responder does not know what to do next',
      'our documentation describes the system but not what to do when it breaks',
      'the runbook exists and is three years out of date',
    ],
    prompt:
      'Write the response procedure for this alert. Lead with what the alert means in user terms and how to confirm the impact is real, since misdiagnosis wastes the first ten minutes. Then give numbered steps with the exact commands or links, expected output for each, and a decision point after each step. Include the parts that are usually missing: how to tell that the mitigation worked, how to undo it, when to escalate and to whom by role, and what to do if the obvious fix does not work. Finish with the freshness mechanism — how this document is reviewed, and how a responder flags a step that has gone stale.',
    why:
      'Runbooks describe systems instead of prescribing actions, and they rot. Demanding expected output per step and an explicit staleness path is what keeps them usable.',
    watchOut:
      'A runbook for a fully understood failure is a candidate for automation instead. If the steps never require judgement, write a script.',
    related: ['symptom-based-alerting', 'incident-command', 'toil-reduction', 'alert-fatigue'],
    tags: ['reliability', 'documentation', 'incident response', 'on-call'],
  },

  {
    id: 'incident-command',
    name: 'Incident Command System',
    aka: ['incident commander', 'ICS', 'incident roles'],
    origin: 'US wildfire response, 1970s; adapted for technology by PagerDuty and Google',
    domains: ['engineering'],
    intents: ['plan', 'communicate'],
    oneLiner:
      'Assign explicit roles during an incident — command, operations, communications, scribe — so coordination stops competing with the actual fixing.',
    useWhen: [
      'during the outage six people were doing the same investigation',
      'the person fixing it kept getting interrupted for status updates',
      'nobody knew who was making decisions',
      'the incident channel had ninety messages and no decisions',
    ],
    prompt:
      'Define incident roles for our team at our size. Specify each role\'s responsibility and, importantly, what each role must not do — the commander does not debug, which is the rule everyone breaks. Include the declaration trigger, so someone assumes command early rather than after an hour of drifting, and the handover procedure for long incidents including what gets transferred. Define the communication cadence and who owns the external message. Then adapt honestly to our scale: if we have three people awake, say which roles combine and which must stay separate.',
    why:
      'Roles copied from large organisations do not fit small teams and get abandoned. Specifying the prohibitions and the small-team collapse is what makes it adoptable.',
    watchOut:
      'Formal command on a small incident is overhead that slows the fix. Define a severity threshold below which one person just handles it.',
    related: ['incident-severity-levels', 'escalation-policy', 'status-page-communication', 'blameless-postmortem'],
    tags: ['reliability', 'incident response', 'roles', 'coordination'],
  },

  {
    id: 'incident-severity-levels',
    name: 'Incident Severity Levels',
    aka: ['sev levels', 'incident classification', 'priority matrix'],
    origin: 'Operations practice; conventions from ITIL and modern SRE',
    domains: ['engineering'],
    intents: ['decide', 'communicate'],
    oneLiner:
      'A short ladder of severities with observable criteria, so the response, the people woken and the communication follow automatically from the classification.',
    useWhen: [
      'we debate how serious this is while the outage continues',
      'everything gets declared critical and then nothing does',
      'people are unsure whether to wake anyone up',
      'the same kind of problem gets treated differently each time',
    ],
    prompt:
      'Define a severity ladder for us with no more than four levels. For each, give observable criteria in terms of user impact and scope rather than internal component state, and pair it with the automatic consequences: who is paged, whether a commander is appointed, communication cadence, and whether a postmortem is required. Then include the two rules that stop this from being argued mid-incident — start high and downgrade rather than the reverse, and anyone may declare while only the commander may downgrade. Test the ladder against our last five incidents and show what each would have been classified as.',
    why:
      'Testing against real past incidents exposes ladders that everyone would classify differently, which is the failure that turns severity into a debate during an outage.',
    watchOut:
      'Severity is not the same as urgency of the fix. A slow-burning data corruption may be the most serious thing you have while nothing looks down.',
    related: ['incident-command', 'defect-triage-matrix', 'escalation-policy', 'blameless-postmortem'],
    tags: ['reliability', 'incident response', 'classification', 'process'],
  },

  {
    id: 'escalation-policy',
    name: 'Escalation Policy',
    aka: ['escalation path', 'paging chain', 'when to wake someone'],
    origin: 'On-call operations practice',
    domains: ['engineering'],
    intents: ['plan', 'decide'],
    oneLiner:
      'Pre-decide who gets involved, after how long, and on what trigger — so escalating is a routine step rather than a social judgement made at 3am.',
    useWhen: [
      'the on-call engineer struggled alone for two hours before asking for help',
      'people are reluctant to wake a senior colleague',
      'the alert went unacknowledged and nobody noticed',
      'we escalated to a manager who could not help',
    ],
    prompt:
      'Design our escalation policy. Specify the automatic layer first — unacknowledged alerts escalating after a fixed interval — then the human triggers, phrased as permissions rather than judgements: escalate after fifteen minutes without a working hypothesis, escalate immediately for anything touching data integrity or security, escalate when the mitigation would be irreversible. State explicitly that escalating is never criticised, because the social cost is the real blocker. Then define the escalation targets by capability rather than seniority, and separately define who is informed rather than engaged, since those are different lists.',
    why:
      'Escalation fails for social reasons, not technical ones. Framing triggers as permissions and separating engage-from-inform is what actually shortens time to help.',
    watchOut:
      'A policy that escalates to a manager for technical help wastes both people. Route to capability, and inform leadership on a separate track.',
    related: ['incident-command', 'on-call-health', 'incident-severity-levels', 'runbook-writing'],
    tags: ['reliability', 'on-call', 'incident response', 'process'],
  },

  {
    id: 'on-call-health',
    name: 'On-Call Health',
    aka: ['sustainable on-call', 'pager load', 'rotation design'],
    origin: 'Google SRE practice; widely adopted operational norms',
    domains: ['engineering', 'career'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Treat pager load as a measured, capped quantity with compensating rest, because an exhausted rotation produces slower incidents and departures.',
    useWhen: [
      'our best engineers are burning out from being on call',
      'the rotation is three people and one is on holiday',
      'people work a full day after being up all night',
      'nobody has fixed the recurring alert because they are too tired',
    ],
    prompt:
      'Assess the health of this rotation with numbers rather than impressions: pages per shift, proportion outside working hours, sleep interruptions per week, and the share of pages that were actionable. Compare against a sustainable ceiling and say how far off we are. Then propose the interventions in order of effect — reducing alert noise almost always beats adding people — and specify the recovery norms: time off after a bad night, and who covers. Also handle rotation size, since fewer than a certain number of people makes the schedule fragile and personally unsustainable no matter how quiet it is.',
    why:
      'On-call problems get treated as staffing when they are usually alert quality. Measuring actionable-page ratio first orders the interventions correctly.',
    watchOut:
      'Adding people to a noisy rotation spreads the damage rather than reducing it, and it removes the pressure that would have fixed the noise.',
    related: ['alert-fatigue', 'escalation-policy', 'toil-reduction', 'corrective-action-tracking'],
    tags: ['reliability', 'on-call', 'team health', 'operations'],
  },

  {
    id: 'status-page-communication',
    name: 'Incident Communication',
    aka: ['status page', 'customer updates during outage', 'external comms'],
    origin: 'Operational and customer support practice',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'plan'],
    oneLiner:
      'Tell affected users what is broken, what to do meanwhile, and when you will next update — early and in their language, not in yours.',
    useWhen: [
      'customers found out about the outage from social media',
      'our status page said all systems operational during the incident',
      'the update said we are investigating for three hours straight',
      'support was flooded because nobody knew what was happening',
    ],
    prompt:
      'Write the communication plan for this incident. Give the template for the first update, publishable within minutes and containing impact in user terms, what is unaffected, any workaround, and the time of the next update — deliberately not a cause, since early causes are usually wrong and get quoted back. Then define the cadence, the person who owns publishing, and the criteria for updating the severity publicly. Cover the awkward cases: an incident affecting only some customers, one caused by a third party, and one involving data exposure where legal review is required before anything is said.',
    why:
      'The next-update-time commitment is what stops the support flood, and avoiding early causes prevents the retraction that damages trust further. Both are usually missing.',
    watchOut:
      'A status page updated manually during a bad incident will be forgotten. Assign the role explicitly or automate the trigger.',
    related: ['incident-command', 'incident-severity-levels', 'blameless-postmortem', 'bluf'],
    tags: ['reliability', 'communication', 'incident response', 'customers'],
  },

  {
    id: 'mttr-decomposition',
    name: 'Time-to-Recovery Decomposition',
    aka: ['MTTR breakdown', 'detect diagnose mitigate', 'incident phase analysis'],
    origin: 'Incident analysis practice; common in SRE and DORA discussions',
    domains: ['engineering'],
    intents: ['diagnose', 'prioritize'],
    oneLiner:
      'Split recovery time into detect, engage, diagnose, mitigate and verify, because the phase that dominates tells you what to invest in.',
    useWhen: [
      'incidents take too long and we do not know where the time goes',
      'we keep buying monitoring but recovery is not getting faster',
      'we always find the cause quickly and still take hours to fix',
      'someone wants a target for incident duration and I need a plan',
    ],
    prompt:
      'Decompose our recent incidents into phases: time to detect, time to engage the right person, time to diagnose, time to mitigate, and time to verify recovery. Use the actual timestamps from the incident records rather than estimates. Then identify the dominant phase across incidents and match it to the intervention that addresses it specifically — detection means alerting and indicators, engagement means escalation and on-call, diagnosis means observability, mitigation means rollback capability and feature flags, verification means health signals. Recommend the single investment with the largest expected effect and estimate that effect from the data.',
    why:
      'Reliability investment is usually spread evenly across all phases. Measuring which phase dominates redirects spending to where it changes the number.',
    watchOut:
      'Averages across dissimilar incidents mislead. Segment by cause class before drawing conclusions, since a configuration error and a capacity failure have different profiles.',
    related: ['blameless-postmortem', 'observability-triage', 'corrective-action-tracking', 'deployment-rollback-plan'],
    tags: ['reliability', 'incident analysis', 'metrics', 'improvement'],
  },

  {
    id: 'corrective-action-tracking',
    name: 'Corrective Action Tracking',
    aka: ['postmortem action items', 'remediation follow-through'],
    origin: 'Safety engineering practice; standard in mature incident processes',
    domains: ['engineering'],
    intents: ['plan', 'prioritize'],
    oneLiner:
      'The value of a postmortem is entirely in the actions that get completed, so track them like committed work with owners, dates and a visible completion rate.',
    useWhen: [
      'we write good postmortems and nothing changes',
      'the same incident happened again six months later',
      'action items are logged and never prioritised against feature work',
      'nobody knows how many of last quarter\'s actions were done',
    ],
    prompt:
      'Turn these postmortem findings into trackable actions. For each, state the specific failure it prevents and classify it as prevention, detection or mitigation — a set with only prevention items is a warning sign, since you cannot prevent everything and faster detection often pays better. Give each an owner who has capacity, a date, and a size estimate, and explicitly cut the ones we will not do rather than leaving them to rot in a backlog. Then define the review mechanism: completion rate reported where leadership sees it, and a rule for what happens when an action from a repeat incident was never done.',
    why:
      'Action lists that are all prevention and no owner are the standard failure. Forcing the prevention-detection-mitigation split and explicit cuts is what makes the list real.',
    watchOut:
      'Too many actions per incident guarantees none get done. Three that ship beat fifteen that are catalogued.',
    related: ['blameless-postmortem', 'near-miss-reporting', 'error-budget-policy', 'mttr-decomposition'],
    tags: ['reliability', 'follow-through', 'postmortem', 'improvement'],
  },

  {
    id: 'near-miss-reporting',
    name: 'Near-Miss Reporting',
    aka: ['close call analysis', 'incidents that almost happened'],
    origin: 'Aviation and industrial safety practice; Heinrich\'s accident pyramid lineage',
    domains: ['engineering'],
    intents: ['diagnose', 'plan'],
    oneLiner:
      'Investigate the events that nearly caused harm but did not, because they are far more common than incidents and carry the same information at lower cost.',
    useWhen: [
      'we only learn from things that actually broke',
      'someone caught a bad deploy by luck and we moved on',
      'the safeguard worked but only just and nobody looked into why',
      'we would like to be proactive but only have incident data',
    ],
    prompt:
      'Set up near-miss capture for our team. Define what qualifies with concrete examples — a change reverted before customers noticed, an alert that fired because a safeguard held, a manual check that caught an error, an outage avoided because traffic happened to be low. Then design the reporting path to be lighter than an incident review, since friction is what kills these programmes: a short form, no blame, and a quick triage. Specify the triage rule that decides which get investigated, favouring those where the thing that saved us was luck or vigilance rather than a designed control.',
    why:
      'The luck-versus-control distinction is what makes near-miss data actionable: a save by an engineer noticing something is a control that will fail eventually.',
    watchOut:
      'Any hint that reporting leads to blame ends the flow of reports immediately and permanently. The confidentiality rules matter more than the form design.',
    related: ['blameless-postmortem', 'corrective-action-tracking', 'chaos-engineering', 'pre-mortem'],
    tags: ['reliability', 'safety', 'learning', 'prevention'],
  },

  {
    id: 'toil-reduction',
    name: 'Toil Reduction',
    aka: ['operational toil', 'manual work budget', 'automation prioritisation'],
    origin: 'Google Site Reliability Engineering, 2016',
    domains: ['engineering'],
    intents: ['prioritize', 'plan'],
    oneLiner:
      'Toil is manual, repetitive, automatable work that scales with the system rather than adding value — measure it, cap it, and automate the largest sources.',
    useWhen: [
      'the team spends every day on the same manual tasks',
      'growth means proportionally more operational work',
      'we never get to the improvement work because of the daily grind',
      'onboarding a new customer takes four hours of manual steps',
    ],
    prompt:
      'Inventory the operational work this team does and classify each item against the toil criteria: manual, repetitive, automatable, tactical, devoid of lasting value, and growing with scale. Measure hours per week for each rather than estimating impressions. Then rank automation candidates by hours saved against implementation cost, and apply the two filters that stop bad automation: tasks that are rare enough that automating costs more than it saves, and tasks where the manual step is actually a deliberate human checkpoint. For the top candidates, say whether the right fix is automation or eliminating the need entirely.',
    why:
      'Eliminating the need usually beats automating the task, and that option gets skipped when automation is the assumed answer. Measuring hours first also stops the loudest annoyance from winning.',
    watchOut:
      'Automation is itself a system that fails and needs maintenance. Automating a fragile process produces fast, confident, repeated errors.',
    related: ['on-call-health', 'runbook-writing', 'theory-of-constraints', 'operational-readiness-review'],
    tags: ['reliability', 'automation', 'operations', 'prioritisation'],
  },

  {
    id: 'chaos-engineering',
    name: 'Chaos Engineering',
    aka: ['fault injection', 'chaos monkey', 'resilience experiments'],
    origin: 'Netflix, Chaos Monkey 2011; Principles of Chaos Engineering, 2015',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Run controlled experiments that inject real failures into a system to test whether your beliefs about its resilience are true, before reality tests them for you.',
    useWhen: [
      'we think we would survive losing a node but have never checked',
      'the failover has never actually been exercised',
      'our resilience is a design document rather than a demonstrated property',
      'every incident reveals a dependency we did not know was critical',
    ],
    prompt:
      'Design a resilience experiment for this system. Structure it as a hypothesis with a measurable steady state — state what metric stays within what range if we are right — then the injected fault, the blast radius limit, and the abort condition with who can trigger it. Start with the smallest meaningful fault in the least critical environment, and say what would have to be true before we would run it in production. The important part is the prediction: write down what we expect to happen before running, because the value comes from the gap between prediction and result, and a run without a prediction teaches nothing.',
    why:
      'Written predictions are what turn fault injection into an experiment rather than a stunt, and blast radius plus abort criteria are what make it survivable.',
    watchOut:
      'Injecting failures into a system with poor observability produces an outage you cannot explain. Fix the ability to observe first.',
    related: ['game-day-exercise', 'dependency-failure-matrix', 'graceful-degradation', 'multi-region-failover'],
    tags: ['reliability', 'experiments', 'resilience', 'failure injection'],
  },

  {
    id: 'game-day-exercise',
    name: 'Game Day',
    aka: ['disaster recovery drill', 'incident simulation', 'fire drill'],
    origin: 'Amazon and Google operational practice',
    domains: ['engineering', 'learning'],
    intents: ['plan', 'critique'],
    oneLiner:
      'Rehearse a realistic failure with the actual people, tools and procedures, to find the gaps in the human system rather than only in the software.',
    useWhen: [
      'our runbooks have never been used by anyone but their author',
      'half the team has never handled a serious incident',
      'we do not know whether our recovery procedure still works',
      'the only person who knows the failover process is leaving',
    ],
    prompt:
      'Design a rehearsal for this failure scenario. Specify the scenario, the participants and — critically — who is deliberately unavailable, since exercises where the expert is present prove nothing about the ordinary case. Define what is simulated versus really broken, the safety controls, and the observers whose job is to record friction rather than help. The findings we want are about the human system: access somebody lacked, a runbook step that no longer works, a tool nobody could find, a decision nobody felt authorised to make. Finish with the debrief structure and how findings become tracked actions.',
    why:
      'Excluding the expert is the single change that turns a demonstration into a test, and recording friction rather than outcome is what produces useful findings.',
    watchOut:
      'A game day that everyone passes was probably too easy or too well telegraphed. If nothing surprising happens, the scenario was not realistic.',
    related: ['chaos-engineering', 'runbook-writing', 'multi-region-failover', 'near-miss-reporting'],
    tags: ['reliability', 'practice', 'incident response', 'training'],
  },

  {
    id: 'dependency-failure-matrix',
    name: 'Dependency Failure Matrix',
    aka: ['what breaks if this breaks', 'dependency impact analysis'],
    origin: 'Operational risk analysis; related to FMEA practice',
    domains: ['engineering'],
    intents: ['critique', 'plan'],
    oneLiner:
      'For every dependency, write down what happens to your service when it is slow, when it is down, and when it returns wrong answers — three different failures, usually only one is handled.',
    useWhen: [
      'we handle the dependency being down but not being slow',
      'a third party returned garbage and we passed it straight through',
      'nobody has listed what we actually depend on',
      'an outage in something we considered optional took us down',
    ],
    prompt:
      'Build the failure matrix for our dependencies. List every external thing in the request path including the ones people forget — identity providers, DNS, certificate validation, feature flag services, telemetry, package registries at build time. For each, fill three columns: behaviour when slow, when unavailable, and when returning incorrect or unexpected data. The slow column is where most systems are weakest, so be specific about timeout, retry and thread consumption. Mark each dependency as hard (we fail with it) or soft (we degrade), then flag every dependency we believed was soft but the matrix shows is hard.',
    why:
      'Slow and wrong are the unhandled cases, and the soft-turns-out-hard finding is the one that predicts real outages. The three-column structure forces both.',
    watchOut:
      'Transitive dependencies matter too. Your soft dependency may have a hard dependency on the same thing you do, which removes the independence you assumed.',
    related: ['single-point-of-failure-audit', 'circuit-breaker', 'graceful-degradation', 'availability-math'],
    tags: ['reliability', 'dependencies', 'risk', 'failure modes'],
  },

  {
    id: 'single-point-of-failure-audit',
    name: 'Single Point of Failure Audit',
    aka: ['SPOF analysis', 'bus factor for systems', 'critical path review'],
    origin: 'Reliability engineering practice',
    domains: ['engineering'],
    intents: ['critique', 'diagnose'],
    oneLiner:
      'Systematically find every component whose loss stops the system, including the non-software ones — a certificate, a domain registration, a single person, one account.',
    useWhen: [
      'we have redundancy everywhere and still had a total outage',
      'an expired certificate took down everything',
      'only one person can deploy and they are on holiday',
      'the redundant instances all failed at the same time',
    ],
    prompt:
      'Audit this system for single points of failure across four categories, since only the first is usually examined: infrastructure components, data stores and their backups, control planes such as deployment and DNS and secrets, and non-technical points including certificates and domain renewals, a single cloud account, a single vendor relationship, and knowledge held by one person. For each candidate, state what fails when it is lost and how long recovery takes. Then check the apparent redundancies for correlation — shared power, shared configuration, shared credentials, shared deployment — since correlated redundancy is the failure that surprises people.',
    why:
      'The category list is what makes this exhaustive: certificate expiry and one-person knowledge cause real outages and never appear on an infrastructure diagram.',
    watchOut:
      'Removing every single point of failure is not affordable. Rank by likelihood times recovery cost and accept the rest explicitly rather than implicitly.',
    related: ['dependency-failure-matrix', 'availability-math', 'bus-factor', 'backup-restore-testing'],
    tags: ['reliability', 'risk', 'redundancy', 'audit'],
  },

  {
    id: 'capacity-planning',
    name: 'Capacity Planning',
    aka: ['headroom planning', 'demand forecasting', 'load projection'],
    origin: 'Systems performance practice; standard in SRE and infrastructure planning',
    domains: ['engineering'],
    intents: ['estimate', 'plan'],
    oneLiner:
      'Project demand against measured capacity per unit, and know how long it takes to add more — the lead time is what determines how much headroom you need.',
    useWhen: [
      'we ran out of capacity during the campaign and could not add it fast enough',
      'nobody knows how much traffic we can actually handle',
      'we over-provision massively because we are scared',
      'the sales team promised a large customer and I do not know if we can serve them',
    ],
    prompt:
      'Produce a capacity plan for this service. Establish the unit of capacity from a load test rather than an estimate — requests per instance at our latency objective, not at saturation — then project demand from organic growth plus known events, with a range rather than a point. The critical parameter is provisioning lead time: how long from deciding to add capacity to serving traffic, including any quota approvals, and headroom must cover demand growth across that window plus the largest single failure we must absorb. Finish with the leading indicators that trigger action and the specific thing that runs out first.',
    why:
      'Headroom derived from lead time and failure absorption is defensible; a percentage buffer chosen by feel is not. The what-runs-out-first question also prevents scaling the wrong resource.',
    watchOut:
      'Autoscaling is not capacity planning. It hides the problem until you hit an account quota, a database connection ceiling, or a downstream limit that does not scale with you.',
    related: ['saturation-monitoring', 'load-testing-strategy', 'cloud-cost-attribution', 'availability-math'],
    tags: ['reliability', 'capacity', 'forecasting', 'scaling'],
  },

  {
    id: 'synthetic-monitoring',
    name: 'Synthetic Monitoring',
    aka: ['active probing', 'synthetic transactions', 'uptime checks'],
    origin: 'Web operations practice; standard in APM tooling',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Run scripted user journeys from outside your system on a schedule, so you detect breakage during quiet periods and see the path users actually traverse.',
    useWhen: [
      'the outage happened overnight and we found out from a customer',
      'our monitoring is all internal and misses network and DNS problems',
      'the login flow broke and no server error was logged',
      'we cannot tell whether the problem is us or the customer\'s network',
    ],
    prompt:
      'Design synthetic checks for this service. Choose journeys by business criticality rather than by ease of scripting — login, checkout, the primary read path — and run them from the locations our users are in, since running from the same cloud region as the service tests almost nothing about the path users take. Specify the test account strategy and how synthetic traffic is excluded from business metrics and rate limits, which is the detail that causes trouble later. Then set alerting so a single failed probe does not page, and say how a probe failure is distinguished from a probe infrastructure failure.',
    why:
      'The excluded-from-metrics and probe-versus-service distinction are the operational details that make synthetics trustworthy, and both are usually discovered after a false page.',
    watchOut:
      'Synthetic journeys drift out of date as the product changes and then silently test nothing. They need the same maintenance as any test suite.',
    related: ['real-user-monitoring', 'smoke-test-suite', 'health-check-design', 'testing-in-production'],
    tags: ['reliability', 'monitoring', 'availability', 'user journeys'],
  },

  {
    id: 'real-user-monitoring',
    name: 'Real User Monitoring',
    aka: ['RUM', 'field data', 'client-side telemetry'],
    origin: 'Web performance practice; standardised through browser performance APIs',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'estimate'],
    oneLiner:
      'Measure the experience of actual users on their own devices and networks, because lab measurements systematically flatter you.',
    useWhen: [
      'our synthetic tests are fast and users say the site is slow',
      'we optimised for our own laptops and nothing improved for customers',
      'we do not know how bad it is on mobile networks',
      'the average is fine and some segment is clearly suffering',
    ],
    prompt:
      'Design field measurement for this application. Specify the metrics that correspond to user perception rather than to technical milestones, and require them to be reported as distributions with high percentiles plus the segments that matter — device class, connection type, geography, and application version — since the aggregate always hides the suffering segment. Then handle the collection problems: the sample bias where users who abandon never report, the privacy constraints on what may be collected, and the volume. Finish with how field data is compared against lab measurements and what a persistent gap between them would mean.',
    why:
      'Survivorship bias in field data is real — the worst experiences are underreported because those users leave — and naming it changes how the numbers are read.',
    watchOut:
      'Client-side collection is subject to blockers, consent and sampling. Treat the population as approximate and never as a complete census.',
    related: ['synthetic-monitoring', 'core-web-vitals', 'sli-selection', 'percentile-latency'],
    tags: ['observability', 'performance', 'frontend', 'user experience'],
  },

  {
    id: 'health-check-design',
    name: 'Health Check Design',
    aka: ['liveness and readiness probes', 'health endpoints'],
    origin: 'Container orchestration practice; Kubernetes probe semantics',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Separate am-I-alive from am-I-ready-for-traffic from are-my-dependencies-healthy, because conflating them causes restarts and outages rather than preventing them.',
    useWhen: [
      'the orchestrator kept restarting a healthy service',
      'traffic went to instances that were still starting up',
      'a dependency blip caused every instance to be marked unhealthy at once',
      'our health endpoint returns ok no matter what',
    ],
    prompt:
      'Design the health endpoints for this service with three distinct semantics. Liveness must only fail when a restart would help — deadlock, unrecoverable state — and must never check dependencies, because a shared dependency failure would otherwise restart the entire fleet simultaneously, which is the classic self-inflicted outage. Readiness reflects whether this instance can serve now, including warm-up and connection pools, and may consider dependencies with care. Add a separate deep diagnostic endpoint for humans that is not wired to any automation. Then specify timeouts, thresholds and startup grace so a slow start is not read as failure.',
    why:
      'Liveness probes that check dependencies are a well-known way to convert a small outage into a total one, and the three-endpoint separation is the fix that most teams have not made.',
    watchOut:
      'A health check that only confirms the process is listening will report healthy while every request fails. It must exercise something meaningful.',
    related: ['graceful-shutdown', 'service-discovery', 'synthetic-monitoring', 'zero-downtime-deployment'],
    tags: ['reliability', 'containers', 'operations', 'availability'],
  },

  {
    id: 'graceful-shutdown',
    name: 'Graceful Shutdown',
    aka: ['connection draining', 'SIGTERM handling', 'clean termination'],
    origin: 'Unix signal conventions; formalised in container lifecycle practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'On a termination signal, stop accepting new work, finish or hand back what is in flight, then exit — otherwise every deploy drops requests.',
    useWhen: [
      'we see a burst of errors during every deployment',
      'in-flight requests are killed when a pod is replaced',
      'a background job was terminated halfway and left bad state',
      'scaling down causes customer-visible failures',
    ],
    prompt:
      'Implement clean termination for this service. Give the exact sequence and the timing: on the signal, fail readiness first and wait long enough for load balancers and service discovery to stop sending traffic — that wait is the step everyone omits, and it is why draining alone does not work. Then stop accepting new work, finish in-flight requests up to a deadline shorter than the platform\'s kill timeout, close pools and flush telemetry. Cover the harder cases: long-running requests that cannot finish in time, queue consumers that must return unacknowledged messages, and streaming connections that need a close frame.',
    why:
      'The pre-drain wait for load balancer propagation is the non-obvious step that turns a good-looking shutdown handler into one that actually stops the error spike.',
    watchOut:
      'If your shutdown takes longer than the platform grace period, you get killed mid-drain anyway. The two timeouts must be set together.',
    related: ['health-check-design', 'zero-downtime-deployment', 'service-discovery', 'backpressure'],
    tags: ['reliability', 'deployment', 'lifecycle', 'errors'],
  },

  {
    id: 'operational-readiness-review',
    name: 'Production Readiness Review',
    aka: ['launch checklist', 'operational readiness', 'go-live review'],
    origin: 'Google SRE production readiness reviews; common launch governance practice',
    domains: ['engineering'],
    intents: ['critique', 'plan'],
    oneLiner:
      'A structured check before a service takes real traffic, covering the operational properties that are painful to add afterwards.',
    useWhen: [
      'we launched a service with no alerting and found out the hard way',
      'the new system went live and nobody knew who owned it',
      'every launch surfaces the same set of missing basics',
      'we are about to take on a large customer and I want to know we are ready',
    ],
    prompt:
      'Review this service for production readiness. Cover ownership and on-call coverage, indicators and objectives, alerting with runbooks, dashboards, logging and tracing, capacity evidence from a load test, dependency failure behaviour, rollback capability, backup and restore verified by an actual restore, secrets handling, and data retention. For each, record the state as present, partial or absent with evidence rather than assertion. Then classify gaps as launch-blocking or accepted-with-a-date, and be strict that the blocking list is short and genuinely blocking — a checklist where everything is mandatory gets bypassed entirely.',
    why:
      'Requiring evidence rather than a tick, and forcing a short genuinely-blocking subset, is what keeps launch reviews from becoming a formality people route around.',
    watchOut:
      'A heavy review applied to a small internal tool is bureaucracy. Scale the checklist to the blast radius of the service.',
    related: ['toil-reduction', 'runbook-writing', 'health-check-design', 'definition-of-done'],
    tags: ['reliability', 'launch', 'checklist', 'governance'],
  },

  {
    id: 'observability-cost-control',
    name: 'Observability Cost Control',
    aka: ['telemetry spend', 'monitoring bill', 'data retention tiers'],
    origin: 'Operational practice as observability vendors became a major cost line',
    domains: ['engineering'],
    intents: ['prioritize', 'decide'],
    oneLiner:
      'Telemetry volume grows faster than traffic, so decide deliberately what is kept, at what resolution, for how long, and what question each tier answers.',
    useWhen: [
      'our monitoring costs more than the systems it monitors',
      'we are being asked to cut telemetry and do not know what is safe to drop',
      'retention was set to the default and never revisited',
      'one team\'s debug logging doubled the bill',
    ],
    prompt:
      'Build a tiered retention plan for our telemetry. For each signal type — metrics, logs, traces, events, profiles — state what question it answers, over what time horizon that question is asked, and therefore what resolution and retention it needs, since high resolution for a week plus downsampled for a year usually beats a single flat policy. Then attribute current spend by service and signal so the largest producers are visible, and identify pure waste: debug logging left on, duplicate signals collected by two systems, metrics with no dashboard or alert referencing them. Finish with a guardrail preventing a single change from multiplying volume.',
    why:
      'Attributing spend and finding metrics nothing references produces immediate savings without losing capability, which is what makes the cut defensible.',
    watchOut:
      'Cuts made in a hurry always remove the thing needed in the next incident. Tie each reduction to the questions it makes unanswerable.',
    related: ['log-sampling', 'metric-cardinality', 'cloud-cost-attribution', 'observability-instrumentation'],
    tags: ['observability', 'cost', 'retention', 'operations'],
  },

  {
    id: 'audit-logging',
    name: 'Audit Logging',
    aka: ['audit trail', 'tamper-evident log', 'accountability record'],
    origin: 'Security and compliance practice; required by many regulatory regimes',
    domains: ['engineering', 'security'],
    intents: ['structure', 'plan'],
    oneLiner:
      'A separate, append-only record of who did what to which resource and when, designed for accountability rather than for debugging.',
    useWhen: [
      'we cannot answer who changed this record',
      'the auditor asked for access history and we only have application logs',
      'an administrator action was disputed and we had no evidence',
      'our logs are rotated after a week and compliance wants a year',
    ],
    prompt:
      'Design the audit trail for this system. Define the events that must be recorded — authentication, authorisation decisions including denials, privileged actions, data access for sensitive records, configuration and permission changes — and the fields each carries: actor including on whose behalf if impersonating, action, resource, timestamp with timezone, source, and outcome. Then address the properties that distinguish this from ordinary logging: append-only storage, separate access control so the people being audited cannot alter it, retention driven by the regulation rather than by operations, and tamper evidence. Finish with how it is queried and by whom.',
    why:
      'Audit records get mixed into operational logs and are then deleted by retention policy or edited by the very administrators they track. Separating storage and access control is the point.',
    watchOut:
      'Audit logs concentrate sensitive information and are themselves a target. They need stricter access control than the systems they describe, not looser.',
    related: ['structured-logging', 'separation-of-duties', 'data-retention-policy', 'least-privilege'],
    tags: ['security', 'compliance', 'logging', 'accountability'],
  },
]
