# ✦ Magic Words

**Describe your problem in plain language. Get the phrase that steers Claude straight at it.**
**Or install [the plugin](#the-claude-code-plugin) and stop having to.**

There is usually a named technique for whatever you are stuck on — *abstraction laddering*,
*Chesterton's fence*, *cost of delay*, *reference class forecasting* — and naming it is what gets a
model to actually do it instead of producing something generic. The catch is that you cannot search
for a term you have never heard of.

Magic Words closes that gap. You describe the symptom the way you would to a colleague — as many
symptoms as you have, in whatever order they come out — and it untangles them, finds the concept
for each, hands you the exact prompt, tells you why that phrasing works, and gives you back your
own request with the phrasing folded into it.

As a [Claude Code plugin](#the-claude-code-plugin) the same thing happens without you asking: it
reads the request you were going to send anyway and puts the right steering words in before the
work starts.

## How it works

1. **Say what is going on** — however it comes out. One problem or five, in whatever order they
   occurred to you. The facets (what you are working on, what you need to happen) are optional and
   multiply the ranking rather than filtering it.
2. **Watch it get untangled** — the input is cut into the problems it actually contains and each
   one is answered separately, with the strand that summoned each word quoted back at you.
3. **Take the composed prompt** — your own words, verbatim, with the steering phrases folded in and
   ready to paste. Each phrase is a toggle; the loose matches start switched off.
4. **Follow the alternatives** — every entry links to its neighbours, so a near-miss is one click
   from the right answer.

Everything runs in the browser. There is no backend, no API key, and nothing you type leaves your
machine.

## The Claude Code plugin

The same index and the same ranking, running where you were already typing. This repository is a
plugin marketplace, so installing it is two commands:

```
/plugin marketplace add michellemayes/magic-words
/plugin install magic-words@michellemayes
```

`/reload-plugins` picks it up in a session you already have open, and
`/plugin marketplace update michellemayes` takes new concepts as they are added. Nothing is pinned
to a version number — deliberately. What changes here is nearly always the corpus, a concept added
or a prompt sharpened, and pinning a version would mean installed users stayed behind it until
someone remembered to bump one. Omitting it makes the commit the version, so an install tracks the
lexicon.

It fires on the requests that arrive as a stream of consciousness or an under-specified ask — the
rambling context with no clear question, the "this isn't working", the symptom described instead of
the method. It reads what you said, finds the techniques that answer it, folds the phrasing into
the working brief, tells you in one line which words it applied, and gets on with the work. Naming
them is the half you keep: next time you can ask for it directly, which is the entire point of a
lexicon.

It is told, in as many words, when *not* to steer: not when your request is already specific, not
where a technique would contradict something you asked for, and not at all when the index has no
good match. A skill that finds a technique for everything, because it is a skill about techniques,
would make every request slightly worse.

The plugin is three files — `SKILL.md`, one dependency-free bundle of `src/` carrying the whole
corpus and the ranking, and a shim that puts `magic-words` on the Bash tool's path. No
dependencies, no install step, no network. That last file is why the skill never has to guess where
it was installed; it just runs the command, which also means you have it:

```bash
magic-words "the plan looks fine and nobody is objecting"
magic-words --show pre-mortem
magic-words --list security
```

`--json` gives the same fields the site renders. The bundle is generated (`npm run build:skill`)
and checked in, which is normally a smell — installing a plugin copies a directory and runs
nothing, so the alternative is a second implementation of the ranking that would drift from the
measured one. CI rebuilds it, fails on any difference, and runs it through the shim.

The skill directory also stands on its own, for anyone who would rather not use the plugin system:

```bash
git clone https://github.com/michellemayes/magic-words
cp -r magic-words/plugins/magic-words/skills/magic-words ~/.claude/skills/
```

You lose the update path and the `magic-words` command; the skill falls back to invoking the script
by its own path.

### The marketplace

```
.claude-plugin/marketplace.json     the catalogue — name, owner, one plugin
plugins/magic-words/
  .claude-plugin/plugin.json        the plugin's own manifest
  bin/magic-words                   shim, on PATH while the plugin is enabled
  skills/magic-words/SKILL.md       when to fire, what to inject, when not to
  skills/magic-words/magic-words.mjs   generated bundle of src/
```

`.claude/skills/magic-words` is a symlink into the plugin, so this repository uses the same skill it
publishes and there is no second copy of a megabyte-plus bundle to keep in step. `npm test` checks
that the symlink resolves, that the manifests agree about the plugin's name, that the source path
exists, and that both scripts are executable — none of which any other test here would notice, and
all of which are invisible until somebody runs `/plugin install` and nothing happens.

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

Hybrid retrieval, entirely in the browser. No API calls, no model download, nothing leaves the page.

- **BM25** over weighted fields, for precision. Someone who types a concept's name gets that
  concept.
- **Latent semantic embeddings**, for everything else. The term-document matrix is decomposed by
  truncated SVD at load, so documents and queries become vectors in 96 dimensions where words that
  keep company across the corpus point the same way. This is what finds the concept when you share
  no vocabulary with it at all.
- **Query expansion.** A colloquial-to-corpus vocabulary map (`stuck` → `blocked, impasse`;
  `outage` → `incident, postmortem`) scored below literal matches, plus British/American spelling
  normalisation so `prioritise` and `prioritize` are the same token.
- **Neighbour diffusion.** A fraction of each concept's score flows to the concepts its author
  linked as `related`. Those links are the best signal in the corpus and used to feed only the
  "if that is not quite it" chips.
- **Facet boosting and diversity.** Form answers multiply rather than filter, so a strong text match
  is never hard-excluded by the wrong domain. A light MMR pass keeps the top results from being five
  members of the same family.

### One query is rarely one question

`search()` answers a single question well. What people type is a paragraph that starts with an
outage, mentions in passing that the write-up turned into a blame session, and ends needing an
exec summary. Handed to the ranker whole, that returns the concept that best matches the *average*
of three problems, which is usually none of them.

So `triage()` cuts the input into threads first, searches each on its own, and merges. Splitting is
on strong boundaries only — punctuation, line breaks, spaced dashes, and the spoken connectives
people change subject with ("and then", "oh and", "also", "plus"). Bare "and" and "but" join
clauses inside one problem far more often than they separate problems, so they are a fallback used
only on a strand too long to be a single thought. Fragments too thin to search are folded into
their neighbour, and stranded connectives are stripped rather than glued onto the end of the
previous thread.

| 10 rambles, 20 problems in them | covered |
| --- | --- |
| one query, top 1 | 40.0% |
| one query, top 3 | 75.0% |
| triaged, top 3 | **85.0%** |

Both of those fell when the corpus went from 119 concepts to 619 — the ramble set was written
against the smaller index and every query now competes with five times as many documents, exactly
as the held-out numbers above did. The gap between them widened, which is the part this section is
about: splitting is worth more, not less, as the index grows.

Two constants in there earned their comments by losing. The whole-input reading competes with the
per-thread readings **at par**: a correction for thread length looks obviously necessary — a short
query scores higher against a perfect lexical match than a long one does — and upweighting the
whole-input reading loses coverage at every value from 1.35 up. Discounting it to 0.8 currently
covers one problem more than parity does, which is one case in twenty and not enough to move a
constant on; at 119 concepts 0.8, 1 and 1.15 were tied. What matters, and does not move, is that
the whole-input reading is in the pool at all: dropping it costs 10 points, because a paragraph
often states its real problem across a boundary rather than inside one clause.

And confidence is `looseMatch` and nothing else. `npm run bench` sweeps the obvious alternative, a
threshold on the merged score, over all 131 single-problem cases. `looseMatch` sits at the coverage
end of that trade: 94.7% of picks called confident, 70.2% of those right against a 66.4% baseline,
and the 5.3% it holds back right **none** of the time. A cutoff of 2.0 sits at the other end: 84.8%
right, silent about 30% of picks.

At 119 concepts those two were nearly the same signal, and a cutoff high enough to matter had
already excluded every loose pick. At 619 they have separated, and the cutoff now buys real
precision for real coverage. It is still not the trade to take: a pick is always shown by name next
to the user's own words and is trivially ignored, while a pick withheld is the product not
happening — and `looseMatch` still identifies a bucket that is wrong every single time, which is
the thing worth being sure about.

### Why not a real embedding model

There is nowhere to put one. The site has no backend and no API key, and the CSP is
`connect-src 'self'`, so there is nothing to send a query to and nothing to fetch a model from. A
transformer would also be tens of megabytes to serve a corpus of 619 documents. LSA is a few hundred
lines, builds in about 600ms, and derives its notion of similarity from this vocabulary rather than
from the open web. It is measurably better than lexical search here — see below — and it is honestly
weaker than a hosted model would be on queries needing world knowledge. The 24 held-out cases it
still misses are listed by `npm run bench`.

### Measuring it

`npm run bench` scores retrieval two ways. **Tuning cases** are the 58 end-to-end cases the ranking
has been fitted to for as long as they have existed, so a good score there proves only that nothing
regressed. **Held-out cases** are 73 written afterwards from the concept list alone, describing each
idea in plain language while deliberately avoiding that concept's own vocabulary — no constant was
chosen with them in view.

| Held-out, 73 cases | BM25 only | latent only | hybrid | + related |
| --- | --- | --- | --- | --- |
| recall@1 | 38.4% | 46.6% | **47.9%** | 45.2% |
| recall@3 | 56.2% | 58.9% | 60.3% | **63.0%** |
| recall@5 | 65.8% | 65.8% | **67.1%** | **67.1%** |
| MRR | 49.5% | 55.0% | **55.9%** | 55.5% |

These are lower than they were when the corpus held 119 concepts, where hybrid reached 58.9% recall@1
and 68.3% MRR. That is the honest cost of a fivefold larger index: the held-out queries were written
against the original concepts and now compete against 500 more documents, many of which discuss the
same everyday words. The ordering of the columns is unchanged — hybrid still beats either half — and
the tuning set, which covers the whole corpus, sits at 93.1% recall@1 and 96.0% MRR.

Against the ranking as it stood before any of this, held-out recall@1 was 32.9% and MRR 51.1%, and
tuning-set recall@1 was 82.8%. Most of that gap was not the missing embeddings. It was two silent
bugs, both of the kind that look like working code:

- **Aliases that pinned on a stopword.** Several `aka` entries are conversational — `what are we not
  doing`, `what happened when`, `what else could it be`. Stopword stripping reduces those to
  `[not]`, `[happen]` and `[els]`, and any query containing that one word was treated as having
  named the concept outright. Opportunity Cost Framing was the top result for a third of the
  held-out queries because they contained "not". Fixed by scaling the name bonus by how much of the
  query the name accounts for: someone naming a concept types little else.
- **Expansion keys that could never fire.** The table was keyed by hand-written stems, and fourteen
  of them were wrong — `estim` never matched because "estimate" stems to `estimat`. The keys are now
  ordinary words, stemmed by the same function as the corpus, which makes the whole class of failure
  impossible rather than merely tested for.

Three further things measured worse and were dropped rather than kept on the strength of the idea:
splitting concepts into passages before the SVD, a much larger stopword list, and a flourish that
announced "you did not use any of these words — we knew what you meant" whenever the latent space
carried a result on its own. That last one was the nicest thing here and the numbers ended it:
results flagged that way are correct 17% of the time against a 76% baseline, and no threshold got it
past 50%. The signal was real, it just meant doubt rather than insight, so the card now says the
match is a loose one and points at the alternatives. `npm run bench` prints the tuning grid every
constant came from.

Scaling note: the decomposition used to take the whole spectrum by cyclic Jacobi, which is exact and
cubic per sweep. That was a few milliseconds at 119 documents and nine seconds at 619 — for a result
where all but the leading 96 dimensions are thrown away. Above a couple of hundred documents it now
takes only the leading dimensions, by subspace iteration against a fixed pseudo-random block, which
brings the build back to roughly 600ms and stays bit-identical between loads because the block is
seeded rather than random. Smaller corpora keep the exact path.

One counterintuitive result worth keeping in mind if you touch this: the latent space must **not** be
built from the same weighted bag BM25 uses. BM25 wants `name` at weight 7; the SVD reads that as a
claim about what the corpus is about and fills its dimensions with proper nouns nobody types.
Dropping names, aliases and prompt text from the semantic corpus was worth 14 points of recall@1 on
its own.

## Development

```bash
npm install
npm run dev          # local dev server
npm test             # corpus integrity + retrieval quality + triage
npm run bench        # relevancy and triage reports, and the tuning grids every
                     # constant came from (prints, never fails)
npm run typecheck
npm run build        # static output in dist/
npm run build:skill  # regenerate the plugin's bundle of src/
npm run skill -- "the plan looks fine and nobody is objecting"
```

### Deployment

Deployed on Vercel as a static build. `vercel.json` pins the framework, build command and output
directory, adds a catch-all rewrite to `index.html`, sets long-lived immutable caching on the
content-hashed assets, and applies a CSP plus the usual hardening headers. Routing is hash-based
(`#/search?q=…`, `#/c/pre-mortem`), so deep links work without any server-side routing.

CI (`.github/workflows/ci.yml`) runs typecheck, tests and build on every branch, independently of
the deploy. It also rebuilds the plugin's bundle and fails if the committed copy differs, then
runs it through the shim — a bundle can be current and still not start.

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
