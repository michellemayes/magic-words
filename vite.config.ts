import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Absolute URLs for the link-preview tags in index.html.
 *
 * A crawler fetches the HTML with no page context, so a relative og:image is
 * simply dropped and the preview comes back bare. The origin is not knowable
 * at author time, so it is stamped in at build, most specific source first:
 *
 *   SITE_URL                        set it by hand for a custom domain
 *   VERCEL_PROJECT_PRODUCTION_URL   the project's canonical domain, exported
 *                                   to every Vercel build including previews,
 *                                   so a preview advertises the real URL
 *                                   rather than its own throwaway hostname
 *   VERCEL_URL                      this deployment, if the above is off
 *   localhost                       anywhere else, dev included
 *
 * The last one is deliberately a dead end rather than a guess at the domain:
 * a wrong origin points shared links at whoever does own that name, which is
 * worse than a preview that does not resolve. Anyone building this outside
 * Vercel should set SITE_URL.
 */
function siteUrl(): Plugin {
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  const configured = process.env.SITE_URL ?? (fromVercel ? `https://${fromVercel}` : undefined)

  return {
    name: 'magic-words:site-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const url = configured ?? 'http://localhost:5173'
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
