import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'

/** Where the site actually lives. Change this if the domain ever does. */
const SITE = 'https://magic-words-xi.vercel.app'

/**
 * Absolute URLs for the link-preview tags in index.html.
 *
 * A crawler fetches the HTML with no page context, so a relative og:image is
 * simply dropped and the preview comes back bare. Which origin to name is not
 * a question the HTML can answer on its own, so it is stamped in at build,
 * most specific source first:
 *
 *   SITE_URL                        set it by hand to override everything
 *   VERCEL_PROJECT_PRODUCTION_URL   the project's canonical domain, exported
 *                                   to every Vercel build including previews,
 *                                   so a preview advertises the real URL
 *                                   rather than its own throwaway hostname
 *   VERCEL_URL                      this deployment, if the above is off
 *   SITE                            anywhere else — a plain `vite build`, or
 *                                   some other host
 *
 * Dev is the one case that must not use any of them: a page served from your
 * machine should not claim to be production.
 */
function siteUrl(): Plugin {
  const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  const configured = process.env.SITE_URL ?? (fromVercel ? `https://${fromVercel}` : SITE)

  return {
    name: 'magic-words:site-url',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        const url = ctx.server ? 'http://localhost:5173' : configured
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
