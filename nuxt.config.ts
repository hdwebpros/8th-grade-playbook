// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // Parallel agents/build tasks can each set NUXT_BUILD_DIR to avoid racing on .nuxt
  buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/fonts', '@vite-pwa/nuxt'],

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],

  // <PlayDiagram> not <DiagramPlayDiagram> — SEAM §3 component contracts
  components: [{ path: '~/components', pathPrefix: false }],

  fonts: {
    families: [
      { name: 'Barlow Condensed', weights: [600, 700] },
      { name: 'Barlow', weights: [400, 500, 600] },
    ],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Centennial Wolves Playbook',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content: 'Centennial Wolves 8th grade football playbook — plays, routes, and quizzes.',
        },
        { name: 'theme-color', content: '#0b0d10' },
      ],
      link: [
        // @vite-pwa/nuxt doesn't inject this into the prerendered HTML itself
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/icon-192.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      script: [
        {
          // Register the precache worker from the document itself. Doing it
          // here (rather than leaving it to a hydration-time chunk) means a
          // cold static load installs the offline cache on first paint.
          innerHTML:
            "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js',{scope:'/'})})}",
          type: 'text/javascript',
        },
      ],
    },
  },

  // Installable + fully offline (HANDOFF §6). Precache only: no runtime
  // network calls, no backend, nothing stored about anyone.
  pwa: {
    registerType: 'autoUpdate',
    // Register from the HTML itself rather than a hydration-time chunk, so the
    // worker installs on the very first paint of a cold, static load.
    injectRegister: 'script-defer',
    manifest: {
      name: 'Wolves Playbook',
      short_name: 'Wolves',
      description:
        'Centennial Wolves 8th grade football playbook — plays, routes, and quizzes. Works with no signal.',
      lang: 'en',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      theme_color: '#0B0D10',
      background_color: '#0B0D10',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      // App shell, every prerendered page + its payload, fonts, brand art.
      globPatterns: ['**/*.{js,css,html,json,ico,png,svg,webp,woff2}'],
      // The module rewrites 404.html/200.html to extensionless precache URLs,
      // which most static hosts serve with a 404/redirect status — that fails
      // the whole precache install. navigateFallback covers offline navigation,
      // so these two error pages don't need to be cached at all.
      globIgnores: ['404.html', '200.html'],
      // The module also rewrites directory pages to extensionless clean URLs
      // ("plays/veer-black"), but browsers navigate to "/plays/veer-black/" —
      // neither that nor its directoryIndex variant matches the stored key, so
      // every SW-controlled play navigation fell through to navigateFallback
      // and got the HOME page. Restore ".../index.html" keys so directoryIndex
      // matching works.
      manifestTransforms: [
        async (entries: { url: string; revision: string | null }[]) => ({
          manifest: entries.map((e) =>
            /\.[a-z0-9]+$/i.test(e.url)
              ? e
              : { ...e, url: `${e.url.replace(/\/$/, '')}/index.html` },
          ),
          warnings: [],
        }),
      ],
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      // Directory-style prerendered routes ( /plays/ -> /plays/index.html ),
      // with the shell as the last-resort fallback for a cold deep link.
      directoryIndex: 'index.html',
      // ?front=52 deep links must still hit the precached page — otherwise the
      // SW misses and navigateFallback serves the HOME page for play URLs.
      ignoreURLParametersMatching: [/^front$/, /^utm_/, /^fbclid$/],
      cleanupOutdatedCaches: true,
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/_nuxt\//, /\.[a-z0-9]+$/i],
    },
    client: { installPrompt: true },
    devOptions: { enabled: false },
  },
})
