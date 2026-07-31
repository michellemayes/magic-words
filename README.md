# ✦ Magic Words

**Describe your problem in plain language. Get the phrase that steers Claude straight at it.**

There's usually a name for whatever you're stuck on — *abstraction laddering*, *Chesterton's fence*,
*cost of delay*, *reference class forecasting* — and naming it is what gets a model to actually do it
instead of producing something generic. The catch: you can't search for a term you've never heard.

Magic Words closes that gap. Describe the symptom the way you'd describe it to a colleague, as
messily as you like, and it untangles the problems in there, finds the concept for each one, and
hands you back your own request with the right phrasing folded in.

Everything runs in the browser. No backend, no API key, nothing you type leaves your machine.

**[Try it](https://magic-words-xi.vercel.app)** · or [install the plugin](#the-claude-code-plugin)
and skip the asking.

## How it works

1. **Say what's going on**, however it comes out. One problem or five, in any order.
2. **Watch it get untangled.** Your input is split into the problems it actually contains, and each
   is answered separately, with the phrase that summoned each word quoted back at you.
3. **Take the composed prompt** — your own words, verbatim, with the steering phrases folded in.
   Each phrase is a toggle; loose matches start switched off.
4. **Follow the alternatives.** Every entry links to its neighbours, so a near-miss is one click
   from the right answer.

## The Claude Code plugin

Same index, same ranking, running where you were already typing. This repo is a plugin marketplace,
so installing is two commands:

```
/plugin marketplace add michellemayes/magic-words
/plugin install magic-words@michellemayes
```

`/reload-plugins` picks it up in an open session, and `/plugin marketplace update michellemayes`
pulls new concepts. Nothing is pinned to a version, deliberately — what changes here is almost
always the corpus, and pinning would leave installs behind until someone bumped a number.

The skill fires on requests that arrive as a stream of consciousness or an under-specified ask: the
rambling context with no clear question, the "this isn't working", the symptom described instead of
the method. It finds the techniques that answer it, folds the phrasing into the brief, tells you in
one line which words it used, and gets on with the work. Naming them is the half you keep — next
time you can just ask for it.

It's also told when *not* to steer: not when your request is already specific, not where a technique
would contradict what you asked for, and not at all when nothing matches well. A skill that finds a
technique for everything would make every request slightly worse.

The plugin puts `magic-words` on your PATH, so you can use it directly:

```bash
magic-words "the plan looks fine and nobody is objecting"
magic-words --show pre-mortem
magic-words --list security
magic-words --json "..."     # same fields the site renders
```

Prefer not to use the plugin system? The skill directory stands alone:

```bash
git clone https://github.com/michellemayes/magic-words
cp -r magic-words/plugins/magic-words/skills/magic-words ~/.claude/skills/
```

You lose the update path and the `magic-words` command, but the skill still works.

<details>
<summary>How the marketplace is laid out</summary>

```
.claude-plugin/marketplace.json        the catalogue
plugins/magic-words/
  .claude-plugin/plugin.json           the plugin manifest
  bin/magic-words                      shim, on PATH while the plugin is enabled
  skills/magic-words/SKILL.md          when to fire, what to inject, when not to
  skills/magic-words/magic-words.mjs   generated bundle of src/
```

`.claude/skills/magic-words` is a symlink into the plugin, so this repo uses the skill it publishes
rather than keeping a second copy of a megabyte-plus bundle in step. The bundle is generated
(`npm run build:skill`) and checked in, because installing a plugin copies a directory and runs
nothing. CI rebuilds it, fails on any difference, and runs it through the shim.

`npm test` checks that the symlink resolves, the manifests agree on the plugin name, and both
scripts are executable — all invisible until someone runs `/plugin install` and nothing happens.
</details>

## The index

619 concepts across eleven domains: product, engineering, security & privacy, design, writing,
research, strategy, data, learning, people & career, and working with AI.

Engineering is the deepest at roughly 500 entries, organised into sixteen families — architecture,
patterns & principles, testing, distributed systems, reliability & observability, performance, data
& storage, APIs, concurrency, delivery, code craft, frontend, team practice, platform & cloud,
security & privacy, and ML systems.

Each entry carries:

| Field | What it is |
| --- | --- |
| `name` / `aka` | The magic word, plus the other names people search for |
| `origin` | Where it comes from, so you can go read the source |
| `useWhen` | Symptom phrases written the way you'd describe the problem *before* you knew the term — the primary search surface |
| `prompt` | The phrase to hand Claude |
| `variants` | Alternative phrasings for adjacent situations |
| `why` | Why this steers a model well, not just why the framework is good |
| `watchOut` | Where it misfires |
| `related` | Neighbouring concepts |

## Search

Hybrid retrieval, entirely in the browser.

- **BM25** over weighted fields, for precision. Type a concept's name, get that concept.
- **Latent semantic embeddings**, for everything else. The term-document matrix is decomposed by
  truncated SVD at load, putting documents and queries in a 96-dimensional space where words that
  keep company point the same way. This is what finds the concept when you share no vocabulary with
  it at all.
- **Query expansion.** A colloquial-to-corpus map (`stuck` → `blocked, impasse`; `outage` →
  `incident, postmortem`), scored below literal matches, plus British/American spelling
  normalisation.
- **Neighbour diffusion.** Some of each concept's score flows to the concepts its author linked as
  `related`, which feeds the "if that's not quite it" chips.
- **Facet boosting and diversity.** Facets multiply rather than filter, so a strong text match is
  never hard-excluded by the wrong domain. A light MMR pass stops the top results being five members
  of one family.

### One query is rarely one question

What people type is a paragraph that starts with an outage, mentions the write-up turning into a
blame session, and ends needing an exec summary. Handed to the ranker whole, that returns whatever
best matches the *average* of three problems, which is usually none of them.

So `triage()` cuts the input into threads first, searches each, and merges. It splits on strong
boundaries only — punctuation, line breaks, spaced dashes, and the connectives people change subject
with ("and then", "oh and", "also", "plus"). Bare "and" and "but" join clauses far more often than
they separate problems, so they're a fallback for strands too long to be one thought.

| 10 rambles, 20 problems in them | covered |
| --- | --- |
| one query, top 1 | 40.0% |
| one query, top 3 | 75.0% |
| triaged, top 3 | **85.0%** |

The gap widened when the corpus grew from 119 concepts to 619, which is the point: splitting is
worth more as the index grows, not less.

### Does it actually work

`npm run bench` scores retrieval two ways. **Tuning cases** are the 58 end-to-end cases the ranking
has been fitted to, so a good score there only proves nothing regressed. **Held-out cases** are 73
written afterwards from the concept list alone, describing each idea in plain language while
avoiding its own vocabulary. No constant was chosen with them in view.

| Held-out, 73 cases | BM25 only | latent only | hybrid | + related |
| --- | --- | --- | --- | --- |
| recall@1 | 38.4% | 46.6% | **47.9%** | 45.2% |
| recall@3 | 56.2% | 58.9% | 60.3% | **63.0%** |
| recall@5 | 65.8% | 65.8% | **67.1%** | **67.1%** |
| MRR | 49.5% | 55.0% | **55.9%** | 55.5% |

These are lower than at 119 concepts, where hybrid hit 58.9% recall@1. That's the honest cost of a
fivefold larger index: the held-out queries were written against the original concepts and now
compete with 500 more documents. The column ordering is unchanged — hybrid still beats either half —
and the tuning set, which covers the whole corpus, sits at 93.1% recall@1 and 96.0% MRR.

A few things worth knowing if you touch the ranking:

- **The latent space must not be built from the weighted bag BM25 uses.** BM25 wants `name` at
  weight 7; the SVD reads that as a claim about what the corpus is about and fills its dimensions
  with proper nouns nobody types. Dropping names, aliases and prompt text from the semantic corpus
  was worth 14 points of recall@1 on its own.
- **Confidence is `looseMatch` and nothing else.** The obvious alternative, a threshold on the
  merged score, buys precision (84.8% right) by going silent on 30% of picks. Not the trade to take:
  a pick shown by name next to your own words is trivially ignored, but a pick withheld is the
  product not happening.
- **No real embedding model, on purpose.** There's nowhere to put one — no backend, no API key, and
  the CSP is `connect-src 'self'`. A transformer would also be tens of megabytes to serve 619
  documents. LSA is a few hundred lines, builds in ~600ms, and is measurably better than lexical
  search here. It's honestly weaker on queries needing world knowledge; `npm run bench` lists the 24
  held-out cases it still misses.

`npm run bench` also prints the tuning grid every constant came from.

## Development

```bash
npm install
npm run dev          # local dev server
npm test             # corpus integrity + retrieval quality + triage
npm run bench        # relevancy and triage reports (prints, never fails)
npm run typecheck
npm run build        # static output in dist/
npm run build:skill  # regenerate the plugin's bundle of src/
npm run skill -- "the plan looks fine and nobody is objecting"
```

Deployed on Vercel as a static build. `vercel.json` pins the framework, build command and output
directory, adds a catch-all rewrite to `index.html`, sets immutable caching on hashed assets, and
applies a CSP plus the usual hardening headers. Routing is hash-based (`#/search?q=…`,
`#/c/pre-mortem`), so deep links work without server-side routing. CI runs typecheck, tests and
build on every branch, independently of the deploy.

### Adding a concept

Drop it into the right file under `src/data/concepts/` and it's indexed automatically. `npm test`
will tell you what you missed — the corpus tests check id uniqueness, that `related` ids resolve,
prompt length, symptom count, and domain/intent coverage.

The bar is the `prompt` field. It should contain at least one instruction a reasonable person
wouldn't have thought to include, and `why` should explain what that instruction does. If the prompt
is just the concept's name plus "please do this", it isn't earning its place.

## Licence

MIT.
