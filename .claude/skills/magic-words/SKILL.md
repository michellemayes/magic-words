---
name: magic-words
description: Finds the named technique that steers Claude at the user's real problem and folds its phrasing into the request before the work starts. Use when a request arrives as a stream of consciousness or an under-specified ask — rambling context with no clear question, "this isn't working", "make it better", "I'm stuck", "what should I do about X" — or when the user describes a symptom rather than a method (answers that come out generic, a plan nobody is objecting to, the same incident twice, permissions scoped by "just give it admin", a doc that buries the point). Also use when asked directly for the magic words, the right term, or the standard framework for a situation.
---

# Magic Words

There is usually a named technique for whatever someone is stuck on — *least
privilege*, *pre-mortem*, *Chesterton's fence*, *cost of delay* — and naming it
is what makes a model actually do it instead of producing something generic.
The catch is that you cannot ask for a term you have never heard of. So people
describe the symptom and get an answer aimed at the symptom.

This skill closes that gap. It reads what the user actually said, finds the
techniques that answer it, and puts the phrasing into the working brief before
any work happens.

## Run it

The CLI is `magic-words.mjs`, in this directory. No install, no network, no
dependencies — it is one file with the whole index in it.

Pass the user's words through stdin, verbatim, including the mess:

```bash
node .claude/skills/magic-words/magic-words.mjs <<'RAMBLE'
<the user's message, exactly as they wrote it>
RAMBLE
```

A heredoc rather than an argument, because real requests contain quotes,
apostrophes and newlines. If the skill is installed globally the path is
`~/.claude/skills/magic-words/magic-words.mjs`.

Useful flags: `--limit <n>` (default 3), `--json`, `--show <id>` for one
concept in full, `--list [filter]` to see everything in the index.

## What comes back, and what to do with it

Each result carries the strand of the user's own words that summoned it, the
exact phrase to apply, why that phrasing works, and where it misfires. At the
end is the user's request with the confident phrases folded in.

1. **Read the picks and throw some away.** The tool ranks; you judge. Drop
   anything that answers a problem the user does not have, and anything marked
   `[thin evidence]` unless it is obviously right — that flag means the match is
   resting on meaning alone, and those are wrong far more often than they look.
2. **Keep at most two or three.** Every injected phrase competes with the
   user's own instructions for your attention. Two named techniques is what a
   knowledgeable colleague would say; six is what a search engine would say.
3. **Use the composed brief as the actual instructions** for the work, then do
   the work. This is the point of the skill. Finding the phrase and not
   applying it is the same as not running the skill.
4. **Say which ones you applied, in one line, before the work.** For example:
   *"Treating this as a pre-mortem and a blast-radius question — the phrasing
   that gets those is [name] and [name]."* Naming them is half of why they work
   on a model, and it is the half the user gets to keep: next time they can ask
   for it directly. A skill that silently reshapes someone's request and never
   says so is doing something they did not ask for.

## When not to inject

- **The request is already specific.** Someone who says "add a retry with
  exponential backoff to this fetch, max three attempts" has named what they
  want. Steering phrases add noise. Run the work, not the skill.
- **A pick contradicts an explicit instruction.** The user's words win, always,
  including when they are wrong. Say what you would have suggested and why, in
  one sentence, then do what they asked.
- **Nothing matched.** The tool says so plainly when the index has nothing.
  Proceed with the work as asked and do not go looking for a technique to
  justify having run this.
- **You would be inventing the phrasing.** Only the prompts the tool returns are
  measured; a technique you remember the name of but not the wording of is a
  worse steer than no technique at all. Use `--list` and `--show` to check.

## Two shapes of request

**A ramble** — several problems in one message, no question mark in sight. The
tool cuts it into the problems it contains and answers each one, so the reply
should too. Deal with them in the order the user raised them, not in the order
the tool ranked them.

**A direct question** — "what's the term for when you delete code that looks
useless", "what are the magic words for making it stop being so generic". Then
this is a lookup rather than a steer: give the name, the origin, the phrase to
use, and one line on where it misfires. `--show <id>` prints all of that.

## Where this comes from

The index and the ranking are the same ones behind
[magic-words](https://github.com/michellemayes/magic-words) —
BM25 plus a latent semantic space over the corpus, both built locally. The
`[thin evidence]` flag is calibrated against 131 held-out cases: picks without
it are right 79% of the time, picks with it 17%. `npm run bench` in that
repository prints the numbers, and `--json` gives you the same fields the site
shows.
