import type { Concept } from '../types'
import { architecture } from './architecture'
import { security } from './security'
import { framing } from './framing'
import { decisions } from './decisions'
import { prioritization } from './prioritization'
import { critique } from './critique'
import { diagnosis } from './diagnosis'
import { planning } from './planning'
import { communication } from './communication'
import { learning } from './learning'
import { research } from './research'
import { strategy } from './strategy'
import { design } from './design'
import { steering } from './steering'
import { testing } from './testing'
import { patterns } from './patterns'
import { distributed } from './distributed'
import { reliability } from './reliability'
import { performance } from './performance'
import { dataSystems } from './data'
import { apis } from './apis'
import { concurrency } from './concurrency'
import { delivery } from './delivery'
import { codecraft } from './codecraft'
import { frontend } from './frontend'
import { practice } from './practice'
import { platform } from './platform'
import { mlSystems } from './mlsystems'

export const CONCEPTS: Concept[] = [
  ...framing,
  ...architecture,
  ...security,
  ...decisions,
  ...prioritization,
  ...critique,
  ...diagnosis,
  ...planning,
  ...communication,
  ...learning,
  ...research,
  ...strategy,
  ...design,
  ...steering,
  ...testing,
  ...patterns,
  ...distributed,
  ...reliability,
  ...performance,
  ...dataSystems,
  ...apis,
  ...concurrency,
  ...delivery,
  ...codecraft,
  ...frontend,
  ...practice,
  ...platform,
  ...mlSystems,
]

export const CONCEPTS_BY_ID: ReadonlyMap<string, Concept> = new Map(
  CONCEPTS.map((c) => [c.id, c]),
)

export function getConcept(id: string): Concept | undefined {
  return CONCEPTS_BY_ID.get(id)
}
