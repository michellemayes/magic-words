/**
 * Bundles the retrieval engine into the Claude Code skill.
 *
 * The skill has to be a directory you can copy into `~/.claude/skills/` and
 * have work — no install step, no `node_modules`, no build. So the TypeScript
 * that the site runs is bundled into one dependency-free ES module and checked
 * in beside `SKILL.md`. That is a generated artefact in version control, which
 * is normally a smell; the alternative is a second implementation of the
 * ranking that would drift from the measured one, which is worse. CI runs this
 * script and fails if the committed output differs, so it cannot go stale
 * quietly.
 */

import { build } from 'vite'
import { readFileSync, writeFileSync } from 'node:fs'

const OUT_DIR = '.claude/skills/magic-words'
const OUT_FILE = `${OUT_DIR}/magic-words.mjs`

await build({
  // Not the site's config: no React plugin, no test block, nothing that would
  // pull a browser assumption into a file that runs under node.
  configFile: false,
  logLevel: 'warn',
  build: {
    outDir: OUT_DIR,
    emptyOutDir: false,
    copyPublicDir: false,
    // Legible on purpose. This file gets reviewed in diffs like any other, and
    // the bulk of it is the corpus, which minifying would not shrink much.
    minify: false,
    target: 'node20',
    lib: {
      entry: 'src/skill/cli.ts',
      formats: ['es'],
      fileName: () => 'magic-words.mjs',
    },
    rollupOptions: {
      // Every import in the entry graph is relative, so nothing is external and
      // the output is genuinely standalone.
      external: [],
      output: { banner: '#!/usr/bin/env node' },
    },
  },
})

// Vite writes the banner but not the note explaining why the file is here.
const bundled = readFileSync(OUT_FILE, 'utf8')
const notice = `#!/usr/bin/env node
/*
 * GENERATED FILE — do not edit.
 *
 * Built from src/ by \`npm run build:skill\` in
 * https://github.com/michellemayes/magic-words, so that this skill is one
 * self-contained directory with no install step. Edit the corpus or the
 * ranking there and rebuild; edits made here are lost on the next build.
 */
`

writeFileSync(OUT_FILE, bundled.replace(/^#!\/usr\/bin\/env node\n/, notice))

const kb = (Buffer.byteLength(readFileSync(OUT_FILE)) / 1024).toFixed(0)
console.log(`skill bundled → ${OUT_FILE} (${kb} kB)`)
