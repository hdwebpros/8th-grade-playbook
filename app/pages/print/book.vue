<script setup lang="ts">
/**
 * /print/book — the paper playbook.
 *
 * One route that renders the whole slice as a Letter-portrait document and
 * hands it to the browser's print-to-PDF. No backend, no PDF library: the
 * same data that draws the app draws the book, so they cannot drift.
 *
 * Every page is a fixed-size `.sheet`, so page breaks only ever land between
 * sheets — a row can never be split and a table header can never be
 * orphaned. Anything that can outgrow a sheet — the contents list, a play
 * whose eleven jobs run long — carries on to another one, measured rather
 * than guessed (see fitContents and fitTables).
 */
import type { Assignment, Front, FrontId, OffPosId, Play } from '~/types/football'
import { formations, fronts, playList, routes } from '~/data'
import {
  DIRECTION_AUDIBLES,
  FRONT_LABELS,
  FRONT_ORDER,
  POSITION_GROUPS,
  POSITION_NAMES,
  PLAY_SIDE_LABELS,
  mergedAssignments,
  playSideOf,
} from '~/utils/playbook'
import { labelForId } from '~/utils/defense'
import '~/assets/css/print-book.css'

definePageMeta({ layout: false, pageTransition: false })

useHead({
  title: 'Wolves Playbook — Printable Book',
  bodyAttrs: { class: 'print-book-body' },
  meta: [{ name: 'robots', content: 'noindex' }],
})

/* ---------------------------------------------------------------- */
/* Book order                                                        */
/* ---------------------------------------------------------------- */

/**
 * Assignment rows run full width in the app's own grouping (backs, ends,
 * line) with a rule between groups. Full width on purpose: a wide measure
 * costs far fewer lines than columns do — the side badge sits under the
 * position rather than in a column of its own for the same reason.
 */
const TABLE_ORDER: { pos: OffPosId; group: string; groupStart: boolean }[] =
  POSITION_GROUPS.flatMap((g) =>
    g.positions.map((pos, i) => ({ pos, group: g.label, groupStart: i === 0 })),
  )

/** The eleven, in the same grouping — the letters on the diagrams decoded. */
const roster = TABLE_ORDER.map(({ pos }) => ({ pos, name: POSITION_NAMES[pos] }))

const formationOrder = ['red', 'black'] as const
const bookFormations = formationOrder
  .map((id) => formations[id])
  .filter((f): f is NonNullable<typeof f> => Boolean(f))

/** Every play × every front, in book order: Red vs 4-4, 4-3, 5-2, then Black. */
interface Spread {
  key: string
  play: Play
  front: FrontId
  rows: Row[]
}

/**
 * Names that appear going BOTH ways (every run concept — Veer, Crush, Buck
 * Sweep, Stretch — is a direction × formation 2×2): "Veer Red" alone would
 * label two different pages, so every label for these plays carries the
 * direction too — "Veer Right — Red".
 */
const twoWayNames = new Set(
  playList
    .filter((p) => playList.some((q) => q.name === p.name && q.direction !== p.direction))
    .map((p) => p.name),
)

const directionLabel = (p: Play) => (p.direction === 'left' ? 'Left' : 'Right')

/**
 * Unambiguous short label: "Veer Right — Red" or plain "Waggle Red". Plays
 * whose name already starts with their formation ("Split Wide Screen") skip
 * the formation suffix instead of saying it twice.
 */
const playLabel = (p: Play) => {
  const formation = formations[p.formation]?.name ?? p.formation
  const named = p.name.startsWith(formation)
  if (twoWayNames.has(p.name)) {
    return named ? `${p.name} ${directionLabel(p)}` : `${p.name} ${directionLabel(p)} — ${formation}`
  }
  return named ? p.name : `${p.name} ${formation}`
}

const spreads: Spread[] = playList.flatMap((play) =>
  FRONT_ORDER.map((front) => ({
    key: `${play.id}-${front}`,
    play,
    front,
    rows: rowsFor(play, front),
  })),
)

/**
 * Spread key → how many of its rows fit on its own sheet. Filled in after
 * mount by fitTables; a spread that isn't listed fits whole.
 */
const fitRows = ref<Record<string, number>>({})

