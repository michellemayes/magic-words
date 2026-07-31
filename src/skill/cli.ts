/**
 * The command line behind the Claude Code skill.
 *
 * Bundled to `.claude/skills/magic-words/magic-words.mjs` by `npm run
 * build:skill` — one file, no dependencies, no network, so the skill is a
 * directory anyone can copy into `~/.claude/skills/` and forget about.
 *
 * The output is written to be *read by a model* rather than by a person, which
 * mostly means being explicit where a human interface would be tasteful. Every
 * pick states the strand of input it came from, whether the evidence is strong
 * or thin, and where the technique misfires — because the caller's job is to
 * decide which of these to apply, and a list of confident-looking names with no
 * provenance would be decided by whichever sounded best.
 */

import { CONCEPTS, getConcept } from '../data/concepts'
import { DOMAIN_LABELS } from '../data/types'
import { composePrompt } from '../lib/compose'
import { triage, type Pick } from '../lib/triage'
import { allConcepts } from '../lib/search'

const USAGE = `magic-words — find the phrase that steers Claude at your actual problem

  magic-words "<what you are trying to do, however it comes out>"
  … | magic-words                     read the text from stdin instead

Options
  --limit <n>     how many magic words to return (default 3)
  --json          structured output
  --show <id>     print one concept in full
  --list [text]   every concept in the index, optionally filtered
  --help

Nothing is sent anywhere. The whole index and its ranking are in this file.`

interface Args {
  text: string
  limit: number
  json: boolean
  show?: string
  list?: string
  help: boolean
}

function parseArgs(argv: string[]): Args {
  const args: Args = { text: '', limit: 3, json: false, help: false }
  const rest: string[] = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') args.help = true
    else if (arg === '--json') args.json = true
    else if (arg === '--limit') args.limit = Math.max(1, Number(argv[++i]) || 3)
    else if (arg === '--show') args.show = argv[++i]
    else if (arg === '--list') {
      // Everything after --list is the filter, so it need not be quoted.
      args.list = argv.slice(i + 1).filter((a) => !a.startsWith('--')).join(' ')
      i = argv.length
    } else if (!arg.startsWith('--')) rest.push(arg)
  }

  args.text = rest.join(' ')
  return args
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return ''
  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk))
  return Buffer.concat(chunks).toString('utf8')
}

function wrap(text: string, width: number, indent: string): string {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    if (line && line.length + word.length + 1 > width) {
      lines.push(line)
      line = word
    } else {
      line = line ? `${line} ${word}` : word
    }
  }
  if (line) lines.push(line)
  return lines.map((l) => indent + l).join('\n')
}

const WIDTH = 88

function renderPick(pick: Pick, index: number): string {
  const c = pick.concept
  const out: string[] = []
  const flag = pick.confidence === 'strong' ? '' : '  [thin evidence — offer it, do not assume it]'
  out.push(`${index}. ${c.name}${flag}`)
  if (pick.fromWholeInput) out.push(`   from: the request as a whole`)
  else out.push(wrap(`from: "${pick.because}"`, WIDTH, '   '))
  out.push(wrap(c.oneLiner, WIDTH, '   '))
  out.push('')
  out.push(wrap(c.prompt, WIDTH, '   → '))
  out.push('')
  out.push(wrap(`why it works: ${c.why}`, WIDTH, '   '))
  if (c.watchOut) out.push(wrap(`watch out: ${c.watchOut}`, WIDTH, '   '))
  const alternatives = c.related.map(getConcept).filter(Boolean).slice(0, 3)
  if (alternatives.length) {
    out.push(wrap(`if that is not it: ${alternatives.map((a) => a!.name).join(', ')}`, WIDTH, '   '))
  }
  return out.join('\n')
}

