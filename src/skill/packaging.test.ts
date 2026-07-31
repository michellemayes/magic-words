/**
 * The plugin as a package, checked the way a user's install would check it.
 *
 * Everything else in this repository tests the ranking. None of it would notice
 * that `marketplace.json` points at a directory that no longer exists, that the
 * skill lost its frontmatter, or that the bundle shipped without its execute
 * bit — and every one of those is invisible until somebody runs
 * `/plugin install` and it does nothing.
 *
 * The schema being checked is the documented one for Claude Code plugin
 * marketplaces: a `marketplace.json` with `name`, `owner` and `plugins`, each
 * plugin entry naming a `source`, and each plugin directory holding its
 * components in the default locations (`skills/<name>/SKILL.md`, `bin/`).
 */

import { describe, expect, it } from 'vitest'
import { accessSync, constants, readFileSync, realpathSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('../..', import.meta.url).pathname

const read = (path: string) => readFileSync(join(ROOT, path), 'utf8')
const readJson = (path: string) => JSON.parse(read(path))

const marketplace = readJson('.claude-plugin/marketplace.json')

describe('the marketplace manifest', () => {
  it('has the fields the loader requires', () => {
    expect(marketplace.name).toMatch(/^[a-z0-9-]+$/)
    expect(marketplace.owner?.name).toBeTruthy()
    expect(Array.isArray(marketplace.plugins)).toBe(true)
    expect(marketplace.plugins.length).toBeGreaterThan(0)
  })

  /**
   * The names are the public interface — `/plugin install <plugin>@<market>` —
   * so a rename is a breaking change for everyone who has it installed, not a
   * tidy-up. This is here to make that decision deliberate rather than a diff
   * nobody looked twice at.
   */
  it('keeps the install command it published', () => {
    expect(marketplace.name).toBe('michellemayes')
    expect(marketplace.plugins.map((p: { name: string }) => p.name)).toContain('magic-words')
  })

  it('points every plugin at a directory that is really there', () => {
    for (const plugin of marketplace.plugins) {
      expect(typeof plugin.source, `${plugin.name} source`).toBe('string')
      expect(plugin.source.startsWith('./'), 'relative sources must start with ./').toBe(true)
      expect(statSync(join(ROOT, plugin.source)).isDirectory()).toBe(true)
    }
  })

  /**
   * Deliberately no `version`, here or in `plugin.json`. Pinning one means
   * installed users stay on it until it is bumped, and what changes in this
   * repository is nearly always the corpus — a concept added, a prompt
   * sharpened. Omitting it makes the git commit the version, so an install
   * tracks the lexicon instead of a number somebody has to remember to raise.
   */
  it('does not pin a version', () => {
    for (const plugin of marketplace.plugins) {
      expect(plugin.version, `${plugin.name} pins a version`).toBeUndefined()
      const manifest = readJson(join(plugin.source, '.claude-plugin/plugin.json'))
      expect(manifest.version, `${plugin.name} plugin.json pins a version`).toBeUndefined()
    }
  })

  it('agrees with each plugin manifest about what the plugin is called', () => {
    for (const plugin of marketplace.plugins) {
      const manifest = readJson(join(plugin.source, '.claude-plugin/plugin.json'))
      expect(manifest.name).toBe(plugin.name)
    }
  })
})

describe('the magic-words plugin', () => {
  const dir = 'plugins/magic-words'

  it('puts its skill where the loader looks for it', () => {
    const skill = read(`${dir}/skills/magic-words/SKILL.md`)
    // Frontmatter, and specifically a description: it is the entire trigger
    // surface. A skill with no description loads and never fires.
    const [, frontmatter] = skill.split('---\n', 2)
    expect(frontmatter).toContain('name: magic-words')
    expect(frontmatter).toMatch(/description: \S/)
  })

  it('ships the bundle the skill runs, executable', () => {
    const bundle = `${dir}/skills/magic-words/magic-words.mjs`
    expect(read(bundle).startsWith('#!/usr/bin/env node')).toBe(true)
    // bin/magic-words execs it directly; without this the shim is a no-op that
    // only shows up on somebody else's machine.
    accessSync(join(ROOT, bundle), constants.X_OK)
  })

  it('exposes the CLI on PATH through bin/', () => {
    const shim = `${dir}/bin/magic-words`
    accessSync(join(ROOT, shim), constants.X_OK)
    // The shim resolves the bundle relative to itself, so the two have to stay
    // in the layout it assumes.
    expect(read(shim)).toContain('../skills/magic-words/magic-words.mjs')
  })

  /**
   * The repository's own `.claude/skills/magic-words` is a symlink into the
   * plugin, so contributors get the skill without a second copy of a bundle
   * that is now well over a megabyte to keep in step. A broken symlink is
   * silent — the skill simply stops existing — so it is checked, not trusted.
   */
  it('is the same skill this repository uses on itself', () => {
    expect(realpathSync(join(ROOT, '.claude/skills/magic-words'))).toBe(
      realpathSync(join(ROOT, dir, 'skills/magic-words')),
    )
  })
})
