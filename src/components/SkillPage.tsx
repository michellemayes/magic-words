import { CopyButton } from './CopyButton'
import { CONCEPTS } from '../data/concepts'

const INSTALL = `git clone https://github.com/michellemayes/magic-words
cp -r magic-words/.claude/skills/magic-words ~/.claude/skills/`

/**
 * The install page.
 *
 * The site answers a question you had to think to ask. The skill answers the
 * one you did not — it reads what you typed at Claude Code anyway. This page
 * exists because that is the more useful of the two and nothing else on the
 * site would ever mention it.
 */
export function SkillPage() {
  return (
    <div className="prose">
      <section className="hero">
        <h1>
          The same thing, <em>inside Claude Code.</em>
        </h1>
        <p className="lede">
          A skill that reads what you were going to say anyway, works out which named techniques
          your problem needs, and puts the phrasing into the brief before the work starts. You
          describe the mess; it says “treating this as a pre-mortem and a blast-radius question”
          and gets on with it.
        </p>
      </section>

      <h2 className="section-label">Install it</h2>
      <div className="code">
        <div className="code-head">
          <span className="label">Once, anywhere</span>
          <CopyButton text={INSTALL} label="Copy" />
        </div>
        <pre>{INSTALL}</pre>
      </div>
      <p className="note">
        That is the whole install. The skill is a directory with two files in it — a page of
        instructions and one self-contained script carrying all {CONCEPTS.length} concepts and the
        ranking. No dependencies, no install step, no network: the same reason nothing you type on
        this site leaves your browser applies there. Drop it in a project’s{' '}
        <code>.claude/skills/</code> instead if you only want it for that repository.
      </p>

      <h2 className="section-label">What it does</h2>
      <div className="demo">
        <p className="demo-you">
          <span className="demo-who">you</span>
          the auth refactor is basically done but I want to ship it friday and something about that
          makes me nervous, also the new service ended up with the same admin role as everything
          else because it was easier
        </p>
        <p className="demo-claude">
          <span className="demo-who">claude</span>
          Two things here, and there is a name for each. Treating the Friday ship as a{' '}
          <strong>pre-mortem</strong> and the role as a <strong>least privilege</strong> question —
          those are the phrasings that get the specific version of both instead of general advice.
          Starting with the pre-mortem…
        </p>
      </div>
      <p className="note">
        It says which words it used, every time. Naming the technique is half of why it works on a
        model, and it is the half you get to keep — next time you can ask for it directly, which is
        the entire point of a lexicon.
      </p>

      <h2 className="section-label">When it stays out of the way</h2>
      <p className="note">
        A request that already says what it wants does not need steering, and the skill is told so
        in as many words: no injection when you have been specific, none that contradicts something
        you asked for, and nothing at all when the index has no good match. The alternative — a
        skill that finds a technique for everything because it is a skill about techniques — would
        make every request slightly worse.
      </p>

      <h2 className="section-label">Use it as a command line</h2>
      <div className="code">
        <div className="code-head">
          <span className="label">Anywhere you have node</span>
          <CopyButton
            text={'node ~/.claude/skills/magic-words/magic-words.mjs "the plan looks fine and nobody is objecting"'}
            label="Copy"
          />
        </div>
        <pre>{'node ~/.claude/skills/magic-words/magic-words.mjs \\\n  "the plan looks fine and nobody is objecting"'}</pre>
      </div>
      <p className="note">
        <code>--json</code> for structured output, <code>--show &lt;id&gt;</code> for one concept in
        full, <code>--list</code> for everything in the index. It also reads stdin, which is the
        reliable way to hand it a paragraph full of quotes and newlines.
      </p>
    </div>
  )
}
