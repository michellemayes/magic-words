# ✦ Magic Words

**Describe your problem in plain language. Get the phrase that steers Claude straight at it.**

There is usually a named technique for whatever you are stuck on — *abstraction laddering*,
*Chesterton's fence*, *cost of delay*, *reference class forecasting* — and naming it is what gets a
model to actually do it instead of producing something generic. The catch is that you cannot search
for a term you have never heard of.

Magic Words closes that gap. You describe the symptom the way you would to a colleague; it finds
the concept, hands you the exact prompt, tells you why that phrasing works, and offers the
alternatives worth trying instead.

## How it works

1. **Answer three questions** — what you are working on, what you need to happen, and the problem
   in your own words. All three are optional; the free-text box does most of the work.
2. **Get the closest match** — the concept, its provenance, a copy-ready prompt, why that specific
   wording steers a model, and where it misfires.
3. **Follow the alternatives** — every entry links to its neighbours, so a near-miss is one click
   from the right answer.

Everything runs in the browser. There is no backend, no API key, and nothing you type leaves your
machine.

## The index

619 concepts across eleven domains — product, engineering, security & privacy, design, writing,
research, strategy, data, learning, people & career, and working with AI itself.

Engineering is by far the deepest, at roughly 500 entries organised into sixteen families:

| Family | What is in it |
| --- | --- |
| Architecture | Hexagonal, MVI, MVVM, the dependency rule, repository, bounded context, anti-corruption layer, strangler fig, CQRS, event sourcing, saga, BFF, twelve-factor |
| Patterns & principles | The Gang of Four patterns worth naming, SOLID read properly, connascence, value objects, aggregates, parse-don't-validate, functional core, YAGNI, rule of three |
| Testing | Test pyramid and trophy, property-based, metamorphic and mutation testing, contract tests, test doubles, flake quarantine, characterisation tests, coverage criteria, fuzzing |
| Distributed systems | CAP and PACELC, eventual consistency, idempotency keys, outbox, sagas, circuit breakers, bulkheads, backpressure, quorums, split brain, fencing tokens, CRDTs, cells |
| Reliability & observability | SLOs, error budgets, burn-rate alerting, golden signals, RED and USE, wide events, tracing, cardinality, alert fatigue, incident command, chaos engineering, game days |
| Performance | Profiling and flame graphs, percentiles and tail latency, Amdahl and the USL, queueing theory, caching patterns, N+1, allocation and GC, batching, streaming |
| Data & storage | Schema evolution, expand-and-contract, backfills, indexes and query plans, isolation levels, partitioning, CDC, stream windowing, data contracts, retention and erasure |
| APIs | Contract-first, resource modelling, status semantics, versioning and deprecation, pagination, bulk and async operations, webhooks, GraphQL cost control, quotas, SDKs |
| Concurrency | Races versus data races, memory visibility, lock contention, false sharing, actors and channels, structured concurrency, cancellation, async pitfalls, lightweight threads |
| Delivery | Trunk-based development, CI signal hygiene, build caching, reproducible builds, artefact promotion, canary and blue-green, feature flags, rollback plans, DORA metrics |
| Code craft | Naming as design, code smells, refactoring catalogue, guard clauses, assertions, error handling, review focus and size, commit hygiene, ADRs, static analysis adoption |
| Frontend | Core Web Vitals, rendering strategy and hydration, bundle splitting, loading states, optimistic UI, offline sync, accessibility, i18n and time zones, CSP and XSS |
| Team practice | Pairing and mobbing, bus factor, WIP limits, estimation with ranges, story slicing, Conway's law, team topologies, RFCs, build versus buy, migration planning |
| Platform & cloud | Platform as product, golden paths, guardrails, containers and scheduling, autoscaling, cost attribution, quotas, IAM design, certificates, DNS, patching |
| Security & privacy | Least privilege, defence in depth, STRIDE, zero trust, blast radius, fail closed, trust boundaries, secrets, data minimisation, supply chain provenance |
| ML systems | Training-serving skew, leakage, feature stores, drift, feedback loops, fairness auditing, model rollout, LLM evaluation harnesses, retrieval grounding, guardrails |

Each entry carries:

| Field | What it is |
| --- | --- |
| `name` / `aka` | The magic word, plus the other names people search for |
| `origin` | Where it comes from, so you can go read the source |
| `useWhen` | Symptom phrases written the way you'd describe the problem *before* you knew the term — this is the primary search surface |
| `prompt` | The phrase to hand Claude |
| `variants` | Alternative phrasings for adjacent situations |
| `why` | Why this steers a model well, not just why the framework is good |
| `watchOut` | Where it misfires |
| `related` | Neighbouring concepts |

## Search

No embeddings, no API calls — a BM25 index over weighted fields, built at load time against ~620
documents. The retrieval quality comes from three places:

- **Symptom-first corpus.** `useWhen` is weighted heavily and written in pre-expert vocabulary. A
  corpus test enforces that a concept's symptoms never contain its own name.
- **Query expansion.** A colloquial-to-corpus vocabulary map (`stuck` → `blocked, impasse`;
  `outage` → `incident, postmortem`) scored below literal matches, plus British/American spelling
  normalisation so `prioritise` and `prioritize` are the same token.
- **Facet boosting and diversity.** Form answers multiply rather than filter, so a strong text match
  is never hard-excluded by the wrong domain. A light MMR pass keeps the top results from being five
  members of the same family.

Retrieval is covered by 90 end-to-end cases asserting that a plain-language problem description
surfaces the right concept — those tests are the specification for whether search works. A separate
test guards a subtle failure: expansion keys are matched *after* stemming, so a key that is not
itself a stem (`late` when queries produce `lat`) is silently dead — it costs nothing and does
nothing, which is why it survives review.

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # corpus integrity + retrieval quality
npm run typecheck
npm run build      # static output in dist/
```

### Deployment

Deployed on Vercel as a static build. `vercel.json` pins the framework, build command and output
directory, adds a catch-all rewrite to `index.html`, sets long-lived immutable caching on the
content-hashed assets, and applies a CSP plus the usual hardening headers. Routing is hash-based
(`#/search?q=…`, `#/c/pre-mortem`), so deep links work without any server-side routing.

CI (`.github/workflows/ci.yml`) runs typecheck, tests and build on every branch, independently of
the deploy.

### Adding a concept

Drop it into the right file under `src/data/concepts/` and it is indexed automatically. `npm test`
will tell you if you have missed anything — the corpus tests check id uniqueness, that `related`
ids resolve, prompt length, symptom count, and domain/intent coverage.

The bar for a good entry is the `prompt` field. It should contain at least one instruction that a
reasonable person would not have thought to include, and the `why` should explain what that
instruction is doing. If the prompt is just the concept's name plus "please do this", it is not
earning its place.

## Licence

MIT.
