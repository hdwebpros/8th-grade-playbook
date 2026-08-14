# Orchestration state — Wolves playbook vertical slice

Working notes for the Fable orchestrator (survives context compaction). The
contracts live in `docs/SEAM.md` + frozen `app/types/football.ts`; the brief is
`HANDOFF.md`. This file is only the plan-of-record and progress ledger.

## Decisions already made (do not re-litigate)

- Seam settled first: yard coordinates, semantic action kinds, block-by-target,
  per-front complete action maps, mirror transform. See SEAM §5 for rationale.
- Quiz mode for the slice: **Know-your-job** (best proof of per-player data).
- Tokens/fonts/icons fixed in SEAM §4 (Barlow Condensed + Barlow, lucide,
  Wolves red #D6202F, dark-first app / light print). Installed by orchestrator:
  `@iconify-json/lucide`, `typescript`, `vue-tsc`.
- PDF approach: print-optimized route + browser print-to-PDF (no backend
  allowed). Opus decides implementation details within that.
- No git commits unless Ryan asks. Varsity scans never ship in the product.

## Phase 1 — running (3 background agents, launched 2026-08-09)

| Agent | Model | Owns |
| --- | --- | --- |
| Data/transcription | opus | `app/data/**`, `app/utils/mirror.ts` |
| Diagram renderer | opus | `app/components/diagram/**`, `app/pages/dev/**` |
| Design/shell | fable | everything else in `app/`, `nuxt.config.ts`, brand asset placement; only agent allowed npm installs |

`app/types/football.ts` is frozen — orchestrator-only.

## On phase-1 completion → integration pass (orchestrator)

1. Read each agent's final report as it arrives; note mirror hand-corrections
   and reviewNotes for Ryan.
2. Wire seams: play page imports real data + renderer; fix cross-ownership
   type errors myself (small) or bounce back via SendMessage (large).
3. Verify: `npx vue-tsc --noEmit` clean, `npm run generate` clean, spot-check
   `/dev/diagram`, `/plays/veer-red` (front switcher, Red/Black toggle,
   tap-to-highlight), `/routes` in a browser (`run` skill) — screenshots.

## Phase 2 — after integration (2 agents, parallel)

- **fable — Know-your-job quiz**: `/quiz/know-your-job` end to end. Pick
  position → asked only your assignments across the slice's plays/fronts
  (from `play.assignments` + `vs[front].assignments` overrides), reveal +
  self-grade or tap-the-right-thing; state browser-local & disposable, no
  names, nothing stored about anyone. Lands in the shell's stub; follows
  tokens.
- **opus — PDF + offline**: print route covering the slice (cover w/ mark,
  formations, 6 Veer diagrams w/ assignment tables via `theme="print"`,
  route tree), Letter portrait, `@page` CSS, wired to /export button; then
  PWA/offline (`@vite-pwa/nuxt` or equivalent), verify `npm run generate`
  output works offline. May touch nuxt.config (phase 1 shell agent done by then).

## Phase 3 — full-book play authoring (4 opus agents, launched 2026-08-09)

Ryan directives: NO screenshots in reports to him (he views the app himself;
keep context pure). Arrows/assignments must match the varsity scan's DRAWN
arrows literally (his example: Veer p5 vs 4-4, backside/left tackle steps
DOWN toward the guard area, not out) — sent to all 4 agents.

| Agent | Scope | Files owned | Build dir / ports |
| --- | --- | --- | --- |
| Crush+Buck | p7, p8-9 | data/plays/{crush,buck-sweep}.ts, pages/dev/crush.vue | .nuxt-crush / 4400-4449 |
| Stretch+Waggle | p11-12, p19 | data/plays/{stretch,waggle}.ts, pages/dev/stretch.vue | .nuxt-stretch / 4450-4499 |
| Free-call | p16-18 (+14) | data/plays/free-call.ts, pages/dev/free-call.vue | .nuxt-freecall / 4500-4549 |
| Split Wide | p4 + Ryan's 4 made-up plays (DRAFT gate, §10) | data/split-wide-formation.ts, data/plays/split-wide.ts, pages/dev/split-wide.vue | .nuxt-splitwide / 4550-4599 |

None touch data/index.ts / formations.ts / nuxt.config / package.json —
orchestrator wires index + merges split-wide formation after they land.
Ram/Bull pass-pro page deliberately deferred (needs its own presentation
design — not a Play; later fable phase).

## Orchestrator TODO (post-compaction checklist)

1. AUDIT Veer vs p5 arrows per Ryan's directive — esp. LT action vs 4-4
   (should step down toward guard area). Fix data if it disagrees.
2. TEAM RENAME: HANDOFF now says Centennial WOLVES; app text still says
   Cougars (nuxt.config title/description, pages, print route). Sweep it.
3. BRAND REDO: reference/brand/wolves-team-logo.png is NEW wolf art, again
   fake-transparent (hasAlpha but all alpha=255, checker baked in, corner
   202-gray). Re-run recorded keying algorithm BUT re-tune the
   whiten-interior-neutrals step — wolf's silver muzzle is ~light gray and
   the old ≥190→white rule would flatten it. Regenerate public/brand mark +
   icon-512/192 + apple-touch + favicon (face crop).
4. PDF agent was at ~165k tokens; told to land minimal scope + report state.
   Expect possibly-unfinished report; resolve nuxt.config/package merges +
   the `process` typing complaint; finish PDF/offline myself or respawn a
   fresh agent with its handoff.
5. Phase-2/3 integration: wire new plays into data/index.ts + splitWide into
   formations map; vue-tsc + generate + route checks; verify quiz still
   collapses fronts correctly with new plays (round lengths grow); verify
   print route picks up new plays or scope-check with Ryan.
6. Report to Ryan WITHOUT screenshots: facts, review items (football
   reviewNotes from all agents, block-target dimming question; Indy/Hoosier
   RESOLVED 2026-08-13 — they are directions, callName wired).

## Final

Integration + full verify + screenshots for Ryan. Slice review items for Ryan
are listed in HANDOFF §10 + any reviewNotes in data.

## Ledger (append as things land)

- 2026-08-09: SEAM.md + types written; deps installed; phase-1 agents launched.
- 2026-08-09: Shell agent DONE. All pages + tokens + brand shipped, typecheck
  clean (proved vs a temp data stub). Build blocked only on missing `~/data`.
  Notes for integration: front choice lives in URL query on play page; quiz
  stub marked `data-quiz-slot="know-your-job"`; export stub
  `data-export-slot="build-book"`; print scope `.diagram-print` /
  `[data-diagram-theme='print']` in tokens.css; `sharp` added (dev),
  `typescript` pinned ~5.9 (vue-tsc 3.x incompatible with tsgo preview).
  Optimized brand PNGs in `public/` (271KB mark, icons, favicon).
- 2026-08-09: Renderer agent DONE. `app/components/diagram/**` complete
  (geometry/style/path modules + Field/ActionPath/PlayDiagram/RouteTreeDiagram
  + diagram.css + /dev/diagram sandbox). Visually verified via headless
  Chrome, typechecked clean. Resolutions to note: 20 SVG units/yard, table
  "px" = design units (scales as one system); added `--dg-grid` +
  `--dg-accent-ink` tokens with fallbacks; authored block path wins over
  targetId (target-only stops 0.62yd short); dimming is literal (35% for
  everything incl. block target — flag to Ryan if it should stay lit); hit
  areas capped at half-distance to nearest teammate (interior OL < 44px,
  unavoidable); tap-again/tap-field → select(null); RouteTree always
  interactive. Its vue-tsc complaint was the ts7 preview — already fixed by
  shell agent's typescript ~5.9 pin. Only build error: missing `~/data`.
- 2026-08-09: Data agent DONE. formations/fronts/routes/veer + mirror.ts +
  data/index.ts (`formations, fronts, plays, playList, routes`). Veer Red
  authored RIGHT; Black pure mirror, zero hand-corrections needed (verified
  vs page-1 measurements). Accepted deviation: wing ids L/R DO swap on mirror
  (L always = left wing, per type comments + page 1). 5 reviewNotes for Ryan
  incl. Indy-vs-Hoosier direction unresolvable, backside-Y rip target
  ambiguity at 150 DPI. All 3 phase-1 agents complete → integration pass.
- 2026-08-09: Integration pass DONE (orchestrator). Fixed: `formations` export
  typed `Partial<Record<FormationId, Formation>>` (split-wide index error);
  play-page `?front=` query ignored on hydration (setup ran before router
  settled — added route→ref sync watch); brand assets were NOT transparent —
  source PNG has a baked-in transparency checkerboard (HANDOFF wrong about
  "transparent PNG") — keyed it out via border-seeded flood fill + normalized
  checker-through-white to white, regenerated mark + all icons (face crop).
  Verified: vue-tsc clean, generate clean, all routes 200, ?front=52 works,
  tap-to-highlight works (dim + scroll-to-row + expand), Red/Black mirror
  correct, route tree renders. Screenshots in scratchpad. Added
  `buildDir: NUXT_BUILD_DIR||'.nuxt'` to de-race parallel phase-2 builds.
  → Phase 2 launched: quiz (fable), PDF+offline (opus).
- 2026-08-09: Quiz agent DONE. `/quiz/know-your-job` end to end:
  `app/composables/useKnowYourJob.ts` (pure round engine: plays × fronts via
  mergedAssignments, identical-rule fronts collapsed into one question,
  representative front re-rolled per round; distractors = real teammates'
  rules same play/front, own position group preferred; ownerOf map for miss
  teach-back) + full page replacing the stub (picker w/ anonymous
  localStorage "Last time" chip → tap-the-right-answer → reveal with
  highlighted PlayDiagram + coaching detail + collapsed-fronts note + miss
  teach-back → score summary w/ recap). Design: objective tap variant (not
  self-grade); red = success (team color); misses neutral steel; round length
  2–6 by how much the job varies by front; reduced-motion respected; 44px+
  targets. Verified by agent: vue-tsc clean in its files, generate clean
  (.nuxt-quiz, 22 routes), full flow driven headless at 375/1280px,
  localStorage persistence confirmed. Screenshots in scratchpad 1-6*.png.
  Note: agent saw a `process` typing complaint in nuxt.config.ts — check at
  phase-2 integration (likely needs @types/node or import from node:process).
  PDF+offline agent still running.
- 2026-08-09: RYAN SIGNED OFF on the Veer play experience ("Veer is AMAZING").
  The play page, diagrams, and Red/Black mirror are approved as-is. Still
  pending his review: data reviewNotes (Indy/Hoosier direction, backside-Y
  rip target, playside wing vs 4-3, 5-2 read key, even-front symmetry) and
  the renderer's block-target-dimming question — surface in final report.
- 2026-08-09: Ryan on Indy/Hoosier: probably NOT left/right — possibly a call
  based on what you see in the defense; he's asking the director. Updated the
  reviewNote in veer.ts. Do not wire callName until the director answers.
  If it turns out defense-keyed, the natural home is per-front (vs[front])
  metadata, not the play's direction — decide when the answer arrives.
- 2026-08-13: Ryan RESOLVED Indy/Hoosier — they ARE directions: Indy = run goes
  LEFT, Hoosier = run goes RIGHT. Supersedes the 2026-08-09 "do not wire
  callName until the director answers" instruction. callName wired: Veer Red
  (right) = 'Hoosier', Veer Black (left) = 'Indy', Crush Red (left) =
  'Indy — Crush', Crush Black (right) = 'Hoosier — Crush'. Note: mirrorPlay
  copies callName VERBATIM (it does not flip it), so the mirrored Black plays
  carry explicit callName overrides.
- 2026-08-10 (post-compact): PDF agent got a FINAL order — report + terminate
  after its in-flight generate/offline verify (it had wired SW registration
  into nuxt.config head script + print route app/pages/print/book.vue exists).
  If it keeps going anyway: TaskStop and finish from its partial transcript.
  TODO #2 (Wolves rename) confirmed ALREADY DONE — zero "cougar" refs in app;
  all titles/print route say Wolves. Launched two opus agents: Veer-p5 arrow
  audit (owns app/data/plays/veer.ts, .nuxt-audit) and brand re-key of new
  wolf art (owns public/ brand assets only). Both report text-only.
- 2026-08-10: PDF agent DONE (landed on order, 175k tokens). Print book fully
  verified: /print/book prerenders, 11-page Letter PDF w/ text layer, zero
  sheet overflow (scratchpad measure.mjs re-runs the check), export button
  wired. Its offline gap FIXED BY ORCHESTRATOR: precache manifest contained
  extensionless 404/200 entries that fetch as HTTP 404 → workbox install
  failed → Chrome discarded the registration silently. Fix: workbox
  globIgnores ['404.html','200.html'] (navigateFallback covers navigation).
  Also added missing <link rel=manifest> to app.head (module doesn't inject
  it into prerendered HTML). Verified: SW activates, 107 entries precached,
  ALL routes 200 offline incl. /print/book (9 diagrams), fonts+brand offline,
  vue-tsc clean (the old `process` typing complaint no longer reproduces).
  Scratchpad verify scripts: offline.mjs, sw.mjs, measure.mjs (serve
  .output/public on 4311 first). PDF/offline TODO #4 fully closed.
- 2026-08-10: Ryan flagged 3 subagents >100k — land-now orders sent to
  free-call, crush+buck, stretch+waggle agents (report + terminate).
- 2026-08-10: Free-call agent DONE (139k). data/plays/free-call.ts: Red Ram 33
  / Red Ram 12 / Red Sprint Rt 54 + Black mirrors (Bull/Sprint Lt), full
  11-man maps × 3 fronts, digit decode in descriptions. NEVER RENDERED — data
  verified by typecheck only; eyeball diagrams at integration. Wired into
  data/index.ts by orchestrator (playList now drives plays map); vue-tsc +
  generate clean, all 6 routes prerender. BIG reviewNotes for Ryan in the
  file: Ram-vs-Bull direction convention (Red=Ram/Black=Bull chosen; p15's
  drawing is literally Bull), 5-2 protection goes man-on (Super to the edge),
  two-digit-only surface, backside standing rules (Y=0 block, wing flat/
  vertical), wing route width, p18 post depth vs tree (tree wins).
- 2026-08-10: ALL PHASE-3 AGENTS DONE. Crush+Buck (165k): crush.ts,
  buck-sweep.ts — both run LEFT out of Red (opposite Veer); 52 is the literal
  scan transcription, even fronts are rules-resolved; reviewNotes in files.
  Stretch+Waggle (167k): stretch.ts, waggle.ts, dev/stretch.vue —
  **HANDOFF PAGE MAP OFF BY ONE here: p11=Jet, p12=Stretch main, p13=Stretch
  formation variants (not fronts)**; Stretch Red runs LEFT; Waggle's big open
  question: does the wing (R) motion to take the fake w/ RG pulling (coded),
  or does R block edge and Super takes the fake? Split Wide (145k):
  split-wide-formation.ts, plays/split-wide.ts, dev/split-wide.vue — HB=S
  (Super), 4 plays DRAFT-gated, huge review list (crash-the-middle intent is
  the §10 question; screen uses `pitch` kind for ball flight; posts collide
  at 15yd; "Go"=fade 9). Veer audit (118k): LT vs even fronts now steps DOWN
  the line to the guard's spot then up to B-L (Ryan's p5 directive) — new
  LT_RIP path in veer.ts; everything else matched; 5 new/strengthened
  reviewNotes. Brand (69k): all public/ brand assets regenerated from new
  wolf art — flood fill + enclosed-region checker classification (grid-fit
  58×57px lattice) preserved the silver fur; mark=head only 800×537 128KB;
  icons face-crop on #10141A; favicon rebuilt; halo gone; all smaller.
