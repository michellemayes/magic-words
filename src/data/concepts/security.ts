import type { Concept } from '../types'

export const security: Concept[] = [
  {
    id: 'least-privilege',
    name: 'Principle of Least Privilege',
    aka: ['least privilege access', 'PoLP', 'minimum necessary access', 'need to know'],
    origin: 'Saltzer & Schroeder, 1975',
    domains: ['security', 'engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Every user, service and process gets exactly the permissions its job requires, for exactly as long as it requires them, and nothing more.',
    useWhen: [
      'everyone on the team has admin because it was easier',
      'this service account can do far more than it needs to',
      'we granted access for a migration two years ago and never removed it',
      'a compromised key would give an attacker the whole system',
      'our IAM policy is a wildcard and I know that is bad',
      'contractors still have access months after leaving',
    ],
    prompt:
      'Apply least privilege to this. For each identity — human, service account, CI job, third-party integration — list what it can currently do, then what it demonstrably needs for its actual job, and produce the delta. Do this along all four dimensions, not just the first: which actions, on which resources, under which conditions, and for how long. Flag every standing permission that should be time-bound or request-based instead. Then tell me the order to tighten in, prioritised by what a compromise of that identity would currently reach, and mark the changes likely to break something so I can stage them safely.',
    variants: [
      {
        label: 'Reviewing a specific policy or role',
        prompt:
          'Review this IAM policy against least privilege. For every wildcard in an action or resource, tell me the concrete enumerated list that would replace it, and what would break if I made that substitution today. Rank by blast radius if this credential leaked, and separate the permissions that are merely broad from the ones that allow privilege escalation.',
      },
      {
        label: 'Designing access for something new',
        prompt:
          'I am about to grant access for a new service. Start from zero rather than from a template: what is the minimum set of permissions it needs for its first task, what should be granted just-in-time instead of standing, and what audit trail should exist for each. Tell me what I would need to add later and why it is better to add it then than now.',
      },
    ],
    why:
      'Asked generically, a model recites the definition. The four dimensions — actions, resources, conditions, duration — are what turn it into an audit, and duration is the one teams skip: most over-permission is standing access that was correct for one afternoon in 2023.',
    watchOut:
      'Tightened too aggressively without staging, this breaks production at the worst moment. The "what will break" column is not optional, and neither is a fast path to grant access back.',
    related: ['zero-trust', 'separation-of-duties', 'break-glass-access', 'blast-radius', 'attack-surface-reduction'],
    tags: ['security', 'access control', 'permissions', 'iam', 'hardening'],
  },

  {
    id: 'defense-in-depth',
    name: 'Defence in Depth',
    aka: ['layered security', 'defense in depth', 'no single point of security failure'],
    origin: 'Military doctrine; adopted in information security',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Assume any single control will eventually fail, and layer independent controls so that no one failure is enough to cause a breach.',
    useWhen: [
      'we have a firewall so we are fine right',
      'everything depends on one check being correct',
      'if someone got past the login they could do anything',
      'how many layers of protection is enough',
      'the whole security model rests on one gateway',
    ],
    prompt:
      'Assess this design for defence in depth. Map the controls an attacker would meet in sequence, then apply the real test: assume each one has already failed, one at a time, and describe what the attacker reaches. Pay particular attention to controls that share a failure mode — two checks that both depend on the same identity service, the same config flag, or the same assumption about network position are one control wearing two hats, not two layers. Then tell me where a genuinely independent layer would add the most, and where an extra layer would only add operational cost.',
    why:
      'The shared-failure-mode test is the part that matters and the part summaries omit. Teams routinely count correlated controls as separate layers, which is how a single expired certificate or misapplied flag takes down the whole chain.',
    watchOut:
      'Layers cost latency, complexity and on-call pain. Depth for its own sake produces systems nobody can debug at 3am.',
    related: ['least-privilege', 'blast-radius', 'fail-closed', 'threat-modeling-stride', 'fmea'],
    tags: ['security', 'architecture', 'resilience', 'controls', 'hardening'],
  },

  {
    id: 'threat-modeling-stride',
    name: 'Threat Modelling (STRIDE)',
    aka: ['STRIDE', 'threat model', 'security design review'],
    origin: 'Loren Kohnfelder & Praerit Garg, Microsoft, 1999',
    domains: ['security', 'engineering'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Walk a design against six threat categories — spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege — so coverage comes from a checklist rather than from imagination.',
    useWhen: [
      'we need a security review before launch',
      'I do not know what could go wrong security-wise',
      'how do I even start thinking about attacks on this',
      'the design is done and nobody has looked at it from a security angle',
      'we handle sensitive data and I want to be systematic',
    ],
    prompt:
      'Threat model this using STRIDE. First draw the data flow: the components, the data stores, the external entities, and — most importantly — the trust boundaries where data crosses between differently-trusted parties. Then walk each element against all six STRIDE categories rather than only the ones that feel relevant, since the point of the checklist is to catch what intuition skips. For each threat: how it would be carried out concretely, what it gets the attacker, whether we already mitigate it, and the specific control if we do not. Rank by likelihood multiplied by impact, and explicitly list what we are choosing to accept, because unrecorded accepted risk is indistinguishable from a miss.',
    why:
      'Insisting on all six categories per element is the whole method — the value of a checklist is precisely that it forces attention onto the categories you would not have thought of. The recorded-acceptance step is what makes the output auditable later.',
    watchOut:
      'STRIDE is thorough and slow. For a small change, a focused red team pass is a better use of an hour.',
    related: ['red-teaming', 'attack-surface-reduction', 'trust-boundary', 'defense-in-depth', 'pre-mortem'],
    tags: ['security', 'threat model', 'design review', 'risk', 'stride'],
  },

  {
    id: 'zero-trust',
    name: 'Zero Trust',
    aka: ['never trust always verify', 'BeyondCorp', 'perimeterless security'],
    origin: 'John Kindervag, Forrester, 2010; Google BeyondCorp',
    domains: ['security', 'engineering'],
    intents: ['structure', 'reframe'],
    oneLiner:
      'Stop treating network location as evidence of trustworthiness — authenticate and authorise every request on its own merits, wherever it comes from.',
    useWhen: [
      'anything inside our network can talk to anything else',
      'we assume internal traffic is safe',
      'the VPN is the only thing standing between an attacker and everything',
      'services call each other with no authentication at all',
      'once you are on the corporate network you have access to everything',
    ],
    prompt:
      'Evaluate this architecture against zero trust principles. Find every place where trust is currently derived from network position — an internal-only endpoint, an unauthenticated service-to-service call, a "we are behind the VPN" assumption, an allowlisted IP range — and state what an attacker who already had a foothold inside that boundary could do. Then, for each, specify what the request should be authenticated and authorised on instead: workload identity, mutual TLS, short-lived tokens, device posture. Sequence the work by exposure rather than by ease, and be honest about which of these are genuinely worth the operational cost for a system of our size.',
    why:
      'The "attacker already inside" framing is what makes the gaps visible. Asked to review network security, a model checks the perimeter; asked what an established foothold reaches, it finds the flat internal network.',
    watchOut:
      'Zero trust is a direction, not a product, and full adoption is a multi-year programme. Treat the output as a ranked backlog rather than a project plan.',
    related: ['least-privilege', 'defense-in-depth', 'trust-boundary', 'blast-radius'],
    tags: ['security', 'network', 'authentication', 'architecture', 'identity'],
  },

  {
    id: 'blast-radius',
    name: 'Blast Radius',
    aka: ['failure domain', 'containment boundary', 'what does this take down with it'],
    origin: 'Site reliability and security engineering practice',
    domains: ['security', 'engineering'],
    intents: ['critique', 'estimate'],
    oneLiner:
      'Ask how far the damage spreads when one component is compromised or fails, and design boundaries that stop it spreading further.',
    useWhen: [
      'one bad deploy took down everything',
      'if this credential leaked how bad would it be',
      'a single database is shared by every service',
      'how do we stop one customer affecting another',
      'we need to contain damage not just prevent it',
    ],
    prompt:
      'Map the blast radius here. Take each component in turn and, assuming it is fully compromised or fully broken, trace exactly what an attacker or a failure reaches from there: which data, which other systems, which customers, and how far laterally. Distinguish the failures that are contained by design from the ones that are contained only by convention or by luck — a shared credential, a shared database, a global config flag, an admin API reachable from anywhere. Then propose containment boundaries in order of reduction per unit of effort, and tell me which single boundary would shrink the worst case most.',
    why:
      'Prevention and containment are different disciplines and models default to prevention. Forcing the "assume it is already compromised" premise produces the containment work, which is what actually limits an incident once prevention has failed.',
    related: ['least-privilege', 'defense-in-depth', 'zero-trust', 'fmea', 'saga-pattern'],
    tags: ['security', 'containment', 'reliability', 'incident', 'isolation'],
  },

  {
    id: 'fail-closed',
    name: 'Fail Closed / Secure by Default',
    aka: ['fail secure', 'deny by default', 'secure defaults', 'fail safe'],
    origin: 'Saltzer & Schroeder — fail-safe defaults',
    domains: ['security', 'engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'When a check errors, times out or is skipped, the safe outcome is denial — and the default configuration should be the locked-down one, not the convenient one.',
    useWhen: [
      'if the auth service is down does everything become public',
      'the permission check throws an exception and I am not sure what happens',
      'new resources are created world-readable by default',
      'someone has to remember to turn on the security setting',
      'what happens when this timeout fires',
    ],
    prompt:
      'Audit this for fail-closed behaviour and secure defaults. Trace every authorisation and validation check and answer one question for each: if it throws, times out, returns null, or is simply not reached, does the system deny or allow? Name every path where an error results in access being granted, because those are the ones that turn an outage into a breach. Separately, review the defaults: for each configurable security control, state what happens when nobody configures anything, and flag any where safety depends on someone remembering to enable it. Then tell me where failing closed would cause an unacceptable availability problem, and what the right compromise is there.',
    why:
      'The exception path is where this actually bites, and it is invisible in normal review because the happy path looks correct. Asking specifically about throw, timeout, null and not-reached surfaces the four ways a check silently becomes a no-op.',
    watchOut:
      'Failing closed on a hot path can convert a dependency blip into a full outage. The availability trade-off is real and needs to be a deliberate decision, not a surprise.',
    related: ['defense-in-depth', 'least-privilege', 'trust-boundary', 'fmea', 'observability-triage'],
    tags: ['security', 'defaults', 'error handling', 'availability', 'hardening'],
  },

  {
    id: 'attack-surface-reduction',
    name: 'Attack Surface Reduction',
    aka: ['minimise attack surface', 'reduce exposure', 'turn it off'],
    origin: 'Michael Howard, Microsoft security engineering',
    domains: ['security', 'engineering'],
    intents: ['critique', 'prioritize'],
    oneLiner:
      'The cheapest way to secure something is to not expose it — count the entry points, then remove the ones nobody needs.',
    useWhen: [
      'we have a lot of endpoints and I do not know which are still used',
      'this admin panel is on the public internet',
      'we installed a bunch of things we no longer use',
      'how do we harden this without a big project',
      'debug endpoints are probably still enabled in production',
    ],
    prompt:
      'Inventory and reduce the attack surface here. Enumerate every entry point an untrusted party can reach: network ports, HTTP routes, file uploads, message queue consumers, webhook receivers, deserialisation points, admin interfaces, debug and health endpoints, and third-party integrations that can call in. For each, record who should be able to reach it, who actually can, and whether it is still used at all. Then rank by removal value — anything unused or internal-only that is publicly reachable comes first, since deleting an entry point is strictly cheaper and more reliable than defending one. Flag anything you suspect is a forgotten development affordance left enabled.',
    why:
      'Explicitly naming the unglamorous categories — debug endpoints, deserialisation, webhook receivers, health checks — is what finds the forgotten exposure. A generic prompt returns the front door, which was never the problem.',
    related: ['least-privilege', 'threat-modeling-stride', 'blast-radius', 'chestertons-fence'],
    tags: ['security', 'hardening', 'exposure', 'endpoints', 'attack surface'],
  },

  {
    id: 'separation-of-duties',
    name: 'Separation of Duties',
    aka: ['segregation of duties', 'four eyes principle', 'two person rule', 'SoD'],
    origin: 'Accounting and internal control practice',
    domains: ['security', 'career'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Split a sensitive operation so no single person can both initiate and approve it, making fraud and catastrophic error require collusion rather than a bad day.',
    useWhen: [
      'one person can push straight to production with nobody looking',
      'the same person requests and approves their own access',
      'we need this for an audit or compliance review',
      'a single mistake by one person could be catastrophic',
      'how do we add a check without slowing everything down',
    ],
    prompt:
      'Review this process for separation of duties. List the sensitive operations, and for each identify who can initiate, who approves, who executes, and who reviews afterwards. Flag every case where one identity holds two of those roles — including the ones people forget: an admin who can grant themselves a role, an engineer who can both change the audit logging and take the action it would record, an automation whose credentials one person fully controls. Then propose the minimum split that removes single-actor risk, and be realistic about team size: if we are too small for true separation, tell me which compensating controls (after-the-fact review, alerting on self-approval, immutable logs) get most of the benefit.',
    why:
      'The small-team caveat is what makes this usable. Textbook separation of duties assumes an org that can staff it, and without that clause the output is advice a five-person team has to ignore entirely.',
    watchOut:
      'Overapplied, this becomes approval theatre — a required reviewer who rubber-stamps everything adds latency and no safety.',
    related: ['least-privilege', 'break-glass-access', 'decision-roles-daci', 'blameless-postmortem'],
    tags: ['security', 'controls', 'compliance', 'process', 'audit'],
  },

  {
    id: 'break-glass-access',
    name: 'Break-Glass Access',
    aka: ['emergency access', 'just in time access', 'JIT elevation', 'privileged access request'],
    origin: 'Operational security practice',
    domains: ['security', 'engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Replace standing privileged access with a fast, loud, time-limited elevation path, so the powerful credentials only exist while someone is actually using them.',
    useWhen: [
      'we keep admin access permanently because incidents need it',
      'tightening permissions would slow down our incident response',
      'how do we lock this down without hurting on-call',
      'people have production access they use twice a year',
      'we cannot remove access because of emergencies',
    ],
    prompt:
      'Design a break-glass access path for this. It has to be fast enough that nobody routes around it during an incident, so specify the mechanism and be concrete about how many seconds it takes at 3am with one tired engineer. Cover: what triggers elevation, whether approval is required or it is self-service with notification, what the time limit is and how it expires automatically, what gets logged, and who is alerted in real time — the alert is what makes this safe, not the approval. Then tell me which standing permissions can be removed once this exists, and how we would test the path quarterly so its first real use is not its first use.',
    why:
      'The speed constraint and the quarterly test are the two things that decide whether break-glass works. A slow path gets bypassed, and an untested one fails exactly when it is needed.',
    related: ['least-privilege', 'separation-of-duties', 'zero-trust', 'blameless-postmortem'],
    tags: ['security', 'access control', 'incident response', 'on call', 'privileged access'],
  },

  {
    id: 'trust-boundary',
    name: 'Trust Boundary',
    aka: ['never trust user input', 'validate at the boundary', 'taint tracking'],
    origin: 'Secure design practice; central to threat modelling',
    domains: ['security', 'engineering'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'Identify exactly where data crosses from a less-trusted party to a more-trusted one, and make that the place validation happens — every time, without exception.',
    useWhen: [
      'where should I validate this input',
      'we sanitise in some places and not others',
      'is this string safe to put in a query',
      'data from another internal service is probably fine right',
      'we keep finding injection bugs in different places',
    ],
    prompt:
      'Map the trust boundaries in this system. Mark every point where data crosses from lower to higher trust — user to server, browser to API, one service to another, third-party webhook to us, database content back into a template. For each crossing, state what validation happens now and what should: validate for shape and range at the boundary, and encode for context at the point of use, since these are different jobs and conflating them is how injection bugs survive. Call out any boundary we are treating as internal-and-therefore-safe. Then identify the crossings where the same data is validated twice inconsistently, because the weaker check is the one that matters.',
    why:
      'The validate-at-entry versus encode-at-use distinction is the actual lesson, and generic "sanitise your inputs" advice obscures it. The inconsistent-double-validation question finds the bugs that survive a codebase-wide sanitisation effort.',
    related: ['threat-modeling-stride', 'fail-closed', 'zero-trust', 'anti-corruption-layer'],
    tags: ['security', 'input validation', 'injection', 'boundaries', 'appsec'],
  },

  {
    id: 'secrets-management',
    name: 'Secrets Management',
    aka: ['credential hygiene', 'key rotation', 'no secrets in code', 'vault'],
    origin: 'Operational security practice; twelve-factor config',
    domains: ['security', 'engineering'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Keep credentials out of code and images, scope them narrowly, rotate them routinely, and make rotation cheap enough that you will actually do it after a leak.',
    useWhen: [
      'there is an API key committed in our repository',
      'we have never rotated this credential',
      'the same password is used by four services',
      'a secret leaked and I do not know what to do first',
      'secrets are in environment variables and I am not sure that is enough',
    ],
    prompt:
      'Audit secrets handling here. Inventory every credential: where it is stored, who and what can read it, how it reaches the running process, when it was last rotated, and what it grants. Then test the property that actually matters — how long would rotating each one take today, end to end, including finding every consumer? Anything that cannot be rotated in under an hour is effectively permanent, so treat it as already compromised and say what that implies. Also check the paths people forget: build logs, CI environment output, error reporting payloads, container image layers, and git history after a file was deleted. Finish with the rotation runbook for the highest-risk credential.',
    why:
      'Rotation time is the honest health metric, and asking for it converts a tidy inventory into an actionable risk statement. The forgotten-paths list catches leaks that a repository scan never will.',
    watchOut:
      'Removing a secret from the latest commit does not remove it from git history, and a leaked credential must be assumed used. Rotate first, clean up second.',
    related: ['least-privilege', 'twelve-factor-app', 'blast-radius', 'supply-chain-provenance'],
    tags: ['security', 'credentials', 'secrets', 'rotation', 'devops'],
  },

  {
    id: 'data-minimization',
    name: 'Data Minimisation',
    aka: ['collect less', 'privacy by design', 'data you do not hold cannot leak'],
    origin: 'Privacy engineering; codified in GDPR Article 5',
    domains: ['security', 'data', 'product'],
    intents: ['critique', 'decide'],
    oneLiner:
      'Collect only the data you have a present use for, keep it only as long as that use lasts, and accept that the safest record is the one you never stored.',
    useWhen: [
      'we log everything just in case',
      'do we really need to collect date of birth',
      'we have years of data nobody has ever queried',
      'a breach would expose far more than it needs to',
      'we are trying to reduce our compliance exposure',
    ],
    prompt:
      'Review this against data minimisation. For each field we collect or log, state the specific present use that justifies it — not a hypothetical future one — and flag anything retained on the basis that it might be useful someday. Separately assess: could this field be truncated, hashed, tokenised, or aggregated and still serve its purpose? Could we store a derived answer rather than the raw input, such as an age band instead of a birth date? Then propose retention periods per field with automatic deletion, and identify anything sitting in logs, analytics pipelines, backups or third-party processors that our main retention policy does not actually reach.',
    why:
      'The could-this-be-derived question is where the real reduction comes from, and it is not what a generic privacy review returns. The secondary-copies question catches the data that policies miss entirely — logs and backups are where retention rules go to be ignored.',
    watchOut:
      'Deletion policies interact with legal hold, financial record-keeping and fraud investigation requirements. Check those before automating anything irreversible.',
    related: ['blast-radius', 'least-privilege', 'goodharts-law', 'cohort-analysis'],
    tags: ['security', 'privacy', 'gdpr', 'retention', 'compliance'],
  },

  {
    id: 'supply-chain-provenance',
    name: 'Supply Chain Provenance',
    aka: ['dependency risk', 'SBOM', 'software bill of materials', 'build integrity'],
    origin: 'Post-SolarWinds practice; SLSA framework',
    domains: ['security', 'engineering'],
    intents: ['critique', 'plan'],
    oneLiner:
      'Know what is actually in your build, where each piece came from, and who could change it without you noticing.',
    useWhen: [
      'we have two thousand transitive dependencies and no idea what they do',
      'a package we depend on changed hands recently',
      'how would we know if a dependency was compromised',
      'our CI can push to production and anyone can edit the pipeline',
      'we need to answer a customer security questionnaire about dependencies',
    ],
    prompt:
      'Assess supply chain risk for this project. Cover three layers rather than only the first. Dependencies: which are unmaintained, recently transferred to a new owner, or reachable at runtime with high privilege, and whether we pin by version or by hash. Build: who can modify the pipeline, whether the build is reproducible, and whether an artefact could be swapped between build and deploy. Developer environment: what a compromised laptop or a malicious editor extension could inject. For each risk, tell me the detection we would need, since prevention here is partial by nature — then name the single change that would most improve our ability to notice a compromise, as opposed to preventing one.',
    why:
      'Steering toward detection rather than prevention is the honest framing for supply chain risk, where full prevention is not achievable. Naming the three layers stops the answer being "run npm audit", which addresses the least important one.',
    related: ['secrets-management', 'attack-surface-reduction', 'twelve-factor-app', 'blast-radius'],
    tags: ['security', 'dependencies', 'supply chain', 'ci cd', 'build'],
  },
]
