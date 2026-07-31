import type { Concept } from '../types'

export const platform: Concept[] = [
  {
    id: 'platform-as-product',
    name: 'Platform as a Product',
    aka: ['internal developer platform', 'paved road', 'platform team as product team'],
    origin: 'Team Topologies and platform engineering practice',
    domains: ['engineering'],
    intents: ['reframe', 'plan'],
    oneLiner:
      'Treat the internal platform as something teams choose to use rather than are forced onto, which makes adoption the measure and usability the requirement.',
    useWhen: [
      'teams work around our platform instead of using it',
      'the platform team is a ticket queue everyone waits on',
      'we built a deployment system nobody likes',
      'adoption was mandated and people comply minimally',
    ],
    prompt:
      'Assess our internal platform as a product. Identify the users, which are engineering teams, and what job they are hiring the platform to do — usually shipping safely without learning the infrastructure underneath. Then measure the things a product would measure: adoption when it is optional, time from nothing to a running service, and where people work around it, since workarounds are the clearest feature requests you will get. Apply the design rule that makes platforms adopted: the paved path must be genuinely easier than doing it yourself, not merely mandated. Finish with the escape hatch for teams with legitimate needs the platform does not serve, and how those needs feed the roadmap.',
    why:
      'Optional adoption is the honest measure of whether a platform is useful, and treating workarounds as feature requests turns resistance into a roadmap.',
    watchOut:
      'A platform that mandates without being easier taxes every team and accumulates resentment that outlasts the technology.',
    related: ['golden-path-templates', 'team-topologies', 'developer-experience-metrics', 'self-service-guardrails'],
    tags: ['platform', 'developer experience', 'adoption', 'organisation'],
  },

  {
    id: 'golden-path-templates',
    name: 'Golden Path',
    aka: ['paved road', 'service templates', 'scaffolding with defaults'],
    origin: 'Netflix paved road; Spotify golden path',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Provide one well-supported way to build and run a service, with the right defaults baked in, so doing the correct thing takes less effort than improvising.',
    useWhen: [
      'every service is configured differently and none are quite right',
      'new services take two weeks to get logging and monitoring in place',
      'security requirements are met inconsistently across teams',
      'each team reinvents the same deployment setup',
    ],
    prompt:
      'Design a supported path for creating a service here. Specify what the template provides from the first commit: build and deployment pipeline, health checks, structured logging, metrics and tracing, secret handling, dependency scanning, and ownership metadata — since anything not provided by default will be missing in half our services. Then address the maintenance problem, which is what kills templates: generated code diverges immediately and cannot be updated centrally, so specify what is generated once versus what is consumed as a versioned shared component. Finish with the deviation policy: how a team departs when justified, and what support they lose by doing so.',
    why:
      'The generated-versus-consumed split determines whether improvements ever reach existing services, and it is the difference between a template and a platform.',
    watchOut:
      'A path that only suits one kind of service pushes everyone else off it entirely. Cover the common cases well rather than all cases badly.',
    related: ['platform-as-product', 'self-service-guardrails', 'operational-readiness-review', 'pipeline-as-code'],
    tags: ['platform', 'templates', 'standards', 'developer experience'],
  },

  {
    id: 'self-service-guardrails',
    name: 'Self-Service with Guardrails',
    aka: ['policy as code', 'safe defaults', 'preventive controls'],
    origin: 'Cloud platform engineering practice',
    domains: ['engineering', 'security'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Let teams provision what they need without approval, inside boundaries enforced automatically — so speed and control stop being a trade-off.',
    useWhen: [
      'every infrastructure change needs a ticket to the platform team',
      'someone created a publicly accessible storage bucket',
      'we control risk by requiring approval and it is a bottleneck',
      'teams are blocked for days waiting for a database to be created',
    ],
    prompt:
      'Design guardrails that let teams self-serve safely. Distinguish preventive controls, which make an unsafe configuration impossible, from detective controls, which find it afterwards, and prefer the first for anything genuinely dangerous — public data exposure, unencrypted storage, unrestricted network access, missing ownership tags. List which of ours belong in each category. Then define what is freely self-serviceable inside those boundaries, what requires a conversation, and what is prohibited. Specify the exception path with an owner and an expiry. Finish with the feedback quality: a blocked action must explain what was wrong and what to do instead, or teams will simply file tickets again.',
    why:
      'Explaining what to do instead when a guardrail blocks something is what preserves self-service, since an unexplained denial sends the team straight back to the ticket queue.',
    watchOut:
      'Guardrails that only detect after the fact mean the exposure existed. For anything involving data exposure, prevention is the only acceptable control.',
    related: ['platform-as-product', 'infrastructure-as-code', 'iam-policy-design', 'least-privilege'],
    tags: ['platform', 'security', 'automation', 'governance'],
  },

  {
    id: 'immutable-infrastructure',
    name: 'Immutable Infrastructure',
    aka: ['no in-place updates', 'replace not patch', 'cattle not pets'],
    origin: 'Cloud infrastructure practice; term popularised by Chad Fowler, 2013',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Never modify a running server — build a new image and replace it, so what is running always matches what was built and tested.',
    useWhen: [
      'two servers that should be identical behave differently',
      'somebody logged in and changed something and nobody knows what',
      'rebuilding a machine from scratch does not produce the same result',
      'configuration drift means we cannot trust any environment',
    ],
    prompt:
      'Move this infrastructure toward replace-rather-than-modify. Identify everything currently changed in place — package installs, configuration edits, manual fixes, agents installed after provisioning — and move each into the image build or into runtime configuration supplied at start. Then address the things that genuinely cannot be immutable: persistent data, and any state accumulated by a running instance, so specify where that lives and how it survives replacement. Finish with the operational consequences: no more logging in to fix things, which requires that diagnosis happens through telemetry, and a replacement path fast enough that rebuilding is the natural response to a problem.',
    why:
      'The no-more-logging-in consequence is the real change, and it only works if telemetry is good enough to diagnose without a shell, which has to be true before adopting the discipline.',
    watchOut:
      'Making infrastructure immutable while leaving the deployment slow means every trivial change becomes expensive, and people will start editing in place again.',
    related: ['infrastructure-as-code', 'container-image-hygiene', 'artifact-immutability', 'reproducible-builds'],
    tags: ['platform', 'infrastructure', 'consistency', 'operations'],
  },

  {
    id: 'container-image-hygiene',
    name: 'Container Image Hygiene',
    aka: ['minimal base images', 'image layers', 'distroless'],
    origin: 'Container security and performance practice',
    domains: ['engineering', 'security'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Everything in the image is attack surface, download time and something to patch — most images contain a whole operating system to run one process.',
    useWhen: [
      'our images are one and a half gigabytes',
      'the vulnerability scanner reports two hundred issues in the base image',
      'the image contains a compiler and a package manager in production',
      'pulling images is the slowest part of scaling up',
    ],
    prompt:
      'Review these container images. Report the size and its composition by layer, then apply the reductions: multi-stage builds so build tooling never reaches the final image, a minimal base containing only what the process needs, and removal of package managers, shells and debugging tools from production images — noting the trade, since a shell-less image is harder to debug and that has to be answered with telemetry. Then order layers so rarely-changing dependencies cache well. Finish with the supply chain requirements: pinned base image digests rather than moving tags, a rebuild cadence for base image patches, and running as a non-root user.',
    why:
      'Pinning base images by digest and defining a rebuild cadence is what keeps them both reproducible and patched, which are usually treated as conflicting goals.',
    watchOut:
      'A pinned base image never rebuilt accumulates unpatched vulnerabilities. Pinning without a rebuild schedule trades one risk for another.',
    related: ['immutable-infrastructure', 'patch-management', 'vulnerability-triage', 'build-cache-strategy'],
    tags: ['platform', 'containers', 'security', 'performance'],
  },

  {
    id: 'container-resource-limits',
    name: 'Container Resource Limits',
    aka: ['requests and limits', 'CPU throttling', 'out of memory kills'],
    origin: 'Container orchestration practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Requests decide where a workload is placed and limits decide when it is throttled or killed — setting them badly causes latency and restarts that look like application bugs.',
    useWhen: [
      'the container keeps getting killed and we do not know why',
      'the application is slow and CPU usage looks low',
      'we set limits by guessing and nobody has revisited them',
      'the node is full but the workloads on it are idle',
    ],
    prompt:
      'Set resource requests and limits for this workload from measurement rather than guesswork. Explain the asymmetry that governs the decision: exceeding a memory limit means the process is killed, while exceeding a CPU limit means throttling that shows up as latency with no obvious error — which is why unexplained slowness with low apparent usage is usually throttling. Derive requests from typical usage and limits from peak plus headroom, using observed distributions. Then check the runtime interaction, since a managed runtime that sizes its heap from the host rather than the limit will be killed regardless of the setting. Finish with the monitoring for throttling and near-limit memory.',
    why:
      'CPU throttling presenting as inexplicable latency is the diagnosis teams miss for months, and runtimes reading host memory instead of the container limit is the cause of most mysterious kills.',
    watchOut:
      'Setting limits equal to requests everywhere wastes capacity, while omitting limits lets one workload starve its neighbours. The right answer differs by workload class.',
    related: ['workload-scheduling', 'garbage-collection-tuning', 'rightsizing-resources', 'bulkhead-isolation'],
    tags: ['platform', 'containers', 'resources', 'diagnosis'],
  },

  {
    id: 'workload-scheduling',
    name: 'Workload Scheduling',
    aka: ['affinity and anti-affinity', 'bin packing', 'disruption budgets'],
    origin: 'Cluster orchestration practice',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Control where workloads run and how they are moved, so redundant instances do not land on the same machine and maintenance does not take a service down.',
    useWhen: [
      'all three replicas were on the node that failed',
      'a routine node upgrade caused an outage',
      'our batch jobs are starving the user-facing services',
      'the cluster is full and scaling is not helping',
    ],
    prompt:
      'Design placement rules for these workloads. Specify anti-affinity so replicas of one service spread across failure domains, since co-located replicas mean redundancy that does not survive a single machine or rack failure. Then set disruption budgets so voluntary operations such as upgrades cannot remove more instances than the service can lose, which is what makes routine maintenance safe. Add priority and preemption so latency-sensitive work displaces batch under pressure rather than queueing behind it. Finish with the trade-off: strict placement rules reduce packing efficiency and can leave workloads unschedulable, so state where we should be strict and where best-effort is enough.',
    why:
      'Anti-affinity and disruption budgets together are what make redundancy real, and both are absent by default so redundancy is nominal until they are configured.',
    watchOut:
      'Over-constrained placement leaves workloads pending with no obvious error while the cluster appears to have capacity.',
    related: ['container-resource-limits', 'bulkhead-isolation', 'cell-based-architecture', 'autoscaling-policy'],
    tags: ['platform', 'orchestration', 'availability', 'scheduling'],
  },

  {
    id: 'stateful-workloads',
    name: 'Stateful Workloads on Orchestrators',
    aka: ['databases in containers', 'persistent volumes', 'stateful sets'],
    origin: 'Container orchestration practice',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Running stateful systems on an orchestrator built around disposable instances demands stable identity, attached storage and careful failure handling — or a managed service instead.',
    useWhen: [
      'we want to run our database on the same cluster as everything else',
      'a node was replaced and the data volume did not follow',
      'the orchestrator restarted our database mid-transaction',
      'someone is proposing running a data store ourselves',
    ],
    prompt:
      'Assess running this stateful system on our cluster. Confront the mismatch directly: orchestrators assume instances are interchangeable and replaceable, while this system needs stable identity, its own storage, ordered startup and controlled shutdown. State what our orchestrator provides for each and what remains our responsibility, particularly failover, backup, and the behaviour when the cluster decides to move an instance. Then compare against a managed service on total operational cost including expertise, on-call burden and the consequences of getting recovery wrong. Recommend one, and if self-hosting, specify the operator or automation that encodes the recovery procedures.',
    why:
      'Naming the orchestrator-assumption mismatch explicitly is what surfaces the work that remains yours, which is where teams underestimate self-hosting a data store.',
    watchOut:
      'The failure modes here are data loss rather than downtime. The bar for operational maturity is much higher than for stateless workloads.',
    related: ['workload-scheduling', 'backup-restore-testing', 'polyglot-persistence', 'total-cost-of-ownership'],
    tags: ['platform', 'databases', 'containers', 'operations'],
  },

  {
    id: 'autoscaling-policy',
    name: 'Autoscaling Policy',
    aka: ['horizontal scaling rules', 'scale-out triggers', 'scaling lag'],
    origin: 'Cloud operations practice',
    domains: ['engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Automatic scaling responds after the load arrives, so the metric, the thresholds and the time to become useful determine whether it helps or oscillates.',
    useWhen: [
      'traffic spiked and the new instances arrived after the incident',
      'the cluster scales up and down repeatedly every few minutes',
      'we scale on CPU and our bottleneck is something else',
      'autoscaling is on and we still fall over under load',
    ],
    prompt:
      'Design a scaling policy for this service. Choose the metric that actually reflects saturation for this workload — often queue depth or concurrent requests rather than CPU — and justify it. Then account for the total time from the signal to a useful instance, including instance start, application warm-up and readiness, since that lag determines how much headroom must be maintained; show the arithmetic. Specify separate scale-up and scale-down behaviour with cool-down to prevent oscillation, being aggressive up and conservative down. Then set the bounds and what happens at the maximum, and identify the downstream dependencies that do not scale with us and will break first.',
    why:
      'Scaling lag determines required headroom, and the downstream dependency that does not scale is what turns successful autoscaling into an outage somewhere else.',
    watchOut:
      'Autoscaling hides capacity problems until you hit an account quota or a downstream limit, at which point you have no time left to react.',
    related: ['capacity-planning', 'cold-start-optimization', 'quota-management', 'connection-pooling'],
    tags: ['platform', 'scaling', 'cloud', 'capacity'],
  },

  {
    id: 'rightsizing-resources',
    name: 'Rightsizing',
    aka: ['instance sizing', 'over-provisioning', 'utilisation review'],
    origin: 'Cloud cost management practice',
    domains: ['engineering'],
    intents: ['estimate', 'prioritize'],
    oneLiner:
      'Match allocated resources to actual usage, which usually means shrinking, since defaults are generous and nobody revisits a size that works.',
    useWhen: [
      'our average CPU utilisation across the fleet is eight percent',
      'we sized this for a launch three years ago',
      'the cloud bill grows faster than our traffic',
      'nobody knows why this instance is so large',
    ],
    prompt:
      'Analyse resource allocation against actual usage. For each significant workload, compare allocated against observed usage at several percentiles over a period long enough to include peaks and seasonal patterns, since sizing on the average causes failures and sizing on the maximum wastes most of the money. Recommend the size with the headroom justified by the peak-to-typical ratio and the scaling lag. Then check the dimension that is usually wrong: workloads sized on memory that are actually CPU constrained or vice versa, which means a different instance family rather than a different size. Finish with the review cadence and automation to prevent drift.',
    why:
      'Choosing the wrong instance family is a bigger and more common error than choosing the wrong size, and it only shows up when you compare usage across dimensions.',
    watchOut:
      'Rightsizing to the observed peak leaves nothing for an unusual event. Keep headroom proportional to how fast you can add capacity.',
    related: ['cloud-cost-attribution', 'capacity-planning', 'container-resource-limits', 'autoscaling-policy'],
    tags: ['platform', 'cost', 'cloud', 'efficiency'],
  },

  {
    id: 'spot-capacity-strategy',
    name: 'Interruptible Capacity',
    aka: ['spot instances', 'preemptible workloads', 'discounted capacity'],
    origin: 'Cloud provider pricing models',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Deeply discounted capacity that can be reclaimed at short notice — excellent for interruption-tolerant work and dangerous for anything that cannot checkpoint.',
    useWhen: [
      'our batch processing costs far more than it should',
      'we moved jobs onto the cheap reclaimable machines and they keep failing',
      'the finance team is asking why compute costs so much',
      'we want the discount and are unsure what can safely use it',
    ],
    prompt:
      'Assess which of our workloads can use interruptible capacity. The criterion is whether the work can be interrupted and resumed without loss, so classify ours: batch jobs that checkpoint, stateless workers with requeueable tasks, and build agents are usually suitable, while anything holding session state or a long uncheckpointed computation is not. For the suitable ones, specify the interruption handling — the notice period, what must be saved or returned to the queue in that window, and the fallback to on-demand capacity when interruptible is unavailable. Then diversify across instance types and zones so a single capacity shortage does not remove everything at once. Finish with the realistic saving.',
    why:
      'Using the interruption notice window properly and diversifying across capacity pools are what make this reliable, and both are skipped by teams that simply switch the setting on.',
    watchOut:
      'Interruptible capacity can be reclaimed en masse when demand rises, which is often exactly when your traffic is also high.',
    related: ['rightsizing-resources', 'cloud-cost-attribution', 'graceful-shutdown', 'workload-scheduling'],
    tags: ['platform', 'cost', 'cloud', 'batch'],
  },

  {
    id: 'serverless-tradeoffs',
    name: 'Serverless Trade-offs',
    aka: ['functions as a service', 'managed runtime', 'no servers to manage'],
    origin: 'Cloud platform practice; AWS Lambda, 2014',
    domains: ['engineering'],
    intents: ['decide', 'explain'],
    oneLiner:
      'Paying per invocation with no capacity to manage suits spiky and event-driven work, and imposes limits on duration, concurrency, state and local debugging.',
    useWhen: [
      'our traffic is spiky and we pay for idle capacity all day',
      'someone wants to rewrite everything as functions',
      'our function times out on the largest inputs',
      'local development and testing has become painful',
    ],
    prompt:
      'Evaluate a managed function runtime for this workload. Match it against the shape it suits — spiky or infrequent, event-driven, short-lived, stateless — and state whether ours fits. Then enumerate the constraints that will bite: maximum execution duration, cold start latency for user-facing paths, concurrency limits and how they interact with downstream capacity such as database connections, package size, and the difficulty of reproducing the environment locally. Compare cost at our actual volume, since per-invocation pricing crosses over to being more expensive at sustained high load — show that crossover. Finish with the operational differences in debugging and tracing.',
    why:
      'The cost crossover point and the concurrency-versus-database-connections interaction are the two things that make this decision concrete rather than ideological.',
    watchOut:
      'Function concurrency can scale far faster than your database can accept connections, turning a traffic spike into a database outage.',
    related: ['cold-start-optimization', 'connection-pooling', 'total-cost-of-ownership', 'autoscaling-policy'],
    tags: ['platform', 'serverless', 'cloud', 'architecture'],
  },

  {
    id: 'cold-start-optimization',
    name: 'Cold Start Optimisation',
    aka: ['function initialisation latency', 'provisioned concurrency', 'warm instances'],
    origin: 'Serverless operations practice',
    domains: ['engineering'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'The first request to a new instance pays initialisation cost that later requests do not, and the users who pay it are a fixed proportion of your traffic.',
    useWhen: [
      'some requests take three seconds and most take fifty milliseconds',
      'the slow requests seem random with no pattern',
      'our function is fast in testing and slow for real users',
      'the first request after a quiet period always times out',
    ],
    prompt:
      'Reduce initialisation cost for this workload. Break the cold start into its parts — platform provisioning, runtime start, dependency loading, and our own initialisation such as configuration fetches and connection setup — and measure each, because our own initialisation is usually the largest and the only part we control. Then attack it: defer work not needed for the first request, cache configuration, avoid heavy dependency graphs, and consider a runtime with faster startup. Then evaluate keeping instances warm against its cost and whether it actually eliminates the problem at scale-up. Finish with the proportion of requests affected, which decides how much this matters.',
    why:
      'Measuring the proportion of requests that hit a cold start converts an anecdote into a prioritisation decision, and our own initialisation being the dominant term is the actionable finding.',
    watchOut:
      'Provisioned warm capacity removes the discount that made the platform attractive. At that point compare honestly against always-running instances.',
    related: ['serverless-tradeoffs', 'jit-warmup', 'tail-latency', 'autoscaling-policy'],
    tags: ['platform', 'serverless', 'latency', 'performance'],
  },

  {
    id: 'session-affinity',
    name: 'Session Affinity',
    aka: ['sticky sessions', 'server affinity', 'stateless servers'],
    origin: 'Load balancing practice',
    domains: ['engineering'],
    intents: ['decide', 'diagnose'],
    oneLiner:
      'Routing a user consistently to one instance solves local state and creates uneven load, awkward deployments and failures when that instance goes away.',
    useWhen: [
      'users get logged out when we deploy',
      'the load is uneven across instances and we cannot see why',
      'the shopping cart empties when a request hits a different server',
      'we cannot scale down because instances hold user sessions',
    ],
    prompt:
      'Assess whether we need sticky routing here. First identify what state is held locally and whether it could be externalised or held by the client instead, since removing the need for affinity is almost always better than configuring it — say what that would take. If affinity is genuinely required, such as for long-lived connections, specify the mechanism and its failure behaviour: what happens when the target instance is removed during a deploy or a scale-down, and whether the user notices. Then address the consequences: uneven load distribution, the difficulty of draining an instance, and how a session survives a rolling update.',
    why:
      'Framing affinity as a symptom of local state, with the cost of externalising it stated, usually shows the sticky routing was avoidable at less cost than living with it.',
    watchOut:
      'Affinity concentrates the impact of losing one instance onto a specific subset of users, which makes the failure look sporadic and hard to diagnose.',
    related: ['read-your-writes', 'graceful-shutdown', 'zero-downtime-deployment', 'consistent-hashing'],
    tags: ['platform', 'load balancing', 'state', 'deployment'],
  },

  {
    id: 'workload-placement',
    name: 'Workload Placement',
    aka: ['edge versus region', 'data locality', 'where should this run'],
    origin: 'Distributed infrastructure practice',
    domains: ['engineering'],
    intents: ['decide', 'estimate'],
    oneLiner:
      'Where code runs relative to its users and its data determines latency and cost — and moving compute to the edge without its data usually makes things slower.',
    useWhen: [
      'users on another continent have a much worse experience',
      'we moved logic to the edge and it got slower',
      'the data residency requirement means we need regional deployments',
      'we cannot decide whether to run this close to users or close to the database',
    ],
    prompt:
      'Decide where each part of this system should run. Classify by what it needs: work depending on a single authoritative data store belongs near that store, work depending only on the request belongs near the user, and cacheable content belongs at the edge. Then compute the latency for each placement including the round trips to data, since edge compute that calls back to a distant database is slower than doing everything centrally — show that arithmetic. Layer in the constraints: data residency requirements, cost of cross-region transfer, and operational complexity per additional location. Finish with the smallest set of locations meeting the requirement.',
    why:
      'The edge-compute-with-central-data arithmetic is the specific analysis that prevents an expensive architectural mistake that sounds obviously good.',
    watchOut:
      'Each additional region multiplies deployment, monitoring and consistency work. The operational cost rises faster than the latency benefit.',
    related: ['cdn-edge-caching', 'multi-region-failover', 'data-transfer-cost', 'latency-numbers'],
    tags: ['platform', 'latency', 'architecture', 'cloud'],
  },

  {
    id: 'data-transfer-cost',
    name: 'Data Transfer Cost',
    aka: ['egress charges', 'cross-zone traffic', 'network cost surprises'],
    origin: 'Cloud pricing practice',
    domains: ['engineering'],
    intents: ['diagnose', 'estimate'],
    oneLiner:
      'Moving bytes between zones, regions and out to the internet is charged asymmetrically, and the architecture decides the bill more than the traffic volume does.',
    useWhen: [
      'the network line on our cloud bill is enormous and unexplained',
      'we split services across zones for resilience and costs tripled',
      'serving files directly from storage is costing more than we expected',
      'nobody can tell which service generates the transfer charges',
    ],
    prompt:
      'Analyse our data transfer costs. Map the traffic flows and price each by category, since the rates differ by orders of magnitude: within a zone, between zones, between regions, and out to the internet. Then find the architectural causes rather than the volume causes — chatty service-to-service calls crossing zone boundaries, replicas placed for resilience that also multiply traffic, logs and metrics shipped out of the region, and large responses served without caching. For each, give the remedy: zone-aware routing that prefers a local instance, compression, caching at the edge, and keeping high-volume paths within one boundary. Finish with the attribution needed to see this per service.',
    why:
      'Cross-zone chattiness is the usual dominant cause and is invisible in application metrics, so mapping flows by cost category is what makes it findable.',
    watchOut:
      'Optimising away cross-zone traffic can undo the resilience it was providing. Distinguish redundancy traffic from avoidable chatter.',
    related: ['cloud-cost-attribution', 'workload-placement', 'compression-tradeoffs', 'observability-cost-control'],
    tags: ['platform', 'cost', 'networking', 'cloud'],
  },

  {
    id: 'cloud-cost-attribution',
    name: 'Cloud Cost Attribution',
    aka: ['showback and chargeback', 'cost tagging', 'FinOps'],
    origin: 'FinOps practice',
    domains: ['engineering', 'strategy'],
    intents: ['diagnose', 'prioritize'],
    oneLiner:
      'You cannot manage a bill nobody owns — attribute spend to teams, services and customers so the people who can change it can see it.',
    useWhen: [
      'the cloud bill went up and nobody knows which team caused it',
      'engineering costs are a single line item to finance',
      'we do not know what serving our largest customer actually costs',
      'cost reduction efforts stall because nobody owns any of it',
    ],
    prompt:
      'Build cost attribution for our infrastructure. Start with the tagging or account structure required, and confront the shared costs directly, since they are the hard part: clusters, databases and networks serving many services need an allocation method, so choose one and state its bias. Then decide between showback, where teams see their costs, and chargeback, where they carry them, with the behavioural consequence of each. Then add the metric that makes cost meaningful — cost per unit of business value such as per customer or per transaction — because absolute cost rising is expected when usage grows. Finish with who reviews it and how often.',
    why:
      'Unit cost per transaction or customer is what turns a rising bill into a judgement about efficiency, and the shared-cost allocation choice is what makes the numbers credible to the teams receiving them.',
    watchOut:
      'Chargeback without control over the underlying architecture makes teams accountable for costs they cannot change, which produces resentment rather than savings.',
    related: ['rightsizing-resources', 'total-cost-of-ownership', 'data-transfer-cost', 'observability-cost-control'],
    tags: ['platform', 'cost', 'accountability', 'cloud'],
  },

  {
    id: 'total-cost-of-ownership',
    name: 'Total Cost of Ownership',
    aka: ['TCO', 'lifetime cost', 'the cost after the build'],
    origin: 'Procurement and asset management practice',
    domains: ['engineering', 'strategy'],
    intents: ['estimate', 'decide'],
    oneLiner:
      'Count everything a system costs over its life — build, run, patch, support, migrate and eventually retire — because the build is usually the smallest part.',
    useWhen: [
      'we compared building against buying on the build estimate alone',
      'the cheap option turned out to be expensive to operate',
      'nobody counted the ongoing engineering time in the business case',
      'we are choosing between two architectures and only comparing effort',
    ],
    prompt:
      'Model the lifetime cost of these options over a realistic horizon. Include the categories that get missed: ongoing engineering time for maintenance and dependency upgrades, on-call burden expressed in hours and in retention risk, infrastructure at projected scale rather than today, support and training, the cost of the expertise required, and eventual migration or decommissioning. Express engineering time in money so it competes properly with licence fees. Then state the sensitivity: which assumption, if wrong by a factor of two, changes the answer — usually the growth rate or the maintenance load — and how confident we are in it.',
    why:
      'Converting engineering time into money is what makes build-versus-buy comparable at all, and naming the assumption that would flip the answer is what makes the model honest.',
    watchOut:
      'Long-horizon models look precise and rest on a growth assumption that is a guess. Present ranges and revisit when the assumption is testable.',
    related: ['build-vs-buy', 'vendor-evaluation', 'cloud-cost-attribution', 'opportunity-cost'],
    tags: ['cost', 'decisions', 'strategy', 'estimation'],
  },

  {
    id: 'quota-management',
    name: 'Quota and Limit Management',
    aka: ['service limits', 'account quotas', 'hitting the ceiling'],
    origin: 'Cloud operations practice',
    domains: ['engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Every cloud service has limits you did not choose, and discovering one during an incident is the worst possible time, because raising it can take days.',
    useWhen: [
      'autoscaling stopped at a number nobody configured',
      'we hit an API rate limit during our busiest hour',
      'we could not create instances during a failover',
      'a limit increase request took three days to approve',
    ],
    prompt:
      'Inventory the limits that could constrain this system. Cover the categories that bite: instance and core counts per region, addresses and network resources, connections and rate limits on managed services, storage volumes and throughput, and the request rates of the control plane itself, which is what fails during a mass recovery. For each, record the current limit, our current usage, and the lead time to raise it. Then set monitoring with alerts at a proportion of each limit, giving enough warning to raise it before it binds. Finish with the failover scenario specifically, where we would need capacity in a region we do not normally use at full scale.',
    why:
      'Control plane rate limits during mass recovery, and unraised quotas in the failover region, are the two limit failures that turn a recoverable incident into a long one.',
    watchOut:
      'Limits are often per region and per account. Verifying capacity where you normally run says nothing about where you would fail over to.',
    related: ['capacity-planning', 'autoscaling-policy', 'multi-region-failover', 'rate-limiting-algorithms'],
    tags: ['platform', 'cloud', 'capacity', 'operations'],
  },

  {
    id: 'multi-account-boundaries',
    name: 'Account and Project Boundaries',
    aka: ['multi-account strategy', 'environment isolation', 'blast radius by account'],
    origin: 'Cloud architecture practice; provider landing zone guidance',
    domains: ['engineering', 'security'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Separate cloud accounts or projects are the strongest isolation boundary available, limiting blast radius, quota contention and permission scope in one move.',
    useWhen: [
      'a mistake in a test environment affected production',
      'everything runs in one account and permissions are unmanageable',
      'we cannot tell which spend belongs to which environment',
      'a compromised credential would have access to everything',
    ],
    prompt:
      'Design our account structure. Separate at minimum by environment, and consider further separation by team or product for blast radius and cost clarity, stating what each boundary buys — isolation of failure, isolation of compromise, separate quotas, and clean cost attribution. Then address what it costs, since that is where these designs are underestimated: cross-account access patterns, shared services such as networking and logging, and the consistent baseline that must be applied to every account automatically. Specify how a new account is created with that baseline already in place. Finish with the exceptions, particularly anything that must remain central and how it is protected.',
    why:
      'The automated baseline for new accounts is what determines whether an account structure stays consistent, and without it the boundaries become an inconsistent sprawl.',
    watchOut:
      'Too many accounts without automation multiplies the surface to configure, monitor and audit, and inconsistency between them is itself a security risk.',
    related: ['self-service-guardrails', 'blast-radius', 'iam-policy-design', 'cloud-cost-attribution'],
    tags: ['platform', 'cloud', 'isolation', 'security'],
  },

  {
    id: 'network-segmentation',
    name: 'Network Segmentation',
    aka: ['microsegmentation', 'security groups', 'east-west traffic control'],
    origin: 'Network security practice',
    domains: ['security', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Restrict which systems can reach which, so a compromise in one place cannot freely explore everything else on the network.',
    useWhen: [
      'anything in our network can connect to the database',
      'we have a firewall at the perimeter and nothing inside',
      'an attacker who got a foothold could reach everything',
      'we do not know what talks to what',
    ],
    prompt:
      'Design segmentation for this environment. Start from the actual communication map, discovered from traffic data rather than from architecture diagrams, since undocumented dependencies are what break segmentation rollouts. Then define the segments and the allowed flows between them, defaulting to deny and permitting only observed necessary paths, with particular attention to data stores which should accept connections only from their own services. Specify the rollout: monitor mode first to find what would break, then enforce segment by segment. Finish with the maintenance question — how a new legitimate flow is added without a ticket queue, since friction there leads to permissive rules being added just in case.',
    why:
      'Discovering the real communication map from traffic rather than diagrams is what prevents an outage on enforcement day, and the add-a-flow process determines whether the rules stay tight.',
    watchOut:
      'Segmentation rules that are painful to change accumulate broad exceptions, and a policy full of wide allowances provides less protection than it appears to.',
    related: ['zero-trust', 'multi-account-boundaries', 'least-privilege', 'defense-in-depth'],
    tags: ['security', 'networking', 'platform', 'isolation'],
  },

  {
    id: 'iam-policy-design',
    name: 'Access Policy Design',
    aka: ['IAM policies', 'role design', 'permission boundaries'],
    origin: 'Cloud identity and access management practice',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Design roles around what a workload or person actually does, and use guardrails to cap what any policy can grant, because permissions only ever accumulate.',
    useWhen: [
      'everything runs with administrator permissions because scoping was hard',
      'we granted broad access to fix an incident and never revoked it',
      'nobody can say what this role can actually do',
      'a service account has permissions nobody can justify',
    ],
    prompt:
      'Review and redesign these access policies. Derive each role from the actions actually used, taken from access logs rather than from what someone thought would be needed, since observed usage is usually a small fraction of what is granted. Report the gap per role. Then apply the structural controls: a ceiling that no policy can exceed regardless of what is attached, separation between human and workload identities, and conditions restricting where and when a permission applies. Address the temporary grant problem with time-bounded elevation rather than permanent broad roles. Finish with the review process: unused permissions removed on a schedule, since without it entitlements only grow.',
    why:
      'Deriving roles from access logs makes least privilege concrete rather than aspirational, and a permission ceiling limits the damage of any future over-broad policy.',
    watchOut:
      'Overly tight policies produce failures far from the cause and at inconvenient times, which pushes people toward broad grants. Tighten with monitoring first.',
    related: ['least-privilege', 'identity-federation', 'break-glass-access', 'self-service-guardrails'],
    tags: ['security', 'access control', 'cloud', 'platform'],
  },

  {
    id: 'identity-federation',
    name: 'Identity Federation',
    aka: ['single sign-on', 'workload identity', 'no long-lived credentials'],
    origin: 'Identity management practice; SAML and OpenID Connect',
    domains: ['security', 'engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Have systems trust a central identity provider and issue short-lived credentials, so access follows a person or workload identity rather than a stored secret.',
    useWhen: [
      'someone left and we are hunting for accounts to disable',
      'our pipeline uses a long-lived key stored in settings',
      'each system has its own user list',
      'we cannot enforce multi-factor authentication consistently',
    ],
    prompt:
      'Plan identity federation for our systems. Cover both cases separately: human access, where the goal is one identity source so joining and leaving are handled in one place and stronger authentication is enforced centrally, and workload access, where the goal is short-lived credentials issued on the basis of the workload\'s own identity rather than a stored key. For each system, note what it supports and what remains. Then confront the concentration risk: the identity provider becomes critical, so specify what happens when it is unavailable and the break-glass path. Finish with the leaving process and how you verify no independent local accounts remain.',
    why:
      'Workload identity replacing stored keys eliminates an entire class of leaked-credential incidents, and it is the half of federation that is usually left undone after the human single sign-on project.',
    watchOut:
      'Federating everything makes the identity provider a total single point of failure. The emergency access path must be designed and tested before you need it.',
    related: ['api-authentication-choice', 'credential-rotation', 'secrets-management', 'break-glass-access'],
    tags: ['security', 'identity', 'platform', 'authentication'],
  },

  {
    id: 'credential-rotation',
    name: 'Credential Rotation',
    aka: ['key rotation', 'rotating without downtime', 'dual credentials'],
    origin: 'Security operations practice',
    domains: ['security', 'engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Rotating a secret without downtime requires supporting two valid credentials at once — design that in, or rotation becomes an outage nobody is willing to schedule.',
    useWhen: [
      'this key has not been changed in four years',
      'rotating the credential requires a coordinated restart of everything',
      'we know we should rotate and nobody wants to be the one who breaks it',
      'a credential leaked and we could not rotate quickly',
    ],
    prompt:
      'Design rotation for these credentials. The enabling property is overlap, so specify how two credentials can be valid simultaneously for each type — a second active key, a grace period on the old one, or a signing key set with several accepted keys — since without overlap rotation is a synchronised change and therefore an outage. Then define the sequence: issue new, distribute, verify usage has moved with telemetry showing the old one is idle, then revoke. Automate it and run it frequently, because a rotation exercised monthly works in an emergency while an annual one does not. Finish with the emergency procedure and how long a forced rotation would actually take.',
    why:
      'Verifying the old credential is idle before revoking is the step that makes rotation safe, and frequent automated rotation is what makes emergency rotation possible.',
    watchOut:
      'Credentials copied into places nobody tracks — scripts, personal machines, third-party tools — will break on rotation. Discovery is part of the work.',
    related: ['secrets-management', 'identity-federation', 'secrets-in-ci', 'blast-radius'],
    tags: ['security', 'credentials', 'operations', 'automation'],
  },

  {
    id: 'tls-certificate-lifecycle',
    name: 'Certificate Lifecycle',
    aka: ['expired certificate outages', 'automated renewal', 'certificate inventory'],
    origin: 'Public key infrastructure operations practice',
    domains: ['security', 'engineering'],
    intents: ['plan', 'diagnose'],
    oneLiner:
      'Certificates expire on a known date and still cause outages, because renewal is manual, the inventory is incomplete, or the alert went to someone who left.',
    useWhen: [
      'the site went down because a certificate expired',
      'nobody knows how many certificates we have or where',
      'renewal is a calendar reminder owned by one person',
      'the internal service certificates are all self-signed and untracked',
    ],
    prompt:
      'Design certificate management for our estate. Start with discovery, since the inventory is always incomplete: scan externally and internally to find everything presenting a certificate, including internal service-to-service, load balancers, message brokers, databases and devices. Then automate renewal wherever the protocol allows, and for the remainder assign an owning team rather than an individual and monitor expiry independently of the renewal mechanism, so a silent automation failure is still caught. Set alerting far enough ahead to act. Finish with the cases that break automation — pinned certificates, embedded devices, and third parties holding our certificates — and the manual procedure for each.',
    why:
      'Monitoring expiry independently of the renewal automation is what catches the silent failure, which is how outages happen even in fully automated estates.',
    watchOut:
      'Internal and service-to-service certificates cause as many outages as public ones and are far less likely to be inventoried or monitored.',
    related: ['single-point-of-failure-audit', 'credential-rotation', 'dns-management', 'zero-trust'],
    tags: ['security', 'operations', 'availability', 'certificates'],
  },

  {
    id: 'dns-management',
    name: 'DNS Management',
    aka: ['domain records', 'TTL strategy', 'dangling records'],
    origin: 'Internet operations practice',
    domains: ['engineering', 'security'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'DNS is a single point of failure, a change with a long propagation tail, and a security exposure when records point at resources you no longer own.',
    useWhen: [
      'we changed a record and half our users still went to the old address',
      'somebody took over a subdomain we forgot about',
      'the domain renewal was missed and everything went down',
      'we cannot fail over quickly because our record lifetimes are long',
    ],
    prompt:
      'Review our DNS setup. Cover three areas. First availability: registrar account security and renewal, nameserver redundancy, and who is able to make changes. Second operations: record lifetimes chosen deliberately, since a long one delays every change and a short one increases lookup load, and lowering it before a planned migration must happen well in advance to be effective. Third security: an inventory of records, particularly ones pointing at cloud resources that may have been deleted, since those allow someone else to claim the address and serve content from our domain. Finish with change control, because a bad record change is one of the fastest total outages available.',
    why:
      'Dangling records pointing at released cloud resources are a widespread and quiet exposure, and the lower-the-lifetime-in-advance point is what makes planned migrations actually work.',
    watchOut:
      'Resolvers and clients frequently ignore short record lifetimes, so propagation is slower and less predictable than the configuration suggests.',
    related: ['service-discovery', 'multi-region-failover', 'tls-certificate-lifecycle', 'attack-surface-reduction'],
    tags: ['platform', 'networking', 'availability', 'security'],
  },

  {
    id: 'vulnerability-triage',
    name: 'Vulnerability Triage',
    aka: ['CVE prioritisation', 'exploitability assessment', 'scanner output management'],
    origin: 'Application security operations practice',
    domains: ['security', 'engineering'],
    intents: ['prioritize', 'diagnose'],
    oneLiner:
      'Scanners report far more than anyone can fix, so triage on whether the vulnerable code is reachable and exposed, not on the severity score alone.',
    useWhen: [
      'the scanner reports four hundred issues and we fix none of them',
      'we spend weeks on high-severity findings in code that never runs',
      'a genuinely exploitable issue was buried in the noise',
      'nobody owns the scanner output',
    ],
    prompt:
      'Design a triage process for our scanner findings. Rank by exploitability in our context rather than by score: is the vulnerable function actually called, is the component exposed to untrusted input, is there a known exploit in the wild, and what would compromise cost given where it runs. That combination reorders the list dramatically compared with severity alone, so show the reordering. Then define the response times per tier and the acceptance path for findings we will not fix, with an owner and a documented reason. Finish with the reduction that beats triage: reducing what we ship at all, since fewer components means fewer findings.',
    why:
      'Reachability and exposure reorder a scanner list far more usefully than severity, and it is the analysis that lets a team credibly not fix most findings.',
    watchOut:
      'A vulnerability in a component that is not currently reachable can become reachable with an unrelated code change. Accepted findings need re-evaluation, not permanent dismissal.',
    related: ['patch-management', 'sbom-generation', 'static-analysis-adoption', 'supply-chain-provenance'],
    tags: ['security', 'prioritisation', 'dependencies', 'operations'],
  },

  {
    id: 'patch-management',
    name: 'Patch Management',
    aka: ['staying current', 'patch cadence', 'emergency patching'],
    origin: 'Systems administration and security operations practice',
    domains: ['security', 'engineering'],
    intents: ['plan', 'prioritize'],
    oneLiner:
      'A routine patching cadence is what makes emergency patching possible, because a system years behind cannot be updated quickly when it must be.',
    useWhen: [
      'a critical vulnerability was announced and patching took two weeks',
      'we are several major versions behind on the operating system',
      'patching is manual and gets skipped when we are busy',
      'nobody knows which systems have been patched',
    ],
    prompt:
      'Design our patching approach. Separate routine cadence from emergency response, since they need different mechanisms. For routine, specify the frequency per layer — base images, operating system, runtime, dependencies — and how it is automated with verification, favouring frequent small updates because falling behind is what makes future patching hard. For emergency, define the process end to end: how we learn of an advisory, how we determine exposure using our component inventory, the target time by severity, and the accelerated path with reduced approval. Then rehearse it against a recent real advisory and report how long each step actually took.',
    why:
      'Rehearsing against a real past advisory exposes where the hours actually go, which is usually in determining exposure rather than in applying the patch.',
    watchOut:
      'Automated patching without automated verification can roll a breaking change across the fleet. The rollback path matters as much as the update path.',
    related: ['vulnerability-triage', 'dependency-update-automation', 'container-image-hygiene', 'sbom-generation'],
    tags: ['security', 'operations', 'maintenance', 'process'],
  },

  {
    id: 'telemetry-pipeline',
    name: 'Telemetry Pipeline',
    aka: ['observability data pipeline', 'collector architecture', 'vendor-neutral instrumentation'],
    origin: 'Observability engineering practice; OpenTelemetry collector model',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Route telemetry through a pipeline you control, so filtering, redaction, sampling and destination are configuration rather than a code change in every service.',
    useWhen: [
      'changing our monitoring vendor would mean editing every service',
      'we cannot filter sensitive fields without redeploying everything',
      'each team ships telemetry differently to different places',
      'a telemetry backend outage caused application problems',
    ],
    prompt:
      'Design a telemetry pipeline for our estate. Specify the collection layer between applications and backends and what it does: buffering so a backend outage does not affect applications, redaction of sensitive fields centrally, sampling policy applied consistently, enrichment with deployment and ownership metadata, and routing so one signal can go to several destinations. Then address the pipeline\'s own reliability — what happens when it is unavailable or saturated, since telemetry must never be able to take down the application it observes, so specify the drop-rather-than-block behaviour. Finish with the instrumentation standard in applications that keeps them independent of the destination.',
    why:
      'Central redaction and the never-block-the-application rule are the two properties that make a pipeline worth operating, and both are impossible when services report directly to a vendor.',
    watchOut:
      'The pipeline becomes critical infrastructure with its own capacity and failure modes. It needs monitoring that does not depend on itself.',
    related: ['observability-cost-control', 'log-sampling', 'structured-logging', 'data-classification'],
    tags: ['platform', 'observability', 'infrastructure', 'privacy'],
  },

  {
    id: 'green-software',
    name: 'Green Software',
    aka: ['carbon-aware computing', 'energy efficiency', 'sustainable engineering'],
    origin: 'Green Software Foundation; carbon-aware computing research',
    domains: ['engineering', 'strategy'],
    intents: ['decide', 'estimate'],
    oneLiner:
      'Reduce the emissions of running software through efficiency, better utilisation, and shifting flexible work to times and places where the electricity is cleaner.',
    useWhen: [
      'we have a sustainability commitment and no idea how software contributes',
      'our fleet runs at eight percent utilisation around the clock',
      'someone asked for the carbon footprint of our platform',
      'we want to reduce emissions without harming the product',
    ],
    prompt:
      'Assess the environmental footprint of this system and what would reduce it. Break it into the three levers: energy efficiency, meaning less computation per unit of work; hardware efficiency, meaning higher utilisation so fewer machines are needed and manufacturing impact is amortised; and carbon awareness, meaning shifting flexible workloads to times or regions with cleaner electricity. Quantify each roughly for us. Then note the strong overlap with cost, since most of these reduce the bill as well, which is the argument that gets them prioritised. Finish with the measurement approach and the honest limits of the available data.',
    why:
      'The overlap between carbon reduction and cost reduction is what makes this actionable in most organisations, and separating the three levers stops it collapsing into vague intent.',
    watchOut:
      'Emissions figures from providers are estimates with wide uncertainty and inconsistent methodology. Use them for direction, not for precise claims.',
    related: ['rightsizing-resources', 'cloud-cost-attribution', 'workload-placement', 'spot-capacity-strategy'],
    tags: ['sustainability', 'cost', 'platform', 'strategy'],
  },

  {
    id: 'password-storage',
    name: 'Password Storage',
    aka: ['password hashing', 'slow hashes', 'salting and peppering'],
    origin: 'Applied cryptography practice; OWASP password storage guidance',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Store passwords under a deliberately slow, salted, memory-hard hash designed for the purpose, so a stolen database does not immediately become a list of credentials.',
    useWhen: [
      'we hash passwords with a fast general-purpose algorithm',
      'someone suggested encrypting passwords rather than hashing them',
      'we are building authentication ourselves and I want to get this right',
      'our hashing parameters were set years ago and never revisited',
    ],
    prompt:
      'Review credential storage here. Confirm the algorithm is one designed for passwords with a work factor tuned so verification takes a deliberate fraction of a second on our hardware, and state the parameters with the reasoning rather than copying defaults. Then check the surrounding requirements: a unique salt per credential stored alongside, comparison in constant time, and a migration path that upgrades a stored hash on next successful login so parameters can be raised without forcing a reset. Then cover the policy points that matter more than composition rules — length over complexity, checking against known breached passwords, and rate limiting attempts. Finish with what must never be logged.',
    why:
      'The upgrade-on-login migration is what lets work factors rise over time without a mass reset, and it is the piece that is almost never built in at the start.',
    watchOut:
      'Building authentication yourself means owning reset flows, session handling and enumeration defences too. A managed identity provider is usually the better answer.',
    related: ['identity-federation', 'credential-rotation', 'secrets-management', 'audit-logging'],
    tags: ['security', 'authentication', 'cryptography', 'credentials'],
  },
]
