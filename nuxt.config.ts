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

  // Offline PWA: icons must never come from the iconify network API. Serve
  // SSR icons from the locally installed @iconify-json/lucide and compile every
  // statically-used icon into the client bundle.
  icon: {
    serverBundle: { collections: ['lucide'] },
    clientBundle: { scan: true, sizeLimitKb: 512 },
  },

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
      // The module rewrites directory pages to extensionless clean URLs
      // ("plays/veer-black"), but precache lookups only try the EXACT request
      // URL plus its directoryIndex/param-stripped variations — so whichever
      // single form we precache, the other 404s to the fallback. Browsers hit
      // both: the app's links are slash-less, deep links and redirects add the
      // slash. Precache every page under BOTH keys (same revision, ~KBs of
      // duplicate HTML) so "/plays/x" and "/plays/x/" each match directly.
      // LOAD-BEARING. Declaring manifestTransforms disables the module's
      // built-in clean-URL rewrite, which used to strip ".../index.html" down
      // to extensionless-ONLY keys — a form no browser navigation could ever
      // match, so every SW-controlled navigation fell through to the fallback
      // and showed the HOME page. Here each directory page keeps its raw
      // ".../index.html" key ("/plays/x/" matches via directoryIndex) AND
      // gains an extensionless twin (the app's slash-less links match it
      // directly). Same revision, a few KB of duplicate HTML.
      manifestTransforms: [
        async (entries: { url: string; revision: string | null }[]) => ({
          manifest: entries.flatMap((e) =>
            e.url !== 'index.html' && e.url.endsWith('/index.html')
              ? [e, { ...e, url: e.url.slice(0, -'/index.html'.length) }]
              : [e],
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
      // Must be an EXACT precache key — createHandlerBoundToURL does no
      // directoryIndex resolution, so '/' would hard-fail every fallback.
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [/^\/_nuxt\//, /\.[a-z0-9]+$/i],
    },
    client: { installPrompt: true },
    devOptions: { enabled: false },
  },
})
