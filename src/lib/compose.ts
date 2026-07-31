/**
 * Turning picks into something you can actually send.
 *
 * The point of this project is that naming the technique is what makes a model
 * do it, so the deliverable is not a page about pre-mortems — it is the user's
 * own request with the pre-mortem instruction sitting inside it, ready to
 * paste. This module is that one step, kept separate because the site and the
 * Claude Code skill both need to produce exactly the same text.
 *
 * Three rules, all of which are about not stealing the user's request:
 *
 * 1. Their words come first and are reproduced verbatim. The steering phrases
 *    are an addendum, never a rewrite — a paraphrase would quietly drop the
 *    detail the model most needed and nobody would notice.
 * 2. Every phrase is attributed to the concept by name. The name is doing
 *    half the work on the model, and it is the part the user is meant to learn.
 * 3. Nothing is added that is not a phrase. No "please", no explanation of why
 *    these were chosen — that belongs in the interface, not in the prompt.
 */

import type { Concept } from '../data/types'

/** The one line of scaffolding the composed prompt is allowed. */
export const INJECTION_HEADER = 'Apply these named techniques as you do it:'

export interface Injectable {
  concept: Concept
}

/**
 * The user's text with the chosen magic words appended, ready to paste into
 * Claude. Given nothing to inject it returns the text untouched, which is the
 * correct behaviour rather than a degenerate one: a request that already says
 * what it wants should be sent as written.
 */
export function composePrompt(input: string, picks: readonly Injectable[]): string {
  const original = input.trim()
  if (!picks.length) return original

  const injections = picks
    .map((p) => `**${p.concept.name}.** ${p.concept.prompt}`)
    .join('\n\n')

  return `${original}\n\n${INJECTION_HEADER}\n\n${injections}`
}

/**
 * A one-line, human-facing summary of what was applied — "Applied Pre-mortem
 * and Blast Radius." The skill says this out loud after steering, because a
 * user who is never told which words were used learns nothing and cannot
 * object, and the whole premise here is that these are worth knowing.
 */
export function describePicks(picks: readonly Injectable[]): string {
  const names = picks.map((p) => p.concept.name)
  if (!names.length) return ''
  if (names.length === 1) return names[0]
  return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
}