/** One printed page of a spread: its own sheet, or the continuation after it. */
interface PlaySheet extends Spread {
  sheetKey: string
  continued: boolean
  /** Rows carried over to the continuation sheet — set on the first sheet only. */
  rest: Row[]
}

const playSheets = computed(() =>
  spreads.flatMap((s): PlaySheet[] => {
    const fit = fitRows.value[s.key] ?? s.rows.length
    const rows = s.rows.slice(0, fit)
    const rest = s.rows.slice(fit)
    const first = { ...s, sheetKey: s.key, continued: false, rows, rest }
    if (!rest.length) return [first]
    return [first, { ...s, sheetKey: `${s.key}-more`, continued: true, rows: rest, rest: [] }]
  }),
)

/** Contents entries, each with the sheet it points at. */
const tocEntries = [
  { label: 'How to read a diagram', sheet: 'how-to-read' },
  { label: 'Formations — Red & Black', sheet: 'formations' },
  ...playList.map((p) => ({
    label: `${playLabel(p)} — vs all three fronts`,
    sheet: `${p.id}-${FRONT_ORDER[0]}`,
  })),
  { label: 'Route tree — 0 through 9', sheet: 'routes' },
]

/**
 * Entry index where each contents sheet after the first begins. Filled in
 * after mount by fitContents; empty means the list fits one sheet.
 */
const tocBreaks = ref<number[]>([])

const contentsSheets = computed(() => {
  const starts = [0, ...tocBreaks.value]
  return starts.map((start, i) => ({
    sheetKey: `contents-${i}`,
    start,
    continued: i > 0,
    entries: tocEntries.slice(start, starts[i + 1]),
  }))
})

/**
 * The book, sheet by sheet. A page number is a position in this list, so a
 * contents list that grows or a play that needs a continuation sheet pushes
 * everything after it along — no page number is written down by hand.
 */
const bookOrder = computed(() => [
  'cover',
  ...contentsSheets.value.map((c) => c.sheetKey),
  'how-to-read',
  'formations',
  ...playSheets.value.map((s) => s.sheetKey),
  'routes',
  'back',
])

const pageOf = (sheetKey: string) => bookOrder.value.indexOf(sheetKey) + 1
const totalPages = computed(() => bookOrder.value.length)

/* ---------------------------------------------------------------- */
/* Per-spread derived content                                        */
/* ---------------------------------------------------------------- */

interface Row {
  pos: OffPosId
  name: string
  group: string
  groupStart: boolean
  side: ReturnType<typeof playSideOf>
  assignment: Assignment
  carrier: boolean
}

function rowsFor(play: Play, front: FrontId): Row[] {
  const formation = formations[play.formation]!
  const merged = mergedAssignments(play, front)
  return TABLE_ORDER.map(({ pos, group, groupStart }) => ({
    pos,
    name: POSITION_NAMES[pos],
    group,
    groupStart,
    side: playSideOf(pos, play, formation, front),
    assignment: merged[pos] ?? { rule: '—' },
    carrier: play.ballCarrier === pos,
  }))
}

function readKeyFor(play: Play, front: FrontId): string | null {
  return labelForId(fronts[front], formations[play.formation], play.vs[front]?.readKey)
}

const formationName = (play: Play) => formations[play.formation]?.name ?? play.formation

/* ---------------------------------------------------------------- */
/* Formation-only diagrams                                           */
/* ---------------------------------------------------------------- */
/* PlayDiagram is the one renderer; to draw an alignment on its own we hand
   it a play with no actions and a front with no defenders. Nothing inside
   the diagram package changes — it just has nothing to draw but the huddle. */

const EMPTY_ASSIGNMENT: Assignment = { rule: '' }
const EMPTY_ASSIGNMENTS = Object.fromEntries(
  (Object.keys(POSITION_NAMES) as OffPosId[]).map((p) => [p, EMPTY_ASSIGNMENT]),
) as Record<OffPosId, Assignment>

const emptyFronts = Object.fromEntries(
  FRONT_ORDER.map((id): [FrontId, Front] => [
    id,
    { id, name: '', scheme: 'even', description: '', defenders: [] },
  ]),
) as Record<FrontId, Front>

