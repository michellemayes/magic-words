import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'

const FALLBACK_SITE_URL = 'https://magic-words.vercel.app'

/**
 * Absolute URLs for the link-preview tags in index.html.
 *
 * A crawler fetches the HTML with no page context, so a relative og:image is
 * simply dropped and the preview comes back bare. The origin is not knowable
 * at author time, so it is stamped in at build: Vercel exports the production
 * domain to every build, preview builds included — which is what we want, a
 * preview deploy advertising the canonical URL rather than its own throwaway
 * hostname. SITE_URL overrides it for a custom domain, and dev points at
 * localhost so nothing on your machine claims to be production.
 */
function siteUrl(): Plugin {
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  const configured = process.env.SITE_URL ?? (fromVercel ? `https://${fromVercel}` : undefined)

  return {
    name: 'magic-words:site-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const url = configured ?? (ctx.server ? 'http://localhost:5173' : FALLBACK_SITE_URL)
        return html.replaceAll('__SITE_URL__', url.replace(/\/+$/, ''))
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), siteUrl()],
  base: '/',
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
