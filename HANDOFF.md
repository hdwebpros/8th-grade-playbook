# Handoff — Centennial Wolves 8th Grade Football Playbook

**To:** Fable, as orchestrator.
**Your subagents:** `fable` for anything anyone will look at. `opus` for everything underneath it.
**From:** a scoping session with Ryan (the human). Every football decision below is his and is settled. Every design decision below is deliberately absent and is yours.

---

## 1. What this is

A Nuxt app that is the 8th grade football playbook for Centennial High School's feeder program. It does three things:

1. **Shows the playbook** — formations, plays, blocking assignments, route tree, pass protection.
2. **Exports it** — a full-book PDF, generated from the app's own data, that a kid or a parent can print.
3. **Tests it** — three quiz modes, described in §5.

The audience is 13 and 14 year olds on phones, their parents, and their coaches. A player should be able to open this on the bus, on a field with no signal, and figure out what his job is on Veer.

## 2. The one thing that matters most

There is an existing varsity playbook at `/home/ryan/Downloads/Written - Youth Playbook.pdf`. **Ryan's exact words: "The playbook for varsity sucks. Do NOT use it as the gold standard."**

It is the source of truth for *football* — who lines up where, who blocks whom, what the assignments say, what the route tree is. It is a **floor to beat** for everything else. It is 19 pages of Konica copier scans: no text layer, no vectors, landscape pages rotated sideways, assignment tables in 7pt type. Beating it is not a high bar and you should clear it by a wide margin.

Do not imitate its layout. Do not reuse its images in the product.

## 3. Brand inputs

All vendored into `reference/brand/` — nothing here depends on a CDN or a path outside the repo.

- **Team logo** — `reference/brand/wolves-team-logo.png`. Wolf mark, red/black/white, reads `CENTENNIAL` with a `'26`. Transparent PNG, 2528×1692. This is the highest-fidelity asset you have.
- **School logo** — `reference/brand/centennial-school-logo.png`. 1200×226, the largest the school's CDN serves. It's a wide horizontal lockup; there is no square or stacked variant available.
- **Inspiration** — `reference/brand/cougar-football-inspiration.jpg`. 1200×675, the school's own Cougar Football art that Ryan pointed at. Inspiration only, not an asset to ship.
- **Name:** Centennial Wolves 8th Grade Football. The `'26` on the mark stays; Ryan confirmed the logo is used as-is.

These live in `reference/` rather than `public/` or `app/assets/` on purpose — moving them into the app is your call, and `public/` vs `assets/` is a real decision (processed and optimized vs. served untouched) that shouldn't be made by whoever downloads a file.

That is the entirety of the brand direction. There is no palette, no type scale, no layout spec, no component inventory in this document, and that is on purpose — see §7.

## 4. The football package — settled, do not improvise

