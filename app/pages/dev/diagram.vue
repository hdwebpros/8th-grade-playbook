<script setup lang="ts">
/**
 * Diagram sandbox — /dev/diagram
 *
 * Everything here is a hand-written INLINE fixture conforming to
 * app/types/football.ts. It deliberately does NOT import from app/data so the
 * renderer can be verified independently of the data work.
 */
import { computed, ref } from 'vue'
import type {
  Action,
  Formation,
  Front,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
  RouteDef,
} from '~/types/football'
import PlayDiagram from '~/components/diagram/PlayDiagram.vue'
import RouteTreeDiagram from '~/components/diagram/RouteTreeDiagram.vue'

/* ------------------------------------------------------------------ */
/* Formation                                                           */
/* ------------------------------------------------------------------ */

const formation: Formation = {
  id: 'red',
  name: 'Red',
  description: 'Fixture formation — tight end and wing right, split end left.',
  players: [
    { pos: 'X', at: { x: -9, y: -0.2 } },
    { pos: 'LT', at: { x: -2.4, y: -1 } },
    { pos: 'LG', at: { x: -1.2, y: -1 } },
    { pos: 'C', at: { x: 0, y: -1 } },
    { pos: 'RG', at: { x: 1.2, y: -1 } },
    { pos: 'RT', at: { x: 2.4, y: -1 } },
    { pos: 'Y', at: { x: 3.8, y: -1 } },
    { pos: 'L', at: { x: -3.8, y: -2.4 } },
    { pos: 'R', at: { x: 5.2, y: -2.4 } },
    { pos: 'Q', at: { x: 0, y: -2.7 } },
    { pos: 'S', at: { x: 0, y: -5.6 } },
  ],
}

/* ------------------------------------------------------------------ */
/* Fronts                                                              */
/* ------------------------------------------------------------------ */

