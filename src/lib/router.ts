import { useEffect, useState } from 'react'
import type { Domain, Intent } from '../data/types'
import { DOMAINS, INTENTS } from '../data/types'

export type Route =
  | { name: 'home' }
  | { name: 'search'; text: string; domains: Domain[]; intents: Intent[] }
  | { name: 'concept'; id: string }
  | { name: 'browse' }
  | { name: 'skill' }

/** Keeps searches and concepts linkable and back-button friendly. */
export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, '')
  const [path, qs] = clean.split('?')
  const params = new URLSearchParams(qs ?? '')

  if (path.startsWith('/c/')) {
    return { name: 'concept', id: decodeURIComponent(path.slice(3)) }
  }
  if (path === '/browse') return { name: 'browse' }
  if (path === '/skill') return { name: 'skill' }
  if (path === '/search') {
    return {
      name: 'search',
      text: params.get('q') ?? '',
      domains: (params.getAll('d') as Domain[]).filter((d) => DOMAINS.includes(d)),
      intents: (params.getAll('i') as Intent[]).filter((i) => INTENTS.includes(i)),
    }
  }
  return { name: 'home' }
}

export function toHash(route: Route): string {
  switch (route.name) {
    case 'home':
      return '#/'
    case 'browse':
      return '#/browse'
    case 'skill':
      return '#/skill'
    case 'concept':
      return `#/c/${encodeURIComponent(route.id)}`
    case 'search': {
      const params = new URLSearchParams()
      if (route.text.trim()) params.set('q', route.text.trim())
      for (const d of route.domains) params.append('d', d)
      for (const i of route.intents) params.append('i', i)
      const qs = params.toString()
      return qs ? `#/search?${qs}` : '#/search'
    }
  }
}

export function useRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (r: Route) => {
    const next = toHash(r)
    if (next === window.location.hash) setRoute(r)
    else window.location.hash = next
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return [route, navigate]
}
