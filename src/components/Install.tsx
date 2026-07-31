import { CopyButton } from './CopyButton'

/**
 * The two commands that install the plugin.
 *
 * Defined once and used on both the landing page and the skill page, because
 * these are the strings a person pastes into their terminal and a stale copy of
 * them on one page is worse than no copy at all. The marketplace name is the
 * public interface — `/plugin install <plugin>@<marketplace>` — so it lives
 * here beside the commands rather than being spelled out in prose twice.
 */

export const MARKETPLACE = 'michellemayes'
export const REPO = 'michellemayes/magic-words'

export const INSTALL_COMMANDS = [
  `/plugin marketplace add ${REPO}`,
  `/plugin install magic-words@${MARKETPLACE}`,
]

export function Install({ label = 'In Claude Code' }: { label?: string }) {
  return (
    <div className="code">
      <div className="code-head">
        <span className="label">{label}</span>
        <CopyButton text={INSTALL_COMMANDS.join('\n')} label="Copy both" />
      </div>
      <pre>
        {INSTALL_COMMANDS.map((command) => (
          <span className="cmd" key={command}>
            {command}
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  )
}