const fronts: Record<FrontId, Front> = {
  '44': {
    id: '44',
    name: '4-4',
    scheme: 'even',
    description: 'Four down, four backers. Nobody head-up on the center.',
    defenders: [
      { id: 'E-L', label: 'E', at: { x: -4.2, y: 1.2 } },
      { id: 'T-L', label: 'T', at: { x: -1.8, y: 1.2 } },
      { id: 'T-R', label: 'T', at: { x: 1.8, y: 1.2 } },
      { id: 'E-R', label: 'E', at: { x: 4.6, y: 1.2 } },
      { id: 'B-L', label: 'B', at: { x: -2.2, y: 4.6 } },
      { id: 'B-R', label: 'B', at: { x: 2.2, y: 4.6 } },
      { id: 'W', label: 'W', at: { x: -6.4, y: 3.8 } },
      { id: '$', label: '$', at: { x: 7.2, y: 3.8 } },
      { id: 'C-L', label: 'C', at: { x: -11, y: 6 } },
      { id: 'C-R', label: 'C', at: { x: 11, y: 6 } },
      { id: 'F', label: 'F', at: { x: 0.5, y: 9.5 } },
    ],
  },
  '43': {
    id: '43',
    name: '4-3',
    scheme: 'even',
    description: 'Four down, three backers, extra safety.',
    defenders: [
      { id: 'E-L', label: 'E', at: { x: -4.2, y: 1.2 } },
      { id: 'T-L', label: 'T', at: { x: -1.8, y: 1.2 } },
      { id: 'T-R', label: 'T', at: { x: 1.8, y: 1.2 } },
      { id: 'E-R', label: 'E', at: { x: 4.6, y: 1.2 } },
      { id: 'B-L', label: 'W', at: { x: -3.4, y: 4.6 } },
      { id: 'M', label: 'M', at: { x: 0, y: 4.8 } },
      { id: 'B-R', label: 'S', at: { x: 3.4, y: 4.6 } },
      { id: '$', label: '$', at: { x: 7, y: 7 } },
      { id: 'C-L', label: 'C', at: { x: -11, y: 6 } },
      { id: 'C-R', label: 'C', at: { x: 11, y: 6 } },
      { id: 'F', label: 'F', at: { x: -1, y: 10 } },
    ],
  },
  '52': {
    id: '52',
    name: '5-2',
    scheme: 'odd',
    description: 'Odd front — a nose right on the center, two backers.',
    defenders: [
      { id: 'E-L', label: 'E', at: { x: -5, y: 1.2 } },
      { id: 'T-L', label: 'T', at: { x: -2.6, y: 1.2 } },
      { id: 'N', label: 'N', at: { x: 0, y: 1.2 } },
      { id: 'T-R', label: 'T', at: { x: 2.6, y: 1.2 } },
      { id: 'E-R', label: 'E', at: { x: 5.2, y: 1.2 } },
      { id: 'B-L', label: 'B', at: { x: -1.6, y: 4.6 } },
      { id: 'B-R', label: 'B', at: { x: 1.6, y: 4.6 } },
      { id: '$', label: '$', at: { x: 7, y: 5.5 } },
      { id: 'C-L', label: 'C', at: { x: -11, y: 6 } },
      { id: 'C-R', label: 'C', at: { x: 11, y: 6 } },
      { id: 'F', label: 'F', at: { x: 0, y: 10 } },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* Play — exercises every ActionKind and both block styles              */
/* ------------------------------------------------------------------ */

interface Targets {
  edgeL: string
  insideL: string
  insideR: string
  backerR: string
  outsideR: string
}

function actionsFor(t: Targets): Partial<Record<OffPosId, Action[]>> {
  return {
    // post — a plain route
    X: [{ kind: 'route', path: [{ x: -9, y: 5 }, { x: -6.4, y: 10.5 }] }],
    // down block aimed at a defender id, no hand-authored path
    Y: [{ kind: 'block', targetId: t.backerR }],
    // motion across, then run the pitch relationship (chained)
    L: [
      { kind: 'motion', path: [{ x: -1.4, y: -2.6 }] },
      { kind: 'run', path: [{ x: 3.2, y: -3.4 }, { x: 7.6, y: -1.8 }] },
    ],
    // the dive — ball carrier
    R: [{ kind: 'carry', path: [{ x: 3.2, y: -1.4 }, { x: 2.6, y: 1.4 }, { x: 3.4, y: 6.5 }] }],
    // lead through the hole
    S: [{ kind: 'run', path: [{ x: 1.2, y: -2.6 }, { x: 2.2, y: 0.8 }] }],
    // fake the dive, ride down the line, pitch it (three chained actions)
    Q: [
      { kind: 'fake', path: [{ x: 1.6, y: -1.9 }] },
      { kind: 'run', path: [{ x: 3.8, y: -2.6 }, { x: 5.6, y: -1.4 }] },
      { kind: 'pitch', path: [{ x: 7.8, y: -2.2 }] },
    ],
    // pull and pick up the outside backer (run chained into a target block)
    LG: [
      { kind: 'run', path: [{ x: -0.4, y: -1.9 }, { x: 2.4, y: -1.7 }] },
      { kind: 'block', targetId: t.outsideR },
    ],
    C: [{ kind: 'block', targetId: t.insideL }],
    LT: [{ kind: 'block', targetId: t.edgeL }],
    RT: [{ kind: 'block', targetId: t.insideR }],
    // hand-authored block path — T-bar lands at the end of the path
    RG: [{ kind: 'block', path: [{ x: 1.6, y: 0.2 }, { x: 1.5, y: 2.4 }] }],
  }
}

const plan44: FrontPlan = {
  actions: actionsFor({
    edgeL: 'E-L',
    insideL: 'T-L',
    insideR: 'T-R',
    backerR: 'B-R',
    outsideR: '$',
  }),
  readKey: 'E-R',
}

const plan43: FrontPlan = {
  actions: actionsFor({
    edgeL: 'E-L',
    insideL: 'T-L',
    insideR: 'T-R',
    backerR: 'B-R',
    outsideR: '$',
  }),
  readKey: 'E-R',
}

const plan52: FrontPlan = {
  actions: actionsFor({
    edgeL: 'E-L',
    insideL: 'N',
    insideR: 'T-R',
    backerR: 'B-R',
    outsideR: '$',
  }),
  // exercises alignOverrides: tighten the wing against the odd front
  alignOverrides: { R: { x: 4.4, y: -2.2 } },
  readKey: 'E-R',
}

const assignment = (rule: string, detail?: string) => ({ rule, detail })

const play: Play = {
  id: 'fixture-veer-red',
  name: 'Veer',
  callName: 'Hoosier',
  family: 'run',
  formation: 'red',
  direction: 'right',
  ballCarrier: 'R',
  summary: 'Triple option that follows the guard. DE is key.',
  description: 'Fixture play — not real data. Exists to exercise the renderer.',
  assignments: {
    X: assignment('Run the post.', 'Sell it hard off the line.'),
    Y: assignment('Down block.', 'Inside hand first, work to the backer.'),
    L: assignment('Motion, then pitch phase.', 'Stay four yards off the QB.'),
    R: assignment('Dive. Ball carrier.', 'Aim at the outside hip of the guard.'),
    S: assignment('Lead through the hole.'),
    Q: assignment('Fake, ride, read, pitch.', 'Eyes on the end the whole way.'),
    C: assignment('Base the inside man.'),
    LG: assignment('Pull and kick out.'),
    RG: assignment('Base, work to backer.'),
    LT: assignment('Scoop the end.'),
    RT: assignment('Base the inside man.'),
  },
  vs: { '44': plan44, '43': plan43, '52': plan52 },
}

/* ------------------------------------------------------------------ */
/* Route tree                                                          */
/* ------------------------------------------------------------------ */

const route = (num: number, name: string, path: RouteDef['path']): RouteDef => ({
  num,
  name,
  path,
  description: `Fixture ${name}.`,
})

const routes: RouteDef[] = [
  route(0, 'Hitch', [{ x: 0, y: 5 }, { x: -0.9, y: 4.1 }]),
  route(1, 'Flat', [{ x: 1.8, y: 1.4 }, { x: 6.5, y: 2.6 }]),
  route(2, 'Slant', [{ x: 0, y: 2.2 }, { x: 4.6, y: 6.4 }]),
  route(3, 'Comeback', [{ x: 0, y: 11.5 }, { x: 2.8, y: 9.4 }]),
  route(4, 'Curl', [{ x: 0, y: 9.5 }, { x: -1.6, y: 8.1 }]),
  route(5, 'Out', [{ x: 0, y: 7.5 }, { x: 5.4, y: 8.2 }]),
  route(6, 'In', [{ x: 0, y: 7.5 }, { x: -5.4, y: 8.2 }]),
  route(7, 'Corner', [{ x: 0, y: 9 }, { x: 5.2, y: 15 }]),
  route(8, 'Post', [{ x: 0, y: 9 }, { x: -4.6, y: 15 }]),
  route(9, 'Go', [{ x: 0.3, y: 6 }, { x: 0, y: 17 }]),
]

const threeRoutes: RouteDef[] = [routes[2]!, routes[5]!, routes[8]!]

/* ------------------------------------------------------------------ */
/* Sandbox state                                                       */
/* ------------------------------------------------------------------ */

const front = ref<FrontId>('44')
const selected = ref<OffPosId | null>(null)
const selectedRoute = ref<number | null>(null)

const frontIds: FrontId[] = ['44', '43', '52']

const selectedAssignment = computed(() =>
  selected.value ? play.assignments[selected.value] : null,
)
</script>

<template>
  <div class="sandbox">
    <header>
      <h1>Diagram sandbox</h1>
      <p>
        Inline fixture data only — nothing here comes from <code>app/data</code>. Fixture play
        exercises every <code>ActionKind</code>, both block styles (targeted and hand-authored),
        chained actions, <code>alignOverrides</code> and a read key.
      </p>
    </header>

    <section>
      <h2>1 — PlayDiagram, app theme</h2>
      <div class="controls">
        <button
          v-for="f in frontIds"
          :key="f"
          type="button"
          :aria-pressed="front === f"
          :class="{ on: front === f }"
          @click="front = f"
        >
          {{ fronts[f].name }}
        </button>
      </div>
      <div class="stage stage--dark">
        <PlayDiagram :play="play" :front="front" :formation="formation" :fronts="fronts" />
      </div>
    </section>

    <section>
      <h2>2 — PlayDiagram, print theme</h2>
      <div class="stage stage--light">
        <PlayDiagram
          :play="play"
          :front="front"
          :formation="formation"
          :fronts="fronts"
          theme="print"
        />
      </div>
    </section>

    <section>
      <h2>3 — Highlight + interactive</h2>
      <p class="hint">
        Tap a player (or tab to one and press Enter). Everything else drops to 35%. Tap the field
        to clear. Assignment text renders here, outside the SVG — never inside it.
      </p>
      <div class="controls">
        <button type="button" @click="selected = null">Clear</button>
        <button type="button" @click="selected = 'R'">Highlight R (carrier)</button>
        <button type="button" @click="selected = 'LG'">Highlight LG (pull + block)</button>
        <button type="button" @click="selected = 'Q'">Highlight Q (fake/run/pitch)</button>
      </div>
      <div class="stage stage--dark">
        <PlayDiagram
          :play="play"
          :front="front"
          :formation="formation"
          :fronts="fronts"
          :highlight="selected"
          interactive
          @select="(pos) => (selected = pos)"
        />
      </div>
      <p class="readout">
        <strong>select:</strong> {{ selected ?? 'null' }}
        <template v-if="selectedAssignment"> — {{ selectedAssignment.rule }}</template>
        <template v-if="selectedAssignment?.detail">
          <em> {{ selectedAssignment.detail }}</em>
        </template>
      </p>
    </section>

    <section>
      <h2>4 — RouteTreeDiagram (ten routes)</h2>
      <p class="hint">Tap a route to highlight it. Tap the field to clear.</p>
      <div class="two-up">
        <div class="stage stage--dark">
          <RouteTreeDiagram
            :routes="routes"
            :highlight="selectedRoute"
            @select="(n) => (selectedRoute = n)"
          />
        </div>
        <div class="stage stage--light">
          <RouteTreeDiagram :routes="routes" :highlight="selectedRoute" theme="print" />
        </div>
      </div>
      <p class="readout"><strong>select:</strong> {{ selectedRoute ?? 'null' }}</p>
    </section>

    <section>
      <h2>5 — RouteTreeDiagram, three-route fixture</h2>
      <div class="stage stage--dark stage--narrow">
        <RouteTreeDiagram :routes="threeRoutes" :highlight="2" />
      </div>
    </section>

    <section>
      <h2>6 — Narrow column (375px phone check)</h2>
      <div class="stage stage--dark stage--phone">
        <PlayDiagram :play="play" :front="front" :formation="formation" :fronts="fronts" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.sandbox {
  max-width: 68rem;
  margin: 0 auto;
  padding: 2rem 1rem 6rem;
  font-family: system-ui, sans-serif;
  color: #e8eaed;
  background: #0b0d10;
}
h1 {
  font-size: 1.6rem;
  margin: 0 0 0.4rem;
}
h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a939e;
  margin: 0 0 0.6rem;
}
section {
  margin-top: 2.5rem;
}
p {
  color: #b9c0c8;
  line-height: 1.5;
  font-size: 0.9rem;
}
.hint {
  margin: 0 0 0.75rem;
}
.stage {
  border-radius: 10px;
  overflow: hidden;
  padding: 0;
}
.stage--dark {
  background: #10141a;
  border: 1px solid #232a33;
}
.stage--light {
  background: #fff;
  border: 1px solid #d8dce1;
}
.stage--phone {
  max-width: 375px;
}
.stage--narrow {
  max-width: 420px;
}
.two-up {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
@media (min-width: 720px) {
  .two-up {
    grid-template-columns: 1fr 1fr;
  }
}
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
button {
  font: inherit;
  font-size: 0.85rem;
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #232a33;
  background: #171c23;
  color: #e8eaed;
  cursor: pointer;
}
button.on {
  background: #d6202f;
  border-color: #d6202f;
}
.readout {
  margin-top: 0.6rem;
  font-size: 0.85rem;
}
code {
  color: #e8eaed;
}
</style>
