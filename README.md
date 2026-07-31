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
2. **Watch the word arrive** — the name resolves out of a scatter of glyphs, and you get the
   concept, its provenance, a copy-ready prompt, why that specific wording steers a model, and where
   it misfires. If the match is a loose one the card tells you so.
3. **Follow the alternatives** — every entry links to its neighbours, so a near-miss is one click
   from the right answer.

Everything runs in the browser. There is no backend, no API key, and nothing you type leaves your
machine.

## The index

119 concepts across eleven domains — product, engineering, security & privacy, design, writing,
research, strategy, data, learning, people & career, and working with AI itself.

Two of those are full engineering families. **Architecture:** hexagonal, MVI, MVVM, the dependency
rule, dependency inversion, repository, bounded context, anti-corruption layer, strangler fig,
branch by abstraction, CQRS, event sourcing, saga, BFF, twelve-factor. **Security & privacy:**
least privilege, defence in depth, STRIDE threat modelling, zero trust, blast radius, fail closed,
attack surface reduction, separation of duties, break-glass access, trust boundaries, secrets
management, data minimisation, supply chain provenance.

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

### Why not a real embedding model

There is nowhere to put one. The site has no backend and no API key, and the CSP is
`connect-src 'self'`, so there is nothing to send a query to and nothing to fetch a model from. A
transformer would also be tens of megabytes to serve a corpus of 119 documents. LSA is a few hundred
lines, builds in about 40ms, and derives its notion of similarity from this vocabulary rather than
from the open web. It is measurably better than lexical search here — see below — and it is honestly
weaker than a hosted model would be on queries needing world knowledge. The 15 held-out cases it
still misses are listed by `npm run bench`.

### Measuring it

`npm run bench` scores retrieval two ways. **Tuning cases** are the 58 end-to-end cases the ranking
has been fitted to for as long as they have existed, so a good score there proves only that nothing
regressed. **Held-out cases** are 73 written afterwards from the concept list alone, describing each
idea in plain language while deliberately avoiding that concept's own vocabulary — no constant was
chosen with them in view.

| Held-out, 73 cases | BM25 only | latent only | hybrid |
| --- | --- | --- | --- |
| recall@1 | 42.5% | 58.9% | **58.9%** |
| recall@3 | 68.5% | 76.7% | **75.3%** |
| recall@5 | 76.7% | 79.5% | **79.5%** |
| MRR | 56.8% | 67.9% | **68.3%** |

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

One counterintuitive result worth keeping in mind if you touch this: the latent space must **not** be
built from the same weighted bag BM25 uses. BM25 wants `name` at weight 7; the SVD reads that as a
claim about what the corpus is about and fills its dimensions with proper nouns nobody types.
Dropping names, aliases and prompt text from the semantic corpus was worth 14 points of recall@1 on
its own.

## Development

```bash
npm install
npm run dev        # local dev server
npm test           # corpus integrity + retrieval quality
npm run bench      # relevancy report and tuning grid (prints, never fails)
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
