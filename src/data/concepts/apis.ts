import type { Concept } from '../types'

export const apis: Concept[] = [
  {
    id: 'api-first-design',
    name: 'API-First Design',
    aka: ['contract before code', 'design-first API'],
    origin: 'Web API practice; formalised through OpenAPI-driven workflows',
    domains: ['engineering'],
    intents: ['plan', 'structure'],
    oneLiner:
      'Agree the interface with its consumers before building the implementation, so the shape serves callers rather than exposing whatever the code happened to produce.',
    useWhen: [
      'the endpoint mirrors our database tables and clients hate it',
      'the client team is blocked waiting for us to finish the backend',
      'we shipped it and immediately had to redesign for the second consumer',
      'every client writes the same glue code to make our responses usable',
    ],
    prompt:
      'Design this interface from the consumer inward. Start by writing the two or three call sequences a client will actually perform end to end, then derive the operations from those, since resources derived from our internal model are what force clients into glue code. Produce the interface definition first and identify what a client can build against it immediately with a mock. Then check it against the questions that reveal a leaky design: does the client need to know our internal states, must it make several calls to do one thing, and does anything in the response exist only because it was cheap for us to include.',
    why:
      'Deriving operations from real client sequences rather than from the data model is the whole difference, and the mockability check makes the parallel-work benefit concrete.',
    watchOut:
      'Designing an interface for consumers who do not exist yet invites speculative generality. Design against real known callers and keep it small.',
    related: ['openapi-contract-first', 'rest-resource-modeling', 'api-ergonomics', 'backend-for-frontend'],
    tags: ['api', 'design', 'contracts', 'collaboration'],
  },

  {
    id: 'openapi-contract-first',
    name: 'Contract-First with OpenAPI',
    aka: ['spec-driven development', 'schema-first API', 'generated stubs'],
    origin: 'Swagger, 2011; now the OpenAPI Specification',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Write the machine-readable interface definition first and generate clients, validation and documentation from it, so they cannot drift from each other.',
    useWhen: [
      'the documentation says one thing and the API does another',
      'each client team hand-writes their own request models',
      'we cannot tell whether a change breaks anyone',
      'the examples in the docs no longer work',
    ],
    prompt:
      'Set up a definition-driven workflow for this API. Decide what is generated from the definition — server request validation, client libraries, documentation, mock servers — and, more importantly, what enforces that the running service matches it, since a definition nobody validates against is documentation with extra steps. Specify that check in the pipeline. Then handle the awkward parts honestly: expressing conditional requirements and polymorphic responses, keeping examples accurate, and whether the definition is hand-written or generated from code, with the trade-off in each direction stated for our situation.',
    why:
      'The runtime conformance check is what stops drift, and it is the piece almost always missing from spec-driven setups that then rot within a quarter.',
    watchOut:
      'Generating the definition from code means it always matches and always reflects implementation accidents. Generating code from the definition means the definition can lie until you verify it.',
    related: ['api-first-design', 'contract-testing', 'api-documentation-quality', 'schema-evolution'],
    tags: ['api', 'contracts', 'tooling', 'documentation'],
  },

  {
    id: 'rest-resource-modeling',
    name: 'Resource Modelling',
    aka: ['REST resource design', 'nouns not verbs', 'URI design'],
    origin: 'Roy Fielding\'s dissertation, 2000; refined in web API practice',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Model the interface as a set of addressable things with uniform operations, and know when an action genuinely does not fit that shape.',
    useWhen: [
      'our endpoints are all verbs like doThing and processOrder',
      'this operation is not a create or an update and I do not know how to express it',
      'the resource hierarchy is five levels deep and unusable',
      'the same data is available at four different paths',
    ],
    prompt:
      'Model these operations as resources. Identify the nouns, their identity, and their relationships, then map each required operation onto the uniform methods. For the ones that do not fit — approve, cancel, retry, send — do not contort them: choose deliberately between modelling the action as a resource in its own right, such as a cancellation record, and exposing an explicit action endpoint, and give the rule for when each applies. Then check the hierarchy: nesting beyond one level usually signals a relationship better expressed as a filter, so flag those. Finish with the canonical path for each resource so one thing has one address.',
    why:
      'Action-shaped operations are where resource modelling breaks down, and treating the action as a resource is the move that keeps the design honest without pretending everything is a noun.',
    watchOut:
      'Strict resource purity for an interface that is really a set of procedures produces awkward names and unhappy clients. The shape should follow the domain.',
    related: ['api-naming-conventions', 'http-status-semantics', 'api-first-design', 'hypermedia-controls'],
    tags: ['api', 'rest', 'design', 'modelling'],
  },

  {
    id: 'http-status-semantics',
    name: 'HTTP Status Semantics',
    aka: ['status code selection', '4xx versus 5xx', 'correct response codes'],
    origin: 'HTTP specification; RFC 9110 and predecessors',
    domains: ['engineering'],
    intents: ['decide', 'critique'],
    oneLiner:
      'Status codes are a contract with intermediaries and clients about whether to retry, cache, re-authenticate or give up — choosing them casually breaks all four.',
    useWhen: [
      'we return two hundred with an error object inside',
      'clients retry on errors that will never succeed',
      'our monitoring cannot distinguish client mistakes from our failures',
      'a proxy cached an error response and served it for an hour',
    ],
    prompt:
      'Audit the status codes on these endpoints. For each response, state what the code tells a client and an intermediary — is it retryable, is it cacheable, should credentials be refreshed, is the request itself invalid — and flag mismatches with the actual condition. Pay particular attention to the three that matter operationally: returning success for a failed operation, which hides errors from every monitoring system; returning a server error for invalid input, which makes clients retry pointlessly; and conflating unauthenticated with unauthorised, which sends clients into a re-login loop they cannot escape. Then give the corrected mapping with the response body shape for each.',
    why:
      'The retry and monitoring consequences are what make status codes matter, and framing each code as an instruction to the client makes the right choice obvious.',
    watchOut:
      'Some clients and gateways treat certain codes specially regardless of your intent. Check how your infrastructure handles the codes before adopting an unusual one.',
    related: ['error-response-design', 'idempotent-http-methods', 'retry-with-backoff', 'rest-resource-modeling'],
    tags: ['api', 'http', 'errors', 'protocols'],
  },

  {
    id: 'hypermedia-controls',
    name: 'Hypermedia Controls',
    aka: ['HATEOAS', 'links in responses', 'Richardson maturity model'],
    origin: 'Roy Fielding, 2000; Leonard Richardson\'s maturity model, 2008',
    domains: ['engineering'],
    intents: ['decide', 'explain'],
    oneLiner:
      'Include links to the operations currently available on a resource so clients follow the server\'s state machine instead of hard-coding one of their own.',
    useWhen: [
      'clients hard-code which actions are allowed and get it wrong',
      'we changed the workflow and every client had to be updated',
      'the client duplicates our business rules to decide what to show',
      'nobody can tell from the response what can be done next',
    ],
    prompt:
      'Assess whether including available-action links helps this API, and be even-handed rather than doctrinaire. The concrete benefit is that the server owns which transitions are currently legal, so a client showing a cancel button does not need to reimplement our cancellation rules — say whether that duplication exists for us today. If it does, design the link representation, the naming of relationships, and how a client discovers what each means. If it does not, say plainly that the ceremony is not worth it here. Either way, identify the state-dependent actions clients currently guess at, since those are worth exposing regardless of the format.',
    why:
      'The duplicated-business-rules test decides this concretely, and the state-dependent actions finding is valuable even for teams that reject the full approach.',
    watchOut:
      'Very few clients actually navigate by links; most hard-code paths anyway. The benefit is usually the permission information, not the navigation.',
    related: ['rest-resource-modeling', 'api-versioning-strategy', 'state-pattern', 'api-ergonomics'],
    tags: ['api', 'rest', 'hypermedia', 'coupling'],
  },

  {
    id: 'api-ergonomics',
    name: 'API Ergonomics',
    aka: ['developer experience', 'usability of interfaces', 'pit of success'],
    origin: 'API usability research; Joshua Bloch\'s API design talks',
    domains: ['engineering', 'design'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Judge an interface by how easily a competent stranger does the right thing first time — and by how hard it makes doing the wrong thing.',
    useWhen: [
      'everyone integrating with us asks the same three questions',
      'the common case takes four calls and a lot of reading',
      'people keep using this parameter incorrectly',
      'our support load is dominated by integration mistakes',
    ],
    prompt:
      'Evaluate this interface for usability using evidence rather than taste. Write the code a new integrator must produce for the most common task and count the decisions they have to make correctly with no guidance. Then apply the specific tests: is the simplest useful call actually simple, are dangerous operations harder to reach than safe ones, can a required parameter be omitted silently, are two parameters of the same type adjacent and swappable, and does the naming match the vocabulary of the domain rather than our internals. Rank the findings by the questions we currently get from real integrators.',
    why:
      'Grounding the review in support questions and in the swappable-adjacent-parameters class of error turns a subjective critique into specific, defensible changes.',
    watchOut:
      'Optimising for the first-time experience can hurt the daily user. Check the ergonomics of the tenth integration as well as the first.',
    related: ['principle-of-least-astonishment', 'api-naming-conventions', 'api-documentation-quality', 'client-sdk-design'],
    tags: ['api', 'usability', 'developer experience', 'design'],
  },

  {
    id: 'api-versioning-strategy',
    name: 'API Versioning Strategy',
    aka: ['breaking change management', 'version in path or header'],
    origin: 'Web API practice; long-running debate with several settled conventions',
    domains: ['engineering'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Decide how a breaking change reaches clients — a new version, a compatibility layer, or never — knowing that every version you publish you must operate.',
    useWhen: [
      'we need to change a response shape and clients cannot all update at once',
      'we are supporting four versions and it is crushing us',
      'someone wants to add a version for a change that is not breaking',
      'we do not know who is still on the old version',
    ],
    prompt:
      'Design our versioning approach. First define breaking precisely for our contract, since the boundary is not obvious: adding an optional field is safe, adding an enum value may not be, tightening validation is breaking, and changing the meaning of a field is breaking while looking additive. Write that rule down. Then choose the mechanism — path, header, or content negotiation — with the practical consequences for caching, routing, logging and client experience. The important part is the operational commitment: how many versions we support at once, for how long, how usage per version is measured, and how a client is migrated off one.',
    why:
      'Most versioning pain comes from publishing versions too readily and having no retirement path. Defining breaking precisely and committing to a support window is what limits the sprawl.',
    watchOut:
      'Version-per-change produces an unmaintainable matrix. Prefer additive evolution within a version and reserve new versions for genuine incompatibility.',
    related: ['deprecation-policy', 'schema-evolution', 'contract-testing', 'plugin-architecture'],
    tags: ['api', 'versioning', 'compatibility', 'lifecycle'],
  },

  {
    id: 'deprecation-policy',
    name: 'Deprecation Policy',
    aka: ['sunset headers', 'end-of-life process', 'retiring an endpoint'],
    origin: 'API lifecycle practice; the HTTP Sunset header, RFC 8594',
    domains: ['engineering', 'writing'],
    intents: ['plan', 'communicate'],
    oneLiner:
      'Retiring an interface needs a defined notice period, machine-readable signals, usage measurement and a migration path — announcement alone changes nothing.',
    useWhen: [
      'we announced the deprecation a year ago and traffic has not dropped',
      'we cannot remove this endpoint because we do not know who uses it',
      'clients found out their integration broke when it broke',
      'we have twelve deprecated things nobody has ever removed',
    ],
    prompt:
      'Write the retirement plan for this interface. Include the four mechanisms that make deprecation actually complete: measurement of usage broken down by identifiable client so we know who must move, machine-readable signals in responses so integrations can detect it programmatically, direct notification to the specific consumers rather than a general announcement, and a documented migration with the replacement call shown side by side. Then define the endgame — brownout periods where the endpoint fails briefly on a schedule to surface unnoticed dependencies, the final date, and the exception process. Say what happens if a major customer has not migrated.',
    why:
      'Brownouts and per-client usage measurement are what convert a deprecation from an announcement into a completed removal, and both are usually absent.',
    watchOut:
      'A deprecation with no removal date will not be actioned by anyone. The date is the mechanism; the notice is only the courtesy.',
    related: ['api-versioning-strategy', 'api-usage-analytics', 'status-page-communication', 'schema-evolution'],
    tags: ['api', 'lifecycle', 'communication', 'migration'],
  },

  {
    id: 'api-pagination',
    name: 'Pagination Design',
    aka: ['cursor versus offset', 'keyset pagination', 'page tokens'],
    origin: 'Web API practice; keyset pagination from database performance work',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Offset paging is simple, gets slower the deeper you go, and skips or duplicates rows when the data changes; cursor paging fixes both at the cost of arbitrary jumps.',
    useWhen: [
      'page fifty thousand takes twenty seconds',
      'users report seeing the same record twice while scrolling',
      'new records are inserted while someone pages through and some are missed',
      'clients request ten thousand records at once and it falls over',
    ],
    prompt:
      'Design pagination for this collection. Compare offset and cursor approaches on the two properties that matter: cost at depth, and stability when records are inserted or deleted mid-traversal — demonstrate the skip-and-duplicate problem concretely with our sort order. Recommend one, and if it is cursor-based, specify what the cursor encodes, that it must be opaque to clients, and that the sort must be on a unique or tie-broken key or the traversal will still skip. Then set the maximum and default page size, the response shape indicating more results, and whether a total count is provided given that counting is often the most expensive part.',
    why:
      'The requirement for a unique tie-broken sort key is the detail that makes cursor pagination correct, and the total-count cost is the hidden expense in most list endpoints.',
    watchOut:
      'Clients will page through everything to build their own copy. Rate limits and a bulk export path are cheaper than serving that through pagination.',
    related: ['filtering-sorting-conventions', 'index-selection', 'streaming-vs-buffering', 'api-quota-design'],
    tags: ['api', 'pagination', 'performance', 'design'],
  },

  {
    id: 'filtering-sorting-conventions',
    name: 'Filtering and Sorting Conventions',
    aka: ['query parameter design', 'search parameters', 'expression languages in URLs'],
    origin: 'Web API practice; conventions from OData, JSON:API and similar',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Decide how much query power the interface exposes, because every filter you allow becomes a query the database must serve forever.',
    useWhen: [
      'clients ask for a new filter parameter every month',
      'someone built a filter that does a full table scan',
      'our query syntax is different on every endpoint',
      'we exposed a flexible query language and now cannot change the schema',
    ],
    prompt:
      'Define the filtering and sorting contract for these endpoints. Choose the expressiveness level deliberately — a fixed set of named filters, a constrained operator grammar, or a general query language — and justify from what clients actually need against what we can index. The essential constraint is that every allowed filter and sort must be servable within our latency objective, so state which fields are filterable and sortable based on indexes that exist, and reject the rest explicitly rather than serving them slowly. Then standardise the syntax across endpoints, define behaviour for unknown parameters, and specify how filters compose.',
    why:
      'Tying allowed filters to existing indexes is the constraint that prevents a flexible query interface from becoming an unbounded performance liability.',
    watchOut:
      'A general query language exposes your schema as a public contract. Every internal field name then becomes something you cannot rename.',
    related: ['api-pagination', 'index-selection', 'graphql-schema-design', 'api-quota-design'],
    tags: ['api', 'queries', 'performance', 'conventions'],
  },

  {
    id: 'partial-update-semantics',
    name: 'Partial Update Semantics',
    aka: ['PATCH versus PUT', 'merge patch', 'field masks'],
    origin: 'HTTP specifications; JSON Merge Patch RFC 7386, JSON Patch RFC 6902',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Updating part of a resource requires deciding how the absence of a field is interpreted — unchanged or cleared — and saying so unambiguously.',
    useWhen: [
      'a client omitted a field and it got wiped',
      'we cannot tell the difference between setting null and not sending the field',
      'two clients updating different fields overwrite each other',
      'nobody knows whether this endpoint replaces or merges',
    ],
    prompt:
      'Specify partial update behaviour for this resource. State explicitly what an omitted field means and how a client clears a value versus leaves it alone, since conflating those two is the defect that silently deletes data. Compare merge-style patches, explicit operation lists, and an explicit list of fields being updated, and recommend one for our clients. Then handle the compound cases: updating an element within an array, updating nested objects, and concurrent updates to different fields of the same resource where a naive read-modify-write loses one. Finish with the validation applied to a partial update, since whole-object validation rules may not apply to a fragment.',
    why:
      'The clear-versus-leave-alone ambiguity is a data loss bug, and the array element case is where every merge-based scheme breaks down. Both need deciding rather than discovering.',
    watchOut:
      'Partial updates make request validation and audit logging harder, because the meaning of the request depends on current state. Log the resolved change, not just the request.',
    related: ['http-status-semantics', 'optimistic-concurrency', 'field-selection-expansion', 'input-validation-boundary'],
    tags: ['api', 'http', 'updates', 'semantics'],
  },

  {
    id: 'bulk-operations-api',
    name: 'Bulk Operations',
    aka: ['batch endpoints', 'multi-item requests', 'partial success'],
    origin: 'Web API practice; common in enterprise integration interfaces',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Accepting many items in one request removes round trips and forces you to answer the hard question: what happens when some succeed and some fail.',
    useWhen: [
      'clients make ten thousand individual calls to import data',
      'our batch endpoint fails the whole thing if one record is bad',
      'the client cannot tell which items in the batch succeeded',
      'a large import times out halfway through',
    ],
    prompt:
      'Design a bulk operation for this resource. The central decision is failure semantics, so state it first and make it explicit in the contract: all-or-nothing, or best-effort with a per-item result. Best-effort is usually right, so design the response to report status per item keyed to the client\'s own identifiers rather than positional indexes, which break when clients retry a subset. Then specify the limits — maximum items, maximum payload — and what happens beyond them. Cover duplicate submission of the same batch, ordering guarantees within a batch, and whether the operation is synchronous or returns a job for large volumes.',
    why:
      'Keying per-item results to client-supplied identifiers is what makes retrying the failed subset possible, and positional results quietly break that.',
    watchOut:
      'A bulk endpoint with all-or-nothing semantics over a large batch will fail forever on one bad record. Clients cannot make progress without per-item results.',
    related: ['async-job-api', 'idempotency-keys', 'batching-amortization', 'error-response-design'],
    tags: ['api', 'batch', 'error handling', 'design'],
  },

  {
    id: 'async-job-api',
    name: 'Long-Running Operation API',
    aka: ['async job pattern', 'operation resource', 'polling for completion'],
    origin: 'Web API practice; the operation resource pattern from cloud provider APIs',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'When work takes longer than a request should, accept it, return a handle to a job resource, and let the client track progress rather than holding a connection open.',
    useWhen: [
      'the export request times out at the gateway',
      'clients hold a connection open for four minutes and it drops',
      'we cannot tell a client that their job is still running',
      'a retry after timeout started the whole job again',
    ],
    prompt:
      'Design the asynchronous contract for this operation. Specify the acceptance response and the job resource: its states, progress representation, result location, and error detail on failure. Then cover the client-side questions that determine whether this is usable: the polling interval we recommend and how we communicate it, how long a completed job\'s result remains retrievable, whether a job can be cancelled and what cancellation guarantees, and how a client that submitted twice avoids duplicate work. Finally, compare polling against a completion callback for our consumers and say which we should offer, or both, and why.',
    why:
      'Result retention, cancellation semantics and duplicate submission are the three things clients need and specifications usually omit, leaving each integrator to discover them.',
    watchOut:
      'Job resources accumulate. Without a retention policy they become an unbounded table and a slow information leak of past activity.',
    related: ['bulk-operations-api', 'webhook-design', 'idempotency-keys', 'workflow-orchestration'],
    tags: ['api', 'async', 'jobs', 'design'],
  },

  {
    id: 'webhook-design',
    name: 'Webhook Design',
    aka: ['outbound callbacks', 'event delivery to customers', 'HTTP push'],
    origin: 'Web integration practice; conventions established by payment and SaaS platforms',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Pushing events to customer endpoints means you own delivery reliability, security and the consequences of their downtime — design for all three.',
    useWhen: [
      'customers say they never received the event and we cannot prove otherwise',
      'a customer endpoint went down and our queue backed up',
      'someone forged a request to a customer pretending to be us',
      'customers receive the same event several times and process it twice',
    ],
    prompt:
      'Design our outbound event delivery. Cover the security first: request signing with a timestamp to prevent replay, and how customers rotate a signing secret — unauthenticated webhooks are a standing vulnerability for every consumer. Then delivery: the retry schedule, how long we keep retrying, at-least-once semantics and therefore the event identifier consumers deduplicate on, and ordering, which you should probably not promise. Then protect ourselves: per-endpoint circuit breaking and automatic disabling of persistently failing destinations with notification. Finish with the consumer\'s recovery path — a way to list or replay missed events without contacting support.',
    why:
      'Signing plus replay protection and a self-service replay path are the two things that separate a professional webhook implementation from one that generates permanent support load.',
    watchOut:
      'Sending full payloads to customer endpoints leaks data if a URL is misconfigured or later reassigned. Consider sending an identifier the consumer fetches with its own credentials.',
    related: ['delivery-semantics', 'retry-with-backoff', 'idempotency-keys', 'circuit-breaker'],
    tags: ['api', 'webhooks', 'events', 'integration'],
  },

  {
    id: 'realtime-transport-choice',
    name: 'Real-Time Transport Choice',
    aka: ['websockets versus SSE versus polling', 'push transport selection'],
    origin: 'Web platform practice',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Choose among polling, long polling, server-sent events and websockets by direction, message rate and the infrastructure you must pass through.',
    useWhen: [
      'we poll every second and it is most of our traffic',
      'the websocket connection drops behind corporate proxies',
      'updates take too long to reach the screen',
      'someone wants real-time and I do not know what that requires',
    ],
    prompt:
      'Choose a transport for this update flow. Characterise the requirement first — direction, message frequency, acceptable delay, concurrent client count, and payload size — then compare the options on those plus the practical constraints: proxy and load balancer compatibility, connection count limits per server, reconnection and missed-message recovery, and authentication of a long-lived connection including what happens when the token expires mid-connection. Recommend the simplest option that meets the requirement, since periodic polling is frequently adequate and vastly easier to operate. Finish with the resume semantics: how a client that was disconnected for thirty seconds catches up.',
    why:
      'Missed-message recovery on reconnect and mid-connection token expiry are the two things that break real-time systems in production, and neither appears in a transport comparison table.',
    watchOut:
      'Persistent connections change your scaling model: connection count rather than request rate becomes the limit, and deploys now disconnect everyone at once.',
    related: ['webhook-design', 'graceful-shutdown', 'backpressure', 'offline-first-sync'],
    tags: ['api', 'realtime', 'websockets', 'transport'],
  },

  {
    id: 'error-response-design',
    name: 'Error Response Design',
    aka: ['problem details', 'machine-readable errors', 'error codes'],
    origin: 'API practice; RFC 9457 Problem Details for HTTP APIs',
    domains: ['engineering'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'An error response has two audiences — code that must branch on it and a human who must fix something — and it needs a stable identifier for the first and useful detail for the second.',
    useWhen: [
      'clients parse our error messages with string matching',
      'we changed an error message and broke an integration',
      'the error says invalid request and nothing else',
      'support cannot correlate a customer error report with our logs',
    ],
    prompt:
      'Design the error contract for this API. Every error carries a stable machine-readable code that is part of the contract and never changes wording, a human message that may change, the specific field or resource at fault, and a correlation identifier the client can quote to support that appears in our logs. For validation failures, return all the problems rather than the first. Then define the code taxonomy: enough codes that a client can branch usefully, few enough to document, and grouped so a client can handle a category it does not recognise. Finish with the rule for what must never appear in an error, such as internal identifiers, stack traces, or whether an account exists.',
    why:
      'The stable code plus mutable message split is what lets you improve messages without breaking clients, and the correlation identifier is what makes support tractable.',
    watchOut:
      'Detailed errors leak information. Distinguishing wrong password from unknown user is a helpful message and a user enumeration vulnerability.',
    related: ['http-status-semantics', 'error-message-design', 'input-validation-boundary', 'api-documentation-quality'],
    tags: ['api', 'errors', 'contracts', 'support'],
  },

  {
    id: 'input-validation-boundary',
    name: 'Validation at the Boundary',
    aka: ['input sanitisation point', 'edge validation', 'trusted core'],
    origin: 'Secure design practice; related to parse-don\'t-validate',
    domains: ['engineering', 'security'],
    intents: ['structure', 'critique'],
    oneLiner:
      'Validate untrusted input once, at the edge, into a shape the rest of the system can trust — and make sure there is exactly one edge.',
    useWhen: [
      'we validate in the controller and again in the service and again in the model',
      'a new endpoint skipped validation because it was added elsewhere',
      'background jobs process data that never passed the checks',
      'the same field has different rules in two places',
    ],
    prompt:
      'Map the trust boundary for this system and place validation on it. Enumerate every entry point where untrusted data arrives — HTTP handlers, queue consumers, scheduled jobs reading external files, webhook receivers, administrative tools, and database records written by an older version — because the ones that bypass the main path are where invalid data enters. For each, state what validates it today. Then define validation as a conversion into a trusted type rather than a check, so downstream code cannot receive unvalidated data. Finish with the rules that must still be checked deeper because they need database state, and why those are different.',
    why:
      'Enumerating non-HTTP entry points is what finds the bypass, and separating format validation at the edge from state-dependent rules deeper down prevents the duplication that makes both rot.',
    watchOut:
      'Edge validation cannot check business rules that depend on current state, and pretending otherwise pushes race conditions into the boundary layer.',
    related: ['parse-dont-validate', 'trust-boundary', 'error-response-design', 'defensive-programming-limits'],
    tags: ['api', 'validation', 'security', 'boundaries'],
  },

  {
    id: 'content-negotiation',
    name: 'Content Negotiation',
    aka: ['Accept headers', 'media types', 'representation selection'],
    origin: 'HTTP specification',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Let a client state what representation it wants and what it is sending, so one resource can serve several formats and versions without separate endpoints.',
    useWhen: [
      'we need to return CSV as well as JSON from the same endpoint',
      'the client sent form data and we assumed JSON',
      'we added a format and had to duplicate every route',
      'caches are serving the wrong representation to clients',
    ],
    prompt:
      'Design representation selection for these resources. Specify the media types we accept and produce, the default when the client expresses no preference, and the response when we cannot satisfy the request rather than silently returning something else. Then address the parts that go wrong: the interaction with caching, where the varying header must be declared or intermediaries will serve one client\'s format to another, and whether we use custom media types to carry version information, with the trade-off against a path segment. Finish with the request side, since accepting several input formats multiplies the parsing and validation surface.',
    why:
      'The caching interaction is the failure that produces genuinely baffling bugs, and it is invisible until an intermediary is in the path.',
    watchOut:
      'Supporting many formats multiplies your test matrix and your attack surface. Add a format when a real consumer needs it, not for symmetry.',
    related: ['api-versioning-strategy', 'cache-key-design', 'cdn-edge-caching', 'http-status-semantics'],
    tags: ['api', 'http', 'formats', 'caching'],
  },

  {
    id: 'field-selection-expansion',
    name: 'Field Selection and Expansion',
    aka: ['sparse fieldsets', 'include parameter', 'sideloading relations'],
    origin: 'Web API practice; conventions from JSON:API and cloud provider APIs',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Let clients ask for fewer fields or for related resources inline, so they neither download what they do not need nor make a call per relation.',
    useWhen: [
      'mobile clients download a huge response to show three fields',
      'clients fetch a list and then call us once per item for details',
      'we keep adding endpoints for slightly different response shapes',
      'the response contains everything because different clients need different parts',
    ],
    prompt:
      'Design field selection and relation inclusion for this API. Define the syntax for both, the default when neither is specified, and the maximum expansion depth — since unbounded nesting lets one request generate an arbitrary query load, which is the risk that makes this feature dangerous. Then map each expansion to the data access it triggers and confirm it can be served in bounded work, batching rather than looping. Cover authorisation carefully: an included relation must be checked against the caller\'s permissions independently, not inherited from the parent. Finish with caching implications, since the response now varies by parameter.',
    why:
      'Per-relation authorisation and bounded expansion depth are the two controls that keep this from becoming both a performance and a security hole.',
    watchOut:
      'Once clients depend on particular expansions, those relation paths become part of your contract and constrain the data model as much as the fields do.',
    related: ['payload-size-reduction', 'over-fetching-graphql', 'n-plus-one-queries', 'cache-key-design'],
    tags: ['api', 'payloads', 'performance', 'design'],
  },

  {
    id: 'graphql-schema-design',
    name: 'GraphQL Schema Design',
    aka: ['graph schema modelling', 'nullability in GraphQL', 'connections'],
    origin: 'Facebook GraphQL, 2015; Relay connection conventions',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Model the graph around client use cases with deliberate nullability and pagination conventions, because the schema is a contract you cannot easily break later.',
    useWhen: [
      'our schema mirrors the database and clients traverse it awkwardly',
      'one failing field makes the whole response null',
      'every list field is unpaginated and someone requested a million items',
      'we cannot tell which fields are actually used by anyone',
    ],
    prompt:
      'Design this schema around client needs rather than storage. Treat nullability as the central decision: a non-null field makes the parent null if it errors, so specify which fields must be non-null for client sanity and which should be nullable so a partial failure degrades gracefully. Then apply pagination conventions to every list field without exception, since an unpaginated list is an unbounded query. Model mutations to return the modified entities plus a structured error payload rather than throwing. Finish with the naming and evolution rules, given that fields can be deprecated but the schema is otherwise additive-only in practice.',
    why:
      'Nullability determines partial-failure behaviour, which is the single most consequential and least considered choice in a graph schema.',
    watchOut:
      'A schema that mirrors your tables exposes your data model as a public contract and makes every rename a breaking change for someone.',
    related: ['over-fetching-graphql', 'persisted-queries', 'api-pagination', 'schema-evolution'],
    tags: ['api', 'graphql', 'schema', 'design'],
  },

  {
    id: 'over-fetching-graphql',
    name: 'Query Cost Control',
    aka: ['query depth limiting', 'complexity analysis', 'expensive query protection'],
    origin: 'GraphQL operational practice; applies to any flexible query interface',
    domains: ['engineering', 'security'],
    intents: ['structure', 'diagnose'],
    oneLiner:
      'A flexible query interface lets one request ask for arbitrarily expensive work, so cost must be estimated and bounded before execution.',
    useWhen: [
      'one client query brought down the database',
      'we cannot rate limit fairly because requests vary enormously in cost',
      'a deeply nested query fanned out into thousands of lookups',
      'we do not know which queries are expensive until they run',
    ],
    prompt:
      'Design cost control for this query interface. Define a static complexity estimate computed before execution from depth, list multipliers and per-field weights derived from what each field actually costs to resolve — then set the limit per client class. Explain why request-count rate limiting is inadequate here and why cost-based budgets are needed instead. Add depth and breadth caps as a simple backstop. Then cover runtime protection for what static analysis cannot predict: execution timeouts, batching of repeated lookups within a request, and killing a query that exceeds its estimated cost. Finish with the telemetry that shows cost per client and per field.',
    why:
      'Pre-execution cost estimation is the control that makes flexible queries safe, and per-field weights derived from real resolution cost are what make the estimate meaningful.',
    watchOut:
      'Static complexity ignores data distribution: the same query is cheap for a small account and ruinous for the largest one. Runtime limits are still required.',
    related: ['graphql-schema-design', 'rate-limiting-algorithms', 'api-quota-design', 'n-plus-one-queries'],
    tags: ['api', 'graphql', 'performance', 'protection'],
  },

  {
    id: 'persisted-queries',
    name: 'Persisted Queries',
    aka: ['allowlisted operations', 'query registry', 'operation hashing'],
    origin: 'GraphQL production practice; Apollo and Relay implementations',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Register the queries clients are allowed to send and let them reference each by identifier, converting an open query interface into a fixed set of known operations.',
    useWhen: [
      'we cannot let arbitrary queries reach our production database',
      'request payloads are large because they carry the whole query',
      'we have no idea which fields are safe to remove',
      'someone can craft an expensive query and we cannot pre-approve it',
    ],
    prompt:
      'Design a registered-operation workflow for this API. Specify how operations are extracted at client build time, registered, and referenced at runtime, and whether unregistered operations are rejected outright — rejection is what converts this from a bandwidth optimisation into a security control, so make that a deliberate decision. Then handle the operational consequences: how a new client version\'s operations are registered before deployment, how old versions keep working, how the registry is pruned, and how developers work locally without registration friction. Finish with the benefit that usually matters most, which is knowing exactly which fields are in use and therefore safely removable.',
    why:
      'The removability benefit is the underrated one, and the deploy-ordering problem is what breaks these systems in practice. Both should drive the design.',
    watchOut:
      'A registry that lags client deployment causes total client failure. The registration must be part of the release, not a manual step afterwards.',
    related: ['graphql-schema-design', 'over-fetching-graphql', 'api-usage-analytics', 'deprecation-policy'],
    tags: ['api', 'graphql', 'security', 'operations'],
  },

  {
    id: 'grpc-and-protobuf',
    name: 'Binary RPC and Protobuf',
    aka: ['gRPC', 'protocol buffers', 'schema-defined RPC'],
    origin: 'Google; Protocol Buffers public in 2008, gRPC in 2015',
    domains: ['engineering'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Schema-defined binary RPC gives efficient encoding, generated clients and streaming, at the cost of browser support and human-readable debugging.',
    useWhen: [
      'our internal service calls spend most of their time parsing JSON',
      'we hand-write client code for every internal service',
      'we need bidirectional streaming between services',
      'someone proposed switching internal APIs and I need the trade-offs',
    ],
    prompt:
      'Assess binary schema-defined RPC for this interface. Compare against JSON over HTTP on the dimensions that actually matter here: encoding cost at our message rate, generated versus hand-written clients, streaming support, and how a breaking change is detected. Then be specific about the costs: browser access requires a proxy layer, debugging needs tooling because payloads are not readable, and field numbering rules must be understood by everyone who edits a schema — reusing a retired field number silently corrupts data. Recommend where in our system it fits, which is usually service-to-service and not the public edge.',
    why:
      'Field number reuse is a silent data corruption hazard specific to this encoding, and the debuggability cost is the thing teams underestimate before adopting.',
    watchOut:
      'Generated clients tie every consumer to your schema version and build tooling. That coupling is fine internally and painful across organisational boundaries.',
    related: ['schema-evolution', 'api-versioning-strategy', 'service-mesh', 'contract-testing'],
    tags: ['api', 'rpc', 'protocols', 'serialisation'],
  },

  {
    id: 'api-gateway-pattern',
    name: 'API Gateway',
    aka: ['edge proxy', 'front door', 'cross-cutting edge concerns'],
    origin: 'Microservices practice; commercial and open-source gateway products',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'A single entry point handling authentication, rate limiting, routing and observability for every service behind it — useful, and a single point of failure by construction.',
    useWhen: [
      'every service implements its own authentication slightly differently',
      'we cannot enforce rate limits consistently across services',
      'clients need to know which host serves which endpoint',
      'someone wants to buy a gateway and I do not know what we need from it',
    ],
    prompt:
      'Decide what belongs at the edge for our system. List candidate responsibilities — authentication, coarse authorisation, rate limiting, routing, request and response transformation, caching, telemetry — and for each say whether it belongs in the gateway, in the services, or both, using one criterion: does putting it here mean services can trust it, or must they verify anyway. Anything services must re-verify is duplicated work, and anything they wrongly trust is a security hole if the gateway is bypassed, so state how bypass is prevented. Then address it as a critical component: its availability, deployment risk, and configuration change process.',
    why:
      'The trust-or-verify criterion resolves what goes at the edge, and the bypass question is what determines whether edge authentication is a real control or an assumption.',
    watchOut:
      'Business logic and transformations accumulate in gateway configuration, where they are untested and invisible to developers. Keep it to cross-cutting concerns.',
    related: ['backend-for-frontend', 'service-mesh', 'rate-limiting-algorithms', 'api-authentication-choice'],
    tags: ['api', 'infrastructure', 'edge', 'architecture'],
  },

  {
    id: 'api-authentication-choice',
    name: 'API Authentication Choice',
    aka: ['API keys versus OAuth', 'bearer tokens', 'mutual TLS'],
    origin: 'Web security practice; OAuth 2.0 and OpenID Connect specifications',
    domains: ['engineering', 'security'],
    intents: ['decide', 'structure'],
    oneLiner:
      'Pick the authentication mechanism from who the caller is and what revocation you need — a long-lived key and a short-lived delegated token solve different problems.',
    useWhen: [
      'we issue API keys that never expire and cannot be scoped',
      'a partner needs to act on behalf of our users and we do not know how',
      'a leaked credential could not be revoked without breaking everything',
      'we are about to invent our own token format',
    ],
    prompt:
      'Choose authentication for these callers, treating each caller type separately: our own first-party clients, server-to-server partners, and third parties acting on behalf of a user. For each, compare the options on lifetime and revocation, scoping granularity, what happens when the credential leaks, and the implementation burden on the caller. Then specify the operational mechanics that determine real security: rotation without downtime, how a compromised credential is revoked immediately, whether tokens are self-contained and therefore unrevokable until expiry, and how credentials are issued and stored. Do not design a custom token format.',
    why:
      'Self-contained tokens cannot be revoked before expiry, which is the property that determines your incident response capability, and it is rarely considered at design time.',
    watchOut:
      'Long-lived API keys in configuration files leak through repositories, logs and screenshots. Assume any key with no expiry will eventually be exposed.',
    related: ['token-scope-design', 'secrets-management', 'api-gateway-pattern', 'least-privilege'],
    tags: ['api', 'security', 'authentication', 'credentials'],
  },

  {
    id: 'token-scope-design',
    name: 'Token Scope Design',
    aka: ['permission scopes', 'least privilege tokens', 'granular access'],
    origin: 'OAuth 2.0 scope model; general authorisation practice',
    domains: ['security', 'engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'Define permissions fine enough that an integration can request only what it needs, and coarse enough that users and developers can actually understand them.',
    useWhen: [
      'every integration asks for full access because that is the only option',
      'our permission list has ninety entries and nobody understands them',
      'a compromised integration token could do anything',
      'users approve a consent screen they cannot possibly evaluate',
    ],
    prompt:
      'Design the permission model for our API. Derive scopes from the operations real integrations perform, not from our resource list, and separate read from write for each area since read-only integration is the common case and should be safe to grant. Then test the design from the consent side: write the sentence a user sees for each scope and check whether it lets them make an informed decision — scopes that cannot be explained in one clear sentence are too coarse or too technical. Finish with the enforcement point, how scopes are checked consistently rather than per endpoint, and how new capabilities are added without silently widening existing tokens.',
    why:
      'The one-sentence consent test is a practical filter on granularity, and the silent-widening problem is how permission models quietly become meaningless over time.',
    watchOut:
      'Adding a capability to an existing scope grants it to every previously issued token. New capability, new scope, unless you are certain the meaning is unchanged.',
    related: ['api-authentication-choice', 'least-privilege', 'row-level-security', 'separation-of-duties'],
    tags: ['api', 'security', 'authorisation', 'permissions'],
  },

  {
    id: 'api-quota-design',
    name: 'API Quota Design',
    aka: ['usage limits', 'fair use policy', 'tiered limits'],
    origin: 'Platform API practice',
    domains: ['engineering', 'product'],
    intents: ['decide', 'plan'],
    oneLiner:
      'Quotas protect the service and shape customer behaviour, so they need a unit that reflects cost, a tier structure that matches value, and a client experience that is predictable.',
    useWhen: [
      'one integration consumes ninety percent of our capacity',
      'our limits are per request and requests vary wildly in cost',
      'customers hit limits with no warning and their integration breaks',
      'we cannot say what a fair level of usage is',
    ],
    prompt:
      'Design quotas for this API. Choose the unit first — requests, computed cost units, records processed, or data volume — based on what actually consumes our capacity, since a request-count limit on an API with hundred-fold cost variation is arbitrary. Then set the tiers and the window, preferring a rolling window over a calendar one so a customer cannot burn a month\'s quota in a minute. The client experience determines whether this works, so specify how remaining quota is communicated in every response, how a client is warned before exhaustion, what happens at the limit, and whether a brief burst above the limit is tolerated.',
    why:
      'Choosing a cost-reflective unit is what makes quotas fair, and communicating remaining quota per response is what stops integrations breaking without warning.',
    watchOut:
      'Quotas enforced without exposing current usage force customers to guess and over-provision. The visibility is part of the product, not an extra.',
    related: ['rate-limiting-algorithms', 'over-fetching-graphql', 'api-usage-analytics', 'load-shedding'],
    tags: ['api', 'quotas', 'limits', 'product'],
  },

  {
    id: 'cors-configuration',
    name: 'Cross-Origin Configuration',
    aka: ['CORS', 'preflight requests', 'origin allowlist'],
    origin: 'Browser security model; the CORS specification',
    domains: ['engineering', 'security'],
    intents: ['diagnose', 'structure'],
    oneLiner:
      'Cross-origin rules are a browser-enforced control on which sites may read your responses — misconfiguring them either blocks legitimate clients or exposes authenticated data.',
    useWhen: [
      'the browser blocks our request and the server logs show nothing',
      'someone set the allowed origin to a wildcard to make it work',
      'it works in one tool and fails in the browser',
      'we need to allow credentials cross-origin and are not sure of the risk',
    ],
    prompt:
      'Review our cross-origin configuration. Explain what the browser is actually enforcing and what it is not, so the boundary is clear: this restricts what a page can read, and offers no protection against a non-browser client. Then audit our settings for the dangerous combinations — reflecting any requesting origin, allowing credentials with a permissive origin, overly broad allowed headers and methods, and a long preflight cache that makes changes take effect slowly. For each, state the concrete attack it enables. Finish with the correct configuration per endpoint class and the mechanism keeping the allowlist current as new front ends are added.',
    why:
      'Separating what this control does from what people assume it does prevents both the over-permissive fix and the mistaken belief that it protects the API from non-browser callers.',
    watchOut:
      'This is not a substitute for authorisation, and it does not prevent cross-site request forgery on its own. Those need their own controls.',
    related: ['trust-boundary', 'api-gateway-pattern', 'attack-surface-reduction', 'api-authentication-choice'],
    tags: ['api', 'security', 'browser', 'configuration'],
  },

  {
    id: 'client-sdk-design',
    name: 'Client SDK Design',
    aka: ['official client libraries', 'generated versus hand-written SDKs'],
    origin: 'Platform API practice',
    domains: ['engineering'],
    intents: ['structure', 'decide'],
    oneLiner:
      'A client library is where retries, pagination, authentication refresh and error handling should live once, instead of being reimplemented badly by every integrator.',
    useWhen: [
      'every customer implements pagination and retries differently and wrongly',
      'integrators take days to make their first successful call',
      'our support burden is all integration mechanics',
      'we generate SDKs and they are unusable',
    ],
    prompt:
      'Design our client library strategy. Decide generated versus hand-written per language, recognising that generated clients stay current automatically and usually feel foreign in the target language, while hand-written ones feel right and fall behind — a generated core with a hand-written ergonomic layer is often the answer. Then specify what the library owns beyond call mechanics: retries with backoff on the right errors, automatic pagination, credential refresh, idempotency keys, timeouts and connection reuse. Finish with the release and versioning policy tying library versions to API versions, and the deprecation path when an endpoint retires.',
    why:
      'Putting retries, pagination and idempotency into the library is what makes integrations reliable across every consumer, and it is the part generated clients usually omit.',
    watchOut:
      'A library that lags the API becomes the reason customers cannot use new features. Under-maintained official clients are worse than none.',
    related: ['api-ergonomics', 'retry-with-backoff', 'api-pagination', 'openapi-contract-first'],
    tags: ['api', 'sdk', 'developer experience', 'libraries'],
  },

  {
    id: 'api-documentation-quality',
    name: 'API Documentation Quality',
    aka: ['reference versus guides', 'runnable examples', 'docs as product'],
    origin: 'Technical writing and developer relations practice; Diátaxis framework',
    domains: ['engineering', 'writing'],
    intents: ['communicate', 'critique'],
    oneLiner:
      'Reference material answers what exists; integrators need a guided path through the first successful call and the failure cases nobody documents.',
    useWhen: [
      'our docs list every field and nobody can get started',
      'the examples do not run',
      'support answers the same integration question weekly',
      'the authentication section assumes you already know how it works',
    ],
    prompt:
      'Assess these docs against the four distinct needs: a tutorial that gets someone to a first successful call, task-oriented guides for common integrations, complete reference, and conceptual explanation of the model. Identify which we have and which we lack — most APIs have reference and nothing else, and that is why integration is slow. Then check the content that support questions reveal as missing: error meanings and how to recover, rate limits and quota behaviour, pagination and idempotency semantics, sandbox and test data, and what changes when you go to production. Finish with how examples are kept executable so they cannot rot.',
    why:
      'Using the support question log to drive documentation gaps is what makes this concrete, and the four-mode split explains why complete reference still leaves people stuck.',
    watchOut:
      'Generated reference is complete and unhelpful on its own. The narrative material is the part that requires human effort and the part that gets skipped.',
    related: ['api-sandbox-and-fixtures', 'api-ergonomics', 'openapi-contract-first', 'progressive-disclosure'],
    tags: ['api', 'documentation', 'developer experience', 'writing'],
  },

  {
    id: 'api-sandbox-and-fixtures',
    name: 'Sandbox and Test Fixtures',
    aka: ['test mode', 'API playground', 'simulated scenarios'],
    origin: 'Platform API practice; payment providers set the standard',
    domains: ['engineering'],
    intents: ['structure', 'plan'],
    oneLiner:
      'Give integrators a safe environment plus a way to trigger every outcome deliberately — including the failures they must handle and would never see otherwise.',
    useWhen: [
      'integrators only test the happy path because errors are hard to produce',
      'customers test against production and create real records',
      'a partner went live having never handled a declined transaction',
      'our test environment does not behave like production',
    ],
    prompt:
      'Design a test environment for our API. Specify how it is separated from production — credentials, data, and whether side effects such as emails and webhooks fire — and how obvious it is which mode a caller is in, since accidental production calls are the failure to prevent. Then design deterministic scenario triggers: specific input values that reliably produce each error, each edge case, and each asynchronous outcome, so integrators can build tests around them. List those triggers as documented contract. Finish with the fidelity question: state where the sandbox intentionally differs from production so nobody is surprised at launch.',
    why:
      'Deterministic triggers for failure scenarios are what make integrators handle errors at all, and documenting where fidelity is lower prevents the launch-day surprise.',
    watchOut:
      'A sandbox that drifts from production teaches integrators the wrong behaviour. It needs to be updated in the same release as the real service.',
    related: ['api-documentation-quality', 'contract-testing', 'testing-in-production', 'error-response-design'],
    tags: ['api', 'testing', 'developer experience', 'integration'],
  },

  {
    id: 'api-usage-analytics',
    name: 'API Usage Analytics',
    aka: ['endpoint usage telemetry', 'consumer analytics', 'field-level usage'],
    origin: 'Platform operations practice',
    domains: ['engineering', 'data'],
    intents: ['diagnose', 'decide'],
    oneLiner:
      'Know who calls what, how often, and which fields they read — otherwise every change is a guess and nothing can ever be removed.',
    useWhen: [
      'we cannot remove this field because nobody knows if it is used',
      'we do not know which customers a change would break',
      'an endpoint we thought was dead turned out to be critical to one client',
      'we cannot tell whether the new version is being adopted',
    ],
    prompt:
      'Design usage telemetry for our API. Record per call the consumer identity, operation, version, response status, latency and error class, and — for flexible query interfaces — the specific fields requested, since field-level usage is what makes deprecation safe. Then define the reports that decisions need: usage by consumer for deprecation planning, adoption of new versions, error rates per consumer which often reveal an integration problem before they report it, and the endpoints with no traffic at all. Finish with the privacy constraints on what may be recorded and the retention period that supports a deprecation cycle.',
    why:
      'Field-level usage is the data that unblocks removals, and per-consumer error rates let you contact a customer before they notice their integration is broken.',
    watchOut:
      'Usage data with no identifiable consumer cannot support deprecation. If most traffic is unattributable, fix identity before building reports.',
    related: ['deprecation-policy', 'persisted-queries', 'api-quota-design', 'observability-instrumentation'],
    tags: ['api', 'analytics', 'lifecycle', 'telemetry'],
  },

  {
    id: 'idempotent-http-methods',
    name: 'Method Safety and Idempotence',
    aka: ['safe methods', 'idempotent verbs', 'GET has no side effects'],
    origin: 'HTTP specification semantics',
    domains: ['engineering'],
    intents: ['critique', 'structure'],
    oneLiner:
      'Infrastructure everywhere assumes reads are safe and certain writes are repeatable — violate that and prefetchers, retries and caches will corrupt your data.',
    useWhen: [
      'a link prefetcher deleted records by following links',
      'a crawler triggered actions by visiting URLs',
      'a retry created a duplicate because the method was not repeatable',
      'someone implemented a state change behind a read request',
    ],
    prompt:
      'Audit these endpoints against method semantics. For each, state whether it changes state and whether repeating it produces the same result, then compare against what the method used implies. Report every violation with its concrete consequence: state changes behind a read are triggered by crawlers, prefetchers, browser history and link scanners; non-repeatable operations behind a method infrastructure treats as repeatable will be duplicated by any automatic retry. Then give the fixes: the correct method, or where the operation genuinely cannot be repeatable, an idempotency key making it so. Finish with the caching implications of each correction.',
    why:
      'Naming the specific agents that will exercise a state-changing read — prefetchers, crawlers, scanners — turns an abstract specification point into a demonstrable defect.',
    watchOut:
      'A read that writes an audit record or updates a counter is technically unsafe but usually fine. Judge by whether repetition causes harm, not by strict purity.',
    related: ['idempotency-keys', 'http-status-semantics', 'retry-with-backoff', 'cdn-edge-caching'],
    tags: ['api', 'http', 'semantics', 'correctness'],
  },

  {
    id: 'api-naming-conventions',
    name: 'API Naming Conventions',
    aka: ['consistent vocabulary', 'casing conventions', 'field naming'],
    origin: 'API design practice; internal style guides at large platforms',
    domains: ['engineering', 'writing'],
    intents: ['structure', 'communicate'],
    oneLiner:
      'Consistency in names lets a developer guess correctly — inconsistency means every field must be looked up, forever.',
    useWhen: [
      'one endpoint returns userId and another returns user_id',
      'we have created_at, createdOn and dateCreated in the same API',
      'the same concept has three names across our endpoints',
      'developers constantly ask what the difference between these two fields is',
    ],
    prompt:
      'Establish naming conventions for this API and audit against them. Cover casing, singular versus plural for collections, date and time field naming with the timezone convention stated, boolean naming that avoids negatives, identifier field naming, and enumeration value formatting. Then do the more valuable part: build the vocabulary list and find every concept with more than one name across our endpoints, and every name used for more than one concept — the second category is worse because it actively misleads. Recommend the corrections, marking which are breaking changes and grouping them so they can ship with the next version rather than one at a time.',
    why:
      'The one-name-two-concepts finding is the one that causes real integration bugs, and grouping corrections into a version keeps consistency work from becoming a stream of small breaks.',
    watchOut:
      'Consistency with your existing API beats consistency with a style guide. A single correctly-named field among ninety wrong ones is a trap.',
    related: ['ubiquitous-language', 'naming-as-design', 'api-ergonomics', 'api-versioning-strategy'],
    tags: ['api', 'naming', 'consistency', 'conventions'],
  },
]