function alignmentPlay(formationId: Play['formation']): Play {
  return {
    id: `align-${formationId}`,
    name: '',
    family: 'run',
    formation: formationId,
    direction: 'right',
    ballCarrier: 'Q',
    summary: '',
    description: '',
    assignments: EMPTY_ASSIGNMENTS,
    vs: Object.fromEntries(FRONT_ORDER.map((f) => [f, { actions: {} }])) as Play['vs'],
  }
}

/* ---------------------------------------------------------------- */
/* Fitting to the sheet                                              */
/* ---------------------------------------------------------------- */
/* How much fits on a sheet depends on how the text wraps, which only the
   browser knows — so measure the real layout once the fonts are in. A sheet
   is the same fixed width on screen and on paper, so what fits here fits in
   print, and the body ends a clear band above the running foot. */

/** Nothing on a sheet may end below its body's bottom edge. */
const floorOf = (sheet: Element) =>
  sheet.querySelector('.sheet-body')!.getBoundingClientRect().bottom

/** Index of the first contents entry that pokes out of its sheet, if any. */
function tocOverrun(): number | undefined {
  for (const sheet of document.querySelectorAll<HTMLElement>('[data-toc]')) {
    const floor = floorOf(sheet)
    const rows = [...sheet.querySelectorAll('.toc-row')]
    const crossing = rows.findIndex((r) => r.getBoundingClientRect().bottom > floor)
    if (crossing > 0) return Number(sheet.dataset.toc) + crossing
  }
  return undefined
}

/** The first entry that doesn't fit starts the next contents sheet, top down. */
async function fitContents() {
  for (;;) {
    const at = tocOverrun()
    if (at === undefined) return
    // Breaks after this one were measured against the old split — redo them.
    tocBreaks.value = [...tocBreaks.value.filter((b) => b < at), at]
    await nextTick()
  }
}

/* While the end of a play sheet's table (or its "continued" line) pokes out
   of the sheet body, rows move to the continuation sheet. */
async function fitTables() {
  for (;;) {
    const next = { ...fitRows.value }
    let moved = false
    for (const sheet of document.querySelectorAll<HTMLElement>('[data-fit]')) {
      const floor = floorOf(sheet)
      const rows = [...sheet.querySelectorAll('.assign tbody tr')]
      const end = sheet.querySelector('.assign-more') ?? rows.at(-1)
      if (!end || rows.length < 2 || end.getBoundingClientRect().bottom <= floor) continue
      // Jump straight to the first row that crosses; if only the "continued"
      // line does, make room for it by moving one more row.
      const crossing = rows.findIndex((r) => r.getBoundingClientRect().bottom > floor)
      next[sheet.dataset.fit!] = crossing === -1 ? rows.length - 1 : Math.max(crossing, 1)
      moved = true
    }
    if (!moved) return
    fitRows.value = next
    await nextTick()
  }
}

// Tables first: their continuation sheets settle the page numbers the
// contents list then prints.
onMounted(async () => {
  await document.fonts.ready
  await fitTables()
  await fitContents()
})

/* ---------------------------------------------------------------- */
/* Print affordance                                                  */
/* ---------------------------------------------------------------- */

function printBook() {
  window.print()
}
</script>

