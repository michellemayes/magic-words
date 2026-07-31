# ✦ Magic Words

**Describe your problem in plain language. Get the phrase that steers Claude straight at it.**
**Or install [the skill](#the-claude-code-skill) and stop having to.**

There is usually a named technique for whatever you are stuck on — *abstraction laddering*,
*Chesterton's fence*, *cost of delay*, *reference class forecasting* — and naming it is what gets a
model to actually do it instead of producing something generic. The catch is that you cannot search
for a term you have never heard of.

Magic Words closes that gap. You describe the symptom the way you would to a colleague — as many
symptoms as you have, in whatever order they come out — and it untangles them, finds the concept
for each, hands you the exact prompt, tells you why that phrasing works, and gives you back your
own request with the phrasing folded into it.

As a [Claude Code skill](#the-claude-code-skill) the same thing happens without you asking: it
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

## The Claude Code skill

The same index and the same ranking, as a skill that runs where you were already typing.

```bash
git clone https://github.com/michellemayes/magic-words
cp -r magic-words/.claude/skills/magic-words ~/.claude/skills/
```

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

The directory is two files — `SKILL.md` and one dependency-free bundle of `src/` carrying all 119
concepts and the ranking. No install step, no network. It doubles as a command line:

```bash
node ~/.claude/skills/magic-words/magic-words.mjs "the plan looks fine and nobody is objecting"
node ~/.claude/skills/magic-words/magic-words.mjs --show pre-mortem
node ~/.claude/skills/magic-words/magic-words.mjs --list security
```

`--json` gives the same fields the site renders. The bundle is generated (`npm run build:skill`)
and checked in, which is normally a smell — the alternative is a second implementation of the
ranking that would drift from the measured one. CI rebuilds it, fails on any difference, and runs
it.

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
| one query, top 1 | 50.0% |
| one query, top 3 | 90.0% |
| triaged, top 3 | **95.0%** |

Two constants in there earned their comments by losing. The whole-input reading competes with the
per-thread readings **at par**: a correction for thread length looks obviously necessary — a short
query scores higher against a perfect lexical match than a long one does — and costs coverage at
every value above 1.15. What matters is only that the whole-input reading is in the pool at all;
dropping it costs 15 points, because a paragraph often states its real problem across a boundary
rather than inside one clause.

And confidence is `looseMatch` and nothing else. A score threshold, swept over all 131
single-problem cases, turns out to be the same signal approached from the other end: by the time a
cutoff separates anything it has already excluded every loose pick, and adding the lexical test on
top changes nothing. What is left is one coverage-for-precision dial. `looseMatch` sits at the
coverage end — 95.4% of picks called confident and 79.2% of those right against a 76.3% baseline,
while the 4.6% it holds back are right 16.7% of the time. A cutoff of 2.0 sits at the other end:
89.4% right, silent about 28% of picks. Coverage wins here because a pick is always shown by name
next to the user's own words and is trivially ignored, while a pick withheld is the product not
happening.

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
npm run dev          # local dev server
npm test             # corpus integrity + retrieval quality + triage
npm run bench        # relevancy and triage reports, and the tuning grids every
                     # constant came from (prints, never fails)
npm run typecheck
npm run build        # static output in dist/
npm run build:skill  # regenerate .claude/skills/magic-words/magic-words.mjs
npm run skill -- "the plan looks fine and nobody is objecting"
```

### Deployment

Deployed on Vercel as a static build. `vercel.json` pins the framework, build command and output
directory, adds a catch-all rewrite to `index.html`, sets long-lived immutable caching on the
content-hashed assets, and applies a CSP plus the usual hardening headers. Routing is hash-based
(`#/search?q=…`, `#/c/pre-mortem`), so deep links work without any server-side routing.

CI (`.github/workflows/ci.yml`) runs typecheck, tests and build on every branch, independently of
the deploy. It also rebuilds the skill bundle and fails if the committed copy differs, then runs
that copy — a bundle can be current and still not start.

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