**Formations:** Red, Black, Split Wide. Nothing else. (Varsity's Twins/Bunch/Over/Batman/Trips/Robin/Tight sets are all cut.)

**Runs** — each mirrored Red and Black (left and right):
| Play | Source |
| --- | --- |
| Veer (Indy/Hoosier) | varsity p5 (+ vs-front variants p6). **Ryan: "our bread and butter."** |
| Crush | varsity p7, `INDY/HOOSIER – CRUSH`, outside veer |
| Buck Sweep | varsity p8 (+ variants p9) |
| Stretch | varsity p11 (+ variants p12) |

**Split Wide runs** — *these do not exist in any playbook; Ryan made them up.* Drafted from his words, verbatim:
- *"a play where the halfback goes in motion to the right, and it's a QB keeper over the right guard B gap"*
- *"standard hb dive, all receivers stop the crash to the middle"*

**Passing:**
| Concept | Notes |
| --- | --- |
| Waggle | varsity p19. **Ryan: "our play action bread and butter."** |
| Free-call | The varsity numeric system, kept. See below. |
| Split Wide HB screen | HB goes in motion, HB screen. *Made up — draft it.* |
| Split Wide chip | HB chip blocks; receivers left→right run **curl, post, post, go**. *Made up — draft it.* |

**Free-call:** varsity's route tree (`0 block, 1 slant, 2 speed out, 3 hitch, 4 wheel, 5 curl, 6 comeback, 7 post, 8 corner, 9 fade`) with combos called outside-to-in on the WR side — `Red Sprint Rt 54` = WR curl, Wing wheel. Ryan keeps the system but wants it thinned: *"not as many example crazy plays, just show a few and how they work."* Teach the mechanism with a handful of examples, don't dump the varsity combo pages.

**Route tree:** the ten routes, presented as a reference. Ryan explicitly declined a situational layer — **no coverage rules, no down-and-distance, no hash logic.** Just the tree.

**Pass protection:** Ram / Bull, taught and shown. (Varsity p15: `RAM = slide right, BULL = slide left, Super off the hip of the tackle away. DEFEND YOUR GAP.`)

**Defensive fronts:** every play gets **its own drawn diagram against 4-4, 4-3, and 5-2.** Not adjustment notes — actual separate diagrams. This is the single largest driver of scope in the build: roughly 6 run concepts and 4 pass concepts, × 2 directions, × 3 fronts, lands near **60 diagrams** for the full book. Plan the data model and the authoring loop around that number from day one.

**Call system:** a simplified version of varsity's — same structure and same words where they matter, fewer tags, no option-read modifiers. These kids feed into that program and should recognize the language when they get there.

## 5. Quiz — three modes, all of them

1. **Self-study flashcards** — unlimited attempts, instant reveal, nothing scored. Drilling on the bus.
2. **Know-your-job** — pick your position, get asked only what *you* do. "You're the Y on Rocket — what's your assignment?"
3. **Coach-run / projected** — a coach drives it on a screen in a team meeting. Show the formation, kids call it out, reveal.

Both "guess the formation" and "guess the play" live inside these modes.

## 6. Hard technical constraints

- **Nuxt.** Ryan asked for it by name.
- **No backend. No database. No accounts. No login. Nothing is stored about anyone.** Quiz state is browser-local and disposable. This is a deliberate decision to keep data about minors out of the picture entirely — do not add a backend, an analytics call, or a score-reporting feature, and do not ask for a name field.
- **Static host, works offline once loaded.** Free tier (Vercel / Netlify / Cloudflare Pages), installable to a phone home screen, fully functional with no signal — diagrams, quiz, everything.
- **Diagrams render from structured data, not images.** This is non-negotiable and it is *why* the quiz, the position filtering, and a clean PDF are possible at all. Cropped scans are not acceptable output.
- **Full-book PDF generated from that same data**, so the app and the printout can never drift.
- Extracting the varsity content into that data is **Opus work, not Fable work.** It is 19 pages of vision, transcription, and precision — reading alignments off scans and typing assignment tables correctly. Fable's job begins once the data is real.

## 7. What is explicitly yours

Ryan's instruction, close to verbatim: *don't box Fable in — let it decide and create magical things on its own.*

So: **no design or layout decisions have been made anywhere in this document, and none should be inferred from the varsity book.** How a play diagram looks and animates, how a phone-sized page is laid out, how the quiz feels, how the brand is expressed, how positions and assignments are labeled for a 13-year-old, what the PDF looks like on paper, navigation, motion, the whole visual language — yours.

One flag on labeling specifically. Ryan chose "let Fable decide" on whether assignments read as plain labels (`LT, RG, TE, QB`) or varsity's playside/backside system (`PST, PSG, BSG, Y, X, Q, S`) or both. That is yours as a *presentation* call — but the underlying football must stay correct either way. Don't let a relabeling change what a kid is being told to do.

## 8. Scope of this handoff: vertical slice first

Ryan chose to prove the hard part before 60 diagrams get authored. **Do not build the whole book yet.**

Ship:
- Full design language and app shell — this part is complete, not a mockup. It's what Ryan is judging.
- **Veer (Indy/Hoosier) only**, Red and Black, against all three fronts. Six diagrams, drawn from data.
- The route tree page.
- One quiz mode, your pick, working end to end.
- PDF export working over that slice.

The point is to find out whether the diagram rendering and the design actually hold up before anyone authors the other ~54 diagrams. The made-up Split Wide plays are **out of this slice** — they need Ryan's eyes on the football before they reach a kid, and that review happens after the slice lands.

## 8a. Current state of the repo

Scaffolded already, verified building. Nothing else exists yet.

- **Nuxt 4.5.2**, `minimal` template, npm, Nuxt 4 `app/` directory structure. Node 24.15.
- **`@nuxt/icon` 2.4.1** and **`@nuxt/fonts` 0.14.0** registered in `nuxt.config.ts`.
- `npm run generate` produces `.output/public` cleanly — the static-host constraint in §6 is confirmed working, not assumed.
- Git initialized on `main`, **no commits yet**.

Two deliberate omissions, both because they are design calls that belong to you:

- **The `minimal` template was chosen over `ui`.** Installing Nuxt UI would have picked the design system for you. That door is open.
- **No Iconify collection is installed.** `@nuxt/icon` is wired up but has no icon set; pick one and add it (`npm i -D @iconify-json/<collection>`). Likewise `@nuxt/fonts` is zero-config and does nothing until a `font-family` is declared in CSS — the font is yours to choose.

## 9. Suggested division of labor

Yours to restructure, but the seams that matter:

- **`opus`** — Nuxt app, data model and schema for plays/formations/fronts/assignments, transcription of the varsity scans into that data, diagram rendering engine, quiz logic, PDF pipeline, offline/PWA, deploy.
- **`fable`** — the entire visual and interaction language: brand system from the two logos, diagram visual design, page and component layout, quiz experience, PDF design, motion.

The one coupling to get right early: **the diagram data schema and the diagram's visual design have to be negotiated together.** If Opus freezes a schema before Fable knows what it wants to draw, the design gets constrained by an arbitrary data shape — which is exactly the failure mode that produced the varsity book. Settle that seam first.

## 10. Open items — Ryan answers these at slice review

- The two made-up **Split Wide runs** and two made-up **Split Wide passes** get drafted by agents from his one-line descriptions, then **Ryan reviews and corrects the football before they ship.** Hard gate. A wrong assignment here reaches a 13-year-old.
- *"All receivers stop the crash to the middle"* needs Ryan to confirm the intent (crack blocks on crashing edge defenders vs. something else) before that play is final.
- Which quiz mode leads, once he's seen one working.

---

*Source material lives in `reference/varsity/` — `varsity-playbook.pdf` plus `page-01.jpg` … `page-19.jpg`, pre-rendered at 150 DPI so no subagent has to re-run `pdftoppm`. Read the JPEGs directly. Note pages 6, 7, 9, 12, 15, 16, 18 are landscape and scanned sideways. Page map — 1 Red/Black · 2 formation variations · 3 Robin · 4 0TE/2TE incl. **Split Wide** · 5–6 Veer · 7 Veer variations incl. **Crush** · 8–9 Buck Sweep · 10 Jet · 11–12 Stretch · 13 Rocket · 14 **Route Tree** · 15 **Pass Pro Ram/Bull** · 16 Dropback · 17–18 Sprint · 19 **PAP/Waggle**.*