- 2026-08-10: ORCHESTRATOR INTEGRATION DONE. All 20 plays wired into
  data/index.ts playList (veer 2, crush 2, buck 2, stretch 2, waggle 2,
  free-call 6, split-wide 4); splitWide merged into formations map.
  TWO REAL BUGS FOUND VIA HEADLESS STRESS-TEST AND FIXED:
  (1) [id].vue watch(front) could router.replace while the router transiently
  sat on '/' during hydration → guarded (skip when query already matches or
  no route.params.id).
  (2) PRODUCTION PWA BUG: workbox precache lookup includes query strings, so
  /plays/x?front=52 missed the precache and navigateFallback '/' served the
  HOME page for play deep links once the SW controlled the page (this is why
  pages "randomly" showed home + URL rewrote to /?front=52). Fix:
  workbox.ignoreURLParametersMatching [/^front$/, /^utm_/, /^fbclid$/].
  Verified after fixes: vue-tsc clean, generate clean, 48/48 play loads
  through the SW render, all 36 deep loads of never-rendered plays × 3 fronts
  render w/ no NaN geometry + no pageerrors, /plays lists all 20, print book
  auto-includes full book (71 SVGs), FULL OFFLINE sweep passes (63 diagrams
  in /print/book offline), fonts+brand offline.
  STILL OPEN post-compact: (a) print PDF re-verify at full-book size —
  measure.mjs per-sheet overflow check + chrome --print-to-pdf (content grew
  from 11 pages, unverified); (b) visual eyeball of new play diagrams (data
  verified, football arrows only checked by transcribing agents); (c) compile
  the no-screenshots final review report for Ryan from all reviewNotes
  (grep reviewNotes across app/data/plays/*.ts) + block-target dimming + the
  free-call Ram/Bull direction call + Waggle fake question + Split Wide gate;
  (d) no git commits unless Ryan asks.

## 2026-08-09 — Arrow-fidelity pass (Ryan: "arrows still seem off — superimpose vs the scans")
- THIRD PWA BUG found while building the capture harness (the ?front= fix was
  only half of it): the module rewrites directory pages to extensionless clean
  URLs in the precache manifest ("plays/veer-black"), but browsers navigate to
  "/plays/veer-black/" — neither that nor its directoryIndex variant matches
  the stored key, so EVERY SW-controlled play navigation fell through to
  navigateFallback '/' (home page). The earlier "48/48 pass" was measured
  before the SW controlled navigations. Fix in nuxt.config.ts:
  workbox.manifestTransforms restoring ".../index.html" URLs for extensionless
  entries. Rebuilt + verified: SW-controlled loads of veer-red/veer-black/
  crush-red all render the right play (debug1.mjs).
- Capture harness: scratchpad/capture.mjs screenshots every play diagram
  (.diagram element) from the served build on :4311 — 20 plays × 3 fronts =
  60 PNGs in scratchpad/compare/<id>--<front>.png. Use domcontentloaded +
  waitForSelector('.diagram svg'); networkidle0 hangs on SW precache traffic.
- 7 opus compare agents fanned out (one per family) with scans + PNGs + play
  file: veer(p5-6), crush(p7), buck(p8-9), stretch(p12-13), waggle(p19),
  free-call(p14-18), split-wide formation only (p4, plays are drafts — no scan
  to match). Orders: literal player-by-player compare on the front the scan
  actually draws, rule-consistency only on the others, fix data, ambiguity →
  reviewNotes, no builds/typechecks (orchestrator re-verifies), no id renames,
  don't revert coach-approved Veer LT down-step, don't resolve open coach
  questions (Waggle fake, Ram/Bull).
- After agents land: re-run vue-tsc + generate, re-capture changed plays,
  full offline sweep (offline.mjs) against the rebuilt output, then report.

## 2026-08-10 — Fidelity pass LANDED + PWA offline root-cause + icon fix
ARROW FIXES (all 7 compare agents done; typecheck clean; regenerated):
- veer.ts: Y rip-inside before wall-off; S dive angled at PSG hip (was vertical
  over C); Q keep breaks flat/wide at LOS; pitch arc re-hung 5x1; R vertical
  stem; C "get vertical" leg. LT down-step confirmed vs scan, untouched.
- crush.ts: L pin-pulls INSIDE onto B-L per p5 PSW rule (was arcing to corner
  — biggest error); Q flat at backfield depth; R pitch 5x1 behind LOS; mesh
  point aligned. 43: L falls through to C-L (read key IS the backer).
- buck-sweep.ts: R carrier tucks INSIDE the kick (was bouncing outside own
  block); RG wrap flat through QB heels then up; LG kick stays flat, never
  turns up; S midline +3.4.
- stretch.ts: S aims x=-3.8 then dead-vertical (was pressing to -5.5 = sweep);
  Q mesh at (-2.5,-2.9); LG adds climb to B-L in 52. p13 "Stretch Right" is
  NOT the mirror — weak-side stretch out of Red; doc comment corrected.
- waggle.ts: Y drag→OVER; L over→POST deep-middle; X corner deepened (flood
  was inverted); R motion behind Super, fake stops behind LOS; Q boot launch
  deeper (old note had it backwards); RG pull past the wing.
- free-call.ts: 12 wing speed-out now finishes OUTSIDE X (widen 2). 33/54
  match. routes.ts verified correct, untouched.
- split-wide formation: MATCH, untouched.
- Each play file gained reviewNotes (grep reviewNotes for Ryan's review list;
  new highlights: waggle 18-19yd depths vs 8th grade?; buck wing-vs-kick same
  edge man ambiguity; crush nobody-on-corner trade; stretch backside wing).
PWA (nuxt.config.ts):
- ICONS: @nuxt/icon was fetching from iconify API at build (flaky → missing
  glyphs offline). Pinned: icon.serverBundle.collections ['lucide'] +
  clientBundle scan. Verified bundled.
- OFFLINE ROOT CAUSE (supersedes yesterday's two partial fixes): the module's
  clean-URL manifest rewrite made extensionless precache keys that NO
  navigation URL form can match. Fix = identity manifestTransforms (its mere
  presence disables the rewrite) → raw ".../index.html" keys match "/x/"
  navigations via directoryIndex. Also navigateFallback must be '/index.html'
  (exact key; '/' hard-failed EVERY fallback = ERR_INTERNET_DISCONNECTED).
- VERIFIED offline: '/', '/plays/', '/plays/veer-red/' (+?front=52) serve
  correct pages w/ diagrams. KNOWN GAP: slash-less '/plays/x' offline serves
  home shell and Nuxt hydration REWRITES URL to '/' (does not recover route).
  App's internal links are slash-less, so an offline REFRESH on a play page
  lands home. Candidate fixes post-compact: (a) Nuxt trailingSlash so links/
  URLs carry '/', (b) also precache extensionless twins (breaks install on
  hosts that 404 extensionless), (c) teach the fallback shell to re-route.
  Pick (a) first — investigate route rendering impact.
- offline.mjs asset "FAIL" lines were cascade noise from a dead error page.
- capture.mjs recaptured 60/60 post-fix; agents' fixes not yet visually
  re-eyeballed by Ryan (he views the app himself).
STILL OPEN: slash-less offline gap above; print PDF re-verify at full-book
size (measure.mjs + --print-to-pdf); Ryan's coaching rulings (reviewNotes);
Split Wide DRAFT gate; no git commits unless asked.

## 2026-08-10 (later) — Slash-less offline gap CLOSED + Ryan's free-call→audible rename absorbed
- Offline fix: chose ledger option (b) dual-key precache, NOT trailingSlash (Nuxt 3 has no first-class option). manifestTransforms in nuxt.config.ts now emits an extensionless twin for every `*/index.html` entry (same revision, ~KBs). 147→177 entries. Verified offline: /plays, /plays/, /plays/audible-33-red, /plays/audible-33-red/ all 200 with correct h1 under SW with network dead. Offline REFRESH on play pages now works.
- Debugging note: first build this morning silently failed (Ryan's mid-flight rename), so an earlier sw.js inspection read STALE output — always check generate exit before reading .output.
- Ryan renamed free-call.ts→audible.ts and REWROTE it (buildAudible generator, AudibleCall/AudibleExample types, audiblePlays export, play ids now audible-33-red etc.), updated index.ts himself. I only bridged one transient import-path break mid-refactor; his version won. No freeCall refs remain in app/. vue-tsc clean, 62 routes prerendered clean.
- STILL OPEN: print PDF re-verify at full-book size; Ryan's coaching rulings (grep reviewNotes); scratchpad capture.mjs play list still uses free-call-* ids (stale, harmless).

## 2026-08-10 (later still) — /audible page + one Audible card on /plays
- /plays: the three Free Call concept cards collapsed into ONE card, "Audible",
  whose single door opens /audible. Cards can now be either a concept (Red +
  Black doors) or a single door (`Concept.to`). The example plays stay in
  `playList`, so the print book and Know Your Job are unchanged.
- New page app/pages/audible.vue: formation toggle (Red/Black), front control,
  diagram, then UNDER the diagram a fieldset "Examples" with the three scanned
  calls (33 / 12 / 54) plus a "Call your own" button. Call-your-own opens a pad
  — protection segment + two 0-9 digit rows — and the diagram redraws live off
  `buildAudible()`. That is the practice loop Ryan asked for; nothing is
  stubbed.
- Extracted app/components/AssignmentPanel.vue out of pages/plays/[id].vue so
  the play page and /audible share the same eleven rows (and the diagram-tap →
  scroll-to-row behaviour) instead of duplicating ~120 lines.
- data/plays/audible.ts: `routeOn` now emits kind 'block' for a called 0 (a
  zero is not a two-yard route), and the wing's lateral stretch moved into a
  documented WING_WIDEN table — only the 2 (p16) and 4 (p18) are measured, the
  6/8/9 are estimates so an ad-hoc call still draws honestly. New review note
  flags those three estimates for Ryan.
- Coach's film notes render for the three examples only, not for made-up calls.
- vue-tsc clean (only the two pre-existing nuxt.config.ts errors), build clean,
  /plays /audible /plays/audible-33-red /plays/audible-54-black /quiz/know-your-job
  /print/book all 200.

## 2026-08-10 (later) — Self-study flashcards designed; Name That Play tracer live
- Mode designed as FOUR decks behind a picker at /quiz/flashcards (HANDOFF §5:
  guess-the-play + guess-the-formation live here): Name That Play (BUILT),
  Name That Formation, Route Numbers, What's My Job (flashcard cousin of KYJ —
  no options, say it out loud, flip). Engine contract: a deck is a shuffled
  card list that reshuffles + re-rolls fronts every lap and loops forever;
  tap-to-flip (3D flip, reduced-motion safe); rep counter only — nothing
  scored, nothing stored. Deck builders live in composables/useFlashcards.ts;
  the three unbuilt decks are visible picker tiles marked "Up next".
- Tracer (Name That Play): one card per play in playList (20, incl. DRAFT
  split-wide + audible examples — decodable calls are good drilling), random
  front per lap, front face = unlabeled PlayDiagram + "What's the call?",
  back = name/callName/family/formation/direction/description + "Study it"
  deep link to /plays/<id>?front=<front>. Quiz index tile flipped live.
- Verified: vue-tsc clean, generate clean (.nuxt-flash), headless drive
  (scratchpad flash-check.mjs, fresh puppeteer-core install): tile links,
  4 decks/1 live, no name leak on the front face, flip/next/skip, lap-2
  reshuffle, zero pageerrors. No screenshots per Ryan's directive.

## 2026-08-10 (later still) — All four flashcard decks live
- Ryan: "use 3 subagents one for each of the rest of the categories, and
  complete the rest of the flashcards." Three parallel subagents, one deck
  each, strict file ownership (own composable + own faces component, page and
  frozen files off-limits) so nothing collided; orchestrator refactored
  flashcards.vue into a deck-agnostic engine (DeckDef: build/relap/faces/
  studyLink; faces are two-root-fragment components rendering .face.front +
  .face.back inside the page's flip button) and extracted the tracer's faces
  to components/flashcards/PlayFaces.vue. NOTE nuxt.config has pathPrefix:
  false — components are PlayFaces/FormationFaces/RouteFaces/JobFaces, no dir
  prefix.
- Name That Formation (useFormationDeck.ts + FormationFaces.vue): 3 cards,
  one per formation — mirroring rejected as dishonest (Black IS mirrored Red);
  front is a dots-only SVG reusing diagram geometry/tokens (PlayDiagram would
  leak via position letters + front); back = name + hand-written recognition
  cue (data descriptions verified against formations.ts). No study link (no
  formation page exists).
- Route Numbers (useRouteDeck.ts + RouteFaces.vue): route tree already in
  app/data/routes.ts (varsity p14; 0 Block … 9 Fade) — nothing invented.
  20 cards = 10 routes × both directions (number→route and shape→number),
  relap guard keyed on route number so a flipped-direction repeat can't lead
  a new lap. Shapes drawn with shared SEAM parts, no number badge on fronts.
- What's My Job (useJobDeck.ts + JobFaces.vue): one card per play per lap
  (~20), random eligible position + front re-rolled every relap so the ~660
  combos accumulate across laps; answers via mergedAssignments (same source
  as KYJ); play name IS shown on the front (the mystery is the job); study
  link to /plays/<id>?front=<front>.
- Verified: nuxi typecheck clean in app code (only the two pre-existing
  nuxt.config.ts errors), generate clean (.nuxt-flash), flash-check.mjs
  extended to 27 assertions across all four decks — leak checks per deck
  (no play name / formation name / route name on fronts), lap wrap on 20- and
  3-card decks, study links present exactly where designed, both route
  directions appear, zero pageerrors. ALL PASS. Three checker-script bugs
  fixed along the way (ghost button absent while flipped; typographic
  apostrophes in titles; tap-hint Icon svg tripping the shape detector) —
  all script-side, not app bugs.

## 2026-08-14 — Direction/audible model landed on Veer (SUPERSEDES the 2026-08-13 callName wiring)

- Ryan's final ruling: direction is PLAY IDENTITY (Veer Right / Veer Left are
  two plays), formation (Red/Black) is ORTHOGONAL, and Indy/Hoosier are LINE
  AUDIBLES that flip direction (Indy = left, Hoosier = right) — e.g. "Red,
  Veer Right" + "INDY INDY" at the line = Veer Left out of Red. They are NOT
  play names: the 2026-08-13 callName wiring on veer was removed (crush's
  'Indy — Crush'/'Hoosier — Crush' callNames still carry the old model —
  STILL OPEN, migrate when crush gets the 2×2 treatment).
- Data (veer only, the pilot play): four plays veer-right-red /
  veer-right-black / veer-left-red / veer-left-black. veer-left-red is a NEWLY
  AUTHORED tight-end-side picture ("Indy out of Red", varsity p6 bottom
  panels) — Y+L both playside, R is the pitch man, X backside; every judgment
  call is in its reviewNotes and NEEDS RYAN'S CHECK. mirrorPlay derives the
  diagonal twins: Black-Left = mirror(Red-Right), Black-Right =
  mirror(Red-Left). Play gained optional formationTwinId / audibleFlipId;
  playbook.ts exports DIRECTION_AUDIBLES.
- UI: /plays/[id] shows Direction + Formation toggles (navigating the 2×2,
  preserving ?front) and an "At the line" AudibleCallout under the diagram
  (yelled word doubled, story line, "See the flip" link, Indy/Hoosier
  glossary); legacy 2-variant plays render exactly as before. /plays index:
  Veer card is a direction×formation matrix with an audible hint line. Print
  book labels two-way plays "Veer Right — Red" and page 2 teaches the
  audibles. Home quick-link and SEAM.md updated to the new ids/contract.
- STILL OPEN: Ryan to review veer-left-red's football (reviewNotes); other
  runs (crush, buck, stretch) still on the 2-play formation-paired model;
  print sheet 2 needs a visual glance (3 extra lines).

## 2026-08-14 — 2×2 model rolled out to ALL runs + Split Wide Dive direction pair

- Crush, Buck Sweep, and Stretch migrated to the Veer-shaped 2×2 (three
  parallel data agents, one per family; disjoint file ownership). Each family:
  left-red = the old hand-authored football verbatim (re-id'd, callName
  dropped — Crush's 'Indy — Crush'/'Hoosier — Crush' are GONE), right-red =
  NEWLY AUTHORED (Crush from role logic — no right-going scan; Buck from
  varsity p9's Buck Right panels; Stretch from p13's Stretch Right panel),
  right-black = mirror(left-red) (the old black football), left-black =
  mirror(right-red). All twin/flip links reciprocal; every new picture's
  judgment calls sit in reviewNotesRight headed "NEEDS COACH RYAN'S CHECK".
- Split Wide Dive (Ryan's follow-up ruling, same day): a 1×2, not 2×2 —
  split-wide-dive-right / split-wide-dive-left linked by audibleFlipId only
  (balanced set, mirror is exact football, zero hand corrections; left play
  is pure mirrorPlay). Keep/Screen/Chip stay one-way BY RULING ("the sneak
  doesn't need left and right, just the dive"). Direction-bearing prose
  neutralized to "playside" before mirroring.
- UI generalized for the one-axis shape: [id].vue hasVariantControls now
  keys off audibleFlipId alone (Formation toggle renders only when a
  formationTwinId exists), legacy name-match twin nav can't fire on plays
  with a flip; page titles and print-book labels skip the formation suffix
  when the play name already starts with it ("Split Wide Dive Right", not
  "… — Split Wide"); index door CSS class slugified (split-wide).
- Verified: full adversarial pass on the three runs ALL PASS (16 run plays,
  closed 4-cycles, byte-exact mirrors, complete 11-man coverage per front,
  correct INDY/HOOSIER yells on all 16 pages, 4 matrix cards, print book
  unique labels/pagination, quizzes clean); dive pair SSR-verified (Direction
  toggle only, right yells INDY / left yells HOOSIER, index matrix card with
  both doors, print labels). Typecheck: only the 3 pre-existing errors.
- STILL OPEN: Ryan to review the three new right-red pictures (reviewNotes)
  and the earlier veer-left-red; Split Wide Keep/Screen/Chip deliberately
  one-way (SUPERSEDED same day: Screen became a pair — see next entry);
  audible-page 'direction' means line-lean (Bull/Ram), NOT run
  direction — do not wire those into the flip graph.

## 2026-08-14 — Split Wide Screen direction pair + X/Y mirror bug fix

- Ryan revised the ruling: the Screen also gets left/right ("Screen also
  needs a left and right variant like the others"). Only Keep and Chip stay
  one-way now. split-wide-hb-screen → split-wide-screen-right (call Split
  Wide · Screen · Right) + new split-wide-screen-left, linked by
  audibleFlipId only (1×2, no formationTwinId). Left prose (description,
  all assignments, per-front overrides) hand-translated, not machine-flipped;
  Q's left detail flags the left-handed throw as its own practice rep.
- BUG FOUND AND FIXED while wiring it: `mirrorPlay` leaves X/Y keys put —
  right for Red⇄Black (the formation itself flips) but wrong for the
  balanced Split Wide set where Y stays wide left and X wide right. The
  shipped splitWideDiveLeft had Y: block C-R / X: block C-L (two cross-field
  corner blocks). New local `mirrorSplitWidePlay` (mirrorPlay + X↔Y entry
  exchange in assignments/actions/per-front overrides) now backs BOTH the
  dive-left and screen-left; dive-left verified Y→C-L, X→C-R both ways.
- Verified (SSR on 4667, then killed): both screen pages 200, old hb-screen
  id 404, right yells INDY / left yells HOOSIER (wrong-yell absent), titles
  "Screen Right · Split Wide", index Passes card shows both doors, print
  book carries per-front sheets for both directions, data-level trace of
  mirrored release paths/targets/links clean. Typecheck: only the 3
  pre-existing errors. Nothing committed.
- STILL OPEN: all Split Wide football remains behind the HANDOFF §10 review
  gate; the left screen additionally needs its own throwing reps ruling.