function renderConcept(id: string): string {
  const c = getConcept(id)
  if (!c) {
    const near = CONCEPTS.filter((x) => x.id.includes(id) || x.name.toLowerCase().includes(id.toLowerCase()))
    return `No concept with the id "${id}".${near.length ? `\nDid you mean: ${near.map((n) => n.id).join(', ')}` : ''}`
  }
  const out = [
    c.name,
    c.origin ? `${c.origin}${c.aka?.length ? ` · also called ${c.aka.join(', ')}` : ''}` : '',
    c.domains.map((d) => DOMAIN_LABELS[d]).join(' · '),
    '',
    wrap(c.oneLiner, WIDTH, ''),
    '',
    'The magic words:',
    wrap(c.prompt, WIDTH, '  '),
    '',
    wrap(`Why it works: ${c.why}`, WIDTH, ''),
  ]
  if (c.watchOut) out.push(wrap(`Watch out: ${c.watchOut}`, WIDTH, ''))
  for (const v of c.variants ?? []) {
    out.push('', `Variant — ${v.label}:`, wrap(v.prompt, WIDTH, '  '))
  }
  out.push('', `Use when: ${c.useWhen.join('; ')}`)
  out.push(`Related: ${c.related.join(', ')}`)
  return out.filter((l) => l !== undefined).join('\n')
}

function main(text: string, args: Args): string {
  if (args.help) return USAGE

  if (args.show) return renderConcept(args.show)

  if (args.list !== undefined) {
    const needle = args.list.trim().toLowerCase()
    const matches = allConcepts().filter(
      (c) =>
        !needle ||
        c.name.toLowerCase().includes(needle) ||
        c.oneLiner.toLowerCase().includes(needle) ||
        c.tags.some((t) => t.includes(needle)) ||
        (c.aka ?? []).some((a) => a.toLowerCase().includes(needle)),
    )
    return [
      ...matches.map((c) => `${c.id.padEnd(30)} ${c.name} — ${c.oneLiner}`),
      '',
      `${matches.length} of ${CONCEPTS.length} concepts. --show <id> for the prompt.`,
    ].join('\n')
  }

  if (!text.trim()) return USAGE

  const { threads, picks } = triage(text, { limit: args.limit })

  if (args.json) {
    return JSON.stringify(
      {
        threads,
        picks: picks.map((p) => ({
          id: p.concept.id,
          name: p.concept.name,
          confidence: p.confidence,
          because: p.because,
          fromWholeInput: p.fromWholeInput,
          oneLiner: p.concept.oneLiner,
          prompt: p.concept.prompt,
          why: p.concept.why,
          watchOut: p.concept.watchOut ?? null,
          related: p.concept.related,
        })),
        composed: composePrompt(text, picks.filter((p) => p.confidence === 'strong')),
      },
      null,
      2,
    )
  }

  if (!picks.length) {
    return [
      'Nothing in the index matches that.',
      '',
      'This is a corpus of named techniques for getting unstuck, not a general',
      'search engine — a request that is already specific has nothing to gain here.',
      'Proceed with the work as asked.',
    ].join('\n')
  }

  const strong = picks.filter((p) => p.confidence === 'strong')
  const header =
    threads.length > 1
      ? `${threads.length} separate problems in what was said; ${picks.length} magic ${picks.length === 1 ? 'word' : 'words'} for them:`
      : `${picks.length} magic ${picks.length === 1 ? 'word' : 'words'} for this:`

  const out = ['✦ Magic Words', '', header, '', ...picks.map((p, i) => renderPick(p, i + 1)).join('\n\n').split('\n')]

  if (strong.length) {
    out.push(
      '',
      '─'.repeat(WIDTH),
      'The request with those phrases folded in — use this as the working brief,',
      'and tell the user which techniques you applied and why:',
      '',
      composePrompt(text, strong),
    )
  }

  return out.join('\n')
}

const args = parseArgs(process.argv.slice(2))

// Only the lookup-free modes read stdin, and only when there is a pipe to read.
// A `--show` that sat waiting on a stdin nobody was going to write to would
// look exactly like a hang, and the caller here is often an agent with no way
// to notice it is blocked.
const wantsText = !args.help && !args.show && args.list === undefined
const text = args.text || (wantsText ? await readStdin() : '')

process.stdout.write(main(text, args) + '\n')