<template>
  <div class="book" data-diagram-theme="print">
    <!-- ===================== COVER ===================== -->
    <section class="sheet cover">
      <div class="cover-rule-top" />
      <div class="cover-main">
        <img src="/brand/wolves-mark.png" alt="Centennial Wolves" class="cover-mark" />
        <h1 class="cover-title">
          <span class="ct-1">Centennial</span>
          <span class="ct-2">Wolves</span>
          <span class="ct-3">8th Grade Football</span>
        </h1>
        <div class="cover-hair" />
        <p class="cover-sub">
          The playbook. Formations, Veer against every front we&rsquo;ll see, and the route tree
          &mdash; printed straight from the app, so paper and phone always say the same thing.
        </p>
      </div>
      <div class="cover-foot">
        <img src="/brand/centennial-school.png" alt="Centennial High School" class="cover-school" />
        <p class="cover-meta">Playbook &middot; {{ totalPages }} pages</p>
      </div>
      <div class="cover-rule-bottom" />
    </section>

    <!-- ===================== CONTENTS ===================== -->
    <!-- As many sheets as the list needs; fitContents decides where they break. -->
    <section v-for="c in contentsSheets" :key="c.sheetKey" class="sheet" :data-toc="c.start">
      <header class="sheet-head">
        <span class="sheet-head-book">Wolves<span class="hd-red"> Playbook</span></span>
        <span class="sheet-head-section">
          Contents<template v-if="c.continued"> &middot; continued</template>
        </span>
      </header>

      <div class="sheet-body">
        <p class="p-eyebrow">
          Contents<template v-if="c.continued"> &middot; continued</template>
        </p>
        <h2 v-if="!c.continued" class="p-title">What&rsquo;s in here</h2>
        <ul class="toc">
          <li v-for="e in c.entries" :key="e.label" class="toc-row">
            <span class="toc-label">{{ e.label }}</span>
            <span class="toc-dots" aria-hidden="true" />
            <span class="toc-page">{{ pageOf(e.sheet) }}</span>
          </li>
        </ul>
      </div>

      <footer class="sheet-foot">
        <span>Centennial Wolves &middot; 8th Grade</span>
        <span class="sheet-foot-num">{{ pageOf(c.sheetKey) }} / {{ totalPages }}</span>
      </footer>
    </section>

    <!-- ===================== HOW TO READ ===================== -->
    <section class="sheet">
      <header class="sheet-head">
        <span class="sheet-head-book">Wolves<span class="hd-red"> Playbook</span></span>
        <span class="sheet-head-section">How to read this book</span>
      </header>

      <div class="sheet-body">
        <p class="p-eyebrow">How to read this book</p>
        <h2 class="p-title">Reading a diagram</h2>
        <p class="p-lead">
          Offense is always at the bottom, going up. The thick line across the middle is the line of
          scrimmage. Defenders are bare letters &mdash; no circle around them.
        </p>

        <div class="legend-grid">
          <!-- Players -->
          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <circle cx="18" cy="15" r="11" fill="#fff" stroke="#111" stroke-width="2.5" />
              <text
                x="18"
                y="15"
                class="lg-glyph"
                text-anchor="middle"
                dominant-baseline="central"
              >
                T
              </text>
              <rect
                x="33"
                y="4"
                width="22"
                height="22"
                rx="2"
                fill="#fff"
                stroke="#111"
                stroke-width="2.5"
              />
              <text x="44" y="15" class="lg-glyph" text-anchor="middle" dominant-baseline="central">
                C
              </text>
            </svg>
            <div class="legend-text">
              <div class="lg-name">You</div>
              <div class="lg-desc">Circles are our eleven. The center is a square.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <circle cx="18" cy="15" r="11" fill="#d6202f" stroke="#111" stroke-width="2.5" />
              <text
                x="18"
                y="15"
                class="lg-glyph"
                fill="#fff"
                text-anchor="middle"
                dominant-baseline="central"
              >
                S
              </text>
              <circle cx="44" cy="15" r="11" fill="#fff" stroke="#111" stroke-width="2.5" />
              <circle cx="44" cy="15" r="7.5" fill="none" stroke="#111" stroke-width="1.5" />
              <text x="44" y="15" class="lg-glyph" text-anchor="middle" dominant-baseline="central">
                Q
              </text>
            </svg>
            <div class="legend-text">
              <div class="lg-name">Ball carrier &amp; QB</div>
              <div class="lg-desc">Red is who has the ball. The double ring is the quarterback.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <text
                x="14"
                y="15"
                class="lg-glyph"
                fill="#555"
                text-anchor="middle"
                dominant-baseline="central"
              >
                E
              </text>
              <text
                x="34"
                y="15"
                class="lg-glyph"
                fill="#555"
                text-anchor="middle"
                dominant-baseline="central"
              >
                N
              </text>
              <text
                x="54"
                y="15"
                class="lg-glyph"
                fill="#555"
                text-anchor="middle"
                dominant-baseline="central"
              >
                B
              </text>
            </svg>
            <div class="legend-text">
              <div class="lg-name">Them</div>
              <div class="lg-desc">Grey letters, no circle. E T N B W S C F $.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <circle
                cx="18"
                cy="15"
                r="10"
                fill="none"
                stroke="#d6202f"
                stroke-width="2"
                stroke-dasharray="4 3"
              />
              <text
                x="18"
                y="15"
                class="lg-glyph"
                fill="#555"
                text-anchor="middle"
                dominant-baseline="central"
              >
                E
              </text>
              <text x="46" y="15" class="lg-cap" fill="#d6202f" text-anchor="middle">READ</text>
            </svg>
            <div class="legend-text">
              <div class="lg-name">The read</div>
              <div class="lg-desc">Dashed red ring: this is the man the QB reads.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <circle
                cx="18"
                cy="15"
                r="9"
                fill="none"
                stroke="#555"
                stroke-width="1.5"
                stroke-dasharray="3 4"
              />
              <text
                x="18"
                y="15"
                class="lg-glyph"
                fill="#555"
                text-anchor="middle"
                dominant-baseline="central"
              >
                W
              </text>
            </svg>
            <div class="legend-text">
              <div class="lg-name">Leave him</div>
              <div class="lg-desc">Dashed grey ring: nobody blocks him on purpose — the play handles him.</div>
            </div>
          </div>

          <!-- Lines -->
          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <path d="M4 24 C 20 24, 26 8, 46 8" fill="none" stroke="#d6202f" stroke-width="3.5" />
              <polygon points="56,8 46,12.5 46,3.5" fill="#d6202f" />
            </svg>
            <div class="legend-text">
              <div class="lg-name">Ball path</div>
              <div class="lg-desc">Thick red: where the football goes.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <path d="M4 24 C 20 24, 26 8, 44 8" fill="none" stroke="#111" stroke-width="2.25" />
              <line x1="44" y1="1" x2="44" y2="15" stroke="#111" stroke-width="2.25" />
            </svg>
            <div class="legend-text">
              <div class="lg-name">Block</div>
              <div class="lg-desc">Line ending in a T-bar: block that man.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <path d="M4 22 C 20 22, 26 8, 46 8" fill="none" stroke="#111" stroke-width="2.25" />
              <polygon points="56,8 46,12 46,4" fill="#111" />
            </svg>
            <div class="legend-text">
              <div class="lg-name">Run &amp; route</div>
              <div class="lg-desc">Plain arrow: run there, or run that route.</div>
            </div>
          </div>

          <div class="legend-item">
            <svg class="legend-swatch" viewBox="0 0 62 30" aria-hidden="true">
              <path
                d="M4 20 C 20 20, 26 10, 56 10"
                fill="none"
                stroke="#111"
                stroke-width="2.25"
                stroke-dasharray="6 4"
              />
            </svg>
            <div class="legend-text">
              <div class="lg-name">Motion</div>
              <div class="lg-desc">Dashed: move before the snap, then keep going.</div>
            </div>
          </div>
        </div>

        <h3 class="section-label">Play side &amp; away side</h3>
        <p class="p-lead">
          Every assignment table says whether you&rsquo;re on the <b>play side</b> (the way the
          play is going) or the <b>away side</b> (the other side of the ball). Same thing the
          varsity book calls playside/backside (PSG, BST) &mdash; you just get your own name and a
          badge instead of a code.
        </p>

        <h3 class="section-label">At the line</h3>
        <p class="p-lead">
          Two words can flip a run before the snap: <b>{{ DIRECTION_AUDIBLES.left }}</b> sends it
          left, <b>{{ DIRECTION_AUDIBLES.right }}</b> sends it right. Same play, same jobs &mdash;
          mirrored.
        </p>

        <h3 class="section-label">Who&rsquo;s who</h3>
        <div class="roster">
          <div v-for="r in roster" :key="r.pos" class="roster-item">
            <span class="roster-pos">{{ r.pos }}</span>
            <span class="roster-name">{{ r.name }}</span>
          </div>
        </div>
      </div>

      <footer class="sheet-foot">
        <span>Centennial Wolves &middot; 8th Grade</span>
        <span class="sheet-foot-num">{{ pageOf('how-to-read') }} / {{ totalPages }}</span>
      </footer>
    </section>

    <!-- ===================== FORMATIONS ===================== -->
    <section class="sheet">
      <header class="sheet-head">
        <span class="sheet-head-book">Wolves<span class="hd-red"> Playbook</span></span>
        <span class="sheet-head-section">Formations</span>
      </header>

      <div class="sheet-body">
        <p class="p-eyebrow">Line up right</p>
        <h2 class="p-title">Formations</h2>
        <p class="p-lead">
          Two sets. Same eleven jobs, mirrored. Know where you stand before you know what you do.
        </p>

        <div v-for="f in bookFormations" :key="f.id" class="formation-block" style="margin-top: 12pt">
          <div class="formation-head">
            <h3 class="formation-name">{{ f.name }}</h3>
            <span class="formation-tag" :class="{ 'is-red': f.id === 'red' }">{{ f.name }}</span>
          </div>
          <p class="formation-desc">{{ f.description }}</p>
          <div class="dg-frame">
            <PlayDiagram
              :play="alignmentPlay(f.id)"
              front="44"
              :formation="f"
              :fronts="emptyFronts"
              theme="print"
            />
          </div>
        </div>
      </div>

      <footer class="sheet-foot">
        <span>Centennial Wolves &middot; 8th Grade</span>
        <span class="sheet-foot-num">{{ pageOf('formations') }} / {{ totalPages }}</span>
      </footer>
    </section>

    <!-- ============ EVERY PLAY × EVERY FRONT ============ -->
    <!-- A spread whose jobs overrun its sheet carries on to a second one: same
         head, same table header, the rows that didn't fit — never a split row. -->
    <section
      v-for="s in playSheets"
      :key="s.sheetKey"
      class="sheet play-sheet"
      :class="{ 'is-split': s.rest.length }"
      :data-fit="s.continued ? undefined : s.key"
    >
      <header class="sheet-head">
        <span class="sheet-head-book">Wolves<span class="hd-red"> Playbook</span></span>
        <span class="sheet-head-section">
          {{ playLabel(s.play) }} &middot; vs {{ FRONT_LABELS[s.front] }}
          <template v-if="s.continued"> &middot; continued</template>
        </span>
      </header>

      <div class="sheet-body">
        <div class="play-head">
          <div>
            <h2 class="play-title">
              {{ s.play.name }}
              <span class="pt-dir">
                <template v-if="twoWayNames.has(s.play.name)">{{ directionLabel(s.play) }} &middot; </template>{{ formationName(s.play) }}
              </span>
            </h2>
            <p v-if="s.continued" class="play-sub">
              Continued from page {{ pageOf(s.key) }} &middot; the rest of the jobs
            </p>
            <p v-else class="play-sub">
              <template v-if="s.play.callName">{{ s.play.callName }} &middot; </template>
              Going {{ s.play.direction }} &middot; Ball carrier:
              {{ POSITION_NAMES[s.play.ballCarrier] }}
              <template v-if="readKeyFor(s.play, s.front)">
                &middot; <b class="read-flag">Read the {{ readKeyFor(s.play, s.front) }}</b>
              </template>
            </p>
          </div>
          <div class="front-chip">
            <span class="fc-vs">Versus</span>
            <span class="fc-name">{{ FRONT_LABELS[s.front] }}</span>
          </div>
        </div>

        <p v-if="!s.continued" class="play-desc">{{ s.play.description }}</p>

        <div v-if="!s.continued" class="play-band">
          <div class="dg-frame play-diagram">
            <PlayDiagram
              :play="s.play"
              :front="s.front"
              :formation="formations[s.play.formation]!"
              :fronts="fronts"
              theme="print"
            />
          </div>

          <aside class="scout">
            <h3 class="scout-title">The {{ FRONT_LABELS[s.front] }}</h3>
            <p class="scout-body">{{ fronts[s.front]?.description }}</p>

            <div v-if="readKeyFor(s.play, s.front)" class="scout-read">
              <span class="scout-read-cap">Read key</span>
              <span class="scout-read-key">{{ readKeyFor(s.play, s.front) }}</span>
              <span class="scout-body">
                He decides it. Sits: give the dive. Takes the dive: pull it and get vertical.
              </span>
            </div>

            <div class="scout-foot">
              <span class="scout-read-cap">Formation</span>
              <span class="scout-body">{{ formations[s.play.formation]?.name }}</span>
            </div>
          </aside>
        </div>

        <table class="assign">
          <thead>
            <tr>
              <th class="col-pos" scope="col">Position</th>
              <th scope="col">Your job vs the {{ FRONT_LABELS[s.front] }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in s.rows"
              :key="r.pos"
              :class="{ 'is-carrier': r.carrier, 'is-group-start': r.groupStart }"
            >
              <td>
                <span class="a-pos">{{ r.pos }}</span>
                <span class="a-name">{{ r.name }}</span>
                <span
                  v-if="r.side"
                  class="side-badge"
                  :class="{ 'is-playside': r.side === 'playside' }"
                >
                  {{ PLAY_SIDE_LABELS[r.side] }}
                </span>
              </td>
              <td>
                <span class="a-rule">{{ r.assignment.rule }}</span>
                <span v-if="r.assignment.detail" class="a-detail"> {{ r.assignment.detail }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="s.rest.length" class="assign-more">
          Continued on page {{ pageOf(s.key) + 1 }}: {{ s.rest.map((r) => r.pos).join(', ') }}
        </p>
      </div>

      <footer class="sheet-foot">
        <span>
          {{ playLabel(s.play) }} vs {{ FRONT_LABELS[s.front] }}
          <template v-if="s.continued"> &middot; continued</template>
        </span>
        <span class="sheet-foot-num">{{ pageOf(s.sheetKey) }} / {{ totalPages }}</span>
      </footer>
    </section>

    <!-- ===================== ROUTE TREE ===================== -->
    <section class="sheet">
      <header class="sheet-head">
        <span class="sheet-head-book">Wolves<span class="hd-red"> Playbook</span></span>
        <span class="sheet-head-section">Route tree</span>
      </header>

      <div class="sheet-body">
        <p class="p-eyebrow">Reference</p>
        <h2 class="p-title">Route Tree</h2>
        <p class="p-lead" style="margin-bottom: 10pt">
          Ten routes, numbered 0 to 9. Learn the numbers and you can run any call in the book.
        </p>

        <div class="routes-layout">
          <div class="dg-frame">
            <RouteTreeDiagram :routes="routes" theme="print" />
          </div>
          <div>
            <div class="route-list">
              <div
                v-for="r in routes"
                :key="r.num"
                class="route-row"
                :class="{ 'is-zero': r.num === 0 }"
              >
                <span class="route-num">{{ r.num }}</span>
                <div>
                  <div class="route-name">{{ r.name }}</div>
                  <div class="route-desc">{{ r.description }}</div>
                </div>
              </div>
            </div>
            <p class="freecall">
              <b>Free call:</b> combos are read outside&#8209;to&#8209;in. <b>54</b> means the outside
              man runs the 5 (curl) and the next man in runs the 4 (wheel).
            </p>
          </div>
        </div>
      </div>

      <footer class="sheet-foot">
        <span>Centennial Wolves &middot; 8th Grade</span>
        <span class="sheet-foot-num">{{ pageOf('routes') }} / {{ totalPages }}</span>
      </footer>
    </section>

    <!-- ===================== BACK ===================== -->
    <section class="sheet backpage">
      <div class="sheet-body">
        <img src="/brand/wolves-mark.png" alt="Centennial Wolves" class="back-mark" />
        <div class="back-line" />
        <h2 class="p-title" style="font-size: 20pt">Know your job</h2>
        <p class="p-lead" style="text-align: center; max-width: 40ch">
          Eleven guys doing exactly their job beats eleven guys guessing. Learn your assignment on
          every front, then help the guy next to you learn his.
        </p>
        <img src="/brand/centennial-school.png" alt="Centennial High School" class="back-school" />
        <p class="cover-meta">Wolves 8th grade feeds Centennial High School football</p>
      </div>
    </section>

    <!-- Screen-only affordance -->
    <div class="print-bar">
      <span class="print-bar-text">{{ totalPages }}-page book, ready</span>
      <NuxtLink to="/export" class="print-bar-back">Back</NuxtLink>
      <button type="button" class="print-bar-btn" @click="printBook">
        <Icon name="lucide:printer" aria-hidden="true" />
        Print / Save as PDF
      </button>
    </div>
  </div>
</template>

<style>
/* Legend glyph type — the swatch SVGs are hand-drawn here, not diagram internals. */
.legend-swatch .lg-glyph {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;
  fill: #111;
}
.legend-swatch .lg-cap {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 0.1em;
}
</style>
